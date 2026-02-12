import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";
import { useTheme } from "react-native-paper";
import Feather from "@expo/vector-icons/Feather";
import { Link } from "expo-router";
import { appStore } from "../store/appStore";

const CambioCard = () => {
  const myTheme = useTheme();
  const store = appStore((state) => state.store);
  return (
    <View
      style={[
        styles.cardStyle,
        { backgroundColor: myTheme.colors.purpleLight },
      ]}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "flex-start",
        }}
      >
        <Feather
          name="dollar-sign"
          size={42}
          color={myTheme.colors.purpleForce}
        />
        <Text
          style={[styles.titleStyle, { color: myTheme.colors.purpleForce }]}
        >
          Tasa de Cambio
        </Text>
      </View>
      <View style={{ marginBottom: 20, alignSelf: "center" }}>
        <Text style={[styles.textStyle, { color: myTheme.colors.Orange }]}>
          {`USD: $${store.tasa_usd}`}
        </Text>
        <Text style={[styles.textStyle, { color: myTheme.colors.Orange }]}>
          {`EUR: $${store.tasa_eur}`}
        </Text>
      </View>
      <Link
        href={"/modal/modalTasaCambio"}
        asChild
        push
        style={[
          styles.buttonStyle,
          { backgroundColor: myTheme.colors.purpleDark, alignSelf: "center" },
        ]}
      >
        <Pressable>
          <Text
            style={[styles.textButtonStyle, { color: myTheme.colors.primary }]}
          >
            ACTUALIZAR
          </Text>
        </Pressable>
      </Link>
    </View>
  );
};

export default CambioCard;

const styles = StyleSheet.create({
  cardStyle: {
    width: "100%",
    padding: 20,
    alignSelf: "center",
    marginTop: 12,
    borderRadius: 20,
  },
  titleStyle: {
    fontSize: 24,
    marginBottom: 10,
    marginLeft: 30,
  },
  textStyle: { fontSize: 22, fontWeight: "bold", fontSize: 28 },
  buttonStyle: {
    padding: 10,
    borderRadius: 10,
    width: "90%",
  },
  textButtonStyle: { fontSize: 22, textAlign: "center" },
});
