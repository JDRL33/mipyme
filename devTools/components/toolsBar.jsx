import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { appStore } from "../../store/appStore";
import { executeQuery, getData } from "../../database/database";

export const ToolsBar = ({ show }) => {
  const resetDB = appStore((state) => state.resetDB);
  const addProductsStore = appStore((state) => state.addProductsStore);
  const getProviderByIdStore = appStore((state) => state.getProviderByIdStore);
  const initStore = appStore((state) => state.initStore);
  const ACCION1 = async () => {
    await addProductsStore("jesus daniel", 13, "usd", 3, 2, "gffgerg", 1);
  };
  const ACCION2 = async () => {
    await initStore();
  };
  const ACCION3 = async () => {
    console.log(await getData("DELETE FROM proveedor WHERE id_proveedor = 1"));
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
            <Text>ACCION 4</Text>
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
