import React from "react";
import { Pressable, Text, View, StyleSheet } from "react-native";
import { COLORS, RADIUS, FONT, SPACING, SHADOW } from "../constants/theme";

export default function AnimalCard({ emoji, name, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        SHADOW.soft,
        { opacity: pressed ? 0.9 : 1 },
      ]}
    >
      <View style={styles.circle}>
        <Text style={styles.emoji}>{emoji}</Text>
      </View>
      <Text style={styles.name}>{name}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    alignItems: "center",
    paddingVertical: SPACING.md,
    margin: SPACING.xs,
    minWidth: 100,
  },
  circle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: COLORS.bg,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: SPACING.sm,
  },
  emoji: { fontSize: 36 },
  name: { fontSize: FONT.body, fontWeight: "700", color: COLORS.textDark },
});
