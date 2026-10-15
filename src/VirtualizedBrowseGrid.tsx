import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { GameTile } from "./components";
import { useVirtualGrid, type VirtualGridItem } from "./virtualGrid";
import type { Game } from "./types";
import type { CollectionState } from "./collection";

interface VirtualizedBrowseGridProps {
  games: Game[];
  states: Map<string, CollectionState | undefined>;
  favorites: Set<string>;
  open: (game: Game) => void;
  onFocus?: (id: string) => void;
  /** Number of priority covers that load immediately */
  firstCovers?: number;
  /** CSS class for the grid container */
  className?: string;
  /** Data attribute for the grid */
  dataRow?: string;
}

/**
 * Virtualized grid for Browse/Discover.
 * Renders only visible tiles + overscan to keep DOM small for large catalogs.
 * Falls back to simple grid if container isn't available.
 */
export function VirtualizedBrowseGrid({
  games,
  states,
  favorites,
  open,
  onFocus,
  firstCovers = 0,
  className = "",
  dataRow,
}: VirtualizedBrowseGridProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const [rowHeight, setRowHeight] = useState(300); // Approximate tile height + gap

  // Measure row height from first rendered tile
  useEffect(() => {
    if (!containerRef.current) return;
    const tile = containerRef.current.querySelector(".game-tile") as HTMLElement;
    if (tile) {
      const rect = tile.getBoundingClientRect();
      const style = getComputedStyle(containerRef.current);
      const gap = parseFloat(style.gridColumnGap) || parseFloat(style.gap) || 22;
      setRowHeight(rect.height + gap);
    }
  }, [games.length]);

  // Measure container width for column calculation
  useEffect(() => {
    if (!containerRef.current) return;
    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) setContainerWidth(entry.contentRect.width);
    });
    ro.observe(containerRef.current);
    setContainerWidth(containerRef.current.clientWidth);
    return () => ro.disconnect();
  }, []);

  // Estimate columns from container width (matches CSS: minmax(11rem, 1fr))
  const columns = useMemo(() => {
    if (!containerWidth) return 4; // Default fallback
    const tileWidth = 176; // 11rem = 176px at 16px base
    const gap = 22; // 1.4rem
    return Math.max(1, Math.floor((containerWidth + gap) / (tileWidth + gap)));
  }, [containerWidth]);

  const scrollContainer = useMemo(() => {
    // The main content area that scrolls
    return document.querySelector<HTMLElement>("main.page, main.browse, .discover .browse-grid");
  }, []);

  const { visibleItems, totalHeight, offsetY } = useVirtualGrid(
    {
      total: games.length,
      rowHeight,
      columns,
      overscan: 2,
    },
    scrollContainer,
  );

  // Fallback: if virtualization isn't working, render all
  const useVirtualization = totalHeight > 0 && visibleItems.length < games.length;

  if (!useVirtualization) {
    return (
      <div
        ref={containerRef}
        className={`browse-grid ${className}`}
        data-row={dataRow}
        role="list"
      >
        {games.map((g, index) => (
          <GameTile
            key={g.id}
            game={g}
            status={states.get(g.id)?.label}
            favorite={favorites.has(g.id)}
            priority={index < firstCovers}
            open={open}
            onFocus={onFocus}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`browse-grid ${className}`}
      data-row={dataRow}
      role="list"
      style={{
        position: "relative",
        minHeight: totalHeight,
      }}
    >
      <div
        style={{
          position: "absolute",
          top: offsetY,
          left: 0,
          right: 0,
          display: "grid",
          gridTemplateColumns: `repeat(${columns}, minmax(11rem, 1fr))`,
          gap: "1.6rem 1.4rem",
        }}
      >
        {visibleItems.map((item) => (
          <GameTile
            key={games[item.index].id}
            game={games[item.index]}
            status={states.get(games[item.index].id)?.label}
            favorite={favorites.has(games[item.index].id)}
            priority={item.index < firstCovers}
            open={open}
            onFocus={onFocus}
          />
        ))}
      </div>
    </div>
  );
}