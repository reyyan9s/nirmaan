import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

// Import implemented main screens
import { DashboardScreen } from "../screens/dashboard/DashboardScreen";
import { WorkerListScreen } from "../screens/workers/WorkerListScreen";
import { InventoryScreen } from "../screens/inventory/InventoryScreen";
import { AIChatScreen } from "../screens/ai/AIChatScreen";
import { SettingsScreen } from "../screens/settings/SettingsScreen";
// Import placeholder
import { PlaceholderScreen } from "../screens/PlaceholderScreen";

const Stack = createNativeStackNavigator();

export function DashboardStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="DashboardMain" component={DashboardScreen} />
    </Stack.Navigator>
  );
}

export function WorkersStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="WorkerList" component={WorkerListScreen} />
      <Stack.Screen name="WorkerProfile" component={PlaceholderScreen} />
      <Stack.Screen name="Payroll" component={PlaceholderScreen} />
    </Stack.Navigator>
  );
}

export function InventoryStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="InventoryMain" component={InventoryScreen} />
      <Stack.Screen name="MaterialDetail" component={PlaceholderScreen} />
      <Stack.Screen name="AddMaterial" component={PlaceholderScreen} />
      <Stack.Screen name="VoiceLogger" component={PlaceholderScreen} />
    </Stack.Navigator>
  );
}

export function AIStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="AIChat" component={AIChatScreen} />
      <Stack.Screen name="Insights" component={PlaceholderScreen} />
    </Stack.Navigator>
  );
}

export function SettingsStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="SettingsMain" component={SettingsScreen} />
    </Stack.Navigator>
  );
}
