// Answer thread. id === "live" renders the streaming thread from the Zustand
// store (all exchanges, bottom composer for follow-ups, feedback); any other
// id loads a past session directly via GET /v1/sessions/{id}.

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { Pressable, Text, View } from "react-native";

import { Bubble } from "@/components/Bubble";
import { Composer } from "@/components/Composer";
import { Feedback } from "@/components/Feedback";
import { Screen } from "@/components/Screen";
import { ApiError, getSession } from "@/lib/api";
import { font, space, useTheme } from "@/lib/theme";
import { useStream } from "@/state/stream";

// Raw fetch/SSE errors read like stack traces; say something a student can act on.
function humanize(message: string | null): string {
  if (!message) return "Something went wrong.";
  if (/failed to fetch|network|load failed/i.test(message))
    return "Can't reach the server right now. Check your connection and try again.";
  return message;
}

function ErrorCard({ message, onRetry }: { message: string | null; onRetry: () => void }) {
  const t = useTheme();
  return (
    <View
      style={{
        backgroundColor: t.card,
        borderWidth: 1,
        borderColor: t.border,
        borderRadius: 12,
        padding: space.m,
        gap: space.s,
        alignSelf: "stretch",
      }}
    >
      <Text style={[font.body, { color: t.fg, fontWeight: "600" }]}>
        Couldn't get an answer
      </Text>
      <Text style={[font.body, { color: t.muted }]}>{humanize(message)}</Text>
      <Pressable
        onPress={onRetry}
        style={({ pressed }) => ({
          alignSelf: "flex-start",
          borderWidth: 1,
          borderColor: t.border,
          borderRadius: 8,
          paddingVertical: 8,
          paddingHorizontal: space.m,
          backgroundColor: pressed ? t.bg : "transparent",
        })}
      >
        <Text style={[font.body, { color: t.fg, fontWeight: "600" }]}>Try again</Text>
      </Pressable>
    </View>
  );
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
    <View style={{ gap: space.xl, paddingBottom: space.l }}>
      {s.history.map((ex, i) => (
        <View key={ex.sessionId ?? i} style={{ gap: space.s }}>
          <Bubble
            question={ex.question}
            imageUrl={ex.imageUrl}
            answer={ex.answer}
            sources={ex.sources}
          />
          {ex.sessionId && <Feedback sessionId={ex.sessionId} />}
        </View>
      ))}

      {s.status !== "idle" && (
        <View style={{ gap: space.s }}>
          <Bubble
            question={s.question}
            imageUrl={s.imageUrl}
            answer={s.answer}
            streaming={s.status === "streaming"}
            sources={s.sources}
          />
          {s.status === "done" && s.sessionId && <Feedback sessionId={s.sessionId} />}
        </View>
      )}

      {s.status === "error" && <ErrorCard message={s.error} onRetry={s.retry} />}
    </View>
  );
}

// The bottom composer lives outside the scroll area, Claude-style: always
// visible, disabled while an answer is streaming.
function FollowUpComposer() {
  const s = useStream();
  const [text, setText] = useState("");

  function send() {
    const trimmed = text.trim();
    if (!trimmed || s.status !== "done") return;
    setText("");
    s.followUp(trimmed);
  }

  return (
    <Composer
      value={text}
      onChangeText={setText}
      photo={null}
      onPhoto={() => {}}
      onSubmit={send}
      busy={s.status !== "done"}
      placeholder="Ask a follow-up…"
      attach={false}
    />
  );
}

function PastThread({ id }: { id: string }) {
  const t = useTheme();
  const { data, isLoading, error } = useQuery({
    queryKey: ["session", id],
    queryFn: () => getSession(id),
    retry: (count, err) =>
      !(err instanceof ApiError && err.status === 404) && count < 2,
  });

  if (isLoading) return <Text style={[font.body, { color: t.muted }]}>Loading…</Text>;
  if (error || !data)
    return <Text style={[font.body, { color: t.muted }]}>Session not found.</Text>;
  return (
    <View style={{ gap: space.s }}>
      <Bubble
        question={data.question}
        imageUrl={data.image_url}
        answer={data.answer ?? ""}
      />
      <Feedback sessionId={data.id} initial={data.feedback_rating} />
    </View>
  );
}

export default function Thread() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const live = id === "live";
  const status = useStream((s) => s.status);
  return (
    <Screen
      back
      stickToBottom={live && status === "streaming"}
      footer={live && status !== "idle" && status !== "error" ? <FollowUpComposer /> : undefined}
    >
      {live ? <LiveThread /> : <PastThread id={id!} />}
    </Screen>
  );
}
