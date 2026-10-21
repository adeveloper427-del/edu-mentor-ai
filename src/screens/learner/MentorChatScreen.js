import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ChatBubble from "../../components/ChatBubble";
import { initialMessages, pictureQuestions } from "../../data/mentorData";
import { askMentor } from "../../services/mentorService";
import { speak, stopSpeaking } from "../../utils/speech";
import { useApp } from "../../context/AppContext";
import { COLORS, RADIUS, FONT, SPACING, SHADOW } from "../../constants/theme";

let idCounter = 1;

export default function MentorChatScreen() {
  const { soundEnabled, toggleSound } = useApp();
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [offline, setOffline] = useState(false);
  const listRef = useRef(null);

  // The mentor greets out loud, since a kindergartener may not be able to read it.
  // speak() is a no-op when sound is muted.
  useEffect(() => {
    speak(initialMessages[0].text);
    // Stop mid-sentence if the child leaves the chat.
    return stopSpeaking;
  }, []);

  const scrollToEnd = () =>
    setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 100);

  const sendMessage = async (text) => {
    const trimmed = text.trim();
    if (!trimmed || typing) return;

    const userMsg = { id: `u${idCounter++}`, sender: "child", text: trimmed };
    const history = [...messages, userMsg];

    setMessages(history);
    setInput("");
    setTyping(true);
    scrollToEnd();

    const { reply, offline: usedFallback } = await askMentor(trimmed, messages);

    setMessages((prev) => [...prev, { id: `m${idCounter++}`, sender: "mentor", text: reply }]);
    setOffline(usedFallback);
    setTyping(false);
    speak(reply); // Always read the answer aloud.
    scrollToEnd();
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <Text style={styles.headerEmoji}>🤖</Text>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>Ask Mentor</Text>
          <Text style={styles.headerSubtitle}>
            {typing
              ? "thinking..."
              : offline
              ? "Offline mode 🌙"
              : soundEnabled
              ? "Always here to help!"
              : "Voice is off 🔇"}
          </Text>
        </View>

        <Pressable
          onPress={toggleSound}
          hitSlop={10}
          accessibilityLabel={soundEnabled ? "Turn voice off" : "Turn voice on"}
          style={({ pressed }) => [
            styles.muteBtn,
            { backgroundColor: soundEnabled ? COLORS.primary + "22" : COLORS.border, opacity: pressed ? 0.7 : 1 },
          ]}
        >
          <Text style={styles.muteIcon}>{soundEnabled ? "🔊" : "🔇"}</Text>
        </Pressable>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={90}
      >
        <FlatList
          ref={listRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ChatBubble
              text={item.text}
              sender={item.sender}
              onSpeak={
                item.sender === "mentor" && soundEnabled ? () => speak(item.text) : undefined
              }
            />
          )}
          contentContainerStyle={styles.list}
          onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: true })}
        />

        {typing && (
          <View style={styles.typingRow}>
            <Text style={styles.typingText}>🤖 Mentor is thinking...</Text>
          </View>
        )}

        <FlatList
          horizontal
          data={pictureQuestions}
          keyExtractor={(item) => item.label}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.suggestionsRow}
          renderItem={({ item }) => (
            <Pressable
              style={[styles.pictureBtn, SHADOW.soft]}
              onPress={() => sendMessage(item.question)}
            >
              <Text style={styles.pictureIcon}>{item.icon}</Text>
              <Text style={styles.pictureLabel}>{item.label}</Text>
            </Pressable>
          )}
        />

        <View style={[styles.inputRow, SHADOW.soft]}>
          <TextInput
            style={styles.input}
            placeholder="Ask me anything..."
            placeholderTextColor={COLORS.textMuted}
            value={input}
            onChangeText={setInput}
            onSubmitEditing={() => sendMessage(input)}
            returnKeyType="send"
          />
          <Pressable style={styles.sendBtn} onPress={() => sendMessage(input)}>
            <Text style={styles.sendBtnText}>➤</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.md,
  },
  headerEmoji: { fontSize: 40, marginRight: SPACING.sm },
  muteBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  muteIcon: { fontSize: 20 },
  headerTitle: { fontSize: FONT.h2, fontWeight: "900", color: COLORS.textDark },
  headerSubtitle: { fontSize: FONT.small, color: COLORS.textMuted },
  list: { padding: SPACING.lg, paddingBottom: SPACING.sm },
  typingRow: { paddingHorizontal: SPACING.lg, paddingBottom: SPACING.xs },
  typingText: { fontSize: FONT.small, color: COLORS.textMuted, fontStyle: "italic" },
  suggestionsRow: { paddingHorizontal: SPACING.lg, paddingBottom: SPACING.sm },
  pictureBtn: {
    width: 78,
    height: 78,
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    alignItems: "center",
    justifyContent: "center",
    marginRight: SPACING.sm,
    borderWidth: 2,
    borderColor: COLORS.primary + "33",
  },
  pictureIcon: { fontSize: 30 },
  pictureLabel: { fontSize: FONT.tiny, fontWeight: "800", color: COLORS.primary, marginTop: 2 },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.white,
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.md,
    borderRadius: RADIUS.pill,
    paddingLeft: SPACING.lg,
    paddingRight: SPACING.xs,
  },
  input: { flex: 1, fontSize: FONT.body, color: COLORS.textDark, paddingVertical: SPACING.sm + 4 },
  sendBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  sendBtnText: { color: COLORS.white, fontSize: FONT.h3, fontWeight: "900" },
});
