"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { RefreshCw } from "lucide-react";

interface PullToRefreshProps {
  onRefresh: () => Promise<void>;
  children: React.ReactNode;
}

const THRESHOLD = 80;
const MAX_PULL = 120;

export default function PullToRefresh({ onRefresh, children }: PullToRefreshProps) {
  const [pull, setPull] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const startY = useRef(0);
  const pulling = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const onTouchStart = useCallback((e: TouchEvent) => {
    if (containerRef.current && containerRef.current.scrollTop <= 0) {
      startY.current = e.touches[0].clientY;
      pulling.current = true;
    }
  }, []);

  const onTouchMove = useCallback((e: TouchEvent) => {
    if (!pulling.current) return;
    const dy = e.touches[0].clientY - startY.current;
    if (dy <= 0) {
      setPull(0);
      return;
    }
    const damped = Math.min(dy * 0.5, MAX_PULL);
    setPull(damped);
  }, []);

  const onTouchEnd = useCallback(async () => {
    if (!pulling.current) return;
    pulling.current = false;
    if (pull >= THRESHOLD) {
      setRefreshing(true);
      setPull(THRESHOLD / 2);
      try {
        await onRefresh();
      } catch {}
      setRefreshing(false);
    }
    setPull(0);
  }, [pull, onRefresh]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    el.addEventListener("touchstart", onTouchStart, { passive: true });
    el.addEventListener("touchmove", onTouchMove, { passive: true });
    el.addEventListener("touchend", onTouchEnd);
    return () => {
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchmove", onTouchMove);
      el.removeEventListener("touchend", onTouchEnd);
    };
  }, [onTouchStart, onTouchMove, onTouchEnd]);

  const show = pull > 0 || refreshing;

  return (
    <div ref={containerRef} className="relative native-scroll" style={{ minHeight: "100%" }}>
      {/* Pull indicator */}
      <div
        className="flex items-center justify-center overflow-hidden transition-all duration-200 ease-out"
        style={{
          height: show ? `${Math.min(pull, 60)}px` : "0px",
          opacity: show ? Math.min(pull / 40, 1) : 0,
        }}
      >
        <RefreshCw
          className={`w-5 h-5 ${refreshing ? "pull-spinner" : ""}`}
          style={{
            color: "var(--primary)",
            transform: refreshing ? undefined : `rotate(${pull * 3}deg)`,
          }}
        />
        <span className="ml-2 text-xs font-medium" style={{ color: "var(--text-muted)" }}>
          {refreshing ? "Memuat ulang..." : pull >= THRESHOLD ? "Lepaskan untuk muat ulang" : "Tarik untuk muat ulang"}
        </span>
      </div>

      {children}
    </div>
  );
}
