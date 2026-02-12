import { Pressable, StyleSheet, Text, View } from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useTheme } from "react-native-paper";
import { appStore } from "../store/appStore";
import { useRouter } from "expo-router";

const CardProvider = ({
  id,
  name,
  numProducts,
  a_pagar,
  pagado,
  onPressValidate = true,
  onLongPressValidate = true,
}) => {
  const setTemp = appStore((state) => state.setTemp);
  const getProviderByIdStore = appStore((state) => state.getProviderByIdStore);
  const router = useRouter();

  const myTheme = useTheme();
  const DELETE = async () => {
    const currentProvider = await getProviderByIdStore(id);
    setTemp(currentProvider);
    router.navigate("/modalDeleteProvider");
  };
  return (
    <Pressable
      style={[
        styles.cardProvider,
        { backgroundColor: myTheme.colors.grayLight },
      ]}
      onPress={() => {
        if (onPressValidate) {
          router.navigate(`(proveedor)/[${id}]`);
        }
      }}
      onLongPress={() => {
        if (onLongPressValidate) {
          DELETE();
        }
      }}
    >
      <View style={[styles.box, { backgroundColor: myTheme.colors.grayForce }]}>
        <FontAwesome name="truck" size={60} color="black" />
      </View>
      <View style={[styles.bodyText]}>
        <Text
          style={{
            color: myTheme.colors.textPrimary,
            fontSize: 20,
            fontWeight: "bold",
          }}
        >
          {name}
        </Text>
        <Text style={{ color: myTheme.colors.textSecondary, fontSize: 16 }}>
          Productos: {numProducts}
        </Text>
        <View style={{ flexDirection: "row" }}>
          <Text
            style={[styles.textPricing, { color: myTheme.colors.redForce }]}
          >
            ${a_pagar} -
          </Text>
          <Text
            style={[styles.textPricing, { color: myTheme.colors.greenForce }]}
          >
            {` $${pagado}`}
          </Text>
        </View>
      </View>
    </Pressable>
  );
};

export default CardProvider;

const styles = StyleSheet.create({
  cardProvider: {
    width: "100%",
    height: 100,
    borderRadius: 15,
    padding: 10,
    flexDirection: "row",
  },
  box: {
    height: "100%",
    width: 80,
    borderRadius: 10,
    marginRight: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  bodyText: {
    flexDirection: "column",
    gap: 2,
  },
  textPricing: {
    fontSize: 20,
  },
});
