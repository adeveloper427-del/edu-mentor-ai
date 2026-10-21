// Supabase project settings.
// The anon/publishable key is safe to ship in the client — it is protected by
// row-level security. Never put the Gemini key here; it lives in the Edge Function.
export const SUPABASE_URL = "https://ohymeolndfwzkmoogbie.supabase.co";
export const SUPABASE_ANON_KEY = "sb_publishable_K3xT07hzFEbCucwTPQzrqw_aRZDuiOZ";

export const MENTOR_CHAT_URL = `${SUPABASE_URL}/functions/v1/mentor-chat`;
