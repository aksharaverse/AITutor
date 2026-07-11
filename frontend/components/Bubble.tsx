// One Q&A exchange: the question (with optional photo) and the answer with
// live LaTeX rendering. Used by both the live thread and history threads.

import React from "react";
import { Image, Text, View } from "react-native";

import { Badge } from "@/components/Badge";
import { MathText } from "@/lib/math";
import { font, space, useTheme } from "@/lib/theme";

export function Bubble({
  question,
  imageUrl,
  answer,
  streaming,
  sources,
}: {
  question: string;
  imageUrl?: string | null;
  answer: string;
  streaming?: boolean;
  sources?: string[];
}) {
  const t = useTheme();
  return (
    <View style={{ gap: space.m }}>
      <View>
        <Text style={[font.small, { color: t.muted, marginBottom: space.xs }]}>You asked</Text>
        <Text style={[font.bodyLg, { color: t.fg, fontWeight: "600" }]}>{question}</Text>
        {imageUrl ? (
          <Image
            source={{ uri: imageUrl }}
            style={{
              width: "100%", height: 180, borderRadius: 10,
              marginTop: space.s, resizeMode: "contain", backgroundColor: t.card,
            }}
          />
        ) : null}
      </View>

      <View
        style={{
          backgroundColor: t.card,
          borderWidth: 1,
          borderColor: t.border,
          borderRadius: 12,
          padding: space.m,
        }}
      >
        <MathText style={{ ...font.body, color: t.fg }}>
          {answer + (streaming ? " ▍" : "")}
        </MathText>
        {sources && sources.length > 0 && (
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: space.s, marginTop: space.m }}>
            {sources.map((s) => (
              <Badge key={s} label={s} />
            ))}
          </View>
        )}
      </View>
    </View>
  );
}
