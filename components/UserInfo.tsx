import { Image, StyleSheet, Text, View } from "react-native";

type Props = {
  name: string;
};

export default function UserInfo({ name }: Props) {
  return (
    <View style={styles.userSection}>
      <Image source={require("../assets/user.png")} style={styles.avatar} />
      <Text style={styles.name} numberOfLines={1}>
        {name}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  userSection: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },

  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    marginRight: 10,
  },

  name: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    flexShrink: 1,
  },
});
