import { supabase } from "./supabase";

const DEFAULT_PROGRESS = {
  points: 0,
  streak: 1,
  lessonsCompleted: 0,
  learningSeconds: 0,
  badges: [],
};

function fromRow(row) {
  if (!row) return { ...DEFAULT_PROGRESS };
  return {
    points: row.points ?? 0,
    streak: row.streak ?? 1,
    lessonsCompleted: row.lessons_completed ?? 0,
    learningSeconds: row.learning_seconds ?? 0,
    badges: row.badges ?? [],
  };
}

function daysBetween(fromDate, toDate) {
  const a = new Date(`${fromDate}T00:00:00`);
  const b = new Date(`${toDate}T00:00:00`);
  return Math.round((b - a) / 86400000);
}

const today = () => new Date().toISOString().slice(0, 10);

/**
 * Loads a child's progress, creating the row on first run and rolling the
 * daily streak forward (or resetting it if they missed a day).
 */
export async function loadProgress(childId) {
  const { data, error } = await supabase
    .from("learning_progress")
    .select("*")
    .eq("child_id", childId)
    .maybeSingle();

  if (error) return { progress: { ...DEFAULT_PROGRESS }, error: error.message };

  if (!data) {
    const seed = {
      child_id: childId,
      ...{ points: 0, streak: 1, lessons_completed: 0, learning_seconds: 0, badges: [] },
      last_active_date: today(),
    };
    const { data: created } = await supabase
      .from("learning_progress")
      .insert(seed)
      .select("*")
      .single();
    return { progress: fromRow(created ?? seed) };
  }

  // Update the streak based on how long since they last played.
  const gap = daysBetween(data.last_active_date, today());
  let streak = data.streak ?? 1;

  if (gap === 1) streak = streak + 1;
  else if (gap > 1) streak = 1;

  if (gap !== 0) {
    await supabase
      .from("learning_progress")
      .update({ streak, last_active_date: today(), updated_at: new Date().toISOString() })
      .eq("child_id", childId);
  }

  return { progress: fromRow({ ...data, streak }) };
}

/** Writes the current totals back. Called after points/badges/lessons change. */
export async function saveProgress(childId, progress) {
  const { error } = await supabase
    .from("learning_progress")
    .update({
      points: progress.points,
      streak: progress.streak,
      lessons_completed: progress.lessonsCompleted,
      learning_seconds: progress.learningSeconds,
      badges: progress.badges,
      last_active_date: today(),
      updated_at: new Date().toISOString(),
    })
    .eq("child_id", childId);

  return { error: error?.message ?? null };
}

export async function recordResult(childId, { kind = "quiz", category, score, total }) {
  const { error } = await supabase
    .from("quiz_results")
    .insert({ child_id: childId, kind, category, score, total });
  return { error: error?.message ?? null };
}

export async function logActivity(childId, icon, text) {
  const { error } = await supabase.from("activity_log").insert({ child_id: childId, icon, text });
  return { error: error?.message ?? null };
}

/** Everything the parent dashboard needs, in one call. */
export async function fetchDashboardData(childId) {
  const [progressRes, resultsRes, activityRes] = await Promise.all([
    supabase.from("learning_progress").select("*").eq("child_id", childId).maybeSingle(),
    supabase
      .from("quiz_results")
      .select("category, kind, score, total, created_at")
      .eq("child_id", childId)
      .order("created_at", { ascending: false })
      .limit(200),
    supabase
      .from("activity_log")
      .select("icon, text, created_at")
      .eq("child_id", childId)
      .order("created_at", { ascending: false })
      .limit(12),
  ]);

  return {
    progress: fromRow(progressRes.data),
    results: resultsRes.data ?? [],
    activity: activityRes.data ?? [],
    error: progressRes.error?.message ?? resultsRes.error?.message ?? null,
  };
}
