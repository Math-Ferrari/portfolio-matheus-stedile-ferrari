import type { MetadataRoute } from "next";

import { defaultContent } from "@/data/content";

export default function robots(): MetadataRoute.Robots {
  const { site } = defaultContent;

  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${site.url}/sitemap.xml`,
  };
}
