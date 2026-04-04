import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  Pressable,
} from "react-native";
import { HeroHeader } from "../../components/layout/HeroHeader";
import { MaterialCard } from "../../components/cards/MaterialCard";
import { colors } from "../../theme/colors";
import { useAppContext } from "../../context/AppContext";
import { SearchIcon, PackageIcon, PlusIcon, MicIcon } from "../../components/Icons";

type StockFilter = "all" | "low";

export function InventoryScreen() {
  const { materialsData, showToast, setVoiceOpen } = useAppContext();

  const [query, setQuery] = useState("");
  const [stockFilter, setStockFilter] = useState<StockFilter>("all");

  const filteredMaterials = useMemo(() => {
    return materialsData.filter((m) => {
      const matchesSearch = m.title
        .toLowerCase()
        .includes(query.toLowerCase());
      const matchesFilter = stockFilter === "all" || m.low;
      return matchesSearch && matchesFilter;
    });
  }, [materialsData, query, stockFilter]);

  return (
    <ScrollView
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      <HeroHeader
        eyebrow="Stock Control"
        title="Material visibility without stock surprises."
        copy="Store keepers and site engineers get current stock, 7-day consumption and low-stock alerts tied to actual site usage."
      />

      {/* ── Search + Filter bar ───────────────────── */}
      <View style={styles.filterBar}>
        <View style={styles.searchWrapper}>
          <SearchIcon size={18} color={colors.muted} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search material..."
            placeholderTextColor={colors.muted}
            value={query}
            onChangeText={setQuery}
            returnKeyType="search"
            clearButtonMode="while-editing"
          />
        </View>

        <View style={styles.pills}>
          {(["all", "low"] as StockFilter[]).map((filter) => {
            const active = stockFilter === filter;
            return (
              <Pressable
                key={filter}
                style={[styles.pill, active && styles.pillActive]}
                onPress={() => setStockFilter(filter)}
              >
                <Text style={[styles.pillText, active && styles.pillTextActive]}>
                  {filter === "all" ? "All" : "Low Stock"}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      {/* ── Material cards ───────────────────────── */}
      {filteredMaterials.length > 0 ? (
        filteredMaterials.map((material) => (
          <MaterialCard key={material.id} material={material} />
        ))
      ) : (
        <View style={styles.emptyState}>
          <PackageIcon size={48} color={colors.muted} style={{ marginBottom: 14 }} />
          <Text style={styles.emptyTitle}>No materials found</Text>
          <Text style={styles.emptyBody}>
            {stockFilter === "low"
              ? "No low-stock items right now. All materials are at healthy levels."
              : "Try a different search term."}
          </Text>
        </View>
      )}

      {/* ── Quick Actions ────────────────────────── */}
      <View style={styles.quickGrid}>
        {/* Add Material */}
        <Pressable
          style={styles.quickCard}
          onPress={() => showToast("New material form is ready for the store team.")}
        >
          <View style={[styles.quickIcon, styles.quickIconNeutral]}>
            <PlusIcon size={24} color={colors.text} />
          </View>
          <Text style={styles.quickTitle}>Add Material</Text>
          <Text style={styles.quickSub}>
            Create a new stock entry for any site material.
          </Text>
        </Pressable>

        {/* Voice Logger */}
        <Pressable
          style={styles.quickCard}
          onPress={() => setVoiceOpen(true)}
        >
          <View style={[styles.quickIcon, styles.quickIconAccent]}>
            <MicIcon size={24} color={colors.accent} />
          </View>
          <Text style={styles.quickTitle}>Voice Logger</Text>
          <Text style={styles.quickSub}>
            Say the material name and quantity. Entry auto-saves after
            confirmation.
          </Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 18,
    paddingBottom: 48,
    gap: 14,
  },

  /* ── Filter bar ── */
  filterBar: {
    gap: 10,
  },
  searchWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 48,
    gap: 8,
  },
  searchIcon: {
    fontSize: 18,
    color: colors.muted,
    lineHeight: 22,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: colors.text,
    fontFamily: "DMSans_400Regular",
    height: "100%",
  },
  pills: {
    flexDirection: "row",
    gap: 8,
  },
  pill: {
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 99,
    backgroundColor: colors.surfaceSoft,
    borderWidth: 1,
    borderColor: colors.border,
  },
  pillActive: {
    backgroundColor: colors.text,
    borderColor: colors.text,
  },
  pillText: {
    color: colors.muted,
    fontSize: 13,
    fontWeight: "700",
    fontFamily: "DMSans_700Bold",
  },
  pillTextActive: {
    color: "#FFFFFF",
  },

  /* ── Empty state ── */
  emptyState: {
    alignItems: "center",
    paddingVertical: 48,
    paddingHorizontal: 24,
  },
  emptyIcon: {
    fontSize: 40,
    marginBottom: 14,
  },
  emptyTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "700",
    fontFamily: "DMSans_700Bold",
    marginBottom: 8,
    textAlign: "center",
  },
  emptyBody: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 22,
    fontFamily: "DMSans_400Regular",
    textAlign: "center",
  },

  /* ── Quick-action grid ── */
  quickGrid: {
    flexDirection: "row",
    gap: 12,
    marginTop: 4,
  },
  quickCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 22,
    padding: 18,
    minHeight: 56,
  },
  quickIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  quickIconAccent: {
    backgroundColor: "rgba(193,127,60,0.12)",
  },
  quickIconNeutral: {
    backgroundColor: "rgba(42,33,24,0.06)",
  },
  quickIconText: {
    fontSize: 22,
  },
  quickTitle: {
    color: colors.text,
    fontSize: 15,
    fontWeight: "700",
    fontFamily: "DMSans_700Bold",
    marginBottom: 4,
  },
  quickSub: {
    color: colors.muted,
    fontSize: 12,
    lineHeight: 19,
    fontFamily: "DMSans_400Regular",
  },
});
