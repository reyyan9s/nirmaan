import React from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import {
  useFonts as useDMSans,
  DMSans_400Regular,
  DMSans_500Medium,
  DMSans_700Bold,
} from "@expo-google-fonts/dm-sans";
import {
  useFonts as useFraunces,
  Fraunces_300Light,
  Fraunces_400Regular,
} from "@expo-google-fonts/fraunces";
import { NavigationContainer } from "@react-navigation/native";
import { AppProvider, useAppContext } from "./src/context/AppContext";
import { AppNavigator } from "./src/navigation/AppNavigator";
import { Header } from "./src/components/layout/Header";
import { AppContainer } from "./src/components/layout/AppContainer";
import { InvoiceModal } from "./src/components/feedback/InvoiceModal";
import { Toast } from "./src/components/feedback/Toast";

function GlobalModals() {
  const {
    invoiceOpen,
    setInvoiceOpen,
    supplierName,
    setSupplierName,
    invoiceItems,
    setInvoiceItems,
    invoiceQuantity,
    setInvoiceQuantity,
    invoiceTotal,
    setInvoiceTotal,
    toast,
    showToast,
  } = useAppContext();

  return (
    <>
      <InvoiceModal
        visible={invoiceOpen}
        onClose={() => setInvoiceOpen(false)}
        supplierName={supplierName}
        invoiceItems={invoiceItems}
        invoiceQuantity={invoiceQuantity}
        invoiceTotal={invoiceTotal}
        setSupplierName={setSupplierName}
        setInvoiceItems={setInvoiceItems}
        setInvoiceQuantity={setInvoiceQuantity}
        setInvoiceTotal={setInvoiceTotal}
        onConfirm={() => {
          setInvoiceOpen(false);
          showToast(`Expense added: ${supplierName} invoice booked for ${invoiceTotal}.`);
        }}
        onSaveDraft={() => {
          setInvoiceOpen(false);
          showToast(`Draft saved: ${supplierName} invoice (${invoiceTotal}) stored for later review.`);
        }}
      />
      <Toast message={toast} />
    </>
  );
}

function MainApp() {
  const [dmSansLoaded] = useDMSans({
    DMSans_400Regular,
    DMSans_500Medium,
    DMSans_700Bold,
  });
  const [frauncesLoaded] = useFraunces({
    Fraunces_300Light,
    Fraunces_400Regular,
  });

  if (!dmSansLoaded || !frauncesLoaded) {
    return (
      <View style={styles.loadingScreen}>
        <ActivityIndicator size="large" color="#C4793A" />
      </View>
    );
  }

  return (
    <AppProvider>
      <NavigationContainer>
        <AppContainer>
          <Header />
          <AppNavigator />
          <GlobalModals />
        </AppContainer>
      </NavigationContainer>
    </AppProvider>
  );
}

export default MainApp;

const styles = StyleSheet.create({
  loadingScreen: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FAF7F2",
  },
});
