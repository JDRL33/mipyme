import {
  Button,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { appStore } from "../../store/appStore";
import { useTheme } from "react-native-paper";
import InfoProviderText from "../../components/InfoProviderText";
import EmptyList from "../../components/EmptyList";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import CardProviderProduct from "../../components/CardProviderProduct";
import { getProviderById } from "../../database/database";
import FabButton from "../../components/FabButton";

const ProveedorInfo = () => {
  const { id } = useLocalSearchParams();
  const productsIndis = appStore((state) => state.productsIndis);
  const getProductsByIdProviderStore = appStore(
    (state) => state.getProductsByIdProviderStore,
  );
  const findByNameProductIndiStore = appStore(
    (state) => state.findByNameProductIndiStore,
  );
  const myTheme = useTheme();
  const insets = useSafeAreaInsets();
  const [provider, setProvider] = useState({});
  const [text, setText] = useState("");
  const [timeoutId, setTimeoutId] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const getProvider = async () => {
      const response = await getProviderById(id);
      setProvider(response);
    };
    getProvider();
    getProductsByIdProviderStore(id);
  }, []);

  useEffect(() => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    // esperar 400 segundos al dejar de escribir
    const idTO = setTimeout(async () => {
      try {
        await findByNameProductIndiStore(id, text.toLowerCase());
      } catch (error) {
        console.error(error);
      }
    }, 400);

    setTimeoutId(idTO);

    return () => clearTimeout(idTO);
  }, [text]);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: myTheme.colors.primary,
        paddingTop: 10,
        paddingHorizontal: 20,
        paddingBottom: insets.bottom,
      }}
    >
      <Stack.Screen
        options={{
          title: provider.nombre,
        }}
      />
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 6 }}>
        <View
          style={{
            padding: 10,
            backgroundColor: myTheme.colors.redLight,
            borderRadius: 10,
            width: "49%",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text
            style={{
              color: myTheme.colors.redForce,
              fontWeight: "bold",
              fontSize: 20,
            }}
          >
            ${provider.a_pagar}
          </Text>
          <Text
            style={{
              color: myTheme.colors.textSecondary,
              fontSize: 18,
            }}
          >
            PAGO PENDIENTE
          </Text>
        </View>
        <View
          style={{
            padding: 10,
            backgroundColor: myTheme.colors.greenLight,
            borderRadius: 10,
            width: "49%",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text
            style={{
              color: myTheme.colors.greenForce,
              fontWeight: "bold",
              fontSize: 20,
            }}
          >
            ${provider.pagado}
          </Text>
          <Text
            style={{
              color: myTheme.colors.textSecondary,
              fontSize: 18,
            }}
          >
            TOTAL PAGADO
          </Text>
        </View>
      </View>
      <View style={{ gap: 5, marginTop: 10 }}>
        <InfoProviderText
          textPrimary="Cantidad de productos:"
          textSecondary={provider.cantidad_productos}
        />
        <InfoProviderText
          textPrimary="Ganancias:"
          textSecondary="Pendiente a funcion !!!!!!"
        />
        <InfoProviderText
          textPrimary="Productos en bajo Stock:"
          textSecondary="Pendiente!!!"
        />
        <InfoProviderText
          textPrimary="Ultima entrada:"
          textSecondary="Pendiente!!!"
        />
      </View>
      <View
        style={{
          flexDirection: "row",
          gap: 10,
          alignItems: "center",
          marginTop: 25,
          marginBottom: 20,
        }}
      >
        <Text
          style={{
            fontSize: 20,
            textAlign: "center",
            fontWeight: "bold",
          }}
        >
          PRODUCTOS
        </Text>
        <TextInput
          value={text}
          onChangeText={(text) => {
            setText(text);
          }}
          cursorColor={myTheme.colors.blueForce}
          selectionColor={myTheme.colors.blueLight}
          style={{
            flex: 1,
            borderRadius: 20,
            backgroundColor: myTheme.colors.grayLight,
            borderBottom: myTheme.colors.blueForce,
            color: myTheme.colors.textPrimary,
            height: 50,
            paddingHorizontal: 20,
          }}
          placeholder="Buscar productos..."
          placeholderTextColor={myTheme.colors.textSecondary}
        />
      </View>
      <FlatList
        data={productsIndis}
        ItemSeparatorComponent={<View style={{ height: 15 }} />}
        ListEmptyComponent={() => (
          <EmptyList text="Stock vacio" icon="x-circle" />
        )}
        ListFooterComponent={<View style={{ height: 70 }} />}
        renderItem={({ item }) => (
          <CardProviderProduct
            key={item.id}
            pId={item.id}
            pIdProvider={id}
            pNombre={item.nombre}
            pMoneda={item.moneda}
            pPrecio_costo={item.precio_costo}
            pCantidad={item.cantidad}
          />
        )}
      />
      <FabButton
        paperIcon="account-cash"
        onClick={() => {
          router.navigate({
            pathname: "compra/buy",
            params: { id_provider: id, name_provider: provider.nombre },
          });
        }}
      />
    </View>
  );
};

export default ProveedorInfo;

const styles = StyleSheet.create({});
