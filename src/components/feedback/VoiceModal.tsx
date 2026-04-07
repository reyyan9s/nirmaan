import React, { useState, useRef, useCallback, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  Animated,
  Easing,
  Platform,
  KeyboardAvoidingView,
  TextInput,
  Keyboard,
} from "react-native";
import { colors } from "../../theme/colors";
import { Card } from "../cards/Card";
import { ActionButton } from "../buttons/ActionButton";
import { ModalRow } from "./ModalRow";
import { XIcon, MicIcon } from "../Icons";

// ─── NLP Pipeline ──────────────────────────────────────────────────────────

function normalizeSpeech(text: string): string {
  text = text.toLowerCase().trim();

  const numbers: Record<string, number> = {
    zero: 0, one: 1, two: 2, three: 3, four: 4, five: 5,
    six: 6, seven: 7, eight: 8, nine: 9, ten: 10,
    eleven: 11, twelve: 12, thirteen: 13, fourteen: 14, fifteen: 15,
    sixteen: 16, seventeen: 17, eighteen: 18, nineteen: 19,
    twenty: 20, thirty: 30, forty: 40, fifty: 50,
    sixty: 60, seventy: 70, eighty: 80, ninety: 90,
    hundred: 100, sau: 100, pachaas: 50,
  };

  Object.keys(numbers).forEach((word) => {
    text = text.replace(new RegExp(`\\b${word}\\b`, "gi"), String(numbers[word]));
  });

  const unitMap: Record<string, string[]> = {
    kg: ["kg", "kilo", "kilos", "kilogram", "kilograms", "किलो"],
    bags: ["bag", "bags", "बैग", "sack", "sacks"],
    pieces: ["piece", "pieces", "pcs", "pc", "पीस", "ईंट", "unit", "units"],
    liters: ["liter", "liters", "litre", "litres", "l"],
    tons: ["ton", "tons", "tonne", "tonnes"],
    cubic_meters: ["cubic meter", "cubic meters", "m3", "cbm"],
  };

  const itemMap: Record<string, string[]> = {
    cement: ["cement", "सीमेंट", "cements"],
    bricks: ["brick", "bricks", "ईंट", "brick work"],
    sand: ["sand", "रेत", "fine sand", "coarse sand"],
    steel: ["steel", "rebar", "rebars", "rod", "rods", "iron", "लोहा"],
    gravel: ["gravel", "aggregate", "stone chips", "gitti", "गिट्टी"],
    water: ["water", "पानी"],
    paint: ["paint", "paints", "primer", "रंग"],
    tiles: ["tile", "tiles", "टाइल्स"],
    wood: ["wood", "timber", "plywood", "board"],
    glass: ["glass", "pane"],
  };

  for (const key in unitMap) {
    unitMap[key].forEach((word) => {
      text = text.replace(new RegExp(`\\b${word}\\b`, "gi"), key);
    });
  }
  for (const key in itemMap) {
    itemMap[key].forEach((word) => {
      text = text.replace(new RegExp(`\\b${word}\\b`, "gi"), key);
    });
  }

  return text;
}

interface ParsedInventory {
  quantity: string;
  unit: string;
  item: string;
  rawText: string;
}

const ITEMS = ["cement", "bricks", "sand", "steel", "gravel", "water", "paint", "tiles", "wood", "glass"];
const UNITS = ["kg", "bags", "pieces", "liters", "tons", "cubic_meters"];

