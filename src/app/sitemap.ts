import type { MetadataRoute } from "next";

import site from "@/data/site.json";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: site.openGraph.url,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
