import { Dimensions, StyleSheet, Text, TouchableOpacity } from "react-native";

type Props = {
  open: boolean;
  onPress: () => void;
};

const { width } = Dimensions.get("window");
const size = width * 0.16;

export default function FabButton({ open, onPress }: Props) {
  return (
    <TouchableOpacity
      style={[
        styles.fab,
        { width: size, height: size, borderRadius: size / 2 },
      ]}
      onPress={onPress}
    >
      <Text style={styles.icon}>{open ? "–" : "+"}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  fab: {
    backgroundColor: "#f4a261",
    justifyContent: "center",
    alignItems: "center",
    elevation: 8,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 6,
  },

  icon: {
    color: "#fff",
    fontSize: 30,
    fontWeight: "bold",
  },
});
