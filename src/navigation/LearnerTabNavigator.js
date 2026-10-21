import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Text } from "react-native";
import LearnerHomeScreen from "../screens/learner/LearnerHomeScreen";
import LearnStackNavigator from "./LearnStackNavigator";
import GamesStackNavigator from "./GamesStackNavigator";
import MentorChatScreen from "../screens/learner/MentorChatScreen";
import RewardsScreen from "../screens/learner/RewardsScreen";
import LearnerProfileScreen from "../screens/learner/LearnerProfileScreen";
import { COLORS } from "../constants/theme";

const Tab = createBottomTabNavigator();

const icons = {
  HomeTab: "🏠",
  LearnTab: "📖",
  GamesTab: "🎮",
  MentorTab: "🤖",
  RewardsTab: "🏆",
  ProfileTab: "😊",
};

function TabIcon({ routeName, focused }) {
  return <Text style={{ fontSize: 22, opacity: focused ? 1 : 0.5 }}>{icons[routeName]}</Text>;
}

export default function LearnerTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textMuted,
        tabBarIcon: ({ focused }) => <TabIcon routeName={route.name} focused={focused} />,
        tabBarLabelStyle: { fontSize: 11, fontWeight: "700" },
        tabBarStyle: { height: 64, paddingBottom: 8, paddingTop: 6 },
      })}
    >
      <Tab.Screen name="HomeTab" component={LearnerHomeScreen} options={{ title: "Home" }} />
      <Tab.Screen name="LearnTab" component={LearnStackNavigator} options={{ title: "Learn" }} />
      <Tab.Screen name="GamesTab" component={GamesStackNavigator} options={{ title: "Games" }} />
      <Tab.Screen name="MentorTab" component={MentorChatScreen} options={{ title: "Mentor" }} />
      <Tab.Screen name="RewardsTab" component={RewardsScreen} options={{ title: "Rewards" }} />
      <Tab.Screen name="ProfileTab" component={LearnerProfileScreen} options={{ title: "Profile" }} />
    </Tab.Navigator>
  );
}
