// Sign-in: centered column on the dotted canvas with growing branch art.
// Google first, hairline "or" divider, then email/password. Elements tagged
// data-animate get the GSAP entrance stagger on web.

import React, { useState } from "react";
import { Platform, Pressable, Text, View } from "react-native";

import { Brand } from "@/components/Brand";
import { Button } from "@/components/Button";
import { GoogleG } from "@/components/GoogleG";
import { Input } from "@/components/Input";
import { Screen } from "@/components/Screen";
import { supabase } from "@/lib/auth";
import { useEntrance } from "@/lib/entrance";
import { font, space, useTheme } from "@/lib/theme";

// react-native-web forwards dataSet to data-* attributes; RN types omit it.
const animate = { dataSet: { animate: "1" } } as object;

function GoogleButton({ onPress }: { onPress: () => void }) {
  const t = useTheme();
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: space.s + 2,
        backgroundColor: t.card,
        borderWidth: 1,
        borderColor: t.border,
        borderRadius: 10,
        paddingVertical: 12,
        opacity: pressed ? 0.85 : 1,
      })}
    >
      <GoogleG size={18} />
      <Text style={[font.body, { color: t.fg, fontWeight: "600" }]}>
        Continue with Google
      </Text>
    </Pressable>
  );
}

function Divider() {
  const t = useTheme();
  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: space.m }}>
      <View style={{ flex: 1, height: 1, backgroundColor: t.border }} />
      <Text style={[font.small, { color: t.muted }]}>or</Text>
      <View style={{ flex: 1, height: 1, backgroundColor: t.border }} />
    </View>
  );
}

export default function SignIn() {
  const t = useTheme();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  useEntrance();

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
    <Screen dotted branches>
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignSelf: "center",
          width: "100%",
          maxWidth: 360,
          gap: space.m,
        }}
      >
        <View {...animate} style={{ alignItems: "center", marginBottom: space.l }}>
          <Brand size="lg" />
          <Text style={[font.body, { color: t.muted, marginTop: space.s, textAlign: "center" }]}>
            Grounded, step-by-step answers for JEE & NEET.
          </Text>
        </View>

        {Platform.OS === "web" && (
          <>
            <View {...animate}>
              <GoogleButton onPress={google} />
            </View>
            <View {...animate}>
              <Divider />
            </View>
          </>
        )}

        <View {...animate} style={{ gap: space.m }}>
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
        </View>

        {error && <Text style={[font.small, { color: t.danger }]}>{error}</Text>}
        {notice && <Text style={[font.small, { color: t.muted }]}>{notice}</Text>}

        <View {...animate} style={{ gap: space.m }}>
          <Button
            label={mode === "signin" ? "Sign in" : "Create account"}
            onPress={submit}
            loading={busy}
            disabled={!email || !password}
          />
          <Button
            label={mode === "signin" ? "New here? Create an account" : "Have an account? Sign in"}
            variant="ghost"
            onPress={() => setMode(mode === "signin" ? "signup" : "signin")}
          />
        </View>
      </View>
    </Screen>
  );
}
