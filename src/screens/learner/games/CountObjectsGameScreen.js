import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../../../components/Header";
import ProgressBar from "../../../components/ProgressBar";
import ScoreCard from "../../../components/ScoreCard";
import AppButton from "../../../components/AppButton";
import QuizOption from "../../../components/QuizOption";
import { useApp } from "../../../context/AppContext";
import { COLORS, FONT, SPACING } from "../../../constants/theme";

const EMOJIS = ["🍎", "⭐", "🎈", "🍌", "🐸", "🍇"];
const ROUNDS = 6;

function makeRound() {
  const count = Math.floor(Math.random() * 8) + 2;
  const emoji = EMOJIS[Math.floor(Math.random() * EMOJIS.length)];
  const options = new Set([count]);
  while (options.size < 3) {
    const delta = Math.random() > 0.5 ? 1 : -1;
    const candidate = count + delta * (Math.floor(Math.random() * 2) + 1);
    if (candidate > 0) options.add(candidate);
  }
  return { count, emoji, options: [...options].sort(() => Math.random() - 0.5) };
}

export default function CountObjectsGameScreen({ navigation }) {
  const [round, setRound] = useState(0);
  const [current, setCurrent] = useState(makeRound());
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState(null);
  const [finished, setFinished] = useState(false);
  const { recordGameResult, unlockBadge } = useApp();

  const handlePick = (num) => {
    if (selected !== null) return;
    setSelected(num);
    if (num === current.count) setScore((s) => s + 1);
  };

  const handleNext = () => {
    if (round + 1 >= ROUNDS) {
      recordGameResult("countObjects", score, ROUNDS);
      if (score >= ROUNDS - 1) unlockBadge("gameWinner");
      setFinished(true);
    } else {
      setRound((r) => r + 1);
      setCurrent(makeRound());
      setSelected(null);
    }
  };

  const restart = () => {
    setRound(0);
    setCurrent(makeRound());
    setScore(0);
    setSelected(null);
    setFinished(false);
  };

  if (finished) {
    return (
      <SafeAreaView style={styles.container} edges={["top"]}>
        <Header title="Count the Objects" onBack={() => navigation.goBack()} />
        <View style={styles.finishedBody}>
          <ScoreCard score={score} total={ROUNDS} message="You're a counting star!" />
          <AppButton title="Play Again" icon="🔁" onPress={restart} style={{ marginTop: SPACING.lg }} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <Header title="Count the Objects" subtitle={`Round ${round + 1} of ${ROUNDS}`} onBack={() => navigation.goBack()} />
      <View style={styles.body}>
        <ProgressBar progress={(round + 1) / ROUNDS} color={COLORS.blue} showPercent={false} />
        <Text style={styles.prompt}>How many do you see?</Text>
        <Text style={styles.objects}>{current.emoji.repeat(current.count)}</Text>

        {current.options.map((opt) => (
          <QuizOption
            key={opt}
            label={String(opt)}
            onPress={() => handlePick(opt)}
            state={
              selected === null
                ? "default"
                : opt === current.count
                ? "correct"
                : opt === selected
                ? "incorrect"
                : "disabled"
            }
          />
        ))}

        {selected !== null ? (
          <AppButton
            title={round + 1 >= ROUNDS ? "See Results" : "Next"}
            icon="➡️"
            onPress={handleNext}
            style={{ marginTop: SPACING.md }}
          />
        ) : null}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  body: { flex: 1, padding: SPACING.lg },
  prompt: { fontSize: FONT.h3, color: COLORS.textMuted, marginVertical: SPACING.md, textAlign: "center" },
  objects: { fontSize: 40, textAlign: "center", marginBottom: SPACING.lg, lineHeight: 50 },
  finishedBody: { flex: 1, padding: SPACING.lg, justifyContent: "center" },
});
