/** Keep dictation active through browser-imposed pauses for up to two minutes. */
export const DICTATION_MAX_MS = 120_000;
export type DictationFinishReason = "manual" | "timeout" | "error";
export type DictationEngine = {
  start: () => void;
  stop: () => void;
  onend: (() => void) | null;
  onerror: ((event: { error?: string }) => void) | null;
};
export type DictationSession = { stop: () => void };

export function startTwoMinuteDictation(
  voice: DictationEngine,
  onFinish: (reason: DictationFinishReason) => void,
  onError: (message: string) => void,
): DictationSession {
  let active = true;
  let restartTimer: ReturnType<typeof setTimeout> | null = null;
  let limitTimer: ReturnType<typeof setTimeout> | null = null;
  const deadline = Date.now() + DICTATION_MAX_MS;
  const finish = (reason: DictationFinishReason) => {
    if (!active) return;
    active = false;
    if (restartTimer !== null) clearTimeout(restartTimer);
    if (limitTimer !== null) clearTimeout(limitTimer);
    voice.onend = null;
    voice.onerror = null;
    try { voice.stop(); } catch {}
    onFinish(reason);
  };
  voice.onerror = event => {
    // Silent periods often emit no-speech before onend; wait for the restart.
    if (!active || event.error === "no-speech") return;
    onError(event.error === "not-allowed" || event.error === "service-not-allowed"
      ? "Permite el acceso al micrófono para dictar."
      : "El reconocimiento de voz se ha interrumpido. Inténtalo de nuevo.");
    finish("error");
  };
  voice.onend = () => {
    if (!active) return;
    if (Date.now() >= deadline) { finish("timeout"); return; }
    restartTimer = setTimeout(() => {
      restartTimer = null;
      if (!active) return;
      try { voice.start(); }
      catch {
        onError("No se pudo reanudar el dictado.");
        finish("error");
      }
    }, 300);
  };
  // Microphone start must run inside the user's click gesture.
  try { voice.start(); }
  catch {
    voice.onend = null;
    voice.onerror = null;
    throw new Error("No se pudo iniciar el micrófono.");
  }
  limitTimer = setTimeout(() => finish("timeout"), DICTATION_MAX_MS);
  return { stop: () => finish("manual") };
}
