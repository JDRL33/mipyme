import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { appStore } from "../../store/appStore";
import { executeQuery, getData, updateStore } from "../../database/database";

export const ToolsBar = ({ show }) => {
  const store = appStore((state) => state.store);
  const getDataStore = appStore((state) => state.getDataStore);
  const resetDB = appStore((state) => state.resetDB);

  const ACCION1 = async () => {
    const response = await executeQuery(
      "INSERT INTO (nombre, moneda,precio_costo,)",
    );
    console.log(response);
  };
  const ACCION2 = async () => {
    const store = {
      name: "My Tienda Pro",
      limitStockDown: 5,
      tasa_usd: 480,
      tasa_eur: 560,
      nProducts: 34534,
      nProducts_stock_down: 34535,
      nProviders: 345345,
      nClients: 345345,
      cDebito: 345345,
      cPagado: 34534535,
      cGanancia: 34534534,
      id: 1,
    };
    await executeQuery(
      "UPDATE store SET name=?, limitStockDown = ?, tasa_usd = ?, tasa_eur = ?, nProducts = ?, nProducts_stock_down = ?, nProviders = ?, nClients = ?, cDebito = ?, cPagado = ?, cGanancia = ? WHERE id = ?",
      [
        store.name,
        store.limitStockDown,
        store.tasa_usd,
        store.tasa_eur,
        store.nProducts,
        store.nProducts_stock_down,
        store.nProviders,
        store.nClients,
        store.cDebito,
        store.cPagado,
        store.cGanancia,
        store.id,
      ],
    );
    await getDataStore();
  };
  const ACCION3 = async () => {};
  const ACCION4 = async () => {
    await resetDB();
  };

  return (
    <>
      <View style={[styles.main, { display: show }]}>
        <TouchableOpacity onPress={ACCION1}>
          <View style={styles.btn}>
            <Text>ACCION 1</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={ACCION2} disabled={false}>
          <View style={styles.btn}>
            <Text>ACCION 2</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={ACCION3} disabled={false}>
          <View style={styles.btn}>
            <Text>ACCION 3</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={ACCION4}>
          <View style={styles.btn}>
            <Text>RESTART DB</Text>
          </View>
        </TouchableOpacity>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  main: {
    height: 50,
    width: "auto",
    padding: 5,
    backgroundColor: "#1100fda1",
    borderRadius: 10,
    position: "absolute",
    bottom: 30,
    left: 30,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  btn: {
    marginRight: 10,
    backgroundColor: "white",
    height: 40,
    width: 80,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
});
