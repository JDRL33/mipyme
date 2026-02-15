import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Link, useNavigation } from "expo-router";
import Feather from "@expo/vector-icons/Feather";
import { useTheme } from "react-native-paper";
import { appStore } from "../../store/appStore";
import React, { useState } from "react";
import ButtonsModal from "../../components/ButtonsModal";

const modalCreateProduct = () => {
  const myTheme = useTheme();
  const insets = useSafeAreaInsets();
  const [nombre, setNombre] = useState("");
  const [moneda, setMoneda] = useState("");
  const [precioVenta, setPrecioVenta] = useState(0);
  const navigate = useNavigation();
  const addProductsStore = appStore((state) => state.addProductsStore);

  const handleSave = async () => {
    if (nombre.trim() && moneda.trim() && precioVenta > 0) {
      await addProductsStore(
        nombre.trim(),
        moneda.trim(),
        precioVenta,
        0, //cantidad
        0, //ganancia
        0, //cobro total
      );
      navigate.goBack();
    }
  };

  return (
    <View
      style={{
        paddingTop: insets.top,
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: myTheme.colors.primary,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 20,
          marginBottom: 40,
        }}
      >
        <Feather
          name="shopping-cart"
          size={36}
          color={myTheme.colors.greenForce}
        />
        <Text style={{ fontSize: 36, fontWeight: "bold" }}>Nuevo Producto</Text>
      </View>
      <TextInput
        value={nombre}
        onChangeText={(text) => {
          setNombre(text);
        }}
        cursorColor={myTheme.colors.greenForce}
        selectionColor={myTheme.colors.greenForce}
        placeholderTextColor={myTheme.colors.textSecondary}
        placeholder="Nombre del producto."
        style={[
          styles.textInputStyle,
          {
            backgroundColor: myTheme.colors.grayLight,
            marginBottom: 10,
          },
        ]}
      />

      <TextInput
        value={moneda}
        onChangeText={(text) => {
          setMoneda(text);
        }}
        keyboardType="default"
        cursorColor={myTheme.colors.greenForce}
        selectionColor={myTheme.colors.greenForce}
        placeholderTextColor={myTheme.colors.textSecondary}
        placeholder="Tipo de moneda"
        style={[
          styles.textInputStyle,
          {
            backgroundColor: myTheme.colors.grayLight,
            marginBottom: 10,
          },
        ]}
      />
      <TextInput
        value={precioVenta}
        onChangeText={(text) => {
          setPrecioVenta(text);
        }}
        keyboardType="decimal-pad"
        cursorColor={myTheme.colors.greenForce}
        selectionColor={myTheme.colors.greenForce}
        placeholderTextColor={myTheme.colors.textSecondary}
        placeholder="Precio de venta."
        style={[
          styles.textInputStyle,
          {
            backgroundColor: myTheme.colors.grayLight,
            marginBottom: 40,
          },
        ]}
      />
      <ButtonsModal handleSave={handleSave} />
    </View>
  );
};

export default modalCreateProduct;

export const styles = StyleSheet.create({
  textInputStyle: {
    padding: 20,
    borderRadius: 15,
    fontSize: 20,
    width: "80%",
  },
  btnStyle: {
    width: 350,
    padding: 10,
    borderRadius: 15,
  },
  textBtnStyle: {
    fontSize: 24,
    textAlign: "center",
  },
});
