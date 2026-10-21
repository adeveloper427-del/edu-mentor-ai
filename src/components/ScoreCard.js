import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { COLORS, RADIUS, FONT, SPACING, SHADOW } from "../constants/theme";

export default function ScoreCard({ score, total, message }) {
  const percent = Math.round((score / total) * 100);
  const isGreat = percent >= 60;
  return (
    <View style={[styles.card, SHADOW.card]}>
      <Text style={styles.emoji}>{isGreat ? "🎉" : "💪"}</Text>
      <Text style={styles.title}>{isGreat ? "Great Job!" : "Nice Try!"}</Text>
      <Text style={styles.score}>
        Score: {score}/{total}
      </Text>
      {message ? <Text style={styles.message}>{message}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    padding: SPACING.xl,
    alignItems: "center",
  },
  emoji: { fontSize: 64, marginBottom: SPACING.sm },
  title: { fontSize: FONT.h1, fontWeight: "800", color: COLORS.textDark },
  score: { fontSize: FONT.h3, fontWeight: "700", color: COLORS.primary, marginTop: SPACING.sm },
  message: { fontSize: FONT.body, color: COLORS.textMuted, marginTop: SPACING.sm, textAlign: "center" },
});
