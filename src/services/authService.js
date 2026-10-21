import { supabase } from "./supabase";

const REQUEST_TIMEOUT_MS = 20000;

/** Rejects rather than hanging forever if the network stalls. */
function withTimeout(promise, ms = REQUEST_TIMEOUT_MS) {
  return Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error("network timeout")), ms)
    ),
  ]);
}

/** Turns Supabase's technical errors into something a parent can read. */
function friendlyError(error) {
  if (!error) return null;
  const msg = String(error.message || "").toLowerCase();

  if (msg.includes("already registered") || msg.includes("already been registered")) {
    return "That email already has an account. Try logging in instead.";
  }
  if (msg.includes("invalid login credentials")) {
    return "Wrong email or password. Please try again.";
  }
  if (msg.includes("password should be at least")) {
    return "Password must be at least 6 characters.";
  }
  if (msg.includes("unable to validate email") || msg.includes("invalid format")) {
    return "That email address doesn't look right.";
  }
  if (msg.includes("email not confirmed")) {
    return "Please confirm your email address first, then log in.";
  }
  if (msg.includes("timeout")) {
    return "The server took too long to respond. Please try again.";
  }
  if (msg.includes("network") || msg.includes("fetch") || msg.includes("failed to fetch")) {
    return "Can't reach the server. Check your internet connection.";
  }
  return error.message || "Something went wrong. Please try again.";
}

/** Creates the parent account and their child's profile. */
export async function registerParent({ parentName, email, password, child }) {
  let data, error;
  try {
    ({ data, error } = await withTimeout(
      supabase.auth.signUp({
        email: email.trim(),
        password,
        options: { data: { full_name: parentName.trim() } },
      })
    ));
  } catch (err) {
    return { error: friendlyError(err) };
  }

  if (error) return { error: friendlyError(error) };

  // If email confirmation is enabled there is no session yet, so the child
  // profile can't be written under RLS. Tell the parent to confirm first.
  if (!data.session) {
    return { needsEmailConfirmation: true };
  }

  // Return the inserted row: its id is what progress and activity are keyed on,
  // so without it nothing would save until the next app launch.
  const { data: childRow, error: childError } = await supabase
    .from("child_profiles")
    .insert({
      parent_id: data.user.id,
      name: child.name.trim(),
      age: child.age,
      avatar: child.avatar,
    })
    .select("id, name, age, avatar")
    .single();

  if (childError) return { error: friendlyError(childError) };

  return { user: data.user, session: data.session, child: childRow };
}

export async function loginParent({ email, password }) {
  let data, error;
  try {
    ({ data, error } = await withTimeout(
      supabase.auth.signInWithPassword({ email: email.trim(), password })
    ));
  } catch (err) {
    return { error: friendlyError(err) };
  }

  if (error) return { error: friendlyError(error) };
  return { user: data.user, session: data.session };
}

export async function logout() {
  await supabase.auth.signOut();
}

/** True when the signed-in user has a row in admin_users. */
export async function checkIsAdmin() {
  const { data, error } = await supabase
    .from("admin_users")
    .select("user_id")
    .maybeSingle();

  if (error) return false;
  return !!data;
}

/**
 * Signs in and only grants admin access if the account is actually flagged as
 * an admin in the database. A non-admin is signed straight back out so they
 * can't linger with a half-privileged session.
 */
export async function loginAdmin({ email, password }) {
  let data, error;
  try {
    ({ data, error } = await withTimeout(
      supabase.auth.signInWithPassword({ email: email.trim(), password })
    ));
  } catch (err) {
    return { error: friendlyError(err) };
  }

  if (error) return { error: friendlyError(error) };

  const isAdmin = await checkIsAdmin();
  if (!isAdmin) {
    await supabase.auth.signOut();
    return { error: "This account doesn't have administrator access." };
  }

  return { user: data.user, session: data.session };
}

export async function getSession() {
  const { data } = await supabase.auth.getSession();
  return data.session ?? null;
}

/** Loads the first child profile belonging to the signed-in parent. */
export async function fetchChildProfile(parentId) {
  const { data, error } = await supabase
    .from("child_profiles")
    .select("id, name, age, avatar")
    .eq("parent_id", parentId)
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (error) return { error: friendlyError(error) };
  return { child: data };
}

export async function saveChildProfile(parentId, child) {
  const { data, error } = await supabase
    .from("child_profiles")
    .insert({
      parent_id: parentId,
      name: child.name.trim(),
      age: child.age,
      avatar: child.avatar,
    })
    .select("id, name, age, avatar")
    .single();

  if (error) return { error: friendlyError(error) };
  return { child: data };
}

/**
 * Re-checks the parent's password before opening the dashboard, so a child
 * tapping around can't get in. Verified against Supabase, not stored locally.
 */
export async function verifyParentPassword(email, password) {
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { ok: false, error: "That password isn't right. Try again." };
  return { ok: true };
}
