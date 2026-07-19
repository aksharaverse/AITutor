// Page shell: safe area, background, centered 720px column on wide screens,
// optional minimal header (back + title). This replaces any nav chrome.
// `dotted` swaps the flat background for the dotted canvas (sign-in only).

import { router } from "expo-router";
import React, { useRef } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Branches } from "@/components/Branches";
import { DottedBackground } from "@/components/DottedBackground";
import { font, space, useTheme } from "@/lib/theme";

export function Screen({
  title,
  back,
  children,
  scroll = true,
  dotted = false,
  branches = false,
  footer,
  stickToBottom = false,
}: {
  title?: string;
  back?: boolean;
  children: React.ReactNode;
  scroll?: boolean;
  dotted?: boolean;
  branches?: boolean;
  /** Pinned below the scroll area, same centered column (chat composer). */
  footer?: React.ReactNode;
  /** Keep the scroll pinned to the end as content grows (streaming chat). */
  stickToBottom?: boolean;
}) {
  const t = useTheme();
  const insets = useSafeAreaInsets();
  const scrollRef = useRef<ScrollView>(null);

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

  const art = branches && (
    <View
      pointerEvents="none"
      style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
    >
      <Branches />
    </View>
  );

  const body = scroll ? (
    <ScrollView
      ref={scrollRef}
      style={{ flex: 1 }}
      contentContainerStyle={{ flexGrow: 1, alignItems: "center" }}
      onContentSizeChange={
        stickToBottom
          ? () => scrollRef.current?.scrollToEnd({ animated: false })
          : undefined
      }
    >
      {inner}
    </ScrollView>
  ) : (
    <View style={{ flex: 1, alignItems: "center" }}>{inner}</View>
  );

  const footerBar = footer && (
    <View style={{ width: "100%", alignItems: "center" }}>
      <View
        style={{
          width: "100%",
          maxWidth: 720,
          paddingHorizontal: space.m,
          paddingBottom: Math.max(space.m, insets.bottom),
          paddingTop: space.xs,
        }}
      >
        {footer}
      </View>
    </View>
  );

  if (dotted) {
    return (
      <DottedBackground style={{ paddingTop: insets.top }}>
        {art}
        {body}
        {footerBar}
      </DottedBackground>
    );
  }
  return (
    <View style={{ flex: 1, backgroundColor: t.bg, paddingTop: insets.top }}>
      {art}
      {body}
      {footerBar}
    </View>
  );
}
