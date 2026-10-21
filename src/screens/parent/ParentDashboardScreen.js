import React from "react";
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, RefreshControl } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import StatCard from "../../components/StatCard";
import ProgressBar from "../../components/ProgressBar";
import EmptyState from "../../components/EmptyState";
import { useApp } from "../../context/AppContext";
import useDashboardData, {
  averageScore,
  formatLearningTime,
  timeAgo,
} from "../../hooks/useDashboardData";
import { COLORS, RADIUS, FONT, SPACING, SHADOW } from "../../constants/theme";

export default function ParentDashboardScreen() {
  const { parentProfile, childProfile } = useApp();
  const { loading, progress, results, activity, performance, reload } = useDashboardData();

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, styles.center]} edges={["top"]}>
        <ActivityIndicator color={COLORS.parentPrimary} size="large" />
      </SafeAreaView>
    );
  }

  const avg = averageScore(results);
  const practised = performance.filter((p) => p.attempts > 0);
  const hasActivity = (progress?.lessonsCompleted ?? 0) > 0 || results.length > 0;

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        refreshControl={<RefreshControl refreshing={false} onRefresh={reload} />}
      >
        <Text style={styles.greeting}>Welcome Back!</Text>
        <Text style={styles.subtitle}>
          {parentProfile.name} • Tracking {childProfile.name}'s progress
        </Text>

        <View style={styles.statsGrid}>
          <StatCard
            icon="📚"
            label="Lessons Completed"
            value={progress?.lessonsCompleted ?? 0}
            color={COLORS.parentPrimary}
          />
          <StatCard
            icon="🎯"
            label="Average Score"
            value={avg === null ? "—" : `${avg}%`}
            color={COLORS.parentAccent}
          />
          <StatCard
            icon="⏱"
            label="Learning Time"
            value={formatLearningTime(progress?.learningSeconds ?? 0)}
            color={COLORS.pink}
          />
          <StatCard
            icon="🔥"
            label="Learning Streak"
            value={`${progress?.streak ?? 0} day${(progress?.streak ?? 0) === 1 ? "" : "s"}`}
            color={COLORS.secondary}
          />
        </View>

        <Text style={styles.sectionTitle}>Learning Performance</Text>
        <View style={[styles.card, SHADOW.soft]}>
          {practised.length === 0 ? (
            <EmptyState
              emoji="🌱"
              title="No practice yet"
              subtitle={`Once ${childProfile.name} finishes a quiz or game, their scores appear here.`}
            />
          ) : (
            performance.map((p) =>
              p.attempts === 0 ? (
                <View key={p.subject} style={styles.notTriedRow}>
                  <Text style={styles.notTriedLabel}>{p.subject}</Text>
                  <Text style={styles.notTriedValue}>Not tried yet</Text>
                </View>
              ) : (
                <ProgressBar
                  key={p.subject}
                  label={`${p.subject}  (${p.attempts} attempt${p.attempts === 1 ? "" : "s"})`}
                  progress={p.score / 100}
                  color={p.color}
                />
              )
            )
          )}
        </View>

        <Text style={styles.sectionTitle}>Recent Activity</Text>
        <View style={[styles.card, SHADOW.soft]}>
          {activity.length === 0 ? (
            <EmptyState
              emoji="📭"
              title="Nothing yet"
              subtitle={hasActivity ? "Activity will show up here." : `Hand the tablet to ${childProfile.name} to get started!`}
            />
          ) : (
            activity.map((a, i) => (
              <View
                key={i}
                style={[styles.activityRow, i < activity.length - 1 && styles.activityBorder]}
              >
                <Text style={styles.activityIcon}>{a.icon}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={styles.activityText}>{a.text}</Text>
                  <Text style={styles.activityTime}>{timeAgo(a.created_at)}</Text>
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.parentBg },
  center: { alignItems: "center", justifyContent: "center" },
  scroll: { padding: SPACING.lg, paddingBottom: SPACING.xxl },
  greeting: { fontSize: FONT.h1 - 4, fontWeight: "800", color: COLORS.textDark },
  subtitle: { fontSize: FONT.body, color: COLORS.textMuted, marginTop: 4, marginBottom: SPACING.lg },
  statsGrid: { flexDirection: "row", flexWrap: "wrap", marginBottom: SPACING.md },
  sectionTitle: {
    fontSize: FONT.h3,
    fontWeight: "800",
    color: COLORS.textDark,
    marginTop: SPACING.lg,
    marginBottom: SPACING.sm,
  },
  card: { backgroundColor: COLORS.parentCard, borderRadius: RADIUS.lg, padding: SPACING.lg },
  notTriedRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: SPACING.sm,
  },
  notTriedLabel: { fontSize: FONT.small, fontWeight: "700", color: COLORS.textMuted },
  notTriedValue: { fontSize: FONT.small, color: COLORS.textMuted, fontStyle: "italic" },
  activityRow: { flexDirection: "row", alignItems: "center", paddingVertical: SPACING.sm },
  activityBorder: { borderBottomWidth: 1, borderBottomColor: COLORS.border },
  activityIcon: { fontSize: 22, marginRight: SPACING.md },
  activityText: { fontSize: FONT.small, fontWeight: "700", color: COLORS.textDark },
  activityTime: { fontSize: FONT.tiny, color: COLORS.textMuted, marginTop: 2 },
});
