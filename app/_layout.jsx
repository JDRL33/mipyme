import { StyleSheet, Text, View } from "react-native";
import { Stack, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { PaperProvider, useTheme } from "react-native-paper";
import theme from "../theme/theme";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { initDatabase } from "../database/database";
import { useEffect, useState } from "react";
import { appStore } from "../store/appStore";

const Layuot = () => {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const initStore = appStore((state) => state.initStore);
  const [start, setStart] = useState(false);

  useEffect(() => {
    const init = async () => {
      await initDatabase().finally(() => {
        setStart(true);
      });
      await initStore().finally(() => {});
    };
    init();
  }, []);
  !start &&
    Toast.show({
      type: "info",
      text1: "Cargando",
      position: "top",
    });
  return (
    <View style={{ flex: 1 }}>
      <StatusBar hidden />
      <PaperProvider theme={theme}>
        {start && (
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
        )}
      </PaperProvider>
      <Toast position="top" avoidKeyboard />
    </View>
  );
};

export default Layuot;

const styles = StyleSheet.create({});
