import React from "react";
import { Pressable, Text, StyleSheet } from "react-native";
import { COLORS, RADIUS, FONT, SPACING, SHADOW } from "../constants/theme";

export default function AppButton({
  title,
  onPress,
  color = COLORS.primary,
  textColor = COLORS.white,
  icon,
  size = "md",
  outline = false,
  disabled = false,
  style,
}) {
  const isLg = size === "lg";
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.base,
        isLg && styles.lg,
        {
          backgroundColor: outline ? "transparent" : color,
          borderColor: color,
          borderWidth: outline ? 2 : 0,
          opacity: disabled ? 0.5 : pressed ? 0.85 : 1,
          transform: [{ scale: pressed ? 0.97 : 1 }],
        },
        !outline && SHADOW.soft,
        style,
      ]}
    >
      {icon ? <Text style={styles.icon}>{icon}</Text> : null}
      <Text
        style={[
          styles.text,
          isLg && styles.textLg,
          { color: outline ? color : textColor },
        ]}
      >
        {title}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: SPACING.sm + 4,
    paddingHorizontal: SPACING.lg,
    borderRadius: RADIUS.pill,
  },
  lg: {
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xl,
  },
  text: {
    fontSize: FONT.body,
    fontWeight: "700",
  },
  textLg: {
    fontSize: FONT.h3,
  },
  icon: {
    fontSize: FONT.h3,
    marginRight: SPACING.sm,
  },
});
