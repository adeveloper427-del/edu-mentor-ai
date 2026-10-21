import React from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import { COLORS, RADIUS, FONT, SPACING } from "../constants/theme";

export default function AppTextInput({ label, icon, error, ...inputProps }) {
  return (
    <View style={styles.wrap}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <View style={[styles.inputRow, error && styles.inputRowError]}>
        {icon ? <Text style={styles.icon}>{icon}</Text> : null}
        <TextInput
          style={styles.input}
          placeholderTextColor={COLORS.textMuted}
          autoCapitalize="none"
          {...inputProps}
        />
      </View>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginBottom: SPACING.md },
  label: { fontSize: FONT.small, fontWeight: "700", color: COLORS.textDark, marginBottom: SPACING.xs },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.md,
    borderWidth: 2,
    borderColor: COLORS.border,
    paddingHorizontal: SPACING.md,
  },
  inputRowError: { borderColor: COLORS.danger },
  icon: { fontSize: FONT.h3, marginRight: SPACING.sm },
  input: { flex: 1, fontSize: FONT.body, color: COLORS.textDark, paddingVertical: SPACING.sm + 4 },
  errorText: { fontSize: FONT.tiny, color: COLORS.danger, marginTop: 4, fontWeight: "600" },
});
