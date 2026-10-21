import React from "react";
import { View, Text, StyleSheet, ScrollView, RefreshControl, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ProgressBar from "../../components/ProgressBar";
import AppButton from "../../components/AppButton";
import StatCard from "../../components/StatCard";
import EmptyState from "../../components/EmptyState";
import useAdminData from "../../hooks/useAdminData";
import { useApp } from "../../context/AppContext";
import { COLORS, RADIUS, FONT, SPACING, SHADOW } from "../../constants/theme";

export default function AdminStatisticsScreen() {
  const { signOut } = useApp();
  const { stats, categories, loading, refresh } = useAdminData();

  const quizzes = categories.filter((c) => c.kind === "quiz");
  const games = categories.filter((c) => c.kind === "game");
  const maxAttempts = Math.max(1, ...categories.map((c) => c.attempts));

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
        <Text style={styles.title}>Statistics</Text>
        <Text style={styles.subtitle}>Platform-wide performance</Text>

        <View style={styles.statsGrid}>
          <StatCard icon="⭐" label="Points Awarded" value={stats?.points_awarded ?? 0} color={COLORS.yellow} />
          <StatCard icon="🏅" label="Badges Earned" value={stats?.badges_awarded ?? 0} color={COLORS.purple} />
          <StatCard icon="⏱" label="Learning Minutes" value={stats?.learning_minutes ?? 0} color={COLORS.pink} />
        </View>

        <Text style={styles.sectionTitle}>Average Score by Quiz</Text>
        <View style={[styles.card, SHADOW.soft]}>
          {quizzes.length === 0 ? (
            <EmptyState emoji="📊" title="No quiz data yet" subtitle="Scores appear once children take quizzes." />
          ) : (
            quizzes.map((c) => (
              <ProgressBar
                key={c.id}
                label={`${c.label} (${c.attempts} taken)`}
                progress={c.avgScore / 100}
                color={COLORS.adminAccent}
              />
            ))
          )}
        </View>

        <Text style={styles.sectionTitle}>Game Engagement</Text>
        <View style={[styles.card, SHADOW.soft]}>
          {games.length === 0 ? (
            <EmptyState emoji="🎮" title="No games played yet" subtitle="Plays appear here as children use the games." />
          ) : (
            games.map((c) => (
              <View key={c.id} style={{ marginBottom: SPACING.sm }}>
                <ProgressBar
                  label={`${c.label} (${c.attempts} plays)`}
                  progress={c.attempts / maxAttempts}
                  color={COLORS.green}
                  showPercent={false}
                />
              </View>
            ))
          )}
        </View>

        <AppButton
          title="Log Out"
          icon="🚪"
          color={COLORS.danger}
          onPress={signOut}
          style={{ marginTop: SPACING.lg }}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.adminBg },
  center: { alignItems: "center", justifyContent: "center" },
  scroll: { padding: SPACING.lg, paddingBottom: SPACING.xxl },
  title: { fontSize: FONT.h1 - 6, fontWeight: "800", color: COLORS.adminPrimary },
  subtitle: { fontSize: FONT.body, color: COLORS.textMuted, marginBottom: SPACING.lg },
  statsGrid: { flexDirection: "row", flexWrap: "wrap", marginBottom: SPACING.md },
  sectionTitle: { fontSize: FONT.h3, fontWeight: "800", color: COLORS.adminPrimary, marginTop: SPACING.md, marginBottom: SPACING.sm },
  card: { backgroundColor: COLORS.white, borderRadius: RADIUS.lg, padding: SPACING.lg, marginBottom: SPACING.md },
});
