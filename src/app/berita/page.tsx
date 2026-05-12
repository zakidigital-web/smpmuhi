"use client";

import { useEffect, useState } from "react";
import { Calendar, User, Tag, X, Share2, Check, ArrowLeft, Loader2 } from "lucide-react";

type BeritaItem = {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  author: string;
  category: string;
  slug: string;
  image: string;
};

export default function BeritaPage() {
  const [items, setItems] = useState<BeritaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetch("/api/berita")
      .then((r) => r.json())
      .then((data) => { setItems(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const selected = items.find((b) => b.id === selectedId);

  const handleShare = async (title: string) => {
    const url = window.location.origin + "/berita";
    if (navigator.share) {
      await navigator.share({ title, url });
    } else {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <>
      <section className="hero-gradient py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 hero-gradient-text">Berita & Artikel</h1>
          <p className="text-xl hero-gradient-sub max-w-2xl mx-auto">
            Informasi dan kegiatan terbaru dari SMP Muhammadiyah 1 Genteng
          </p>
        </div>
      </section>

      <section className="py-10 md:py-16" style={{ background: "var(--section-alt)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin" style={{ color: "var(--primary)" }} />
            </div>
          ) : items.length === 0 ? (
            <p className="text-center py-16" style={{ color: "var(--text-muted)" }}>Belum ada berita</p>
          ) : (
            <>
              <div className="flex md:hidden gap-4 overflow-x-auto pb-4 snap-x noselect">
                {items.map((item) => (
                  <article key={item.id} onClick={() => setSelectedId(item.id)}
                    className="flex-shrink-0 w-[80vw] rounded-xl overflow-hidden cursor-pointer tap-scale"
                    style={{ background: "var(--card)" }}>
                    {item.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={item.image} alt={item.title} className="w-full h-40 object-cover" />
                    ) : (
                      <div className="h-40 flex items-center justify-center" style={{ background: "var(--section-alt)" }}>
                        <Tag className="w-8 h-8" style={{ color: "var(--text-muted)" }} />
                      </div>
                    )}
                    <div className="p-4">
                      <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full" style={{ background: "var(--badge-bg)", color: "var(--badge-text)" }}>
                        {item.category}
                      </span>
                      <h2 className="font-semibold text-sm mt-2 mb-1 line-clamp-2" style={{ color: "var(--text-primary)" }}>{item.title}</h2>
                      <p className="text-xs line-clamp-3 mb-3" style={{ color: "var(--text-muted)" }}>{item.excerpt}</p>
                      <div className="flex items-center gap-3 text-[11px]" style={{ color: "var(--text-muted)" }}>
                        <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{item.date}</span>
                        <span className="flex items-center gap-1"><User className="w-3 h-3" />{item.author}</span>
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {items.map((item) => (
                  <article key={item.id} onClick={() => setSelectedId(item.id)}
                    className="rounded-xl overflow-hidden cursor-pointer tap-scale flex flex-col"
                    style={{ background: "var(--card)" }}>
                    {item.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={item.image} alt={item.title} className="w-full h-44 object-cover" />
                    ) : (
                      <div className="h-44 flex items-center justify-center" style={{ background: "var(--section-alt)" }}>
                        <Tag className="w-10 h-10" style={{ color: "var(--text-muted)" }} />
                      </div>
                    )}
                    <div className="p-5 flex flex-col flex-1">
                      <span className="text-xs font-semibold px-2 py-1 rounded-full self-start" style={{ background: "var(--badge-bg)", color: "var(--badge-text)" }}>
                        {item.category}
                      </span>
                      <h2 className="font-semibold text-base mt-2 mb-2 line-clamp-2" style={{ color: "var(--text-primary)" }}>{item.title}</h2>
                      <p className="text-sm line-clamp-3 mb-4 flex-1" style={{ color: "var(--text-muted)" }}>{item.excerpt}</p>
                      <div className="flex items-center justify-between text-xs pt-4" style={{ borderTop: "1px solid var(--card-border)", color: "var(--text-muted)" }}>
                        <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{item.date}</span>
                        <span className="flex items-center gap-1"><User className="w-3.5 h-3.5" />{item.author}</span>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {selected && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-start justify-center p-4 overflow-y-auto"
          onClick={() => setSelectedId(null)}>
          <div className="rounded-2xl max-w-2xl w-full my-8 overflow-hidden shadow-2xl"
            style={{ background: "var(--card)" }}
            onClick={(e) => e.stopPropagation()}>
            {selected.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={selected.image} alt={selected.title} className="w-full h-56 object-cover" />
            ) : (
              <div className="h-44 flex items-center justify-center relative" style={{ background: "var(--section-alt)" }}>
                <Tag className="w-12 h-12" style={{ color: "var(--text-muted)" }} />
              </div>
            )}
            <button onClick={() => setSelectedId(null)}
              className="absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center shadow"
              style={{ background: "var(--card)" }}>
              <X className="w-5 h-5" style={{ color: "var(--text-secondary)" }} />
            </button>
            {selected.image && (
              <span className="absolute bottom-4 left-4 text-sm font-medium px-3 py-1 rounded-full"
                style={{ background: "var(--card)", color: "var(--badge-text)" }}>
                {selected.category}
              </span>
            )}

            <div className="p-6 md:p-8">
              {!selected.image && (
                <span className="inline-block text-sm font-medium px-3 py-1 rounded-full mb-4"
                  style={{ background: "var(--badge-bg)", color: "var(--badge-text)" }}>
                  {selected.category}
                </span>
              )}
              <h2 className="text-2xl md:text-3xl font-bold mb-4" style={{ color: "var(--text-primary)" }}>
                {selected.title}
              </h2>

              <div className="flex items-center gap-4 text-sm mb-6 pb-6" style={{ color: "var(--text-muted)", borderBottom: "1px solid var(--card-border)" }}>
                <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {selected.date}</span>
                <span className="flex items-center gap-1"><User className="w-4 h-4" /> {selected.author}</span>
              </div>

              <div className="leading-relaxed space-y-4 mb-8" style={{ color: "var(--text-secondary)" }}>
                {selected.content.split("\n").map((paragraph, i) => (
                  <p key={i}>{paragraph}</p>
                ))}
              </div>

              <div className="flex items-center justify-between pt-6" style={{ borderTop: "1px solid var(--card-border)" }}>
                <button onClick={() => setSelectedId(null)}
                  className="flex items-center gap-1 font-medium text-sm" style={{ color: "var(--text-secondary)" }}>
                  <ArrowLeft className="w-4 h-4" /> Kembali
                </button>
                <button onClick={() => handleShare(selected.title)}
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
