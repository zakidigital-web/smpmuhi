import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex items-center justify-center min-h-[60vh] px-4">
      <div className="text-center max-w-md">
        <div className="text-8xl font-bold mb-4" style={{ color: "var(--primary)" }}>404</div>
        <h2 className="text-2xl font-bold mb-2" style={{ color: "var(--text-primary)" }}>Halaman Tidak Ditemukan</h2>
        <p className="mb-8" style={{ color: "var(--text-secondary)" }}>
          Halaman yang Anda cari tidak tersedia atau telah dipindahkan.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
          style={{ background: "var(--primary)" }}
        >
          Kembali ke Beranda
        </Link>
      </div>
    </div>
  );
}
