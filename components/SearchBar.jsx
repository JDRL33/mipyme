import { StyleSheet, TextInput } from "react-native";
import { useTheme } from "react-native-paper";
import React, { useEffect, useState } from "react";
import { appStore } from "../store/appStore";
import ventaStore from "../store/ventaStore";

const SearchBar = ({
  placeHolder = "Buscar...",
  providers = false,
  products = false,
  productsVentas = false,
  inputText = "",
  setInputText = () => {},
}) => {
  const myTheme = useTheme();
  const [text, setText] = useState("");
  const [timeoutId, setTimeoutId] = useState(null);
  const findByNameProviderStore = appStore(
    (state) => state.findByNameProviderStore,
  );
  const findByNameProductStore = appStore(
    (state) => state.findByNameProductStore,
  );
  const findByNameClientStore = appStore(
    (state) => state.findByNameClientStore,
  );
  const setCurrentProductEdit = ventaStore(
    (state) => state.setCurrentProductEdit,
  );

  useEffect(() => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    console.log("update");
    // esperar 400 segundos al dejar de escribir
    const id = setTimeout(async () => {
      try {
        if (providers) {
          await findByNameProviderStore(text.toLowerCase());
        } else if (products) {
          await findByNameProductStore(text.toLowerCase());
        } else if (productsVentas) {
          await findByNameProductStore(inputText.toLowerCase());
          setCurrentProductEdit(null);
        } else {
          await findByNameClientStore(text.toLowerCase());
        }
      } catch (error) {
        console.error(error);
      }
    }, 400);

    setTimeoutId(id);

    return () => clearTimeout(id);
  }, [text, inputText]);

  return (
    <TextInput
      value={productsVentas ? inputText : text}
      onChangeText={(text) => {
        productsVentas ? setInputText(text) : setText(text);
      }}
      cursorColor={myTheme.colors.greenForce}
      selectionColor={myTheme.colors.greenLight}
      style={[
        styles.tInput,
        {
          backgroundColor: myTheme.colors.grayLight,
          color: myTheme.colors.textPrimary,
        },
      ]}
      placeholder={placeHolder}
      placeholderTextColor={myTheme.colors.textSecondary}
    />
  );
};

export default SearchBar;

const styles = StyleSheet.create({
  tInput: {
    height: 60,
    width: "100%",
    borderRadius: 10,
    fontSize: 22,
    paddingLeft: 15,
    marginBottom: 5,
  },
});
