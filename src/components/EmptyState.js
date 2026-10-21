import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { COLORS, FONT, SPACING } from "../constants/theme";

export default function EmptyState({ emoji = "✨", title, subtitle }) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.emoji}>{emoji}</Text>
      {title ? <Text style={styles.title}>{title}</Text> : null}
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: "center", justifyContent: "center", padding: SPACING.xl },
  emoji: { fontSize: 64, marginBottom: SPACING.md },
  title: { fontSize: FONT.h3, fontWeight: "800", color: COLORS.textDark, textAlign: "center" },
  subtitle: { fontSize: FONT.body, color: COLORS.textMuted, textAlign: "center", marginTop: SPACING.xs },
});
