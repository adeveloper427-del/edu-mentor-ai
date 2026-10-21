import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet, Animated, Dimensions, PanResponder } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import AppButton from "../../components/AppButton";
import { COLORS, FONT, SPACING, RADIUS } from "../../constants/theme";

const { width, height } = Dimensions.get("window");

const FLOATERS = [
  { emoji: "⭐", top: height * 0.08, left: width * 0.1, delay: 0, size: 26 },
  { emoji: "☁️", top: height * 0.14, left: width * 0.72, delay: 300, size: 34 },
  { emoji: "🎈", top: height * 0.62, left: width * 0.08, delay: 600, size: 30 },
  { emoji: "🌈", top: height * 0.58, left: width * 0.74, delay: 200, size: 32 },
  { emoji: "✨", top: height * 0.24, left: width * 0.42, delay: 450, size: 22 },
  { emoji: "🎨", top: height * 0.7, left: width * 0.4, delay: 150, size: 26 },
];

const SWIPE_THRESHOLD = 40;
const SECRET_SEQUENCE = "left,right,left";

function Floater({ emoji, top, left, delay, size }) {
  const bob = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const anim = Animated.loop(
      Animated.sequence([
        Animated.timing(bob, { toValue: 1, duration: 1800, delay, useNativeDriver: true }),
        Animated.timing(bob, { toValue: 0, duration: 1800, useNativeDriver: true }),
      ])
    );
    anim.start();
    return () => anim.stop();
  }, []);

  const translateY = bob.interpolate({ inputRange: [0, 1], outputRange: [0, -16] });

  return (
    <Animated.Text
      style={[
        styles.floater,
        { top, left, fontSize: size, transform: [{ translateY }] },
      ]}
    >
      {emoji}
    </Animated.Text>
  );
}

export default function WelcomeScreen({ navigation }) {
  const bounce = useRef(new Animated.Value(0)).current;
  const fade = useRef(new Animated.Value(0)).current;
  const badgeAnims = useRef(["🔤", "🔢", "🎨", "🔷", "🐶"].map(() => new Animated.Value(0))).current;
  const swipeHistory = useRef([]);
  const wiggle = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fade, { toValue: 1, duration: 700, useNativeDriver: true }).start();
    Animated.loop(
      Animated.sequence([
        Animated.timing(bounce, { toValue: -16, duration: 850, useNativeDriver: true }),
        Animated.timing(bounce, { toValue: 0, duration: 850, useNativeDriver: true }),
      ])
    ).start();
    Animated.stagger(
      120,
      badgeAnims.map((v) =>
        Animated.spring(v, { toValue: 1, useNativeDriver: true, friction: 5 })
      )
    ).start();
  }, []);

  const playWiggle = () => {
    wiggle.setValue(0);
    Animated.sequence([
      Animated.timing(wiggle, { toValue: 1, duration: 90, useNativeDriver: true }),
      Animated.timing(wiggle, { toValue: -1, duration: 90, useNativeDriver: true }),
      Animated.timing(wiggle, { toValue: 0, duration: 90, useNativeDriver: true }),
    ]).start();
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gesture) => Math.abs(gesture.dx) > 10,
      onPanResponderRelease: (_, gesture) => {
        if (Math.abs(gesture.dx) < SWIPE_THRESHOLD || Math.abs(gesture.dy) > 60) return;
        const direction = gesture.dx < 0 ? "left" : "right";
        const history = [...swipeHistory.current, direction].slice(-3);
        swipeHistory.current = history;
        playWiggle();
        if (history.join(",") === SECRET_SEQUENCE) {
          swipeHistory.current = [];
          navigation.navigate("AdminLogin");
        }
      },
    })
  ).current;

  const wiggleRotate = wiggle.interpolate({ inputRange: [-1, 0, 1], outputRange: ["-8deg", "0deg", "8deg"] });

  return (
    <LinearGradient colors={[COLORS.primary, "#8B7CFF", COLORS.pink]} style={styles.container}>
      <SafeAreaView style={styles.safe}>
        {FLOATERS.map((f, i) => (
          <Floater key={i} {...f} />
        ))}

        <Animated.View style={{ opacity: fade, alignItems: "center", flex: 1, justifyContent: "center" }}>
          <Animated.View
            {...panResponder.panHandlers}
            style={[
              styles.mascotWrap,
              { transform: [{ translateY: bounce }, { rotate: wiggleRotate }] },
            ]}
          >
            <Text style={styles.mascot}>🤖</Text>
          </Animated.View>

          <Text style={styles.title}>Edu Mentor AI</Text>
          <Text style={styles.subtitle}>Your Fun Learning Buddy!{"\n"}for Kindergarten Friends</Text>

          <View style={styles.badgeRow}>
            {["🔤", "🔢", "🎨", "🔷", "🐶"].map((e, i) => {
              const scale = badgeAnims[i];
              return (
                <Animated.View
                  key={i}
                  style={[
                    styles.badgeCircle,
                    { transform: [{ scale }] },
                  ]}
                >
                  <Text style={styles.badgeEmoji}>{e}</Text>
                </Animated.View>
              );
            })}
          </View>
        </Animated.View>

        <View style={styles.footer}>
          <AppButton
            title="Let's Play & Learn!"
            size="lg"
            icon="🚀"
            color={COLORS.yellow}
            textColor={COLORS.textDark}
            onPress={() => navigation.navigate("Auth")}
            style={{ width: "100%" }}
          />
          <Text style={styles.footerNote}>Learning made fun, one letter at a time ✨</Text>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safe: { flex: 1, alignItems: "center", paddingHorizontal: SPACING.xl },
  floater: { position: "absolute" },
  mascotWrap: {
    width: 170,
    height: 170,
    borderRadius: 85,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: SPACING.lg,
  },
  mascot: { fontSize: 96 },
  title: {
    fontSize: FONT.h1 + 10,
    fontWeight: "900",
    color: COLORS.white,
    textAlign: "center",
    textShadowColor: "rgba(0,0,0,0.15)",
    textShadowOffset: { width: 0, height: 3 },
    textShadowRadius: 6,
  },
  subtitle: {
    fontSize: FONT.body + 1,
    fontWeight: "600",
    color: "rgba(255,255,255,0.95)",
    textAlign: "center",
    marginTop: SPACING.sm,
    lineHeight: 24,
  },
  badgeRow: { flexDirection: "row", marginTop: SPACING.xl },
  badgeCircle: {
    width: 52,
    height: 52,
    borderRadius: RADIUS.pill,
    backgroundColor: "rgba(255,255,255,0.25)",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 5,
  },
  badgeEmoji: { fontSize: 24 },
  footer: { width: "100%", paddingBottom: SPACING.xl, alignItems: "center" },
  footerNote: { color: "rgba(255,255,255,0.85)", marginTop: SPACING.md, fontSize: FONT.small, fontWeight: "600" },
});
