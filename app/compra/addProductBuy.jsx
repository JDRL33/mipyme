import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import TextInputComponent from "../../components/TextInput";
import ButtonsModal from "../../components/ButtonsModal";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Foundation from "@expo/vector-icons/Foundation";
import React, { useEffect, useState } from "react";
import { appStore } from "../../store/appStore";
import { useTheme } from "react-native-paper";
import buyStore from "../../store/buyStore";
import { useRouter } from "expo-router";
import { addProductIndi } from "../../database/database";

const addProductBuy = () => {
  const insets = useSafeAreaInsets();
  const myTheme = useTheme();
  const router = useRouter();

  const [inputName, setInputName] = useState("");
  const [textError, setTextError] = useState("");
  const [inputCount, setInputCount] = useState(0);
  const [inputPriceBuy, setPriceBuy] = useState(0);
  const [timeoutId, setTimeoutId] = useState(null);
  const [inputPriceVent, setPriceVent] = useState(0);
  const [inputMoney, setInputMoney] = useState("CUP");
  const [productsScroll, setProductsScroll] = useState(true);
  const [windowScrollShow, setWindowScrollShow] = useState(true);
  const [productGroupSelected, setProductGroupSelected] = useState(null);
  const [par, setPar] = useState(1);

  const addProduct = buyStore((state) => state.addProduct);
  const addProductGroup = buyStore((state) => state.addProductGroup);
  const findByNameProductGroupStore = appStore(
    (state) => state.findByNameProductGroupStore,
  );
  const productsGroupList = appStore((state) => state.productsGroupList);

  const store = appStore((state) => state.store);

  const save = async () => {
    if (productGroupSelected) {
      if (inputPriceBuy > 0 && inputCount > 0) {
        addProduct(
          productGroupSelected.nombre,
          inputPriceBuy,
          inputMoney,
          inputCount,
          productGroupSelected.id_grupo,
          0,
          false,
        );

        router.back();
      }
    } else {
      if (
        inputName.trim() != "" &&
        inputPriceVent > 0 &&
        inputPriceBuy > 0 &&
        inputPriceBuy < inputPriceVent &&
        inputCount > 0
      ) {
        addProductGroup(
          inputName,
          inputMoney,
          inputPriceVent,
          inputCount,
          0,
          0,
          par,
          true,
        );
        addProduct(
          inputName,
          inputPriceBuy,
          inputMoney,
          inputCount,
          null,
          par,
          true,
        );
        setPar(par + 1);
        router.back();
      }
    }
    // }
  };

  useEffect(() => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    // esperar 400 segundos al dejar de escribir
    const id = setTimeout(async () => {
      try {
        if (productGroupSelected) {
          if (inputName !== productGroupSelected.nombre) {
            setProductGroupSelected(null);
            setProductsScroll(true);
            setWindowScrollShow(true);
          }
        }
        await findByNameProductGroupStore(inputName.toLowerCase());
      } catch (error) {
        console.error(error);
      }
    }, 400);

    setTimeoutId(id);

    return () => clearTimeout(id);
  }, [inputName]);

  return (
    <View
      style={[
        styles.main,
        {
          backgroundColor: myTheme.colors.primary,
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
        },
      ]}
    >
      <Text style={styles.title}>AGREGAR PRODUCTO AL CARRITO</Text>
      <Text
        style={{
          fontSize: 20,
          textAlign: "center",
          marginTop: 10,
          color: myTheme.colors.redForce,
        }}
      >
        {textError}
      </Text>

      <View style={{ marginTop: 40, width: "80%" }}>
        <View
          style={{
            gap: 10,
            marginBottom: 10,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <TextInputComponent
            keyboardType={"default"}
            placeHolder={"Nombre del producto ..."}
            textInput={inputName}
            setTextInput={setInputName}
            style={{
              backgroundColor: productGroupSelected
                ? myTheme.colors.greenLight
                : myTheme.colors.grayLight,
              width: "80%",
              marginBottom: 0,
            }}
          />
          <Pressable
            style={{
              width: "20%",
              padding: 8,
              backgroundColor: !productsScroll
                ? myTheme.colors.greenForce
                : myTheme.colors.grayLight,
              borderRadius: 10,
              alignItems: "center",
              justifyContent: "center",
            }}
            onPress={() => {
              // setFindActive(!findActive)
              setProductsScroll(!productsScroll);
              setProductGroupSelected(null);
              if (!productsScroll) {
                setWindowScrollShow(true);
              } else {
                setWindowScrollShow(false);
              }
            }}
          >
            <Foundation
              name="burst-new"
              size={38}
              color={
                !productsScroll
                  ? myTheme.colors.greenLight
                  : myTheme.colors.grayForce
              }
            />
          </Pressable>
        </View>
        {productsGroupList.length > 0 && inputName && windowScrollShow ? (
          <View
            style={{
              height: "70%",
              width: "100%",
              backgroundColor: myTheme.colors.grayForce,
              position: "absolute",
              top: 50,
              left: 0,
              zIndex: 3,
              borderRadius: 10,
              justifyContent: "center",
              padding: 5,
            }}
          >
            <FlatList
              data={productsGroupList}
              keyExtractor={(item) => item.id_grupo.toString()}
              renderItem={({ item }) => (
                <Pressable
                  onPress={() => {
                    setProductGroupSelected(item);
                    setWindowScrollShow(false);
                    setInputName(item.nombre);
                  }}
                  style={{
                    padding: 10,
                    backgroundColor: myTheme.colors.grayLight,
                    borderRadius: 10,
                    marginBottom: 5,
                    height: 80,
                  }}
                >
                  <View>
                    <Text
                      style={{
                        color: myTheme.colors.textSecondary,
                        fontSize: 24,
                      }}
                    >
                      {item.nombre}
                    </Text>
                    <Text
                      style={{
                        color: myTheme.colors.textSecondary,
                        fontSize: 18,
                      }}
                    >
                      {"Precio de venta: "} ${item.precio_venta} {item.moneda}
                    </Text>
                  </View>
                  <View
                    style={{ position: "absolute", right: 10, top: 10, gap: 5 }}
                  >
                    <FontAwesome
                      name="circle"
                      size={12}
                      color={
                        item.cantidad > store.limitStockDown
                          ? myTheme.colors.greenForce
                          : myTheme.colors.redForce
                      }
                    />
                    <Text style={{ fontSize: 20 }}>{item.cantidad}</Text>
                  </View>
                </Pressable>
              )}
            />
          </View>
        ) : (
          <View />
        )}
        <View style={{ flexDirection: "row", gap: 10 }}>
          <TextInputComponent
            keyboardType={"decimal-pad"}
            placeHolder={"Precio de costo ..."}
            textInput={inputPriceBuy}
            setTextInput={setPriceBuy}
            style={{ width: "60%" }}
          />
          <TextInputComponent
            keyboardType={""}
            placeHolder={"CUP"}
            textInput={inputMoney}
            setTextInput={setInputMoney}
            style={{ width: "35%" }}
          />
        </View>
        {/* Botones de incremento y decremento de cantidad de productos */}
        <View style={{ flexDirection: "row" }}>
          <Pressable
            style={{
              backgroundColor: myTheme.colors.redLight,
              padding: 18,
              borderRadius: 10,
            }}
            onPress={() => {
              inputCount > 0 ? setInputCount(inputCount - 1) : setInputCount(0);
            }}
          >
            <FontAwesome
              name="minus"
              size={24}
              color={myTheme.colors.redForce}
            />
          </Pressable>
          <View
            style={{
              backgroundColor: myTheme.colors.grayLight,
              borderRadius: 10,
              marginHorizontal: 10,
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text
              style={{
                fontSize: 40,
                color: myTheme.colors.textSecondary,
                textAlign: "center",
              }}
            >
              {inputCount}
            </Text>
          </View>
          <Pressable
            style={{
              backgroundColor: myTheme.colors.greenLight,
              padding: 18,
              borderRadius: 10,
            }}
            onPress={() => setInputCount(inputCount + 1)}
          >
            <FontAwesome
              name="plus"
              size={24}
              color={myTheme.colors.greenForce}
            />
          </Pressable>
        </View>
        <View
          style={{
            flexDirection: "row",
            gap: 10,
            marginTop: 10,
            marginBottom: 30,
          }}
        >
          {!productsScroll && (
            <>
              <TextInputComponent
                keyboardType={"decimal-pad"}
                placeHolder={"Precio de venta ..."}
                textInput={inputPriceVent}
                setTextInput={setPriceVent}
                style={{ width: "60%" }}
              />
              <TextInputComponent
                keyboardType={"default"}
                placeHolder={"CUP ..."}
                textInput={inputMoney}
                setTextInput={setInputMoney}
                style={{ width: "35%" }}
              />
            </>
          )}
        </View>
        <ButtonsModal handleSave={save} />
      </View>
    </View>
  );
};

export default addProductBuy;

export const styles = StyleSheet.create({
  main: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 10,
    justifyContent: "center",
  },
  title: {
    fontSize: 35,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 50,
  },
  textInputStyle: {
    padding: 15,
    borderRadius: 15,
    fontSize: 20,
  },
});
