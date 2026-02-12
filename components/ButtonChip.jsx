import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { useTheme } from "react-native-paper";
import { Link } from "expo-router";

const ButtonChip = ({ text, href }) => {
  const myTheme = useTheme();
  return (
    <View
      style={{
        marginBottom: 10,
      }}
    >
      <Link href={href} push asChild>
        <TouchableOpacity
          style={{
            backgroundColor: myTheme.colors.greenLight,
            height: 40,
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 10,
          }}
        >
          <Text
            style={{
              color: myTheme.colors.greenForce,
              fontSize: 22,
              fontWeight: "bold",
            }}
          >
            {text}
          </Text>
        </TouchableOpacity>
      </Link>
    </View>
  );
};

export default ButtonChip;

const styles = StyleSheet.create({});
