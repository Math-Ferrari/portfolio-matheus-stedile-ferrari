import type { MetadataRoute } from "next";

import { defaultContent } from "@/data/content";
import { projectSlugs } from "@/data/projects";

export default function sitemap(): MetadataRoute.Sitemap {
  const { site } = defaultContent;
  const lastModified = new Date();

  return [
    { url: site.url, lastModified, changeFrequency: "monthly", priority: 1 },
    {
      url: `${site.url}/projetos`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    ...projectSlugs.map((slug) => ({
      url: `${site.url}/projetos/${slug}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
