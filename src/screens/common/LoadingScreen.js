import React from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { COLORS, FONT, SPACING } from "../../constants/theme";

export default function LoadingScreen() {
  return (
    <LinearGradient colors={[COLORS.primary, "#8B7CFF", COLORS.pink]} style={styles.container}>
      <View style={styles.inner}>
        <Text style={styles.emoji}>🤖</Text>
        <Text style={styles.title}>Edu Mentor AI</Text>
        <ActivityIndicator color={COLORS.white} style={{ marginTop: SPACING.lg }} />
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  inner: { flex: 1, alignItems: "center", justifyContent: "center" },
  emoji: { fontSize: 80, marginBottom: SPACING.md },
  title: { fontSize: FONT.h1, fontWeight: "900", color: COLORS.white },
});
