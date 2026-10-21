import React from "react";
import { View, Text, StyleSheet, ScrollView, Dimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import LearningCard from "../../components/LearningCard";
import { useApp } from "../../context/AppContext";
import { COLORS, FONT, SPACING } from "../../constants/theme";

const { width } = Dimensions.get("window");
const CARD_WIDTH = (width - SPACING.lg * 2 - SPACING.md) / 2;

const cards = [
  { key: "Alphabet", icon: "🔤", color: COLORS.secondary },
  { key: "Numbers", icon: "🔢", color: COLORS.blue },
  { key: "Colors", icon: "🎨", color: COLORS.pink },
  { key: "Shapes", icon: "🔷", color: COLORS.green },
  { key: "Animals", icon: "🐶", color: COLORS.purple },
  { key: "Words", icon: "📚", color: COLORS.yellow },
  { key: "Games", icon: "🎮", color: COLORS.accent },
  { key: "Mentor", icon: "🤖", color: COLORS.primary },
  { key: "Rewards", icon: "🏆", color: COLORS.red },
];

const routeMap = {
  Alphabet: "Alphabet",
  Numbers: "Numbers",
  Colors: "Colors",
  Shapes: "Shapes",
  Animals: "Animals",
  Words: "Words",
  Games: "GamesTab",
  Mentor: "MentorTab",
  Rewards: "RewardsTab",
};

export default function LearnerHomeScreen({ navigation }) {
  const { stats, childProfile } = useApp();
  const user = childProfile;

  const handlePress = (key) => {
    const target = routeMap[key];
    if (["GamesTab", "MentorTab", "RewardsTab"].includes(target)) {
      navigation.navigate(target);
    } else {
      navigation.navigate("LearnTab", { screen: target });
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.hello}>Hello, {user.name}! 👋</Text>
            <Text style={styles.subtitle}>Ready to learn something new?</Text>
          </View>
          <View style={styles.avatarWrap}>
            <Text style={styles.avatar}>{user.avatar}</Text>
          </View>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statPill}>
            <Text style={styles.statEmoji}>⭐</Text>
            <Text style={styles.statText}>{stats.points} pts</Text>
          </View>
          <View style={styles.statPill}>
            <Text style={styles.statEmoji}>🔥</Text>
            <Text style={styles.statText}>{stats.streak} day streak</Text>
          </View>
          <View style={styles.statPill}>
            <Text style={styles.statEmoji}>🏅</Text>
            <Text style={styles.statText}>{stats.badges.length} badges</Text>
          </View>
        </View>

        <View style={styles.grid}>
          {cards.map((card) => (
            <LearningCard
              key={card.key}
              icon={card.icon}
              title={card.key === "Mentor" ? "Ask Mentor" : card.key}
              color={card.color}
              width={CARD_WIDTH}
              onPress={() => handlePress(card.key)}
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
  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  hello: { fontSize: FONT.h1 - 4, fontWeight: "900", color: COLORS.textDark },
  subtitle: { fontSize: FONT.body, color: COLORS.textMuted, marginTop: 4 },
  avatarWrap: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.white,
    alignItems: "center",
    justifyContent: "center",
  },
  avatar: { fontSize: 32 },
  statsRow: { flexDirection: "row", marginTop: SPACING.lg, marginBottom: SPACING.lg },
  statPill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.white,
    borderRadius: 999,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginRight: SPACING.sm,
  },
  statEmoji: { fontSize: 16, marginRight: 6 },
  statText: { fontSize: FONT.small, fontWeight: "700", color: COLORS.textDark },
  grid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" },
});