function parseInventory(text: string): ParsedInventory | null {
  const cleaned = normalizeSpeech(text);
  const itemPattern = ITEMS.join("|");
  const unitPattern = UNITS.join("|");

  // Patterns: "50 bags cement", "50 cement bags", "cement 50 bags"
  const patterns = [
    new RegExp(`(\\d+(?:\\.\\d+)?)\\s*(${unitPattern})?\\s*(${itemPattern})`, "i"),
    new RegExp(`(\\d+(?:\\.\\d+)?)\\s*(${itemPattern})\\s*(${unitPattern})?`, "i"),
    new RegExp(`(${itemPattern})\\s*(\\d+(?:\\.\\d+)?)\\s*(${unitPattern})?`, "i"),
  ];

  for (const regex of patterns) {
    const match = cleaned.match(regex);
    if (match) {
      // Determine which group has quantity/unit/item
      const allGroups = match.slice(1).filter(Boolean);
      const qty = allGroups.find((g) => /^\d/.test(g));
      const unit = allGroups.find((g) => UNITS.includes(g));
      const item = allGroups.find((g) => ITEMS.includes(g));
      if (qty && item) {
        return {
          quantity: qty,
          unit: unit || "units",
          item,
          rawText: text,
        };
      }
    }
  }
  return null;
}

// ─── Types ─────────────────────────────────────────────────────────────────

type ModalState = "idle" | "input" | "processing" | "result" | "error";

interface VoiceModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: (data: Omit<ParsedInventory, "rawText">) => void;
}

// ─── Component ─────────────────────────────────────────────────────────────

