import { StyleSheet, Text, View } from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useTheme } from "react-native-paper";

const InfoProviderText = ({ textPrimary, textSecondary }) => {
  const myTheme = useTheme();
  return (
    <View>
      <View
        style={{
          paddingVertical: 5,
          paddingHorizontal: 20,
          flexDirection: "row",
          width: "100%",
          justifyContent: "space-between",
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
          <FontAwesome
            name="circle"
            size={10}
            color={myTheme.colors.greenForce}
          />
          <Text style={{ color: myTheme.colors.textPrimary, fontSize: 18 }}>
            {textPrimary}
          </Text>
        </View>
        <Text style={{ color: myTheme.colors.textPrimary, fontSize: 18 }}>
          {textSecondary}
        </Text>
      </View>
    </View>
  );
};

export default InfoProviderText;

const styles = StyleSheet.create({});
