"use client";

import { useEffect, useState } from "react";
import { GraduationCap, Award } from "lucide-react";

export default function SambutanKepalaSekolah() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((data) => { setSettings(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const name = settings.kepalaSekolah || "Abdul Latif, S.Pd.";

  return (
    <section className="py-16 md:py-24 bg-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div className="relative mx-auto w-full max-w-sm">
            {settings.fotoKepalaSekolah ? (
              <div className="aspect-[4/5] rounded-2xl overflow-hidden">
                <img src={settings.fotoKepalaSekolah} alt="Kepala Sekolah" className="w-full h-full object-cover" />
              </div>
            ) : (
              <div className="aspect-[4/5] rounded-2xl flex flex-col items-center justify-center" style={{ background: "color-mix(in srgb, var(--primary) 8%, var(--card))" }}>
                <GraduationCap className="w-24 h-24" style={{ color: "color-mix(in srgb, var(--primary) 50%, transparent)" }} />
                <span className="mt-3 text-sm font-medium" style={{ color: "color-mix(in srgb, var(--primary) 35%, transparent)" }}>Kepala Sekolah</span>
              </div>
            )}
            <div className="absolute -bottom-3 -right-3 px-4 py-3 rounded-xl shadow-lg flex items-center gap-2" style={{ background: "var(--secondary)", color: "var(--foreground)" }}>
              <Award className="w-6 h-6" />
              <div>
                <div className="text-xl font-bold leading-none">A</div>
                <div className="text-[11px] font-medium leading-tight">Akreditasi</div>
              </div>
            </div>
          </div>

          <div className="max-w-lg">
            <h2 className="text-3xl md:text-4xl font-bold mb-6" style={{ color: "var(--text-primary)" }}>
              Sambutan Kepala Sekolah
            </h2>
            <p className="mb-4" style={{ color: "var(--text-secondary)" }}>
              Assalamu&apos;alaikum Wr. Wb.
            </p>
            <p className="mb-3 leading-relaxed" style={{ color: "var(--text-secondary)" }}>
              Puji syukur ke hadirat Allah SWT yang telah memberikan rahmat dan karunia-Nya sehingga kita dapat bersilaturahmi melalui website ini.
            </p>
            <p className="mb-3 leading-relaxed" style={{ color: "var(--text-secondary)" }}>
              SMP Muhammadiyah 1 Genteng berkomitmen untuk memberikan pendidikan terbaik yang berlandaskan nilai-nilai Islam, dengan program unggulan keagamaan, kurikulum Merdeka, dan tenaga pengajar yang kompeten.
            </p>
            <div className="border-l-4 pl-4 mt-6" style={{ borderColor: "var(--primary)" }}>
              <p className="font-semibold" style={{ color: "var(--text-primary)" }}>{name}</p>
              <p className="text-sm" style={{ color: "var(--text-muted)" }}>Kepala SMP Muhammadiyah 1 Genteng</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
