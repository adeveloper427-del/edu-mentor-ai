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
import { loginAdmin } from "../../services/authService";
import { COLORS, RADIUS, FONT, SPACING, SHADOW } from "../../constants/theme";

export default function AdminLoginScreen({ navigation }) {
  const { setRole, applySession } = useApp();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      setError("Enter your admin email and password.");
      return;
    }

    setError("");
    setLoading(true);

    const result = await loginAdmin({ email, password });

    setLoading(false);

    if (result.error) {
      setError(result.error);
      return;
    }

    // Set the role first so the navigator lands on the admin app rather than
    // briefly showing the parent "Who's Playing" screen.
    setRole("admin");
    applySession(result.session);
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <Header title="Admin Access" bg={COLORS.adminBg} onBack={() => navigation.goBack()} />
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <View style={styles.logoWrap}>
            <Text style={styles.logoEmoji}>🛠️</Text>
          </View>
          <Text style={styles.title}>Restricted Area</Text>
          <Text style={styles.subtitle}>Sign in with your administrator credentials</Text>

          <View style={[styles.card, SHADOW.card]}>
            <AppTextInput
              label="Email"
              icon="📧"
              placeholder="admin@example.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              editable={!loading}
            />
            <AppTextInput
              label="Password"
              icon="🔒"
              placeholder="••••••••"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              editable={!loading}
              onSubmitEditing={handleLogin}
            />

            {error ? <Text style={styles.errorBanner}>{error}</Text> : null}

            {loading ? (
              <View style={styles.loadingRow}>
                <ActivityIndicator color={COLORS.adminPrimary} />
                <Text style={styles.loadingText}>Checking credentials...</Text>
              </View>
            ) : (
              <AppButton
                title="Log In"
                icon="🔓"
                color={COLORS.adminPrimary}
                onPress={handleLogin}
                style={{ marginTop: SPACING.sm }}
              />
            )}
          </View>

          <Text style={styles.demoNote}>
            Only accounts registered as administrators can sign in here 🔐
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.adminBg },
  scroll: { padding: SPACING.lg, paddingBottom: SPACING.xxl, alignItems: "center" },
  logoWrap: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.adminPrimary + "22",
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
  demoNote: { fontSize: FONT.tiny, color: COLORS.textMuted, marginTop: SPACING.md, fontStyle: "italic", textAlign: "center" },
});
