import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../../components/Header";
import AppButton from "../../components/AppButton";
import QuizOption from "../../components/QuizOption";
import { numbersData, mathProblems, computeAnswer } from "../../data/numbersData";
import { useApp } from "../../context/AppContext";
import { speak } from "../../utils/speech";
import { COLORS, RADIUS, FONT, SPACING, SHADOW } from "../../constants/theme";

const TABS = ["Count", "Add & Subtract"];

export default function NumbersScreen({ navigation }) {
  const [tab, setTab] = useState("Count");
  const [problemIndex, setProblemIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const { addPoints, unlockBadge } = useApp();

  const problem = mathProblems[problemIndex];
  const correctAnswer = computeAnswer(problem);
  const options = React.useMemo(() => {
    const wrong1 = correctAnswer + 1;
    const wrong2 = Math.max(0, correctAnswer - 1);
    const opts = [correctAnswer, wrong1, wrong2].sort(() => Math.random() - 0.5);
    return [...new Set(opts)].slice(0, 3).map(String);
  }, [problemIndex]);

  const handleSelect = (opt) => {
    if (selected) return;
    setSelected(opt);
    if (Number(opt) === correctAnswer) {
      addPoints(5);
      unlockBadge("numberStar");
    }
  };

  const nextProblem = () => {
    setSelected(null);
    setProblemIndex((problemIndex + 1) % mathProblems.length);
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <Header title="Numbers" subtitle="Counting 1-10" onBack={() => navigation.goBack()} />

      <View style={styles.tabRow}>
        {TABS.map((t) => (
          <Pressable key={t} onPress={() => setTab(t)} style={[styles.tab, tab === t && styles.tabActive]}>
            <Text style={[styles.tabText, tab === t && styles.tabTextActive]}>{t}</Text>
          </Pressable>
        ))}
      </View>

      {tab === "Count" ? (
        <ScrollView contentContainerStyle={styles.scroll}>
          {numbersData.map((n) => (
            <Pressable
              key={n.value}
              style={[styles.numberCard, SHADOW.soft]}
              onPress={() => speak(`${n.word}, ${n.value}`)}
            >
              <View style={styles.numberBadge}>
                <Text style={styles.numberBadgeText}>{n.value}</Text>
              </View>
              <Text style={styles.objects}>{n.emoji.repeat(n.value)}</Text>
              <Text style={styles.numberWord}>{n.word}</Text>
            </Pressable>
          ))}
        </ScrollView>
      ) : (
        <View style={styles.mathBody}>
          <Text style={styles.mathQuestion}>
            {problem.emoji.repeat(problem.a)} {problem.op} {problem.emoji.repeat(problem.b)} = ?
          </Text>
          <Text style={styles.mathSub}>
            {problem.a} {problem.op} {problem.b} = ?
          </Text>

          {options.map((opt) => (
            <QuizOption
              key={opt}
              label={opt}
              onPress={() => handleSelect(opt)}
              state={
                !selected
                  ? "default"
                  : opt === String(correctAnswer)
                  ? "correct"
                  : opt === selected
                  ? "incorrect"
                  : "disabled"
              }
            />
          ))}

          {selected ? (
            <AppButton title="Next Problem" icon="➡️" onPress={nextProblem} style={{ marginTop: SPACING.md }} />
          ) : null}
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  tabRow: { flexDirection: "row", paddingHorizontal: SPACING.lg, marginBottom: SPACING.sm },
  tab: {
    flex: 1,
    paddingVertical: SPACING.sm + 2,
    alignItems: "center",
    borderRadius: RADIUS.pill,
    marginHorizontal: 4,
    backgroundColor: COLORS.white,
  },
  tabActive: { backgroundColor: COLORS.blue },
  tabText: { fontWeight: "700", color: COLORS.textMuted },
  tabTextActive: { color: COLORS.white },
  scroll: { padding: SPACING.lg },
  numberCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.sm + 4,
    flexDirection: "row",
    alignItems: "center",
  },
  numberBadge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.blue,
    alignItems: "center",
    justifyContent: "center",
    marginRight: SPACING.md,
  },
  numberBadgeText: { color: COLORS.white, fontWeight: "900", fontSize: FONT.h3 },
  objects: { fontSize: FONT.h3, flex: 1 },
  numberWord: { fontSize: FONT.body, fontWeight: "700", color: COLORS.textDark },
  mathBody: { flex: 1, padding: SPACING.lg },
  mathQuestion: { fontSize: 40, textAlign: "center", marginBottom: SPACING.xs },
  mathSub: { fontSize: FONT.h3, textAlign: "center", color: COLORS.textMuted, marginBottom: SPACING.xl, fontWeight: "700" },
});
