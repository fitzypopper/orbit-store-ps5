// Settings as a page (Crossbar, Cinema and Panorama): the same panels as
// Store's App settings, Sources, Storage and Pairing dialogs, grouped into
// sections. Store keeps its dialogs.
import { useEffect, useRef, useState, type ReactNode } from "react";
import type { SourceSettings, System } from "../types";
import { languages, savedLanguage, t, tn } from "../i18n";
import { interfaces, useInterfacePrefs } from "./choice";
import { Appearance } from "./Appearance";
import { LanguageSetting } from "../LanguageSetting";
import { CatalogueUpdates } from "../CatalogueUpdates";
import { Updates } from "../Updates";
import { TvApp } from "../TvApp";
import { Debrid } from "../Debrid";
import { Diagnostics } from "../Diagnostics";
import { PayloadManagers, StartAutomatically, useAutoStart } from "../AutoStart";
import { Icon } from "../components";
import { Glyph } from "./Glyph";
import {
  matchesSettings,
  settingsGroups,
  settingsSections,
  type SettingsSection,
} from "../settingsMeta";

// The section list itself lives in settingsMeta, shared with Store's dialog.
export { settingsGroups, settingsSections };
export type { SettingsSection };

export function SettingsPage({
  section,
  choose,
  system,
  sources,
  storage,
  pairing,
  updateAvailable,
  sourceSettings,
}: {
  section: SettingsSection;
  choose: (section: SettingsSection) => void;
  system: System | null;
  sources: ReactNode;
  storage: ReactNode;
  pairing: ReactNode;
  updateAvailable: boolean;
  sourceSettings: SourceSettings | null;
}) {
  const auto = useAutoStart();
  const { prefs } = useInterfacePrefs();
  // Each section's current value, where the page already knows it.
  const language = savedLanguage();
  const values: Partial<Record<SettingsSection, string>> = {
    appearance: t(interfaces.find((i) => i.name === prefs.name)?.title || ""),
    ...(sourceSettings
      ? {
          sources: sourceSettings.options
            .filter((o) => sourceSettings.enabled.includes(o.id))
            .map((o) => o.label)
            .join(", "),
        }
      : {}),
    language: language ? languages.find((l) => l.code === language)?.name || "" : t("Automatic"),
    ...(system?.paired && system.concurrentDownloads
      ? { storage: tn(system.concurrentDownloads, "{count} at a time", "{count} at a time") }
      : {}),
    ...(system?.catalogueRevision ? { catalogue: t("Catalogue {revision}", { revision: system.catalogueRevision }) } : {}),
    ...(system?.version ? { updates: system.version } : {}),
  };
  // Stopping Orbit for an update leaves only Updates usable, as in App settings.
  const [stopped, setStopped] = useState(false);
  const [query, setQuery] = useState("");
  const visibleGroups = settingsGroups
    .map((g) => ({ ...g, sections: g.sections.filter((s) => matchesSettings(query, s)) }))
    .filter((g) => g.sections.length > 0);
  const visibleKey = visibleGroups.flatMap((g) => g.sections.map((s) => s.id)).join(" ");
  const current = settingsSections.find((s) => s.id === section) || settingsSections[0];
  // Typing can hide the open section's entry: follow the first match instead
  // of leaving a nav with nothing marked current.
  useEffect(() => {
    if (!query.trim() || !visibleKey) return;
    const ids = visibleKey.split(" ") as SettingsSection[];
    if (!ids.includes(current.id)) choose(ids[0]);
  }, [query, visibleKey, current.id, choose]);
  // Panorama's pivots run off the page: keep the chosen one in view.
  const nav = useRef<HTMLElement>(null);
  useEffect(() => {
    nav.current?.querySelector('[aria-current="page"]')?.scrollIntoView({ block: "nearest", inline: "nearest" });
  }, [current.id]);
  // A newly chosen section opens at its top: a long one before it may have
  // left the page scrolled past where the next one starts.
  const panel = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = panel.current;
    let box = el?.parentElement;
    while (box && !(box.scrollHeight > box.clientHeight && /auto|scroll/.test(getComputedStyle(box).overflowY))) box = box.parentElement;
    if (!el || !box) return;
    const above = el.getBoundingClientRect().top - box.getBoundingClientRect().top;
    if (above < 0) box.scrollTop += above;
  }, [current.id]);
  const content: Record<SettingsSection, ReactNode> = {
    appearance: <Appearance page />,
    language: <LanguageSetting />,
    sources,
    storage,
    pair: pairing,
    catalogue: <CatalogueUpdates />,
    updates: <Updates onStopped={() => setStopped(true)} />,
    tvapp: <TvApp />,
    torbox: <Debrid />,
    payload: (
      <>
        <PayloadManagers system={system} auto={auto} />
        {auto.error && (
          <p className="form-error" role="alert">
            {auto.error}
          </p>
        )}
      </>
    ),
    autostart: (
      <>
        <StartAutomatically auto={auto} />
        {!auto.status?.available && auto.status && (
          <p className="notice">{t("Manager integration is set up from Orbit on your PS5.")}</p>
        )}
        {auto.error && (
          <p className="form-error" role="alert">
            {auto.error}
          </p>
        )}
      </>
    ),
    diagnostics: <Diagnostics />,
  };
  return (
    <section className="settings-page" aria-label={t("Settings")}>
      <nav className="settings-sections" ref={nav} aria-label={t("Settings sections")}>
        <label className="search-field settings-search">
          <Icon name="search" />
          <input
            type="search"
            placeholder={t("Search settings")}
            aria-label={t("Search settings")}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </label>
        {visibleGroups.length === 0 && (
          <p className="notice" role="status">
            {t("No settings match")}
          </p>
        )}
        {visibleGroups.map((group) => (
          <div className={`settings-group${group.sections.some((s) => s.id === current.id) ? " current" : ""}`} key={group.label}>
            <p className="settings-group-label">{t(group.label)}</p>
            {group.sections.map((s) => (
              <button
                key={s.id}
                className="settings-section"
                aria-current={s.id === current.id ? "page" : undefined}
                disabled={stopped && s.id !== "updates"}
                onClick={() => choose(s.id)}
              >
                <span className="settings-section-icon">
                  <Glyph name={s.glyph} size={18} />
                </span>
                <span className="settings-section-label">{s.label === "TorBox" ? s.label : t(s.label)}</span>
                {values[s.id] && <span className="settings-section-value">{values[s.id]}</span>}
                {s.id === "updates" && updateAvailable && (
                  <i className="nav-dot" role="img" aria-label={t("Update available")} />
                )}
              </button>
            ))}
          </div>
        ))}
      </nav>
      <div ref={panel} className={`settings-panel settings-panel-${current.id}`} key={current.id}>
        {/* The other panels open with their own heading. */}
        {current.id === "storage" && <h1 className="settings-title">{t(current.label)}</h1>}
        {stopped && current.id !== "updates" ? content.updates : content[current.id]}
      </div>
    </section>
  );
}
