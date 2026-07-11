import React from "react";
import { ActivityIndicator, Pressable, Text } from "react-native";

import { font, space, useTheme } from "@/lib/theme";

export function Button({
  label,
  onPress,
  variant = "primary",
  disabled,
  loading,
}: {
  label: string;
  onPress: () => void;
  variant?: "primary" | "ghost" | "danger";
  disabled?: boolean;
  loading?: boolean;
}) {
  const t = useTheme();
  const bg = variant === "primary" ? t.accent : "transparent";
  const fg =
    variant === "primary" ? t.accentFg : variant === "danger" ? t.danger : t.fg;

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => ({
        backgroundColor: bg,
        borderWidth: variant === "ghost" ? 1 : 0,
        borderColor: t.border,
        borderRadius: 10,
        paddingVertical: 12,
        paddingHorizontal: space.l,
        alignItems: "center",
        opacity: disabled || loading ? 0.5 : pressed ? 0.85 : 1,
      })}
    >
      {loading ? (
        <ActivityIndicator color={fg} />
      ) : (
        <Text style={[font.body, { color: fg, fontWeight: "600" }]}>{label}</Text>
      )}
    </Pressable>
  );
}
