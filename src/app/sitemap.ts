import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://smpmuhammadiyah1genteng.sch.id";

  const routes = [
    "", "/profil", "/program", "/berita", "/galeri", "/agenda", "/spmb", "/spmb/daftar", "/kontak",
  ];

  return routes.map((route) => ({
    url: `${base}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1.0 : 0.8,
  }));
}
