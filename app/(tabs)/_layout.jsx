import { useSafeAreaInsets } from "react-native-safe-area-context";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Feather from "@expo/vector-icons/Feather";
import { StyleSheet, View } from "react-native";
import { useTheme } from "react-native-paper";
import { Tabs } from "expo-router";

const TabsLayout = () => {
  const myTheme = useTheme();
  const insets = useSafeAreaInsets();
  return (
    <View
      style={{
        backgroundColor: myTheme.colors.primary,
        // paddingTop: 10,
        flex: 1,
      }}
    >
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: myTheme.colors.greenForce,
          tabBarStyle: {
            backgroundColor: myTheme.colors.primary,
            borderColor: myTheme.colors.primary,
            // height: 70,
          },
          tabBarItemStyle: {
            padding: 0,
          },
          tabBarLabelStyle: {
            fontSize: 12,
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            headerShown: false,
            title: "Inicio",
            tabBarIcon: ({ color }) => (
              <FontAwesome size={28} name="home" color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="products"
          options={{
            headerShown: false,
            title: "Productos",
            tabBarIcon: ({ color }) => (
              <Feather name="package" size={28} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="proveedor"
          options={{
            headerShown: false,
            title: "Proveedores",
            tabBarIcon: ({ color }) => (
              <Feather name="truck" size={28} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="clients"
          options={{
            headerShown: false,
            title: "Clientes",
            tabBarIcon: ({ color }) => (
              <Feather name="users" size={28} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            headerShown: false,
            title: "Ajustes",
            tabBarIcon: ({ color }) => (
              <Feather name="settings" size={28} color={color} />
            ),
          }}
        />
      </Tabs>
    </View>
  );
};

export default TabsLayout;

const styles = StyleSheet.create({});
