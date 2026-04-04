import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { colors } from "../../theme/colors";

interface ChatBubbleProps {
  user?: boolean;
  text: string;
  actions?: { label: string; onPress: () => void }[];
  isSecondary?: boolean;
}

export function ChatBubble({ user, text, actions, isSecondary }: ChatBubbleProps) {
  return (
    <View style={[styles.chatBubble, user ? styles.chatUser : styles.chatAi, isSecondary && styles.chatSecondary]}>
      <Text style={styles.chatText}>{text}</Text>
      {actions ? (
        <View style={styles.chatActions}>
          {actions.map((action) => (
            <Pressable key={action.label} style={styles.chatChip} onPress={action.onPress}>
              <Text style={styles.chatChipText}>{action.label}</Text>
            </Pressable>
          ))}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  chatBubble: {
    padding: 16,
    borderRadius: 20,
    marginTop: 12,
    maxWidth: "92%",
  },
  chatUser: {
    backgroundColor: colors.surfaceSoft,
    alignSelf: "flex-end",
    borderBottomRightRadius: 6,
  },
  chatAi: {
    backgroundColor: "rgba(193,127,60,0.06)",
    alignSelf: "flex-start",
    borderBottomLeftRadius: 6,
  },
  chatText: {
    color: colors.text,
    fontSize: 15,
    lineHeight: 24,
    fontFamily: "DMSans_500Medium",
  },
  chatActions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 14,
  },
  chatChip: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: "rgba(42,33,24,0.15)",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 99,
    minHeight: 44,
    justifyContent: "center",
  },
  chatChipText: {
    color: colors.text,
    fontSize: 13,
    fontWeight: "700",
    fontFamily: "DMSans_700Bold",
  },
  chatSecondary: {
    borderLeftWidth: 3,
    borderLeftColor: "#C8A96E",
    backgroundColor: "rgba(193,127,60,0.03)", // slightly lighter than chatAi default to look distinct
    marginLeft: 8,
  },
});
