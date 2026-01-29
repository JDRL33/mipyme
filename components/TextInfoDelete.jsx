import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { useTheme } from "react-native-paper";

const TextInfoDelete = ({
  text = "Para eliminar mantén el proveedor presionado.",
}) => {
  const myTheme = useTheme();
  return (
    <Text
      style={[
        styles.text,
        {
          color: myTheme.colors.textSecondary,
        },
      ]}
    >
      {text}
    </Text>
  );
};

export default TextInfoDelete;

const styles = StyleSheet.create({
  text: { textAlign: "center", marginBottom: 10 },
});
