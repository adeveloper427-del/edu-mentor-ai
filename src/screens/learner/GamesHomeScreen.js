import React from "react";
import { ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../../components/Header";
import CategoryCard from "../../components/CategoryCard";
import gamesData from "../../data/gamesData";
import { COLORS, SPACING } from "../../constants/theme";

export default function GamesHomeScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <Header title="Games" subtitle="Learn while you play!" />
      <ScrollView contentContainerStyle={styles.scroll}>
        {gamesData.map((game) => (
          <CategoryCard
            key={game.id}
            icon={game.icon}
            title={game.title}
            subtitle={game.description}
            color={game.color}
            onPress={() => navigation.navigate(game.screen)}
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
