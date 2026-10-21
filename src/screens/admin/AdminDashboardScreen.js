import React from "react";
import { View, Text, StyleSheet, ScrollView, RefreshControl, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import StatCard from "../../components/StatCard";
import EmptyState from "../../components/EmptyState";
import useAdminData from "../../hooks/useAdminData";
import { useApp } from "../../context/AppContext";
import { COLORS, RADIUS, FONT, SPACING, SHADOW } from "../../constants/theme";

function timeAgo(iso) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export default function AdminDashboardScreen() {
  const { parentProfile } = useApp();
  const { stats, activity, loading, error, refresh } = useAdminData();

  if (loading && !stats) {
    return (
      <SafeAreaView style={[styles.container, styles.center]} edges={["top"]}>
        <ActivityIndicator color={COLORS.adminAccent} size="large" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={refresh} />}
      >
        <Text style={styles.title}>Admin Dashboard</Text>
        <Text style={styles.subtitle}>Signed in as {parentProfile.email}</Text>

        {error ? <Text style={styles.errorBanner}>{error}</Text> : null}

        <View style={styles.statsGrid}>
          <StatCard icon="🧒" label="Total Learners" value={stats?.learners ?? 0} color={COLORS.adminAccent} />
          <StatCard icon="👪" label="Families" value={stats?.families ?? 0} color={COLORS.purple} />
          <StatCard icon="📚" label="Lessons Completed" value={stats?.lessons_done ?? 0} color={COLORS.blue} />
          <StatCard icon="📝" label="Quizzes Taken" value={stats?.quizzes_taken ?? 0} color={COLORS.green} />
          <StatCard icon="🎮" label="Games Played" value={stats?.games_played ?? 0} color={COLORS.pink} />
          <StatCard icon="🔥" label="Active Today" value={stats?.active_today ?? 0} color={COLORS.secondary} />
        </View>

        <Text style={styles.sectionTitle}>Recent Activity</Text>
        <View style={[styles.card, SHADOW.soft]}>
          {activity.length === 0 ? (
            <EmptyState
              emoji="📭"
              title="No activity yet"
              subtitle="Learner activity will appear here as children use the app."
            />
          ) : (
            activity.map((a, i) => (
              <View key={a.id} style={[styles.activityRow, i < activity.length - 1 && styles.activityBorder]}>
                <Text style={styles.activityIcon}>{a.icon}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={styles.activityText}>{a.text}</Text>
                  <Text style={styles.activityTime}>{timeAgo(a.createdAt)}</Text>
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
  container: { flex: 1, backgroundColor: COLORS.adminBg },
  center: { alignItems: "center", justifyContent: "center" },
  scroll: { padding: SPACING.lg, paddingBottom: SPACING.xxl },
  title: { fontSize: FONT.h1 - 6, fontWeight: "800", color: COLORS.adminPrimary },
  subtitle: { fontSize: FONT.small, color: COLORS.textMuted, marginBottom: SPACING.lg },
  errorBanner: { color: COLORS.danger, fontSize: FONT.small, fontWeight: "700", marginBottom: SPACING.sm },
  statsGrid: { flexDirection: "row", flexWrap: "wrap", marginBottom: SPACING.md },
  sectionTitle: { fontSize: FONT.h3, fontWeight: "800", color: COLORS.adminPrimary, marginTop: SPACING.lg, marginBottom: SPACING.sm },
  card: { backgroundColor: COLORS.white, borderRadius: RADIUS.lg, padding: SPACING.lg },
  activityRow: { flexDirection: "row", alignItems: "center", paddingVertical: SPACING.sm },
  activityBorder: { borderBottomWidth: 1, borderBottomColor: COLORS.border },
  activityIcon: { fontSize: 20, marginRight: SPACING.md },
  activityText: { fontSize: FONT.small, fontWeight: "700", color: COLORS.textDark },
  activityTime: { fontSize: FONT.tiny, color: COLORS.textMuted, marginTop: 2 },
});
