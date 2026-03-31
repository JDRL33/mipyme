import { StyleSheet, Text, View } from "react-native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { PaperProvider } from "react-native-paper";
import theme from "../theme/theme";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

const Layuot = () => {
  const insets = useSafeAreaInsets();
  return (
    <View style={{ flex: 1 }}>
      <StatusBar hidden />
      <PaperProvider theme={theme}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen
            name="(info_views)/provider_info"
            options={{ animation: "slide_from_bottom" }}
          />
          <Stack.Screen
            name="venta/newVenta"
            options={{ animation: "slide_from_bottom", headerShown: false }}
          />
          <Stack.Screen
            name="compra/buy"
            options={{ animation: "slide_from_bottom", headerShown: false }}
          />
          <Stack.Screen
            name="compra/addProductBuy"
            options={{ animation: "slide_from_bottom", headerShown: false }}
          />
          {/* PANTALLAS MODALES */}
          <Stack.Screen
            name="modal/modalDeleteProductIndi"
            options={{
              presentation: "modal",
              animation: "slide_from_bottom",
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="modal/modalDeleteProductGroup"
            options={{
              presentation: "modal",
              animation: "slide_from_bottom",
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="modal/modalCreateProvider"
            options={{
              presentation: "modal",
              animation: "slide_from_bottom",
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="modal/modalDeleteProvider"
            options={{
              presentation: "modal",
              animation: "slide_from_bottom",
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="modal/modalCreateClient"
            options={{
              presentation: "modal",
              animation: "slide_from_bottom",
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="modal/modalTasaCambio"
            options={{
              presentation: "modal",
              animation: "fade_from_bottom",
              headerShown: false,
            }}
          />
        </Stack>
      </PaperProvider>
      <Toast position="top" avoidKeyboard />
    </View>
  );
};

export default Layuot;

const styles = StyleSheet.create({});
