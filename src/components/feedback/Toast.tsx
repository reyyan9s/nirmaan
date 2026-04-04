import React from "react";
import { View, Text, StyleSheet } from "react-native";

export function Toast({ message }: { message: string }) {
  if (!message) return null;
  
  return (
    <View style={styles.toast}>
      <Text style={styles.toastText}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  toast: {
    position: "absolute",
    bottom: 40,
    alignSelf: "center",
    backgroundColor: "#2A2118",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 99,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  toastText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
    fontFamily: "DMSans_700Bold",
  },
});
