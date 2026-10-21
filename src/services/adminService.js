import { supabase } from "./supabase";
import { CATEGORY_LABELS } from "../utils/subjects";

const EMPTY_STATS = {
  learners: 0,
  families: 0,
  quizzes_taken: 0,
  games_played: 0,
  lessons_done: 0,
  points_awarded: 0,
  badges_awarded: 0,
  learning_minutes: 0,
  active_today: 0,
};

/** Platform-wide totals. Returns zeroes rather than throwing if the call fails. */
export async function fetchAdminStats() {
  const { data, error } = await supabase.rpc("admin_stats");
  if (error || !data) return { stats: EMPTY_STATS, error: error?.message };
  return { stats: { ...EMPTY_STATS, ...data } };
}

/** Every learner on the platform, with their parent's email. */
export async function fetchAdminUsers() {
  const { data, error } = await supabase.rpc("admin_list_users");
  if (error) return { users: [], error: error.message };

  return {
    users: (data ?? []).map((row) => ({
      id: row.child_id,
      name: row.child_name,
      age: row.child_age,
      avatar: row.avatar,
      parentEmail: row.parent_email,
      joined: row.joined,
      points: row.points,
      lessons: row.lessons,
      lastActive: row.last_active,
    })),
  };
}

/** Average score and attempt count per category, across all children. */
export async function fetchAdminCategoryStats() {
  const { data, error } = await supabase.rpc("admin_category_stats");
  if (error) return { categories: [], error: error.message };

  return {
    categories: (data ?? []).map((row) => ({
      id: row.category,
      label: CATEGORY_LABELS[row.category] ?? row.category,
      kind: row.kind,
      attempts: Number(row.attempts) || 0,
      avgScore: Number(row.avg_score) || 0,
    })),
  };
}

/** Recent activity across every child. */
export async function fetchAdminActivity(limit = 25) {
  const { data, error } = await supabase.rpc("admin_recent_activity", { max_rows: limit });
  if (error) return { activity: [], error: error.message };

  return {
    activity: (data ?? []).map((row, i) => ({
      id: `${row.created_at}-${i}`,
      icon: row.icon,
      text: row.message,
      childName: row.child_name,
      createdAt: row.created_at,
    })),
  };
}
