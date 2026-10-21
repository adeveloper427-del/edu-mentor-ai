import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Text } from "react-native";
import AdminDashboardScreen from "../screens/admin/AdminDashboardScreen";
import AdminUsersScreen from "../screens/admin/AdminUsersScreen";
import AdminContentScreen from "../screens/admin/AdminContentScreen";
import AdminStatisticsScreen from "../screens/admin/AdminStatisticsScreen";
import { COLORS } from "../constants/theme";

const Tab = createBottomTabNavigator();

const icons = {
  Dashboard: "🗂️",
  Users: "🧑‍🤝‍🧑",
  Content: "📚",
  Statistics: "📊",
};

function TabIcon({ routeName, focused }) {
  return <Text style={{ fontSize: 20, opacity: focused ? 1 : 0.5 }}>{icons[routeName]}</Text>;
}

export default function AdminTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: COLORS.adminAccent,
        tabBarInactiveTintColor: COLORS.textMuted,
        tabBarIcon: ({ focused }) => <TabIcon routeName={route.name} focused={focused} />,
        tabBarLabelStyle: { fontSize: 11, fontWeight: "700" },
        tabBarStyle: { height: 62, paddingBottom: 8, paddingTop: 6 },
      })}
    >
      <Tab.Screen name="Dashboard" component={AdminDashboardScreen} />
      <Tab.Screen name="Users" component={AdminUsersScreen} />
      <Tab.Screen name="Content" component={AdminContentScreen} />
      <Tab.Screen name="Statistics" component={AdminStatisticsScreen} />
    </Tab.Navigator>
  );
}
