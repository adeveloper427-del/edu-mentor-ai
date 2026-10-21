import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, Modal, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../../components/Header";
import AnimalCard from "../../components/AnimalCard";
import AppButton from "../../components/AppButton";
import animalsData from "../../data/animalsData";
import { useApp } from "../../context/AppContext";
import { speak } from "../../utils/speech";
import { COLORS, RADIUS, FONT, SPACING, SHADOW } from "../../constants/theme";

export default function AnimalsScreen({ navigation }) {
  const [selected, setSelected] = useState(null);
  const { unlockBadge } = useApp();

  const openAnimal = (animal) => {
    setSelected(animal);
    unlockBadge("animalExplorer");
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <Header title="Animals" subtitle="Meet your animal friends" onBack={() => navigation.goBack()} />

      <ScrollView contentContainerStyle={styles.grid}>
        {animalsData.map((animal) => (
          <AnimalCard
            key={animal.name}
            emoji={animal.emoji}
            name={animal.name}
            onPress={() => openAnimal(animal)}
          />
        ))}
      </ScrollView>

      <Modal visible={!!selected} transparent animationType="fade" onRequestClose={() => setSelected(null)}>
        <View style={styles.modalBg}>
          {selected && (
            <View style={[styles.modalCard, SHADOW.card]}>
              <Text style={styles.modalEmoji}>{selected.emoji}</Text>
              <Text style={styles.modalName}>{selected.name}</Text>
              <Text style={styles.modalSound}>"{selected.sound}"</Text>
              <Text style={styles.modalFact}>{selected.fact}</Text>

              <View style={styles.modalRow}>
                <AppButton
                  title="Hear Sound"
                  icon="🔊"
                  color={COLORS.purple}
                  onPress={() => speak(`${selected.name} says ${selected.sound}`)}
                />
                <AppButton title="Close" outline color={COLORS.purple} onPress={() => setSelected(null)} />
              </View>
            </View>
          )}
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  grid: { flexDirection: "row", flexWrap: "wrap", padding: SPACING.md },
  modalBg: { flex: 1, backgroundColor: "rgba(0,0,0,0.4)", alignItems: "center", justifyContent: "center", padding: SPACING.lg },
  modalCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.xl,
    padding: SPACING.xl,
    alignItems: "center",
    width: "100%",
  },
  modalEmoji: { fontSize: 72 },
  modalName: { fontSize: FONT.h1 - 6, fontWeight: "900", color: COLORS.textDark, marginTop: SPACING.sm },
  modalSound: { fontSize: FONT.h3, color: COLORS.purple, fontWeight: "700", marginTop: 4 },
  modalFact: { fontSize: FONT.body, color: COLORS.textMuted, textAlign: "center", marginTop: SPACING.md },
  modalRow: { flexDirection: "row", justifyContent: "space-between", width: "100%", marginTop: SPACING.lg },
});
