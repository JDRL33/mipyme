import {
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  TextInput,
  View,
  Platform,
} from "react-native";
import { useCallback, useState } from "react";
import { useTheme } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { appStore } from "../../store/appStore";
import Feather from "@expo/vector-icons/Feather";
import ButtonsModal from "../../components/ButtonsModal";
import toastShow from "../../tools/toastShow";

const modalCreateProvider = () => {
  const myTheme = useTheme();
  const insets = useSafeAreaInsets();
  const [nombre, setNombre] = useState("");
  const router = useRouter();
  const addProviderStore = appStore((state) => state.addProviderStore);

  const handleSave = useCallback(async () => {
    if (nombre.trim()) {
      await addProviderStore(nombre.trim(), 0, 0, 0);
      toastShow("Proveedor creado con éxito 🥳✔", "success");
      router.dismiss(1);
    }
  }, [router, nombre]);

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
          onChangeText={setNombre}
          cursorColor={myTheme.colors.greenForce}
          selectionColor={myTheme.colors.greenForce}
          placeholderTextColor={myTheme.colors.textSecondary}
          placeholder="Nombre del proveedor."
          style={[
            styles.textInputStyle,
            {
              backgroundColor: myTheme.colors.grayLight,
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
  parent: {
    justifyContent: "center",
    flex: 1,
    alignItems: "center",
  },
  textInputStyle: {
    marginBottom: 40,
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
