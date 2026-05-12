"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { GraduationCap, CheckCircle, AlertCircle, Loader2, ChevronLeft, ChevronRight, User, Users, School, ClipboardCheck, ArrowRight } from "lucide-react";
import Link from "next/link";

const formSchema = z.object({
  namaLengkap: z.string().min(2, "Nama lengkap minimal 2 karakter"),
  nisn: z.string().min(10, "NISN harus 10 digit").max(10),
  tempatLahir: z.string().min(2, "Tempat lahir wajib diisi"),
  tanggalLahir: z.string().min(1, "Tanggal lahir wajib diisi"),
  jenisKelamin: z.enum(["L", "P"]),
  agama: z.string().min(1, "Agama wajib dipilih"),
  alamat: z.string().min(10, "Alamat minimal 10 karakter"),
  namaAyah: z.string().min(2, "Nama ayah wajib diisi"),
  pekerjaanAyah: z.string().min(1, "Pekerjaan ayah wajib diisi"),
  noHpOrtu: z.string().min(10, "Nomor HP minimal 10 digit"),
  namaIbu: z.string().min(2, "Nama ibu wajib diisi"),
  pekerjaanIbu: z.string().min(1, "Pekerjaan ibu wajib diisi"),
  namaSekolah: z.string().min(2, "Nama sekolah asal wajib diisi"),
  alamatSekolah: z.string().min(5, "Alamat sekolah wajib diisi"),
  programPilihan: z.enum(["Reguler", "Tahfidz"]),
  agree: z.boolean().refine((val) => val === true, "Anda harus menyetujui persyaratan"),
});

type FormData = z.infer<typeof formSchema>;

const AgamaOptions = ["Islam", "Kristen", "Katolik", "Hindu", "Buddha", "Konghucu"];

const steps = [
  { id: 0, label: "Data Siswa", icon: User, fields: ["namaLengkap", "nisn", "tempatLahir", "tanggalLahir", "jenisKelamin", "agama", "alamat"] },
  { id: 1, label: "Data Orang Tua", icon: Users, fields: ["namaAyah", "pekerjaanAyah", "namaIbu", "pekerjaanIbu", "noHpOrtu"] },
  { id: 2, label: "Sekolah & Program", icon: School, fields: ["namaSekolah", "alamatSekolah", "programPilihan", "agree"] },
  { id: 3, label: "Konfirmasi", icon: ClipboardCheck, fields: [] },
];

function formatDate(dateStr: string) {
  if (!dateStr) return "-";
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
}

