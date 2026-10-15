// What every settings section is called, how the settings page groups them,
// and what a search over them matches. Shared by Store's App settings dialog
// and the other interfaces' settings page, so neither has to import the other.
import { t } from "./i18n";
import type { GlyphName } from "./interfaces/Glyph";

export type SettingsSection =
  | "appearance"
  | "language"
  | "sources"
  | "storage"
  | "pair"
  | "catalogue"
  | "updates"
  | "tvapp"
  | "torbox"
  | "payload"
  | "autostart"
  | "diagnostics";

export interface SettingsEntry {
  id: SettingsSection;
  label: string;
  glyph: GlyphName;
  // English words a search also matches. Never shown, so never translated;
  // the shown label matches in the current language on its own.
  keywords: string[];
}

export const settingsGroups: { label: string; sections: SettingsEntry[] }[] = [
  {
    label: /* i18n */ "On this device",
    sections: [
      { id: "appearance", label: /* i18n */ "Appearance", glyph: "palette", keywords: ["theme", "dark", "contrast", "interface", "store", "crossbar", "cinema", "panorama", "look"] },
      { id: "language", label: /* i18n */ "Language", glyph: "globe", keywords: ["translations", "locale", "english"] },
    ],
  },
  {
    label: /* i18n */ "Orbit on your PS5",
    sections: [
      { id: "sources", label: /* i18n */ "Download sources", glyph: "cloud", keywords: ["providers", "links", "archive.org", "vikingfile", "akirabox"] },
      { id: "storage", label: /* i18n */ "Storage and downloads", glyph: "drive", keywords: ["downloads", "path", "space", "usb", "drive", "concurrent", "limit"] },
      { id: "pair", label: /* i18n */ "Pair devices", glyph: "link", keywords: ["pairing", "code", "connect", "session"] },
      { id: "catalogue", label: /* i18n */ "Game catalogue", glyph: "refresh", keywords: ["catalog", "games", "refresh", "revision"] },
      { id: "updates", label: /* i18n */ "Updates", glyph: "update", keywords: ["version", "upgrade", "release"] },
      { id: "tvapp", label: /* i18n */ "TV app", glyph: "tv", keywords: ["television", "native", "install"] },
      { id: "torbox", label: "TorBox", glyph: "bolt", keywords: ["debrid"] },
    ],
  },
  {
    label: /* i18n */ "Maintenance",
    sections: [
      { id: "payload", label: /* i18n */ "Payload managers", glyph: "box", keywords: ["managers", "elf"] },
      { id: "autostart", label: /* i18n */ "Start automatically", glyph: "power", keywords: ["boot", "startup", "launch", "auto-start"] },
      { id: "diagnostics", label: /* i18n */ "Diagnostics", glyph: "bug", keywords: ["logs", "debug", "troubleshoot", "crash"] },
    ],
  },
];
export const settingsSections = settingsGroups.flatMap((g) => g.sections);

export function settingsEntry(id: SettingsSection): SettingsEntry {
  const found = settingsSections.find((s) => s.id === id);
  if (!found) throw new Error(`Unknown settings section: ${id}`);
  return found;
}

// Case-insensitive: the label as shown (translated or English) or a synonym.
export function matchesSettings(query: string, entry: SettingsEntry): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  if (entry.label.toLowerCase().includes(q)) return true;
  if (t(entry.label).toLowerCase().includes(q)) return true;
  return entry.keywords.some((k) => k.includes(q));
}
