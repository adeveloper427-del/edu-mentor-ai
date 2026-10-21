import { useCallback, useEffect, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { fetchDashboardData } from "../services/progressService";
import { performanceFromResults, weakSubjects, recommendationsFor } from "../utils/subjects";
import { useApp } from "../context/AppContext";

/**
 * Loads the child's real progress for the parent screens and refreshes it
 * every time a screen comes back into focus.
 */
export default function useDashboardData() {
  const { childProfile } = useApp();
  const [state, setState] = useState({
    loading: true,
    progress: null,
    results: [],
    activity: [],
    performance: [],
    weak: [],
    recommendations: [],
  });

  const load = useCallback(async () => {
    if (!childProfile.id) {
      setState((s) => ({ ...s, loading: false }));
      return;
    }

    const { progress, results, activity } = await fetchDashboardData(childProfile.id);
    const performance = performanceFromResults(results);

    setState({
      loading: false,
      progress,
      results,
      activity,
      performance,
      weak: weakSubjects(performance),
      recommendations: recommendationsFor(performance),
    });
  }, [childProfile.id]);

  useEffect(() => {
    load();
  }, [load]);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  return { ...state, reload: load };
}

/** Average score across every quiz and game the child has finished. */
export function averageScore(results) {
  if (results.length === 0) return null;
  const ratio =
    results.reduce((sum, r) => sum + (r.total ? r.score / r.total : 0), 0) / results.length;
  return Math.round(ratio * 100);
}

export function formatLearningTime(seconds = 0) {
  if (seconds < 60) return `${seconds}s`;
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  return `${hours}h ${minutes % 60}m`;
}

export function timeAgo(iso) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins} min ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return days === 1 ? "Yesterday" : `${days} days ago`;
}
