import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../../components/Header";
import colorsData from "../../data/colorsData";
import { speak } from "../../utils/speech";
import { COLORS, RADIUS, FONT, SPACING, SHADOW } from "../../constants/theme";

export default function ColorsScreen({ navigation }) {
  const [selected, setSelected] = useState(colorsData[0]);

  const handleSelect = (color) => {
    setSelected(color);
    speak(`${color.name}. ${color.object}`);
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <Header title="Colors" subtitle="Tap a color to explore" onBack={() => navigation.goBack()} />

      <View style={[styles.preview, { backgroundColor: selected.hex }, SHADOW.card]}>
        <Text style={styles.previewEmoji}>{selected.emoji}</Text>
        <Text style={[styles.previewText, selected.name === "White" && { color: COLORS.textDark }]}>
          {selected.name}
        </Text>
        <Text style={[styles.previewObject, selected.name === "White" && { color: COLORS.textMuted }]}>
          {selected.object}
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.grid}>
        {colorsData.map((color) => (
          <Pressable
            key={color.name}
            onPress={() => handleSelect(color)}
            style={[
              styles.swatch,
              { backgroundColor: color.hex },
              selected.name === color.name && styles.swatchActive,
            ]}
          >
            <Text style={[styles.swatchLabel, color.name === "White" && { color: COLORS.textDark }]}>
              {color.name}
            </Text>
          </Pressable>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  preview: {
    margin: SPACING.lg,
    borderRadius: RADIUS.xl,
    alignItems: "center",
    paddingVertical: SPACING.xl,
  },
  previewEmoji: { fontSize: 60 },
  previewText: { fontSize: FONT.h1 - 6, fontWeight: "900", color: COLORS.white, marginTop: SPACING.sm },
  previewObject: { fontSize: FONT.body, color: "rgba(255,255,255,0.9)", marginTop: 4 },
  grid: { flexDirection: "row", flexWrap: "wrap", paddingHorizontal: SPACING.lg, justifyContent: "space-between" },
  swatch: {
    width: "31%",
    aspectRatio: 1,
    borderRadius: RADIUS.md,
    alignItems: "center",
    justifyContent: "flex-end",
    padding: SPACING.sm,
    marginBottom: SPACING.md,
    borderWidth: 3,
    borderColor: "transparent",
  },
  swatchActive: { borderColor: COLORS.textDark },
  swatchLabel: { color: COLORS.white, fontWeight: "800", fontSize: FONT.small },
});
