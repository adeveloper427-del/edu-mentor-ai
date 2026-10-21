import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../../components/Header";
import QuizOption from "../../components/QuizOption";
import ProgressBar from "../../components/ProgressBar";
import ScoreCard from "../../components/ScoreCard";
import AppButton from "../../components/AppButton";
import quizData from "../../data/quizData";
import { useApp } from "../../context/AppContext";
import { COLORS, FONT, SPACING } from "../../constants/theme";

export default function QuizScreen({ route, navigation }) {
  const { categoryId } = route.params;
  const quiz = quizData[categoryId];
  const { recordQuizResult, unlockBadge } = useApp();

  const [qIndex, setQIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const question = quiz.questions[qIndex];

  const handleSelect = (option) => {
    if (selected) return;
    setSelected(option);
    if (option === question.answer) setScore((s) => s + 1);
  };

  const handleNext = () => {
    if (qIndex < quiz.questions.length - 1) {
      setQIndex(qIndex + 1);
      setSelected(null);
    } else {
      const finalScore = score + (selected === question.answer ? 0 : 0);
      recordQuizResult(categoryId, score, quiz.questions.length);
      if (score === quiz.questions.length) unlockBadge("gameWinner");
      setFinished(true);
    }
  };

  const handleRetry = () => {
    setQIndex(0);
    setSelected(null);
    setScore(0);
    setFinished(false);
  };

  if (finished) {
    return (
      <SafeAreaView style={styles.container} edges={["top"]}>
        <Header title={quiz.title} onBack={() => navigation.goBack()} />
        <View style={styles.finishedBody}>
          <ScoreCard
            score={score}
            total={quiz.questions.length}
            message={score === quiz.questions.length ? "Perfect score! You're a superstar! 🌟" : "Keep practicing, you're doing great!"}
          />
          <View style={styles.finishedButtons}>
            <AppButton title="Try Again" icon="🔁" onPress={handleRetry} style={{ marginBottom: SPACING.sm }} />
            <AppButton title="Back to Learn" icon="🏠" outline onPress={() => navigation.navigate("LearnHome")} />
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <Header title={quiz.title} subtitle={`Question ${qIndex + 1} of ${quiz.questions.length}`} onBack={() => navigation.goBack()} />
      <View style={styles.body}>
        <ProgressBar progress={(qIndex + 1) / quiz.questions.length} showPercent={false} color={COLORS.accent} />

        <Text style={styles.question}>{question.question}</Text>

        {question.options.map((opt) => (
          <QuizOption
            key={opt}
            label={opt}
            onPress={() => handleSelect(opt)}
            state={
              !selected
                ? "default"
                : opt === question.answer
                ? "correct"
                : opt === selected
                ? "incorrect"
                : "disabled"
            }
          />
        ))}

        {selected ? (
          <View style={styles.feedbackWrap}>
            <Text style={styles.feedback}>
              {selected === question.answer ? "Excellent! ⭐" : "Good try! Let's try again!"}
            </Text>
            <AppButton
              title={qIndex === quiz.questions.length - 1 ? "See Results" : "Next Question"}
              icon="➡️"
              onPress={handleNext}
            />
          </View>
        ) : null}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  body: { flex: 1, padding: SPACING.lg },
  question: { fontSize: FONT.h2, fontWeight: "800", color: COLORS.textDark, marginVertical: SPACING.lg },
  feedbackWrap: { marginTop: SPACING.md, alignItems: "center" },
  feedback: { fontSize: FONT.h3, fontWeight: "800", color: COLORS.textDark, marginBottom: SPACING.md },
  finishedBody: { flex: 1, padding: SPACING.lg, justifyContent: "center" },
  finishedButtons: { marginTop: SPACING.xl },
});
