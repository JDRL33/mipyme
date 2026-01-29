import React from "react";
import { MD3LightTheme as DefaultTheme } from "react-native-paper";

const theme = {
  ...DefaultTheme,
  // Specify custom property
  myOwnProperty: true,
  // Specify custom property in nested object
  colors: {
    primary: "#ffffff",
    blueForce: "#2971eefa",
    blueLight: "#DFF2FF",
    greenForce: "#3dd147",
    greenLight: "#DBFFDB",
    redForce: "#C45555",
    redLight: "#FFE6E6",
    yellowForce: "#df8613",
    yellowLight: "#ffe9bf",
    purpleForce: "#DB0972",
    purpleLight: "#FBC5FF",
    purpleDark: "#D575A5",
    // Textos
    textPrimary: "#000000",
    textSecondary: "#8B8B8B",

    //Esclas grices
    grayLight: "#F5F5F5",
    grayForce: "#d1d1d1",
  },
};

export default theme;
