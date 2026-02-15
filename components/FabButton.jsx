import { StyleSheet } from "react-native";
import { FAB, useTheme } from "react-native-paper";
import React from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const FabButton = ({ onClick, paperIcon = "storefront-plus-outline" }) => {
  const insets = useSafeAreaInsets();
  const myTheme = useTheme();
  return (
    <FAB
      icon={paperIcon}
      color={myTheme.colors.greenForce}
      style={[
        styles.fabStyle,
        {
          backgroundColor: myTheme.colors.greenLight,
          marginBottom: insets.bottom,
        },
      ]}
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
