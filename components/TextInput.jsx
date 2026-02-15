import { StyleSheet, TextInput } from "react-native";
import React from "react";
import { useTheme } from "react-native-paper";

const TextInputComponent = ({
  textInput,
  setTextInput,
  placeHolder,
  keyboardType,
  style,
}) => {
  const myTheme = useTheme();
  return (
    <TextInput
      value={textInput}
      onChangeText={(text) => {
        setTextInput(text);
      }}
      keyboardType={keyboardType}
      cursorColor={myTheme.colors.greenForce}
      selectionColor={myTheme.colors.greenForce}
      placeholderTextColor={myTheme.colors.textSecondary}
      placeholder={placeHolder}
      style={[
        styles.textInputStyle,
        {
          backgroundColor: myTheme.colors.grayLight,
          marginBottom: 10,
        },
        style,
      ]}
    />
  );
};

export default TextInputComponent;

const styles = StyleSheet.create({
  textInputStyle: {
    padding: 15,
    borderRadius: 15,
    fontSize: 20,
  },
});
