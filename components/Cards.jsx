import { StyleSheet, Text, View, Image } from "react-native";
import React from "react";
import { useTheme } from "react-native-paper";
import Feather from "@expo/vector-icons/Feather";
import FontAwesome from "@expo/vector-icons/FontAwesome";

export const CardInfo = ({
  textHeader,
  textBody,
  money = false,
  icon,
  color,
}) => {
  const myTheme = useTheme();
  const colors = [
    myTheme.colors.greenLight,
    myTheme.colors.redLight,
    myTheme.colors.blueLight,
    myTheme.colors.yellowLight,
    myTheme.colors.purpleLight,
  ];
  const icons = [
    <Feather name="package" size={36} color={myTheme.colors.blueForce} />,
    <Feather
      name="shopping-cart"
      size={36}
      color={myTheme.colors.greenForce}
    />,
    <Feather name="bar-chart" size={36} color={myTheme.colors.redForce} />,
    <FontAwesome name="money" size={36} color={myTheme.colors.greenForce} />,
    <Feather name="user" size={36} color={myTheme.colors.greenForce} />,
    <Feather name="users" size={36} color={myTheme.colors.redForce} />,
    <Feather
      name="alert-triangle"
      size={36}
      color={myTheme.colors.yellowForce}
    />,
  ];

  return (
    <View style={[stylesCards.card, { backgroundColor: colors[color] }]}>
      <View style={{ alignSelf: "flex-start" }}>{icons[icon]}</View>
      <Text
        style={[stylesCards.textBody, { color: myTheme.colors.textPrimary }]}
      >
        {money ? "$" : ""}
        {textBody}
      </Text>
      <Text
        style={[
          stylesCards.textHeader,
          { color: myTheme.colors.textSecondary },
        ]}
      >
        {textHeader}
      </Text>
    </View>
  );
};

export const CardActionsSpeed = ({ color, text, icon }) => {
  const myTheme = useTheme();
  const colors = [
    { background: myTheme.colors.greenLight, text: myTheme.colors.greenForce },
    { background: myTheme.colors.greenForce, text: myTheme.colors.greenLight },
  ];
  const icons = [
    <FontAwesome name="plus-circle" size={42} color={myTheme.colors.primary} />,
    <Feather name="package" size={42} color={myTheme.colors.greenForce} />,
  ];
  return (
    <View
      style={[stylesCards.card, { backgroundColor: colors[color].background }]}
    >
      <View>{icons[icon]}</View>
      <Text
        style={{
          marginTop: 10,
          fontSize: 18,
          fontWeight: "bold",
          color: colors[color].text,
        }}
      >
        {text}
      </Text>
    </View>
  );
};

const stylesCards = StyleSheet.create({
  card: {
    alignItems: "center",
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 40,
    width: "48%",
    marginBottom: 15,
    height: 140,
    justifyContent: "center",
  },
  textHeader: {
    fontSize: 18,
  },
  textBody: {
    fontWeight: "bold",
    fontSize: 35,
  },
});
