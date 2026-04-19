import { StyleSheet, Text, View } from "react-native";
import { Stack, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { PaperProvider, useTheme } from "react-native-paper";
import theme from "../theme/theme";
import Toast from "react-native-toast-message";

const Layuot = () => {
  return (
    <View style={styles.parent}>
      <StatusBar hidden />
      <PaperProvider theme={theme}>
        <Stack>
          {/* SCREEN INICIAL */}
          <Stack.Screen name="index" options={screenOptions} />
          {/* TABS DONDE ESTA LA PANTALLA HOME */}
          <Stack.Screen name="(tabs)" options={screenOptions} />
          {/* SCREEN DE INFORMACION DEL PROVEEDOR */}
          <Stack.Screen
            name="(info_views)/provider_info"
            options={screenInformationOptions}
          />
          {/* SCREEN DE LA INFORMACION DEL PRODUCTO */}
          <Stack.Screen
            name="(info_views)/product_info"
            options={screenInformationOptions}
          />
          {/* SCREEN DE LA INFORMACION DEL CLIENTE */}
          <Stack.Screen
            name="(info_views)/client_info"
            options={[screenInformationOptions, { presentation: "formSheet" }]}
          />
          {/* SCREEN DE LA VENTA DE PRODUCTOS */}
          <Stack.Screen name="venta/newVenta" options={screenOptions} />
          {/* SCREEN DE LA COMPRA DE PRODUCTOS A LOS PROVEEDORES */}
          <Stack.Screen name="compra/buy" options={screenOptions} />
          {/* SCREEN PARA ANIADIR LOS PRODUCTOS QUE SE VAN A COMPRAR AL LISTADO DE COMPRA */}
          <Stack.Screen name="compra/addProductBuy" options={screenOptions} />

          {/* PANTALLAS MODALES */}
          <Stack.Screen
            name="modal/modalDeleteProductIndi"
            options={modalOptions}
          />
          <Stack.Screen
            name="modal/modalDeleteProductGroup"
            options={modalOptions}
          />
          <Stack.Screen
            name="modal/modalCreateProvider"
            options={modalOptions}
          />
          <Stack.Screen
            name="modal/modalDeleteProvider"
            options={modalOptions}
          />
          <Stack.Screen name="modal/modalCreateClient" options={modalOptions} />
          <Stack.Screen name="modal/modalTasaCambio" options={modalOptions} />
        </Stack>
      </PaperProvider>
      <Toast position="top" avoidKeyboard />
    </View>
  );
};

export default Layuot;

const screenOptions = { animation: "fade", headerShown: false };
const screenInformationOptions = { animation: "fade", headerShown: true };
const modalOptions = {
  presentation: "modal",
  animation: "slide_from_bottom",
  headerShown: false,
};

const styles = StyleSheet.create({
  parent: { flex: 1 },
});
