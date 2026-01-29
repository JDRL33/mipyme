import { StyleSheet, Text, View } from "react-native";
import { FAB, useTheme } from "react-native-paper";
import React from "react";

const FabButton = ({ onClick }) => {
  const myTheme = useTheme();
  return (
    <FAB
      icon="storefront-plus-outline"
      color={myTheme.colors.greenForce}
      style={[styles.fabStyle, { backgroundColor: myTheme.colors.greenLight }]}
      animated
      size="medium"
      onPress={onClick}
    />
  );
};

export default FabButton;

const styles = StyleSheet.create({
  fabStyle: {
    position: "absolute",
    right: 20,
    bottom: 20,
    borderRadius: 40,
  },
});
