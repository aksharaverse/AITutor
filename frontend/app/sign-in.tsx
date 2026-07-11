import React, { useState } from "react";
import { Platform, Text, View } from "react-native";

import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { Screen } from "@/components/Screen";
import { supabase } from "@/lib/auth";
import { font, space, useTheme } from "@/lib/theme";

export default function SignIn() {
  const t = useTheme();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  async function submit() {
    setBusy(true);
    setError(null);
    setNotice(null);
    const { error } =
      mode === "signin"
        ? await supabase.auth.signInWithPassword({ email, password })
        : await supabase.auth.signUp({ email, password });
    if (error) setError(error.message);
    else if (mode === "signup") setNotice("Check your email to confirm your account.");
    setBusy(false);
    // On success the auth gate in _layout redirects automatically.
  }

  async function google() {
    setError(null);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: Platform.OS === "web" ? { redirectTo: window.location.origin } : {},
    });
    if (error) setError(error.message);
  }

  return (
    <Screen>
      <View style={{ flex: 1, justifyContent: "center", gap: space.m }}>
        <Text style={[font.display, { color: t.fg }]}>AITutor</Text>
        <Text style={[font.body, { color: t.muted, marginBottom: space.l }]}>
          Grounded, step-by-step answers for JEE & NEET.
        </Text>

        <Input
          placeholder="Email"
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
        <Input
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        {error && <Text style={[font.small, { color: t.danger }]}>{error}</Text>}
        {notice && <Text style={[font.small, { color: t.muted }]}>{notice}</Text>}

        <Button
          label={mode === "signin" ? "Sign in" : "Create account"}
          onPress={submit}
          loading={busy}
          disabled={!email || !password}
        />
        {Platform.OS === "web" && (
          <Button label="Continue with Google" variant="ghost" onPress={google} />
        )}
        <Button
          label={mode === "signin" ? "New here? Create an account" : "Have an account? Sign in"}
          variant="ghost"
          onPress={() => setMode(mode === "signin" ? "signup" : "signin")}
        />
      </View>
    </Screen>
  );
}
