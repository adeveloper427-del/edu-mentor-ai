import React from "react";
import { Pressable, Text, View, StyleSheet } from "react-native";
import { COLORS, RADIUS, FONT, SPACING, SHADOW } from "../constants/theme";

export default function CategoryCard({ icon, title, subtitle, color = COLORS.primary, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        SHADOW.soft,
        { opacity: pressed ? 0.9 : 1, transform: [{ scale: pressed ? 0.98 : 1 }] },
      ]}
    >
      <View style={[styles.iconWrap, { backgroundColor: color + "22" }]}>
        <Text style={styles.icon}>{icon}</Text>
      </View>
      <View style={styles.textWrap}>
        <Text style={styles.title}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>
      <Text style={[styles.chevron, { color }]}>›</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.sm + 4,
  },
  iconWrap: {
    width: 52,
    height: 52,
    borderRadius: RADIUS.md,
    alignItems: "center",
    justifyContent: "center",
    marginRight: SPACING.md,
  },
  icon: { fontSize: 26 },
  textWrap: { flex: 1 },
  title: { fontSize: FONT.body, fontWeight: "800", color: COLORS.textDark },
  subtitle: { fontSize: FONT.small, color: COLORS.textMuted, marginTop: 2 },
  chevron: { fontSize: 28, fontWeight: "700" },
});
