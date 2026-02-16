import { Pressable, StyleSheet, Text, View } from "react-native";
import { useTheme } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";
import { appStore } from "../../store/appStore";

const modalDeleteProductGroup = () => {
  const params = useLocalSearchParams();
  const myTheme = useTheme();
  const insets = useSafeAreaInsets();
  const deleteProductGroupByIdStore = appStore(
    (state) => state.deleteProductGroupByIdStore,
  );

  const handleEliminar = async () => {
    await deleteProductGroupByIdStore(params.id_grupo);
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
        paddingHorizontal: 20,
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
        ¿Quieres eliminar este grupo de productos?
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

export default modalDeleteProductGroup;

const styles = StyleSheet.create({
  btnStyle: {
    width: "300",
    padding: 10,
    borderRadius: 15,
  },
  textBtnStyle: {
    fontSize: 24,
    textAlign: "center",
  },
});
