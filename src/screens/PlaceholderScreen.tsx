import React from "react";
import { View, StyleSheet } from "react-native";
import { HeroHeader } from "../components/layout/HeroHeader";
import { colors } from "../theme/colors";

export function PlaceholderScreen({ route }: any) {
  return (
    <View style={styles.container}>
      <HeroHeader 
        eyebrow="Coming Soon" 
        title={route?.name || "Placeholder"} 
        copy="This screen is under development." 
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 18,
    paddingTop: 40,
    backgroundColor: colors.bg,
  },
});
