import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../../components/Header";
import wordsData from "../../data/wordsData";
import { speak } from "../../utils/speech";
import { COLORS, RADIUS, FONT, SPACING, SHADOW } from "../../constants/theme";

export default function WordsScreen({ navigation }) {
  const [activeCategory, setActiveCategory] = useState(wordsData[0].category);
  const category = wordsData.find((c) => c.category === activeCategory);

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <Header title="Words" subtitle="Build your vocabulary" onBack={() => navigation.goBack()} />

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabRow}>
        {wordsData.map((c) => (
          <Pressable
            key={c.category}
            onPress={() => setActiveCategory(c.category)}
            style={[
              styles.tab,
              { backgroundColor: activeCategory === c.category ? c.color : COLORS.white },
            ]}
          >
            <Text style={styles.tabIcon}>{c.icon}</Text>
            <Text style={[styles.tabText, activeCategory === c.category && { color: COLORS.white }]}>
              {c.category}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      <ScrollView contentContainerStyle={styles.grid}>
        {category.words.map((w) => (
          <Pressable
            key={w.word}
            style={[styles.wordCard, SHADOW.soft]}
            onPress={() => speak(w.word)}
          >
            <Text style={styles.wordEmoji}>{w.emoji}</Text>
            <Text style={styles.wordText}>{w.word}</Text>
          </Pressable>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  tabRow: { paddingHorizontal: SPACING.lg, paddingBottom: SPACING.sm },
  tab: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderRadius: RADIUS.pill,
    marginRight: SPACING.sm,
  },
  tabIcon: { fontSize: 16, marginRight: 6 },
  tabText: { fontWeight: "700", color: COLORS.textDark },
  grid: { flexDirection: "row", flexWrap: "wrap", padding: SPACING.lg, justifyContent: "space-between" },
  wordCard: {
    width: "47%",
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    alignItems: "center",
    paddingVertical: SPACING.lg,
    marginBottom: SPACING.md,
  },
  wordEmoji: { fontSize: 48 },
  wordText: { fontSize: FONT.body, fontWeight: "800", color: COLORS.textDark, marginTop: SPACING.sm },
});
