import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet, Animated } from "react-native";
import { COLORS, RADIUS, FONT, SPACING } from "../constants/theme";

export default function ProgressBar({
  progress = 0,
  color = COLORS.primary,
  trackColor = COLORS.border,
  label,
  showPercent = true,
  height = 14,
}) {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(anim, {
      toValue: Math.max(0, Math.min(1, progress)),
      duration: 700,
      useNativeDriver: false,
    }).start();
  }, [progress]);

  const width = anim.interpolate({ inputRange: [0, 1], outputRange: ["0%", "100%"] });

  return (
    <View style={styles.wrap}>
      {(label || showPercent) && (
        <View style={styles.labelRow}>
          {label ? <Text style={styles.label}>{label}</Text> : <View />}
          {showPercent ? (
            <Text style={styles.percent}>{Math.round(progress * 100)}%</Text>
          ) : null}
        </View>
      )}
      <View style={[styles.track, { backgroundColor: trackColor, height }]}>
        <Animated.View
          style={[styles.fill, { backgroundColor: color, width, height }]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { width: "100%", marginVertical: SPACING.xs },
  labelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: SPACING.xs,
  },
  label: { fontSize: FONT.small, color: COLORS.textDark, fontWeight: "700" },
  percent: { fontSize: FONT.small, color: COLORS.textMuted, fontWeight: "700" },
  track: {
    width: "100%",
    borderRadius: RADIUS.pill,
    overflow: "hidden",
  },
  fill: {
    borderRadius: RADIUS.pill,
  },
});
