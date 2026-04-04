import React, { useRef } from "react";
import {
  View,
  Text,
  TextInput as RNTextInput,
  StyleSheet,
  Pressable,
} from "react-native";
import { colors } from "../../theme/colors";
import { PencilIcon } from "../Icons";

interface TextInputProps {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  multiline?: boolean;
}

export function TextInput({ label, value, onChangeText, multiline }: TextInputProps) {
  const inputRef = useRef<RNTextInput>(null);

  return (
    <View style={styles.wrapper}>
      {/* Label row with pencil icon — tapping either focuses the input */}
      <Pressable style={styles.labelRow} onPress={() => inputRef.current?.focus()}>
        <Text style={styles.fieldLabel}>{label}</Text>
        <PencilIcon size={14} color={colors.muted} style={{ opacity: 0.6 }} />
      </Pressable>

      <RNTextInput
        ref={inputRef}
        multiline={multiline}
        value={value}
        onChangeText={onChangeText}
        style={[styles.fieldInput, multiline && styles.fieldInputMultiline]}
        placeholderTextColor={colors.muted}
        // Always editable — this is the correction surface
        editable
        scrollEnabled={multiline}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginTop: 16,
  },

  /* Label + pencil */
  labelRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  fieldLabel: {
    color: colors.text,
    fontSize: 13,
    fontWeight: "700",
    fontFamily: "DMSans_700Bold",
    letterSpacing: 0.2,
  },

  /* Input field — lighter 1px border as specified */
  fieldInput: {
    borderWidth: 1,
    borderColor: "#D4C9B8",           // exactly as requested
    backgroundColor: colors.surface,  // pure white so text is maximally readable
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 13,
    fontSize: 15,
    color: colors.text,
    fontFamily: "DMSans_500Medium",
  },
  fieldInputMultiline: {
    minHeight: 88,
    textAlignVertical: "top",
    paddingTop: 13,
  },
});
