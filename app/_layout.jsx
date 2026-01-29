import { StyleSheet, Text, View } from "react-native";
import { Stack } from "expo-router";
import { ToolsBar } from "../devTools/components/toolsBar";
import { StatusBar } from "expo-status-bar";
import { PaperProvider } from "react-native-paper";
import theme from "../theme/theme";

const Layuot = () => {
  return (
    <View style={{ flex: 1 }}>
      <PaperProvider theme={theme}>
        <StatusBar style="auto" />
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

          {/* PANTALLAS MODALES */}
          <Stack.Screen
            name="modalCreateProvider"
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

        <ToolsBar show="none" />
      </PaperProvider>
    </View>
  );
};

export default Layuot;

const styles = StyleSheet.create({});
