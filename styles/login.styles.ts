import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  background: {
    flex: 1,
  },

  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },

  card: {
    backgroundColor: "rgba(255,255,255,0.75)",
    borderRadius: 16,
    padding: 24,
  },

  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
    textAlign: "center",
  },

  error: {
    color: "red",
    marginBottom: 10,
    textAlign: "center",
  },

  hint: {
    marginTop: 15,
    textAlign: "center",
    color: "#555",
  },
});
