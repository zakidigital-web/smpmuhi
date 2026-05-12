"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { X, ChevronDown } from "lucide-react";

interface DraggableSheetProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const THRESHOLD = 100;

export default function DraggableSheet({ open, onClose, title, children }: DraggableSheetProps) {
  const [translateY, setTranslateY] = useState(0);
  const [dragging, setDragging] = useState(false);
  const startY = useRef(0);
  const currentY = useRef(0);
  const sheetRef = useRef<HTMLDivElement>(null);

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    startY.current = e.touches[0].clientY;
    currentY.current = 0;
    setDragging(true);
  }, []);

  const onTouchMove = useCallback((e: React.TouchEvent) => {
    const dy = e.touches[0].clientY - startY.current;
    if (dy < 0) return;
    currentY.current = dy;
    setTranslateY(dy);
  }, []);

  const onTouchEnd = useCallback(() => {
    setDragging(false);
    if (currentY.current > THRESHOLD) {
      onClose();
    }
    setTranslateY(0);
  }, [onClose]);

  useEffect(() => {
    if (open) {
      setTranslateY(0);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 z-[60] transition-opacity duration-300 ${
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      >
        <div className="absolute inset-0 bg-black/50" />
      </div>

      {/* Sheet */}
      <div
        ref={sheetRef}
        className={`fixed bottom-0 left-0 right-0 z-[61] transition-transform duration-300 ease-out ${
          open ? "translate-y-0" : "translate-y-full"
        }`}
        style={{
          transform: dragging ? `translateY(${translateY}px)` : undefined,
          transition: dragging ? "none" : undefined,
          paddingBottom: "env(safe-area-inset-bottom, 0px)",
        }}
      >
        <div
          className="rounded-t-2xl shadow-2xl px-6 pb-8 pt-2 noselect"
          style={{ background: "var(--card)" }}
        >
          {/* Drag handle */}
          <div
            className="flex flex-col items-center cursor-grab active:cursor-grabbing pt-2 pb-4 -mx-6"
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            <div className="w-10 h-1 rounded-full mb-1" style={{ background: "var(--text-muted)" }} />
          </div>

          {/* Header */}
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-bold" style={{ color: "var(--text-primary)" }}>{title}</h3>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full flex items-center justify-center tap-scale"
              style={{ background: "var(--section-alt)", color: "var(--text-secondary)" }}
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {children}
        </div>
      </div>
    </>
  );
}
