"use client";

import { useEffect, useState } from "react";
import { CheckCircle, Loader2 } from "lucide-react";

export default function FasilitasSection() {
  const [s, setS] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((data) => { setS(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return null;
  if (s.showFacilities !== "1") return null;

  const list = s.facilities
    ? s.facilities.split(",").map((f: string) => f.trim()).filter(Boolean)
    : [];

  if (list.length === 0) return null;

  return (
    <section className="py-16 md:py-24 bg-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-3" style={{ color: "var(--text-primary)" }}>
            Fasilitas Sekolah
          </h2>
          <p className="max-w-2xl mx-auto" style={{ color: "var(--text-muted)" }}>
            Sarana dan prasarana lengkap untuk menunjang kegiatan belajar mengajar
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-3">
          {list.map((fasilitas: string, index: number) => (
            <div key={index} className="flex items-center gap-2.5 p-3.5 rounded-xl" style={{ background: "var(--section-alt)" }}>
              <CheckCircle className="w-5 h-5 flex-shrink-0" style={{ color: "var(--success)" }} />
              <span className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>{fasilitas}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
