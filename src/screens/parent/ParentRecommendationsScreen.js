import React from "react";
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, RefreshControl } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import EmptyState from "../../components/EmptyState";
import { useApp } from "../../context/AppContext";
import useDashboardData from "../../hooks/useDashboardData";
import { COLORS, RADIUS, FONT, SPACING, SHADOW } from "../../constants/theme";

export default function ParentRecommendationsScreen() {
  const { childProfile } = useApp();
  const { loading, weak, recommendations, results, reload } = useDashboardData();

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, styles.center]} edges={["top"]}>
        <ActivityIndicator color={COLORS.parentPrimary} size="large" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        refreshControl={<RefreshControl refreshing={false} onRefresh={reload} />}
      >
        <Text style={styles.title}>Recommendations</Text>
        <Text style={styles.subtitle}>
          Personalized suggestions based on {childProfile.name}'s activity
        </Text>

        {results.length === 0 ? (
          <View style={[styles.card, SHADOW.soft]}>
            <EmptyState
              emoji="🧭"
              title="Nothing to suggest yet"
              subtitle={`Once ${childProfile.name} plays a few quizzes and games, tailored suggestions appear here.`}
            />
          </View>
        ) : (
          <>
            {weak.length > 0 ? (
              weak.map((area) => (
                <View key={area.subject} style={[styles.focusCard, SHADOW.card]}>
                  <Text style={styles.focusIcon}>🎯</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.focusTitle}>Focus Area: {area.subject}</Text>
                    <Text style={styles.focusText}>
                      Scoring {area.score}% across {area.attempts} attempt
                      {area.attempts === 1 ? "" : "s"} — worth some extra practice.
                    </Text>
                  </View>
                </View>
              ))
            ) : (
              <View style={[styles.focusCard, { backgroundColor: COLORS.parentAccent }, SHADOW.card]}>
                <Text style={styles.focusIcon}>🌟</Text>
                <View style={{ flex: 1 }}>
                  <Text style={styles.focusTitle}>Doing great!</Text>
                  <Text style={styles.focusText}>
                    {childProfile.name} is scoring well in everything practised so far.
                  </Text>
                </View>
              </View>
            )}

            <Text style={styles.sectionTitle}>Recommended Activities</Text>
            {recommendations.length === 0 ? (
              <View style={[styles.card, SHADOW.soft]}>
                <Text style={styles.plainText}>
                  Keep going with any subject — {childProfile.name} is on track.
                </Text>
              </View>
            ) : (
              recommendations.map((activity, i) => (
                <View key={i} style={[styles.activityCard, SHADOW.soft]}>
                  <View style={styles.activityIconWrap}>
                    <Text style={styles.activityIcon}>{activity.icon}</Text>
                  </View>
                  <Text style={styles.activityText}>{activity.text}</Text>
                </View>
              ))
            )}
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
  plainText: { fontSize: FONT.body, color: COLORS.textMuted, textAlign: "center" },
  focusCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.parentPrimary,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
  },
  focusIcon: { fontSize: 32, marginRight: SPACING.md },
  focusTitle: { fontSize: FONT.body, fontWeight: "800", color: COLORS.white },
  focusText: { fontSize: FONT.small, color: "rgba(255,255,255,0.9)", marginTop: 4 },
  sectionTitle: {
    fontSize: FONT.h3,
    fontWeight: "800",
    color: COLORS.textDark,
    marginTop: SPACING.md,
    marginBottom: SPACING.sm,
  },
  activityCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.parentCard,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
  },
  activityIconWrap: {
    width: 44,
    height: 44,
    borderRadius: RADIUS.sm,
    backgroundColor: COLORS.parentAccent + "22",
    alignItems: "center",
    justifyContent: "center",
    marginRight: SPACING.md,
  },
  activityIcon: { fontSize: 22 },
  activityText: { flex: 1, fontSize: FONT.body, fontWeight: "600", color: COLORS.textDark },
});
