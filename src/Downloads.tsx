import { useEffect, useMemo, useRef, useState } from "react";
import { Icon, Modal } from "./components";
import { Button, ProgressBar, Sparkline, StatusBadge } from "./components/ui";
import { Artwork } from "./Artwork";
import {
  bytes,
  formatLabel,
  type Game,
  type Job,
  type Storage,
} from "./types";
import { formatNumber, placeName, t, tn } from "./i18n";
import { useInterfacePrefs } from "./interfaces/choice";
import { CinemaDownloads } from "./interfaces/CinemaDownloads";
import { CrossbarDownloads } from "./interfaces/CrossbarDownloads";
import { PanoramaDownloads } from "./interfaces/PanoramaDownloads";
import {
  inactive,
  progressOf,
  running,
  statusLabels,
  transferTiming,
  waiting,
  type DownloadView,
} from "./jobs";
import { tokens } from "./tokens";

// Pipeline stages: queued → downloading → verifying → inspecting → extracting → complete
const PIPELINE_STAGES: Array<{ id: Job["status"]; label: string }> = [
  { id: "queued", label: /* i18n */ "Queued" },
  { id: "downloading", label: /* i18n */ "Downloading" },
  { id: "verifying", label: /* i18n */ "Verifying" },
  { id: "inspecting", label: /* i18n */ "Inspecting" },
  { id: "extracting", label: /* i18n */ "Extracting" },
  { id: "complete", label: /* i18n */ "Complete" },
];

function PipelineStages({
  status,
  extracting,
  deliveryPhase,
}: {
  status: Job["status"];
  extracting: boolean;
  deliveryPhase?: string;
}) {
  const idx = PIPELINE_STAGES.findIndex((s) => s.id === status);
  const activeIdx = extracting ? 4 : idx; // extracting replaces verifying/inspecting visually
  return (
    <div
      className="pipeline-stages"
      role="list"
      aria-label={t("Download stages")}
      style={{
        display: "flex",
        gap: tokens.space.inline,
        marginBottom: tokens.space.inline,
        overflowX: "auto",
      }}
    >
      {PIPELINE_STAGES.map((stage, i) => {
        const isDone = i < activeIdx;
        const isCurrent = i === activeIdx;
        const isError = status === "error" && i <= idx;
        const isCancelled = status === "cancelled" && i <= idx;
        return (
          <div
            key={stage.id}
            className={`pipeline-stage ${isDone ? "done" : ""} ${isCurrent ? "current" : ""} ${isError ? "error" : ""} ${isCancelled ? "cancelled" : ""}`}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "2px",
              minWidth: "60px",
              flex: "1 0 auto",
            }}
          >
            <div
              style={{
                width: "24px",
                height: "24px",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: isCurrent || isError || isCancelled ? `2px solid ${tokens.color.text.primary}` : "2px solid transparent",
                backgroundColor: isDone
                  ? tokens.color.status.success
                  : isCurrent || isError || isCancelled
                    ? tokens.color.background.primary
                    : "rgba(255,255,255,0.12)",
                color: isDone ? tokens.color.status.successText : tokens.color.text.tertiary,
                fontSize: tokens.fontSize.caption.xs,
                fontWeight: tokens.fontWeight.semiBold,
                transition: "all 200ms ease",
              }}
            >
              {isDone && <Icon name="check" />}
            </div>
            <span
              style={{
                fontSize: tokens.fontSize.caption.xs,
                color: isCurrent ? tokens.color.text.primary : tokens.color.text.quaternary,
                whiteSpace: "nowrap",
                fontWeight: isCurrent ? tokens.fontWeight.medium : tokens.fontWeight.normal,
              }}
            >
              {t(stage.label)}
            </span>
          </div>
        );
      })}
    </div>
  );
}

