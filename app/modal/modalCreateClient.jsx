import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useState } from "react";
import { useTheme } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { appStore } from "../../store/appStore";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useRouter } from "expo-router";
import ButtonsModal from "../../components/ButtonsModal";
import Toast from "react-native-toast-message";
import toastShow from "../../tools/toastShow";

const modalCreateClient = () => {
  const myTheme = useTheme();
  const insets = useSafeAreaInsets();
  const [nombre, setNombre] = useState("");
  const [ci, setCi] = useState("");
  const [number, setNumber] = useState("");
  const router = useRouter();
  const addClientStore = appStore((state) => state.addClientStore);

  const handleSave = async () => {
    if (nombre.trim()) {
      await addClientStore(nombre.trim(), 0, 0, number.trim(), ci.trim());
      toastShow("Cliente creado correctamente ✅", "success");
      router.dismiss(1);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <View
        style={[
          styles.parent,
          {
            paddingTop: insets.top,
            backgroundColor: myTheme.colors.primary,
          },
        ]}
      >
        <View style={styles.titleAndIcon}>
          <FontAwesome
            name="user"
            size={36}
            color={myTheme.colors.greenForce}
          />
          <Text style={{ fontSize: 36, fontWeight: "bold" }}>
            Nuevo Cliente
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
          placeholder="Nombre del cliente."
          style={[
            styles.textInputStyle,
            {
              backgroundColor: myTheme.colors.grayLight,
              marginBottom: 10,
            },
          ]}
        />
        <TextInput
          value={ci}
          onChangeText={(text) => {
            setCi(text);
          }}
          keyboardType="number-pad"
          cursorColor={myTheme.colors.greenForce}
          selectionColor={myTheme.colors.greenForce}
          placeholderTextColor={myTheme.colors.textSecondary}
          placeholder="Carnet de identidad."
          style={[
            styles.textInputStyle,
            {
              backgroundColor: myTheme.colors.grayLight,
              marginBottom: 10,
            },
          ]}
        />
        <TextInput
          value={number}
          onChangeText={(text) => {
            setNumber(text);
          }}
          keyboardType="number-pad"
          cursorColor={myTheme.colors.greenForce}
          selectionColor={myTheme.colors.greenForce}
          placeholderTextColor={myTheme.colors.textSecondary}
          placeholder="Numero de teléfono."
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

export default modalCreateClient;

const styles = StyleSheet.create({
  parent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  titleAndIcon: {
    flexDirection: "row",
    gap: 20,
    alignItems: "center",
    marginBottom: 40,
  },
  textInputStyle: {
    padding: 20,
    borderRadius: 15,
    fontSize: 20,
    width: "80%",
  },
});
