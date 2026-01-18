'use client';

import { create } from "zustand";

import {
  loadProgress,
  saveProgress,
  type StoredProgress,
} from "@/features/progress/lib/storage";

type ProgressState = {
  completedBySlug: Record<string, boolean>;
  checkpointsBySlug: Record<string, Record<string, boolean>>;
};

type ProgressActions = {
  hydrateFromStorage: () => void;
  markLessonComplete: (slug: string) => void;
  saveCheckpoint: (slug: string, checkpointId: string) => void;
};

type ProgressStore = ProgressState & ProgressActions;

const initialState: ProgressState = {
  completedBySlug: {},
  checkpointsBySlug: {},
};

const persist = (state: ProgressState) => {
  const snapshot: StoredProgress = {
    completedBySlug: state.completedBySlug,
    checkpointsBySlug: state.checkpointsBySlug,
  };
  saveProgress(snapshot);
};

export const useProgressStore = create<ProgressStore>((set, get) => ({
  ...initialState,

  hydrateFromStorage: () => {
    const stored = loadProgress();
    if (!stored) return;

    set(() => ({
      completedBySlug: stored.completedBySlug ?? {},
      checkpointsBySlug: stored.checkpointsBySlug ?? {},
    }));
  },

  markLessonComplete: (slug: string) => {
    if (!slug) return;

    const current = get();
    const completedBySlug = { ...current.completedBySlug };
    const isComplete = !!completedBySlug[slug];

    if (isComplete) {
      delete completedBySlug[slug];
    } else {
      completedBySlug[slug] = true;
    }
    const snapshot: ProgressState = {
      completedBySlug,
      checkpointsBySlug: current.checkpointsBySlug,
    };

    set(() => ({ completedBySlug }));
    persist(snapshot);
  },

  saveCheckpoint: (slug: string, checkpointId: string) => {
    if (!slug || !checkpointId) return;

    const current = get();
    const existingForLesson = current.checkpointsBySlug[slug] ?? {};
    if (existingForLesson[checkpointId]) return;

    const checkpointsBySlug = {
      ...current.checkpointsBySlug,
      [slug]: { ...existingForLesson, [checkpointId]: true },
    };
    const snapshot: ProgressState = {
      completedBySlug: current.completedBySlug,
      checkpointsBySlug,
    };

    set(() => ({ checkpointsBySlug }));
    persist(snapshot);
  },
}));
