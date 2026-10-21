import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import WelcomeScreen from "../screens/common/WelcomeScreen";
import AuthScreen from "../screens/common/AuthScreen";
import WhoIsPlayingScreen from "../screens/common/WhoIsPlayingScreen";
import ParentReAuthScreen from "../screens/common/ParentReAuthScreen";
import AdminLoginScreen from "../screens/common/AdminLoginScreen";
import LoadingScreen from "../screens/common/LoadingScreen";
import LearnerTabNavigator from "./LearnerTabNavigator";
import ParentTabNavigator from "./ParentTabNavigator";
import AdminTabNavigator from "./AdminTabNavigator";
import { useApp } from "../context/AppContext";

const Stack = createNativeStackNavigator();

/**
 * Auth flow follows the React Navigation pattern of swapping which screens are
 * *registered* rather than navigating imperatively.
 *
 * The important rule: the screen sets must not overlap. An earlier version
 * registered both "Auth" and "WhoIsPlaying" in every state and tried to switch
 * with `key` + `initialRouteName`. Because "Auth" stayed a valid route after
 * signing in, the navigator simply stayed on it — the session updated but the
 * screen never changed, which looked like "login does nothing".
 *
 * Now signing in removes "Auth" from the tree entirely, so React Navigation has
 * no choice but to show the first remaining screen.
 */
export default function RootNavigator() {
  const { role, authenticated, booting } = useApp();

  // Wait for the saved session to be restored before deciding where to land.
  if (booting) return <LoadingScreen />;

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {role === "learner" ? (
          <Stack.Screen name="LearnerApp" component={LearnerTabNavigator} />
        ) : role === "parent" ? (
          <Stack.Screen name="ParentApp" component={ParentTabNavigator} />
        ) : role === "admin" ? (
          <Stack.Screen name="AdminApp" component={AdminTabNavigator} />
        ) : authenticated ? (
          <>
            <Stack.Screen name="WhoIsPlaying" component={WhoIsPlayingScreen} />
            <Stack.Screen name="ParentReAuth" component={ParentReAuthScreen} />
          </>
        ) : (
          <>
            <Stack.Screen name="Welcome" component={WelcomeScreen} />
            <Stack.Screen name="Auth" component={AuthScreen} />
            <Stack.Screen name="AdminLogin" component={AdminLoginScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
