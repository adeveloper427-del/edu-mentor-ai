import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { supabase } from "../services/supabase";
import { setSoundEnabled as applySoundSetting, stopSpeaking } from "../utils/speech";
import { fetchChildProfile, logout as authLogout } from "../services/authService";
import {
  loadProgress,
  saveProgress,
  recordResult,
  logActivity,
} from "../services/progressService";
import { badgeDefinitions } from "../data/userData";
import { CATEGORY_LABELS } from "../utils/subjects";

const AppContext = createContext(null);

const EMPTY_CHILD = { id: null, name: "Learner", age: 5, avatar: "🦄" };
const SOUND_KEY = "@edu_mentor/sound_enabled";
const EMPTY_STATS = {
  points: 0,
  streak: 1,
  lessonsCompleted: 0,
  learningSeconds: 0,
  badges: [],
};

export function AppProvider({ children }) {
  const [booting, setBooting] = useState(true);
  const [session, setSession] = useState(null);
  const [childProfile, setChildProfile] = useState(EMPTY_CHILD);

  const [role, setRole] = useState(null);
  const [stats, setStats] = useState(EMPTY_STATS);
  const [statsLoaded, setStatsLoaded] = useState(false);
  const [soundEnabled, setSoundEnabledState] = useState(true);

  // Latest stats without re-subscribing effects on every change.
  const statsRef = useRef(stats);
  statsRef.current = stats;
  const childIdRef = useRef(null);
  childIdRef.current = childProfile.id;

  // ---- session ------------------------------------------------------------
  useEffect(() => {
    let active = true;

    // Never let a slow or failing storage read trap the app on the splash screen.
    const bootTimeout = setTimeout(() => {
      if (active) setBooting(false);
    }, 5000);

    supabase.auth
      .getSession()
      .then(({ data }) => {
        if (!active) return;
        setSession(data.session ?? null);
      })
      .catch((err) => {
        console.warn("Could not restore session:", err);
      })
      .finally(() => {
        if (active) setBooting(false);
      });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      if (!newSession) {
        setRole(null);
        setChildProfile(EMPTY_CHILD);
        setStats(EMPTY_STATS);
        setStatsLoaded(false);
      }
    });

    return () => {
      active = false;
      clearTimeout(bootTimeout);
      listener.subscription.unsubscribe();
    };
  }, []);

  // ---- sound setting ------------------------------------------------------
  // Restored once on launch and mirrored into the speech module, which every
  // speak() call checks before making a sound.
  useEffect(() => {
    let active = true;

    AsyncStorage.getItem(SOUND_KEY)
      .then((stored) => {
        if (!active || stored === null) return;
        const enabled = stored === "true";
        setSoundEnabledState(enabled);
        applySoundSetting(enabled);
      })
      .catch(() => {
        // Storage unavailable — keep the default (sound on).
      });

    return () => {
      active = false;
    };
  }, []);

  const toggleSound = () => {
    setSoundEnabledState((prev) => {
      const next = !prev;
      applySoundSetting(next);
      AsyncStorage.setItem(SOUND_KEY, String(next)).catch(() => {});
      return next;
    });
  };

  // Never leave the mentor talking after the child leaves the app.
  useEffect(() => stopSpeaking, []);

  // ---- child profile ------------------------------------------------------
  useEffect(() => {
    if (!session?.user?.id) return;
    let active = true;

    fetchChildProfile(session.user.id).then(({ child }) => {
      if (active && child) setChildProfile(child);
    });

    return () => {
      active = false;
    };
  }, [session?.user?.id]);

  // ---- progress -----------------------------------------------------------
  useEffect(() => {
    if (!childProfile.id) return;
    let active = true;

    setStatsLoaded(false);
    loadProgress(childProfile.id).then(({ progress }) => {
      if (!active) return;
      setStats(progress);
      setStatsLoaded(true);
    });

    return () => {
      active = false;
    };
  }, [childProfile.id]);

  /** Applies a change locally, then persists the new totals. */
  const updateStats = (mutator) => {
    setStats((prev) => {
      const next = mutator(prev);
      if (childIdRef.current) saveProgress(childIdRef.current, next);
      return next;
    });
  };

  // ---- learning time ------------------------------------------------------
  // Counts seconds only while the child is actually in the learner app.
  useEffect(() => {
    if (role !== "learner" || !childProfile.id) return;

    const started = Date.now();
    const interval = setInterval(() => {
      updateStats((prev) => ({ ...prev, learningSeconds: prev.learningSeconds + 30 }));
    }, 30000);

    return () => {
      clearInterval(interval);
      const leftover = Math.floor((Date.now() - started) / 1000) % 30;
      if (leftover > 5) {
        updateStats((prev) => ({ ...prev, learningSeconds: prev.learningSeconds + leftover }));
      }
    };
  }, [role, childProfile.id]);

  // ---- actions ------------------------------------------------------------
  const addPoints = (amount) => updateStats((prev) => ({ ...prev, points: prev.points + amount }));

  const completeLesson = () =>
    updateStats((prev) => ({ ...prev, lessonsCompleted: prev.lessonsCompleted + 1 }));

  const unlockBadge = (badgeId) => {
    if (statsRef.current.badges.includes(badgeId)) return;

    updateStats((prev) =>
      prev.badges.includes(badgeId) ? prev : { ...prev, badges: [...prev.badges, badgeId] }
    );

    const badge = badgeDefinitions.find((b) => b.id === badgeId);
    if (badge && childIdRef.current) {
      logActivity(childIdRef.current, badge.emoji, `${childProfile.name} earned the "${badge.name}" badge`);
    }
  };

  const recordQuizResult = (categoryId, score, total) => {
    addPoints(score * 10);
    completeLesson();

    if (!childIdRef.current) return;
    recordResult(childIdRef.current, { kind: "quiz", category: categoryId, score, total });
    logActivity(
      childIdRef.current,
      "📝",
      `${childProfile.name} finished the ${CATEGORY_LABELS[categoryId] ?? categoryId} quiz with ${score}/${total}`
    );
  };

  const recordGameResult = (gameId, score, total) => {
    addPoints(score * 5);

    if (!childIdRef.current) return;
    recordResult(childIdRef.current, { kind: "game", category: gameId, score, total });
    logActivity(
      childIdRef.current,
      "🎮",
      `${childProfile.name} played ${CATEGORY_LABELS[gameId] ?? gameId} and scored ${score}/${total}`
    );
  };

  const recordLessonViewed = (lessonName) => {
    completeLesson();
    if (!childIdRef.current) return;
    logActivity(childIdRef.current, "📚", `${childProfile.name} completed the ${lessonName} lesson`);
  };

  // ---- misc ---------------------------------------------------------------
  const parentProfile = useMemo(
    () => ({
      name: session?.user?.user_metadata?.full_name || "Parent",
      email: session?.user?.email || "",
      id: session?.user?.id || null,
    }),
    [session]
  );

  /**
   * Pushes a freshly-issued session straight into state.
   *
   * Login used to rely only on the onAuthStateChange listener to notice the new
   * session. When that event was missed or arrived late the app just sat on the
   * login screen with no error, which read as "login does nothing". Setting it
   * directly makes navigation deterministic; the listener still handles refresh
   * and sign-out.
   */
  const applySession = (newSession) => {
    if (newSession) setSession(newSession);
  };

  const signOut = async () => {
    await authLogout();
    setRole(null);
    setSession(null);
    setChildProfile(EMPTY_CHILD);
    setStats(EMPTY_STATS);
    setStatsLoaded(false);
  };

  const value = useMemo(
    () => ({
      booting,
      session,
      authenticated: !!session,
      parentProfile,
      childProfile,
      setChildProfile,
      applySession,
      signOut,
      role,
      setRole,
      stats,
      statsLoaded,
      soundEnabled,
      toggleSound,
      addPoints,
      unlockBadge,
      completeLesson,
      recordQuizResult,
      recordGameResult,
      recordLessonViewed,
    }),
    [booting, session, parentProfile, childProfile, role, stats, statsLoaded, soundEnabled]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within an AppProvider");
  return ctx;
}
