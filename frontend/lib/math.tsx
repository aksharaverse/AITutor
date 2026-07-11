// Native math fallback for the web-first MVP: LaTeX shown as styled code.
// Phase 2 (native apps) swaps this for a WebView running a local KaTeX bundle
// — see AITutor.md §4.2. The web renderer (math.web.tsx) does real KaTeX.

import React from "react";
import { Platform, Text, type TextStyle } from "react-native";

import { segmentLatex } from "@/lib/latex";

const mono = Platform.select({ ios: "Menlo", default: "monospace" });

export function MathText({ children, style }: { children: string; style?: TextStyle }) {
  const segments = segmentLatex(children);
  return (
    <Text style={style}>
      {segments.map((s, i) =>
        s.type === "text" ? (
          <Text key={i} style={style}>{s.content}</Text>
        ) : (
          <Text key={i} style={[style, { fontFamily: mono, opacity: 0.9 }]}>
            {s.type === "block" ? `\n${s.content}\n` : s.content}
          </Text>
        ),
      )}
    </Text>
  );
}
