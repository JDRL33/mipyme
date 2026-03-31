import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { appStore } from "../../store/appStore";
import { executeQuery, getData, updateStore } from "../../database/database";
import ventaStore from "../../store/ventaStore";

export const ToolsBar = ({ show }) => {
  const store = appStore((state) => state.store);
  const getDataStore = appStore((state) => state.getDataStore);
  const resetDB = appStore((state) => state.resetDB);
  const findByNameProductGroupStore = appStore(
    (state) => state.findByNameProductGroupStore,
  );
  const currentProductEdit = ventaStore((state) => state.currentProductEdit);
  const productsGroupList = appStore((state) => state.productsGroupList);

  const ACCION1 = () => {
    console.log(currentProductEdit);
  };
  const ACCION2 = async () => {
    const response = await getData("SELECT * FROM producto_grupo", []);
    console.log(response);
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
