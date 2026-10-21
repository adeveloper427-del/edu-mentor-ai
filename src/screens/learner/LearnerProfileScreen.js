import React from "react";
import { View, Text, StyleSheet, ScrollView, Switch } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ProgressBar from "../../components/ProgressBar";
import StatCard from "../../components/StatCard";
import AppButton from "../../components/AppButton";
import EmptyState from "../../components/EmptyState";
import { useApp } from "../../context/AppContext";
import useDashboardData from "../../hooks/useDashboardData";
import { COLORS, RADIUS, FONT, SPACING, SHADOW } from "../../constants/theme";

export default function LearnerProfileScreen({ navigation }) {
  const { stats, setRole, signOut, childProfile, soundEnabled, toggleSound } = useApp();
  const { performance } = useDashboardData();
  const user = childProfile;
  const practised = performance.filter((p) => p.attempts > 0);

  const handleSwitchProfile = () => {
    setRole(null);
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={[styles.profileCard, SHADOW.card]}>
          <View style={styles.avatarWrap}>
            <Text style={styles.avatar}>{user.avatar}</Text>
          </View>
          <Text style={styles.name}>{user.name}</Text>
          <Text style={styles.meta}>Age {user.age} • Kindergarten Learner</Text>
        </View>

        <View style={styles.statsRow}>
          <StatCard icon="⭐" label="Points" value={stats.points} color={COLORS.yellow} />
          <StatCard icon="📚" label="Lessons Done" value={stats.lessonsCompleted} color={COLORS.blue} />
          <StatCard icon="🔥" label="Day Streak" value={stats.streak} color={COLORS.red} />
        </View>

        <Text style={styles.sectionTitle}>Learning Progress</Text>
        <View style={[styles.progressCard, SHADOW.soft]}>
          {practised.length === 0 ? (
            <EmptyState
              emoji="🌟"
              title="Let's get started!"
              subtitle="Play a quiz or a game and watch your progress grow."
            />
          ) : (
            practised.map((p) => (
              <ProgressBar key={p.subject} label={p.subject} progress={p.score / 100} color={p.color} />
            ))
          )}
        </View>

        <Text style={styles.sectionTitle}>Badges Earned</Text>
        <View style={[styles.badgesRow]}>
          {stats.badges.map((b) => (
            <View key={b} style={styles.badgeChip}>
              <Text style={styles.badgeChipText}>🏅</Text>
            </View>
          ))}
          {stats.badges.length === 0 && <Text style={styles.emptyText}>No badges yet — start learning!</Text>}
        </View>

        <Text style={styles.sectionTitle}>Settings</Text>
        <View style={[styles.settingRow, SHADOW.soft]}>
          <Text style={styles.settingIcon}>{soundEnabled ? "🔊" : "🔇"}</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.settingTitle}>Talking Mentor</Text>
            <Text style={styles.settingSubtitle}>
              {soundEnabled ? "Lessons and answers are read aloud" : "Everything stays quiet"}
            </Text>
          </View>
          <Switch
            value={soundEnabled}
            onValueChange={toggleSound}
            trackColor={{ false: COLORS.border, true: COLORS.primary + "88" }}
            thumbColor={soundEnabled ? COLORS.primary : COLORS.textMuted}
          />
        </View>

        <AppButton
          title="Switch Profile"
          icon="🔄"
          outline
          onPress={handleSwitchProfile}
          style={{ marginTop: SPACING.xl }}
        />
        <AppButton
          title="Log Out"
          icon="🚪"
          color={COLORS.danger}
          onPress={signOut}
          style={{ marginTop: SPACING.sm }}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  scroll: { padding: SPACING.lg, paddingBottom: SPACING.xxl },
  profileCard: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.xl,
    alignItems: "center",
    paddingVertical: SPACING.xl,
    marginBottom: SPACING.lg,
  },
  avatarWrap: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "rgba(255,255,255,0.25)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: SPACING.sm,
  },
  avatar: { fontSize: 48 },
  name: { fontSize: FONT.h1 - 6, fontWeight: "900", color: COLORS.white },
  meta: { fontSize: FONT.small, color: "rgba(255,255,255,0.9)", marginTop: 4 },
  statsRow: { flexDirection: "row", marginBottom: SPACING.lg },
  sectionTitle: { fontSize: FONT.h3, fontWeight: "800", color: COLORS.textDark, marginBottom: SPACING.sm, marginTop: SPACING.sm },
  progressCard: { backgroundColor: COLORS.white, borderRadius: RADIUS.lg, padding: SPACING.lg, marginBottom: SPACING.lg },
  badgesRow: { flexDirection: "row", flexWrap: "wrap" },
  badgeChip: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.white,
    alignItems: "center",
    justifyContent: "center",
    marginRight: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  badgeChipText: { fontSize: 22 },
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
  },
  settingIcon: { fontSize: 26, marginRight: SPACING.md },
  settingTitle: { fontSize: FONT.body, fontWeight: "800", color: COLORS.textDark },
  settingSubtitle: { fontSize: FONT.tiny, color: COLORS.textMuted, marginTop: 2 },
  emptyText: { color: COLORS.textMuted, fontSize: FONT.small },
});
