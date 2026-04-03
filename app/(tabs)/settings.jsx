import { StyleSheet, Text, View } from "react-native";
import { ToolsBar } from "../../devTools/components/toolsBar";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const Settings = () => {
  const insets = useSafeAreaInsets();
  return (
    <View style={{ paddingTop: insets.top, flex: 1 }}>
      <Text>Settings</Text>
      <ToolsBar show="true" />
    </View>
  );
};

export default Settings;

const styles = StyleSheet.create({});
