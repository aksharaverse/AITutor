import React from "react";
import { Text, View } from "react-native";

import { font, useTheme } from "@/lib/theme";

export function Badge({ label, accent }: { label: string; accent?: boolean }) {
  const t = useTheme();
  return (
    <View
      style={{
        alignSelf: "flex-start",
        borderRadius: 6,
        paddingHorizontal: 8,
        paddingVertical: 2,
        backgroundColor: accent ? t.accent : "transparent",
        borderWidth: accent ? 0 : 1,
        borderColor: t.border,
      }}
    >
      <Text style={[font.small, { color: accent ? t.accentFg : t.muted, fontWeight: "600" }]}>
        {label}
      </Text>
    </View>
  );
}
