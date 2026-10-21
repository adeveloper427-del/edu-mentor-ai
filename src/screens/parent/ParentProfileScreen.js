import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AppButton from "../../components/AppButton";
import { useApp } from "../../context/AppContext";
import { COLORS, RADIUS, FONT, SPACING, SHADOW } from "../../constants/theme";

export default function ParentProfileScreen() {
  const { setRole, signOut, parentProfile, childProfile } = useApp();

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={[styles.card, SHADOW.card]}>
          <View style={styles.avatarWrap}>
            <Text style={styles.avatar}>👩</Text>
          </View>
          <Text style={styles.name}>{parentProfile.name}</Text>
          <Text style={styles.meta}>Parent Account</Text>
        </View>

        <View style={[styles.infoCard, SHADOW.soft]}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Linked Child</Text>
            <Text style={styles.infoValue}>{childProfile.name} (Age {childProfile.age})</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Email</Text>
            <Text style={styles.infoValue}>{parentProfile.email}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Notifications</Text>
            <Text style={styles.infoValue}>Enabled</Text>
          </View>
        </View>

        <AppButton
          title="Switch Profile"
          icon="🔄"
          outline
          color={COLORS.parentPrimary}
          onPress={() => setRole(null)}
          style={{ marginTop: SPACING.xl }}
        />
        <AppButton
          title="Log Out"
          icon="🚪"
          color={COLORS.danger}
          onPress={signOut}
          style={{ marginTop: SPACING.sm }}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.parentBg },
  scroll: { padding: SPACING.lg, paddingBottom: SPACING.xxl },
  card: {
    backgroundColor: COLORS.parentPrimary,
    borderRadius: RADIUS.xl,
    alignItems: "center",
    paddingVertical: SPACING.xl,
    marginBottom: SPACING.lg,
  },
  avatarWrap: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "rgba(255,255,255,0.25)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: SPACING.sm,
  },
  avatar: { fontSize: 48 },
  name: { fontSize: FONT.h1 - 6, fontWeight: "900", color: COLORS.white },
  meta: { fontSize: FONT.small, color: "rgba(255,255,255,0.9)", marginTop: 4 },
  infoCard: { backgroundColor: COLORS.parentCard, borderRadius: RADIUS.lg, padding: SPACING.lg },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  infoLabel: { fontSize: FONT.small, color: COLORS.textMuted },
  infoValue: { fontSize: FONT.small, fontWeight: "700", color: COLORS.textDark },
});
