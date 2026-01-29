import { StyleSheet, Text, View, Pressable } from "react-native";
import React from "react";
import { useTheme } from "react-native-paper";
import { useRouter } from "expo-router";

const ButtonsModal = ({ handleSave }) => {
  const router = useRouter();
  const myTheme = useTheme();
  return (
    <View style={{ gap: 10 }}>
      <Pressable
        style={({ pressed }) => [
          styles.btnStyle,
          {
            backgroundColor: !pressed
              ? myTheme.colors.greenLight
              : myTheme.colors.greenForce,
          },
        ]}
        onPress={handleSave}
      >
        {({ pressed }) => (
          <Text
            style={[
              styles.textBtnStyle,
              {
                color: !pressed
                  ? myTheme.colors.greenForce
                  : myTheme.colors.greenLight,
              },
            ]}
          >
            Guardar
          </Text>
        )}
      </Pressable>
      <Pressable
        style={({ pressed }) => [
          styles.btnStyle,
          {
            backgroundColor: pressed
              ? myTheme.colors.redLight
              : myTheme.colors.redForce,
          },
        ]}
        onPress={() => {
          router.back();
        }}
      >
        {({ pressed }) => (
          <Text
            style={[
              styles.textBtnStyle,
              {
                color: !pressed
                  ? myTheme.colors.redLight
                  : myTheme.colors.redForce,
              },
            ]}
          >
            Cancelar
          </Text>
        )}
      </Pressable>
    </View>
  );
};

export default ButtonsModal;

const styles = StyleSheet.create({
  btnStyle: {
    width: 280,
    padding: 10,
    borderRadius: 15,
  },
  textBtnStyle: {
    fontSize: 24,
    textAlign: "center",
  },
});
