import { Pressable, StyleSheet, Text, View } from "react-native";
import { useTheme } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { appStore } from "../../store/appStore";
import toastShow from "../../tools/toastShow";
import { useCallback } from "react";

const modalDeleteProvider = () => {
  const params = useLocalSearchParams();
  const myTheme = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const deleteProviderByIdStore = appStore(
    (state) => state.deleteProviderByIdStore,
  );

  const handleEliminar = useCallback(async () => {
    await deleteProviderByIdStore(params.idProvider);
    toastShow("Proveedor eliminado correctamente ✅", "success");
    router.dismiss(1);
  }, [params.idProvider, router]);

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
          marginBottom: 30,
          fontSize: 30,
          color: myTheme.colors.textSecondary,
        }}
      >
        {params.name}
      </Text>
      <Text style={styles.title}>¿Quieres eliminar este proveedor?</Text>
      <Text style={styles.subTitle}>
        {
          "(Al eliminarlo se quitaran del stock los productos de este proveedor !!!!!)"
        }
      </Text>

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
          onPress={() => {
            router.dismiss(1);
          }}
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
  subTitle: { fontSize: 21, marginBottom: 60, textAlign: "center" },
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
