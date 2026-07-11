import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack, useRouter, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect } from "react";

import { useSession } from "@/lib/auth";
import { useTheme } from "@/lib/theme";

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1, staleTime: 30_000 } },
});

function AuthGate({ children }: { children: React.ReactNode }) {
  const { session, loading } = useSession();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    const onAuthScreen = segments[0] === "sign-in";
    if (!session && !onAuthScreen) router.replace("/sign-in");
    else if (session && onAuthScreen) router.replace("/");
  }, [session, loading, segments, router]);

  if (loading) return null;
  return <>{children}</>;
}

export default function RootLayout() {
  const t = useTheme();
  return (
    <QueryClientProvider client={queryClient}>
      <AuthGate>
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: t.bg },
          }}
        />
      </AuthGate>
      <StatusBar style="auto" />
    </QueryClientProvider>
  );
}
