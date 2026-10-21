// Replicates src/services/authService.loginParent exactly, to see what the
// app actually receives back from Supabase.
//   node scripts/test-login.mjs
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://ohymeolndfwzkmoogbie.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_K3xT07hzFEbCucwTPQzrqw_aRZDuiOZ";

// In-memory stand-in for AsyncStorage.
const mem = new Map();
const storage = {
  getItem: async (k) => (mem.has(k) ? mem.get(k) : null),
  setItem: async (k, v) => void mem.set(k, v),
  removeItem: async (k) => void mem.delete(k),
};

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

const REQUEST_TIMEOUT_MS = 20000;
function withTimeout(promise, ms = REQUEST_TIMEOUT_MS) {
  return Promise.race([
    promise,
    new Promise((_, reject) => setTimeout(() => reject(new Error("network timeout")), ms)),
  ]);
}

// Mirror the app's listener so we can see whether the event fires at all.
supabase.auth.onAuthStateChange((event, session) => {
  console.log(`  [event] onAuthStateChange -> ${event}, session: ${!!session}`);
});

async function loginParent({ email, password }) {
  let data, error;
  try {
    ({ data, error } = await withTimeout(
      supabase.auth.signInWithPassword({ email: email.trim(), password })
    ));
  } catch (err) {
    return { error: `caught: ${err.message}` };
  }
  if (error) return { error: error.message };
  return { user: data.user, session: data.session };
}

console.log("Calling loginParent...");
const t0 = Date.now();
const result = await loginParent({ email: "testparent@edumentor.app", password: "Test1234" });
console.log(`Returned after ${Date.now() - t0}ms`);
console.log("  keys:       ", Object.keys(result).join(", "));
console.log("  has error:  ", !!result.error, result.error ?? "");
console.log("  has session:", !!result.session);
console.log("  has user:   ", !!result.user);
if (result.session) {
  console.log("  access_token present:", !!result.session.access_token);
  console.log("  user id:", result.session.user?.id);
}

// Give any late auth events a moment to arrive.
await new Promise((r) => setTimeout(r, 3000));
console.log("Done.");
process.exit(0);
