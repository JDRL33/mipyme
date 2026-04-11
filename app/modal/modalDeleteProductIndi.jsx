import { Pressable, StyleSheet, Text, View } from "react-native";
import { useTheme } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";
import { appStore } from "../../store/appStore";
import { deleteProductIndiById } from "../../database/database";
import toastShow from "../../tools/toastShow";
import { useCallback } from "react";

const modalDeleteProvider = () => {
  const params = useLocalSearchParams();
  const myTheme = useTheme();
  const insets = useSafeAreaInsets();
  const getProductsByIdProviderStore = appStore(
    (state) => state.getProductsByIdProviderStore,
  );

  const handleEliminar = useCallback(async () => {
    await deleteProductIndiById(params.idProductI);
    await getProductsByIdProviderStore(params.id_provider);
    toastShow("Producto eliminado correctamente ✅", "success");
    router.dismiss(1);
  }, [params.idProductI, params.id_provider, router]);

  return (
    <View
      style={[
        styles.parent,
        {
          backgroundColor: myTheme.colors.primary,
          paddingTop: insets.top,
        },
      ]}
    >
      <Text
        style={{
          color: myTheme.colors.textSecondary,
          marginBottom: 30,
          fontSize: 30,
        }}
      >
        {params.name}
      </Text>
      <Text style={styles.title}>¿Quieres eliminar este producto?</Text>

      <View style={{ gap: 5 }}>
        <Pressable
          style={[
            styles.btnStyle,
            {
              backgroundColor: myTheme.colors.greenLight,
            },
          ]}
          onPress={handleEliminar}
        >
          <Text
            style={[
              styles.textBtnStyle,
              {
                color: myTheme.colors.greenForce,
              },
            ]}
          >
            Eliminar
          </Text>
        </Pressable>
        <Pressable
          style={[
            styles.btnStyle,
            {
              backgroundColor: myTheme.colors.redForce,
            },
          ]}
          onPress={router.back}
        >
          <Text
            style={[
              styles.textBtnStyle,
              {
                color: myTheme.colors.redLight,
              },
            ]}
          >
            Cancelar
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

export default modalDeleteProvider;

const styles = StyleSheet.create({
  parent: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: {
    fontSize: 36,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
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
