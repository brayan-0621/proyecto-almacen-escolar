import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

type Props = {
  nombre: string;
  categoria: string;
  codigo: string;
  stock: number;
  stock_minimo: number;
  precio_venta: number;
  onPress: () => void;
};

export default function ProductoCard({
  nombre,
  categoria,
  codigo,
  stock,
  stock_minimo,
  precio_venta,
  onPress,
}: Props) {
  const stockBajo = stock <= stock_minimo;

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={[styles.avatar, stockBajo && styles.avatarAlerta]}>
        <Text style={styles.avatarText}>{nombre.charAt(0).toUpperCase()}</Text>
      </View>
      <View style={styles.info}>
        <Text style={styles.nombre} numberOfLines={1}>
          {nombre}
        </Text>
        <Text style={styles.sub} numberOfLines={1}>
          📂 {categoria}
        </Text>
        <View style={styles.row}>
          <Text style={styles.badge}>Cód: {codigo}</Text>
          <Text style={[styles.badge, stockBajo && styles.badgeAlerta]}>
            {stockBajo ? "⚠️" : "📦"} Stock: {stock}
          </Text>
          <Text style={styles.badge}>S/ {precio_venta.toFixed(2)}</Text>
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
    backgroundColor: "#4CAF50",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  avatarAlerta: { backgroundColor: "#f44336" },
  avatarText: { color: "#fff", fontSize: 20, fontWeight: "700" },
  info: { flex: 1 },
  nombre: { fontSize: 15, fontWeight: "700", color: "#333", marginBottom: 2 },
  sub: { fontSize: 12, color: "#888", marginBottom: 4 },
  row: { flexDirection: "row", gap: 6, flexWrap: "wrap" },
  badge: {
    fontSize: 11,
    color: "#555",
    backgroundColor: "#f0f0f0",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  badgeAlerta: { backgroundColor: "#fdecea", color: "#f44336" },
  arrow: { fontSize: 22, color: "#4CAF50", fontWeight: "bold", marginLeft: 8 },
});
