"use client";

import { useState, useCallback, useRef } from "react";
import type { CompareViewProps } from "@/lib/types";

export function CompareView({ originalUrl, restoredUrl }: CompareViewProps) {
  const [position, setPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const updatePosition = useCallback((clientX: number) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const pct = ((clientX - rect.left) / rect.width) * 100;
    setPosition(Math.min(100, Math.max(0, pct)));
  }, []);

  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      dragging.current = true;
      updatePosition(e.clientX);
    },
    [updatePosition]
  );

  const onPointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!dragging.current) return;
      updatePosition(e.clientX);
    },
    [updatePosition]
  );

  const onPointerUp = useCallback(() => {
    dragging.current = false;
  }, []);

  return (
    <div className="border-extract p-4">
      <div
        ref={containerRef}
        className="relative w-full rounded-sm overflow-hidden select-none touch-pan-y cursor-ew-resize"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        {/* Restored image — visible on right, drives container aspect ratio */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={restoredUrl}
          alt="Restored photo"
          className="block w-full h-auto"
          draggable={false}
        />

        {/* Original image — clipped to left portion */}
        <div
          className="absolute inset-0"
          style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={originalUrl}
            alt="Original photo"
            className="absolute inset-0 w-full h-full object-cover"
            draggable={false}
          />
        </div>

        {/* Slider line + handle */}
        <div
          className="absolute top-0 bottom-0 flex items-center pointer-events-none"
          style={{ left: `${position}%`, transform: "translateX(-50%)" }}
        >
          {/* Vertical line */}
          <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-[2px] bg-primary" />

          {/* Circular handle */}
          <div className="relative w-10 h-10 bg-background border border-primary rounded-full flex items-center justify-center shadow-lg">
            <div className="flex gap-[2px] items-center">
              <div className="w-[2px] h-[10px] bg-black rounded-full" />
              <div className="w-[2px] h-[16px] bg-black rounded-full" />
              <div className="w-[2px] h-[10px] bg-black rounded-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
