import { Image, StyleSheet, Text, View } from "react-native";
import React, { useState, useEffect, useCallback } from "react";
import { useTheme } from "react-native-paper";
import Feather from "@expo/vector-icons/Feather";
import { useFocusEffect } from "expo-router";

const Header = ({ title, start = false }) => {
  const myTheme = useTheme();
  const [date, setDate] = useState(new Date());

  useFocusEffect(
    useCallback(() => {
      // Crear intervalo que se actualiza cada segundo
      const intervalo = setInterval(() => {
        setDate(new Date());
      }, 1000);

      // Limpiar el intervalo al desmontar el componente
      return () => clearInterval(intervalo);
    }, []),
  );

  return (
    <View style={[styles.header]}>
      <View style={styles.headerLeft}>
        {start && (
          <Text style={{ color: myTheme.colors.textSecondary, fontSize: 30 }}>
            Hola!
          </Text>
        )}
        <Text
          style={[styles.headerTitle, { color: myTheme.colors.textPrimary }]}
        >
          {title}
          {start && (
            <Feather name="award" size={20} color={myTheme.colors.greenForce} />
          )}
        </Text>
        {start && (
          <Text style={{ color: myTheme.colors.textSecondary, fontSize: 19 }}>
            Bienvenido de vuelta
          </Text>
        )}
      </View>
      <View
        style={[
          styles.headerRight,
          { flexDirection: "column", alignItems: "center" },
        ]}
      >
        <Feather name="clock" size={50} color={myTheme.colors.greenForce} />
        <Text
          style={[
            styles.headerDateAndHours,
            { color: myTheme.colors.textSecondary },
          ]}
        >
          {date.toLocaleDateString()}
        </Text>
        <Text
          style={[
            styles.headerDateAndHours,
            { color: myTheme.colors.textSecondary },
          ]}
        >
          {date.toLocaleTimeString()}
        </Text>
      </View>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  header: {
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 30,
    paddingHorizontal: 15,
  },
  headerLeft: {
    alignItems: "flex-start",
    flexDirection: "column",
  },
  headerTitle: {
    fontSize: 34,
    fontWeight: "bold",
  },
  headerDateAndHours: {
    fontSize: 18,
    textAlign: "center",
  },
});
