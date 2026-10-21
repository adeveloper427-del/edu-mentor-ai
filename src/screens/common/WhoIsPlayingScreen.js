import React from "react";
import { View, Text, StyleSheet, Pressable, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useApp } from "../../context/AppContext";
import { COLORS, RADIUS, FONT, SPACING, SHADOW } from "../../constants/theme";

export default function WhoIsPlayingScreen({ navigation }) {
  const { setRole, childProfile, parentProfile } = useApp();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>Who's Playing?</Text>
        <Text style={styles.subtitle}>Tap your picture to continue</Text>

        <Pressable
          onPress={() => setRole("learner")}
          style={({ pressed }) => [
            styles.card,
            SHADOW.card,
            { borderColor: COLORS.primary, opacity: pressed ? 0.9 : 1, transform: [{ scale: pressed ? 0.98 : 1 }] },
          ]}
        >
          <View style={[styles.emojiCircle, { backgroundColor: COLORS.primary + "22" }]}>
            <Text style={styles.emoji}>{childProfile.avatar}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.cardTitle}>I'm {childProfile.name}!</Text>
            <Text style={styles.cardSubtitle}>Let's play and learn together</Text>
          </View>
          <Text style={[styles.chevron, { color: COLORS.primary }]}>›</Text>
        </Pressable>

        <Pressable
          onPress={() => navigation.navigate("ParentReAuth")}
          style={({ pressed }) => [
            styles.card,
            SHADOW.card,
            { borderColor: COLORS.parentPrimary, opacity: pressed ? 0.9 : 1, transform: [{ scale: pressed ? 0.98 : 1 }] },
          ]}
        >
          <View style={[styles.emojiCircle, { backgroundColor: COLORS.parentPrimary + "22" }]}>
            <Text style={styles.emoji}>👩‍🏫</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.cardTitle}>I'm the Parent</Text>
            <Text style={styles.cardSubtitle}>View {childProfile.name}'s progress</Text>
          </View>
          <Text style={[styles.chevron, { color: COLORS.parentPrimary }]}>›</Text>
        </Pressable>

        <Text style={styles.footerNote}>Signed in as {parentProfile.email}</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  scroll: { padding: SPACING.lg, paddingTop: SPACING.xxl, flexGrow: 1, justifyContent: "center" },
  title: { fontSize: FONT.h1, fontWeight: "900", color: COLORS.textDark, textAlign: "center" },
  subtitle: { fontSize: FONT.body, color: COLORS.textMuted, textAlign: "center", marginTop: SPACING.xs, marginBottom: SPACING.xl },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    borderWidth: 2,
  },
  emojiCircle: {
    width: 60,
    height: 60,
    borderRadius: RADIUS.pill,
    alignItems: "center",
    justifyContent: "center",
    marginRight: SPACING.md,
  },
  emoji: { fontSize: 30 },
  cardTitle: { fontSize: FONT.h3, fontWeight: "800", color: COLORS.textDark },
  cardSubtitle: { fontSize: FONT.small, color: COLORS.textMuted, marginTop: 2 },
  chevron: { fontSize: 32, fontWeight: "700" },
  footerNote: { textAlign: "center", fontSize: FONT.tiny, color: COLORS.textMuted, marginTop: SPACING.lg },
});
