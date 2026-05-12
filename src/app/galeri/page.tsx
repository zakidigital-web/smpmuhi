"use client";

import { useEffect, useState } from "react";
import { Camera, Image, Film, X, Share2, Check, ArrowLeft, Play, Loader2 } from "lucide-react";

const categories = ["Semua", "Foto", "Video"];

type GaleriItem = {
  id: string;
  title: string;
  category: string;
  desc: string;
  media_type: string;
  url: string;
};

export default function GaleriPage() {
  const [items, setItems] = useState<GaleriItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCat, setActiveCat] = useState("Semua");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetch("/api/galeri")
      .then((r) => r.json())
      .then((data) => { setItems(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const filtered = activeCat === "Semua" ? items : items.filter((g) => g.media_type === (activeCat === "Foto" ? "photo" : "video"));
  const selected = items.find((g) => g.id === selectedId);

  const handleShare = async () => {
    const url = window.location.origin + "/galeri";
    if (navigator.share) {
      await navigator.share({ title: "Galeri SMP Muhammadiyah 1 Genteng", url });
    } else {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <>
        <section className="hero-gradient py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <Camera className="w-16 h-16 mx-auto mb-4" style={{ color: "var(--secondary)" }} />
            <h1 className="text-4xl md:text-5xl font-bold mb-4 hero-gradient-text">Galeri</h1>
            <p className="text-xl hero-gradient-sub max-w-2xl mx-auto">Dokumentasi foto dan video kegiatan SMP Muhammadiyah 1 Genteng</p>
          </div>
        </section>
        <section className="py-16" style={{ background: "var(--section-alt)" }}>
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin" style={{ color: "var(--primary)" }} />
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <section className="hero-gradient py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Camera className="w-16 h-16 mx-auto mb-4" style={{ color: "var(--secondary)" }} />
          <h1 className="text-4xl md:text-5xl font-bold mb-4 hero-gradient-text">Galeri</h1>
          <p className="text-xl hero-gradient-sub max-w-2xl mx-auto">
            Dokumentasi foto dan video kegiatan SMP Muhammadiyah 1 Genteng
          </p>
        </div>
      </section>

      <section className="py-16" style={{ background: "var(--section-alt)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Filter tabs */}
          <div className="flex gap-2 mb-8 justify-center">
            {categories.map((cat) => (
              <button key={cat} onClick={() => setActiveCat(cat)}
                className="px-5 py-2 rounded-full text-sm font-medium transition-colors tap-scale"
                style={{
                  background: activeCat === cat ? "var(--primary)" : "var(--card)",
                  color: activeCat === cat ? "white" : "var(--text-secondary)",
                  border: activeCat === cat ? "2px solid transparent" : "2px solid var(--card-border)",
                }}
              >
                {cat === "Foto" ? <Image className="w-4 h-4 inline mr-1" /> : cat === "Video" ? <Film className="w-4 h-4 inline mr-1" /> : null}
                {cat}
              </button>
            ))}
          </div>

          {filtered.length === 0 ? (
            <p className="text-center py-16" style={{ color: "var(--text-muted)" }}>Tidak ada galeri ditemukan</p>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map((item) => (
                <div key={item.id} onClick={() => setSelectedId(item.id)}
                  className="group relative rounded-xl overflow-hidden cursor-pointer tap-scale"
                  style={{ background: "var(--card)" }}
                >
                  <div className="aspect-[4/3] flex items-center justify-center relative overflow-hidden">
                    {item.media_type === "video" ? (
                      <>
                        <div className="absolute inset-0 flex items-center justify-center" style={{ background: "var(--section-alt)" }}>
                          <Film className="w-14 h-14" style={{ color: "var(--text-muted)" }} />
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-16 h-16 rounded-full flex items-center justify-center bg-black/40 group-hover:bg-black/60 transition-colors">
                            <Play className="w-7 h-7 text-white ml-1" />
                          </div>
                        </div>
                        <span className="absolute top-3 right-3 text-[11px] font-semibold px-2 py-0.5 rounded-full" style={{ background: "var(--accent)", color: "white" }}>Video</span>
                      </>
                    ) : item.url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={item.url} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    ) : (
                      <div className="flex flex-col items-center justify-center" style={{ background: "var(--section-alt)" }}>
                        <Image className="w-14 h-14" style={{ color: "var(--text-muted)" }} />
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>{item.title}</h3>
                    <p className="text-xs mt-0.5 line-clamp-1" style={{ color: "var(--text-muted)" }}>{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Modal */}
      {selected && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4"
          onClick={() => setSelectedId(null)}>
          <div className="rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl relative"
            style={{ background: "var(--card)" }}
            onClick={(e) => e.stopPropagation()}>
            {selected.media_type === "video" && selected.url ? (
              <div className="aspect-video relative">
                <iframe src={selected.url} className="w-full h-full" allowFullScreen title={selected.title} />
              </div>
            ) : selected.url ? (
              <div className="aspect-video flex items-center justify-center relative" style={{ background: "var(--section-alt)" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={selected.url} alt={selected.title} className="w-full h-full object-contain" />
              </div>
            ) : (
              <div className="aspect-video flex items-center justify-center relative" style={{ background: "var(--section-alt)" }}>
                {selected.media_type === "video" ? <Film className="w-24 h-24" style={{ color: "var(--text-muted)" }} /> : <Image className="w-24 h-24" style={{ color: "var(--text-muted)" }} />}
              </div>
            )}
            <button onClick={() => setSelectedId(null)}
              className="absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center shadow"
              style={{ background: "var(--card)" }}>
              <X className="w-5 h-5" style={{ color: "var(--text-secondary)" }} />
            </button>
            <div className="p-6">
              <div className="flex items-center gap-2 mb-1">
                {selected.media_type === "video" ? (
                  <Film className="w-4 h-4" style={{ color: "var(--accent)" }} />
                ) : (
                  <Image className="w-4 h-4" style={{ color: "var(--primary)" }} />
                )}
                <h3 className="text-xl font-bold" style={{ color: "var(--text-primary)" }}>{selected.title}</h3>
              </div>
              <p className="text-sm mb-6" style={{ color: "var(--text-muted)" }}>{selected.desc}</p>
              <div className="flex items-center justify-between pt-4" style={{ borderTop: "1px solid var(--card-border)" }}>
                <button onClick={() => setSelectedId(null)}
                  className="flex items-center gap-1 font-medium text-sm" style={{ color: "var(--text-secondary)" }}>
                  <ArrowLeft className="w-4 h-4" /> Kembali
                </button>
                <button onClick={handleShare}
                  className="flex items-center gap-2 text-white font-semibold px-5 py-2.5 rounded-lg text-sm transition-colors"
                  style={{ background: "var(--primary)" }}>
                  {copied ? <><Check className="w-4 h-4" /> Tersalin</> : <><Share2 className="w-4 h-4" /> Bagikan</>}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