export function VoiceModal({ visible, onClose, onConfirm }: VoiceModalProps) {
  const [state, setState] = useState<ModalState>("idle");
  const [inputText, setInputText] = useState("");
  const [parsedData, setParsedData] = useState<ParsedInventory | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const inputRef = useRef<TextInput>(null);

  // Mic pulse animation
  const pulseScale = useRef(new Animated.Value(1)).current;
  const pulseAnim = useRef<Animated.CompositeAnimation | null>(null);

  useEffect(() => {
    if (state === "input") {
      pulseAnim.current = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseScale, {
            toValue: 1.18,
            duration: 900,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
          Animated.timing(pulseScale, {
            toValue: 1,
            duration: 900,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
        ])
      );
      pulseAnim.current.start();
    } else {
      pulseAnim.current?.stop();
      pulseScale.setValue(1);
    }
    return () => { pulseAnim.current?.stop(); };
  }, [state]);

  // Focus input after state transition
  useEffect(() => {
    if (state === "input") {
      const t = setTimeout(() => inputRef.current?.focus(), 150);
      return () => clearTimeout(t);
    }
  }, [state]);

  // Reset when modal opens/closes
  useEffect(() => {
    if (!visible) {
      setState("idle");
      setInputText("");
      setParsedData(null);
      setErrorMsg("");
      Keyboard.dismiss();
    }
  }, [visible]);

  const handleMicPress = useCallback(() => {
    setInputText("");
    setState("input");
  }, []);

  const handleParse = useCallback(() => {
    const text = inputText.trim();
    if (!text) { setErrorMsg("Please enter something first."); setState("error"); return; }

    setState("processing");
    setTimeout(() => {
      const parsed = parseInventory(text);
      if (parsed) {
        setParsedData(parsed);
        setState("result");
      } else {
        setErrorMsg(`Could not understand "${text}". Try "50 bags cement" or "100 kg sand".`);
        setState("error");
      }
    }, 600);
  }, [inputText]);

  const handleConfirm = () => {
    if (parsedData) {
      onConfirm({ quantity: parsedData.quantity, unit: parsedData.unit, item: parsedData.item });
      onClose();
    }
  };

  const handleClose = () => {
    Keyboard.dismiss();
    onClose();
  };

  const handleRetry = () => {
    setInputText("");
    setErrorMsg("");
    setState("input");
    setTimeout(() => inputRef.current?.focus(), 150);
  };

  // ─── Render helpers ───────────────────────────────────────────────────────

  const renderIdle = () => (
    <>
      <Text style={styles.eyebrow}>Ready</Text>
      <Text style={styles.voiceTitle}>
        Tap the mic to{" "}
        <Text style={styles.voiceAccent}>log inventory</Text>
      </Text>

      <Pressable onPress={handleMicPress} style={{ alignSelf: "center" }}>
        <View style={styles.ringOuter}>
          <View style={styles.ringMiddle}>
            <View style={styles.micBtn}>
              <MicIcon size={28} color="#FFFFFF" />
            </View>
          </View>
        </View>
      </Pressable>

      <Text style={styles.hint}>Tap to begin</Text>

      <View style={styles.examplesWrap}>
        <Text style={styles.examplesLabel}>Examples you can say</Text>
        {["50 bags cement", "100 kg sand", "200 bricks", "10 tons steel"].map((ex) => (
          <Pressable key={ex} onPress={() => { setInputText(ex); setState("input"); }} style={styles.exampleChip}>
            <Text style={styles.exampleText}>{ex}</Text>
          </Pressable>
        ))}
      </View>
    </>
  );

  const renderInput = () => (
    <>
      <Text style={styles.eyebrow}>Speak or Type</Text>
      <Text style={styles.voiceTitle}>
        Describe your{" "}
        <Text style={styles.voiceAccent}>material entry</Text>
      </Text>

      <Pressable onPress={() => inputRef.current?.focus()} style={{ alignSelf: "center" }}>
        <Animated.View style={[styles.ringOuter, { transform: [{ scale: pulseScale }] }]}>
          <View style={styles.ringMiddle}>
            <View style={[styles.micBtn, styles.micBtnActive]}>
              <MicIcon size={28} color="#FFFFFF" />
            </View>
          </View>
        </Animated.View>
      </Pressable>

      <View style={styles.inputSection}>
        <TextInput
          ref={inputRef}
          style={styles.mainInput}
          placeholder="e.g. 50 bags cement"
          placeholderTextColor={colors.muted}
          value={inputText}
          onChangeText={setInputText}
          onSubmitEditing={handleParse}
          returnKeyType="done"
          autoCapitalize="none"
          multiline={false}
        />
        <Text style={styles.inputHint}>
          💡 Tap the {Platform.OS === "ios" ? "🎤" : "mic"} on your keyboard to speak
        </Text>
      </View>

      <View style={styles.actionCol}>
        <ActionButton label="Parse Entry" onPress={handleParse} />
        <ActionButton label="Cancel" variant="ghost" onPress={() => setState("idle")} />
      </View>
    </>
  );

  const renderProcessing = () => (
    <>
      <Text style={styles.eyebrow}>Processing</Text>
      <Text style={styles.voiceTitle}>
        Analyzing your{" "}
        <Text style={styles.voiceAccent}>entry</Text>…
      </Text>
      <View style={styles.processingWrap}>
        <View style={styles.ringOuter}>
          <View style={styles.ringMiddle}>
            <View style={styles.micBtn}>
              <Text style={{ fontSize: 22 }}>⏳</Text>
            </View>
          </View>
        </View>
        {!!inputText && (
          <View style={styles.transcriptBubble}>
            <Text style={styles.transcriptLabel}>Heard</Text>
            <Text style={styles.transcriptText}>"{inputText}"</Text>
          </View>
        )}
      </View>
    </>
  );

  const renderResult = () => {
    if (!parsedData) return null;
    const { quantity, unit, item, rawText } = parsedData;
    const displayItem = item.charAt(0).toUpperCase() + item.slice(1);
    const displayUnit = unit === "cubic_meters" ? "m³" : unit;
    return (
      <>
        <Text style={styles.eyebrow}>Confirmed ✓</Text>
        <Text style={styles.voiceTitle}>
          Add <Text style={styles.voiceAccent}>{quantity} {displayUnit} {displayItem}</Text>
        </Text>
        <View style={styles.ringOuter}>
          <View style={styles.ringMiddle}>
            <View style={[styles.micBtn, styles.micBtnSuccess]}>
              <Text style={styles.checkMark}>✓</Text>
            </View>
          </View>
        </View>
        <Card>
          <Text style={styles.eyebrowSmall}>Parsed Confirmation</Text>
          <Text style={styles.feedTitle}>Material movement looks valid</Text>
          <View style={styles.modalSummary}>
            <ModalRow label="Material" value={displayItem} />
            <ModalRow label="Quantity" value={`${quantity} ${displayUnit}`} />
            <ModalRow label="Action" value="Add to Inventory" />
          </View>
          {!!rawText && (
            <View style={styles.transcriptBubble}>
              <Text style={styles.transcriptLabel}>Input</Text>
              <Text style={styles.transcriptText}>"{rawText}"</Text>
            </View>
          )}
          <View style={styles.actionCol}>
            <ActionButton label="Confirm & Save" onPress={handleConfirm} />
            <ActionButton label="Try Again" variant="ghost" onPress={handleRetry} />
          </View>
        </Card>
      </>
    );
  };

  const renderError = () => (
    <>
      <Text style={[styles.eyebrow, { color: colors.danger }]}>Error</Text>
      <Text style={styles.voiceTitle}>
        Could not{" "}
        <Text style={[styles.voiceAccent, { color: colors.danger }]}>parse entry</Text>
      </Text>
      <View style={styles.ringOuter}>
        <View style={styles.ringMiddle}>
          <View style={[styles.micBtn, styles.micBtnError]}>
            <Text style={{ fontSize: 22 }}>✕</Text>
          </View>
        </View>
      </View>
      {!!errorMsg && (
        <View style={[styles.transcriptBubble, { borderLeftWidth: 3, borderLeftColor: colors.danger }]}>
          <Text style={styles.transcriptText}>{errorMsg}</Text>
        </View>
      )}
      <View style={styles.examplesWrap}>
        <Text style={styles.examplesLabel}>Supported formats</Text>
        {["50 bags cement", "100 kg sand", "200 bricks", "10 tons steel"].map((ex) => (
          <Pressable key={ex} onPress={() => { setInputText(ex); setState("input"); }} style={styles.exampleChip}>
            <Text style={styles.exampleText}>{ex}</Text>
          </Pressable>
        ))}
      </View>
      <View style={styles.actionCol}>
        <ActionButton label="Try Again" onPress={handleRetry} />
        <ActionButton label="Close" variant="ghost" onPress={handleClose} />
      </View>
    </>
  );

  const renderContent = () => {
    switch (state) {
      case "idle":       return renderIdle();
      case "input":      return renderInput();
      case "processing": return renderProcessing();
      case "result":     return renderResult();
      case "error":      return renderError();
    }
  };

  const headerSub: Record<ModalState, string> = {
    idle:       "Hands-free site entry",
    input:      "Speak or type your entry",
    processing: "Analyzing entry…",
    result:     "Entry parsed successfully",
    error:      "Could not parse entry",
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 24}
      >
        <Pressable style={styles.backdrop} onPress={handleClose}>
          <Pressable style={styles.sheet} onPress={() => {}}>
            {/* Handle */}
            <View style={styles.handle} />

            {/* Header */}
            <View style={styles.header}>
              <View>
                <Text style={styles.title}>Voice Material Logger</Text>
                <Text style={styles.subtitle}>{headerSub[state]}</Text>
              </View>
              <Pressable onPress={handleClose} style={styles.closeBtn}>
                <XIcon size={18} color={colors.text} />
              </Pressable>
            </View>

            {/* Body */}
            <ScrollView
              contentContainerStyle={styles.body}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              {renderContent()}
            </ScrollView>
          </Pressable>
        </Pressable>
      </KeyboardAvoidingView>
    </Modal>
  );
}

