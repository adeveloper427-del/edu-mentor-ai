import React, { useMemo } from "react";
import { View, Text, StyleSheet, ScrollView, RefreshControl } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import useAdminData from "../../hooks/useAdminData";
import alphabetData from "../../data/alphabetData";
import { numbersData } from "../../data/numbersData";
import colorsData from "../../data/colorsData";
import shapesData from "../../data/shapesData";
import animalsData from "../../data/animalsData";
import wordsData from "../../data/wordsData";
import quizData from "../../data/quizData";
import gamesData from "../../data/gamesData";
import { COLORS, RADIUS, FONT, SPACING, SHADOW } from "../../constants/theme";

export default function AdminContentScreen() {
  const { categories, loading, refresh } = useAdminData();

  // Counts come from the bundled learning content itself, so they always match
  // what is actually shipping in the app.
  const lessons = useMemo(
    () => [
      { id: "alphabet", title: "Alphabet A–Z", icon: "🔤", items: alphabetData.length, unit: "letters" },
      { id: "numbers", title: "Counting 1–10", icon: "🔢", items: numbersData.length, unit: "numbers" },
      { id: "colors", title: "Color Basics", icon: "🎨", items: colorsData.length, unit: "colors" },
      { id: "shapes", title: "Shape Basics", icon: "🔷", items: shapesData.length, unit: "shapes" },
      { id: "animals", title: "Animal Kingdom", icon: "🐶", items: animalsData.length, unit: "animals" },
      {
        id: "words",
        title: "Vocabulary",
        icon: "📚",
        items: wordsData.reduce((n, c) => n + c.words.length, 0),
        unit: "words",
      },
    ],
    []
  );

  const totalQuestions = useMemo(
    () => Object.values(quizData).reduce((n, q) => n + q.questions.length, 0),
    []
  );

  const attemptsFor = (id) => categories.find((c) => c.id === id)?.attempts ?? 0;

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={refresh} />}
      >
        <Text style={styles.title}>Content</Text>
        <Text style={styles.subtitle}>What's published in the app right now</Text>

        <Text style={styles.sectionTitle}>Lessons</Text>
        {lessons.map((lesson) => (
          <View key={lesson.id} style={[styles.lessonCard, SHADOW.soft]}>
            <Text style={styles.lessonIcon}>{lesson.icon}</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.lessonTitle}>{lesson.title}</Text>
              <Text style={styles.lessonMeta}>
                {lesson.items} {lesson.unit}
              </Text>
            </View>
            <View style={styles.usageBadge}>
              <Text style={styles.usageText}>{attemptsFor(lesson.id)} quizzes</Text>
            </View>
          </View>
        ))}

        <Text style={styles.sectionTitle}>Games</Text>
        {gamesData.map((game) => (
          <View key={game.id} style={[styles.lessonCard, SHADOW.soft]}>
            <Text style={styles.lessonIcon}>{game.icon}</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.lessonTitle}>{game.title}</Text>
              <Text style={styles.lessonMeta} numberOfLines={1}>
                {game.description}
              </Text>
            </View>
            <View style={[styles.usageBadge, { backgroundColor: COLORS.green + "22" }]}>
              <Text style={[styles.usageText, { color: COLORS.green }]}>
                {attemptsFor(game.id)} plays
              </Text>
            </View>
          </View>
        ))}

        <Text style={styles.sectionTitle}>Quiz Questions</Text>
        <View style={[styles.card, SHADOW.soft]}>
          <Text style={styles.questionCount}>{totalQuestions}</Text>
          <Text style={styles.questionLabel}>
            across {Object.keys(quizData).length} quiz categories
          </Text>
        </View>

        <Text style={styles.note}>
          Content is bundled with the app. Editing it here would need a content
          table in the database — a good next step if you want to update lessons
          without shipping a new build.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.adminBg },
  scroll: { padding: SPACING.lg, paddingBottom: SPACING.xxl },
  title: { fontSize: FONT.h1 - 6, fontWeight: "800", color: COLORS.adminPrimary },
  subtitle: { fontSize: FONT.body, color: COLORS.textMuted, marginBottom: SPACING.lg },
  sectionTitle: { fontSize: FONT.h3, fontWeight: "800", color: COLORS.adminPrimary, marginTop: SPACING.md, marginBottom: SPACING.sm },
  lessonCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
  },
  lessonIcon: { fontSize: 24, marginRight: SPACING.md },
  lessonTitle: { fontSize: FONT.body, fontWeight: "700", color: COLORS.textDark },
  lessonMeta: { fontSize: FONT.tiny, color: COLORS.textMuted, marginTop: 2 },
  usageBadge: {
    backgroundColor: COLORS.adminAccent + "22",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: RADIUS.pill,
  },
  usageText: { color: COLORS.adminAccent, fontWeight: "700", fontSize: FONT.tiny },
  card: { backgroundColor: COLORS.white, borderRadius: RADIUS.lg, padding: SPACING.lg, alignItems: "center" },
  questionCount: { fontSize: FONT.h1, fontWeight: "900", color: COLORS.adminAccent },
  questionLabel: { fontSize: FONT.small, color: COLORS.textMuted, marginTop: 4, textAlign: "center" },
  note: {
    fontSize: FONT.tiny,
    color: COLORS.textMuted,
    fontStyle: "italic",
    marginTop: SPACING.lg,
    lineHeight: 17,
  },
});
