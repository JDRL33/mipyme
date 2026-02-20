import { Pressable, StyleSheet, Text, View } from "react-native";
import { useTheme } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { appStore } from "../../store/appStore";
import Toast from "react-native-toast-message";

const modalDeleteProvider = () => {
  const params = useLocalSearchParams();
  const myTheme = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const deleteProviderByIdStore = appStore(
    (state) => state.deleteProviderByIdStore,
  );

  const handleEliminar = async () => {
    await deleteProviderByIdStore(params.idProvider);
    Toast.show({
      type: "success",
      text1: "Proveedor eliminado correctamente ✅",
      position: "top",
      visibilityTime: 2000,
    });
    router.back();
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
      <Text
        style={{
          marginBottom: 30,
          fontSize: 30,
          color: myTheme.colors.textSecondary,
        }}
      >
        {params.name}
      </Text>
      <Text
        style={{
          fontSize: 36,
          fontWeight: "bold",
          marginBottom: 10,
          textAlign: "center",
        }}
      >
        ¿Quieres eliminar este proveedor?
      </Text>
      <Text style={{ fontSize: 21, marginBottom: 60, textAlign: "center" }}>
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
            router.back();
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
