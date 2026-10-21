import React from "react";
import { ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../../components/Header";
import CategoryCard from "../../components/CategoryCard";
import { COLORS, SPACING } from "../../constants/theme";

const categories = [
  { key: "Alphabet", icon: "🔤", subtitle: "Learn A to Z", color: COLORS.secondary },
  { key: "Numbers", icon: "🔢", subtitle: "Counting & simple math", color: COLORS.blue },
  { key: "Colors", icon: "🎨", subtitle: "8 fun colors", color: COLORS.pink },
  { key: "Shapes", icon: "🔷", subtitle: "6 shapes to explore", color: COLORS.green },
  { key: "Animals", icon: "🐶", subtitle: "Meet the animals", color: COLORS.purple },
  { key: "Words", icon: "📚", subtitle: "Build your vocabulary", color: COLORS.yellow },
];

export default function LearnHomeScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <Header title="Learn" subtitle="Pick a topic to explore" />
      <ScrollView contentContainerStyle={styles.scroll}>
        {categories.map((cat) => (
          <CategoryCard
            key={cat.key}
            icon={cat.icon}
            title={cat.key}
            subtitle={cat.subtitle}
            color={cat.color}
            onPress={() => navigation.navigate(cat.key)}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  scroll: { padding: SPACING.lg },
});
