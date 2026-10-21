import React from "react";
import { Pressable, Text, StyleSheet } from "react-native";
import { COLORS, RADIUS, FONT, SPACING } from "../constants/theme";

export default function QuizOption({ label, onPress, state = "default" }) {
  const stateStyles = {
    default: { bg: COLORS.white, border: COLORS.border, text: COLORS.textDark },
    correct: { bg: COLORS.success + "22", border: COLORS.success, text: COLORS.success },
    incorrect: { bg: COLORS.danger + "22", border: COLORS.danger, text: COLORS.danger },
    disabled: { bg: COLORS.white, border: COLORS.border, text: COLORS.textMuted },
  }[state];

  return (
    <Pressable
      onPress={onPress}
      disabled={state !== "default"}
      style={({ pressed }) => [
        styles.option,
        {
          backgroundColor: stateStyles.bg,
          borderColor: stateStyles.border,
          opacity: pressed && state === "default" ? 0.85 : 1,
        },
      ]}
    >
      <Text style={[styles.text, { color: stateStyles.text }]}>{label}</Text>
      {state === "correct" && <Text style={styles.icon}>✅</Text>}
      {state === "incorrect" && <Text style={styles.icon}>❌</Text>}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  option: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 2,
    borderRadius: RADIUS.md,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.sm + 4,
  },
  text: { fontSize: FONT.h3, fontWeight: "700" },
  icon: { fontSize: FONT.h3 },
});
