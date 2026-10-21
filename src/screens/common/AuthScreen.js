import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../../components/Header";
import AppTextInput from "../../components/AppTextInput";
import AppButton from "../../components/AppButton";
import { useApp } from "../../context/AppContext";
import { registerParent, loginParent } from "../../services/authService";
import { COLORS, RADIUS, FONT, SPACING, SHADOW } from "../../constants/theme";

const AVATAR_OPTIONS = ["🦄", "🐯", "🐰", "🐶", "🦁", "🐼"];

export default function AuthScreen({ navigation }) {
  const { setChildProfile, applySession } = useApp();
  const [mode, setMode] = useState("login");

  const [parentName, setParentName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [childName, setChildName] = useState("");
  const [childAge, setChildAge] = useState("");
  const [avatar, setAvatar] = useState(AVATAR_OPTIONS[0]);

  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [loading, setLoading] = useState(false);

  const isLogin = mode === "login";

  const validate = () => {
    if (!email.trim() || !password.trim()) return "Please fill in all fields to continue.";
    if (isLogin) return null;

    if (!parentName.trim()) return "Please enter your name.";
    if (password.length < 6) return "Password must be at least 6 characters.";
    if (password !== confirmPassword) return "Passwords do not match.";
    if (!childName.trim()) return "Please enter your child's name.";

    const age = Number(childAge);
    if (!childAge.trim() || Number.isNaN(age) || age < 2 || age > 12) {
      return "Please enter a child's age between 2 and 12.";
    }
    return null;
  };

  const handleSubmit = async () => {
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setError("");
    setNotice("");
    setLoading(true);

    const result = isLogin
      ? await loginParent({ email, password })
      : await registerParent({
          parentName,
          email,
          password,
          child: { name: childName, age: Number(childAge), avatar },
        });

    setLoading(false);

    if (result.error) {
      setError(result.error);
      return;
    }

    if (result.needsEmailConfirmation) {
      setNotice("Check your email to confirm your account, then log in.");
      setMode("login");
      return;
    }

    if (!isLogin && result.child) {
      setChildProfile(result.child);
    } else if (!isLogin) {
      setChildProfile({ name: childName.trim(), age: Number(childAge), avatar });
    }

    if (result.session) {
      // Drive navigation from the session we were just handed rather than
      // waiting on the auth listener, which can miss or lag behind this.
      applySession(result.session);
    } else {
      setError("Logged in, but the session didn't load. Please try again.");
    }
  };

  const switchMode = () => {
    setError("");
    setNotice("");
    setMode(isLogin ? "register" : "login");
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <Header title={isLogin ? "Log In" : "Create Account"} onBack={() => navigation.goBack()} />
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <View style={styles.logoWrap}>
            <Text style={styles.logoEmoji}>🤖</Text>
          </View>
          <Text style={styles.title}>{isLogin ? "Welcome Back!" : "Let's Set Up Your Family"}</Text>
          <Text style={styles.subtitle}>
            {isLogin ? "Log in to continue the learning adventure" : "One account for you and your child"}
          </Text>

          <View style={[styles.card, SHADOW.card]}>
            {!isLogin && (
              <AppTextInput
                label="Your Name"
                icon="🧑"
                placeholder="Sarah Johnson"
                value={parentName}
                onChangeText={setParentName}
                editable={!loading}
              />
            )}
            <AppTextInput
              label="Email"
              icon="📧"
              placeholder="you@example.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              editable={!loading}
            />
            <AppTextInput
              label="Password"
              icon="🔒"
              placeholder="At least 6 characters"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              editable={!loading}
            />

            {!isLogin && (
              <>
                <AppTextInput
                  label="Confirm Password"
                  icon="🔑"
                  placeholder="Type your password again"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry
                  editable={!loading}
                  error={
                    confirmPassword && password !== confirmPassword
                      ? "Passwords do not match"
                      : undefined
                  }
                />

                <View style={styles.divider} />
                <Text style={styles.sectionLabel}>Your Child's Details</Text>

                <AppTextInput
                  label="Child's Name"
                  icon="🧒"
                  placeholder="Emma"
                  value={childName}
                  onChangeText={setChildName}
                  editable={!loading}
                />
                <AppTextInput
                  label="Child's Age"
                  icon="🎂"
                  placeholder="5"
                  value={childAge}
                  onChangeText={setChildAge}
                  keyboardType="number-pad"
                  editable={!loading}
                />

                <Text style={styles.label}>Pick an Avatar</Text>
                <View style={styles.avatarRow}>
                  {AVATAR_OPTIONS.map((a) => (
                    <Pressable
                      key={a}
                      onPress={() => setAvatar(a)}
                      style={[styles.avatarCircle, avatar === a && styles.avatarCircleActive]}
                    >
                      <Text style={styles.avatarEmoji}>{a}</Text>
                    </Pressable>
                  ))}
                </View>
              </>
            )}

            {error ? <Text style={styles.errorBanner}>{error}</Text> : null}
            {notice ? <Text style={styles.noticeBanner}>{notice}</Text> : null}

            {loading ? (
              <View style={styles.loadingRow}>
                <ActivityIndicator color={COLORS.primary} />
                <Text style={styles.loadingText}>
                  {isLogin ? "Logging in..." : "Creating your account..."}
                </Text>
              </View>
            ) : (
              <AppButton
                title={isLogin ? "Log In" : "Create Account"}
                icon={isLogin ? "🔓" : "✨"}
                onPress={handleSubmit}
                style={{ marginTop: SPACING.sm }}
              />
            )}
          </View>

          <Pressable onPress={switchMode} disabled={loading} style={styles.switchRow}>
            <Text style={styles.switchText}>
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <Text style={styles.switchLink}>{isLogin ? "Register" : "Log In"}</Text>
            </Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  scroll: { padding: SPACING.lg, paddingBottom: SPACING.xxl, alignItems: "center" },
  logoWrap: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.primary + "22",
    alignItems: "center",
    justifyContent: "center",
    marginTop: SPACING.md,
  },
  logoEmoji: { fontSize: 40 },
  title: { fontSize: FONT.h2, fontWeight: "900", color: COLORS.textDark, marginTop: SPACING.md, textAlign: "center" },
  subtitle: { fontSize: FONT.small, color: COLORS.textMuted, marginTop: 4, marginBottom: SPACING.lg, textAlign: "center" },
  card: { width: "100%", backgroundColor: COLORS.white, borderRadius: RADIUS.lg, padding: SPACING.lg },
  divider: { height: 1, backgroundColor: COLORS.border, marginVertical: SPACING.md },
  sectionLabel: { fontSize: FONT.small, fontWeight: "800", color: COLORS.primary, marginBottom: SPACING.sm },
  label: { fontSize: FONT.small, fontWeight: "700", color: COLORS.textDark, marginBottom: SPACING.sm },
  avatarRow: { flexDirection: "row", flexWrap: "wrap", marginBottom: SPACING.sm },
  avatarCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: COLORS.bg,
    alignItems: "center",
    justifyContent: "center",
    marginRight: SPACING.sm,
    marginBottom: SPACING.sm,
    borderWidth: 2,
    borderColor: "transparent",
  },
  avatarCircleActive: { borderColor: COLORS.primary, backgroundColor: COLORS.primary + "22" },
  avatarEmoji: { fontSize: 26 },
  errorBanner: { color: COLORS.danger, fontSize: FONT.small, fontWeight: "700", marginBottom: SPACING.sm, textAlign: "center" },
  noticeBanner: { color: COLORS.accent, fontSize: FONT.small, fontWeight: "700", marginBottom: SPACING.sm, textAlign: "center" },
  loadingRow: { flexDirection: "row", alignItems: "center", justifyContent: "center", marginTop: SPACING.md },
  loadingText: { marginLeft: SPACING.sm, color: COLORS.textMuted, fontWeight: "700", fontSize: FONT.small },
  switchRow: { marginTop: SPACING.lg },
  switchText: { fontSize: FONT.small, color: COLORS.textMuted },
  switchLink: { color: COLORS.primary, fontWeight: "800" },
});
