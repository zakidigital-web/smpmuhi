"use client";

import { useEffect, useState } from "react";
import { CalendarDays, MapPin, Clock, X, ArrowLeft, Loader2 } from "lucide-react";

const typeColors: Record<string, React.CSSProperties> = {
  Pendaftaran: { background: "color-mix(in srgb, var(--accent) 12%, transparent)", color: "var(--accent)" },
  Seleksi: { background: "color-mix(in srgb, var(--secondary) 12%, transparent)", color: "var(--secondary)" },
  Pengumuman: { background: "color-mix(in srgb, var(--success) 12%, transparent)", color: "var(--success)" },
  Kegiatan: { background: "color-mix(in srgb, var(--primary) 12%, transparent)", color: "var(--primary)" },
  Libur: { background: "color-mix(in srgb, var(--error) 12%, transparent)", color: "var(--error)" },
};

type AgendaItem = {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  type: string;
};

const months = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];

function fmtDate(d: string): string {
  if (/^\d{4}-\d{2}-\d{2}$/.test(d)) {
    const [y, m, day] = d.split("-");
    return `${parseInt(day)} ${months[parseInt(m) - 1]} ${y}`;
  }
  return d;
}

function fmtTime(t: string): string {
  if (/^\d{2}:\d{2}$/.test(t)) {
    return `${t.replace(":", ".")} WIB`;
  }
  return t;
}

export default function AgendaPage() {
  const [items, setItems] = useState<AgendaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    fetch("/api/agenda")
      .then((r) => r.json())
      .then((data) => { setItems(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const selected = items.find((a) => a.id === selectedId);
  const types = [...new Set(items.map((a) => a.type))];
  const filtered = filter ? items.filter((a) => a.type === filter) : items;

  return (
    <>
      <section className="hero-gradient py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 hero-gradient-text">Agenda Sekolah</h1>
          <p className="text-xl hero-gradient-sub max-w-2xl mx-auto">
            Jadwal kegiatan dan agenda penting SMP Muhammadiyah 1 Genteng
          </p>
        </div>
      </section>

      <section className="py-16" style={{ background: "var(--section-alt)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin" style={{ color: "var(--primary)" }} />
            </div>
          ) : (
            <>
              {types.length > 0 && (
                <div className="flex gap-2 overflow-x-auto pb-2 mb-8 noselect snap-x">
                  <button onClick={() => setFilter("")}
                    className="px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors tap-scale"
                    style={{
                      background: !filter ? "var(--primary)" : "var(--card)",
                      color: !filter ? "white" : "var(--text-secondary)",
                      border: !filter ? "1px solid transparent" : "1px solid var(--card-border)",
                    }}>
                    Semua
                  </button>
                  {types.map((t) => (
                    <button key={t} onClick={() => setFilter(t)}
                      className="px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors tap-scale"
                      style={{
                        background: filter === t ? "var(--primary)" : "var(--card)",
                        color: filter === t ? "white" : "var(--text-secondary)",
                        border: filter === t ? "1px solid transparent" : "1px solid var(--card-border)",
                      }}>
                      {t}
                    </button>
                  ))}
                </div>
              )}

              {filtered.length === 0 ? (
                <p className="text-center py-16" style={{ color: "var(--text-muted)" }}>Tidak ada agenda ditemukan</p>
              ) : (
                <div className="relative max-w-3xl mx-auto">
                  <div className="absolute left-4 top-0 bottom-0 w-0.5 hidden sm:block" style={{ background: "color-mix(in srgb, var(--primary) 30%, transparent)" }} />
                  <div className="space-y-4">
                    {filtered.map((item) => (
                      <div key={item.id}
                        onClick={() => setSelectedId(item.id)}
                        className="relative rounded-xl p-4 sm:p-6 card-hover cursor-pointer tap-scale" style={{ background: "var(--card)", border: "1px solid var(--card-border)" }}
                      >
                        <div className="sm:pl-10">
                          <div className="hidden sm:block absolute left-2.5 top-7 w-3 h-3 rounded-full border-2 shadow" style={{ background: "var(--primary)", borderColor: "var(--card)" }} />
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1.5">
                                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full"
                                  style={typeColors[item.type] || { background: "var(--section-alt)", color: "var(--text-secondary)" }}>
                                  {item.type}
                                </span>
                              </div>
                              <h3 className="font-semibold text-base" style={{ color: "var(--text-primary)" }}>{item.title}</h3>
                            </div>
                          </div>
                          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-xs" style={{ color: "var(--text-muted)" }}>
                            <span className="flex items-center gap-1"><CalendarDays className="w-3.5 h-3.5" />{fmtDate(item.date)}</span>
                            <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{fmtTime(item.time)}</span>
                            <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{item.location}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {selected && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-start justify-center p-4 overflow-y-auto"
          onClick={() => setSelectedId(null)}>
          <div className="rounded-2xl max-w-lg w-full my-16 overflow-hidden shadow-2xl" style={{ background: "var(--card)" }}
            onClick={(e) => e.stopPropagation()}>
            <div className="p-6 md:p-8">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <span className="text-xs font-semibold px-2 py-1 rounded-full"
                    style={typeColors[selected.type] || { background: "var(--section-alt)", color: "var(--text-secondary)" }}>
                    {selected.type}
                  </span>
                </div>
                <button onClick={() => setSelectedId(null)} className="p-1" style={{ color: "var(--text-muted)" }}>
                  <X className="w-5 h-5" />
                </button>
              </div>

              <h2 className="text-xl font-bold mb-4" style={{ color: "var(--text-primary)" }}>{selected.title}</h2>

              <div className="space-y-3 text-sm mb-6" style={{ color: "var(--text-secondary)" }}>
                <div className="flex items-center gap-3">
                  <CalendarDays className="w-5 h-5" style={{ color: "var(--primary)" }} />
                  <span>{fmtDate(selected.date)}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5" style={{ color: "var(--primary)" }} />
                  <span>{fmtTime(selected.time)}</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5" style={{ color: "var(--primary)" }} />
                  <span>{selected.location}</span>
                </div>
              </div>

              <div className="pt-4 border-t" style={{ borderColor: "var(--card-border)" }}>
                <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>{selected.description}</p>
              </div>

              <button onClick={() => setSelectedId(null)}
                className="flex items-center gap-1 mt-6 font-medium text-sm" style={{ color: "var(--text-secondary)" }}>
                <ArrowLeft className="w-4 h-4" /> Kembali
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
