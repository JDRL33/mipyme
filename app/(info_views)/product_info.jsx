import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useTheme } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { getProductsByIdProductGroup } from "../../database/database";
import { appStore } from "../../store/appStore";

const product_info = () => {
  const myTheme = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams();
  const [products, setProducts] = React.useState([]);
  const [cTotal, setCTotal] = React.useState(0);
  const [gananciaTotal, setGananciaTotal] = React.useState(0);
  const [providers, setProviders] = React.useState([]);
  const getProvidersByIdStore = appStore(
    (state) => state.getProvidersByIdStore,
  );
  const store = appStore((state) => state.store);
  const productsIndis = appStore((state) => state.productsIndis);

  React.useEffect(() => {
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
  }, [productsIndis]);
  React.useEffect(() => {
    products.map((p) => {
      const cal = p.precio_costo * p.cantidad;
      setCTotal((prev) => prev + parseFloat(cal.toFixed(2)));
    });

    products.map((p) => {
      const cal = (params.precioVenta - p.precio_costo) * p.cantidad;
      setGananciaTotal((prev) => prev + parseFloat(cal.toFixed(2)));
    });
  }, [products]);

  return (
    <View
      style={{
        flex: 1,
        paddingTop: insets.top,
        backgroundColor: myTheme.colors.primary,
        paddingHorizontal: 20,
      }}
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
          style={{
            color: myTheme.colors.greenForce,
            fontSize: 32,
            textAlign: "center",
            marginTop: 20,
          }}
        >
          ${params.precioVenta * store.tasa_usd} {"CUP"}
        </Text>
      )}
      <Text
        style={{
          color: myTheme.colors.greenForce,
          fontSize: 32,
          textAlign: "center",
          marginTop: 5,
        }}
      >
        ${params.precioVenta} {params.moneda.toUpperCase()}
      </Text>
      <Text
        style={{
          color: myTheme.colors.textSecondary,
          fontSize: 20,
          textAlign: "center",
          marginBottom: 30,
        }}
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
          Cobro total: ${cTotal} {params.moneda.toUpperCase()}
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
          Ganancia total: ${gananciaTotal} {params.moneda.toUpperCase()}
        </Text>
      </View>
      <Text
        style={{
          color: myTheme.colors.textSecondary,
          fontSize: 18,
          textAlign: "center",
          marginTop: 50,
        }}
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
            onLongPress={() => {
              router.push({
                pathname: "modal/modalDeleteProductIndi",
                params: {
                  id_provider: item.id_proveedor,
                  idProductI: item.id,
                  name: item.nombre,
                },
              });
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

const styles = StyleSheet.create({});
