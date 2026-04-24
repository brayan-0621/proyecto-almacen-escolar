import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    width: "100%",
    height: "100%",
    zIndex: 10,
  },

  background: {
    width: "100%",
    height: "100%",
  },

  darkLayer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.55)",
    justifyContent: "flex-start",
    alignItems: "center",
    paddingTop: 80,
  },

  menu: {
    width: "88%",
  },

  section: {
    color: "#fff",
    fontSize: 18,
    marginBottom: 10,
    marginTop: 15,
    fontWeight: "700",
    letterSpacing: 0.5,
  },

  fabContainer: {
    position: "absolute",
    right: 20,
    zIndex: 20,
  },
});
