import { useCallback, useEffect, useState } from "react";
import {
  fetchAdminStats,
  fetchAdminUsers,
  fetchAdminCategoryStats,
  fetchAdminActivity,
} from "../services/adminService";

/**
 * Loads every piece of admin data in one go. Screens pick out what they need,
 * and share a single refresh so pull-to-refresh stays consistent across tabs.
 */
export default function useAdminData() {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setError("");

    const [statsRes, usersRes, catRes, actRes] = await Promise.all([
      fetchAdminStats(),
      fetchAdminUsers(),
      fetchAdminCategoryStats(),
      fetchAdminActivity(),
    ]);

    setStats(statsRes.stats);
    setUsers(usersRes.users);
    setCategories(catRes.categories);
    setActivity(actRes.activity);

    const firstError = statsRes.error || usersRes.error || catRes.error || actRes.error;
    if (firstError) setError(firstError);

    setLoading(false);
  }, []);

  useEffect(() => {
    let active = true;
    load().catch(() => {
      if (active) setLoading(false);
    });
    return () => {
      active = false;
    };
  }, [load]);

  const refresh = useCallback(async () => {
    setLoading(true);
    await load();
  }, [load]);

  return { stats, users, categories, activity, loading, error, refresh };
}
