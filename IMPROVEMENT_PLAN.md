# Orbit Store Improvement Plan

Based on reconnaissance of the codebase (v1.3.0 source bundle), this plan outlines moderate-refactor improvements across Visual/UI Polish, Performance, Provider UX, Settings/Config, Download Management, and New Features.

## Priority Interfaces
- **Store** (default grid-based storefront)
- **Crossbar** (PS5-style vertical list)
- **Native TV App** (C++ - `app/src/orbit/`)

## Phase 1: Design System & Visual Polish (Week 1-2)

### 1.1 Design Token System
- [ ] Extract CSS custom properties into a structured token system (`src/tokens/`)
- [ ] Define semantic color scales (background, surface, border, text, action, status)
- [ ] Add spacing, typography, radius, shadow, motion tokens
- [ ] Create dark/high-contrast variants
- [ ] Add `prefers-reduced-motion` support

### 1.2 Component Library Foundation
- [ ] Create base components: `Button`, `Card`, `Tile`, `Modal`, `Toast`, `Spinner`, `Progress`
- [ ] Implement consistent focus ring system (controller + pointer)
- [ ] Add entrance/exit animations with `framer-motion` or CSS keyframes
- [ ] Skeleton loading states for game tiles, rails, details

### 1.3 Store Interface Polish
- [ ] Refine hero section: better backdrop blur, parallax on focus
- [ ] Improve game tile: hover/focus scale, better image loading (blur-up)
- [ ] Rail navigation: smooth scroll, focus preservation
- [ ] Discover grid: masonry layout option, infinite scroll optimization

### 1.4 Crossbar Interface Polish
- [ ] Smoother row transitions (current shift animation)
- [ ] Better row focus: subtle glow, content expansion animation
- [ ] Label row styling: consistent with PS5 system UI
- [ ] Compact mode for settings rows

## Phase 2: Performance & Virtualization (Week 2-3)

### 2.1 Virtualized Lists
- [ ] Replace `useGrowing` with `@tanstack/react-virtual` or custom virtualizer
- [ ] Virtualize Discover grid, Browse results, Library, Downloads
- [ ] Maintain controller navigation semantics (focus management)

### 2.2 Image Optimization
- [ ] Progressive JPEG/WebP loading with blur placeholder
- [ ] `srcset` for different viewport densities
- [ ] Lazy-load offscreen images with `IntersectionObserver`
- [ ] Cache artwork in IndexedDB for offline browsing

### 2.3 Bundle Optimization
- [ ] Code-split by interface (`Store`, `Crossbar`, `Cinema`, `Panorama`)
- [ ] Lazy-load heavy components: `Details`, `Library`, `Settings`
- [ ] Analyze bundle with `vite-bundle-analyzer`
- [ ] Tree-shake unused i18n strings per build

### 2.4 Data Fetching & Caching
- [ ] Add React Query / TanStack Query for catalogue, downloads, library
- [ ] Stale-while-revalidate for catalogue updates
- [ ] Optimistic updates for favorites, queue reorder
- [ ] Background sync for paired devices

## Phase 3: Provider UX Improvements (Week 3)

### 3.1 VikingFile / AkiraBox Handling
- [ ] Detect and block common ad domains in provider iframes
- [ ] Auto-dismiss known overlay patterns
- [ ] "Open in new tab" fallback for problematic providers
- [ ] Visual indicator when provider step is required

### 3.2 Download Flow UX
- [ ] Unified download modal with clear steps
- [ ] Real-time provider status (waiting for captcha, generating link, etc.)
- [ ] Better error messages with recovery actions
- [ ] TorBox integration: show account limits, queue position

## Phase 4: Settings & Configuration (Week 3-4)

### 4.1 Settings Architecture
- [ ] Categorized, searchable settings page
- [ ] Settings schema with validation (Zod)
- [ ] Import/export JSON config
- [ ] Profiles (e.g., "Home", "Travel", "Offline PS5")

### 4.2 Key Settings Groups
- [ ] **Downloads**: sources, simultaneous, archive handling, TorBox, drive priority
- [ ] **Appearance**: interface, motion, backgrounds, language, theme variant
- [ ] **Network**: paired devices, Zero companion, ntfy/webhook notifications
- [ ] **Storage**: drives, cache, cleanup rules, ShadowMount integration
- [ ] **Advanced**: auto-start, payload manager sync, debug logging, beta channel

### 4.3 Settings UX
- [ ] Inline validation with helpful messages
- [ ] Reset to defaults per section
- [ ] Search/filter settings by keyword
- [ ] Keyboard shortcuts cheat sheet

## Phase 5: Download Management Enhancements (Week 4)

### 5.1 Queue Visualization
- [ ] Visual pipeline: Queued → Downloading → Extracting → Transferring → Complete
- [ ] Per-download speed graph (sparkline)
- [ ] ETA with confidence interval
- [ ] Drag-drop reorder with visual feedback

### 5.2 Reliability
- [ ] Smarter retry: exponential backoff, jitter, provider-specific
- [ ] Partial download recovery verification
- [ ] Stalled detection with auto-pause/resume
- [ ] Cross-device queue sync improvements

