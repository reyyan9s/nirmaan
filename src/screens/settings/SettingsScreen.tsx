import React from "react";
import { View, StyleSheet, ScrollView, Text } from "react-native";
import { HeroHeader } from "../../components/layout/HeroHeader";
import { Card } from "../../components/cards/Card";
import { SettingRow } from "../../components/cards/SettingRow";
import { StatusBadge } from "../../components/feedback/StatusBadge";
import { colors } from "../../theme/colors";

export function SettingsScreen() {
  return (
    <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <HeroHeader
        eyebrow="Settings"
        title="Role-based visibility for site, accounts and store teams."
        copy="Each role sees only what matters: payroll for accounts, inventory for store keepers, and AI summaries for project management."
      />
      
      <Card style={styles.profileCard}>
        <View style={styles.sectionRow}>
          <View style={{ flex: 1, paddingRight: 8 }}>
            <Text style={styles.workerName}>Sakshi Patil</Text>
            <Text style={styles.workerMeta}>Project Finance Lead • Samarth Developers</Text>
          </View>
          <StatusBadge status="Paid" label="Accounts Role" />
        </View>
      </Card>

      <Card>
        <SettingRow
          title="Default Dashboard"
          meta="Finance + Stock + AI Summary"
          copy="Combines labour payout risk, material depletion and invoice extraction for faster weekly reviews."
        />
        <SettingRow
          title="Alerts"
          meta="WhatsApp + Email"
          copy="Critical low stock, unpaid slip clusters and invoice mismatches are routed to project leads automatically."
        />
        <SettingRow
          title="Localization"
          meta="₹ INR"
          copy="Indian currency formatting, GST-oriented invoice fields and realistic local naming are active across the product."
          last
        />
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 18,
    paddingBottom: 40,
    gap: 14,
  },
  profileCard: {
    backgroundColor: colors.surfaceSoft,
    paddingVertical: 24,
  },
  sectionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  workerName: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 4,
    fontFamily: "DMSans_700Bold",
  },
  workerMeta: {
    color: colors.muted,
    fontSize: 13,
    lineHeight: 18,
    fontFamily: "DMSans_400Regular",
  },
});
