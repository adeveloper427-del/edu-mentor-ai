import React from "react";
import { View, Text, StyleSheet, Pressable, Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { COLORS, FONT, SPACING } from "../constants/theme";

export default function Header({
  title,
  subtitle,
  onBack,
  right,
  bg = COLORS.bg,
  titleColor = COLORS.textDark,
}) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.wrap, { backgroundColor: bg, paddingTop: insets.top + SPACING.sm }]}>
      <View style={styles.row}>
        {onBack ? (
          <Pressable onPress={onBack} style={styles.backBtn} hitSlop={12}>
            <Text style={styles.backText}>‹</Text>
          </Pressable>
        ) : (
          <View style={styles.backBtn} />
        )}
        <View style={styles.titleWrap}>
          <Text style={[styles.title, { color: titleColor }]} numberOfLines={1}>
            {title}
          </Text>
          {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
        </View>
        <View style={styles.right}>{right}</View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingBottom: SPACING.md,
    paddingHorizontal: SPACING.md,
    ...Platform.select({ android: { elevation: 0 } }),
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  backBtn: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  backText: {
    fontSize: 30,
    color: COLORS.textDark,
    fontWeight: "600",
  },
  titleWrap: {
    flex: 1,
    alignItems: "center",
  },
  title: {
    fontSize: FONT.h3,
    fontWeight: "800",
  },
  subtitle: {
    fontSize: FONT.small,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  right: {
    width: 40,
    alignItems: "flex-end",
  },
});
