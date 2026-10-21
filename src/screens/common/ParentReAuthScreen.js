import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../../components/Header";
import AppTextInput from "../../components/AppTextInput";
import AppButton from "../../components/AppButton";
import { useApp } from "../../context/AppContext";
import { verifyParentPassword } from "../../services/authService";
import { COLORS, RADIUS, FONT, SPACING, SHADOW } from "../../constants/theme";

export default function ParentReAuthScreen({ navigation }) {
  const { setRole, parentProfile } = useApp();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleUnlock = async () => {
    if (!password.trim()) {
      setError("Enter your password to unlock the dashboard.");
      return;
    }
    setError("");
    setLoading(true);

    const { ok, error: verifyError } = await verifyParentPassword(
      parentProfile.email,
      password
    );

    setLoading(false);
    if (!ok) {
      setError(verifyError);
      return;
    }
    setRole("parent");
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <Header title="Confirm It's You" bg={COLORS.parentBg} onBack={() => navigation.goBack()} />
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <View style={styles.logoWrap}>
            <Text style={styles.logoEmoji}>🔒</Text>
          </View>
          <Text style={styles.title}>Hi, {parentProfile.name.split(" ")[0]}!</Text>
          <Text style={styles.subtitle}>Enter your password to open the Parent Dashboard</Text>

          <View style={[styles.card, SHADOW.card]}>
            <AppTextInput
              label="Password"
              icon="🔒"
              placeholder="••••••••"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              editable={!loading}
              onSubmitEditing={handleUnlock}
            />
            {error ? <Text style={styles.errorBanner}>{error}</Text> : null}

            {loading ? (
              <View style={styles.loadingRow}>
                <ActivityIndicator color={COLORS.parentPrimary} />
                <Text style={styles.loadingText}>Checking...</Text>
              </View>
            ) : (
              <AppButton
                title="Unlock Dashboard"
                icon="🔓"
                color={COLORS.parentPrimary}
                onPress={handleUnlock}
                style={{ marginTop: SPACING.sm }}
              />
            )}
          </View>

          <Text style={styles.demoNote}>This keeps the dashboard away from little hands 🔐</Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.parentBg },
  scroll: { padding: SPACING.lg, paddingBottom: SPACING.xxl, alignItems: "center" },
  logoWrap: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.parentPrimary + "22",
    alignItems: "center",
    justifyContent: "center",
    marginTop: SPACING.md,
  },
  logoEmoji: { fontSize: 40 },
  title: { fontSize: FONT.h2, fontWeight: "900", color: COLORS.textDark, marginTop: SPACING.md },
  subtitle: { fontSize: FONT.small, color: COLORS.textMuted, marginTop: 4, marginBottom: SPACING.lg, textAlign: "center" },
  card: { width: "100%", backgroundColor: COLORS.white, borderRadius: RADIUS.lg, padding: SPACING.lg },
  errorBanner: { color: COLORS.danger, fontSize: FONT.small, fontWeight: "700", marginBottom: SPACING.sm, textAlign: "center" },
  loadingRow: { flexDirection: "row", alignItems: "center", justifyContent: "center", marginTop: SPACING.md },
  loadingText: { marginLeft: SPACING.sm, color: COLORS.textMuted, fontWeight: "700", fontSize: FONT.small },
  demoNote: { fontSize: FONT.tiny, color: COLORS.textMuted, marginTop: SPACING.md, fontStyle: "italic" },
});
