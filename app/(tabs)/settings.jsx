import { StyleSheet, Text, View } from "react-native";
import { ToolsBar } from "../../devTools/components/toolsBar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Title from "../../components/Title";
import Screen from "../../components/Screen";
import { useTheme } from "react-native-paper";

const Settings = () => {
  const myTheme = useTheme();
  return (
    <Screen style={[styles.parent, {}]}>
      <Title text="Configuraciones" />
      {/* <ToolsBar /> */}
      <View
        style={{
          backgroundColor: myTheme.colors.blueLight,
          borderRadius: 10,
          elevation: 10,
          width: "100%",
          padding: 10,
          height: 70,
        }}
      >
        <View
          style={{
            backgroundColor: "white",
            borderRadius: 10,
            height: 50,
            width: 60,
          }}
        ></View>
      </View>
    </Screen>
  );
};

export default Settings;

const styles = StyleSheet.create({
  parent: {
    paddingHorizontal: 20,
    gap: 20,
  },
});
