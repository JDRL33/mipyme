import { StyleSheet, Text, TextInput, View } from "react-native";
import React, { useState } from "react";
import { Button, useTheme } from "react-native-paper";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import ventaStore from "../../store/ventaStore";
import { appStore } from "../../store/appStore";

const ItemEdit = ({ setText }) => {
  const myTheme = useTheme();
  const currentProduct = ventaStore((state) => state.currentProductEdit);
  const store = appStore((state) => state.store);
  const addCartProduct = ventaStore((state) => state.addCartProduct);
  const setCurrentProductEdit = ventaStore(
    (state) => state.setCurrentProductEdit,
  );

  const [cant, setCant] = useState(0);
  return (
    <View
      style={{
        backgroundColor: myTheme.colors.greenLight,
        padding: 20,
        marginVertical: 10,
        borderRadius: 10,
        shadowRadius: 10,
        shadowOpacity: 0.1,
      }}
    >
      {/* TOP */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Text style={{ fontSize: 18, fontWeight: "bold" }}>
          {currentProduct.nombre}
        </Text>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
          <FontAwesome
            name="circle"
            size={10}
            color={
              currentProduct.cantidad > store.limitStockDown
                ? myTheme.colors.greenForce
                : myTheme.colors.redForce
            }
          />
          <Text>{currentProduct.cantidad}</Text>
        </View>
      </View>
      <Text style={{ fontSize: 15 }}>
        Precio: {currentProduct.precio_venta}
        {` `}
        {currentProduct.moneda}
      </Text>
      <Text style={{ fontSize: 15, marginBottom: 10 }}>
        {currentProduct.moneda === "USD" &&
          "Cambio: " + currentProduct.precio_venta * store.tasa_usd + " CUP"}
      </Text>
      {/* <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          gap: 5,
          marginBottom: 10,
        }}
      >
        <Checkbox />
        <Text style={{ fontSize: 17 }}>Descuento</Text>
        <TextInput
          style={{
            backgroundColor: "white",
            paddingVertical: 7,
            paddingLeft: 10,
            borderRadius: 10,
            width: 150,
          }}
          placeholder="De 3 a 5 USD"
          placeholderTextColor={myTheme.colors.grayForce}
        />
      </View> */}
      {/* Seleccion de moneda */}
      <View></View>
      {/* Seleccion de Cantidad */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Button
          style={{
            backgroundColor: myTheme.colors.redLight,
            borderRadius: 10,
          }}
          onPress={() => {
            if (cant - 1 >= 0) setCant(cant - 1);
          }}
        >
          <Text style={{ color: myTheme.colors.redForce, fontWeight: "bold" }}>
            <FontAwesome
              name="minus"
              size={24}
              color={myTheme.colors.redForce}
            />
          </Text>
        </Button>
        <TextInput
          aria-valuemax={currentProduct.cantidad}
          aria-valuemin={0}
          value={cant.toString()}
          onChangeText={(text) =>
            text >= 0 && text <= currentProduct.cantidad && setCant(text)
          }
          style={{
            backgroundColor: "white",
            marginHorizontal: 15,
            flex: 0.5,
            borderRadius: 10,
            fontSize: 20,
            textAlign: "center",
          }}
          keyboardType="numeric"
          placeholder="0"
          placeholderTextColor={myTheme.colors.grayForce}
          cursorColor={myTheme.colors.greenForce}
        />
        <Button
          onPress={() => {
            if (cant + 1 <= currentProduct.cantidad) setCant(cant + 1);
          }}
          style={{
            backgroundColor: myTheme.colors.greenForce,
            borderRadius: 10,
          }}
        >
          <FontAwesome
            name="plus"
            size={24}
            color={myTheme.colors.greenLight}
          />
        </Button>
      </View>
      {/* Buttons Confirm and Cancel */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 5,
          marginTop: 20,
        }}
      >
        <Button
          style={{ backgroundColor: myTheme.colors.greenForce, flex: 1 }}
          onPress={() => {
            const newProductCart = {
              idProductGroup: currentProduct.id_grupo,
              nombre: currentProduct.nombre,
              precio: currentProduct.precio_venta,
              moneda: currentProduct.moneda,
              cantidad: cant,
            };
            addCartProduct(newProductCart);
            setCurrentProductEdit(null);
            setText("");
          }}
        >
          <Text>
            <FontAwesome
              name="check"
              size={24}
              color={myTheme.colors.greenLight}
            />
          </Text>
        </Button>
        <Button
          style={{ backgroundColor: myTheme.colors.redLight, flex: 1 }}
          onPress={() => setCurrentProductEdit(null)}
        >
          <Text>❌</Text>
        </Button>
      </View>
    </View>
  );
};

export default ItemEdit;

const styles = StyleSheet.create({});
