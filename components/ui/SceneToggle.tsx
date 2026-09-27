"use client";

import { useSceneMode } from "@/hooks/useSceneMode";
import { sceneMode } from "@/lib/scene-mode";

const HINT = {
  "no-webgl": "Браузер не поддерживает WebGL — показана статичная версия",
  performance: "Устройство не справлялось с 3D — включили лёгкий режим",
  "reduced-motion": "Включено, потому что в системе выбрано уменьшение движения",
  "save-data": "Включено, потому что в браузере включена экономия трафика",
  user: undefined,
} as const;

/** Switches between the WebGL scene and the static backdrop; the choice is remembered. */
export function SceneToggle({ className = "", tabIndex }: { className?: string; tabIndex?: number }) {
  const { isStatic, reason } = useSceneMode();
  const locked = reason === "no-webgl";

  return (
    <button
      type="button"
      className={`scene-toggle mono-label ${className}`}
      aria-pressed={isStatic}
      disabled={locked}
      title={reason ? HINT[reason] : "Без 3D-сцены и частиц: меньше нагрузка на устройство"}
      tabIndex={tabIndex}
      onClick={() => sceneMode.setStatic(!isStatic)}
    >
      <span className="scene-toggle-dot" aria-hidden="true" />
      Лёгкий режим
      <span className="text-muted">{isStatic ? "вкл" : "выкл"}</span>
    </button>
  );
}
