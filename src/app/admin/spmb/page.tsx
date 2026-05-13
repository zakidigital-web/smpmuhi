"use client";

import { useState, useEffect, useRef } from "react";
import { adminApi } from "@/lib/adminApi";
import { Search, CheckCircle, XCircle, Clock, User, School, FileText, Printer, X, GraduationCap, MapPin, Phone, Calendar, ChevronRight } from "lucide-react";

export default function AdminSpmb() {
  const [items, setItems] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  useEffect(() => { load(); }, []);

  async function load() {
    const data = await adminApi.spmb.list();
    setItems(data);
  }

  const handleStatus = async (id: string, status: string) => {
    await adminApi.spmb.updateStatus(id, status);
    setItems(items.map((i) => (i.id === id ? { ...i, status } : i)));
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Hapus data pendaftaran ini?")) return;
    await adminApi.spmb.remove(id);
    setItems(items.filter((i) => i.id !== id));
  };

  const [detailItem, setDetailItem] = useState<any | null>(null);
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    if (!printRef.current) return;
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Cetak - ${detailItem?.nama_lengkap}</title>
        <style>
          @page { margin: 15mm; size: A4 portrait; }
          body { font-family: 'Segoe UI', system-ui, sans-serif; color: #1e293b; margin: 0; padding: 0; }
          .header { text-align: center; border-bottom: 2px solid #1B5E20; padding-bottom: 16px; margin-bottom: 24px; }
          .header h1 { font-size: 20px; margin: 0 0 4px; color: #1B5E20; }
          .header p { font-size: 13px; color: #64748b; margin: 0; }
          .nomor { text-align: center; background: #f0fdf4; border: 1px solid #166534; border-radius: 8px; padding: 12px; margin-bottom: 24px; }
          .nomor span { font-size: 14px; color: #166534; font-weight: 700; letter-spacing: 1px; }
          .section { margin-bottom: 20px; }
          .section h2 { font-size: 14px; font-weight: 700; color: #1B5E20; border-bottom: 1px solid #e2e8f0; padding-bottom: 6px; margin: 0 0 12px; }
          .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px 24px; }
          .field { }
          .field .label { font-size: 11px; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.5px; }
          .field .value { font-size: 14px; color: #1e293b; font-weight: 500; }
          .full { grid-column: 1 / -1; }
          .footer { text-align: center; font-size: 11px; color: #94a3b8; border-top: 1px solid #e2e8f0; padding-top: 12px; margin-top: 24px; }
          @media print {
            .no-print { display: none !important; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>FORMULIR PENDAFTARAN SPMB</h1>
          <p>SMP Muhammadiyah 1 Genteng - Tahun Ajaran 2026/2027</p>
        </div>
        <div class="nomor">
          <span>Nomor Pendaftaran: ${detailItem?.nomor_pendaftaran}</span>
        </div>
        <div class="section">
          <h2>A. Data Siswa</h2>
          <div class="grid">
            <div class="field"><div class="label">Nama Lengkap</div><div class="value">${detailItem?.nama_lengkap || "-"}</div></div>
            <div class="field"><div class="label">NISN</div><div class="value">${detailItem?.nisn || "-"}</div></div>
            <div class="field"><div class="label">Tempat Lahir</div><div class="value">${detailItem?.tempat_lahir || "-"}</div></div>
            <div class="field"><div class="label">Tanggal Lahir</div><div class="value">${detailItem?.tanggal_lahir || "-"}</div></div>
            <div class="field"><div class="label">Jenis Kelamin</div><div class="value">${detailItem?.jenis_kelamin === "L" ? "Laki-laki" : detailItem?.jenis_kelamin === "P" ? "Perempuan" : "-"}</div></div>
            <div class="field"><div class="label">Agama</div><div class="value">${detailItem?.agama || "-"}</div></div>
            <div class="field full"><div class="label">Alamat</div><div class="value">${detailItem?.alamat || "-"}</div></div>
          </div>
        </div>
        <div class="section">
          <h2>B. Data Orang Tua</h2>
          <div class="grid">
            <div class="field"><div class="label">Nama Ayah</div><div class="value">${detailItem?.nama_ayah || "-"}</div></div>
            <div class="field"><div class="label">Pekerjaan Ayah</div><div class="value">${detailItem?.pekerjaan_ayah || "-"}</div></div>
            <div class="field"><div class="label">Nama Ibu</div><div class="value">${detailItem?.nama_ibu || "-"}</div></div>
            <div class="field"><div class="label">Pekerjaan Ibu</div><div class="value">${detailItem?.pekerjaan_ibu || "-"}</div></div>
            <div class="field"><div class="label">No. HP Orang Tua</div><div class="value">${detailItem?.no_hp_ortu || "-"}</div></div>
          </div>
        </div>
        <div class="section">
          <h2>C. Data Sekolah & Program</h2>
          <div class="grid">
            <div class="field"><div class="label">SD/MI Asal</div><div class="value">${detailItem?.nama_sekolah || "-"}</div></div>
            <div class="field full"><div class="label">Alamat SD/MI</div><div class="value">${detailItem?.alamat_sekolah || "-"}</div></div>
            <div class="field"><div class="label">Program Pilihan</div><div class="value">${detailItem?.program_pilihan || "-"}</div></div>
          </div>
        </div>
        <div class="footer">
          Dicetak pada ${new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })}
        </div>
        <script>
          window.onload = function() { window.print(); window.close(); };
        </script>
      </body>
      </html>
    `;
    printWindow.document.write(html);
    printWindow.document.close();
  };

  const filtered = items.filter((item: any) => {
    const matchSearch = !search || item.nama_lengkap?.toLowerCase().includes(search.toLowerCase()) || item.nomor_pendaftaran?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = !filterStatus || item.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const statusColor: Record<string, React.CSSProperties> = {
    menunggu: { background: "rgba(234,179,8,0.12)", color: "#CA8A04" },
    diterima: { background: "rgba(22,163,74,0.12)", color: "var(--success)" },
    ditolak: { background: "rgba(220,38,38,0.12)", color: "var(--error)" },
  };

  const stats = {
    total: items.length,
    menunggu: items.filter((i: any) => i.status === "menunggu").length,
    diterima: items.filter((i: any) => i.status === "diterima").length,
    ditolak: items.filter((i: any) => i.status === "ditolak").length,
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>Kelola SPMB</h1>
          <p className="mt-1" style={{ color: "var(--text-secondary)" }}>Data pendaftaran murid baru</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="rounded-xl p-4" style={{ background: "var(--card)", border: "1px solid var(--card-border)" }}>
          <div className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>{stats.total}</div>
          <div className="text-sm" style={{ color: "var(--text-muted)" }}>Total Pendaftar</div>
        </div>
        <div className="rounded-xl p-4" style={{ background: "rgba(234,179,8,0.08)", border: "1px solid rgba(234,179,8,0.2)" }}>
          <div className="text-2xl font-bold text-yellow-600">{stats.menunggu}</div>
          <div className="text-sm text-yellow-700">Menunggu</div>
        </div>
        <div className="rounded-xl p-4" style={{ background: "rgba(22,163,74,0.08)", border: "1px solid rgba(22,163,74,0.2)" }}>
          <div className="text-2xl font-bold text-green-600">{stats.diterima}</div>
          <div className="text-sm text-green-700">Diterima</div>
        </div>
        <div className="rounded-xl p-4" style={{ background: "rgba(220,38,38,0.08)", border: "1px solid rgba(220,38,38,0.2)" }}>
          <div className="text-2xl font-bold text-red-600">{stats.ditolak}</div>
          <div className="text-sm text-red-700">Ditolak</div>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: "var(--text-muted)" }} />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Cari nama atau nomor pendaftaran..."
            className="w-full pl-11 pr-4 py-3 border rounded-xl text-sm"
            style={{ borderColor: "var(--card-border)", background: "var(--card)", color: "var(--text-primary)" }} />
        </div>
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-3 border rounded-xl text-sm"
          style={{ borderColor: "var(--card-border)", background: "var(--card)", color: "var(--text-primary)" }}>
          <option value="">Semua Status</option>
          <option value="menunggu">Menunggu</option>
          <option value="diterima">Diterima</option>
          <option value="ditolak">Ditolak</option>
        </select>
      </div>

      {/* Table */}
      <div className="rounded-xl border overflow-hidden" style={{ borderColor: "var(--card-border)", background: "var(--card)" }}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: "1px solid var(--card-border)", background: "var(--section-alt)" }}>
                <th className="text-left px-4 py-3 font-semibold" style={{ color: "var(--text-secondary)" }}>No. Daftar</th>
                <th className="text-left px-4 py-3 font-semibold" style={{ color: "var(--text-secondary)" }}>Nama</th>
                <th className="text-left px-4 py-3 font-semibold hidden md:table-cell" style={{ color: "var(--text-secondary)" }}>Program</th>
                <th className="text-left px-4 py-3 font-semibold hidden sm:table-cell" style={{ color: "var(--text-secondary)" }}>Tanggal</th>
                <th className="text-left px-4 py-3 font-semibold" style={{ color: "var(--text-secondary)" }}>Status</th>
                <th className="text-right px-4 py-3 font-semibold" style={{ color: "var(--text-secondary)" }}>Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: "var(--card-border)" }}>
              {filtered.map((item: any) => (
                <tr key={item.id} className="transition-colors">
                  <td className="px-4 py-3 font-mono text-xs" style={{ color: "var(--text-primary)" }}>{item.nomor_pendaftaran}</td>
                  <td className="px-4 py-3">
                    <p className="font-medium" style={{ color: "var(--text-primary)" }}>{item.nama_lengkap}</p>
                    <p className="text-xs" style={{ color: "var(--text-muted)" }}>{item.nisn}</p>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell" style={{ color: "var(--text-secondary)" }}>{item.program_pilihan}</td>
                  <td className="px-4 py-3 hidden sm:table-cell text-xs" style={{ color: "var(--text-muted)" }}>
                    {new Date(item.created_at).toLocaleDateString("id-ID")}
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs font-semibold px-2 py-1 rounded-full"
                      style={statusColor[item.status] || { background: "var(--section-alt)", color: "var(--text-secondary)" }}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      {item.status === "menunggu" && (
                        <>
                          <button onClick={() => handleStatus(item.id, "diterima")}
                            className="p-1.5 rounded-lg transition-colors" style={{ color: "var(--success)" }} title="Terima"><CheckCircle className="w-4 h-4" /></button>
                          <button onClick={() => handleStatus(item.id, "ditolak")}
                            className="p-1.5 rounded-lg transition-colors" style={{ color: "var(--error)" }} title="Tolak"><XCircle className="w-4 h-4" /></button>
                        </>
                      )}
                      <button onClick={() => { setDetailItem(item); }} className="p-1.5 rounded-lg transition-colors" style={{ color: "var(--primary)" }} title="Cetak PDF"><FileText className="w-4 h-4" /></button>
                      <button onClick={() => handleDelete(item.id)}
                        className="p-1.5 rounded-lg transition-colors" style={{ color: "var(--text-muted)" }} title="Hapus"><XCircle className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-3 text-sm" style={{ color: "var(--text-muted)", borderTop: "1px solid var(--card-border)" }}>
          Total: {filtered.length} pendaftar
        </div>
      </div>
      {detailItem && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={() => setDetailItem(null)}>
          <div className="rounded-2xl max-w-3xl w-full my-8 shadow-2xl overflow-y-auto max-h-[90vh]" style={{ background: "var(--card)" }} onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 flex items-center justify-between p-6 pb-4" style={{ background: "var(--card)", borderBottom: "1px solid var(--card-border)", zIndex: 1 }}>
              <h2 className="text-lg font-bold" style={{ color: "var(--text-primary)" }}>Detail Pendaftar</h2>
              <div className="flex items-center gap-2">
                <button onClick={handlePrint} className="flex items-center gap-2 text-white px-4 py-2 rounded-lg text-sm font-semibold" style={{ background: "var(--primary)" }}>
                  <Printer className="w-4 h-4" /> Cetak PDF
                </button>
                <button onClick={() => setDetailItem(null)} className="p-2 rounded-lg transition-colors" style={{ color: "var(--text-muted)" }}><X className="w-5 h-5" /></button>
              </div>
            </div>

            <div ref={printRef} className="p-6">
              <div className="text-center mb-6 pb-6" style={{ borderBottom: "2px solid var(--primary)" }}>
                <h2 className="text-xl font-bold" style={{ color: "var(--primary)" }}>FORMULIR PENDAFTARAN SPMB</h2>
                <p className="text-sm" style={{ color: "var(--text-muted)" }}>SMP Muhammadiyah 1 Genteng - Tahun Ajaran 2026/2027</p>
              </div>

              <div className="text-center p-4 rounded-xl mb-6" style={{ background: "var(--badge-bg)", border: "1px solid var(--badge-text)" }}>
                <span className="font-bold text-sm" style={{ color: "var(--badge-text)", letterSpacing: "1px" }}>Nomor Pendaftaran: {detailItem.nomor_pendaftaran}</span>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-bold mb-3" style={{ color: "var(--primary)", borderBottom: "1px solid var(--card-border)", paddingBottom: "6px" }}>A. Data Siswa</h3>
                  <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
                    {[["Nama Lengkap", detailItem.nama_lengkap], ["NISN", detailItem.nisn], ["Tempat Lahir", detailItem.tempat_lahir], ["Tanggal Lahir", detailItem.tanggal_lahir], ["Jenis Kelamin", detailItem.jenis_kelamin === "L" ? "Laki-laki" : detailItem.jenis_kelamin === "P" ? "Perempuan" : "-"], ["Agama", detailItem.agama]].map(([label, value]) => (
                      <div key={label as string}>
                        <p className="text-[11px] uppercase tracking-wide" style={{ color: "var(--text-muted)" }}>{label as string}</p>
                        <p className="font-medium" style={{ color: "var(--text-primary)" }}>{value as string}</p>
                      </div>
                    ))}
                    <div className="col-span-2">
                      <p className="text-[11px] uppercase tracking-wide" style={{ color: "var(--text-muted)" }}>Alamat</p>
                      <p className="font-medium" style={{ color: "var(--text-primary)" }}>{detailItem.alamat}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-bold mb-3" style={{ color: "var(--primary)", borderBottom: "1px solid var(--card-border)", paddingBottom: "6px" }}>B. Data Orang Tua</h3>
                  <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
                    {[["Nama Ayah", detailItem.nama_ayah], ["Pekerjaan Ayah", detailItem.pekerjaan_ayah], ["Nama Ibu", detailItem.nama_ibu], ["Pekerjaan Ibu", detailItem.pekerjaan_ibu], ["No. HP Orang Tua", detailItem.no_hp_ortu]].map(([label, value]) => (
                      <div key={label as string}>
                        <p className="text-[11px] uppercase tracking-wide" style={{ color: "var(--text-muted)" }}>{label as string}</p>
                        <p className="font-medium" style={{ color: "var(--text-primary)" }}>{value as string}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-bold mb-3" style={{ color: "var(--primary)", borderBottom: "1px solid var(--card-border)", paddingBottom: "6px" }}>C. Data Sekolah & Program</h3>
                  <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
                    {[["SD/MI Asal", detailItem.nama_sekolah], ["Program Pilihan", detailItem.program_pilihan]].map(([label, value]) => (
                      <div key={label as string}>
                        <p className="text-[11px] uppercase tracking-wide" style={{ color: "var(--text-muted)" }}>{label as string}</p>
                        <p className="font-medium" style={{ color: "var(--text-primary)" }}>{value as string}</p>
                      </div>
                    ))}
                    <div className="col-span-2">
                      <p className="text-[11px] uppercase tracking-wide" style={{ color: "var(--text-muted)" }}>Alamat SD/MI</p>
                      <p className="font-medium" style={{ color: "var(--text-primary)" }}>{detailItem.alamat_sekolah}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-center mt-6 pt-6 text-xs" style={{ color: "var(--text-muted)", borderTop: "1px solid var(--card-border)" }}>
                Dicetak pada {new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
