import { FlatList, StyleSheet, Text, TextInput, View } from "react-native";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import CardProviderProduct from "../../components/CardProviderProduct";
import {
  Stack,
  useFocusEffect,
  useLocalSearchParams,
  useRouter,
} from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import InfoProviderText from "../../components/InfoProviderText";
import FabButton from "../../components/FabButton";
import EmptyList from "../../components/EmptyList";
import { appStore } from "../../store/appStore";
import { useTheme } from "react-native-paper";
import parseDMY from "../../tools/parseDMY";

const ProveedorInfo = () => {
  // NAVEGATION
  const { id } = useLocalSearchParams();
  const router = useRouter();

  // NECESARY CONSTANS
  const insets = useSafeAreaInsets();
  const myTheme = useTheme();

  // USE STATES

  const [timeoutId, setTimeoutId] = useState(null);
  const [provider, setProvider] = useState({});
  const [text, setText] = useState("");

  // GLOBAL STATES
  const store = appStore((state) => state.store);
  const productsInDeuda = appStore((state) => state.productsInDeuda);
  const productsGroupList = appStore((state) => state.productsGroupList);
  const productsIndis = appStore((state) => state.productsIndis);
  const getProductsByIdProviderStore = appStore(
    (state) => state.getProductsByIdProviderStore,
  );
  const getProvidersByIdStore = appStore(
    (state) => state.getProvidersByIdStore,
  );
  const findByNameProductIndiStore = appStore(
    (state) => state.findByNameProductIndiStore,
  );

  const getGanancia = useCallback(() => {
    let ganancia_CUP = 0;
    let ganancia_USD = 0;
    let inDeuda_CUP = 0;
    let inDeuda_USD = 0;
    productsInDeuda.length > 0 &&
      productsInDeuda.map((item) => {
        if (item.id_provider == id) {
          if (
            item.moneda_CP.toLowerCase() === "cup" &&
            item.moneda_SP.toLowerCase() === "cup"
          ) {
            inDeuda_CUP += (item.sale_price - item.cost_price) * item.amount;
          } else if (
            item.moneda_CP.toLowerCase() === "usd" &&
            item.moneda_SP.toLowerCase() === "cup"
          ) {
            inDeuda_CUP +=
              (item.sale_price * store.tasa_usd - item.cost_price) *
              item.amount;
          } else if (
            item.moneda_CP.toLowerCase() === "cup" &&
            item.moneda_SP.toLowerCase() === "usd"
          ) {
            inDeuda_CUP +=
              (item.sale_price - item.cost_price * store.tasa_usd) *
              item.amount;
          } else if (
            item.moneda_CP.toLowerCase() === "usd" &&
            item.moneda_SP.toLowerCase() === "usd"
          ) {
            inDeuda_USD += (item.sale_price - item.cost_price) * item.amount;
          }
        }
      });
    productsIndis.map((product) => {
      if (product.id_proveedor == id) {
        productsGroupList.map((productGroup) => {
          if (productGroup.id_grupo === product.id_grupo) {
            if (
              productGroup.moneda.toLowerCase() === "cup" &&
              product.moneda.toLowerCase() === "cup"
            ) {
              ganancia_CUP +=
                (productGroup.precio_venta - product.precio_costo) *
                product.cantidad;
            } else if (
              productGroup.moneda.toLowerCase() === "usd" &&
              product.moneda.toLowerCase() === "cup"
            ) {
              ganancia_CUP +=
                (productGroup.precio_venta * store.tasa_usd -
                  product.precio_costo) *
                product.cantidad;
            } else if (
              productGroup.moneda.toLowerCase() === "cup" &&
              product.moneda.toLowerCase() === "usd"
            ) {
              ganancia_CUP +=
                (productGroup.precio_venta -
                  product.precio_costo * store.tasa_usd) *
                product.cantidad;
            } else if (
              productGroup.moneda.toLowerCase() === "usd" &&
              product.moneda.toLowerCase() === "usd"
            ) {
              ganancia_USD +=
                (productGroup.precio_venta - product.precio_costo) *
                product.cantidad;
            }
          }
        });
      }
    });
    return {
      ganancia_CUP: (ganancia_CUP + inDeuda_CUP).toFixed(2),
      ganancia_USD: (ganancia_USD + inDeuda_USD).toFixed(2),
    };
  }, [productsInDeuda, store.tasa_usd, id]);

  const getProductsStockDown = useCallback(() => {
    let amount = 0;
    productsIndis.map((product) => {
      if (product.id_proveedor == id) {
        product.cantidad <= store.limitStockDown && amount++;
      }
    });
    return amount;
  }, [productsIndis, store.limitStockDown]);

  useFocusEffect(
    useCallback(() => {
      const getProvider = async () => {
        const response = await getProvidersByIdStore(id);
        setProvider(response);
      };
      getProvider();
      getProductsByIdProviderStore(id);
    }, []),
  );

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

  const LastDateEntry = useMemo(() => {
    const order =
      productsIndis.length > 0 &&
      productsIndis.sort(
        (a, b) => parseDMY(b.dateOfBuy) - parseDMY(a.dateOfBuy),
      );
    return productsIndis.length > 0 ? order[order.length - 1].dateOfBuy : "N/A";
  }, [productsIndis]);

  return (
    <View
      style={[
        {
          backgroundColor: myTheme.colors.primary,
          paddingBottom: insets.bottom,
        },
        styles.parent,
      ]}
    >
      <Stack.Screen
        options={{
          title: provider.nombre,
        }}
      />
      <View style={styles.infoContainer}>
        <View
          style={[
            {
              backgroundColor: myTheme.colors.redLight,
            },
            styles.infoCard,
          ]}
        >
          <View style={{ flexDirection: "column" }}>
            <Text
              style={[
                {
                  color: myTheme.colors.redForce,
                },
                styles.infoCardTextPrimary,
              ]}
            >
              ${parseFloat(provider.a_pagar_CUP).toFixed(2)}
              {" CUP"}
            </Text>
            <Text
              style={[
                {
                  color: myTheme.colors.redForce,
                },
                styles.infoCardTextPrimary,
              ]}
            >
              ${parseFloat(provider.a_pagar_USD).toFixed(2)}
              {" USD"}
            </Text>
          </View>
          <Text
            style={[
              {
                color: myTheme.colors.textSecondary,
              },
              styles.infoCardTextSecondary,
            ]}
          >
            PAGO PENDIENTE
          </Text>
        </View>
        <View
          style={[
            {
              backgroundColor: myTheme.colors.greenLight,
            },
            styles.infoCard,
          ]}
        >
          <View style={{ flexDirection: "column" }}>
            <Text
              style={[
                {
                  color: myTheme.colors.greenForce,
                },
                styles.infoCardTextPrimary,
              ]}
            >
              ${parseFloat(provider.pagado_CUP).toFixed(2)}
              {" CUP"}
            </Text>
            <Text
              style={[
                {
                  color: myTheme.colors.greenForce,
                },
                styles.infoCardTextPrimary,
              ]}
            >
              ${parseFloat(provider.pagado_USD).toFixed(2)}
              {" USD"}
            </Text>
          </View>
          <Text
            style={[
              {
                color: myTheme.colors.textSecondary,
              },
              styles.infoCardTextSecondary,
            ]}
          >
            TOTAL PAGADO
          </Text>
        </View>
      </View>
      <View style={styles.statsContent}>
        <InfoProviderText
          textPrimary="Cantidad de productos:"
          textSecondary={provider.cantidad_productos}
        />
        <InfoProviderText
          textPrimary="Ganancias:"
          textSecondary={`$${getGanancia().ganancia_CUP} CUP - $${getGanancia().ganancia_USD} USD`}
        />
        <InfoProviderText
          textPrimary="Productos en bajo Stock:"
          textSecondary={getProductsStockDown()}
        />
        <InfoProviderText
          textPrimary="Ultima entrada:"
          textSecondary={productsIndis.length > 0 ? LastDateEntry : "N/A"}
        />
      </View>
      <View style={styles.viewProducts}>
        <Text style={styles.viewProductsTitle}>PRODUCTOS</Text>
        <TextInput
          value={text}
          onChangeText={(text) => {
            setText(text);
          }}
          cursorColor={myTheme.colors.blueForce}
          selectionColor={myTheme.colors.blueLight}
          style={[
            {
              backgroundColor: myTheme.colors.grayLight,
              borderBottom: myTheme.colors.blueForce,
              color: myTheme.colors.textPrimary,
            },
            styles.textInputStyle,
          ]}
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
        paperIcon="acamount-cash"
        onClick={() => {
          router.replace({
            pathname: "compra/buy",
            params: { id_provider: id, name_provider: provider.nombre },
          });
        }}
      />
    </View>
  );
};

export default ProveedorInfo;

export const styles = StyleSheet.create({
  parent: {
    flex: 1,
    paddingTop: 10,
    paddingHorizontal: 20,
  },
  infoContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  infoCard: {
    padding: 10,
    width: "49%",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  infoCardTextPrimary: {
    fontWeight: "bold",
    fontSize: 20,
  },
  infoCardTextSecondary: { fontSize: 18 },
  statsConstent: { gap: 5, marginTop: 10 },
  viewProducts: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    marginTop: 25,
    marginBottom: 20,
  },
  textInputStyle: {
    flex: 1,
    borderRadius: 20,
    height: 50,
    paddingHorizontal: 20,
  },
});
