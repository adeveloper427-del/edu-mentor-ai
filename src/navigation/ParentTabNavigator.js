import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Text } from "react-native";
import ParentDashboardScreen from "../screens/parent/ParentDashboardScreen";
import ParentProgressScreen from "../screens/parent/ParentProgressScreen";
import ParentRecommendationsScreen from "../screens/parent/ParentRecommendationsScreen";
import ParentProfileScreen from "../screens/parent/ParentProfileScreen";
import { COLORS } from "../constants/theme";

const Tab = createBottomTabNavigator();

const icons = {
  Dashboard: "📊",
  Progress: "📈",
  Recommendations: "💡",
  Profile: "👤",
};

function TabIcon({ routeName, focused }) {
  return <Text style={{ fontSize: 20, opacity: focused ? 1 : 0.5 }}>{icons[routeName]}</Text>;
}

export default function ParentTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: COLORS.parentPrimary,
        tabBarInactiveTintColor: COLORS.textMuted,
        tabBarIcon: ({ focused }) => <TabIcon routeName={route.name} focused={focused} />,
        tabBarLabelStyle: { fontSize: 11, fontWeight: "700" },
        tabBarStyle: { height: 62, paddingBottom: 8, paddingTop: 6 },
      })}
    >
      <Tab.Screen name="Dashboard" component={ParentDashboardScreen} />
      <Tab.Screen name="Progress" component={ParentProgressScreen} />
      <Tab.Screen name="Recommendations" component={ParentRecommendationsScreen} />
      <Tab.Screen name="Profile" component={ParentProfileScreen} />
    </Tab.Navigator>
  );
}
