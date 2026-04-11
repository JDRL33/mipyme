import { FlatList, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button, useTheme } from "react-native-paper";
import { useCallback, useEffect, useRef, useState } from "react";

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
import {
  addProductInDeuda,
  createSale,
  deleteClientById,
  getClientById,
  getGananciaOfTheStore,
  updateClientPay,
} from "../../database/database";

const newVenta = () => {
  const insets = useSafeAreaInsets();
  const myTheme = useTheme();
  const router = useRouter();

  // GLOBAL STATE OF APP
  const store = appStore((state) => state.store);
  const getDataStore = appStore((state) => state.getDataStore);
  const updatePagoProviderStore = appStore(
    (state) => state.updatePagoProviderStore,
  );
  const updateamountProductsIndisStore = appStore(
    (state) => state.updateamountProductsIndisStore,
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
  const [clientDeudaId, setClientDeudaId] = useState(0);

  //Datos de la nueva venta
  const [idSale, setIdSale] = useState("");

  let ganancia = 0;
  const [gananciaActual, setGananciaActual] = useState(null);
  const [currentClient, setCurrentClient] = useState(null);

  // FUNCTIONS OF COMPARE

  useEffect(() => {
    const start = async () => {
      setGananciaActual(await getGananciaOfTheStore());
      setIdSale(await createSale(store.tasa_usd));
    };
    start();
  }, []);
  useEffect(() => {
    const getClient = async () => {
      setCurrentClient(await getClientById(clientDeudaId));
    };
    getClient();
  }, [clientDeudaId]);

  const equalCompare = async (
    DEUDA = false,
    extra = null,
    id_proveedor,
    id_product,
    precio_venta,
    precio_costo,
    amount,
  ) => {
    const provider = await getProvidersByIdStore(id_proveedor);

    if (DEUDA == false) {
      await deleteProductIndiByIdStore(id_product);
      await updatePagoProviderStore(
        precio_costo * amount + provider.pagado,
        id_proveedor,
      );
      ganancia = ganancia + (precio_venta - precio_costo) * amount;
    } else {
      await addProductInDeuda(
        extra.nombre,
        extra.moneda,
        extra.amount,
        precio_costo,
        precio_venta,
        id_proveedor,
        idSale,
      );
      switch (extra.moneda) {
        case "CUP":
          await updateClientPay(
            clientDeudaId,
            idSale,
            0 + currentClient[0].usd,
            precio_venta * extra.amount + currentClient[0].cup,
          );
          break;
        case "USD":
          await updateClientPay(
            clientDeudaId,
            idSale,
            precio_venta * extra.amount + currentClient[0].usd,
            0 + currentClient[0].cup,
          );
          break;
      }

      await deleteProductIndiByIdStore(id_product);
    }
  };
  const moreProducts = async (
    DEUDA = false,
    extra = null,
    amount_products,
    amount_products_client,
    id_product,
    id_provider,
    precio_costo,
    precio_venta,
  ) => {
    await updateamountProductsIndisStore(
      amount_products - amount_products_client,
      id_product,
    );

    const provider = await getProvidersByIdStore(id_provider);
    if (DEUDA == false) {
      await updatePagoProviderStore(
        precio_costo * amount_products_client + provider.pagado,
        id_provider,
      );
      ganancia =
        ganancia + (precio_venta - precio_costo) * amount_products_client;
    } else {
      console.log("ID_SALE", idSale);
      await addProductInDeuda(
        extra.nombre,
        extra.moneda,
        extra.amount,
        precio_costo,
        precio_venta,
        id_provider,
        idSale,
      );
      // console.log("moneda", extra.moneda);
      // console.log("idClient", clientDeudaId);
      // console.log("idSale", idSale);
      // console.log(currentClient);
      switch (extra.moneda) {
        case "CUP":
          await updateClientPay(
            clientDeudaId,
            idSale,
            0 + currentClient[0].usd,
            precio_venta * extra.amount + currentClient[0].cup,
          );
          break;
        case "USD":
          await updateClientPay(
            clientDeudaId,
            idSale,
            precio_venta * extra.amount + currentClient[0].usd,
            0 + currentClient[0].cup,
          );
          break;
      }
    }
  };
  const allProductsBuy = async (
    DEUDA = false,
    extra = null,
    id_product,
    id_provider,
    precio_costo,
    amount,
    precio_venta,
  ) => {
    const provider = await getProvidersByIdStore(id_provider);
    if (DEUDA == false) {
      await updatePagoProviderStore(
        precio_costo * amount + provider.pagado,
        id_provider,
      );
      ganancia = ganancia + (precio_venta - precio_costo) * amount;
    } else {
      await addProductInDeuda(
        extra.nombre,
        extra.moneda,
        extra.amount,
        precio_costo,
        precio_venta,
        id_provider,
        idSale,
      );
      console.log("ok");
      switch (extra.moneda.toLowerCase().trim()) {
        case "CUP":
          await updateClientPay(
            clientDeudaId,
            idSale,
            0 + currentClient[0].usd,
            precio_venta * extra.amount + currentClient[0].cup,
          );
          break;
        case "USD":
          await updateClientPay(
            clientDeudaId,
            idSale,
            precio_venta * extra.amount + currentClient[0].usd,
            0 + currentClient[0].cup,
          );
          break;
      }
    }
    await deleteProductIndiByIdStore(id_product);
  };
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
              <Button
                mode="contained"
                onPress={() => {
                  router.push("modal/modalCreateClient");
                }}
                style={{ borderRadius: 10 }}
              >
                <Text>Crear Cliente</Text>
              </Button>
            ) : (
              <View style={styles.pickerCreateClient}>
                <Picker
                  selectedValue={clientDeudaId}
                  onValueChange={(id) => setClientDeudaId(id)}
                  style={styles.pickerDeudPay}
                >
                  <Picker.Item
                    key={"0o0o0o0"}
                    label="Selecciona un Cliente"
                    value={""}
                  />
                  {clientList.map((client) => (
                    <Picker.Item
                      key={client.id}
                      label={client.nombre}
                      value={client.id}
                    />
                  ))}
                </Picker>
                <Button
                  mode="contained"
                  onPress={() => {
                    router.push("modal/modalCreateClient");
                  }}
                  style={{ borderRadius: 10 }}
                >
                  <Text>Crear Cliente</Text>
                </Button>
              </View>
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
                  const productsIndisSort = productsI.sort(
                    (a, b) => parseDMY(a.dateOfBuy) - parseDMY(b.dateOfBuy),
                  );
                  // definimos la cantidad que quiere el cliente
                  let amount = product.cantidad;
                  console.log("PEDIDO:", amount);

                  for (let i = 0; i <= productsIndisSort.length - 1; i++) {
                    if (amount > 0) {
                      // SE VENDE AL SER IGUAL QUE CERO------------------------------------------------------------------------IGUAL
                      if (amount - productsIndisSort[i].cantidad === 0) {
                        console.log("__________IGUALES");
                        await equalCompare(
                          false,
                          null,
                          productsIndisSort[i].id_proveedor,
                          productsIndisSort[i].id,
                          groupProduct[0].precio_venta,
                          productsIndisSort[i].precio_costo,
                          amount,
                        );
                        amount = 0;
                      }
                      // SE VENDE AL SOBRAR PRODUCTOS--------------------------------------------------------------------------SOBRAN
                      else if (amount - productsIndisSort[i].cantidad < 0) {
                        console.log("____________SOBRAN");
                        await moreProducts(
                          false,
                          null,
                          productsIndisSort[i].cantidad,
                          amount,
                          productsIndisSort[i].id,
                          productsIndisSort[i].id_proveedor,
                          productsIndisSort[i].precio_costo,
                          groupProduct[0].precio_venta,
                        );
                        amount = 0;
                      }
                      // SE VENDE AL TODAVIA FALTANTE---------------------------------------------------------------------------FALTAN
                      else if (amount - productsIndisSort[i].cantidad > 0) {
                        console.log("___________FALTAN");
                        let amountRest = amount - productsIndisSort[i].cantidad;
                        await allProductsBuy(
                          false,
                          null,
                          productsIndisSort[i].id,
                          productsIndisSort[i].id_proveedor,
                          productsIndisSort[i].precio_costo,
                          productsIndisSort[i].cantidad,
                          groupProduct[0].precio_venta,
                        );

                        let aux = 1;
                        while (
                          amountRest > 0 &&
                          aux <= productsIndisSort.length
                        ) {
                          // SE VENDE AL SER IGUAL QUE CERO------------------------------------------------IGUAL---------------------------
                          if (
                            amountRest - productsIndisSort[i + aux].cantidad ===
                            0
                          ) {
                            console.log("__________IGUALES******");
                            await equalCompare(
                              false,
                              null,
                              productsIndisSort[i + aux].id_proveedor,
                              productsIndisSort[i + aux].id,
                              groupProduct[0].precio_venta,
                              productsIndisSort[i + aux].precio_costo,
                              amountRest,
                            );
                            amountRest = 0;
                          }
                          // SE VENDE AL SOBRAR PRODUCTOS---------------------------------------------------SOBRAN------------------------
                          else if (
                            amountRest - productsIndisSort[i + aux].cantidad <
                            0
                          ) {
                            console.log("____________SOBRAN***********");
                            await moreProducts(
                              false,
                              null,
                              productsIndisSort[i + aux].cantidad,
                              amountRest,
                              productsIndisSort[i + aux].id,
                              productsIndisSort[i + aux].id_proveedor,
                              productsIndisSort[i + aux].precio_costo,
                              groupProduct[0].precio_venta,
                            );
                            amountRest = 0;
                          } else if (
                            amountRest - productsIndisSort[i + aux].cantidad >
                            0
                          ) {
                            console.log("___________FALTAN*********"); //-------------------------------------FALTAN-----------------------
                            amountRest -= productsIndisSort[i + aux].cantidad;
                            await allProductsBuy(
                              false,
                              null,
                              productsIndisSort[i + aux].id,
                              productsIndisSort[i + aux].id_proveedor,
                              productsIndisSort[i + aux].precio_costo,
                              productsIndisSort[i + aux].cantidad,
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
              } else if (inputMoney === "deuda") {
                //______________DEUDA_________________________________________________________________________________________

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
                  const productsIndisSort = productsI.sort(
                    (a, b) => parseDMY(a.dateOfBuy) - parseDMY(b.dateOfBuy),
                  );
                  // definimos la cantidad que quiere el cliente
                  let amount = product.cantidad;
                  console.log("PEDIDO:", amount);

                  for (let i = 0; i <= productsIndisSort.length - 1; i++) {
                    if (amount > 0) {
                      // SE VENDE AL SER IGUAL QUE CERO------------------------------------------------------------------------IGUAL
                      if (amount - productsIndisSort[i].cantidad === 0) {
                        console.log("__________IGUALES");
                        await equalCompare(
                          true,
                          {
                            nombre: productsIndisSort[i].nombre,
                            moneda: productsIndisSort[i].moneda,
                            amount: amount,
                          },
                          productsIndisSort[i].id_proveedor,
                          productsIndisSort[i].id,
                          groupProduct[0].precio_venta,
                          productsIndisSort[i].precio_costo,
                          amount,
                        );
                        amount = 0;
                      }
                      // SE VENDE AL SOBRAR PRODUCTOS--------------------------------------------------------------------------SOBRAN
                      else if (amount - productsIndisSort[i].cantidad < 0) {
                        console.log("____________SOBRAN");
                        await moreProducts(
                          true,
                          {
                            nombre: productsIndisSort[i].nombre,
                            moneda: productsIndisSort[i].moneda,
                            amount: amount,
                          },
                          productsIndisSort[i].cantidad,
                          amount,
                          productsIndisSort[i].id,
                          productsIndisSort[i].id_proveedor,
                          productsIndisSort[i].precio_costo,
                          groupProduct[0].precio_venta,
                        );
                        amount = 0;
                      }
                      // SE VENDE AL TODAVIA FALTANTE---------------------------------------------------------------------------FALTAN
                      else if (amount - productsIndisSort[i].cantidad > 0) {
                        console.log("___________FALTAN");
                        let amountRest = amount - productsIndisSort[i].cantidad;
                        await allProductsBuy(
                          true,
                          {
                            nombre: productsIndisSort[i].nombre,
                            moneda: productsIndisSort[i].moneda,
                            amount: productsIndisSort[i].cantidad,
                          },
                          productsIndisSort[i].id,
                          productsIndisSort[i].id_proveedor,
                          productsIndisSort[i].precio_costo,
                          productsIndisSort[i].cantidad,
                          groupProduct[0].precio_venta,
                        );

                        let aux = 1;
                        while (
                          amountRest > 0 &&
                          aux <= productsIndisSort.length
                        ) {
                          // SE VENDE AL SER IGUAL QUE CERO------------------------------------------------IGUAL---------------------------
                          if (
                            amountRest - productsIndisSort[i + aux].cantidad ===
                            0
                          ) {
                            console.log("__________IGUALES******");
                            await equalCompare(
                              true,
                              {
                                nombre: productsIndisSort[i + aux].nombre,
                                moneda: productsIndisSort[i + aux].moneda,
                                amount: amountRest,
                              },
                              productsIndisSort[i + aux].id_proveedor,
                              productsIndisSort[i + aux].id,
                              groupProduct[0].precio_venta,
                              productsIndisSort[i + aux].precio_costo,
                              amountRest,
                            );
                            amountRest = 0;
                          }
                          // SE VENDE AL SOBRAR PRODUCTOS---------------------------------------------------SOBRAN------------------------
                          else if (
                            amountRest - productsIndisSort[i + aux].cantidad <
                            0
                          ) {
                            console.log("____________SOBRAN***********");
                            await moreProducts(
                              true,
                              {
                                nombre: productsIndisSort[i + aux].nombre,
                                moneda: productsIndisSort[i + aux].moneda,
                                amount: amountRest,
                              },
                              productsIndisSort[i + aux].cantidad,
                              amountRest,
                              productsIndisSort[i + aux].id,
                              productsIndisSort[i + aux].id_proveedor,
                              productsIndisSort[i + aux].precio_costo,
                              groupProduct[0].precio_venta,
                            );
                            amountRest = 0;
                          } else if (
                            amountRest - productsIndisSort[i + aux].cantidad >
                            0
                          ) {
                            console.log("___________FALTAN*********"); //-------------------------------------FALTAN-----------------------
                            amountRest -= productsIndisSort[i + aux].cantidad;
                            await allProductsBuy(
                              true,
                              {
                                nombre: productsIndisSort[i + aux].nombre,
                                moneda: productsIndisSort[i + aux].moneda,
                                amount: productsIndisSort[i + aux].cantidad,
                              },
                              productsIndisSort[i + aux].id,
                              productsIndisSort[i + aux].id_proveedor,
                              productsIndisSort[i + aux].precio_costo,
                              productsIndisSort[i + aux].cantidad,
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
              }
              await updateGanaciaStore(gananciaActual[0].cGanancia + ganancia);
              await deleteProductGroupWithEmptyStock();
              await initStore();
              console.log("Vendido con exito");
              router.replace("home");
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
            onPress={async () => {
              try {
                await deleteClientById(clientDeudaId);
              } catch (e) {
                console.log(e);
              }
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
    borderRadius: 30,
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
  pickerCreateClient: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 5,
  },
});