export function Downloads({
  jobs,
  games,
  drives,
  action,
  clearHistory,
  browse,
  targetId,
  openLibrary,
  concurrent,
}: {
  jobs: Job[];
  games: Game[];
  drives: Storage[];
  action: (id: string, name: string, remove?: boolean, password?: string) => Promise<void>;
  clearHistory: (status: "complete" | "cancelled") => Promise<void>;
  browse: () => void;
  targetId: string | null;
  // Finished downloads can open their game in Library (Cinema, Crossbar, Panorama).
  openLibrary?: (job: Job) => void;
  // How many downloads run at once (Panorama's live tile).
  concurrent?: number;
}) {
  const iface = useInterfacePrefs().prefs.name;
  const [view, setView] = useState<DownloadView>("Active");
  const [error, setError] = useState(""),
    [busy, setBusy] = useState("");
  const [cancel, setCancel] = useState<Job | null>(null),
    [clear, setClear] = useState(false);
  const [forget, setForget] = useState(false);
  const [message, setMessage] = useState("");
  const [passwordJob, setPasswordJob] = useState<Job | null>(null);
  const [archivePassword, setArchivePassword] = useState("");
  // Speed history for sparklines (max 30 points = ~60s at 2s poll)
  const speedHistory = useRef<Map<string, number[]>>(new Map());
  useEffect(() => {
    const next = new Map<string, number[]>();
    for (const job of jobs) {
      if (job.speed > 0 && running(job)) {
        const prev = speedHistory.current.get(job.id) || [];
        next.set(job.id, [...prev.slice(-29), job.speed]);
      }
    }
    speedHistory.current = next;
  }, [jobs]);
  async function retryExtraction() {
    if (!passwordJob || !archivePassword) return;
    setBusy(passwordJob.id); setError("");
    try {
      await action(passwordJob.id, "archive-password", false, archivePassword);
      setArchivePassword(""); setPasswordJob(null);
    } catch (e) { setError((e as Error).message); }
    finally { setBusy(""); }
  }
  const targetStatus = jobs.find((j) => j.id === targetId)?.status;
  useEffect(() => {
    if (targetId && targetStatus)
      setView(
        targetStatus === "complete"
          ? "Finished"
          : targetStatus === "cancelled"
            ? "Cancelled"
            : targetStatus === "error"
              ? "Failed"
              : "Active",
      );
  }, [targetId, targetStatus]);
  useEffect(() => {
    if (!targetId) return;
    const row = [...document.querySelectorAll<HTMLElement>("[data-job]")].find(
      (el) => el.dataset.job === targetId,
    );
    row?.scrollIntoView({ block: "center" });
    row
      ?.querySelector<HTMLButtonElement>("button")
      ?.focus({ preventScroll: true });
  }, [targetId, view]);
  const gameByRelease = useMemo(
    () =>
      new Map(games.flatMap((g) => g.releases.map((r) => [r.id, g] as const))),
    [games],
  );
  const groups = {
    Active: jobs.filter((j) => !inactive(j) && j.status !== "error"),
    Finished: jobs.filter((j) => j.status === "complete"),
    Failed: jobs.filter((j) => j.status === "error"),
    Cancelled: jobs.filter((j) => j.status === "cancelled"),
  };
  const queued = jobs.filter(waiting);
  function restoreFocus() {
    requestAnimationFrame(() => {
      if (document.activeElement === document.body)
        document
          .querySelector<HTMLButtonElement>(
            ".download-tabs [aria-pressed=true]",
          )
          ?.focus();
    });
  }
  async function run(job: Job, name: string, remove = false) {
    setBusy(job.id);
    setError("");
    setMessage("");
    try {
      await action(job.id, name, remove);
      setCancel(null);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy("");
      restoreFocus();
    }
  }
  async function clearSelectedHistory() {
    setBusy("history");
    setError("");
    try {
      await clearHistory(view === "Cancelled" ? "cancelled" : "complete");
      setClear(false);
      setMessage(
        view === "Cancelled"
          ? t(
              "Cancelled history cleared. Kept partial files and disconnected downloads stay listed so you can recover them.",
            )
          : t(
              "Finished history cleared. Your downloaded files stay on the drive.",
            ),
      );
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy("");
      restoreFocus();
    }
  }
  // The dialogs every layout shares: archive password, cancel or delete, clear history.
  const dialogs = (
    <>
      {passwordJob && <Modal title={t("Enter archive password")} close={() => { if (!busy) { setPasswordJob(null); setArchivePassword(""); } }}>
        <form className="archive-password-form" onSubmit={e => { e.preventDefault(); void retryExtraction(); }}>
          <h2>{t("Enter archive password")}</h2>
          <p>{t("Retry extraction using the downloaded archive. Nothing will be downloaded again.")}</p>
          <label>{t("Archive password")}<input type="password" autoComplete="off" data-initial-focus autoFocus maxLength={128}
            value={archivePassword} onChange={e => setArchivePassword(e.target.value)} disabled={!!busy} /></label>
          {error && <p role="alert">{t(error)}</p>}
          <div className="actions"><button className="primary" type="submit" disabled={!!busy || !archivePassword}>{t("Retry extraction")}</button>
            <button type="button" disabled={!!busy} onClick={() => { setPasswordJob(null); setArchivePassword(""); }}>{t("Cancel")}</button></div>
        </form>
      </Modal>}
      {cancel && (
        <Modal
          title={
            cancel.status === "cancelled"
              ? t("Delete download")
              : t("Cancel download")
          }
          close={() => !busy && setCancel(null)}
        >
          <h2>
            {cancel.status === "cancelled"
              ? forget
                ? t("Remove from history?")
                : t("Delete this cancelled download?")
              : t("Cancel this download?")}
          </h2>
          <p>
            {cancel.status === "cancelled"
              ? forget
                ? t(
                    "Only the history entry will be removed. Any partial file stays on its drive and must be deleted before downloading there again.",
                  )
                : t(
                    "Delete the partial file and remove this entry. If the file is already gone, the entry will still be removed. Completed files are kept.",
                  )
              : t(
                  "Keep the partial file to resume later, or delete only the partial file. Downloaded files are never deleted through history cleanup.",
                )}
          </p>
          {error && (
            <p className="job-error" role="alert">
              {t(error)}
            </p>
          )}
          <div className="dialog-actions">
            {cancel.status === "cancelled" ? (
              <>
                <button
                  className="danger"
                  disabled={!!busy}
                  onClick={() => void run(cancel, forget ? "forget" : "delete")}
                >
                  {forget ? t("Remove from history") : t("Delete download")}
                </button>
                {!forget && (
                  <button
                    disabled={!!busy}
                    onClick={() => {
                      setForget(true);
                      setError("");
                    }}
                  >
                    {t("Remove from history")}
                  </button>
                )}
              </>
            ) : (
              <>
                <button
                  onClick={() => void run(cancel, "cancel")}
                  disabled={!!busy}
                >
                  {t("Keep partial file")}
                </button>
                <button
                  className="danger"
                  onClick={() => void run(cancel, "cancel", true)}
                  disabled={!!busy}
                >
                  {t("Delete partial file")}
                </button>
              </>
            )}
            <button disabled={!!busy} onClick={() => setCancel(null)}>
              {t("Go back")}
            </button>
          </div>
        </Modal>
      )}
      {clear && (
        <Modal
          title={
            view === "Cancelled"
              ? t("Clear cancelled history")
              : t("Clear finished history")
          }
          close={() => !busy && setClear(false)}
        >
          <h2>
            {view === "Cancelled"
              ? t("Clear cancelled history?")
              : t("Clear finished history?")}
          </h2>
          <p>
            {view === "Cancelled"
              ? t(
                  "Remove cancelled entries with no partial file. Kept partials stay listed for recovery.",
                )
              : t(
                  "Remove completed entries from history. Your downloaded files stay on the drive.",
                )}
          </p>
          <div className="dialog-actions">
            <button
              className="primary"
              disabled={!!busy}
              onClick={() => void clearSelectedHistory()}
            >
              {t("Clear history")}
            </button>
            <button disabled={!!busy} onClick={() => setClear(false)}>
              {t("Keep history")}
            </button>
          </div>
        </Modal>
      )}
    </>
  );
  if (iface === "crossbar")
    return (
      <CrossbarDownloads
        groups={groups}
        queued={queued}
        view={view}
        setView={(v) => {
          setView(v);
          setMessage("");
        }}
        targetId={targetId}
        gameByRelease={gameByRelease}
        drives={drives}
        busy={busy}
        error={error}
        message={message}
        run={run}
        cancel={(job) => {
          setForget(false);
          setError("");
          setCancel(job);
        }}
        password={(job) => {
          setArchivePassword("");
          setError("");
          setPasswordJob(job);
        }}
        clear={() => setClear(true)}
        browse={browse}
        openLibrary={openLibrary}
        dialogs={dialogs}
      />
    );
  if (iface === "panorama")
    return (
      <PanoramaDownloads
        groups={groups}
        queued={queued}
        targetId={targetId}
        gameByRelease={gameByRelease}
        drives={drives}
        concurrent={concurrent}
        busy={busy}
        error={error}
        message={message}
        run={run}
        cancel={(job) => {
          setForget(false);
          setError("");
          setCancel(job);
        }}
        password={(job) => {
          setArchivePassword("");
          setError("");
          setPasswordJob(job);
        }}
        clear={(v) => {
          // The clear dialog and its request follow the view.
          setView(v);
          setClear(true);
        }}
        browse={browse}
        openLibrary={openLibrary}
        dialogs={dialogs}
      />
    );
  if (iface === "cinema")
    return (
      <CinemaDownloads
        jobs={jobs}
        groups={groups}
        queued={queued}
        view={view}
        setView={(v) => {
          setView(v);
          setMessage("");
        }}
        targetId={targetId}
        gameByRelease={gameByRelease}
        drives={drives}
        busy={busy}
        error={error}
        message={message}
        run={run}
        cancel={(job) => {
          setForget(false);
          setError("");
          setCancel(job);
        }}
        password={(job) => {
          setArchivePassword("");
          setError("");
          setPasswordJob(job);
        }}
        clear={() => setClear(true)}
        browse={browse}
        openLibrary={openLibrary}
        dialogs={dialogs}
      />
    );
  return (
    <section className="page downloads">
      <div className="page-heading">
        <h1>{t("Downloads")}</h1>
        <p>
          {tn(groups.Active.length, "{count} active", "{count} active")} ·{" "}
          {tn(
            groups.Failed.length,
            "{count} needs attention",
            "{count} need attention",
          )}
        </p>
      </div>
      <div className="download-toolbar">
        <div
          className="download-tabs"
          role="group"
          aria-label={t("Download views")}
        >
          {(
            [
              /* i18n */ "Active",
              /* i18n */ "Finished",
              /* i18n */ "Failed",
              /* i18n */ "Cancelled",
            ] as const
          ).map((v) => (
            <button
              key={v}
              aria-pressed={view === v}
              onClick={() => {
                setView(v);
                setMessage("");
              }}
            >
              {t(v)} <span>{groups[v].length}</span>
            </button>
          ))}
        </div>
        {(view === "Finished" || view === "Cancelled") &&
          groups[view].length > 0 && (
            <button disabled={!!busy} onClick={() => setClear(true)}>
              {view === "Cancelled"
                ? t("Clear cancelled history")
                : t("Clear finished history")}
            </button>
          )}
      </div>
      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}
      {message && (
        <p className="notice" role="status">
          {message}
        </p>
      )}
      {!groups[view].length ? (
        <div className="empty compact">
          <Icon name={view === "Finished" ? "check" : "download"} />
          <h2>
            {view === "Active"
              ? t("Nothing in progress")
              : view === "Failed"
                ? t("No failed downloads")
                : view === "Cancelled"
                  ? t("No cancelled downloads")
                  : t("No finished downloads")}
          </h2>
          <p>
            {view === "Active"
              ? t("Choose a game to add it to your queue.")
              : view === "Failed"
                ? t("Downloads that need your attention appear here.")
                : view === "Cancelled"
                  ? t(
                      "Cancelled downloads appear here. Kept partial files can be resumed.",
                    )
                  : t("Successfully completed downloads appear here.")}
          </p>
          <button className="primary" onClick={browse}>
            {t("Browse games")}
          </button>
        </div>
      ) : (
        <div className="queue">
          {groups[view].map((j) => {
            const g = gameByRelease.get(j.releaseId),
              r = g?.releases.find((r) => r.id === j.releaseId);
            const title = g?.title || j.title || j.filename;
            const active = running(j);
            const { extracting, done, total, percent } = progressOf(j);
            const position = queued.findIndex((q) => q.id === j.id);
            const drive = drives.find((d) => d.id === j.storageId);
            return (
              <article
                className="queue-row"
                key={j.id}
                data-job={j.id}
                aria-label={title}
              >
                <Artwork
                  key={g?.cover || "/orbit.svg"}
                  src={g?.cover || "/orbit.svg"}
                  fallbackSrc={g?.coverFallback}
                  className={g ? undefined : "queue-placeholder"}
                  alt=""
                  decoding="async"
                  referrerPolicy="no-referrer"
                />
                <div className="queue-info">
                  <div className="queue-title">
                    <h2>{title}</h2>
                    <StatusBadge status={j.status} label={t(statusLabels[j.status] || j.status)} />
                  </div>
                  <p>
                    {r && `${r.provider} · ${formatLabel(r)} · `}
                    {j.delivery === "torbox" && `${t("via TorBox")} · `}
                    {drive ? placeName(drive.label) : j.storageId}
                    {!drive && j.status !== "complete"
                      ? ` · ${t("Reconnect this drive")}`
                      : ""}
                  </p>
                  <PipelineStages
                    status={j.status}
                    extracting={extracting}
                    deliveryPhase={j.deliveryPhase}
                  />
                  <ProgressBar
                    value={percent}
                    max={100}
                    label
                    status={extracting ? t("Extracting") : undefined}
                    color={j.status === "error" ? "error" : j.status === "complete" ? "success" : "default"}
                    size="md"
                    aria-label={t("{title} progress", { title })}
                  />
                  <div className="transfer-meta">
                    <span>
                      {extracting && `${t("Extracting")} · `}
                      {bytes(done)} / {bytes(total)} ·{" "}
                      {formatNumber(percent / 100, {
                        style: "percent",
                        minimumFractionDigits: 1,
                        maximumFractionDigits: 1,
                      })}
                    </span>
                    <span>
                      {speedHistory.current.get(j.id) && (
                        <Sparkline
                          data={speedHistory.current.get(j.id)!}
                          color={j.speed > 0 ? tokens.color.status.info : tokens.color.text.quaternary}
                          width={100}
                          height={18}
                          style={{ marginRight: tokens.space.inline }}
                        />
                      )}
                      {transferTiming(
                        j,
                        done,
                        total,
                        j.status === "complete"
                          ? j.verification === "sha256"
                            ? t("SHA-256 verified")
                            : t("Size verified")
                          : t("{size} remaining", {
                              size: bytes(Math.max(0, j.total - j.received)),
                            }),
                      )}
                    </span>
                  </div>
                  {j.deliveryPhase &&
                    ["queued", "downloading"].includes(j.status) && (
                      <p className="fine">{t(j.deliveryPhase)}</p>
                    )}
                  {j.error && <p className="job-error">{t(j.error)}</p>}
                  {j.status === "cancelled" && j.received > 0 && (
                    <p className="fine">
                      {t(
                        "Partial file kept. Resume it, or delete the partial file before removing this entry.",
                      )}
                    </p>
                  )}
                  {j.status === "complete" && j.path && (
                    <p className="download-location">
                      <span>{t("Location")}</span>
                      <code dir="ltr">{j.path}</code>
                    </p>
                  )}
                  <div className="queue-actions">
                    {j.canEnterArchivePassword && <button disabled={!!busy || !drive} onClick={() => {
                      setArchivePassword(""); setError(""); setPasswordJob(j);
                    }}>{t("Enter archive password")}</button>}
                    {j.status !== "complete" ? (
                      <>
                        <button
                          disabled={!!busy || (!active && !drive)}
                          onClick={() =>
                            void run(
                              j,
                              active
                                ? "pause"
                                : j.status === "error"
                                  ? "retry"
                                  : "resume",
                            )
                          }
                        >
                          {active
                            ? t("Pause")
                            : j.status === "error"
                              ? t("Retry download")
                              : j.status === "cancelled" && !j.received
                                ? t("Start again")
                                : t("Resume")}
                        </button>
                        <button
                          disabled={!!busy}
                          onClick={() => {
                            setForget(false);
                            setError("");
                            setCancel(j);
                          }}
                        >
                          {j.status === "cancelled"
                            ? t("Delete download")
                            : t("Cancel")}
                        </button>
                      </>
                    ) : null}
                    {j.canRefreshLink && (
                      <button disabled={!!busy} onClick={() => void run(j, "refresh-link")}>
                        {t("Refresh download link")}
                      </button>
                    )}
                    {waiting(j) && (
                      <div
                        className="queue-order"
                        role="group"
                        aria-label={t("Queue position for {title}", { title })}
                      >
                        <Button
                          variant="ghost"
                          size="sm"
                          disabled={!!busy || position <= 0}
                          aria-label={t("Move {title} up", { title })}
                          onClick={() => void run(j, "move-up")}
                        >
                          <Icon name="chevron" />
                          {t("Move up")}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          disabled={!!busy || position === queued.length - 1}
                          aria-label={t("Move {title} down", { title })}
                          onClick={() => void run(j, "move-down")}
                        >
                          {t("Move down")}
                          <Icon name="chevron" />
                        </Button>
                      </div>
                    )}
                    {inactive(j) &&
                      (j.status === "complete" || j.received === 0) && (
                        <button
                          disabled={!!busy}
                          onClick={() => void run(j, "remove")}
                        >
                          {t("Remove from history")}
                        </button>
                      )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
      {dialogs}
    </section>
  );
}
