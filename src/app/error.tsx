"use client";

import { useEffect } from "react";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex items-center justify-center min-h-[60vh] px-4">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6" style={{ background: "color-mix(in srgb, var(--error) 12%, transparent)" }}>
          <span className="text-4xl">!</span>
        </div>
        <h2 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>Terjadi Kesalahan</h2>
        <p className="mb-6" style={{ color: "var(--text-secondary)" }}>
          Maaf, terjadi kesalahan yang tidak terduga. Silakan coba lagi.
        </p>
        <button
          onClick={() => reset()}
          className="text-white font-semibold px-6 py-3 rounded-lg transition-colors"
          style={{ background: "var(--primary)" }}
        >
          Coba Lagi
        </button>
      </div>
    </div>
  );
}
