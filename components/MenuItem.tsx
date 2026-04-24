import { StyleSheet, Text, TouchableOpacity } from "react-native";

type Props = {
  text: string;
  onPress: () => void;
};

export default function MenuItem({ text, onPress }: Props) {
  return (
    <TouchableOpacity style={styles.option} onPress={onPress}>
      <Text style={styles.optionText}>{text}</Text>
      <Text style={styles.arrow}>›</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  option: {
    backgroundColor: "#ffffff",
    paddingVertical: 18,
    paddingHorizontal: 18,
    borderRadius: 16,
    marginBottom: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderLeftWidth: 6,
    borderLeftColor: "#B5C99A",
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 4,
  },

  optionText: {
    fontSize: 17,
    fontWeight: "600",
    color: "#333",
  },

  arrow: {
    color: "#B5C99A",
    fontSize: 20,
    fontWeight: "bold",
  },
});
