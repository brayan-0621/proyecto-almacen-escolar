import { ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import KpiCard from "../../components/KpiCard";
import { styles } from "../../styles/dashboard.styles";

const kpis = [
  { label: "Productos", value: "48", icon: "📦", color: "#4CAF50" },
  { label: "Stock bajo", value: "6", icon: "📉", color: "#f44336" },
  { label: "Movimientos hoy", value: "12", icon: "🔄", color: "#2196F3" },
  { label: "Vendido hoy", value: "S/ 1,240", icon: "💰", color: "#FF9800" },
];

const movimientos = [
  {
    id: 1,
    tipo: "entrada",
    descripcion: "Cajas de cuadernos A4",
    cantidad: 50,
    monto: 750.0,
    fecha: "23/04/2026 08:30",
  },
  {
    id: 2,
    tipo: "salida",
    descripcion: "Cajas de lápices 2B",
    cantidad: 20,
    monto: 180.0,
    fecha: "23/04/2026 09:15",
  },
  {
    id: 3,
    tipo: "salida",
    descripcion: "Resmas de papel bond",
    cantidad: 30,
    monto: 310.0,
    fecha: "23/04/2026 10:00",
  },
  {
    id: 4,
    tipo: "entrada",
    descripcion: "Cajas de borradores",
    cantidad: 100,
    monto: 200.0,
    fecha: "23/04/2026 11:45",
  },
  {
    id: 5,
    tipo: "salida",
    descripcion: "Cajas de plumones",
    cantidad: 15,
    monto: 225.0,
    fecha: "23/04/2026 13:20",
  },
];

const alertas = [
  { id: 1, producto: "Cajas de tijeras escolares", stock: 3, minimo: 10 },
  { id: 2, producto: "Cajas de pegamento en barra", stock: 5, minimo: 10 },
  { id: 3, producto: "Cajas de reglas 30cm", stock: 2, minimo: 10 },
  { id: 4, producto: "Cajas de sacapuntas", stock: 7, minimo: 10 },
];

export default function Dashboard() {
  const insets = useSafeAreaInsets();

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[
        styles.content,
        { paddingBottom: insets.bottom + 100 },
      ]}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.greeting}>Buenos días, Brayan 👋</Text>
      <Text style={styles.date}>Jueves, 23 de abril del 2026</Text>

      <Text style={styles.sectionTitle}>Resumen</Text>
      <View style={styles.kpiGrid}>
        {kpis.map((kpi, i) => (
          <KpiCard key={i} {...kpi} />
        ))}
      </View>

      <Text style={styles.sectionTitle}>⚠️ Alertas de Stock</Text>
      <View style={styles.card}>
        {alertas.map((a, i) => (
          <View
            key={a.id}
            style={[
              styles.alertRow,
              i === alertas.length - 1 && { borderBottomWidth: 0 },
            ]}
          >
            <View style={styles.alertLeft}>
              <Text style={styles.alertProduct} numberOfLines={1}>
                {a.producto}
              </Text>
              <Text style={styles.alertSub}>Mínimo: {a.minimo} cajas</Text>
            </View>
            <View style={styles.alertBadge}>
              <Text style={styles.alertBadgeText}>{a.stock}</Text>
            </View>
          </View>
        ))}
      </View>

      <Text style={styles.sectionTitle}>🔄 Movimientos Recientes</Text>
      <View style={styles.card}>
        {movimientos.map((m, i) => (
          <View
            key={m.id}
            style={[
              styles.movRow,
              i === movimientos.length - 1 && { borderBottomWidth: 0 },
            ]}
          >
            <View
              style={[
                styles.tipoBadge,
                m.tipo === "entrada" ? styles.entrada : styles.salida,
              ]}
            >
              <Text style={styles.tipoText}>
                {m.tipo === "entrada" ? "▲" : "▼"}
              </Text>
              <Text style={styles.tipoText}>
                {m.tipo === "entrada" ? "Entrada" : "Salida"}
              </Text>
            </View>
            <View style={styles.movInfo}>
              <Text style={styles.movDesc} numberOfLines={2}>
                {m.descripcion}
              </Text>
              <Text style={styles.movFecha}>{m.fecha}</Text>
            </View>
            <View style={styles.movRight}>
              <Text style={styles.movMonto}>S/ {m.monto.toFixed(2)}</Text>
              <Text style={styles.movCantidad}>{m.cantidad} cajas</Text>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}
