import { StyleSheet, Text, View } from "react-native";
import { ToolsBar } from "../../devTools/components/toolsBar";

const Settings = () => {
  return (
    <View style={{flex:1}}>
      <Text>Settings</Text>
      <ToolsBar show="true" />
    </View>
  );
};

export default Settings;

const styles = StyleSheet.create({});
