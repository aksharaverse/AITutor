// Answer thread. id === "live" renders the currently streaming answer from
// the Zustand store; any other id loads a past session.

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect } from "react";
import { Text, View } from "react-native";

import { Bubble } from "@/components/Bubble";
import { Button } from "@/components/Button";
import { Screen } from "@/components/Screen";
import { api, type SessionItem } from "@/lib/api";
import { font, space, useTheme } from "@/lib/theme";
import { useStream } from "@/state/stream";

async function findSession(id: string): Promise<SessionItem | null> {
  let cursor: string | null = null;
  for (let page = 0; page < 5; page++) {
    const res: { items: SessionItem[]; next_cursor: string | null } = await api(
      `/v1/sessions${cursor ? `?cursor=${encodeURIComponent(cursor)}` : ""}`,
    );
    const hit = res.items.find((s) => s.id === id);
    if (hit) return hit;
    if (!res.next_cursor) break;
    cursor = res.next_cursor;
  }
  return null;
}

function LiveThread() {
  const t = useTheme();
  const s = useStream();
  const qc = useQueryClient();

  useEffect(() => {
    if (s.status === "done") {
      qc.invalidateQueries({ queryKey: ["sessions"] });
      qc.invalidateQueries({ queryKey: ["me"] });
    }
  }, [s.status, qc]);

  return (
    <View style={{ gap: space.l }}>
      <Bubble
        question={s.question}
        imageUrl={s.imageUrl}
        answer={s.answer || (s.status === "streaming" ? "" : s.answer)}
        streaming={s.status === "streaming"}
        sources={s.sources}
      />
      {s.status === "error" && (
        <Text style={[font.body, { color: t.danger }]}>{s.error}</Text>
      )}
      {s.status !== "streaming" && (
        <Button
          label="Ask another question"
          onPress={() => {
            s.reset();
            router.replace("/");
          }}
        />
      )}
    </View>
  );
}

function PastThread({ id }: { id: string }) {
  const t = useTheme();
  const { data, isLoading } = useQuery({
    queryKey: ["session", id],
    queryFn: () => findSession(id),
  });

  if (isLoading) return <Text style={[font.body, { color: t.muted }]}>Loading…</Text>;
  if (!data) return <Text style={[font.body, { color: t.muted }]}>Session not found.</Text>;
  return (
    <Bubble
      question={data.question}
      imageUrl={data.image_url}
      answer={data.answer ?? ""}
    />
  );
}

export default function Thread() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return (
    <Screen back title="Answer">
      {id === "live" ? <LiveThread /> : <PastThread id={id!} />}
    </Screen>
  );
}
