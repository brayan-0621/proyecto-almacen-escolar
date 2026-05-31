import { ActivityIndicator, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import KpiCard from "../../components/KpiCard";
import { useDashboard } from "../../hooks/useDashboard";
import { useMovimientos } from "../../hooks/useMovimientos";
import { styles } from "../../styles/dashboard.styles";

export default function Dashboard() {
  const insets = useSafeAreaInsets();
  const { kpis, loading: loadingKpis, error: errorKpis } = useDashboard();
  const { movimientos, loading: loadingMov } = useMovimientos();

  const kpiCards = [
    {
      label: "Productos",
      value: loadingKpis ? "..." : String(kpis?.total_productos ?? 0),
      icon: "📦",
      color: "#4CAF50",
    },
    {
      label: "Stock bajo",
      value: loadingKpis ? "..." : String(kpis?.bajo_stock ?? 0),
      icon: "📉",
      color: "#f44336",
    },
    {
      label: "Movimientos hoy",
      value: loadingKpis ? "..." : String(kpis?.mov_hoy ?? 0),
      icon: "🔄",
      color: "#2196F3",
    },
    {
      label: "Vendido hoy",
      value: loadingKpis
        ? "..."
        : `S/ ${Number(kpis?.vendido_hoy ?? 0).toFixed(2)}`,
      icon: "💰",
      color: "#FF9800",
    },
  ];

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[
        styles.content,
        { paddingBottom: insets.bottom + 100 },
      ]}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.greeting}>Bienvenido 👋</Text>

      {errorKpis && (
        <Text
          style={{
            color: "#e67e22",
            textAlign: "center",
            padding: 8,
            fontSize: 13,
          }}
        >
          ⚠️ Sin conexión. Datos pueden no estar actualizados.
        </Text>
      )}

      {/* KPIs */}
      <Text style={styles.sectionTitle}>Resumen</Text>
      {loadingKpis ? (
        <ActivityIndicator
          size="large"
          color="#2e6da4"
          style={{ marginVertical: 20 }}
        />
      ) : (
        <View style={styles.kpiGrid}>
          {kpiCards.map((kpi, i) => (
            <KpiCard key={i} {...kpi} />
          ))}
        </View>
      )}

      {/* Movimientos recientes */}
      <Text style={styles.sectionTitle}>🔄 Movimientos Recientes</Text>
      {loadingMov ? (
        <ActivityIndicator
          size="small"
          color="#2e6da4"
          style={{ marginBottom: 12 }}
        />
      ) : (
        <View style={styles.card}>
          {movimientos.length === 0 ? (
            <Text style={{ textAlign: "center", color: "#888", padding: 16 }}>
              No hay movimientos registrados
            </Text>
          ) : (
            movimientos.slice(0, 5).map((m, i) => (
              <View
                key={m.id}
                style={[
                  styles.movRow,
                  i === Math.min(movimientos.length, 5) - 1 && {
                    borderBottomWidth: 0,
                  },
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
                  <Text style={styles.movFecha}>
                    {m.fecha
                      ? new Date(m.fecha).toLocaleDateString("es-PE")
                      : ""}
                  </Text>
                </View>
                <View style={styles.movRight}>
                  <Text style={styles.movMonto}>
                    S/ {Number(m.monto ?? 0).toFixed(2)}
                  </Text>
                </View>
              </View>
            ))
          )}
        </View>
      )}
    </ScrollView>
  );
}
