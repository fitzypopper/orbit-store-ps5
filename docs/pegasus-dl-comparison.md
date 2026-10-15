# Pegasus DL comparison — backlog notes

Research from comparing [pegasus-dl](https://github.com/pegasus-ps5/pegasus-dl) v1.11.0
(367★, PS5 download manager) against Orbit Store 1.3.0.

**Licence note:** pegasus-dl ships no LICENSE file. We may reimplement its *ideas*
in Orbit's GPL-3.0 codebase but must never copy its code.

## What Pegasus does better

| Area | Pegasus approach | Orbit status |
| --- | --- | --- |
| Catalogue | Modular URL sources: user adds/removes catalog JSON URLs (evoX-CoreOS, DLPS, Pippo .exFAT, PFS, ZER0GAME) | Single encrypted catalogue blob, 3 fixed sources |
| Providers | Built-in resolvers for BuzzHeavier, DataNodes, MediaFire; guarded browser capture for unknown hosts; embedded nanoDNS 0.4 | Archive.org, Vikingfile, AkiraBox — users report ad/redirect failures (upstream issues #73, #76, #78) |
| Debrid | Real-Debrid **and** TorBox | TorBox only (upstream issue #44 requests RD) |
| Downloads | 16 connections default, persistent connections, direct byte-range writes, checkpoint resume | 1–8 connections (upstream issue #31 asks for speed) |
| Archive cache | Completed caches survive password prompts and wrong passwords; resume from checkpoints | Retry keeps archive, but no checkpoint resume |
| File management | Full file manager tab: browse, upload, copy, move, delete, install .pkg from file list | Not present |
| Emulation | APR Emu detect/update/reinstall via fakelib/libSceAmpr.sprx patching | Not present |
| DNS | nanoDNS embedded, autostarts for browser capture | Not present |

## Deferred work (backend / C — needs PS5 hardware to verify)

These are frontend-out-of-scope; they live in `backend/*.c` and require the
Docker payload build plus a real console smoke test.

1. **Modular catalogue sources** — settings UI + backend loader for user-supplied
   catalog URLs merged with the built-in catalogue. Pegasus schema reference:
   `schemaVersion`, `revision`, `sources[].{id,name,url,defaultEnabled}`.
2. **New provider resolvers** — BuzzHeavier, DataNodes, MediaFire direct
   resolution in `backend/providers.c`.
3. **Real-Debrid** — extend `backend/debrid.c` (currently TorBox only).
4. **Guarded unknown-host capture** — validate response before queueing, with
   nanoDNS-style DNS interception for browser-assisted flows.
5. **Parallel engine improvements** — persistent connections, byte-range direct
   writes, checkpoint resume in `backend/transfer.c`.
6. **File manager tab** — new backend endpoints + React tab.
7. **APR Emu management** — Library integration for update/reinstall.

## Useful for frontend work now

- Provider-step UX: Pegasus names each provider state explicitly
  ("built-in resolver", "browser capture", "debrid") — adopt clearer step
  labels in Orbit's download-options modal (Phase 4 of the fork plan).
- Catalog source *display*: even without backend support, showing source
  provenance per download link improves trust.
