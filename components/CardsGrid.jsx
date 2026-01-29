import { StyleSheet, View } from "react-native";
import React, { useEffect, useState } from "react";
import { CardInfo, CardActionsSpeed } from "./Cards";
import { appStore } from "../store/appStore";

export const CardsGridInfo = () => {
  useEffect(() => {}, []);
  const providersList = appStore((state) => state.providersList);
  const productsGroupList = appStore((state) => state.productsGroupList);
  const clientList = appStore((state) => state.clientList);
  const countDeposit = appStore((state) => state.countDeposit);
  const countDeposited = appStore((state) => state.countDeposited);
  const countGanancia = appStore((state) => state.countGanancia);
  const stockBajo = appStore((state) => state.stockBajo);

  return (
    // Contenedor de los bloques
    <View style={styles.mainCards}>
      <CardInfo
        textHeader={"Productos"}
        textBody={productsGroupList.length}
        color={2}
        icon={0}
      />
      <CardInfo
        textHeader={"A Depositar"}
        textBody={countDeposit}
        color={0}
        icon={1}
        money
      />
      <CardInfo
        textHeader={"Depositado"}
        textBody={countDeposited}
        color={1}
        icon={2}
        money
      />
      <CardInfo
        textHeader={"Ganancia"}
        textBody={countGanancia}
        color={0}
        icon={3}
        money
      />
      <CardInfo
        textHeader={"Proveedores"}
        textBody={providersList.length}
        color={0}
        icon={4}
      />
      <CardInfo
        textHeader={"Clientes en Deuda"}
        textBody={clientList.length}
        color={1}
        icon={5}
      />
      <CardInfo
        textHeader={"Stock Bajo"}
        textBody={stockBajo}
        color={3}
        money
        icon={6}
      />
    </View>
  );
};

export const CardsGridActions = () => {
  return (
    <View
      style={{
        flexWrap: "wrap",
        flexDirection: "row",
        justifyContent: "space-between",
      }}
    >
      <CardActionsSpeed text={"Nueva Venta"} color={1} icon={0} />
      <CardActionsSpeed text={"Agregar Producto"} color={0} icon={1} />
    </View>
  );
};

const styles = StyleSheet.create({
  mainCards: {
    justifyContent: "space-between",

    flexDirection: "row",
    flexWrap: "wrap",
    // gap: 15,
  },
});
