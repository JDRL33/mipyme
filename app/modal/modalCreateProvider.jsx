import {
  KeyboardAvoidingView,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  Platform,
} from "react-native";
import React, { useState } from "react";
import { useTheme } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { appStore } from "../../store/appStore";
import Feather from "@expo/vector-icons/Feather";
import ButtonsModal from "../../components/ButtonsModal";
import Toast from "react-native-toast-message";

const modalCreateProvider = () => {
  const myTheme = useTheme();
  const insets = useSafeAreaInsets();
  const [nombre, setNombre] = useState("");
  const router = useRouter();
  const addProviderStore = appStore((state) => state.addProviderStore);

  const handleSave = async () => {
    if (nombre.trim()) {
      await addProviderStore(nombre.trim(), 0, 0, 0);
      Toast.show({
        type: "success",
        text1: "Proveedor creado con éxito 🥳✔",
        position: "top",
        visibilityTime: 2000,
      });
      router.back();
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <View
        style={{
          paddingTop: insets.top,
          justifyContent: "center",
          flex: 1,
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
    </KeyboardAvoidingView>
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
