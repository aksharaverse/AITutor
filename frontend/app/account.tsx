import { useQuery, useQueryClient } from "@tanstack/react-query";
import * as Linking from "expo-linking";
import React, { useState } from "react";
import { Alert, Platform, Text, View } from "react-native";

import { Badge } from "@/components/Badge";
import { Button } from "@/components/Button";
import { Screen } from "@/components/Screen";
import { api, type Me } from "@/lib/api";
import { supabase } from "@/lib/auth";
import { font, space, useTheme } from "@/lib/theme";

function confirmAsync(title: string, message: string): Promise<boolean> {
  if (Platform.OS === "web") {
    return Promise.resolve(window.confirm(`${title}\n\n${message}`));
  }
  return new Promise((resolve) =>
    Alert.alert(title, message, [
      { text: "Cancel", style: "cancel", onPress: () => resolve(false) },
      { text: "Delete", style: "destructive", onPress: () => resolve(true) },
    ]),
  );
}

export default function Account() {
  const t = useTheme();
  const qc = useQueryClient();
  const [busy, setBusy] = useState<"upgrade" | "delete" | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { data: me } = useQuery({ queryKey: ["me"], queryFn: () => api<Me>("/v1/me") });

  async function upgrade() {
    setBusy("upgrade");
    setError(null);
    try {
      const { checkout_url } = await api<{ checkout_url: string }>(
        "/v1/billing/checkout",
        { method: "POST" },
      );
      if (Platform.OS === "web") window.location.href = checkout_url;
      else await Linking.openURL(checkout_url);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Checkout failed");
    } finally {
      setBusy(null);
    }
  }

  async function deleteAccount() {
    const ok = await confirmAsync(
      "Delete account?",
      "This permanently removes your account and all your questions. This cannot be undone.",
    );
    if (!ok) return;
    setBusy("delete");
    try {
      await api<void>("/v1/me", { method: "DELETE" });
      await supabase.auth.signOut();
      qc.clear();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Delete failed");
      setBusy(null);
    }
  }

  return (
    <Screen back title="Account">
      <View style={{ gap: space.l }}>
        <View style={{ gap: space.s }}>
          <Text style={[font.body, { color: t.fg }]}>{me?.email ?? "…"}</Text>
          <Badge label={me?.plan === "pro" ? "PRO" : "FREE"} accent={me?.plan === "pro"} />
          {me && me.questions_remaining_today !== null && (
            <Text style={[font.small, { color: t.muted }]}>
              {me.questions_remaining_today} of {me.free_daily_limit} free questions left today
            </Text>
          )}
          {me?.plan === "pro" && me.plan_expires_at && (
            <Text style={[font.small, { color: t.muted }]}>
              Renews {new Date(me.plan_expires_at).toLocaleDateString()}
            </Text>
          )}
        </View>

        {error && <Text style={[font.small, { color: t.danger }]}>{error}</Text>}

        {me?.plan !== "pro" && (
          <Button
            label="Upgrade to Pro — unlimited questions"
            onPress={upgrade}
            loading={busy === "upgrade"}
          />
        )}
        <Button label="Sign out" variant="ghost" onPress={() => supabase.auth.signOut()} />
        <Button
          label="Delete account & data"
          variant="danger"
          onPress={deleteAccount}
          loading={busy === "delete"}
        />
      </View>
    </Screen>
  );
}
