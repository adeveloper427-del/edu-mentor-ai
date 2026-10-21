import React from "react";
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, RefreshControl } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ProgressBar from "../../components/ProgressBar";
import EmptyState from "../../components/EmptyState";
import { useApp } from "../../context/AppContext";
import useDashboardData, { timeAgo } from "../../hooks/useDashboardData";
import { CATEGORY_LABELS } from "../../utils/subjects";
import { COLORS, RADIUS, FONT, SPACING, SHADOW } from "../../constants/theme";

export default function ParentProgressScreen() {
  const { childProfile } = useApp();
  const { loading, performance, weak, results, reload } = useDashboardData();

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, styles.center]} edges={["top"]}>
        <ActivityIndicator color={COLORS.parentPrimary} size="large" />
      </SafeAreaView>
    );
  }

  const practised = performance.filter((p) => p.attempts > 0);

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        refreshControl={<RefreshControl refreshing={false} onRefresh={reload} />}
      >
        <Text style={styles.title}>Progress Overview</Text>
        <Text style={styles.subtitle}>Detailed breakdown by subject</Text>

        {practised.length === 0 ? (
          <View style={[styles.card, SHADOW.soft]}>
            <EmptyState
              emoji="🌱"
              title="No scores yet"
              subtitle={`${childProfile.name} hasn't finished a quiz or game yet. Scores show up here automatically.`}
            />
          </View>
        ) : (
          <>
            <View style={[styles.card, SHADOW.soft]}>
              {performance.map((p) => (
                <View key={p.subject} style={{ marginBottom: SPACING.sm }}>
                  {p.attempts === 0 ? (
                    <View style={styles.notTriedRow}>
                      <Text style={styles.notTriedLabel}>{p.subject}</Text>
                      <Text style={styles.notTriedValue}>Not tried yet</Text>
                    </View>
                  ) : (
                    <ProgressBar
                      label={`${p.subject}  (${p.attempts} attempt${p.attempts === 1 ? "" : "s"})`}
                      progress={p.score / 100}
                      color={p.color}
                      height={18}
                    />
                  )}
                </View>
              ))}
            </View>

            <Text style={styles.sectionTitle}>Areas That Need Practice</Text>
            {weak.length === 0 ? (
              <View style={[styles.goodCard, SHADOW.soft]}>
                <Text style={styles.goodIcon}>🎉</Text>
                <Text style={styles.goodText}>
                  Everything {childProfile.name} has practised is above 70%. Great work!
                </Text>
              </View>
            ) : (
              weak.map((area) => (
                <View key={area.subject} style={[styles.alertCard, SHADOW.soft]}>
                  <Text style={styles.alertIcon}>⚠️</Text>
                  <Text style={styles.alertText}>
                    {area.subject} may need more practice — currently {area.score}%.
                  </Text>
                </View>
              ))
            )}

            <Text style={styles.sectionTitle}>Recent Results</Text>
            <View style={[styles.card, SHADOW.soft]}>
              {results.slice(0, 10).map((r, i) => (
                <View
                  key={i}
                  style={[styles.resultRow, i < Math.min(results.length, 10) - 1 && styles.rowBorder]}
                >
                  <Text style={styles.resultIcon}>{r.kind === "game" ? "🎮" : "📝"}</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.resultName}>
                      {CATEGORY_LABELS[r.category] ?? r.category}
                    </Text>
                    <Text style={styles.resultTime}>{timeAgo(r.created_at)}</Text>
                  </View>
                  <Text style={styles.resultScore}>
                    {r.score}/{r.total}
                  </Text>
                </View>
              ))}
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.parentBg },
  center: { alignItems: "center", justifyContent: "center" },
  scroll: { padding: SPACING.lg, paddingBottom: SPACING.xxl },
  title: { fontSize: FONT.h1 - 6, fontWeight: "800", color: COLORS.textDark },
  subtitle: { fontSize: FONT.body, color: COLORS.textMuted, marginBottom: SPACING.lg },
  card: {
    backgroundColor: COLORS.parentCard,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
  },
  sectionTitle: {
    fontSize: FONT.h3,
    fontWeight: "800",
    color: COLORS.textDark,
    marginTop: SPACING.md,
    marginBottom: SPACING.sm,
  },
  notTriedRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 2 },
  notTriedLabel: { fontSize: FONT.small, fontWeight: "700", color: COLORS.textMuted },
  notTriedValue: { fontSize: FONT.small, color: COLORS.textMuted, fontStyle: "italic" },
  alertCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.warning + "22",
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
  },
  alertIcon: { fontSize: 20, marginRight: SPACING.sm },
  alertText: { fontSize: FONT.small, color: COLORS.textDark, fontWeight: "700", flex: 1 },
  goodCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.success + "22",
    borderRadius: RADIUS.md,
    padding: SPACING.md,
  },
  goodIcon: { fontSize: 20, marginRight: SPACING.sm },
  goodText: { fontSize: FONT.small, color: COLORS.textDark, fontWeight: "700", flex: 1 },
  resultRow: { flexDirection: "row", alignItems: "center", paddingVertical: SPACING.sm },
  rowBorder: { borderBottomWidth: 1, borderBottomColor: COLORS.border },
  resultIcon: { fontSize: 20, marginRight: SPACING.md },
  resultName: { fontSize: FONT.small, fontWeight: "700", color: COLORS.textDark },
  resultTime: { fontSize: FONT.tiny, color: COLORS.textMuted, marginTop: 2 },
  resultScore: { fontSize: FONT.body, fontWeight: "900", color: COLORS.parentPrimary },
});
