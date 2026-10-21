import React, { useState } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../../../components/Header";
import ProgressBar from "../../../components/ProgressBar";
import ScoreCard from "../../../components/ScoreCard";
import AppButton from "../../../components/AppButton";
import ShapeVisual from "../../../components/ShapeVisual";
import shapesData from "../../../data/shapesData";
import { useApp } from "../../../context/AppContext";
import { COLORS, RADIUS, FONT, SPACING, SHADOW } from "../../../constants/theme";

const ROUNDS = 6;

function makeRound() {
  const shuffled = [...shapesData].sort(() => Math.random() - 0.5);
  const target = shuffled[0];
  const choices = shuffled.slice(0, 4).sort(() => Math.random() - 0.5);
  return { target, choices };
}

export default function MatchShapeGameScreen({ navigation }) {
  const [round, setRound] = useState(0);
  const [current, setCurrent] = useState(makeRound());
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState(null);
  const [finished, setFinished] = useState(false);
  const { recordGameResult, unlockBadge } = useApp();

  const handlePick = (shape) => {
    if (selected) return;
    setSelected(shape.name);
    if (shape.name === current.target.name) setScore((s) => s + 1);
  };

  const handleNext = () => {
    if (round + 1 >= ROUNDS) {
      recordGameResult("matchShape", score, ROUNDS);
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
        <Header title="Match the Shape" onBack={() => navigation.goBack()} />
        <View style={styles.finishedBody}>
          <ScoreCard score={score} total={ROUNDS} message="Shape master in the making!" />
          <AppButton title="Play Again" icon="🔁" onPress={restart} style={{ marginTop: SPACING.lg }} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <Header title="Match the Shape" subtitle={`Round ${round + 1} of ${ROUNDS}`} onBack={() => navigation.goBack()} />
      <View style={styles.body}>
        <ProgressBar progress={(round + 1) / ROUNDS} color={COLORS.green} showPercent={false} />
        <Text style={styles.prompt}>Find the: {current.target.name}</Text>

        <View style={styles.grid}>
          {current.choices.map((shape) => {
            const isCorrect = shape.name === current.target.name;
            const showState = selected && (shape.name === selected || isCorrect);
            return (
              <Pressable
                key={shape.name}
                onPress={() => handlePick(shape)}
                style={[
                  styles.tile,
                  SHADOW.soft,
                  showState && isCorrect && styles.correctTile,
                  showState && !isCorrect && shape.name === selected && styles.wrongTile,
                ]}
              >
                <ShapeVisual type={shape.type} color={shape.color} size={50} />
              </Pressable>
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
  prompt: { fontSize: FONT.h3, color: COLORS.textDark, fontWeight: "800", marginVertical: SPACING.lg, textAlign: "center" },
  grid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "center" },
  tile: {
    width: 100,
    height: 100,
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.md,
    alignItems: "center",
    justifyContent: "center",
    margin: SPACING.sm,
    borderWidth: 3,
    borderColor: "transparent",
  },
  correctTile: { borderColor: COLORS.success },
  wrongTile: { borderColor: COLORS.danger },
  finishedBody: { flex: 1, padding: SPACING.lg, justifyContent: "center" },
});
