import {
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button, useTheme } from "react-native-paper";
import { useRouter } from "expo-router";

import MatchSeach from "../../components/Venta/MatchSeach";
import ItemEdit from "../../components/Venta/ItemEdit";
import ItemInCart from "../../components/Venta/ItemInCart";
import { Picker } from "@react-native-picker/picker";
import { appStore } from "../../store/appStore";
import ventaStore from "../../store/ventaStore";
import EmptyList from "../../components/EmptyList";

const newVenta = () => {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const myTheme = useTheme();

  const [timeoutId, setTimeoutId] = useState(null);
  const findByNameProductGroupStore = appStore(
    (state) => state.findByNameProductGroupStore,
  );
  const ProductList = appStore((state) => state.productsGroupList);
  const clientList = appStore((state) => state.clientList);
  const currentProductEdit = ventaStore((state) => state.currentProductEdit);
  const setCurrentProductEdit = ventaStore(
    (state) => state.setCurrentProductEdit,
  );
  const cartProductsList = ventaStore((state) => state.cartProductsList);
  const totalPagarUSD = ventaStore((state) => state.totalPagarUSD);
  const totalPagarCUP = ventaStore((state) => state.totalPagarCUP);

  const [inputName, setInputName] = useState("");
  const [inputMoney, setInputMoney] = useState("efectivo");

  useEffect(() => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    // esperar 400 segundos al dejar de escribir
    const id = setTimeout(async () => {
      try {
        // console.log(inputName);
        await findByNameProductGroupStore(inputName);
        setCurrentProductEdit(null);
      } catch (error) {
        console.error(error);
      }
    }, 400);

    setTimeoutId(id);

    return () => clearTimeout(id);
  }, [inputName]);

  return (
    <View
      style={{
        paddingHorizontal: 20,
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
        backgroundColor: myTheme.colors.primary,
        flex: 1,
      }}
    >
      <Text style={{ fontSize: 40, textAlign: "center" }}>Nueva Venta</Text>
      <TextInput
        value={inputName}
        onChangeText={(text) => {
          setInputName(text);
        }}
        placeholder="Buscar producto ..."
        style={{
          backgroundColor: myTheme.colors.grayLight,
          borderRadius: 10,
          paddingHorizontal: 20,
          paddingVertical: 15,
          marginTop: 20,
          fontSize: 15,
        }}
        cursorColor={myTheme.colors.greenForce}
      />

      {/* Esta es los resultados de busquedas de los productos */}
      {inputName.length > 0 && !currentProductEdit && <MatchSeach />}

      {/* ITEM EDIT */}
      {currentProductEdit && <ItemEdit />}

      {/* ticket */}
      <ScrollView
        style={{
          backgroundColor: myTheme.colors.grayLight,
          padding: 20,
          shadowRadius: 10,
          shadowOpacity: 0.3,
          borderRadius: 10,
          marginTop: 20,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Text style={{ fontWeight: "bold", fontSize: 20 }}>
            Recivo de Venta
          </Text>

          {/* Date & Time */}
          <View
            style={{
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Text>20/10/2026</Text>
            <Text>10:00 PM</Text>
          </View>
        </View>

        <Text style={{ marginTop: 20, marginBottom: 10, fontWeight: "bold" }}>
          * Productos añadidos al carrito:
        </Text>
        <FlatList
          data={cartProductsList}
          renderItem={({ item }) => <ItemInCart product={item} />}
          ListEmptyComponent={
            <EmptyList text={"No hay productos en el carrito."} />
          }
          ItemSeparatorComponent={<View style={{ height: 10 }} />}
          scrollEnabled={false}
        />

        {/* Resumen de Venta */}
        <View
          style={{
            marginTop: 20,
            padding: 10,
            borderRadius: 15,
          }}
        >
          <Text style={{ marginBottom: 10, fontWeight: "bold" }}>
            * Resumen de la venta:
          </Text>
          <Text>
            {`    `}- Total de productos: {cartProductsList.length}
          </Text>
          <Text>
            {`    `}- Pago total en USD: {totalPagarUSD.toFixed(2)} USD
          </Text>
          <Text>
            {`    `}- Pago total en CUP: {totalPagarCUP.toFixed(2)} CUP
          </Text>
          {/* <Text>
            {`    `}- Cambio: {`50.000 CUP`}
          </Text> */}
          {/* <Text>
            {`    `}- Descuento: {`20 USD`}
          </Text> */}
        </View>

        {/* TIPO DE PAGO */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 10,
            marginTop: 20,
          }}
        >
          <Text style={{ fontWeight: "bold" }}>* Tipo de pago:</Text>
          <Picker
            style={{
              flex: 1,
              backgroundColor: myTheme.colors.greenLight,
              color: "black",
              paddingHorizontal: 5,
            }}
            selectedValue={inputMoney}
            onValueChange={(itemValue) => setInputMoney(itemValue)}
          >
            <Picker.Item label="Efectivo" value="efectivo" />
            <Picker.Item label="Transferencia" value="transferencia" />
            <Picker.Item label="Por deuda" value="deuda" />
          </Picker>
        </View>
        {/* pago por deuda */}
        {inputMoney === "deuda" && (
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 10,
              marginTop: 20,
            }}
          >
            <Text style={{ fontWeight: "bold" }}>Cliente:</Text>
            {clientList.length === 0 ? (
              <Button mode="contained">
                <Text>Crear Cliente</Text>
              </Button>
            ) : (
              <Picker
                style={{
                  flex: 1,
                  backgroundColor: "white",
                  color: "black",
                  paddingHorizontal: 5,
                }}
              >
                {clientList.map((client) => (
                  <Picker.Item
                    key={client.id}
                    label={client.nombre}
                    value={client.id}
                  />
                ))}
              </Picker>
            )}
          </View>
        )}

        <View
          style={{
            marginTop: 20,
            flexDirection: "row",
            gap: 5,
            justifyContent: "space-around",
          }}
        >
          <Button
            style={{
              borderRadius: 10,
              backgroundColor: myTheme.colors.greenLight,
              borderColor: myTheme.colors.greenForce,
              borderWidth: 2,
            }}
          >
            <Text
              style={{
                color: myTheme.colors.greenForce,
                fontWeight: "bold",
                fontSize: 15,
              }}
            >
              EFECTUAR VENTA
            </Text>
          </Button>
          <Button
            style={{
              borderRadius: 10,
              backgroundColor: myTheme.colors.redLight,
              borderColor: myTheme.colors.redForce,
              borderWidth: 2,
            }}
          >
            <Text
              style={{
                color: myTheme.colors.redForce,
                fontWeight: "bold",
                fontSize: 15,
              }}
            >
              CANCELAR
            </Text>
          </Button>
        </View>
        <View style={{ height: 50 }} />
      </ScrollView>
    </View>
  );
};

export default newVenta;

const styles = StyleSheet.create({});
