"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { ArrowRight, Star, ChevronLeft, ChevronRight } from "lucide-react";
import type { HeroSlide } from "@/data/hero";

export default function HeroSlider({ slides }: { slides: HeroSlide[] }) {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const next = useCallback(() => setCurrent((c) => (c + 1) % slides.length), [slides.length]);
  const prev = useCallback(() => setCurrent((c) => (c - 1 + slides.length) % slides.length), [slides.length]);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [isPaused, next]);

  const slide = slides[current];

  const bgImage = slide.image ? `url(${slide.image})` : null;

  return (
    <section
      className={`relative ${slide.image ? "" : `bg-gradient-to-br ${slide.gradient}`} text-white overflow-hidden`}
      style={slide.image ? { background: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${slide.image}) center/cover` } : undefined}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {!slide.image && <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }}></div>}

      <button
        onClick={prev}
        className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors backdrop-blur-sm"
        aria-label="Slide sebelumnya"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button
        onClick={next}
        className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors backdrop-blur-sm"
        aria-label="Slide berikutnya"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 transition-opacity duration-500">
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 mb-4 font-medium animate-fade-in-up" style={{ color: "color-mix(in srgb, white 80%, transparent)" }}>
            <Star className="w-5 h-5" style={{ fill: "var(--secondary)", color: "var(--secondary)" }} />
            <span>{slide.tagline}</span>
            <Star className="w-5 h-5" style={{ fill: "var(--secondary)", color: "var(--secondary)" }} />
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 whitespace-pre-line animate-fade-in-up animate-delay-100">
            {slide.headline}
          </h1>
          <p className="text-lg mb-8 max-w-2xl animate-fade-in-up animate-delay-200" style={{ color: "color-mix(in srgb, white 85%, transparent)" }}>
            {slide.description}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up animate-delay-300">
            <Link
              href={slide.ctaHref}
              className="inline-flex items-center justify-center gap-2 font-semibold px-8 py-4 rounded-lg transition-all hover:shadow-xl hover:-translate-y-1"
              style={{ background: "var(--secondary)", color: "var(--foreground)" }}
            >
              {slide.ctaText}
              <ArrowRight className="w-5 h-5" />
            </Link>
            {slide.ctaSecondaryHref && (
              <Link
                href={slide.ctaSecondaryHref}
                className="inline-flex items-center justify-center gap-2 border-2 border-white/30 hover:border-white/60 text-white font-semibold px-8 py-4 rounded-lg transition-all"
              >
                {slide.ctaSecondaryText}
              </Link>
            )}
          </div>
        </div>
      </div>

      <div className="relative bg-slate-900/50 backdrop-blur-sm border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-center gap-3">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrent(index)}
                className="h-2 rounded-full transition-all"
                style={index === current ? { width: "2rem", background: "var(--secondary)" } : { width: "0.5rem", background: "rgba(255,255,255,0.4)" }}
                aria-label={`Slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
