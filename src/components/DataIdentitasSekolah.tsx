"use client";

import { useEffect, useState } from "react";
import { Users, GraduationCap, Award, Calendar } from "lucide-react";

export default function DataIdentitasSekolah() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((data) => { setSettings(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const kepalaSekolah = settings.kepalaSekolah
    ? settings.kepalaSekolah.replace(/,?\s*S\.Pd\.?/i, "").trim()
    : "Abdul Latif";

  return (
    <div className="grid md:grid-cols-2 gap-8">
      <div className="rounded-xl p-8" style={{ background: "color-mix(in srgb, var(--primary) 6%, transparent)" }}>
        <h2 className="text-2xl font-bold mb-6" style={{ color: "var(--text-primary)" }}>Identitas Sekolah</h2>
        <div className="space-y-3">
          <div className="data-row">
            <span className="data-label">NPSN</span>
            <span className="data-value">20525536</span>
          </div>
          <div className="data-row">
            <span className="data-label">Status</span>
            <span className="data-value">Swasta</span>
          </div>
          <div className="data-row">
            <span className="data-label">Akreditasi</span>
            <span className="font-medium" style={{ color: "var(--success)" }}>A (Unggul)</span>
          </div>
          <div className="data-row">
            <span className="data-label">SK Akreditasi</span>
            <span className="data-value">164/BAP-S/M/SK/XI/2017</span>
          </div>
          <div className="data-row">
            <span className="data-label">Tanggal Berdiri</span>
            <span className="data-value">6 Mei 1978</span>
          </div>
          <div className="data-row">
            <span className="data-label">Luas Tanah</span>
            <span className="data-value">2.550 m&sup2;</span>
          </div>
          <div className="data-row">
            <span className="data-label">Kurikulum</span>
            <span className="data-value">Merdeka</span>
          </div>
          <div className="data-row">
            <span className="data-label">Kepala Sekolah</span>
            <span className="data-value">{kepalaSekolah}</span>
          </div>
          <div className="flex justify-between pb-2">
            <span className="data-label">Yayasan</span>
            <span className="data-value">PDM Kab. Banyuwangi</span>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="rounded-xl p-8" style={{ background: "var(--card)", border: "1px solid var(--card-border)" }}>
          <h3 className="text-xl font-bold mb-4" style={{ color: "var(--text-primary)" }}>Data Siswa & Guru</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="stat-card">
              <Users className="w-8 h-8 mx-auto mb-2" style={{ color: "var(--primary)" }} />
              <div className="stat-value">269</div>
              <div className="stat-label">Siswa</div>
            </div>
            <div className="stat-card">
              <GraduationCap className="w-8 h-8 mx-auto mb-2" style={{ color: "var(--success)" }} />
              <div className="stat-value" style={{ color: "var(--success)" }}>17</div>
              <div className="stat-label">Guru</div>
            </div>
            <div className="stat-card">
              <Award className="w-8 h-8 mx-auto mb-2" style={{ color: "var(--secondary)" }} />
              <div className="stat-value" style={{ color: "var(--secondary)" }}>4</div>
              <div className="stat-label">Tenaga Kependidikan</div>
            </div>
            <div className="stat-card">
              <Calendar className="w-8 h-8 mx-auto mb-2" style={{ color: "var(--accent)" }} />
              <div className="stat-value" style={{ color: "var(--accent)" }}>9</div>
              <div className="stat-label">Rombel</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
