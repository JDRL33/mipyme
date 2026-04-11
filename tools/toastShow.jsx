import Toast from "react-native-toast-message";

function toastShow(text, type) {
  Toast.show({
    type: type,
    text1: text,
    position: "top",
    visibilityTime: 2000,
  });
}

export default toastShow;
