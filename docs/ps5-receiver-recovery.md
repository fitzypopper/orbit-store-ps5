# PS5 receiver recovery: `other-client` and queued-drive space errors

Diagnostics for two separate failures that stacked on one queued download
(GTA V, `PPSA04263`, Vikingfile, route `computer`) on 2026-10-15.
Console ran Orbit Store **1.3.5**, desktop companion Orbit Zero **1.3.5**.

Both were resolved with the computer `.cache` intact — no re-download.

---

## Symptom 1 — pairing wedge

```
PS5 transfer paused. The computer download is continuing. The PS5 transfer
belongs to a different pairing. Stop it in the app that started it.
```

### Cause

The PS5 keeps a receiver journal at `<state_dir>/receive.json`
(`state_dir = /data/orbit-store`, `main.c`). Each record carries an
`owner` field: the sha256 hex of the 64-char pairing token that began
the transfer (`api.c`, `EVP_Digest(auth + 7, 64, ...)`).

A stale record from **Oct 14** — EA SPORTS FC 2027 (`PPSA34015`),
paused at 16.9 GB — was still present, owned by an **older** pairing
token. Once the user re-paired, Orbit Zero presented a *newer* token,
so `receive_status()` mismatched and answered `{"state":"other-client"}`
for **every** receive call, for any game (`receive.c`).

Live A/B proof:

| Token presented | `/api/v1/receive` reply |
|---|---|
| the old owner token | full real record (FC 2027, `ready`) |
| the current token | `{"state":"other-client"}` |

Why the usual advice failed:

- **Re-pairing makes it worse** — `POST /api/v1/pair` mints a fresh token
  and appends it, so the owner hash moves further from the journal's.
- **Rebooting does not help** — `receive_start()` reloads `receive.json`
  at every boot, normalizing any non-terminal state to `ready`.
- **The local queue stamp is not involved.** Orbit Zero's
  `job.consoleIdentity` check produces a *different* message
  ("Reconnect the original paired console…"). Seeing the
  `other-client` text proves that local check already passed, so
  editing `queue.json`'s `consoleIdentity` would not have fixed this.

### Fix

1. Read `state.json` over FTP to recover the token list. Old tokens stay
   authorized (`tokens[]`, max 16, persisted), so the record's owner
   token was still usable.
2. `POST /api/v1/receive/abandon` with the **owner** token → record
   goes to `cancelled`, partial retained.
3. **Delete `receive.json`** and restart the Orbit Store payload.
   Abandon alone is *not* enough: `receive_status()` returns
   `other-client` whenever `id` is set and the owner mismatches,
   regardless of `state`. Only `receive_start()` finding no file clears
   the `id`.

> The console honors the `X-Orbit-Previous-Pairing: <old token>` header
> (verified live; `receivePairingRecovery: 1` in `/api/v1/system`).
> That is the intended in-app recovery path, but Orbit Zero only stores
> the token from the pairing immediately before last, so it cannot reach
> a record this far back.

### Remote access notes

- **API:** `http://<ps5>:34177` (also `GET /api/v1/system`,
  `/api/v1/storage`, `/api/v1/receive`).
- **FTP:** port `2121` (`ftpsrv.elf`, anonymous). `NLST`/`EPSV` are
  unimplemented — use `LIST` and `PASV`.
- There is no HTTP restart endpoint; restarting means re-running the
  payload on-console.

---

## Symptom 2 — queued to a drive without room

```
PS5 transfer paused. The computer download is continuing. Not enough
free space after queued downloads.
```

### Cause

`receive.c` rejects a `begin` when
`size + 16 MiB > free_bytes - pending`. The job was queued with
`storageId = "usb0"`:

| | |
|---|---|
| GTA V size | 102.5 GB |
| usb0 free | 72.4 GB — **30.1 GB short** |
| internal free | 451 GB — fits |

The user had space, just not on the drive the job targeted.

### Fix

`storageId` only chooses the PS5 destination root (`transfers.mjs`
`completedPath()`: `internal` → `/data/homebrew`, `usbN` →
`/mnt/usbN/homebrew`). It is **not** part of `cachePath()`, which keys on
`cacheDirectory`/`job.id`. So it is safe to retarget by editing
`queue.json` while Orbit Zero is **quit**.

Do **not** cancel instead — the `cancel` action runs `unlink()` on the
`.cache` and forces a full re-download. Re-adding with a different drive
also re-downloads, because `add()` dedupes on `releaseId` **+**
`storageId` and would create a second job starting at `downloaded: 0`.

Steps: quit Orbit Zero → change `"storageId":"usb0"` to
`"storageId":"internal"` → relaunch → Resume. Verify only that one
field differs. With `transferred: 0` there is no PS5 partial pinning the
job to the old drive.

---

## Verification

After both fixes, `GET /api/v1/receive` reported the GTA V job with
`state: "ready"`, `storageId: "internal"`, and a steadily increasing
`offset` (~8.4 MB/s LAN). The 15.8 GB computer `.cache` was preserved
throughout.
