import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { getProductsByIdProductGroup } from "../../database/database";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { Stack, useLocalSearchParams } from "expo-router";
import { appStore } from "../../store/appStore";
import { useTheme } from "react-native-paper";
import React, { useEffect, useState } from "react";

const product_info = () => {
  // CONSTANTES NECESARIAS
  const myTheme = useTheme();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams();

  // USESTATES
  const [products, setProducts] = useState([]);
  const [providers, setProviders] = useState([]);

  // STATE GLOBALES
  const productsIndis = appStore((state) => state.productsIndis);
  const store = appStore((state) => state.store);
  const getProvidersByIdStore = appStore(
    (state) => state.getProvidersByIdStore,
  );

  useEffect(() => {
    let mounted = true;
    const fetchProductsAndProviders = async () => {
      const product = await getProductsByIdProductGroup(params.id_grupo);
      if (mounted) setProducts(product);

      product.map(async (p) => {
        const provider = await getProvidersByIdStore(p.id_proveedor);
        if (mounted) setProviders((prev) => [...prev, provider]);
      });
    };
    fetchProductsAndProviders();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <View
      style={[
        {
          paddingTop: insets.top,
          backgroundColor: myTheme.colors.primary,
        },
        styles.parent,
      ]}
    >
      <Stack.Screen
        options={{
          headerStyle: { backgroundColor: myTheme.colors.greenLight },
          title: params.name,
          headerTitleStyle: { color: myTheme.colors.greenForce },
          headerBackIconTintColor: myTheme.colors.greenForce,
        }}
      />
      {params.moneda === "USD" && (
        <Text
          style={[
            {
              color: myTheme.colors.greenForce,
            },
            styles.cambio,
          ]}
        >
          ${params.precioVenta * store.tasa_usd} {"CUP"}
        </Text>
      )}
      <Text
        style={[
          {
            color: myTheme.colors.greenForce,
          },
          styles.price,
        ]}
      >
        ${params.precioVenta} {params.moneda.toUpperCase()}
      </Text>
      <Text
        style={[
          {
            color: myTheme.colors.textSecondary,
          },
          styles.label,
        ]}
      >
        Precio de Venta
      </Text>
      <View
        style={{
          marginTop: 20,
          flexDirection: "row",
          gap: 10,
        }}
      >
        <FontAwesome5
          name="money-bill-wave"
          size={24}
          color={myTheme.colors.greenForce}
        />
        <Text style={{ color: myTheme.colors.textPrimary, fontSize: 20 }}>
          Cobro total: ${parseFloat(params.cTotal).toFixed(2)}{" "}
          {params.moneda.toUpperCase()}
        </Text>
      </View>
      <View
        style={{
          marginTop: 5,
          flexDirection: "row",
          gap: 10,
        }}
      >
        <FontAwesome5
          name="money-bill-wave"
          size={24}
          color={myTheme.colors.greenForce}
        />
        <Text style={{ color: myTheme.colors.textPrimary, fontSize: 20 }}>
          Ganancia total: ${parseFloat(params.gTotal).toFixed(2)}{" "}
          {params.moneda.toUpperCase()}
        </Text>
      </View>
      <Text
        style={[
          {
            color: myTheme.colors.textSecondary,

            marginTop: 50,
          },
          styles.label,
        ]}
      >
        Proveedores
      </Text>
      <FlatList
        data={products}
        style={{ marginTop: 20 }}
        ItemSeparatorComponent={<View style={{ height: 15 }} />}
        renderItem={({ item }) => (
          <Pressable
            style={{
              padding: 10,
              backgroundColor: myTheme.colors.grayLight,
              borderRadius: 10,
            }}
          >
            <Text style={{ color: myTheme.colors.textPrimary, fontSize: 18 }}>
              {providers.find((prov) => prov.id_proveedor === item.id_proveedor)
                ?.nombre || "Proveedor no encontrado"}
            </Text>
            <Text style={{ color: myTheme.colors.textSecondary, fontSize: 14 }}>
              Precio de compra: ${item.precio_costo} {item.moneda.toUpperCase()}{" "}
              - Cantidad: {item.cantidad}
            </Text>
          </Pressable>
        )}
      />
    </View>
  );
};

export default product_info;

const styles = StyleSheet.create({
  parent: {
    flex: 1,
    paddingHorizontal: 20,
  },
  cambio: {
    fontSize: 32,
    textAlign: "center",
    marginTop: 20,
  },
  price: {
    fontSize: 32,
    textAlign: "center",
    marginTop: 5,
  },
  label: {
    fontSize: 18,
    textAlign: "center",
    marginTop: 5,
  },
});
