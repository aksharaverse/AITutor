import React from "react";
import { TextInput, type TextInputProps } from "react-native";

import { font, space, useTheme } from "@/lib/theme";

export function Input(props: TextInputProps) {
  const t = useTheme();
  return (
    <TextInput
      placeholderTextColor={t.muted}
      {...props}
      style={[
        font.body,
        {
          color: t.fg,
          backgroundColor: t.card,
          borderWidth: 1,
          borderColor: t.border,
          borderRadius: 10,
          padding: space.m,
        },
        props.multiline && { minHeight: 120, textAlignVertical: "top" },
        props.style,
      ]}
    />
  );
}
