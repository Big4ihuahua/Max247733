import { useSyncExternalStore } from "react";
import type { SectionId } from "@/data/site";

export type SceneState = {
  section: SectionId;
  /** Preloader counter reached 100 — particles gather into the logo. */
  loaded: boolean;
  /** Preloader is gone and the page is interactive. */
  revealed: boolean;
  serviceIndex: number;
  contactSuccess: boolean;
  /** Incremented to fire a one-off particle burst. */
  burst: number;
  // Hot values below are mutated in place and read every frame; they never notify subscribers.
  heroExit: number;
  pointer: { x: number; y: number };
  pointerActive: boolean;
  scrollVelocity: number;
};

const state: SceneState = {
  section: "hero",
  loaded: false,
  revealed: false,
  serviceIndex: 0,
  contactSuccess: false,
  burst: 0,
  heroExit: 0,
  pointer: { x: 0, y: 0 },
  pointerActive: false,
  scrollVelocity: 0,
};

const listeners = new Set<() => void>();

export const sceneStore = {
  state,
  set(partial: Partial<SceneState>) {
    let changed = false;
    for (const key in partial) {
      const k = key as keyof SceneState;
      if (state[k] !== partial[k]) {
        (state as Record<string, unknown>)[k] = partial[k];
        changed = true;
      }
    }
    if (changed) listeners.forEach((l) => l());
  },
  subscribe(listener: () => void) {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },
};

export function useSceneStore<T>(selector: (s: SceneState) => T): T {
  return useSyncExternalStore(
    sceneStore.subscribe,
    () => selector(state),
    () => selector(state),
  );
}
