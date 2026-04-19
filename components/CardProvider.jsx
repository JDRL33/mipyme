import { Pressable, StyleSheet, Text, View } from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useTheme } from "react-native-paper";
import { useRouter } from "expo-router";

const CardProvider = ({
  id,
  name,
  numProducts,
  a_pagar_CUP,
  a_pagar_USD,
  onPressValidate = true,
  onLongPressValidate = true,
}) => {
  const router = useRouter();

  const myTheme = useTheme();
  const DELETE = async () => {
    router.navigate({
      pathname: "/modal/modalDeleteProvider",
      paramas: { idProvider: id, nameProvider: name },
    });
  };
  return (
    <Pressable
      style={[
        styles.cardProvider,
        { backgroundColor: myTheme.colors.grayLight },
      ]}
      onPress={() => {
        if (onPressValidate) {
          router.navigate({
            pathname: `(info_views)/provider_info`,
            params: { id: id },
          });
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
            ${parseFloat(a_pagar_CUP).toFixed(2)}
            {" CUP"}
            {" - "}
          </Text>
          <Text
            style={[styles.textPricing, { color: myTheme.colors.redForce }]}
          >
            ${parseFloat(a_pagar_USD).toFixed(2)}
            {" USD"}
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
