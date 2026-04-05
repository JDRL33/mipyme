import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import { appStore } from "../../store/appStore";
import { isInitialized, updatePagoProvider } from "../../database/database";
import { useRouter } from "expo-router";

export const ToolsBar = ({ show = false }) => {
  const productsIndis = appStore((state) => state.productsIndis);
  const resetDB = appStore((state) => state.resetDB);
  const initStore = appStore((state) => state.initStore);
  const deleteProductGroupWithEmptyStock = appStore(
    (state) => state.deleteProductGroupWithEmptyStock,
  );
  const router = useRouter();

  const ACCION1 = () => {};
  const ACCION2 = async () => {
    await updatePagoProvider(520, 2);
    await deleteProductGroupWithEmptyStock();
    await initStore();
    router.replace("home");
  };
  const ACCION3 = async () => {
    console.log(isInitialized);
  };
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
