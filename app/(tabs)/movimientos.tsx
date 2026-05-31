import { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import FormButton from "../../components/FormButton";
import FormInput from "../../components/FormInput";
import { useMovimientos } from "../../hooks/useMovimientos";
import { styles } from "../../styles/movimientos.styles";

type FormMovimiento = {
  tipo: "entrada" | "salida";
  descripcion: string;
  cantidad: string;
  monto: string;
  referencia: string;
};

const ITEMS_POR_PAGINA = 5;
const formVacio: FormMovimiento = {
  tipo: "entrada",
  descripcion: "",
  cantidad: "",
  monto: "",
  referencia: "",
};

export default function Movimientos() {
  const insets = useSafeAreaInsets();
  const { movimientos, loading, error, recargar } = useMovimientos();

  const [busqueda, setBusqueda] = useState("");
  const [filtroTipo, setFiltroTipo] = useState<"todos" | "entrada" | "salida">(
    "todos",
  );
  const [paginaActual, setPaginaActual] = useState(1);
  const [modalVisible, setModalVisible] = useState(false);
  const [form, setForm] = useState<FormMovimiento>(formVacio);
  const [errores, setErrores] = useState<Partial<FormMovimiento>>({});

  if (loading && !movimientos.length) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#2e6da4" />
        <Text style={{ marginTop: 10, color: "#555" }}>
          Cargando movimientos...
        </Text>
      </View>
    );
  }

  const movimientosFiltrados = movimientos.filter((m) => {
    const coincideBusqueda =
      m.descripcion.toLowerCase().includes(busqueda.toLowerCase()) ||
      (m.cliente_nombre ?? "").toLowerCase().includes(busqueda.toLowerCase()) ||
      (m.proveedor_nombre ?? "").toLowerCase().includes(busqueda.toLowerCase());
    const coincideTipo = filtroTipo === "todos" || m.tipo === filtroTipo;
    return coincideBusqueda && coincideTipo;
  });

  const totalPaginas = Math.ceil(
    movimientosFiltrados.length / ITEMS_POR_PAGINA,
  );
  const movimientosPaginados = movimientosFiltrados.slice(
    (paginaActual - 1) * ITEMS_POR_PAGINA,
    paginaActual * ITEMS_POR_PAGINA,
  );

  const cambiarPagina = (p: number) => {
    if (p >= 1 && p <= totalPaginas) setPaginaActual(p);
  };

  const abrirModal = () => {
    setForm(formVacio);
    setErrores({});
    setModalVisible(true);
  };

  const cerrarModal = () => {
    setModalVisible(false);
    setForm(formVacio);
    setErrores({});
  };

  const validar = () => {
    const e: Partial<FormMovimiento> = {};
    if (!form.descripcion.trim())
      e.descripcion = "La descripción es obligatoria";
    if (
      !form.cantidad.trim() ||
      isNaN(Number(form.cantidad)) ||
      Number(form.cantidad) <= 0
    )
      e.cantidad = "Cantidad debe ser un número mayor a 0";
    if (
      !form.monto.trim() ||
      isNaN(Number(form.monto)) ||
      Number(form.monto) <= 0
    )
      e.monto = "Monto debe ser un número mayor a 0";
    setErrores(e);
    return Object.keys(e).length === 0;
  };

  // Nota: el modal registra localmente hasta que se integre POST /movimientos al backend
  const guardar = () => {
    if (!validar()) return;
    cerrarModal();
    recargar();
  };

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom }]}>
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingBottom: insets.bottom + 100 },
        ]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* ERROR DE RED */}
        {error && (
          <Text
            style={{
              color: "#e67e22",
              textAlign: "center",
              padding: 8,
              fontSize: 13,
            }}
          >
            ⚠️ {error}
          </Text>
        )}

        {/* BUSCADOR */}
        <View style={styles.searchContainer}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar por descripción..."
            value={busqueda}
            onChangeText={(t) => {
              setBusqueda(t);
              setPaginaActual(1);
            }}
            placeholderTextColor="#aaa"
          />
        </View>

        {/* FILTRO */}
        <View style={styles.filterContainer}>
          {(["todos", "entrada", "salida"] as const).map((tipo) => (
            <TouchableOpacity
              key={tipo}
              style={[
                styles.filterChip,
                filtroTipo === tipo && styles.filterChipActive,
                tipo === "entrada" &&
                  filtroTipo === tipo &&
                  styles.filterChipEntrada,
                tipo === "salida" &&
                  filtroTipo === tipo &&
                  styles.filterChipSalida,
              ]}
              onPress={() => {
                setFiltroTipo(tipo);
                setPaginaActual(1);
              }}
            >
              <Text
                style={[
                  styles.filterChipText,
                  filtroTipo === tipo && styles.filterChipTextActive,
                ]}
              >
                {tipo === "todos"
                  ? "🔄 Todos"
                  : tipo === "entrada"
                    ? "▲ Entradas"
                    : "▼ Salidas"}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* ENCABEZADO */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Movimientos</Text>
          <View style={styles.headerRight}>
            <View style={styles.totalBadge}>
              <Text style={styles.totalText}>
                {movimientosFiltrados.length} registros
              </Text>
            </View>
            <TouchableOpacity style={styles.addButton} onPress={abrirModal}>
              <Text style={styles.addButtonText}>+ Nuevo</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* SPINNER recargando */}
        {loading && movimientos.length > 0 && (
          <ActivityIndicator
            size="small"
            color="#2e6da4"
            style={{ marginBottom: 8 }}
          />
        )}

        {/* LISTA */}
        {movimientosPaginados.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>🔄</Text>
            <Text style={styles.emptyText}>No se encontraron movimientos</Text>
          </View>
        ) : (
          movimientosPaginados.map((m) => (
            <View key={m.id} style={styles.card}>
              <View
                style={[
                  styles.tipoBadge,
                  m.tipo === "entrada" ? styles.entrada : styles.salida,
                ]}
              >
                <Text style={styles.tipoIcon}>
                  {m.tipo === "entrada" ? "▲" : "▼"}
                </Text>
                <Text
                  style={[
                    styles.tipoText,
                    m.tipo === "entrada"
                      ? styles.tipoTextEntrada
                      : styles.tipoTextSalida,
                  ]}
                >
                  {m.tipo === "entrada" ? "Entrada" : "Salida"}
                </Text>
              </View>
              <View style={styles.info}>
                <Text style={styles.descripcion} numberOfLines={1}>
                  {m.descripcion}
                </Text>
                <Text style={styles.sub}>
                  {m.fecha ? new Date(m.fecha).toLocaleDateString("es-PE") : ""}
                  {m.cliente_nombre ? `  ·  ${m.cliente_nombre}` : ""}
                  {m.proveedor_nombre ? `  ·  ${m.proveedor_nombre}` : ""}
                </Text>
              </View>
              <Text style={styles.monto}>
                S/ {Number(m.monto ?? 0).toFixed(2)}
              </Text>
            </View>
          ))
        )}

        {/* PAGINACIÓN */}
        {totalPaginas > 1 && (
          <View style={styles.pagination}>
            <TouchableOpacity
              style={[
                styles.pageButton,
                paginaActual === 1 && styles.pageButtonDisabled,
              ]}
              onPress={() => cambiarPagina(paginaActual - 1)}
              disabled={paginaActual === 1}
            >
              <Text style={styles.pageButtonText}>‹</Text>
            </TouchableOpacity>
            {Array.from({ length: totalPaginas }, (_, i) => i + 1).map((p) => (
              <TouchableOpacity
                key={p}
                style={[
                  styles.pageButton,
                  paginaActual === p && styles.pageButtonActive,
                ]}
                onPress={() => cambiarPagina(p)}
              >
                <Text
                  style={[
                    styles.pageButtonText,
                    paginaActual === p && styles.pageButtonTextActive,
                  ]}
                >
                  {p}
                </Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              style={[
                styles.pageButton,
                paginaActual === totalPaginas && styles.pageButtonDisabled,
              ]}
              onPress={() => cambiarPagina(paginaActual + 1)}
              disabled={paginaActual === totalPaginas}
            >
              <Text style={styles.pageButtonText}>›</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {/* MODAL */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={cerrarModal}
      >
        <KeyboardAvoidingView
          style={styles.modalOverlay}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <TouchableOpacity style={{ flex: 1 }} onPress={cerrarModal} />
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Nuevo Movimiento</Text>
              <TouchableOpacity onPress={cerrarModal}>
                <Text style={styles.closeButton}>✕</Text>
              </TouchableOpacity>
            </View>

            {/* TIPO */}
            <View style={styles.tipoSelector}>
              <TouchableOpacity
                style={[
                  styles.tipoBtn,
                  form.tipo === "entrada" && styles.tipoBtnEntrada,
                ]}
                onPress={() => setForm({ ...form, tipo: "entrada" })}
              >
                <Text
                  style={[
                    styles.tipoBtnText,
                    form.tipo === "entrada" && styles.tipoBtnTextEntrada,
                  ]}
                >
                  ▲ Entrada
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.tipoBtn,
                  form.tipo === "salida" && styles.tipoBtnSalida,
                ]}
                onPress={() => setForm({ ...form, tipo: "salida" })}
              >
                <Text
                  style={[
                    styles.tipoBtnText,
                    form.tipo === "salida" && styles.tipoBtnTextSalida,
                  ]}
                >
                  ▼ Salida
                </Text>
              </TouchableOpacity>
            </View>

            <FormInput
              placeholder="Descripción *"
              value={form.descripcion}
              onChangeText={(t) => setForm({ ...form, descripcion: t })}
            />
            {errores.descripcion && (
              <Text style={styles.errorText}>{errores.descripcion}</Text>
            )}

            <FormInput
              placeholder="Cantidad *"
              value={form.cantidad}
              onChangeText={(t) => setForm({ ...form, cantidad: t })}
              keyboardType="numeric"
            />
            {errores.cantidad && (
              <Text style={styles.errorText}>{errores.cantidad}</Text>
            )}

            <FormInput
              placeholder="Monto S/ *"
              value={form.monto}
              onChangeText={(t) => setForm({ ...form, monto: t })}
              keyboardType="decimal-pad"
            />
            {errores.monto && (
              <Text style={styles.errorText}>{errores.monto}</Text>
            )}

            <FormInput
              placeholder="Referencia (opcional)"
              value={form.referencia}
              onChangeText={(t) => setForm({ ...form, referencia: t })}
              autoCapitalize="characters"
            />

            <FormButton label="Registrar movimiento" onPress={guardar} />
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}
