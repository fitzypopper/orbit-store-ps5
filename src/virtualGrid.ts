import { useEffect, useMemo, useRef, useState } from "react";

export interface VirtualGridItem {
  index: number;
  start: number;
  end: number;
}

export interface VirtualGridConfig {
  /** Total number of items */
  total: number;
  /** Fixed height of each row in pixels */
  rowHeight: number;
  /** Number of columns per row */
  columns: number;
  /** How many extra rows to render above/below viewport */
  overscan?: number;
}

/**
 * Virtualized grid hook for the Browse/Discover grid.
 * Renders only visible rows + overscan, using absolute positioning
 * to preserve native scroll behavior.
 */
export function useVirtualGrid(config: VirtualGridConfig, scrollContainer: HTMLElement | null) {
  const { total, rowHeight, columns, overscan = 3 } = config;
  const [scrollTop, setScrollTop] = useState(0);
  const [containerHeight, setContainerHeight] = useState(0);

  useEffect(() => {
    if (!scrollContainer) return;
    const setHeight = () => setContainerHeight(scrollContainer.clientHeight);
    setHeight();
    const ro = new ResizeObserver(setHeight);
    ro.observe(scrollContainer);
    return () => ro.disconnect();
  }, [scrollContainer]);

  useEffect(() => {
    if (!scrollContainer) return;
    let frame = 0;
    const onScroll = () => {
      frame = 0;
      setScrollTop(scrollContainer.scrollTop);
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(onScroll);
    };
    scrollContainer.addEventListener("scroll", schedule, { passive: true } as { passive?: boolean; capture?: boolean; once?: boolean });
    return () => {
      cancelAnimationFrame(frame);
      scrollContainer.removeEventListener("scroll", schedule, { passive: true } as { passive?: boolean; capture?: boolean; once?: boolean });
    };
  }, [scrollContainer]);

  const visibleRange = useMemo(() => {
    if (!containerHeight || total === 0) return { start: 0, end: 0 };
    const firstRow = Math.floor(scrollTop / rowHeight);
    const lastRow = Math.min(
      Math.ceil((scrollTop + containerHeight) / rowHeight),
      Math.ceil(total / columns) - 1,
    );
    const startRow = Math.max(0, firstRow - overscan);
    const endRow = Math.min(Math.ceil(total / columns) - 1, lastRow + overscan);
    return { start: startRow, end: endRow };
  }, [scrollTop, containerHeight, total, rowHeight, columns, overscan]);

  const visibleItems = useMemo((): VirtualGridItem[] => {
    const items: VirtualGridItem[] = [];
    for (let row = visibleRange.start; row <= visibleRange.end; row++) {
      const rowStart = row * columns;
      const rowEnd = Math.min(rowStart + columns, total);
      for (let i = rowStart; i < rowEnd; i++) {
        items.push({ index: i, start: rowStart, end: rowEnd });
      }
    }
    return items;
  }, [visibleRange, columns, total]);

  const totalHeight = Math.ceil(total / columns) * rowHeight;
  const offsetY = visibleRange.start * rowHeight;

  return {
    visibleItems,
    totalHeight,
    offsetY,
    visibleRange,
  };
}