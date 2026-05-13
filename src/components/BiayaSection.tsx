"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

export default function BiayaSection() {
  const [s, setS] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((data) => { setS(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return null;
  if (s.showFees !== "1") return null;

  return (
    <section className="py-16" style={{ background: "var(--section-alt)" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4" style={{ color: "var(--text-primary)" }}>Biaya Pendidikan</h2>
          <p className="max-w-2xl mx-auto" style={{ color: "var(--text-secondary)" }}>
            Informasi biaya pendidikan untuk orang tua/wali calon siswa
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          <div className="rounded-xl p-6" style={{ background: "var(--card)", border: "1px solid var(--card-border)" }}>
            <h3 className="font-semibold mb-4" style={{ color: "var(--text-primary)" }}>Biaya Masuk (Sekali)</h3>
            <ul className="space-y-2" style={{ color: "var(--text-secondary)" }}>
              <li className="flex justify-between"><span>Pendaftaran</span>
                <span className="font-medium" style={{ color: s.feeRegistration === "Gratis" || s.feeRegistration === "0" ? "var(--success)" : "var(--text-primary)" }}>{s.feeRegistration || "Gratis"}</span>
              </li>
              <li className="flex justify-between"><span>Dana Pengembangan</span><span className="font-medium" style={{ color: "var(--text-primary)" }}>{s.feeDevelopment || "-"}</span></li>
              <li className="flex justify-between"><span>Seragam & Perlengkapan</span><span className="font-medium" style={{ color: "var(--text-primary)" }}>{s.feeUniform || "-"}</span></li>
            </ul>
          </div>
          <div className="rounded-xl p-6" style={{ background: "var(--card)", border: "1px solid var(--card-border)" }}>
            <h3 className="font-semibold mb-4" style={{ color: "var(--text-primary)" }}>Biaya Bulanan</h3>
            <ul className="space-y-2" style={{ color: "var(--text-secondary)" }}>
              <li className="flex justify-between"><span>SPP</span><span className="font-medium" style={{ color: "var(--text-primary)" }}>{s.feeSpp || "-"}</span></li>
              <li className="flex justify-between"><span>Buku & LKS</span><span className="font-medium" style={{ color: "var(--text-primary)" }}>{s.feeBooks || "-"}</span></li>
              <li className="flex justify-between"><span>Kegiatan</span><span className="font-medium" style={{ color: "var(--text-primary)" }}>{s.feeActivities || "-"}</span></li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