// ─── Styles ────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(42,33,24,0.45)",
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: colors.bg,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    maxHeight: "92%",
    paddingBottom: 16,
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.border,
    alignSelf: "center",
    marginTop: 12,
    marginBottom: 4,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: {
    color: colors.text,
    fontSize: 20,
    fontWeight: "700",
    fontFamily: "DMSans_700Bold",
  },
  subtitle: {
    color: colors.muted,
    fontSize: 13,
    marginTop: 4,
    fontFamily: "DMSans_400Regular",
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(42,33,24,0.06)",
    alignItems: "center",
    justifyContent: "center",
  },
  body: {
    padding: 24,
    paddingBottom: 40,
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
    marginBottom: 4,
  },
  voiceAccent: {
    color: colors.accent,
    fontWeight: "400",
  },
  ringOuter: {
    alignSelf: "center",
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: "rgba(193,127,60,0.06)",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 24,
  },
  ringMiddle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "rgba(193,127,60,0.12)",
    alignItems: "center",
    justifyContent: "center",
  },
  micBtn: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.accent,
    alignItems: "center",
    justifyContent: "center",
    elevation: 6,
    shadowColor: "#C17F3C",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  micBtnActive:  { backgroundColor: "#D4913E" },
  micBtnSuccess: { backgroundColor: colors.success ?? "#4CAF50" },
  micBtnError:   { backgroundColor: colors.danger  ?? "#E53935" },
  checkMark: {
    color: "#FFFFFF",
    fontSize: 28,
    fontWeight: "700",
  },
  hint: {
    color: colors.muted,
    fontSize: 14,
    textAlign: "center",
    fontFamily: "DMSans_400Regular",
    marginTop: -16,
    marginBottom: 24,
  },
  // Input section
  inputSection: {
    gap: 8,
    marginBottom: 20,
  },
  mainInput: {
    height: 56,
    borderWidth: 1.5,
    borderColor: colors.accent,
    borderRadius: 16,
    paddingHorizontal: 18,
    color: colors.text,
    fontSize: 17,
    fontFamily: "DMSans_400Regular",
    backgroundColor: colors.surfaceSoft ?? "rgba(193,127,60,0.04)",
  },
  inputHint: {
    color: colors.muted,
    fontSize: 13,
    fontFamily: "DMSans_400Regular",
    textAlign: "center",
    lineHeight: 20,
  },
  // Processing
  processingWrap: {
    alignItems: "center",
    paddingVertical: 8,
    gap: 12,
  },
  // Result
  feedTitle: {
    color: colors.text,
    fontSize: 15,
    fontWeight: "700",
    fontFamily: "DMSans_700Bold",
    marginBottom: 4,
  },
  modalSummary: {
    marginTop: 14,
    marginBottom: 14,
  },
  // Transcript
  transcriptBubble: {
    backgroundColor: colors.surfaceSoft ?? "rgba(193,127,60,0.06)",
    borderRadius: 12,
    padding: 14,
    marginVertical: 8,
  },
  transcriptLabel: {
    color: colors.muted,
    fontSize: 10,
    letterSpacing: 1.4,
    textTransform: "uppercase",
    fontWeight: "700",
    fontFamily: "DMSans_700Bold",
    marginBottom: 4,
  },
  transcriptText: {
    color: colors.text,
    fontSize: 15,
    fontStyle: "italic",
    fontFamily: "DMSans_400Regular",
    lineHeight: 22,
  },
  // Examples
  examplesWrap: {
    gap: 8,
    marginTop: 8,
    marginBottom: 16,
  },
  examplesLabel: {
    color: colors.muted,
    fontSize: 12,
    fontFamily: "DMSans_700Bold",
    fontWeight: "700",
    letterSpacing: 1,
    textTransform: "uppercase",
    marginBottom: 4,
  },
  exampleChip: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surfaceSoft ?? "rgba(193,127,60,0.04)",
  },
  exampleText: {
    color: colors.accent,
    fontSize: 14,
    fontFamily: "DMSans_400Regular",
  },
  // Actions
  actionCol: {
    gap: 10,
    marginTop: 8,
  },
});
