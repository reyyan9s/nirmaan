import React from "react";
import { View, StyleSheet, ScrollView, TextInput, Pressable, Text } from "react-native";
import { HeroHeader } from "../../components/layout/HeroHeader";
import { Card } from "../../components/cards/Card";
import { AnomalyCard } from "../../components/cards/AnomalyCard";
import { ChatBubble } from "../../components/cards/ChatBubble";
import { InfoPill } from "../../components/feedback/InfoPill";
import { useAppContext } from "../../context/AppContext";
import { SparklesIcon } from "../../components/Icons";

export function AIChatScreen() {
  const { showToast } = useAppContext();

  return (
    <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <HeroHeader
        eyebrow="AI Hub"
        title="Explain site costs, then recommend the next move."
        copy="The assistant speaks like a calm construction expert: short, numeric and actionable for procurement, finance and project leads."
      />
      <Card>
        <View style={styles.sectionRow}>
          <InfoPill label="Live Analysis" />
          <Pressable onPress={() => showToast("AI context synced with payroll, inventory and invoices.")}>
            <Text style={styles.linkText}>Refresh Context</Text>
          </Pressable>
        </View>
        <ChatBubble user text="Why is rebar cost increasing?" />
        <ChatBubble
          text="I noticed a 15% increase in Sharma Steel pricing and a 5.2% rise in cutting waste across Zone B. If we keep the same pattern, steel overspend could reach ₹2,35,000 by month end. I recommend reviewing cutting logs today and negotiating a blended-rate supply for the next 20 tons."
          actions={[
            { label: "View Logs", onPress: () => showToast("Opening steel cutting logs for Zone B.") },
            { label: "Contact Supplier", onPress: () => showToast("Supplier contact card for Sharma Steel is ready.") },
          ]}
        />
        <ChatBubble isSecondary text="Secondary signal: labour productivity on the rebar crew fell from 1.8 tons/day to 1.5 tons/day. Consider checking bar bending sequence before approving overtime." />
        
        <View style={styles.chatInputRow}>
          <TextInput
            style={styles.chatInput}
            editable={false}
            value="Ask about cement demand, vendor costs or wage variance..."
          />
          <Pressable style={styles.sendButton} onPress={() => showToast("Question queued for SiteMind AI.")}>
            <SparklesIcon size={18} color="#FFFFFF" strokeWidth={2.5} />
          </Pressable>
        </View>
      </Card>

      <Card>
        <AnomalyCard
          title="Concrete pumping cost is stable"
          copy="Two recent pours finished within planned duration, keeping diesel and pump rental aligned with budget."
          tone="accent"
          time="-1.8%"
          category={{ label: "Cost Stable", tone: "success" }}
        />
        <AnomalyCard
          title="Invoice mismatch avoided"
          copy="AI flagged a duplicate transport line item on invoice INV-SD-129. Accounts held the bill before payment."
          tone="accent"
          time="₹18,750 saved"
          last
          category={{ label: "Mismatch", tone: "danger" }}
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
  sectionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  linkText: {
    color: "#C17F3C",
    fontSize: 12,
    fontWeight: "700",
    fontFamily: "DMSans_700Bold",
  },
  chatInputRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 18,
    borderTopWidth: 1,
    borderTopColor: "#E3DDD3",
    paddingTop: 18,
  },
  chatInput: {
    flex: 1,
    backgroundColor: "#F5F0E8",
    borderRadius: 99,
    paddingHorizontal: 16,
    height: 48,
    fontSize: 14,
    color: "#7E7264",
    fontFamily: "DMSans_400Regular",
  },
  sendButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#C17F3C",
    alignItems: "center",
    justifyContent: "center",
  },
  sendButtonText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "700",
    fontFamily: "DMSans_700Bold",
  },
});
