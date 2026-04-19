import { StyleSheet, View } from "react-native";
import { CardInfo, CardActionsSpeed } from "./Cards";
import { appStore } from "../store/appStore";
import { useRouter } from "expo-router";

export const CardsGridInfo = () => {
  const store = appStore((state) => state.store);
  const router = useRouter();
  return (
    // Contenedor de los bloques
    <View style={styles.mainCards}>
      <CardInfo
        textHeader={"Productos"}
        textBody={store.nProducts}
        color={2}
        icon={0}
        LongPress={() => {
          router.navigate("(tabs)/products");
        }}
      />
      <CardInfo
        textHeader={"A Depositar"}
        textBodyCup={store.cDebito_CUP}
        textBodyUsd={store.cDebito_USD}
        color={0}
        icon={1}
        money
      />
      <CardInfo
        textHeader={"Depositado"}
        textBodyCup={store.cPagado_CUP}
        textBodyUsd={store.cPagado_USD}
        color={1}
        icon={2}
        money
      />
      <CardInfo
        textHeader={"Ganancia"}
        textBodyCup={store.cGanancia_CUP}
        textBodyUsd={store.cGanancia_USD}
        color={0}
        icon={3}
        money
      />
      <CardInfo
        textHeader={"Proveedores"}
        textBody={store.nProviders}
        color={0}
        icon={4}
        LongPress={() => {
          router.navigate("(tabs)/proveedor");
        }}
      />
      <CardInfo
        textHeader={"Clientes en Deuda"}
        textBody={store.nClients}
        color={1}
        icon={5}
        LongPress={() => {
          router.navigate("(tabs)/clients");
        }}
      />
      <CardInfo
        textHeader={"Stock Bajo"}
        textBody={store.nProducts_stock_down}
        color={3}
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
      <CardActionsSpeed text={"Hacer compra"} color={0} icon={1} />
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
