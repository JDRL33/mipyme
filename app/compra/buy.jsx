import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import React, { useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "react-native-paper";
import Feather from "@expo/vector-icons/Feather";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useLocalSearchParams, useRouter } from "expo-router";
import buyStore from "../../store/buyStore";
import CardProviderProduct from "../../components/CardProviderProduct";
import EmptyList from "../../components/EmptyList";

const buy = () => {
  const insets = useSafeAreaInsets();
  const myTheme = useTheme();
  const params = useLocalSearchParams();
  const products = buyStore((state) => state.products);
  const cleanProducts = buyStore((state) => state.cleanProducts);
  const [text, setText] = useState("");
  const [enabledSearch, setEnabledSearch] = useState(false);
  const router = useRouter();

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
        data={products}
        style={styles.flatList}
        ItemSeparatorComponent={<View style={{ height: 15 }} />}
        ListEmptyComponent={() => (
          <EmptyList text="Carrito vacio" icon="x-circle" />
        )}
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
                console.log("Comprar productos");
                cleanProducts();
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
                cleanProducts();
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
