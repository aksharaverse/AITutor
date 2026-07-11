// The one Zustand store: the live streaming answer. Everything else is
// server state and belongs to TanStack Query.

import { create } from "zustand";

import { askStream } from "@/lib/api";

type Status = "idle" | "streaming" | "done" | "error";

type StreamState = {
  question: string;
  imageUrl: string | null;
  answer: string;
  status: Status;
  sessionId: string | null;
  sources: string[];
  error: string | null;
  ask: (q: { text?: string; image_url?: string; chapter?: string }) => void;
  reset: () => void;
};

export const useStream = create<StreamState>((set) => ({
  question: "",
  imageUrl: null,
  answer: "",
  status: "idle",
  sessionId: null,
  sources: [],
  error: null,

  ask: (q) => {
    set({
      question: q.text ?? "(photo question)",
      imageUrl: q.image_url ?? null,
      answer: "",
      status: "streaming",
      sessionId: null,
      sources: [],
      error: null,
    });
    // Fire-and-forget: the stream keeps running across navigation.
    askStream(q, {
      onToken: (t) => set((s) => ({ answer: s.answer + t })),
      onMeta: (m) => set({ sessionId: m.session_id, sources: m.sources }),
      onError: (_code, message) => set({ status: "error", error: message }),
      onDone: () => set({ status: "done" }),
    }).catch((e: Error) =>
      set({ status: "error", error: e.message || "Connection lost" }),
    );
  },

  reset: () =>
    set({
      question: "", imageUrl: null, answer: "", status: "idle",
      sessionId: null, sources: [], error: null,
    }),
}));
