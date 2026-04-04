import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { useTheme, ActivityIndicator, Button } from "react-native-paper";
import * as SplashScreen from "expo-splash-screen";
import Toast from "react-native-toast-message";
import { initDatabase } from "../database/database";
import { useRouter } from "expo-router";

const index = () => {
  const myTheme = useTheme();
  const router = useRouter();

  const [start, setStart] = useState(false);

  useEffect(() => {
    async function doAsyncStuff() {
      try {
        await initDatabase();
      } catch (e) {
        console.warn(e);
      } finally {
        setStart(true);
      }
    }

    doAsyncStuff();
  }, []);

  useEffect(() => {
    if (start) {
      //   SplashScreen.hide();
      //   router.prefetch("(tabs)/home");
    }
  }, [start]);

  return (
    <View
      style={{
        backgroundColor: myTheme.colors.primary,
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text style={{ fontSize: 38, marginBottom: 20 }}>InVentas</Text>
      {start ? (
        <Button
          mode="contained"
          buttonColor={myTheme.colors.greenForce}
          textColor="white"
          onPress={() => {
            router.replace("(tabs)/home");
          }}
        >
          <Text>Comenzar</Text>
        </Button>
      ) : (
        <ActivityIndicator size="large" color="#00ff00" />
      )}
    </View>
  );
};

export default index;

const styles = StyleSheet.create({});
