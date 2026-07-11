// Web math renderer: KaTeX to HTML, inline in the RN-Web DOM tree.
// The native counterpart lives in math.tsx (Metro picks per platform).

import katex from "katex";
import "katex/dist/katex.min.css";
import React from "react";
import { Text, type TextStyle } from "react-native";

import { segmentLatex } from "@/lib/latex";

function Katex({ tex, display }: { tex: string; display: boolean }) {
  let html: string;
  try {
    html = katex.renderToString(tex, { displayMode: display, throwOnError: false });
  } catch {
    html = tex;
  }
  return (
    <span
      style={display ? { display: "block", margin: "8px 0", overflowX: "auto" } : undefined}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

export function MathText({ children, style }: { children: string; style?: TextStyle }) {
  const segments = segmentLatex(children);
  return (
    <Text style={style}>
      {segments.map((s, i) =>
        s.type === "text" ? (
          <Text key={i} style={style}>{s.content}</Text>
        ) : (
          <Katex key={i} tex={s.content} display={s.type === "block"} />
        ),
      )}
    </Text>
  );
}
