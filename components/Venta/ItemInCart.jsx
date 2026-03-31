import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Button, useTheme } from "react-native-paper";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import ventaStore from "../../store/ventaStore";

const ItemInCart = ({ product }) => {
  const myTheme = useTheme();
  const removeCartProductById = ventaStore(
    (state) => state.removeCartProductById,
  );
  return (
    <View
      style={{
        backgroundColor: myTheme.colors.greenLight,
        padding: 10,
        borderRadius: 5,
        flexDirection: "row",
        justifyContent: "space-between",
        flex: 1,
      }}
    >
      <View>
        <Text style={{ fontWeight: "bold" }}>{product.nombre}</Text>
        <Text>
          Precio: {product.precio} {product.moneda}
        </Text>
        <Text>Cantidad: {product.cantidad}</Text>
      </View>
      <View style={{ flexDirection: "column", gap: 3, alignItems: "center" }}>
        <Button
          style={{ backgroundColor: myTheme.colors.greenForce }}
          mode="contained"
          onPress={() => {}}
        >
          <MaterialCommunityIcons
            name="receipt-text-edit"
            size={24}
            color={myTheme.colors.greenLight}
          />
        </Button>
        <Button
          style={{ backgroundColor: myTheme.colors.redForce }}
          mode="contained"
          onPress={() => {
            removeCartProductById(product.idProductGroup);
          }}
        >
          <MaterialCommunityIcons
            name="delete-circle"
            size={24}
            color={myTheme.colors.redLight}
          />
        </Button>
      </View>
    </View>
  );
};

export default ItemInCart;

const styles = StyleSheet.create({});
