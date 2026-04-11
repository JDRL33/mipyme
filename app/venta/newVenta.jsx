import { FlatList, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button, useTheme } from "react-native-paper";
import { useCallback, useState } from "react";

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

  // GLOBAL STATE OF APP
  const store = appStore((state) => state.store);
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
  const updateGanaciaStore = appStore((state) => state.updateGanaciaStore);
  const initStore = appStore((state) => state.initStore);

  // GLOABAL STATE OF VENT
  const currentProductEdit = ventaStore((state) => state.currentProductEdit);
  const cartProductsList = ventaStore((state) => state.cartProductsList);
  const totalPagarUSD = ventaStore((state) => state.totalPagarUSD);
  const totalPagarCUP = ventaStore((state) => state.totalPagarCUP);

  // USESTATES
  const [inputName, setInputName] = useState("");
  const [inputMoney, setInputMoney] = useState("efectivo");

  // FUNCTIONS OF COMPARE

  const equalCompare = useCallback(
    async (id_proveedor, id_product, precio_venta, precio_costo, count) => {
      await deleteProductIndiByIdStore(id_product);
      const provider = await getProvidersByIdStore(id_proveedor);
      await updatePagoProviderStore(
        precio_costo * count + provider.pagado,
        id_proveedor,
      );
      const calculo = (precio_venta - precio_costo) * count;
      await updateGanaciaStore(calculo + store.cGanancia);
      count = 0;
    },
    [store],
  );
  const moreProducts = useCallback(
    async (
      count_products,
      count_products_client,
      id_product,
      id_provider,
      precio_costo,
      precio_venta,
    ) => {
      console.log("updateCountProductsIndisStore------------✔");
      await updateCountProductsIndisStore(
        count_products - count_products_client,
        id_product,
      );

      const provider = await getProvidersByIdStore(id_provider);
      console.log("updatePagoProviderStore-----------------✔");
      await updatePagoProviderStore(
        precio_costo * count_products_client + provider.pagado,
        id_provider,
      );
      console.log("updateGanaciaStore");
      await updateGanaciaStore(
        (precio_venta - precio_costo) * count_products_client + store.cGanancia,
      );
      count_products_client = 0;
    },
    [store],
  );
  const allProductsBuy = useCallback(
    async (id_product, id_provider, precio_costo, count, precio_venta) => {
      await deleteProductIndiByIdStore(id_product);
      const provider = await getProvidersByIdStore(id_provider);
      await updatePagoProviderStore(
        precio_costo * count + provider.pagado,
        id_provider,
      );
      const calculo = (precio_venta - precio_costo) * count;
      await updateGanaciaStore(calculo + store.cGanancia);
    },
    [store],
  );

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
      {/* TITLE */}
      <Text style={{ fontSize: 40, textAlign: "center" }}>Nueva Venta</Text>

      {/* SEARCHBAR FOR SEARCH PRODUCTS IN THE STOCK */}
      <SearchBar
        productsVentas
        inputText={inputName}
        setInputText={setInputName}
        placeHolder="Buscar producto..."
      />

      {/* RESULTS OF SEARCH THE PRODUCTS */}
      {inputName.length > 0 && !currentProductEdit && <MatchSeach />}

      {/* PRODUCT EDIT */}
      {currentProductEdit && <ItemEdit setText={setInputName} />}

      {/* TICKET */}
      <ScrollView
        style={[
          styles.ticketScrollView,
          {
            backgroundColor: myTheme.colors.grayLight,
          },
        ]}
      >
        {/* TICKET HEADER */}
        <View style={styles.ticketHeader}>
          <Text style={{ fontWeight: "bold", fontSize: 20 }}>
            Recivo de Venta
          </Text>

          {/* Date & Time */}
          <View
            style={{
              alignItems: "center",
              flexDirection: "column",
            }}
          >
            <Text>20/10/2026</Text>
            <Text>10:00 PM</Text>
          </View>
        </View>

        <Text style={styles.subTitle}>* Productos añadidos al carrito:</Text>
        <FlatList
          data={cartProductsList}
          renderItem={({ item }) => <ItemInCart product={item} />}
          ListEmptyComponent={
            <EmptyList text={"No hay productos en el carrito."} />
          }
          ItemSeparatorComponent={<View style={{ height: 10 }} />}
          scrollEnabled={false}
        />

        {/* RESUMEN DE VENTA */}
        <View style={styles.previewVent}>
          <Text style={styles.subTitle}>* Resumen de la venta:</Text>
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
        <View style={styles.actionTypeOfPay}>
          <Text style={styles.subTitle}>* Tipo de pago:</Text>
          <Picker
            style={[
              styles.pickerTypeOfPay,
              {
                backgroundColor: myTheme.colors.greenLight,
              },
            ]}
            selectedValue={inputMoney}
            onValueChange={(itemValue) => setInputMoney(itemValue)}
          >
            <Picker.Item label="Efectivo" value="efectivo" />
            <Picker.Item label="Transferencia" value="transferencia" />
            <Picker.Item label="Por deuda" value="deuda" />
          </Picker>
        </View>
        {/* PAGO POR DEUDA */}
        {inputMoney === "deuda" && (
          <View style={styles.deudPay}>
            <Text style={{ fontWeight: "bold" }}>Cliente:</Text>
            {clientList.length === 0 ? (
              <Button mode="contained">
                <Text>Crear Cliente</Text>
              </Button>
            ) : (
              <Picker style={styles.pickerDeudPay}>
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

        <View style={styles.parentButtonsOkAndCancel}>
          <Button
            style={[
              styles.actionButton,
              {
                backgroundColor: myTheme.colors.greenLight,
                borderColor: myTheme.colors.greenForce,
              },
            ]}
            onPress={async () => {
              // Verificar tipo de pago
              if (inputMoney === "efectivo" || inputMoney === "transferencia") {
                // seleccionamos el primer producto
                for (let product of cartProductsList) {
                  // buscamos su grupo
                  const groupProduct = await findByNameProductStore(
                    product.nombre,
                  );
                  // seleccionamos todos los del grupo para efectuar FIFO(First In First Out)
                  const productsI = await getProductsByIdProductGroupStore(
                    groupProduct[0].id_grupo,
                  );
                  // los ordenamos
                  const productsOrder = productsI.sort(
                    (a, b) => parseDMY(a.dateOfBuy) - parseDMY(b.dateOfBuy),
                  );
                  // definimos la cantidad que quiere el cliente
                  let count = product.cantidad;

                  for (let i = 0; i <= productsOrder.length - 1; i++) {
                    if (count > 0) {
                      // SE VENDE AL SER IGUAL QUE CERO------------------------------------------------------------------------IGUAL
                      if (count - productsOrder[i].cantidad === 0) {
                        console.log("__________IGUALES");
                        await equalCompare(
                          productsOrder[i].id_proveedor,
                          productsOrder[i].id,
                          groupProduct[0].precio_venta,
                          productsOrder[i].precio_costo,
                          count,
                        );
                      }
                      // SE VENDE AL SOBRAR PRODUCTOS--------------------------------------------------------------------------SOBRAN
                      else if (count - productsOrder[i].cantidad < 0) {
                        console.log("____________SOBRAN");
                        await moreProducts(
                          productsOrder[i].cantidad,
                          count,
                          productsOrder[i].id,
                          productsOrder[i].id_proveedor,
                          productsOrder[i].precio_costo,
                          groupProduct[0].precio_venta,
                        );
                        break;
                      }
                      // SE VENDE AL TODAVIA FALTANTE---------------------------------------------------------------------------FALTAN
                      else if (count - productsOrder[i].cantidad > 0) {
                        console.log("___________FALTAN");
                        let cantRest = count - productsOrder[i].cantidad;
                        await allProductsBuy(
                          productsOrder[i].id,
                          productsOrder[i].id_proveedor,
                          productsOrder[i].precio_costo,
                          cantRest,
                          groupProduct[0].precio_venta,
                        );

                        let aux = 1;
                        while (cantRest > 0) {
                          // SE VENDE AL SER IGUAL QUE CERO------------------------------------------------IGUAL---------------------------
                          if (
                            cantRest - productsOrder[i + aux].cantidad ===
                            0
                          ) {
                            console.log("__________IGUALES******");
                            await equalCompare(
                              productsOrder[i + aux].id_proveedor,
                              productsOrder[i + aux].id,
                              groupProduct[0].precio_venta,
                              productsOrder[i + aux].precio_costo,
                              cantRest,
                            );
                            // await deleteProductIndiByIdStore(
                            //   productsOrder[i + aux].id,
                            // );
                            // const provider = await getProvidersByIdStore(
                            //   productsOrder[i + aux].id_proveedor,
                            // );
                            // await updatePagoProviderStore(
                            //   productsOrder[i + aux].precio_costo * cantRest +
                            //     provider.pagado,
                            //   productsOrder[i + aux].id_proveedor,
                            // );
                            // await updateGanaciaStore(
                            //   (groupProduct.precio_venta -
                            //     productsOrder[i + aux].precio_costo) *
                            //     cantRest,
                            // );
                            // cantRest = 0;
                          }
                          // SE VENDE AL SOBRAR PRODUCTOS---------------------------------------------------SOBRAN------------------------
                          else if (
                            cantRest - productsOrder[i + aux].cantidad <
                            0
                          ) {
                            console.log("____________SOBRAN***********");
                            await moreProducts(
                              productsOrder[i + aux].cantidad,
                              cantRest,
                              productsOrder[i + aux].id,
                              productsOrder[i + aux].id_proveedor,
                              productsOrder[i + aux].precio_costo,
                              groupProduct[0].precio_venta,
                            );
                          } else if (
                            cantRest - productsOrder[i + aux].cantidad >
                            0
                          ) {
                            console.log("___________FALTAN*********"); //-------------------------------------FALTAN-----------------------
                            cantRest -= productsOrder[i + aux].cantidad;
                            await allProductsBuy(
                              productsOrder[i + aux].id,
                              productsOrder[i + aux].id_proveedor,
                              productsOrder[i + aux].precio_costo,
                              productsOrder[i + aux].cantidad,
                              groupProduct[0].precio_venta,
                            );

                            continue;
                          }
                          aux += 1;
                        }
                        break;
                      }
                    }
                  }
                }
                await deleteProductGroupWithEmptyStock();
                await initStore();
                console.log("Vendido con exito");
                router.replace("home");
              }
            }}
          >
            <Text
              style={[
                styles.buttonText,
                {
                  color: myTheme.colors.greenForce,
                },
              ]}
            >
              EFECTUAR VENTA
            </Text>
          </Button>
          <Button
            style={[
              styles.actionButton,
              {
                backgroundColor: myTheme.colors.redLight,
                borderColor: myTheme.colors.redForce,
              },
            ]}
            onPress={() => {
              router.dismiss(1);
            }}
          >
            <Text
              style={[
                styles.buttonText,
                {
                  color: myTheme.colors.redForce,
                },
              ]}
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

const styles = StyleSheet.create({
  ticketScrollView: {
    padding: 20,
    marginTop: 20,
    shadowRadius: 10,
    borderRadius: 10,
    shadowOpacity: 0.3,
  },
  ticketHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  subTitle: { marginTop: 20, marginBottom: 10, fontWeight: "bold" },
  previewVent: {
    marginTop: 20,
    padding: 10,
    borderRadius: 15,
  },
  actionTypeOfPay: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 20,
  },
  pickerTypeOfPay: { flex: 1, color: "black", paddingHorizontal: 5 },
  deudPay: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 20,
  },
  pickerDeudPay: {
    flex: 1,
    backgroundColor: "white",
    color: "black",
    paddingHorizontal: 5,
  },
  parentButtonsOkAndCancel: {
    gap: 5,
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "space-around",
  },
  actionButton: {
    borderRadius: 10,
    borderWidth: 2,
  },
  buttonText: { fontWeight: "bold", fontSize: 15 },
});
