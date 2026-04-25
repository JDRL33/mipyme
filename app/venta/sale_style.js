import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  ticketScrollView: {
    padding: 20,
    marginTop: 20,
    shadowRadius: 10,
    borderRadius: 10,
    shadowOpacity: 0.3,
  },
  ticketHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  subTitle: { marginTop: 20, marginBottom: 10, fontWeight: "bold" },
  previewVent: {
    marginTop: 20,
    padding: 10,
    borderRadius: 15,
  },
  actionTypeOfPay: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 20,
  },
  pickerTypeOfPay: { flex: 1, color: "black", paddingHorizontal: 5 },
  deudPay: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 20,
  },
  pickerDeudPay: {
    flex: 1,
    backgroundColor: "white",
    color: "black",
    paddingHorizontal: 5,
    borderRadius: 30,
  },
  parentButtonsOkAndCancel: {
    gap: 5,
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "space-around",
  },
  actionButton: {
    borderRadius: 10,
    borderWidth: 2,
  },
  buttonText: { fontWeight: "bold", fontSize: 15 },
  pickerCreateClient: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 5,
  },
});
