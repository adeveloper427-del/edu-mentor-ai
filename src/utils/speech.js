import * as Speech from "expo-speech";

// Emoji and pictographs read aloud as "grinning face" etc, which confuses a child.
// Strip them before speaking so only the words are read.
const EMOJI_PATTERN =
  /[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{2B00}-\u{2BFF}\u{FE00}-\u{FE0F}\u{1F1E6}-\u{1F1FF}\u{200D}]/gu;

// Global mute switch. AppContext keeps this in sync with the saved setting so
// every speak() call across the app respects it without threading props around.
let soundEnabled = true;

export function setSoundEnabled(enabled) {
  soundEnabled = enabled;
  if (!enabled) stopSpeaking();
}

export function isSoundEnabled() {
  return soundEnabled;
}

export function stripEmoji(text) {
  return String(text).replace(EMOJI_PATTERN, "").replace(/\s+/g, " ").trim();
}

export function speak(text) {
  if (!soundEnabled) return;
  try {
    const spoken = stripEmoji(text);
    if (!spoken) return;
    Speech.stop();
    Speech.speak(spoken, { rate: 0.9, pitch: 1.1 });
  } catch (e) {
    // Speech is unavailable on some platforms (e.g. web) - fail silently.
  }
}

export function stopSpeaking() {
  try {
    Speech.stop();
  } catch (e) {
    // no-op
  }
}
