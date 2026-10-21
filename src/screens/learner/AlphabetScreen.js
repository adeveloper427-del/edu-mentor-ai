import React, { useState } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../../components/Header";
import AppButton from "../../components/AppButton";
import ProgressBar from "../../components/ProgressBar";
import alphabetData from "../../data/alphabetData";
import { useApp } from "../../context/AppContext";
import { speak } from "../../utils/speech";
import { COLORS, RADIUS, FONT, SPACING, SHADOW } from "../../constants/theme";

export default function AlphabetScreen({ navigation }) {
  const [index, setIndex] = useState(0);
  const { addPoints, unlockBadge, recordLessonViewed } = useApp();
  const current = alphabetData[index];

  const goNext = () => {
    if (index < alphabetData.length - 1) {
      setIndex(index + 1);
    } else {
      addPoints(20);
      unlockBadge("abcMaster");
      recordLessonViewed("Alphabet");
    }
  };
  const goPrev = () => index > 0 && setIndex(index - 1);

  const practice = () => {
    navigation.navigate("Quiz", { categoryId: "alphabet" });
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <Header title="Alphabet" subtitle={`Letter ${index + 1} of 26`} onBack={() => navigation.goBack()} />
      <View style={styles.body}>
        <ProgressBar progress={(index + 1) / alphabetData.length} color={COLORS.secondary} showPercent={false} />

        <View style={[styles.card, SHADOW.card]}>
          <Text style={styles.bigLetter}>{current.letter}</Text>
          <Text style={styles.emoji}>{current.emoji}</Text>
          <Text style={styles.word}>{current.word}</Text>
          <Text style={styles.sentence}>{current.sentence}</Text>

          <Pressable
            style={styles.hearBtn}
            onPress={() => speak(current.sentence)}
          >
            <Text style={styles.hearBtnText}>🔊 Hear Letter</Text>
          </Pressable>
        </View>

        <View style={styles.navRow}>
          <AppButton title="Previous" icon="◀" onPress={goPrev} outline disabled={index === 0} />
          <AppButton title={index === alphabetData.length - 1 ? "Finish" : "Next"} icon="▶" onPress={goNext} />
        </View>

        <AppButton title="Practice with Quiz" icon="📝" color={COLORS.accent} onPress={practice} style={{ marginTop: SPACING.md }} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  body: { flex: 1, padding: SPACING.lg },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.xl,
    alignItems: "center",
    paddingVertical: SPACING.xl,
    marginVertical: SPACING.lg,
  },
  bigLetter: { fontSize: 96, fontWeight: "900", color: COLORS.secondary },
  emoji: { fontSize: 70, marginVertical: SPACING.sm },
  word: { fontSize: FONT.h1 - 4, fontWeight: "800", color: COLORS.textDark },
  sentence: { fontSize: FONT.body, color: COLORS.textMuted, marginTop: SPACING.sm },
  hearBtn: {
    marginTop: SPACING.lg,
    backgroundColor: COLORS.bg,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.lg,
    borderRadius: RADIUS.pill,
  },
  hearBtnText: { fontSize: FONT.body, fontWeight: "700", color: COLORS.textDark },
  navRow: { flexDirection: "row", justifyContent: "space-between" },
});
