import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../../components/Header";
import ShapeVisual from "../../components/ShapeVisual";
import shapesData from "../../data/shapesData";
import { speak } from "../../utils/speech";
import { COLORS, RADIUS, FONT, SPACING, SHADOW } from "../../constants/theme";

export default function ShapesScreen({ navigation }) {
  const [selected, setSelected] = useState(shapesData[0]);

  const handleSelect = (shape) => {
    setSelected(shape);
    speak(`${shape.name}. Examples: ${shape.example}`);
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <Header title="Shapes" subtitle="Tap a shape to explore" onBack={() => navigation.goBack()} />

      <View style={[styles.preview, SHADOW.card]}>
        <View style={styles.shapeWrap}>
          <ShapeVisual type={selected.type} color={selected.color} />
        </View>
        <Text style={styles.previewName}>{selected.name}</Text>
        <Text style={styles.previewMeta}>Sides: {selected.sides}</Text>
        <Text style={styles.previewExample}>Examples: {selected.example}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.grid}>
        {shapesData.map((shape) => (
          <Pressable
            key={shape.name}
            onPress={() => handleSelect(shape)}
            style={[
              styles.card,
              SHADOW.soft,
              selected.name === shape.name && { borderColor: shape.color, borderWidth: 2 },
            ]}
          >
            <ShapeVisual type={shape.type} color={shape.color} size={44} />
            <Text style={styles.cardLabel}>{shape.name}</Text>
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
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.xl,
    alignItems: "center",
    paddingVertical: SPACING.xl,
  },
  shapeWrap: { height: 120, alignItems: "center", justifyContent: "center" },
  previewName: { fontSize: FONT.h2, fontWeight: "900", color: COLORS.textDark, marginTop: SPACING.md },
  previewMeta: { fontSize: FONT.body, color: COLORS.textMuted, marginTop: 4 },
  previewExample: { fontSize: FONT.small, color: COLORS.textMuted, marginTop: 4, textAlign: "center", paddingHorizontal: SPACING.lg },
  grid: { flexDirection: "row", flexWrap: "wrap", paddingHorizontal: SPACING.lg, justifyContent: "space-between" },
  card: {
    width: "31%",
    aspectRatio: 1,
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.md,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: SPACING.md,
    borderWidth: 2,
    borderColor: "transparent",
  },
  cardLabel: { fontSize: FONT.small, fontWeight: "700", color: COLORS.textDark, marginTop: SPACING.sm },
});
