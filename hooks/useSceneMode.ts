"use client";

import { useSyncExternalStore } from "react";
import { SERVER_SCENE_MODE, sceneMode } from "@/lib/scene-mode";

export function useSceneMode() {
  return useSyncExternalStore(sceneMode.subscribe, sceneMode.get, () => SERVER_SCENE_MODE);
}
