import {
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button, useTheme } from "react-native-paper";
import React, { useEffect, useState } from "react";

import MatchSeach from "../../components/Venta/MatchSeach";
import ItemInCart from "../../components/Venta/ItemInCart";
import ItemEdit from "../../components/Venta/ItemEdit";
import { Picker } from "@react-native-picker/picker";
import SearchBar from "../../components/SearchBar";
import EmptyList from "../../components/EmptyList";
import { appStore } from "../../store/appStore";
import ventaStore from "../../store/ventaStore";
import parseDMY from "../../tools/parseDMY";
import { useRouter } from "expo-router";

const newVenta = () => {
  const insets = useSafeAreaInsets();
  const myTheme = useTheme();
  const router = useRouter();

  const updatePagoProviderStore = appStore(
    (state) => state.updatePagoProviderStore,
  );
  const updateCountProductsIndisStore = appStore(
    (state) => state.updateCountProductsIndisStore,
  );
  const deleteProductGroupWithEmptyStock = appStore(
    (state) => state.deleteProductGroupWithEmptyStock,
  );
  const clientList = appStore((state) => state.clientList);
  const findByNameProductStore = appStore(
    (state) => state.findByNameProductStore,
  );
  const getProductsByIdProductGroupStore = appStore(
    (state) => state.getProductsByIdProductGroupStore,
  );
  const deleteProductIndiByIdStore = appStore(
    (state) => state.deleteProductIndiByIdStore,
  );
  const getProvidersByIdStore = appStore(
    (state) => state.getProvidersByIdStore,
  );
  const initStore = appStore((state) => state.initStore);

  const currentProductEdit = ventaStore((state) => state.currentProductEdit);
  const cartProductsList = ventaStore((state) => state.cartProductsList);
  const totalPagarUSD = ventaStore((state) => state.totalPagarUSD);
  const totalPagarCUP = ventaStore((state) => state.totalPagarCUP);

  const [inputName, setInputName] = useState("");
  const [inputMoney, setInputMoney] = useState("efectivo");

  return (
    <View
      style={{
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
        backgroundColor: myTheme.colors.primary,
      }}
    >
      <Text style={{ fontSize: 40, textAlign: "center" }}>Nueva Venta</Text>

      <SearchBar
        placeHolder="Buscar producto..."
        productsVentas
        inputText={inputName}
        setInputText={setInputName}
      />

      {/* Esta es los resultados de busquedas de los productos */}
      {inputName.length > 0 && !currentProductEdit && <MatchSeach />}

      {/* ITEM EDIT */}
      {currentProductEdit && <ItemEdit setText={setInputName} />}

      {/* ticket */}
      <ScrollView
        style={{
          backgroundColor: myTheme.colors.grayLight,
          padding: 20,
          marginTop: 20,
          shadowRadius: 10,
          borderRadius: 10,
          shadowOpacity: 0.3,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
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
                <Picker.Item
                  label="Crear nuevo cliente"
                  value="crear_cliente"
                />
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
            onPress={async () => {
              if (inputMoney === "efectivo" || inputMoney === "transferencia") {
                cartProductsList.map(async (product) => {
                  const groupProduct = await findByNameProductStore(
                    product.nombre,
                  );
                  const productsI = await getProductsByIdProductGroupStore(
                    groupProduct.at(0).id_grupo,
                  );
                  const productsOrder = productsI.sort(
                    (a, b) => parseDMY(a.dateOfBuy) - parseDMY(b.dateOfBuy),
                  );
                  let count = product.cantidad;
                  console.log(count);
                  for (let i = 0; i <= productsOrder.length - 1; i++) {
                    if (count > 0) {
                      console.log("jjjjj");
                      // SE VENDE AL SER IGUAL QUE CERO
                      if (count - productsOrder[i].cantidad === 0) {
                        await deleteProductIndiByIdStore(productsOrder[i].id);
                        count = 0;
                        const provider = await getProvidersByIdStore(
                          productsOrder[0].id_proveedor,
                        );
                        await updatePagoProviderStore(
                          productsOrder[0].precio_costo + provider.pagado,
                          productsOrder[0].id_proveedor,
                        );
                      }
                      // SE VENDE AL SOBRAR PRODUCTOS TODAVIA
                      else if (count - productsOrder[i].cantidad < 0) {
                        count = productsOrder[i].cantidad - count;
                        await updateCountProductsIndisStore(
                          count,
                          productsOrder[i].id,
                        );
                        count = 0;
                        const provider = await getProvidersByIdStore(
                          productsOrder[0].id_proveedor,
                        );
                        await updatePagoProviderStore(
                          productsOrder[0].precio_costo + provider.pagado,
                          productsOrder[0].id_proveedor,
                        );
                        // await deleteProductIndiByIdStore(productsOrder[i].id);  ELIMINAR LO QUE FALTA
                      }
                      // SE VENDE AL TODAVIA FALTANTE
                      else if (count - productsOrder[i].cantidad > 0) {
                        count -= productsOrder[i].cantidad;
                        await deleteProductIndiByIdStore(productsOrder[i].id);
                        const provider = await getProvidersByIdStore(
                          productsOrder[i].id_proveedor,
                        );
                        await updatePagoProviderStore(
                          productsOrder[i].precio_costo + provider.pagado,
                          productsOrder[i].id_proveedor,
                        );
                        continue;
                      }
                    }
                  }
                });
                await deleteProductGroupWithEmptyStock();
                await initStore();
                router.navigate("/");
              }
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
            onPress={() => {
              router.back();
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
