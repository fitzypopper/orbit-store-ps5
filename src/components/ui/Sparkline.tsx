/**
 * Sparkline Component
 * Tiny inline chart for speed history or any time-series data
 */

import type { CSSProperties } from 'react';
import { tokens } from '../../tokens';

export interface SparklineProps {
  /** Data points (most recent last) */
  data: number[];
  /** Max value for scaling; if omitted, uses data max */
  max?: number;
  /** Color of the line */
  color?: string;
  /** Width in pixels */
  width?: number;
  /** Height in pixels */
  height?: number;
  /** Show area fill */
  fill?: boolean;
  /** Additional style */
  style?: CSSProperties;
}

export function Sparkline({
  data,
  max,
  color = tokens.color.status.info,
  width = 80,
  height = 20,
  fill = true,
  style,
}: SparklineProps) {
  if (data.length < 2) return null;

  const scaleY = max && max > 0 ? height / max : height / Math.max(...data);
  const stepX = width / (data.length - 1);

  const points = data.map((value, i) => {
    const x = i * stepX;
    const y = height - value * scaleY;
    return `${x},${y}`;
  }).join(' ');

  const areaPoints = [
    `${width},${height}`,
    ...points.split(' ').reverse(),
    `0,${height}`,
  ].join(' ');

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      style={{
        display: 'block',
        flexShrink: 0,
        ...style,
      }}
      aria-hidden="true"
    >
      {fill && (
        <polygon
          points={areaPoints}
          fill={color}
          fillOpacity={0.12}
        />
      )}
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default Sparkline;