import React, { useMemo, useState } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../../../components/Header";
import ProgressBar from "../../../components/ProgressBar";
import ScoreCard from "../../../components/ScoreCard";
import AppButton from "../../../components/AppButton";
import { useApp } from "../../../context/AppContext";
import { COLORS, RADIUS, FONT, SPACING, SHADOW } from "../../../constants/theme";

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
const ROUNDS = 8;

function makeRound() {
  const target = ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
  const choices = new Set([target]);
  while (choices.size < 4) {
    choices.add(ALPHABET[Math.floor(Math.random() * ALPHABET.length)]);
  }
  return { target, choices: [...choices].sort(() => Math.random() - 0.5) };
}

export default function FindLetterGameScreen({ navigation }) {
  const [round, setRound] = useState(0);
  const [current, setCurrent] = useState(makeRound());
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState(null);
  const [finished, setFinished] = useState(false);
  const { recordGameResult, unlockBadge } = useApp();

  const handlePick = (letter) => {
    if (selected) return;
    setSelected(letter);
    const correct = letter === current.target;
    if (correct) setScore((s) => s + 1);
    setTimeout(() => {
      if (round + 1 >= ROUNDS) {
        const finalCorrect = correct ? score + 1 : score;
        recordGameResult("findLetter", finalCorrect, ROUNDS);
        if (finalCorrect >= ROUNDS - 1) unlockBadge("gameWinner");
        setFinished(true);
      } else {
        setRound((r) => r + 1);
        setCurrent(makeRound());
        setSelected(null);
      }
    }, 500);
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
        <Header title="Find the Letter" onBack={() => navigation.goBack()} />
        <View style={styles.finishedBody}>
          <ScoreCard score={score} total={ROUNDS} message="Great letter hunting!" />
          <AppButton title="Play Again" icon="🔁" onPress={restart} style={{ marginTop: SPACING.lg }} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <Header title="Find the Letter" subtitle={`Round ${round + 1} of ${ROUNDS}`} onBack={() => navigation.goBack()} />
      <View style={styles.body}>
        <ProgressBar progress={(round + 1) / ROUNDS} color={COLORS.red} showPercent={false} />
        <Text style={styles.prompt}>Find the letter:</Text>
        <Text style={styles.target}>{current.target}</Text>

        <View style={styles.grid}>
          {current.choices.map((letter) => {
            const isCorrect = letter === current.target;
            const showState = selected && (letter === selected || isCorrect);
            return (
              <Pressable
                key={letter}
                onPress={() => handlePick(letter)}
                style={[
                  styles.tile,
                  SHADOW.soft,
                  showState && isCorrect && styles.correctTile,
                  showState && !isCorrect && letter === selected && styles.wrongTile,
                ]}
              >
                <Text style={styles.tileText}>{letter}</Text>
              </Pressable>
            );
          })}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  body: { flex: 1, padding: SPACING.lg, alignItems: "center" },
  prompt: { fontSize: FONT.h3, color: COLORS.textMuted, marginTop: SPACING.lg },
  target: { fontSize: 80, fontWeight: "900", color: COLORS.red, marginVertical: SPACING.md },
  grid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "center", marginTop: SPACING.lg },
  tile: {
    width: 80,
    height: 80,
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.md,
    alignItems: "center",
    justifyContent: "center",
    margin: SPACING.sm,
  },
  tileText: { fontSize: FONT.h1 - 8, fontWeight: "800", color: COLORS.textDark },
  correctTile: { backgroundColor: COLORS.success + "33" },
  wrongTile: { backgroundColor: COLORS.danger + "33" },
  finishedBody: { flex: 1, padding: SPACING.lg, justifyContent: "center" },
});
