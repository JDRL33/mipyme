import { StyleSheet, Text, View } from "react-native";
import React from "react";

const Title = ({ style = null, text = "Title" }) => {
  return <Text style={[styles.title, style]}>{text}</Text>;
};

export default Title;

const styles = StyleSheet.create({
  title: {
    fontSize: 28,
    fontWeight: "bold",
  },
});
