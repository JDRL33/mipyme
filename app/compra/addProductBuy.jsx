import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import TextInputComponent from "../../components/TextInput";
import ButtonsModal from "../../components/ButtonsModal";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import CurrencyInput from "react-native-currency-input";
import Foundation from "@expo/vector-icons/Foundation";
import { Picker } from "@react-native-picker/picker";
import { useCallback, useEffect, useState } from "react";
import { appStore } from "../../store/appStore";
import Toast from "react-native-toast-message";
import { useTheme } from "react-native-paper";
import buyStore from "../../store/buyStore";
import { useRouter } from "expo-router";
import toastShow from "../../tools/toastShow";

const addProductBuy = () => {
  const insets = useSafeAreaInsets();
  const myTheme = useTheme();
  const router = useRouter();

  const [inputName, setInputName] = useState("");
  const [inputamount, setInputamount] = useState(0);
  const [inputPriceBuy, setPriceBuy] = useState(0);
  const [timeoutId, setTimeoutId] = useState(null);
  const [inputPriceVent, setPriceVent] = useState(0);
  const [inputMoney, setInputMoney] = useState("USD");
  const [productsScroll, setProductsScroll] = useState(true);
  const [windowScrollShow, setWindowScrollShow] = useState(true);
  const [productGroupSelected, setProductGroupSelected] = useState(null);

  // GLOBAL STATES OF BUYSTORE
  const par = buyStore((state) => state.par);
  const plusPar = buyStore((state) => state.plusPar);
  const addProduct = buyStore((state) => state.addProduct);
  const addProductGroup = buyStore((state) => state.addProductGroup);

  // GLOBAL STATES OF APPSTORE
  const findByNameProductGroupStore = appStore(
    (state) => state.findByNameProductGroupStore,
  );
  const productsGroupList = appStore((state) => state.productsGroupList);
  const store = appStore((state) => state.store);

  // FUNCTION FOR SAVE BUY
  const save = useCallback(async () => {
    // COMPROBANDO SI HAY ALGUN PRODUCTO SELECCIONADO
    if (productGroupSelected) {
      if (inputPriceBuy > 0 && inputamount > 0) {
        addProduct(
          productGroupSelected.nombre,
          inputPriceBuy,
          inputMoney,
          inputamount,
          productGroupSelected.id_grupo,
          0,
          false,
        );
        toastShow("Producto agregado al carrito 🆕", "info");
        router.dismiss(1);
      }
    } else {
      // NO HAY NINGUN PRODUCTO SELECIONADO
      if (inputName.trim() != "") {
        if (inputPriceVent > 0) {
          if (inputPriceBuy > 0) {
            if (inputPriceVent > inputPriceBuy) {
              if (inputamount > 0) {
                addProductGroup(
                  inputName,
                  inputMoney,
                  inputPriceVent,
                  inputamount,
                  0,
                  0,
                  par,
                  true,
                );
                addProduct(
                  inputName,
                  inputPriceBuy,
                  inputMoney,
                  inputamount,
                  null,
                  par,
                  true,
                );
                plusPar();
                toastShow("Producto agregado al carrito 🆕", "info");
                router.dismiss(1);
              } else {
                toastShow("Ingrese una cantidad valida ❌", "error");
              }
            } else {
              toastShow(
                "El precio de venta debe ser mayor que el precio de compra ❌",
                "error",
              );
            }
          } else {
            toastShow("Ingrese un precio de compra valido ❌", "error");
          }
        } else {
          toastShow("Ingrese un precio de venta valido ❌", "error");
        }
      } else {
        toastShow("Ingrese un nombre para el producto ❌", "error");
      }
    }
  }, [
    productGroupSelected,
    inputPriceBuy,
    inputamount,
    inputMoney,
    inputName,
    inputPriceVent,
    par,
  ]);

  // USEEFFECT PARA QUE AL DEJAR ESCRIBIR ME MUESTRE LOS PRODUCTOS
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
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
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

      <View style={{ marginTop: 40, width: "80%" }}>
        <View style={styles.nameInputNewProduct}>
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
            }}
          />
          <Pressable
            style={[
              styles.buttonNewProduct,
              {
                backgroundColor: !productsScroll
                  ? myTheme.colors.greenForce
                  : myTheme.colors.grayLight,
              },
            ]}
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
            style={[
              styles.parentListSearch,
              {
                backgroundColor: myTheme.colors.grayForce,
              },
            ]}
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
                  style={[
                    styles.flatListStyle,
                    {
                      backgroundColor: myTheme.colors.grayLight,
                    },
                  ]}
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
          <CurrencyInput
            value={inputPriceBuy}
            onChangeValue={(value) => {
              setPriceBuy(value);
            }}
            prefix="$"
            delimiter="."
            separator=","
            precision={1}
            style={[
              styles.price,
              {
                backgroundColor: myTheme.colors.grayLight,
              },
            ]}
            placeholder="Precio de costo"
          />

          <Picker
            style={{
              width: "35%",
            }}
            selectedValue={inputMoney}
            onValueChange={(itemValue) => setInputMoney(itemValue)}
          >
            <Picker.Item label="CUP" value="CUP" />
            <Picker.Item label="USD" value="USD" />
          </Picker>
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
              inputamount > 0
                ? setInputamount(inputamount - 1)
                : setInputamount(0);
            }}
          >
            <FontAwesome
              name="minus"
              size={24}
              color={myTheme.colors.redForce}
            />
          </Pressable>
          <TextInput
            aria-valuemin={0}
            aria-valuemax={100000}
            keyboardType="numeric"
            value={inputamount.toString()}
            onChangeText={(text) => {
              if (text >= 0) {
                setInputamount(text);
              } else {
                setInputamount(0);
              }
            }}
            style={[
              styles.inputamountProducts,
              {
                backgroundColor: myTheme.colors.grayLight,
                color: myTheme.colors.textSecondary,
              },
            ]}
            placeholder="0"
            placeholderTextColor={myTheme.colors.grayForce}
            cursorColor={myTheme.colors.greenLight}
          />
          <Pressable
            style={{
              backgroundColor: myTheme.colors.greenLight,
              padding: 18,
              borderRadius: 10,
            }}
            onPress={() => {
              setInputamount(inputamount - 1);
              setInputamount(inputamount + 1);
              inputamount >= 0 && setInputamount(inputamount + 1);
            }}
          >
            <FontAwesome
              name="plus"
              size={24}
              color={myTheme.colors.greenForce}
            />
          </Pressable>
        </View>
        <View style={styles.priceOfVent}>
          {!productsScroll && (
            <>
              <CurrencyInput
                value={inputPriceVent}
                onChangeValue={(value) => {
                  setPriceVent(value);
                }}
                prefix="$"
                delimiter="."
                separator=","
                precision={1}
                style={[
                  styles.price,
                  {
                    backgroundColor: myTheme.colors.grayLight,
                  },
                ]}
                placeholder="Precio de venta"
              />
              <Picker
                style={{
                  width: "35%",
                }}
                selectedValue={inputMoney}
                onValueChange={(itemValue) => setInputMoney(itemValue)}
              >
                <Picker.Item label="CUP" value="CUP" />
                <Picker.Item label="USD" value="USD" />
              </Picker>
            </>
          )}
        </View>
        <ButtonsModal handleSave={save} />
      </View>
    </KeyboardAvoidingView>
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
  nameInputNewProduct: {
    gap: 10,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonNewProduct: {
    width: "20%",
    padding: 8,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  parentListSearch: {
    height: "70%",
    width: "100%",
    position: "absolute",
    top: 50,
    left: 0,
    zIndex: 3,
    borderRadius: 10,
    justifyContent: "center",
    padding: 5,
  },
  flatListStyle: {
    padding: 10,
    borderRadius: 10,
    marginBottom: 5,
    height: 80,
  },
  price: {
    marginBottom: 10,
    padding: 15,
    borderRadius: 15,
    fontSize: 20,
    width: "60%",
  },
  inputamountProducts: {
    flex: 1,
    fontSize: 40,
    borderRadius: 10,
    fontWeight: "bold",
    textAlign: "center",
    marginHorizontal: 10,
  },
  priceOfVent: {
    flexDirection: "row",
    gap: 10,
    marginTop: 10,
    marginBottom: 30,
  },
});
