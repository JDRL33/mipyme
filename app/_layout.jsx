import { StyleSheet, Text, View } from "react-native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { PaperProvider } from "react-native-paper";
import theme from "../theme/theme";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const Layuot = () => {
  const insets = useSafeAreaInsets();
  return (
    <View style={{ flex: 1 }}>
      <StatusBar hidden />
      <PaperProvider theme={theme}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

          <Stack.Screen
            name="(proveedor)/[id]"
            options={{ animation: "slide_from_bottom" }}
          />

          {/* PANTALLAS MODALES */}
          <Stack.Screen
            name="(modal)/[name]"
            options={{
              presentation: "modal",
              animation: "slide_from_bottom",
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="modalCreateProduct"
            options={{
              presentation: "modal",
              animation: "slide_from_bottom",
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="modalCreateProvider"
            options={{
              presentation: "modal",
              animation: "slide_from_bottom",
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="modalDeleteProvider"
            options={{
              presentation: "modal",
              animation: "slide_from_bottom",
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="modalCreateClient"
            options={{
              presentation: "modal",
              animation: "slide_from_bottom",
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="modalTasaCambio"
            options={{
              presentation: "modal",
              animation: "fade_from_bottom",
              headerShown: false,
            }}
          />
        </Stack>
      </PaperProvider>
    </View>
  );
};

export default Layuot;

const styles = StyleSheet.create({});
