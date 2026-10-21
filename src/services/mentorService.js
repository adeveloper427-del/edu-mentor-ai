import { MENTOR_CHAT_URL, SUPABASE_ANON_KEY } from "../constants/config";
import { getMentorReply } from "../data/mentorData";

const TIMEOUT_MS = 15000;

/**
 * Asks the AI mentor a question via the Supabase Edge Function.
 * Falls back to the built-in offline replies if the call fails, so the
 * child always gets an answer even with no connection.
 */
export async function askMentor(message, history = []) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const res = await fetch(MENTOR_CHAT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        apikey: SUPABASE_ANON_KEY,
      },
      body: JSON.stringify({
        message,
        history: history.map((m) => ({ sender: m.sender, text: m.text })),
      }),
      signal: controller.signal,
    });

    if (!res.ok) throw new Error(`Mentor request failed: ${res.status}`);

    const data = await res.json();
    if (!data?.reply) throw new Error("Mentor returned no reply");

    return { reply: data.reply, offline: false };
  } catch (err) {
    // Offline / function not deployed / rate limited — use the local mock replies.
    return { reply: getMentorReply(message), offline: true };
  } finally {
    clearTimeout(timer);
  }
}
