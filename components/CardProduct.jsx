import React, { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View, Modal } from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useTheme } from "react-native-paper";
import { appStore } from "../store/appStore";
import { useRouter } from "expo-router";

const CardProduct = ({ pID, pNombre, pMoneda, pPrecio_venta, pCantidad }) => {
  const myTheme = useTheme();
  const store = appStore((state) => state.store);
  const router = useRouter();
  return (
    <>
      <Pressable
        style={[
          styles.cardProduct,
          {
            backgroundColor: myTheme.colors.grayLight,
          },
        ]}
        onPress={() => {
          router.push({
            pathname: "product_info",
            params: {
              id_grupo: pID,
              name: pNombre,
              precioVenta: pPrecio_venta,
              moneda: pMoneda,
            },
          });
        }}
        onLongPress={() => {
          router.push({
            pathname: "modal/modalDeleteProductGroup",
            params: { id_grupo: pID, name: pNombre },
          });
        }}
      >
        <View
          style={[styles.box, { backgroundColor: myTheme.colors.grayForce }]}
        >
          <FontAwesome name="shopping-cart" size={62} color="white" />
        </View>
        <View style={{ flex: 1 }}>
          <View style={[styles.bodyText]}>
            <Text
              style={{
                color: myTheme.colors.textPrimary,
                fontSize: 20,
                fontWeight: "bold",
              }}
            >
              {pNombre}
            </Text>
            <Text
              style={[styles.textMoneda, { color: myTheme.colors.grayForce }]}
            >
              {pMoneda.toUpperCase()}
            </Text>
            <Text
              style={[styles.textPrice, { color: myTheme.colors.greenForce }]}
            >
              {"$"} {pPrecio_venta}
            </Text>
          </View>
        </View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: 5,
          }}
        >
          <FontAwesome
            name="circle"
            size={10}
            color={
              pCantidad > store.limitStockDown
                ? myTheme.colors.greenForce
                : myTheme.colors.redForce
            }
          />
          <Text style={{ fontSize: 20 }}>{pCantidad}</Text>
        </View>
      </Pressable>
    </>
  );
};

export default CardProduct;

const styles = StyleSheet.create({
  cardProduct: {
    width: "100%",
    height: 100,
    borderRadius: 15,
    padding: 10,
    flexDirection: "row",
  },
  box: {
    height: "100%",
    width: 80,
    borderRadius: 10,
    marginRight: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  bodyText: {
    flexDirection: "column",
    gap: 2,
  },
  textPrice: {
    fontSize: 20,
  },
  textMoneda: {
    fontSize: 20,
  },
});
