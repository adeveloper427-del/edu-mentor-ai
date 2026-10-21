import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { COLORS, RADIUS, FONT, SPACING, SHADOW } from "../constants/theme";

export default function StatCard({ icon, label, value, color = COLORS.primary, small }) {
  return (
    <View style={[styles.card, SHADOW.soft, small && styles.small]}>
      <View style={[styles.iconWrap, { backgroundColor: color + "22" }]}>
        <Text style={styles.icon}>{icon}</Text>
      </View>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.label} numberOfLines={2}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    margin: SPACING.xs,
    minWidth: 140,
  },
  small: { minWidth: 100, padding: SPACING.sm + 4 },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.sm,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: SPACING.sm,
  },
  icon: { fontSize: 20 },
  value: { fontSize: FONT.h2, fontWeight: "800", color: COLORS.textDark },
  label: { fontSize: FONT.small, color: COLORS.textMuted, marginTop: 2 },
});
