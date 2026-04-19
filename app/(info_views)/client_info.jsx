import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { Stack, useLocalSearchParams } from "expo-router";
import { getClientById } from "../../database/database";

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
      <Stack.Screen options={{ title: params.name }} />
      <Text>client_info</Text>
    </View>
  );
};

export default client_info;

const styles = StyleSheet.create({});
