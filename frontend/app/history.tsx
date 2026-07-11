import { useInfiniteQuery } from "@tanstack/react-query";
import { router } from "expo-router";
import React from "react";
import { FlatList, Pressable, Text, View } from "react-native";

import { Screen } from "@/components/Screen";
import { api, type SessionItem } from "@/lib/api";
import { font, space, useTheme } from "@/lib/theme";

type Page = { items: SessionItem[]; next_cursor: string | null };

export default function History() {
  const t = useTheme();
  const q = useInfiniteQuery({
    queryKey: ["sessions"],
    initialPageParam: null as string | null,
    queryFn: ({ pageParam }) =>
      api<Page>(`/v1/sessions${pageParam ? `?cursor=${encodeURIComponent(pageParam)}` : ""}`),
    getNextPageParam: (last) => last.next_cursor,
  });

  const items = q.data?.pages.flatMap((p) => p.items) ?? [];

  return (
    <Screen back title="History" scroll={false}>
      <FlatList
        data={items}
        keyExtractor={(s) => s.id}
        onEndReached={() => q.hasNextPage && q.fetchNextPage()}
        ListEmptyComponent={
          <Text style={[font.body, { color: t.muted }]}>
            {q.isLoading ? "Loading…" : "No questions yet. Ask your first one."}
          </Text>
        }
        renderItem={({ item }) => (
          <Pressable
            onPress={() => router.push(`/thread/${item.id}`)}
            style={{
              paddingVertical: space.m,
              borderBottomWidth: 1,
              borderBottomColor: t.border,
              gap: space.xs,
            }}
          >
            <Text numberOfLines={2} style={[font.body, { color: t.fg }]}>
              {item.question}
            </Text>
            <Text style={[font.small, { color: t.muted }]}>
              {new Date(item.created_at).toLocaleString()}
            </Text>
          </Pressable>
        )}
      />
    </Screen>
  );
}
