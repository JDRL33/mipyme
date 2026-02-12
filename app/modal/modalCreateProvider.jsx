import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import React, { useState } from "react";
import { useTheme } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Link, useNavigation } from "expo-router";
import { appStore } from "../../store/appStore";
import Feather from "@expo/vector-icons/Feather";
import ButtonsModal from "../../components/ButtonsModal";

const modalCreateProvider = () => {
  const myTheme = useTheme();
  const insets = useSafeAreaInsets();
  const [nombre, setNombre] = useState("");
  const navigate = useNavigation();
  const addProviderStore = appStore((state) => state.addProviderStore);

  const handleSave = async () => {
    if (nombre.trim()) {
      await addProviderStore(nombre.trim(), 0, 0, 0);
      navigate.goBack();
    }
  };

  return (
    <View
      style={{
        paddingTop: insets.top,
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: myTheme.colors.primary,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          gap: 20,
          alignItems: "center",
          marginBottom: 40,
        }}
      >
        <Feather name="truck" size={36} color={myTheme.colors.greenForce} />
        <Text style={{ fontSize: 36, fontWeight: "bold" }}>
          Nuevo Proveedor
        </Text>
      </View>
      <TextInput
        value={nombre}
        onChangeText={(text) => {
          setNombre(text);
        }}
        cursorColor={myTheme.colors.greenForce}
        selectionColor={myTheme.colors.greenForce}
        placeholderTextColor={myTheme.colors.textSecondary}
        placeholder="Nombre del proveedor."
        style={[
          styles.textInputStyle,
          {
            backgroundColor: myTheme.colors.grayLight,
            marginBottom: 40,
          },
        ]}
      />
      <ButtonsModal handleSave={handleSave} />
    </View>
  );
};

export default modalCreateProvider;

const styles = StyleSheet.create({
  textInputStyle: {
    padding: 20,
    borderRadius: 15,
    fontSize: 20,
    width: "80%",
  },
  btnStyle: {
    width: 350,
    padding: 10,
    borderRadius: 15,
  },
  textBtnStyle: {
    fontSize: 24,
    textAlign: "center",
  },
});
