import React from "react";
import { SafeAreaView, StatusBar, StyleSheet, View, ViewStyle, Platform } from "react-native";
import { StatusBar as ExpoStatusBar } from "expo-status-bar";
import { colors } from "../../theme/colors";

interface AppContainerProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export function AppContainer({ children, style }: AppContainerProps) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.bg} />
      <View style={[styles.app, style]}>{children}</View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  app: {
    flex: 1,
    backgroundColor: colors.bg,
  },
});
