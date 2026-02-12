import { Pressable, StyleSheet, Text, View } from "react-native";
import { useTheme } from "react-native-paper";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { appStore } from "../store/appStore";
import { useRouter } from "expo-router";

const CardProviderProduct = ({
  pIdProvider,
  pId,
  pNombre,
  pMoneda,
  pPrecio_costo,
  pCantidad,
}) => {
  const store = appStore((state) => state.store);
  const myTheme = useTheme();
  const router = useRouter();
  return (
    <Pressable
      style={[styles.main, { backgroundColor: myTheme.colors.grayLight }]}
      onPress={() => {
        console.log("press");
      }}
      onLongPress={() => {
        router.push({
          pathname: `/modal/modalDeleteProductIndi`,
          params: { id_provider: pIdProvider, name: pNombre, idProductI: pId },
        });
      }}
    >
      <View>
        <Text style={{ fontSize: 20, color: myTheme.colors.textPrimary }}>
          {pNombre}
        </Text>
        <Text style={{ color: myTheme.colors.greenForce, fontSize: 18 }}>
          ${pPrecio_costo} {pMoneda}
        </Text>
      </View>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
        <FontAwesome
          name="circle"
          size={10}
          color={
            pCantidad > store.limitStockDown
              ? myTheme.colors.greenForce
              : myTheme.colors.redForce
          }
        />
        <Text style={{ fontSize: 18, color: myTheme.colors.textSecondary }}>
          {pCantidad}
        </Text>
      </View>
    </Pressable>
  );
};

export default CardProviderProduct;

const styles = StyleSheet.create({
  main: {
    width: "100%",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
});
