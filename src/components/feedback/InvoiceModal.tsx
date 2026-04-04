import React from "react";
import { Modal, View, Text, StyleSheet, Pressable, ScrollView } from "react-native";
import { colors } from "../../theme/colors";
import { Card } from "../cards/Card";
import { ActionButton } from "../buttons/ActionButton";
import { ModalRow } from "./ModalRow";
import { TextInput } from "../inputs/TextInput";
import { InfoPill } from "./InfoPill";
import { XIcon, UploadIcon } from "../Icons";

interface InvoiceModalProps {
  visible: boolean;
  onClose: () => void;
  supplierName: string;
  invoiceItems: string;
  invoiceQuantity: string;
  invoiceTotal: string;
  setSupplierName: (value: string) => void;
  setInvoiceItems: (value: string) => void;
  setInvoiceQuantity: (value: string) => void;
  setInvoiceTotal: (value: string) => void;
  onConfirm: () => void;
  onSaveDraft: () => void;
}

export function InvoiceModal({
  visible,
  onClose,
  supplierName,
  invoiceItems,
  invoiceQuantity,
  invoiceTotal,
  setSupplierName,
  setInvoiceItems,
  setInvoiceQuantity,
  setInvoiceTotal,
  onConfirm,
  onSaveDraft,
}: InvoiceModalProps) {
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.modalBackdrop}>
        <View style={styles.modalSheet}>
          <View style={styles.modalHeader}>
            <View>
              <Text style={styles.modalTitle}>Invoice Scanner</Text>
              <Text style={styles.workerMeta}>AI-assisted expense confirmation</Text>
            </View>
            <Pressable onPress={onClose} style={styles.closeButton}>
              <XIcon size={18} color={colors.text} />
            </Pressable>
          </View>
          <ScrollView contentContainerStyle={styles.modalContent} showsVerticalScrollIndicator={false}>
            <View style={styles.uploadCard}>
              <View style={styles.uploadCircle}>
                <UploadIcon size={24} color={colors.text} />
              </View>
              <Text style={styles.feedTitle}>Upload Invoice</Text>
              <Text style={styles.cardSubcopy}>
                PDF, JPG or PNG from suppliers like Sharma Steel or Nashik Concrete Supply.
              </Text>
            </View>

            <Card>
              <View style={styles.sectionRow}>
                <View style={{ flex: 1, marginRight: 12 }}>
                  <Text style={styles.eyebrowSmall}>Extracted Details</Text>
                  <Text style={styles.feedTitle}>Invoice INV-SD-129</Text>
                  <Text style={styles.aiHint}>
                    AI-extracted. Tap any field to correct before confirming.
                  </Text>
                </View>
                <InfoPill label="Verified" />
              </View>

              <TextInput label="Supplier Name" value={supplierName} onChangeText={setSupplierName} />
              <TextInput label="Items" value={invoiceItems} onChangeText={setInvoiceItems} multiline />
              <TextInput label="Quantity Summary" value={invoiceQuantity} onChangeText={setInvoiceQuantity} />
              <TextInput label="Total Amount (₹)" value={invoiceTotal} onChangeText={setInvoiceTotal} />

              <View style={styles.modalSummary}>
                <ModalRow label="GST" value="18%" />
                <ModalRow label="Site" value="Tower B, Nashik Ring Road" />
                <ModalRow label="Status" value="Ready for expense ledger" />
              </View>

              <View style={styles.modalActionColumn}>
                <ActionButton label="Confirm & Add to Expenses" onPress={onConfirm} />
                <ActionButton label="Save as Draft" variant="ghost" onPress={onSaveDraft} />
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
  uploadCard: {
    backgroundColor: colors.surfaceSoft,
    borderWidth: 1,
    borderColor: colors.border,
    borderStyle: "dashed",
    borderRadius: 22,
    padding: 32,
    alignItems: "center",
    marginBottom: 16,
  },
  uploadCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  uploadCircleText: {
    color: colors.text,
    fontSize: 12,
    fontWeight: "700",
    fontFamily: "DMSans_700Bold",
  },
  feedTitle: {
    color: colors.text,
    fontSize: 15,
    fontWeight: "700",
    fontFamily: "DMSans_700Bold",
    textAlign: "center",
  },
  cardSubcopy: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 21,
    marginTop: 8,
    fontFamily: "DMSans_400Regular",
    textAlign: "center",
  },
  sectionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
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
  aiHint: {
    color: colors.muted,
    fontSize: 12,
    lineHeight: 18,
    marginTop: 6,
    fontFamily: "DMSans_400Regular",
  },
  modalSummary: {
    marginTop: 18,
    marginBottom: 24,
  },
  modalActionColumn: {
    gap: 12,
  },
});
