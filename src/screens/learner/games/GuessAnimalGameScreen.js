import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../../../components/Header";
import ProgressBar from "../../../components/ProgressBar";
import ScoreCard from "../../../components/ScoreCard";
import AppButton from "../../../components/AppButton";
import QuizOption from "../../../components/QuizOption";
import animalsData from "../../../data/animalsData";
import { useApp } from "../../../context/AppContext";
import { COLORS, FONT, SPACING } from "../../../constants/theme";

const ROUNDS = 6;

function makeRound() {
  const shuffled = [...animalsData].sort(() => Math.random() - 0.5);
  const target = shuffled[0];
  const options = shuffled.slice(0, 3).map((a) => a.name).sort(() => Math.random() - 0.5);
  return { target, options };
}

export default function GuessAnimalGameScreen({ navigation }) {
  const [round, setRound] = useState(0);
  const [current, setCurrent] = useState(makeRound());
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState(null);
  const [finished, setFinished] = useState(false);
  const { recordGameResult, unlockBadge } = useApp();

  const handlePick = (name) => {
    if (selected) return;
    setSelected(name);
    if (name === current.target.name) setScore((s) => s + 1);
  };

  const handleNext = () => {
    if (round + 1 >= ROUNDS) {
      recordGameResult("guessAnimal", score, ROUNDS);
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
        <Header title="Guess the Animal" onBack={() => navigation.goBack()} />
        <View style={styles.finishedBody}>
          <ScoreCard score={score} total={ROUNDS} message="Wildlife expert in training!" />
          <AppButton title="Play Again" icon="🔁" onPress={restart} style={{ marginTop: SPACING.lg }} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <Header title="Guess the Animal" subtitle={`Round ${round + 1} of ${ROUNDS}`} onBack={() => navigation.goBack()} />
      <View style={styles.body}>
        <ProgressBar progress={(round + 1) / ROUNDS} color={COLORS.purple} showPercent={false} />
        <Text style={styles.prompt}>I say "{current.target.sound}" and...</Text>
        <Text style={styles.fact}>{current.target.fact}</Text>
        <Text style={styles.question}>Who am I?</Text>

        {current.options.map((name) => (
          <QuizOption
            key={name}
            label={name}
            onPress={() => handlePick(name)}
            state={
              !selected
                ? "default"
                : name === current.target.name
                ? "correct"
                : name === selected
                ? "incorrect"
                : "disabled"
            }
          />
        ))}

        {selected ? (
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
  prompt: { fontSize: FONT.h3, fontWeight: "800", color: COLORS.textDark, marginTop: SPACING.lg, textAlign: "center" },
  fact: { fontSize: FONT.body, color: COLORS.textMuted, textAlign: "center", marginTop: SPACING.sm, marginBottom: SPACING.md },
  question: { fontSize: FONT.h3, fontWeight: "800", color: COLORS.primary, textAlign: "center", marginBottom: SPACING.lg },
  finishedBody: { flex: 1, padding: SPACING.lg, justifyContent: "center" },
});
