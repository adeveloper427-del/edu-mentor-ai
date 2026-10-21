import React from "react";
import { View, StyleSheet } from "react-native";
import { COLORS } from "../constants/theme";

export default function ScreenContainer({ children, bg = COLORS.bg, style }) {
  return <View style={[styles.wrap, { backgroundColor: bg }, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  wrap: { flex: 1 },
});
