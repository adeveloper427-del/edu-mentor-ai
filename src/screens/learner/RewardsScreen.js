import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import BadgeCard from "../../components/BadgeCard";
import { useApp } from "../../context/AppContext";
import { badgeDefinitions } from "../../data/userData";
import { COLORS, RADIUS, FONT, SPACING, SHADOW } from "../../constants/theme";

export default function RewardsScreen() {
  const { stats } = useApp();

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>🏆 My Rewards</Text>

        <View style={styles.statsRow}>
          <View style={[styles.statCard, { backgroundColor: COLORS.yellow }, SHADOW.card]}>
            <Text style={styles.statEmoji}>⭐</Text>
            <Text style={styles.statValue}>{stats.points}</Text>
            <Text style={styles.statLabel}>Points</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: COLORS.red }, SHADOW.card]}>
            <Text style={styles.statEmoji}>🔥</Text>
            <Text style={styles.statValue}>{stats.streak}</Text>
            <Text style={styles.statLabel}>Day Streak</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: COLORS.purple }, SHADOW.card]}>
            <Text style={styles.statEmoji}>🏅</Text>
            <Text style={styles.statValue}>{stats.badges.length}</Text>
            <Text style={styles.statLabel}>Badges</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>My Badges</Text>
        <View style={styles.badgeGrid}>
          {badgeDefinitions.map((badge) => (
            <BadgeCard
              key={badge.id}
              emoji={badge.emoji}
              name={badge.name}
              description={badge.description}
              unlocked={stats.badges.includes(badge.id)}
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  scroll: { padding: SPACING.lg, paddingBottom: SPACING.xxl },
  title: { fontSize: FONT.h1 - 4, fontWeight: "900", color: COLORS.textDark, marginBottom: SPACING.lg },
  statsRow: { flexDirection: "row", marginBottom: SPACING.xl },
  statCard: {
    flex: 1,
    borderRadius: RADIUS.lg,
    alignItems: "center",
    paddingVertical: SPACING.lg,
    marginHorizontal: 4,
  },
  statEmoji: { fontSize: 28 },
  statValue: { fontSize: FONT.h1 - 8, fontWeight: "900", color: COLORS.white, marginTop: 4 },
  statLabel: { fontSize: FONT.tiny, color: "rgba(255,255,255,0.9)", fontWeight: "700", marginTop: 2 },
  sectionTitle: { fontSize: FONT.h3, fontWeight: "800", color: COLORS.textDark, marginBottom: SPACING.sm },
  badgeGrid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" },
});
