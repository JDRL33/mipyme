import { StyleSheet, Text, View } from "react-native";
import React from "react";
import Feather from "@expo/vector-icons/Feather";
import { useTheme } from "react-native-paper";

const EmptyList = ({ text, icon }) => {
  const myTheme = useTheme();
  return (
    <View style={styles.main}>
      <Feather name={icon} size={25} color={myTheme.colors.redForce} />
      <Text style={{ color: myTheme.colors.textPrimary, fontSize: 20 }}>
        {text}
      </Text>
    </View>
  );
};

export default EmptyList;

const styles = StyleSheet.create({
  main: {
    flexDirection: "row",
    gap: 10,
    justifyContent: "center",
    alignItems: "center",
  },
});
