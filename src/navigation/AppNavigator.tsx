import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { TabNavigator } from "./TabNavigator";
import { PlaceholderScreen } from "../screens/PlaceholderScreen";

const RootStack = createNativeStackNavigator();

export function AppNavigator() {
  return (
    <NavigationContainer>
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        {/* We can place an initial Auth flow here, but we default to Main App for now */}
        <RootStack.Screen name="Main" component={TabNavigator} />
        
        {/* Auth Screens (Stubs) */}
        <RootStack.Screen name="Login" component={PlaceholderScreen} />
        <RootStack.Screen name="Register" component={PlaceholderScreen} />
        <RootStack.Screen name="ForgotPassword" component={PlaceholderScreen} />
        
        {/* Modals or other global screens could be pushed here */}
      </RootStack.Navigator>
    </NavigationContainer>
  );
}
