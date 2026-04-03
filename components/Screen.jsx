import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "react-native-paper";

const Screen = ({ children, style = null, ...ViewProps }) => {
  const insets = useSafeAreaInsets();
  const myTheme = useTheme();
  return (
    <View
      style={[
        { paddingTop: insets.top, backgroundColor: myTheme.colors.primary },
        style,
        styles.parent,
      ]}
      {...ViewProps}
    >
      {children}
    </View>
  );
};

export default Screen;

const styles = StyleSheet.create({
  parent: {
    flex: 1,
    // justifyContent: "center",
    alignItems: "center",
  },
});
