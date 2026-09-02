import { ImageResponse } from "next/og";

import { defaultContent } from "@/data/content";
import { splitHighlight } from "@/lib/utils";

const { hero, site } = defaultContent;

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = site.title;

/** Imagem de Open Graph gerada a partir do conteúdo do site — sem assets externos. */
export default function OpengraphImage() {
  const { before, match, after } = splitHighlight(hero.title, hero.highlight);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#11100e",
          color: "#f3f1eb",
          padding: "72px 80px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div style={{ width: 6, height: 34, backgroundColor: "#78ad8a" }} />
          <div style={{ fontSize: 26, letterSpacing: 3, color: "#a09e9b" }}>{site.name}</div>
        </div>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            fontSize: 78,
            lineHeight: 1.08,
            letterSpacing: -2,
            maxWidth: 940,
          }}
        >
          <span>{before}</span>
          {match ? <span style={{ color: "#78ad8a" }}>{match}</span> : null}
          <span>{after}</span>
        </div>

        <div
          style={{
            display: "flex",
            gap: 40,
            fontSize: 22,
            color: "#a09e9b",
            borderTop: "1px solid #262523",
            paddingTop: 28,
          }}
        >
          {hero.disciplines.map((discipline) => (
            <div key={discipline}>{discipline}</div>
          ))}
        </div>
      </div>
    ),
    size,
  );
}
