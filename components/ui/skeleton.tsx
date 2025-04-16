import React from "react";

export function Skeleton({ className = "", style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <div
      className={`animate-pulse rounded bg-neutral-200 dark:bg-neutral-700 ${className}`}
      style={style}
    />
  );
}
