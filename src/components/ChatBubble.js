import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { COLORS, RADIUS, FONT, SPACING } from "../constants/theme";

export default function ChatBubble({ text, sender = "mentor", onSpeak }) {
  const isMentor = sender === "mentor";
  return (
    <View style={[styles.row, isMentor ? styles.rowLeft : styles.rowRight]}>
      {isMentor && (
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>🤖</Text>
        </View>
      )}
      <View
        style={[
          styles.bubble,
          isMentor ? styles.mentorBubble : styles.childBubble,
        ]}
      >
        <Text style={[styles.text, isMentor ? styles.mentorText : styles.childText]}>
          {text}
        </Text>

        {isMentor && onSpeak ? (
          <Pressable onPress={onSpeak} style={styles.speakBtn} hitSlop={8}>
            <Text style={styles.speakIcon}>🔊</Text>
            <Text style={styles.speakLabel}>Hear it again</Text>
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginVertical: SPACING.xs,
  },
  rowLeft: { justifyContent: "flex-start" },
  rowRight: { justifyContent: "flex-end" },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
    marginRight: SPACING.xs,
  },
  avatarText: { fontSize: 16 },
  bubble: {
    maxWidth: "75%",
    paddingVertical: SPACING.sm + 2,
    paddingHorizontal: SPACING.md,
    borderRadius: RADIUS.lg,
  },
  mentorBubble: {
    backgroundColor: COLORS.white,
    borderBottomLeftRadius: 4,
  },
  childBubble: {
    backgroundColor: COLORS.primary,
    borderBottomRightRadius: 4,
  },
  text: { fontSize: FONT.body, lineHeight: 21 },
  mentorText: { color: COLORS.textDark },
  childText: { color: COLORS.white, fontWeight: "600" },
  speakBtn: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    marginTop: SPACING.sm,
    backgroundColor: COLORS.bg,
    borderRadius: RADIUS.pill,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  speakIcon: { fontSize: 14, marginRight: 5 },
  speakLabel: { fontSize: FONT.tiny, fontWeight: "700", color: COLORS.primary },
});
