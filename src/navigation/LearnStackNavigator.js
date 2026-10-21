import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LearnHomeScreen from "../screens/learner/LearnHomeScreen";
import AlphabetScreen from "../screens/learner/AlphabetScreen";
import NumbersScreen from "../screens/learner/NumbersScreen";
import ColorsScreen from "../screens/learner/ColorsScreen";
import ShapesScreen from "../screens/learner/ShapesScreen";
import AnimalsScreen from "../screens/learner/AnimalsScreen";
import WordsScreen from "../screens/learner/WordsScreen";
import QuizScreen from "../screens/learner/QuizScreen";

const Stack = createNativeStackNavigator();

export default function LearnStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="LearnHome" component={LearnHomeScreen} />
      <Stack.Screen name="Alphabet" component={AlphabetScreen} />
      <Stack.Screen name="Numbers" component={NumbersScreen} />
      <Stack.Screen name="Colors" component={ColorsScreen} />
      <Stack.Screen name="Shapes" component={ShapesScreen} />
      <Stack.Screen name="Animals" component={AnimalsScreen} />
      <Stack.Screen name="Words" component={WordsScreen} />
      <Stack.Screen name="Quiz" component={QuizScreen} />
    </Stack.Navigator>
  );
}
