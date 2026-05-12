"use client";

import { useState } from "react";
import { MapPin, Phone, Mail, Clock, Send, CheckCircle } from "lucide-react";

export default function KontakPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  return (
    <>
      {/* Hero */}
      <section className="hero-gradient py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 hero-gradient-text">Hubungi Kami</h1>
          <p className="text-xl hero-gradient-sub max-w-2xl mx-auto">
            Silakan hubungi kami melalui form atau kontak di bawah ini
          </p>
        </div>
      </section>

      {/* Kontak Info & Form */}
      <section className="py-16 bg-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Info */}
            <div>
              <h2 className="text-2xl font-bold mb-8" style={{ color: "var(--text-primary)" }}>Informasi Kontak</h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: "color-mix(in srgb, var(--primary) 10%, transparent)" }}>
                    <MapPin className="w-6 h-6" style={{ color: "var(--primary)" }} />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1" style={{ color: "var(--text-primary)" }}>Alamat</h3>
                    <p style={{ color: "var(--text-secondary)" }}>
                      Jl. Temuguruh No.58<br />
                      Dusun Krajan, Genteng Wetan<br />
                      Kec. Genteng, Kab. Banyuwangi<br />
                      Jawa Timur 68465
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: "color-mix(in srgb, var(--primary) 10%, transparent)" }}>
                    <Phone className="w-6 h-6" style={{ color: "var(--primary)" }} />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1" style={{ color: "var(--text-primary)" }}>Telepon</h3>
                    <p style={{ color: "var(--text-secondary)" }}>(0333) 845554</p>
                    <p style={{ color: "var(--text-secondary)" }}>0852-3456-7890 (WhatsApp)</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: "color-mix(in srgb, var(--primary) 10%, transparent)" }}>
                    <Mail className="w-6 h-6" style={{ color: "var(--primary)" }} />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1" style={{ color: "var(--text-primary)" }}>Email</h3>
                    <p style={{ color: "var(--text-secondary)" }}>smpmuhammadiyah1genteng@gmail.com</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: "color-mix(in srgb, var(--primary) 10%, transparent)" }}>
                    <Clock className="w-6 h-6" style={{ color: "var(--primary)" }} />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1" style={{ color: "var(--text-primary)" }}>Jam Operasional</h3>
                    <p style={{ color: "var(--text-secondary)" }}>Senin - Jumat: 07.00 - 15.00 WIB</p>
                    <p style={{ color: "var(--text-secondary)" }}>Sabtu: 07.00 - 12.00 WIB</p>
                  </div>
                </div>
              </div>

              {/* Map placeholder */}
              <div className="mt-8 rounded-xl h-64 flex items-center justify-center" style={{ background: "var(--section-alt)" }}>
                <a
                  href="https://maps.google.com/?q=-8.360388,114.159599"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium hover:underline"
                  style={{ color: "var(--primary)" }}
                >
                  Lihat di Google Maps
                </a>
              </div>
            </div>

            {/* Form */}
            <div>
              <h2 className="text-2xl font-bold mb-8" style={{ color: "var(--text-primary)" }}>Kirim Pesan</h2>
              {isSubmitted ? (
                <div className="rounded-xl p-8 text-center" style={{ background: "color-mix(in srgb, var(--success) 8%, transparent)", border: "1px solid color-mix(in srgb, var(--success) 20%, transparent)" }}>
                  <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: "color-mix(in srgb, var(--success) 12%, transparent)" }}>
                    <CheckCircle className="w-8 h-8" style={{ color: "var(--success)" }} />
                  </div>
                  <h3 className="text-xl font-semibold mb-2" style={{ color: "var(--text-primary)" }}>Pesan Terkirim!</h3>
                  <p style={{ color: "var(--text-secondary)" }}>
                    Terima kasih telah menghubungi kami. Kami akan merespon dalam 1x24 jam.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-1" style={{ color: "var(--text-secondary)" }}>Nama Lengkap</label>
                    <input type="text" required
                      className="w-full px-4 py-3 border rounded-lg text-sm outline-none"
                      style={{ borderColor: "var(--card-border)", background: "var(--card)", color: "var(--text-primary)" }}
                      placeholder="Masukkan nama Anda" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1" style={{ color: "var(--text-secondary)" }}>Email</label>
                    <input type="email" required
                      className="w-full px-4 py-3 border rounded-lg text-sm outline-none"
                      style={{ borderColor: "var(--card-border)", background: "var(--card)", color: "var(--text-primary)" }}
                      placeholder="email@anda.com" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1" style={{ color: "var(--text-secondary)" }}>Nomor HP</label>
                    <input type="tel"
                      className="w-full px-4 py-3 border rounded-lg text-sm outline-none"
                      style={{ borderColor: "var(--card-border)", background: "var(--card)", color: "var(--text-primary)" }}
                      placeholder="081234567890" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1" style={{ color: "var(--text-secondary)" }}>Subjek</label>
                    <select className="w-full px-4 py-3 border rounded-lg text-sm outline-none"
                      style={{ borderColor: "var(--card-border)", background: "var(--card)", color: "var(--text-primary)" }}>
                      <option value="">Pilih subjek...</option>
                      <option value="spmb">Informasi SPMB</option>
                      <option value="pendaftaran">Pendaftaran online</option>
                      <option value="info">Informasi sekolah</option>
                      <option value="lainnya">Lainnya</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1" style={{ color: "var(--text-secondary)" }}>Pesan</label>
                    <textarea required rows={5}
                      className="w-full px-4 py-3 border rounded-lg text-sm outline-none"
                      style={{ borderColor: "var(--card-border)", background: "var(--card)", color: "var(--text-primary)" }}
                      placeholder="Tulis pesan Anda di sini..." />
                  </div>

                  <button type="submit"
                    className="w-full font-semibold py-3 rounded-lg transition-all hover:shadow-lg flex items-center justify-center gap-2"
                    style={{ background: "var(--secondary)", color: "var(--foreground)" }}>
                    <Send className="w-5 h-5" />
                    Kirim Pesan
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}