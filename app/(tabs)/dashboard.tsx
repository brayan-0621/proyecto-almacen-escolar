import { useState } from "react";
import {
  ActivityIndicator,
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import KpiCard from "../../components/KpiCard";
import { useDashboard } from "../../hooks/useDashboard";
import { useMovimientos } from "../../hooks/useMovimientos";
import { useProductos } from "../../hooks/useProductos";
import { logger } from "../../services/logger";
import { styles } from "../../styles/dashboard.styles";

export default function Dashboard() {
  const [logsVisible, setLogsVisible] = useState(false);
  const historial = logger.getHistorial();
  const insets = useSafeAreaInsets();
  const { kpis, loading: loadingKpis, error: errorKpis } = useDashboard();
  const {
    movimientos,
    loading: loadingMov,
    slowApi: slowMov,
    ultimaDuracionMs: msMov,
  } = useMovimientos();
  const {
    productos,
    slowApi: slowProd,
    ultimaDuracionMs: msProd,
  } = useProductos();

  const hayCargaLenta = slowProd || slowMov;

  const rendimientoCards = [
    {
      label: "Carga productos",
      value: msProd !== null ? `${msProd} ms` : "...",
      icon: "📦",
      color: slowProd ? "#f44336" : "#2196F3",
    },
    {
      label: "Carga movimientos",
      value: msMov !== null ? `${msMov} ms` : "...",
      icon: "🔄",
      color: slowMov ? "#f44336" : "#2196F3",
    },
    {
      label: "Ítems cargados",
      value: String(productos.length + movimientos.length),
      icon: "🧮",
      color: "#4CAF50",
    },
  ];

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

      <Text style={styles.sectionTitle}>⚡ Rendimiento</Text>
      <View style={styles.kpiGrid}>
        {rendimientoCards.map((kpi, i) => (
          <KpiCard key={i} {...kpi} />
        ))}
      </View>
      {hayCargaLenta && (
        <Text
          style={{
            color: "#f44336",
            textAlign: "center",
            padding: 6,
            marginTop: -12,
            marginBottom: 12,
            fontSize: 12,
            fontWeight: "700",
          }}
        >
          🐢 Carga lenta detectada (más de 2000 ms)
        </Text>
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
      <Modal
        visible={logsVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setLogsVisible(false)}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.4)",
            justifyContent: "flex-end",
          }}
        >
          <View
            style={{
              backgroundColor: "#fff",
              borderTopLeftRadius: 16,
              borderTopRightRadius: 16,
              maxHeight: "70%",
              padding: 16,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 12,
              }}
            >
              <Text style={{ fontSize: 16, fontWeight: "700", color: "#333" }}>
                Registro de logs
              </Text>
              <TouchableOpacity onPress={() => setLogsVisible(false)}>
                <Text style={{ fontSize: 18 }}>✕</Text>
              </TouchableOpacity>
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
              {historial.length === 0 ? (
                <Text
                  style={{ color: "#888", textAlign: "center", padding: 16 }}
                >
                  Sin logs registrados aún
                </Text>
              ) : (
                historial.map((log, i) => (
                  <View
                    key={i}
                    style={{
                      paddingVertical: 8,
                      borderBottomWidth: 1,
                      borderBottomColor: "#f0f0f0",
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 11,
                        fontWeight: "800",
                        color:
                          log.nivel === "ERROR"
                            ? "#f44336"
                            : log.nivel === "WARN"
                              ? "#FF9800"
                              : "#2196F3",
                      }}
                    >
                      [{log.nivel}] {log.hora}
                    </Text>
                    <Text style={{ fontSize: 13, color: "#333", marginTop: 2 }}>
                      {log.mensaje}
                    </Text>
                  </View>
                ))
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}
