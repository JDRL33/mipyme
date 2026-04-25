import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { Stack, useLocalSearchParams } from "expo-router";
import { getClientById } from "../../database/database";
import Title from "../../components/Title";

const client_info = () => {
  const params = useLocalSearchParams();
  const [client, setClient] = useState();
  useEffect(() => {
    const start = async () => {
      setClient(await getClientById(params.id));
    };
    start();
    console.log(client);
  }, []);
  return (
    <View>
      <Stack.Screen options={{ title: "Deudas de " + params.name }} />
      {/* <Title>Deudas de params</Title> */}
    </View>
  );
};

export default client_info;

const styles = StyleSheet.create({});
