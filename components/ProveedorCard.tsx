import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const { width } = Dimensions.get("window");

type Props = {
  nombre: string;
  razon_social: string;
  ruc: string;
  telefono?: string;
  email?: string;
  direccion?: string;
  onPress: () => void;
};

export default function ProveedorCard({
  nombre,
  razon_social,
  ruc,
  telefono,
  email,
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
        <Text style={styles.razonSocial} numberOfLines={1}>
          🏢 {razon_social}
        </Text>
        <View style={styles.row}>
          <Text style={styles.badge}>RUC: {ruc}</Text>
          {telefono ? <Text style={styles.badge}>📞 {telefono}</Text> : null}
          {email ? <Text style={styles.badge}>✉️ {email}</Text> : null}
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
    backgroundColor: "#f4a261",
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
    fontSize: width * 0.038,
    fontWeight: "700",
    color: "#333",
    marginBottom: 2,
  },

  razonSocial: {
    fontSize: width * 0.03,
    color: "#888",
    marginBottom: 4,
  },

  row: {
    flexDirection: "row",
    gap: 6,
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
    color: "#f4a261",
    fontWeight: "bold",
    marginLeft: 8,
  },
});
