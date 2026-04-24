import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

type Props = {
  nombre: string;
  empresa?: string;
  dni?: string;
  telefono?: string;
  onPress: () => void;
};

export default function ClienteCard({
  nombre,
  empresa,
  dni,
  telefono,
  onPress,
}: Props) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{nombre.charAt(0).toUpperCase()}</Text>
      </View>
      <View style={styles.info}>
        <Text style={styles.nombre} numberOfLines={1}>
          {nombre}
        </Text>
        {empresa ? (
          <Text style={styles.sub} numberOfLines={1}>
            🏢 {empresa}
          </Text>
        ) : null}
        <View style={styles.row}>
          {dni ? <Text style={styles.badge}>DNI: {dni}</Text> : null}
          {telefono ? <Text style={styles.badge}>📞 {telefono}</Text> : null}
        </View>
      </View>
      <Text style={styles.arrow}>›</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },

  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#B5C99A",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },

  avatarText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
  },

  info: {
    flex: 1,
  },

  nombre: {
    fontSize: 15,
    fontWeight: "700",
    color: "#333",
    marginBottom: 2,
  },

  sub: {
    fontSize: 12,
    color: "#888",
    marginBottom: 4,
  },

  row: {
    flexDirection: "row",
    gap: 8,
    flexWrap: "wrap",
  },

  badge: {
    fontSize: 11,
    color: "#555",
    backgroundColor: "#f0f0f0",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },

  arrow: {
    fontSize: 22,
    color: "#B5C99A",
    fontWeight: "bold",
    marginLeft: 8,
  },
});
