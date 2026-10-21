import React, { useState } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../../../components/Header";
import ProgressBar from "../../../components/ProgressBar";
import ScoreCard from "../../../components/ScoreCard";
import AppButton from "../../../components/AppButton";
import colorsData from "../../../data/colorsData";
import { useApp } from "../../../context/AppContext";
import { COLORS, RADIUS, FONT, SPACING, SHADOW } from "../../../constants/theme";

const ROUNDS = 6;

function makeRound() {
  const shuffled = [...colorsData].sort(() => Math.random() - 0.5);
  const target = shuffled[0];
  const choices = shuffled.slice(0, 4).sort(() => Math.random() - 0.5);
  return { target, choices };
}

export default function FindColorGameScreen({ navigation }) {
  const [round, setRound] = useState(0);
  const [current, setCurrent] = useState(makeRound());
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState(null);
  const [finished, setFinished] = useState(false);
  const { recordGameResult, unlockBadge } = useApp();

  const handlePick = (color) => {
    if (selected) return;
    setSelected(color.name);
    if (color.name === current.target.name) setScore((s) => s + 1);
  };

  const handleNext = () => {
    if (round + 1 >= ROUNDS) {
      recordGameResult("findColor", score, ROUNDS);
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
        <Header title="Find the Color" onBack={() => navigation.goBack()} />
        <View style={styles.finishedBody}>
          <ScoreCard score={score} total={ROUNDS} message="Your color skills are amazing!" />
          <AppButton title="Play Again" icon="🔁" onPress={restart} style={{ marginTop: SPACING.lg }} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <Header title="Find the Color" subtitle={`Round ${round + 1} of ${ROUNDS}`} onBack={() => navigation.goBack()} />
      <View style={styles.body}>
        <ProgressBar progress={(round + 1) / ROUNDS} color={COLORS.yellow} showPercent={false} />
        <Text style={styles.prompt}>
          Find: <Text style={{ fontWeight: "900" }}>{current.target.name}</Text> {current.target.emoji}
        </Text>

        <View style={styles.grid}>
          {current.choices.map((color) => {
            const isCorrect = color.name === current.target.name;
            const showState = selected && (color.name === selected || isCorrect);
            return (
              <Pressable
                key={color.name}
                onPress={() => handlePick(color)}
                style={[
                  styles.swatch,
                  { backgroundColor: color.hex },
                  SHADOW.soft,
                  showState && isCorrect && styles.correctBorder,
                  showState && !isCorrect && color.name === selected && styles.wrongBorder,
                ]}
              />
            );
          })}
        </View>

        {selected ? (
          <AppButton
            title={round + 1 >= ROUNDS ? "See Results" : "Next"}
            icon="➡️"
            onPress={handleNext}
            style={{ marginTop: SPACING.lg }}
          />
        ) : null}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  body: { flex: 1, padding: SPACING.lg, alignItems: "center" },
  prompt: { fontSize: FONT.h3, color: COLORS.textDark, marginVertical: SPACING.lg, textAlign: "center" },
  grid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "center" },
  swatch: {
    width: 90,
    height: 90,
    borderRadius: RADIUS.md,
    margin: SPACING.sm,
    borderWidth: 4,
    borderColor: "transparent",
  },
  correctBorder: { borderColor: COLORS.success },
  wrongBorder: { borderColor: COLORS.danger },
  finishedBody: { flex: 1, padding: SPACING.lg, justifyContent: "center" },
});
