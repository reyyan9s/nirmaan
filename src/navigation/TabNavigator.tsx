import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { DashboardStack, WorkersStack, InventoryStack, AIStack, SettingsStack } from "./StackNavigators";
import { BottomTabBar } from "../components/layout/BottomTabBar";

const Tab = createBottomTabNavigator();

export function TabNavigator() {
  return (
    <Tab.Navigator
      initialRouteName="Dashboard"
      screenOptions={{ headerShown: false }}
      tabBar={(props) => <BottomTabBar {...props} />}
    >
      <Tab.Screen name="Dashboard" component={DashboardStack} />
      <Tab.Screen name="Workers" component={WorkersStack} />
      <Tab.Screen name="Inventory" component={InventoryStack} />
      <Tab.Screen name="AI" component={AIStack} />
      <Tab.Screen name="Settings" component={SettingsStack} />
    </Tab.Navigator>
  );
}
