import React from "react";
import { Modal, View, Text, StyleSheet, Pressable, ScrollView } from "react-native";
import { colors } from "../../theme/colors";
import { Card } from "../cards/Card";
import { ActionButton } from "../buttons/ActionButton";
import { ModalRow } from "./ModalRow";
import { XIcon, MicIcon } from "../Icons";

interface VoiceModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function VoiceModal({ visible, onClose, onConfirm }: VoiceModalProps) {
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.modalBackdrop}>
        <View style={styles.modalSheet}>
          <View style={styles.modalHeader}>
            <View>
              <Text style={styles.modalTitle}>Voice Material Logger</Text>
              <Text style={styles.workerMeta}>Hands-free site entry</Text>
            </View>
            <Pressable onPress={onClose} style={styles.closeButton}>
              <XIcon size={18} color={colors.text} />
            </Pressable>
          </View>
          <ScrollView contentContainerStyle={styles.modalContent} showsVerticalScrollIndicator={false}>
            <Text style={styles.eyebrow}>Listening</Text>
            <Text style={styles.voiceTitle}>
              Add <Text style={styles.voiceAccent}>50 bags cement</Text> to{" "}
              <Text style={styles.voiceAccent}>Tower B</Text>.
            </Text>
            <View style={styles.micPulseOuter}>
              <View style={styles.micPulseMiddle}>
                <View style={styles.micButton}>
                  <MicIcon size={28} color="#FFFFFF" />
                </View>
              </View>
            </View>
            <Card>
              <Text style={styles.eyebrowSmall}>Parsed Confirmation</Text>
              <Text style={styles.feedTitle}>Material movement looks valid</Text>
              <View style={styles.modalSummary}>
                <ModalRow label="Action" value="Add" />
                <ModalRow label="Material" value="Cement" />
                <ModalRow label="Quantity" value="50 bags" />
                <ModalRow label="Location" value="Tower B" />
                <ModalRow label="Recorded by" value="Store Keeper Desk" />
              </View>
              <View style={styles.modalActionColumn}>
                <ActionButton label="Confirm & Save" onPress={onConfirm} />
                <ActionButton label="Edit Quantity" variant="ghost" onPress={() => {}} />
              </View>
            </Card>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(42,33,24,0.4)",
    justifyContent: "flex-end",
  },
  modalSheet: {
    backgroundColor: colors.bg,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    maxHeight: "90%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalTitle: {
    color: colors.text,
    fontSize: 20,
    fontWeight: "700",
    fontFamily: "DMSans_700Bold",
  },
  workerMeta: {
    color: colors.muted,
    fontSize: 13,
    marginTop: 4,
    fontFamily: "DMSans_400Regular",
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(42,33,24,0.06)",
    alignItems: "center",
    justifyContent: "center",
  },
  closeText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "700",
  },
  modalContent: {
    padding: 24,
    paddingBottom: 48,
  },
  eyebrow: {
    color: colors.accent,
    fontSize: 11,
    letterSpacing: 2.4,
    textTransform: "uppercase",
    fontWeight: "700",
    marginBottom: 10,
    fontFamily: "DMSans_700Bold",
  },
  eyebrowSmall: {
    color: colors.muted,
    fontSize: 11,
    letterSpacing: 1.6,
    textTransform: "uppercase",
    fontWeight: "700",
    marginBottom: 8,
    fontFamily: "DMSans_700Bold",
  },
  voiceTitle: {
    color: colors.text,
    fontSize: 28,
    lineHeight: 40,
    fontWeight: "300",
    fontFamily: "Fraunces_300Light",
  },
  voiceAccent: {
    color: colors.accent,
    fontWeight: "400",
  },
  micPulseOuter: {
    alignSelf: "center",
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: "rgba(193,127,60,0.06)",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 32,
  },
  micPulseMiddle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "rgba(193,127,60,0.12)",
    alignItems: "center",
    justifyContent: "center",
  },
  micButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.accent,
    alignItems: "center",
    justifyContent: "center",
    elevation: 4,
  },
  micButtonText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "700",
    fontFamily: "DMSans_700Bold",
  },
  feedTitle: {
    color: colors.text,
    fontSize: 15,
    fontWeight: "700",
    fontFamily: "DMSans_700Bold",
  },
  modalSummary: {
    marginTop: 18,
    marginBottom: 24,
  },
  modalActionColumn: {
    gap: 12,
  },
});
