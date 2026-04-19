import React, { useState } from "react";
import { Pressable, StyleSheet, Text, View, Modal } from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useTheme } from "react-native-paper";
import { useRouter } from "expo-router";

const CardClient = ({ id, nombre, ci, cup, usd }) => {
  const myTheme = useTheme();
  const router = useRouter();
  return (
    <>
      <Pressable
        style={[
          styles.cardClient,
          { backgroundColor: myTheme.colors.greenLight },
        ]}
        onPress={() => {
          router.push({
            pathname: "client_info",
            params: { id_client: id, name: nombre },
          });
        }}
        onLongPress={() => {}}
      >
        <View
          style={[styles.box, { backgroundColor: myTheme.colors.greenForce }]}
        >
          <FontAwesome name="user" size={70} color="white" />
        </View>
        <View style={[styles.bodyText]}>
          <Text
            style={{
              color: myTheme.colors.textPrimary,
              fontSize: 20,
              fontWeight: "bold",
            }}
          >
            {nombre}
          </Text>
          <Text style={{ color: myTheme.colors.textSecondary, fontSize: 16 }}>
            CI: {ci}
          </Text>
          <View style={{ flexDirection: "row", gap: 15 }}>
            <Text
              style={[styles.textMoneda, { color: myTheme.colors.redForce }]}
            >
              CUP: {cup}
            </Text>
            <Text
              style={[styles.textMoneda, { color: myTheme.colors.purpleForce }]}
            >
              USD: {usd}
            </Text>
          </View>
        </View>
      </Pressable>
    </>
  );
};

export default CardClient;

const styles = StyleSheet.create({
  cardClient: {
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
  textMoneda: {
    fontSize: 20,
  },
});
