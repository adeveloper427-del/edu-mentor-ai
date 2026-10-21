import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import GamesHomeScreen from "../screens/learner/GamesHomeScreen";
import FindLetterGameScreen from "../screens/learner/games/FindLetterGameScreen";
import CountObjectsGameScreen from "../screens/learner/games/CountObjectsGameScreen";
import FindColorGameScreen from "../screens/learner/games/FindColorGameScreen";
import MatchShapeGameScreen from "../screens/learner/games/MatchShapeGameScreen";
import GuessAnimalGameScreen from "../screens/learner/games/GuessAnimalGameScreen";

const Stack = createNativeStackNavigator();

export default function GamesStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="GamesHome" component={GamesHomeScreen} />
      <Stack.Screen name="FindLetterGame" component={FindLetterGameScreen} />
      <Stack.Screen name="CountObjectsGame" component={CountObjectsGameScreen} />
      <Stack.Screen name="FindColorGame" component={FindColorGameScreen} />
      <Stack.Screen name="MatchShapeGame" component={MatchShapeGameScreen} />
      <Stack.Screen name="GuessAnimalGame" component={GuessAnimalGameScreen} />
    </Stack.Navigator>
  );
}
