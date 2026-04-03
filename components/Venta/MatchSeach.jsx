import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import { useTheme } from "react-native-paper";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { appStore } from "../../store/appStore";
import ventaStore from "../../store/ventaStore";
import EmptyList from "../EmptyList";

const MatchSeach = () => {
  const ProductList = appStore((state) => state.productsGroupList);
  const findByNameProductGroupStore = appStore(
    (state) => state.findByNameProductGroupStore,
  );
  const Store = appStore((state) => state.store);
  const setCurrentProductEdit = ventaStore(
    (state) => state.setCurrentProductEdit,
  );
  const myTheme = useTheme();

  useState(() => {
    findByNameProductGroupStore("");
  }, []);

  return (
    <View
      style={{
        backgroundColor: myTheme.colors.grayForce,
        minHeight: 30,
        marginTop: 10,
        borderBottomRightRadius: 10,
        borderBottomLeftRadius: 10,
        padding: 10,
        position: "absolute",
        top: 150,
        left: 20,
        width: "100%",
        zIndex: 10,
        gap: 10,
        elevation: 30,
      }}
    >
      <FlatList
        data={ProductList}
        renderItem={({ item }) => (
          <Item_layout
            item={item}
            myTheme={myTheme}
            store={Store}
            setCurrentProduct={setCurrentProductEdit}
          />
        )}
        ItemSeparatorComponent={() => <View style={{ marginTop: 10 }} />}
        ListEmptyComponent={<EmptyList text="Este producto no está." />}
      />
    </View>
  );
};

function Item_layout({ item, myTheme, store, setCurrentProduct }) {
  return (
    <Pressable
      style={{
        backgroundColor: "white",
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 10,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
      }}
      onPress={() => {
        setCurrentProduct(item);
      }}
    >
      <View>
        <Text style={{ fontSize: 18 }}>{item.nombre}</Text>
        <Text style={{ fontSize: 15 }}>
          Precio: {item.precio_venta}
          {` `}
          {item.moneda} {"=>"}{" "}
          {item.moneda === "USD" && item.precio_venta * store.tasa_usd}
          {" CUP"}
        </Text>
      </View>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
        <FontAwesome
          name="circle"
          size={10}
          color={
            store.limitStockDown < item.cantidad
              ? myTheme.colors.greenForce
              : myTheme.colors.redForce
          }
        />
        <Text>{item.cantidad}</Text>
      </View>
    </Pressable>
  );
}

export default MatchSeach;

const styles = StyleSheet.create({});
