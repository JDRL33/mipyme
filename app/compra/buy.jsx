import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import buyStore from "../../store/buyStore";
import { useTheme } from "react-native-paper";
import Feather from "@expo/vector-icons/Feather";
import EmptyList from "../../components/EmptyList";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import CardProviderProduct from "../../components/CardProviderProduct";
import { appStore } from "../../store/appStore";

const buy = () => {
  const router = useRouter();
  const myTheme = useTheme();
  const insets = useSafeAreaInsets();
  const [text, setText] = useState("");
  const params = useLocalSearchParams();
  const products = buyStore((state) => state.products);
  const productsGroups = buyStore((state) => state.productsGroups);
  const productsSearch = buyStore((state) => state.productsSearch);

  const [timeoutId, setTimeoutId] = useState(null);
  const [enabledSearch, setEnabledSearch] = useState(false);
  const cancelarCompra = buyStore((state) => state.cancelarCompra);
  const findByNameProduct = buyStore((state) => state.findByNameProduct);
  const getProductsByIdProviderStore = appStore(
    (state) => state.getProductsByIdProviderStore,
  );
  const cleanSearch = buyStore((state) => state.cleanSearch);
  const addProductsStore = appStore((state) => state.addProductsStore);
  const initStore = appStore((state) => state.initStore);
  const addProductsIndiStore = appStore((state) => state.addProductsIndiStore);

  useEffect(() => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    // esperar 400 segundos al dejar de escribir
    const id = setTimeout(async () => {
      try {
        findByNameProduct(text.toLowerCase());
      } catch (error) {
        console.error(error);
      }
    }, 400);

    setTimeoutId(id);

    return () => clearTimeout(id);
  }, [text]);

  return (
    <View
      style={[
        styles.main,
        {
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
          backgroundColor: myTheme.colors.primary,
        },
      ]}
    >
      <View style={styles.header}>
        <Text
          style={[
            styles.title,
            {
              color: myTheme.colors.textPrimary,
            },
          ]}
        >
          NUEVA COMPRA
        </Text>
        <Feather
          name="shopping-cart"
          size={40}
          color={myTheme.colors.greenForce}
        />
      </View>
      <Text style={{ fontSize: 20, textAlign: "center" }}>
        {"Comprando productos de "}
        {params.name_provider}
      </Text>

      <View
        style={[
          styles.headerTitle,
          {
            backgroundColor: myTheme.colors.grayLight,
          },
        ]}
      >
        <Text style={{ fontSize: 30 }}>Productos</Text>
        <Pressable
          onPress={() => {
            setEnabledSearch(false);
            !enabledSearch && cleanSearch();
            router.push({ pathname: "compra/addProductBuy" });
          }}
        >
          <Feather
            name="plus-circle"
            size={40}
            color={myTheme.colors.greenForce}
          />
        </Pressable>
      </View>
      <FlatList
        data={productsSearch.length > 0 ? productsSearch : products}
        style={styles.flatList}
        ItemSeparatorComponent={<View style={{ height: 15 }} />}
        ListEmptyComponent={() => (
          <EmptyList text="Carrito vacio" icon="x-circle" />
        )}
        ListFooterComponent={<View style={{ height: 20 }} />}
        renderItem={({ item }) => (
          <CardProviderProduct
            pCantidad={item.count}
            pMoneda={item.moneda}
            pNombre={item.name}
            pPrecio_costo={item.pCompra}
          />
        )}
      />
      <View style={{ marginBottom: 10, width: "100%" }}>
        {enabledSearch ? (
          <View style={{ flexDirection: "row", gap: 5 }}>
            <TextInput
              value={text}
              onChangeText={(text) => {
                setText(text);
              }}
              cursorColor={myTheme.colors.greenForce}
              selectionColor={myTheme.colors.greenLight}
              style={[
                styles.textInput,
                {
                  backgroundColor: myTheme.colors.grayLight,
                  borderBottom: myTheme.colors.blueForce,
                  color: myTheme.colors.textPrimary,
                },
              ]}
              placeholder="Buscar productos..."
              placeholderTextColor={myTheme.colors.textSecondary}
            />
            <Pressable
              style={{
                width: "20%",
                height: 50,
                borderRadius: 10,
                backgroundColor: myTheme.colors.grayForce,
                alignItems: "center",
                justifyContent: "center",
              }}
              onPress={() => {
                setEnabledSearch(!enabledSearch);
                setText("");
              }}
            >
              <FontAwesome name="save" size={30} color="black" />
            </Pressable>
          </View>
        ) : (
          <View style={{ flexDirection: "row", gap: 5, flexWrap: "wrap" }}>
            {/* Button de busqueda */}
            <Pressable
              style={[
                styles.button,
                {
                  width: "20%",
                  backgroundColor: myTheme.colors.grayForce,
                },
              ]}
              onPress={() => {
                setEnabledSearch(!enabledSearch);
                !enabledSearch && cleanSearch();
              }}
            >
              <FontAwesome name="search" size={30} color="black" />
            </Pressable>
            {/* Button de efectuar compra */}
            <Pressable
              style={[
                styles.button,
                {
                  width: "40%",
                  backgroundColor: myTheme.colors.greenLight,
                },
              ]}
              onPress={() => {
                products.forEach(async (product) => {
                  if (product.par === 0) {
                    await addProductsIndiStore(
                      product.name,
                      product.moneda,
                      product.pCompra,
                      product.count,
                      params.id_provider,
                      product.id_grupo,
                      0,
                    );
                  }
                });
                products.map((product) =>
                  productsGroups.map(async (group) => {
                    if (product.par === group.par) {
                      const id_group = await addProductsStore(
                        group.name,
                        group.moneda,
                        group.pVenta,
                        group.count,
                        0,
                        0,
                      );
                      await addProductsIndiStore(
                        product.name,
                        product.moneda,
                        product.pCompra,
                        product.count,
                        params.id_provider,
                        id_group,
                        0,
                      );
                    }
                  }),
                );
                initStore();
                cancelarCompra();
                router.back();
              }}
            >
              <Text
                style={[
                  styles.textButton,
                  { color: myTheme.colors.greenForce },
                ]}
              >
                COMPRAR
              </Text>
            </Pressable>
            {/* Button de cancelar compra */}
            <Pressable
              style={[
                styles.button,
                {
                  backgroundColor: myTheme.colors.redLight,
                  width: "36%",
                },
              ]}
              onPress={() => {
                cancelarCompra();
                router.back();
              }}
            >
              <Text
                style={[styles.textButton, { color: myTheme.colors.redForce }]}
              >
                CANCELAR
              </Text>
            </Pressable>
          </View>
        )}
      </View>
    </View>
  );
};

export default buy;

const styles = StyleSheet.create({
  main: {
    paddingHorizontal: 20,
    flex: 1,
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    justifyContent: "center",
    marginTop: 50,
  },
  title: {
    fontWeight: "bold",
    fontSize: 40,
  },
  headerTitle: {
    width: "100%",
    marginTop: 40,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
  flatList: {
    flex: 1,
    width: "100%",
    marginVertical: 20,
    paddingHorizontal: 20,
  },
  textButton: {
    fontSize: 20,
    fontWeight: "bold",
  },
  button: {
    height: 50,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  textInput: {
    height: 50,
    flex: 1,
    borderRadius: 10,
    paddingHorizontal: 20,
    fontSize: 18,
  },
});
