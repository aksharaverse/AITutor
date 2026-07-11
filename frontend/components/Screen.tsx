// Page shell: safe area, background, centered 720px column on wide screens,
// optional minimal header (back + title). This replaces any nav chrome.

import { router } from "expo-router";
import React from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { font, space, useTheme } from "@/lib/theme";

export function Screen({
  title,
  back,
  children,
  scroll = true,
}: {
  title?: string;
  back?: boolean;
  children: React.ReactNode;
  scroll?: boolean;
}) {
  const t = useTheme();
  const insets = useSafeAreaInsets();

  const inner = (
    <View style={{ flex: 1, width: "100%", maxWidth: 720, padding: space.m }}>
      {(title || back) && (
        <View style={{ flexDirection: "row", alignItems: "center", marginBottom: space.l }}>
          {back && (
            <Pressable
              onPress={() => (router.canGoBack() ? router.back() : router.replace("/"))}
              hitSlop={12}
              style={{ marginRight: space.m }}
            >
              <Text style={[font.bodyLg, { color: t.muted }]}>←</Text>
            </Pressable>
          )}
          {title && <Text style={[font.title, { color: t.fg }]}>{title}</Text>}
        </View>
      )}
      {children}
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: t.bg, paddingTop: insets.top }}>
      {scroll ? (
        <ScrollView contentContainerStyle={{ flexGrow: 1, alignItems: "center" }}>
          {inner}
        </ScrollView>
      ) : (
        <View style={{ flex: 1, alignItems: "center" }}>{inner}</View>
      )}
    </View>
  );
}
