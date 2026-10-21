import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { COLORS, RADIUS, FONT, SPACING, SHADOW } from "../constants/theme";

export default function BadgeCard({ emoji, name, description, unlocked = true }) {
  return (
    <View style={[styles.card, SHADOW.soft, !unlocked && styles.locked]}>
      <View style={[styles.emojiWrap, { backgroundColor: unlocked ? COLORS.yellow + "33" : COLORS.border }]}>
        <Text style={styles.emoji}>{unlocked ? emoji : "🔒"}</Text>
      </View>
      <Text style={[styles.name, !unlocked && styles.mutedText]} numberOfLines={1}>
        {name}
      </Text>
      <Text style={[styles.desc, !unlocked && styles.mutedText]} numberOfLines={2}>
        {description}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    alignItems: "center",
    margin: SPACING.xs,
    minWidth: 140,
  },
  locked: { opacity: 0.6 },
  emojiWrap: {
    width: 56,
    height: 56,
    borderRadius: RADIUS.pill,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: SPACING.sm,
  },
  emoji: { fontSize: 28 },
  name: { fontSize: FONT.small, fontWeight: "800", color: COLORS.textDark, textAlign: "center" },
  desc: { fontSize: FONT.tiny, color: COLORS.textMuted, textAlign: "center", marginTop: 4 },
  mutedText: { color: COLORS.textMuted },
});