export default function DaftarPage() {
  const [step, setStep] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [nomorPendaftaran, setNomorPendaftaran] = useState("");
  const [submitError, setSubmitError] = useState("");

  const {
    register,
    handleSubmit,
    trigger,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      programPilihan: "Reguler",
    },
  });

  const allValues = watch();

  async function handleNext() {
    const currentStep = steps[step];
    const isValid = await trigger(currentStep.fields as any);
    if (isValid) setStep((s) => Math.min(s + 1, 3));
  }

  function handlePrev() {
    setStep((s) => Math.max(s - 1, 0));
  }

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    setSubmitError("");

    try {
      const res = await fetch("/api/spmb", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "register",
          nama_lengkap: data.namaLengkap,
          nisn: data.nisn,
          tempat_lahir: data.tempatLahir,
          tanggal_lahir: data.tanggalLahir,
          jenis_kelamin: data.jenisKelamin,
          agama: data.agama,
          alamat: data.alamat,
          nama_ayah: data.namaAyah,
          pekerjaan_ayah: data.pekerjaanAyah,
          no_hp_ortu: data.noHpOrtu,
          nama_ibu: data.namaIbu,
          pekerjaan_ibu: data.pekerjaanIbu,
          nama_sekolah: data.namaSekolah,
          alamat_sekolah: data.alamatSekolah,
          program_pilihan: data.programPilihan,
        }),
      });

      const result = await res.json();
      if (!res.ok) {
        setSubmitError(result.error || "Gagal mendaftar");
        return;
      }

      setNomorPendaftaran(result.nomor_pendaftaran);
      setIsSubmitted(true);
    } catch {
      setSubmitError("Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "var(--section-alt)" }}>
        <div className="rounded-2xl p-8 md:p-12 max-w-md w-full text-center shadow-2xl" style={{ background: "var(--card)" }}>
          <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6" style={{ background: "var(--badge-bg)" }}>
            <CheckCircle className="w-10 h-10" style={{ color: "var(--success)" }} />
          </div>
          <h1 className="text-2xl font-bold mb-4" style={{ color: "var(--text-primary)" }}>Pendaftaran Berhasil!</h1>
          <p className="mb-6" style={{ color: "var(--text-secondary)" }}>
            Terima kasih telah mendaftar. Simpan nomor registrasi untuk mengecek status pendaftaran.
          </p>
          <div className="p-4 rounded-lg mb-6" style={{ background: "var(--section-alt)" }}>
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>Nomor Registrasi</p>
            <p className="text-2xl font-bold" style={{ color: "var(--primary)" }}>{nomorPendaftaran}</p>
          </div>
          <div className="flex flex-col gap-3">
            <Link href="/spmb"
              className="inline-block font-semibold px-6 py-3 rounded-lg transition-colors"
              style={{ background: "var(--primary)", color: "white" }}>
              Cek Status Pendaftaran
            </Link>
            <Link href="/"
              className="inline-block font-semibold px-6 py-3 rounded-lg transition-colors"
              style={{ background: "var(--section-alt)", color: "var(--text-secondary)" }}>
              Kembali ke Beranda
            </Link>
          </div>
        </div>
      </div>
    );
  }

  function renderStepIndicator() {
    return (
      <div className="flex items-center justify-center mb-10 px-4">
        {steps.map((s, i) => {
          const isActive = step === i;
          const isDone = step > i;
          const Icon = s.icon;
          return (
            <div key={s.id} className="flex items-center">
              {i > 0 && (
                <div className="relative w-8 sm:w-16 md:w-24 h-0.5">
                  <div className="absolute inset-0" style={{ background: "var(--card-border)" }} />
                  <div
                    className="absolute inset-0 transition-all duration-500"
                    style={{
                      background: isDone ? "var(--success)" : isActive && step === i ? "var(--primary)" : "var(--card-border)",
                      width: isDone ? "100%" : isActive ? "50%" : "0%",
                    }}
                  />
                </div>
              )}
              <div className="flex flex-col items-center">
                <div
                  className="step-circle"
                  style={{
                    background: isDone ? "var(--success)" : isActive ? "var(--primary)" : "var(--card-border)",
                    color: isDone || isActive ? "white" : "var(--text-muted)",
                    boxShadow: isActive ? `0 0 0 4px color-mix(in srgb, var(--primary) 25%, transparent)` : "none",
                  }}
                >
                  {isDone ? <CheckCircle className="w-5 h-5" /> : <Icon className="w-4 h-4" />}
                </div>
                <span
                  className="text-xs font-medium mt-2 hidden sm:block whitespace-nowrap"
                  style={{ color: isDone || isActive ? "var(--text-primary)" : "var(--text-muted)" }}
                >
                  {s.label}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  function renderField(field: string) {
    const labelMap: Record<string, string> = {
      namaLengkap: "Nama Lengkap",
      nisn: "NISN",
      tempatLahir: "Tempat Lahir",
      tanggalLahir: "Tanggal Lahir",
      jenisKelamin: "Jenis Kelamin",
      agama: "Agama",
      alamat: "Alamat Lengkap",
      namaAyah: "Nama Ayah",
      pekerjaanAyah: "Pekerjaan Ayah",
      namaIbu: "Nama Ibu",
      pekerjaanIbu: "Pekerjaan Ibu",
      noHpOrtu: "Nomor HP Orang Tua",
      namaSekolah: "Nama SD/MI Asal",
      alamatSekolah: "Alamat SD/MI",
    };

    const placeholderMap: Record<string, string> = {
      namaLengkap: "Masukkan nama lengkap",
      nisn: "10 digit NISN",
      tempatLahir: "Kota/Kabupaten lahir",
      alamat: "Alamat lengkap (RT/RW, Desa, Kecamatan, Kabupaten)",
      namaAyah: "Nama ayah kandung",
      pekerjaanAyah: "Pekerjaan ayah",
      namaIbu: "Nama ibu kandung",
      pekerjaanIbu: "Pekerjaan ibu",
      noHpOrtu: "Contoh: 081234567890",
      namaSekolah: "Nama SD/MI asal",
      alamatSekolah: "Alamat sekolah asal",
    };

    const inputClass = "w-full px-4 py-2.5 border rounded-lg text-sm outline-none transition-all focus:ring-2";

    const sharedStyle = {
      borderColor: "var(--card-border)",
      background: "var(--background)",
      color: "var(--text-primary)",
    } as React.CSSProperties;

    const error = errors[field as keyof typeof errors];
    const label = labelMap[field] || field;

    if (field === "tanggalLahir") {
      return (
        <div key={field}>
          <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>{label}</label>
          <input {...register(field as any)} type="date"
            className={`${inputClass} ${error ? "ring-2 ring-red-500" : ""}`}
            style={sharedStyle} />
          {error && <p className="text-xs mt-1 flex items-center gap-1" style={{ color: "var(--error)" }}><AlertCircle className="w-3 h-3" /> {error.message as string}</p>}
        </div>
      );
    }

    if (field === "jenisKelamin") {
      return (
        <div key={field}>
          <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>{label}</label>
          <select {...register(field as any)}
            className={`${inputClass} ${error ? "ring-2 ring-red-500" : ""}`}
            style={sharedStyle}>
            <option value="">-- Pilih --</option>
            <option value="L">Laki-laki</option>
            <option value="P">Perempuan</option>
          </select>
          {error && <p className="text-xs mt-1 flex items-center gap-1" style={{ color: "var(--error)" }}><AlertCircle className="w-3 h-3" /> {error.message as string}</p>}
        </div>
      );
    }

    if (field === "agama") {
      return (
        <div key={field}>
          <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>{label}</label>
          <select {...register(field as any)}
            className={`${inputClass} ${error ? "ring-2 ring-red-500" : ""}`}
            style={sharedStyle}>
            <option value="">-- Pilih --</option>
            {AgamaOptions.map((a) => <option key={a} value={a}>{a}</option>)}
          </select>
          {error && <p className="text-xs mt-1 flex items-center gap-1" style={{ color: "var(--error)" }}><AlertCircle className="w-3 h-3" /> {error.message as string}</p>}
        </div>
      );
    }

    if (field === "alamat") {
      return (
        <div key={field} className="md:col-span-2">
          <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>{label}</label>
          <textarea {...register(field as any)} rows={3}
            className={`${inputClass} ${error ? "ring-2 ring-red-500" : ""}`}
            style={sharedStyle}
            placeholder={placeholderMap[field] || ""} />
          {error && <p className="text-xs mt-1 flex items-center gap-1" style={{ color: "var(--error)" }}><AlertCircle className="w-3 h-3" /> {error.message as string}</p>}
        </div>
      );
    }

    if (field === "agree") {
      return (
        <div key={field} className="flex items-start gap-3 p-4 rounded-lg" style={{ background: "var(--section-alt)" }}>
          <input {...register("agree")} type="checkbox"
            className="mt-1 w-5 h-5 rounded flex-shrink-0"
            style={{ accentColor: "var(--primary)" }} />
          <div>
            <label className="text-sm" style={{ color: "var(--text-secondary)" }}>
              Saya menyatakan bahwa data yang saya isi adalah benar. Saya bersedia mengikuti seluruh prosedur SPMB yang berlaku di SMP Muhammadiyah 1 Genteng.
            </label>
            {error && <p className="text-xs mt-1 flex items-center gap-1" style={{ color: "var(--error)" }}><AlertCircle className="w-3 h-3" /> {error.message as string}</p>}
          </div>
        </div>
      );
    }

    if (field === "programPilihan") {
      return (
        <div key={field}>
          <label className="block text-sm font-medium mb-3" style={{ color: "var(--text-secondary)" }}>{label}</label>
          <div className="grid md:grid-cols-2 gap-3">
            {["Reguler", "Tahfidz"].map((p) => (
              <label key={p}
                className={`flex items-center gap-3 p-4 border-2 rounded-xl cursor-pointer transition-all tap-scale ${
                  allValues.programPilihan === p ? "" : ""
                }`}
                style={{
                  borderColor: allValues.programPilihan === p ? "var(--primary)" : "var(--card-border)",
                  background: allValues.programPilihan === p ? "color-mix(in srgb, var(--primary) 8%, transparent)" : "var(--card)",
                }}
              >
                <input {...register("programPilihan")} type="radio" value={p} className="sr-only" />
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0`}
                  style={{ borderColor: allValues.programPilihan === p ? "var(--primary)" : "var(--card-border)" }}>
                  {allValues.programPilihan === p && (
                    <div className="w-3 h-3 rounded-full" style={{ background: "var(--primary)" }} />
                  )}
                </div>
                <div>
                  <span className="font-medium text-sm" style={{ color: "var(--text-primary)" }}>Program {p}</span>
                  <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                    {p === "Reguler" ? "Kurikulum Merdeka + keagamaan" : "Reguler + Tahfidz Al-Qur'an"}
                  </p>
                </div>
              </label>
            ))}
          </div>
          {error && <p className="text-xs mt-1 flex items-center gap-1" style={{ color: "var(--error)" }}><AlertCircle className="w-3 h-3" /> {error.message as string}</p>}
        </div>
      );
    }

    return (
      <div key={field}>
        <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>{label}</label>
        <input {...register(field as any)} type={field === "nisn" ? "text" : "text"}
          maxLength={field === "nisn" ? 10 : undefined}
          className={`${inputClass} ${error ? "ring-2 ring-red-500" : ""}`}
          style={sharedStyle}
          placeholder={placeholderMap[field] || ""} />
        {error && <p className="text-xs mt-1 flex items-center gap-1" style={{ color: "var(--error)" }}><AlertCircle className="w-3 h-3" /> {error.message as string}</p>}
      </div>
    );
  }

  function renderStepContent() {
    const v = allValues;

    switch (step) {
      case 0:
        return (
          <div className="rounded-xl p-6" style={{ background: "var(--card)" }}>
            <div className="flex items-center gap-3 mb-6 pb-3" style={{ borderBottom: "1px solid var(--card-border)" }}>
              <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: "color-mix(in srgb, var(--primary) 12%, transparent)" }}>
                <User className="w-5 h-5" style={{ color: "var(--primary)" }} />
              </div>
              <div>
                <h2 className="font-bold" style={{ color: "var(--text-primary)" }}>Data Siswa</h2>
                <p className="text-xs" style={{ color: "var(--text-muted)" }}>Lengkapi identitas calon siswa</p>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-5">
              {["namaLengkap", "nisn", "tempatLahir", "tanggalLahir", "jenisKelamin", "agama"].map(renderField)}
              {renderField("alamat")}
            </div>
          </div>
        );

      case 1:
        return (
          <div className="rounded-xl p-6" style={{ background: "var(--card)" }}>
            <div className="flex items-center gap-3 mb-6 pb-3" style={{ borderBottom: "1px solid var(--card-border)" }}>
              <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: "color-mix(in srgb, var(--primary) 12%, transparent)" }}>
                <Users className="w-5 h-5" style={{ color: "var(--primary)" }} />
              </div>
              <div>
                <h2 className="font-bold" style={{ color: "var(--text-primary)" }}>Data Orang Tua</h2>
                <p className="text-xs" style={{ color: "var(--text-muted)" }}>Informasi orang tua / wali calon siswa</p>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-5">
              {["namaAyah", "pekerjaanAyah", "namaIbu", "pekerjaanIbu", "noHpOrtu"].map(renderField)}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="rounded-xl p-6" style={{ background: "var(--card)" }}>
            <div className="flex items-center gap-3 mb-6 pb-3" style={{ borderBottom: "1px solid var(--card-border)" }}>
              <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: "color-mix(in srgb, var(--primary) 12%, transparent)" }}>
                <School className="w-5 h-5" style={{ color: "var(--primary)" }} />
              </div>
              <div>
                <h2 className="font-bold" style={{ color: "var(--text-primary)" }}>Data Sekolah & Program</h2>
                <p className="text-xs" style={{ color: "var(--text-muted)" }}>Asal sekolah dan pilihan program</p>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-5">
              {["namaSekolah", "alamatSekolah"].map(renderField)}
              <div className="md:col-span-2">{renderField("programPilihan")}</div>
              <div className="md:col-span-2">{renderField("agree")}</div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="rounded-xl p-6" style={{ background: "var(--card)" }}>
            <div className="flex items-center gap-3 mb-6 pb-3" style={{ borderBottom: "1px solid var(--card-border)" }}>
              <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: "color-mix(in srgb, var(--primary) 12%, transparent)" }}>
                <ClipboardCheck className="w-5 h-5" style={{ color: "var(--primary)" }} />
              </div>
              <div>
                <h2 className="font-bold" style={{ color: "var(--text-primary)" }}>Konfirmasi Data</h2>
                <p className="text-xs" style={{ color: "var(--text-muted)" }}>Periksa kembali data sebelum mendaftar</p>
              </div>
            </div>

            {submitError && (
              <div className="flex items-center gap-2 p-4 rounded-xl mb-6" style={{ background: "rgba(239,68,68,0.1)", color: "var(--error)" }}>
                <AlertCircle className="w-5 h-5" />
                <span className="text-sm font-medium">{submitError}</span>
              </div>
            )}

            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-semibold mb-3 flex items-center gap-2" style={{ color: "var(--text-primary)" }}>
                  <User className="w-4 h-4" style={{ color: "var(--primary)" }} /> Data Siswa
                </h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  {[
                    ["Nama Lengkap", v.namaLengkap],
                    ["NISN", v.nisn],
                    ["Tempat Lahir", v.tempatLahir],
                    ["Tanggal Lahir", formatDate(v.tanggalLahir)],
                    ["Jenis Kelamin", v.jenisKelamin === "L" ? "Laki-laki" : "Perempuan"],
                    ["Agama", v.agama],
                  ].map(([label, value]) => (
                    <div key={label as string} className="px-3 py-2 rounded-lg" style={{ background: "var(--section-alt)" }}>
                      <p className="text-xs" style={{ color: "var(--text-muted)" }}>{label as string}</p>
                      <p className="font-medium text-sm" style={{ color: "var(--text-primary)" }}>{value as string}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold mb-3 flex items-center gap-2" style={{ color: "var(--text-primary)" }}>
                  <Users className="w-4 h-4" style={{ color: "var(--primary)" }} /> Data Orang Tua
                </h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  {[
                    ["Nama Ayah", v.namaAyah],
                    ["Pekerjaan Ayah", v.pekerjaanAyah],
                    ["Nama Ibu", v.namaIbu],
                    ["Pekerjaan Ibu", v.pekerjaanIbu],
                    ["No. HP Orang Tua", v.noHpOrtu],
                  ].map(([label, value]) => (
                    <div key={label as string} className="px-3 py-2 rounded-lg" style={{ background: "var(--section-alt)" }}>
                      <p className="text-xs" style={{ color: "var(--text-muted)" }}>{label as string}</p>
                      <p className="font-medium text-sm" style={{ color: "var(--text-primary)" }}>{value as string}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold mb-3 flex items-center gap-2" style={{ color: "var(--text-primary)" }}>
                  <School className="w-4 h-4" style={{ color: "var(--primary)" }} /> Sekolah & Program
                </h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  {[
                    ["SD/MI Asal", v.namaSekolah],
                    ["Alamat SD/MI", v.alamatSekolah],
                    ["Program", v.programPilihan],
                  ].map(([label, value]) => (
                    <div key={label as string} className="px-3 py-2 rounded-lg" style={{ background: "var(--section-alt)" }}>
                      <p className="text-xs" style={{ color: "var(--text-muted)" }}>{label as string}</p>
                      <p className="font-medium text-sm" style={{ color: "var(--text-primary)" }}>{value as string}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
    }
  }

  return (
    <div className="min-h-screen" style={{ background: "var(--section-alt)" }}>
      {/* Header */}
      <div className="hero-gradient py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: "rgba(255,255,255,0.2)" }}>
            <GraduationCap className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Formulir SPMB Online</h1>
          <p className="hero-gradient-sub">SMP Muhammadiyah 1 Genteng - Tahun Ajaran 2026/2027</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 pb-16">
        <div className="rounded-2xl p-6 md:p-8 shadow-xl" style={{ background: "var(--card)" }}>
          {/* Step Indicator */}
          {renderStepIndicator()}

          {/* Step Content */}
          <form onSubmit={handleSubmit(onSubmit)}>
            {renderStepContent()}

            {/* Navigation */}
            <div className="flex items-center justify-between mt-8 pt-6" style={{ borderTop: "1px solid var(--card-border)" }}>
              {step > 0 ? (
                <button type="button" onClick={handlePrev}
                  className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-sm font-medium transition-all tap-scale"
                  style={{ background: "var(--section-alt)", color: "var(--text-secondary)" }}>
                  <ChevronLeft className="w-4 h-4" /> Sebelumnya
                </button>
              ) : (
                <div />
              )}

              {step < 3 ? (
                <button type="button" onClick={handleNext}
                  className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl text-sm font-semibold text-white transition-all tap-scale"
                  style={{ background: "var(--primary)" }}>
                  Selanjutnya <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button type="submit" disabled={isLoading}
                  className="flex items-center gap-2 px-8 py-3 rounded-xl text-sm font-bold text-white transition-all tap-scale disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ background: "var(--secondary)", color: "#0F172A" }}>
                  {isLoading ? <><Loader2 className="w-5 h-5 animate-spin" /> Mengirim...</> : <><ArrowRight className="w-5 h-5" /> Daftar Sekarang</>}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
