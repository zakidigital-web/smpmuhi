export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-t-transparent rounded-full animate-spin mx-auto mb-4" style={{ borderColor: "var(--primary)", borderTopColor: "transparent" }} />
        <p style={{ color: "var(--text-secondary)" }}>Memuat...</p>
      </div>
    </div>
  );
}