### 5.3 Orbit Zero Integration
- [ ] Better console connection status
- [ ] Transfer progress with separate download/transfer speeds
- [ ] Reconnect wizard for interrupted transfers

## Phase 6: New Features (Week 4-5)

### 6.1 Notifications
- [ ] ntfy.sh push notification support
- [ ] Webhook support for custom integrations
- [ ] In-app notification center (toast + history)
- [ ] Per-event preferences (complete, failed, stalled, update)

### 6.2 Provider Extensions
- [ ] Premiumize / Real-Debrid support (debrid.c already exists)
- [ ] Custom source URLs (user-added catalogue entries)
- [ ] Archive.org credentials for borrow-limited items

### 6.3 Quality of Life
- [ ] Auto-shutdown after queue complete (optional)
- [ ] PKG cleanup: auto-remove installed packages
- [ ] Firmware compatibility badges on games
- [ ] Game update detection (new patches/DLC)

## Phase 7: Native TV App (C++) Improvements (Parallel)

### 7.1 Visual Parity
- [ ] Match web interface design tokens
- [ ] Same 4 interfaces (Store, Crossbar, Cinema, Panorama)
- [ ] Consistent focus animations, transitions

### 7.2 Controller UX
- [ ] Haptic feedback on focus/selection (PS5 DualSense)
- [ ] Adaptive triggers for download actions
- [ ] Activity cards for quick resume

### 7.3 Performance
- [ ] Texture streaming for artwork
- [ ] Background catalogue loading
- [ ] Reduced memory footprint

## Technical Debt & Code Quality (Ongoing)

### 7.1 TypeScript
- [ ] Enable `strict: true`, `noUncheckedIndexedAccess`
- [ ] Add branded types for IDs (`GameId`, `JobId`, `TitleId`)
- [ ] Strict component props with discriminated unions

### 7.2 Testing
- [ ] Unit tests for hooks: `useOrbit`, `useLibrary`, `useInfiniteList`
- [ ] Component tests for `GameTile`, `GameRail`, `Details`, `Downloads`
- [ ] Integration tests for download flow
- [ ] Visual regression tests for interfaces

### 7.3 Developer Experience
- [ ] Storybook for component development
- [ ] ESLint + Prettier config (already present)
- [ ] Pre-commit hooks with `lint-staged`
- [ ] CI pipeline for typecheck, test, build

## File Structure Changes

```
src/
├── tokens/              # Design tokens (new)
│   ├── colors.ts
│   ├── spacing.ts
│   ├── typography.ts
│   ├── motion.ts
│   └── index.ts
├── components/          # Base component library (expanded)
│   ├── ui/              # Button, Card, Modal, etc.
│   ├── game/            # GameTile, GameRail, GameSheet
│   ├── download/        # DownloadItem, QueueView, ProgressBar
│   └── settings/        # SettingRow, SettingGroup, SearchableSettings
├── hooks/               # Custom hooks (reorganized)
│   ├── useVirtualList.ts
│   ├── useImageLoader.ts
│   ├── useDownloadQueue.ts
│   └── useSettings.ts
├── interfaces/          # Interface implementations
│   ├── store/           # Store-specific components
│   ├── crossbar/        # Crossbar-specific components
│   ├── cinema/          # Cinema-specific components
│   ├── panorama/        # Panorama-specific components
│   └── shared/          # Shared interface components
├── services/            # API/cache layer (new)
│   ├── catalogue.ts
│   ├── downloads.ts
│   ├── library.ts
│   └── notifications.ts
└── types/               # Centralized types (new)
    ├── game.ts
    ├── download.ts
    ├── settings.ts
    └── index.ts
```

## Success Metrics

| Metric | Target |
|--------|--------|
| Time to Interactive (TV) | < 2s |
| Time to Interactive (Phone) | < 1.5s |
| Bundle size (gzipped) | < 200KB per interface |
| 60fps controller navigation | 100% |
| Lighthouse Accessibility | > 95 |
| TypeScript strict mode | Pass |
| Test coverage (critical paths) | > 80% |

## Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| Breaking controller navigation | Comprehensive manual testing on PS5; preserve `data-own-arrows` pattern |
| Catalogue format changes | Keep backward compatibility; versioned catalogue loader |
| Native app divergence | Shared design tokens; sync review process |
| Provider site changes | Defensive parsing; feature flags for provider workarounds |

## Dependencies to Add

```json
{
  "dependencies": {
    "@tanstack/react-virtual": "^3.x",
    "@tanstack/react-query": "^5.x",
    "zod": "^3.x",
    "framer-motion": "^11.x",
    "idb": "^8.x"
  },
  "devDependencies": {
    "@storybook/react-vite": "^8.x",
    "vitest": "^2.x",
    "@testing-library/react": "^16.x",
    "vite-bundle-analyzer": "^1.x"
  }
}
```

## Next Steps

1. Set up dev environment (`npm ci`, verify `npm run dev` works)
2. Create design token system
3. Build base component library
4. Refactor Store interface with new components
5. Add virtualization
6. Iterate on Crossbar
7. Settings overhaul
8. Download management improvements
9. Provider UX fixes
10. Native TV app sync

---

*Generated from reconnaissance of orbit-store-ps5 v1.3.0 source bundle*