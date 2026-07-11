// Ask — the home screen. One input, one optional photo, one button.

import { useQuery } from "@tanstack/react-query";
import * as ImagePicker from "expo-image-picker";
import { Link, router } from "expo-router";
import React, { useState } from "react";
import { Image, Pressable, Text, View } from "react-native";

import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { Screen } from "@/components/Screen";
import { api, uploadQuestionImage, type Me } from "@/lib/api";
import { font, space, useTheme } from "@/lib/theme";
import { useStream } from "@/state/stream";

export default function Ask() {
  const t = useTheme();
  const ask = useStream((s) => s.ask);
  const [text, setText] = useState("");
  const [photo, setPhoto] = useState<{ base64: string; mime: string; uri: string } | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { data: me } = useQuery({ queryKey: ["me"], queryFn: () => api<Me>("/v1/me") });

  async function pickPhoto() {
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: "images",
      quality: 0.8,
      base64: true,
    });
    const asset = res.assets?.[0];
    if (!res.canceled && asset?.base64) {
      setPhoto({ base64: asset.base64, mime: asset.mimeType ?? "image/jpeg", uri: asset.uri });
    }
  }

  async function submit() {
    setBusy(true);
    setError(null);
    try {
      const image_url = photo
        ? await uploadQuestionImage(photo.base64, photo.mime)
        : undefined;
      ask({ text: text.trim() || undefined, image_url });
      setText("");
      setPhoto(null);
      router.push("/thread/live");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Screen>
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "baseline" }}>
        <Text style={[font.display, { color: t.fg }]}>AITutor</Text>
        <View style={{ flexDirection: "row", gap: space.l }}>
          <Link href="/history" style={[font.body, { color: t.muted }]}>History</Link>
          <Link href="/account" style={[font.body, { color: t.muted }]}>Account</Link>
        </View>
      </View>

      <View style={{ flex: 1, justifyContent: "center", gap: space.m }}>
        <Input
          placeholder="Paste or type a JEE/NEET problem…"
          multiline
          value={text}
          onChangeText={setText}
        />

        {photo ? (
          <Pressable onPress={() => setPhoto(null)}>
            <Image
              source={{ uri: photo.uri }}
              style={{ width: 96, height: 96, borderRadius: 10, backgroundColor: t.card }}
            />
            <Text style={[font.small, { color: t.muted, marginTop: space.xs }]}>tap to remove</Text>
          </Pressable>
        ) : (
          <Button label="＋ Attach a photo of the problem" variant="ghost" onPress={pickPhoto} />
        )}

        {error && <Text style={[font.small, { color: t.danger }]}>{error}</Text>}

        <Button
          label="Ask"
          onPress={submit}
          loading={busy}
          disabled={!text.trim() && !photo}
        />

        {me && me.questions_remaining_today !== null && (
          <Text style={[font.small, { color: t.muted, textAlign: "center" }]}>
            {me.questions_remaining_today} of {me.free_daily_limit} free questions left today
          </Text>
        )}
      </View>
    </Screen>
  );
}
