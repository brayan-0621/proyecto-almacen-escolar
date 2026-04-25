import { useState } from "react";
import {
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
import { styles } from "../../styles/movimientos.styles";

type Movimiento = {
  id: number;
  tipo: "entrada" | "salida";
  descripcion: string;
  cantidad: number;
  monto: number;
  fecha: string;
  referencia?: string;
};

type FormMovimiento = {
  tipo: "entrada" | "salida";
  descripcion: string;
  cantidad: string;
  monto: string;
  referencia: string;
};

const DATOS_INICIALES: Movimiento[] = [
  {
    id: 1,
    tipo: "entrada",
    descripcion: "Cajas de cuadernos A4",
    cantidad: 50,
    monto: 750.0,
    fecha: "23/04/2026 08:30",
    referencia: "OC-001",
  },
  {
    id: 2,
    tipo: "salida",
    descripcion: "Cajas de lápices 2B",
    cantidad: 20,
    monto: 180.0,
    fecha: "23/04/2026 09:15",
    referencia: "VTA-001",
  },
  {
    id: 3,
    tipo: "salida",
    descripcion: "Resmas de papel bond",
    cantidad: 30,
    monto: 310.0,
    fecha: "23/04/2026 10:00",
    referencia: "VTA-002",
  },
  {
    id: 4,
    tipo: "entrada",
    descripcion: "Cajas de borradores",
    cantidad: 100,
    monto: 200.0,
    fecha: "23/04/2026 11:45",
    referencia: "OC-002",
  },
  {
    id: 5,
    tipo: "salida",
    descripcion: "Cajas de plumones",
    cantidad: 15,
    monto: 225.0,
    fecha: "23/04/2026 13:20",
    referencia: "VTA-003",
  },
  {
    id: 6,
    tipo: "entrada",
    descripcion: "Tijeras escolares",
    cantidad: 60,
    monto: 180.0,
    fecha: "22/04/2026 09:00",
    referencia: "OC-003",
  },
  {
    id: 7,
    tipo: "salida",
    descripcion: "Pegamento en barra",
    cantidad: 25,
    monto: 87.5,
    fecha: "22/04/2026 14:30",
    referencia: "VTA-004",
  },
  {
    id: 8,
    tipo: "entrada",
    descripcion: "Reglas 30cm",
    cantidad: 80,
    monto: 120.0,
    fecha: "21/04/2026 10:15",
    referencia: "OC-004",
  },
];

const ITEMS_POR_PAGINA = 5;
const formVacio: FormMovimiento = {
  tipo: "entrada",
  descripcion: "",
  cantidad: "",
  monto: "",
  referencia: "",
};

const ahora = () => {
  const d = new Date();
  return `${d.getDate().toString().padStart(2, "0")}/${(d.getMonth() + 1).toString().padStart(2, "0")}/${d.getFullYear()} ${d.getHours().toString().padStart(2, "0")}:${d.getMinutes().toString().padStart(2, "0")}`;
};

export default function Movimientos() {
  const insets = useSafeAreaInsets();
  const [movimientos, setMovimientos] = useState<Movimiento[]>(DATOS_INICIALES);
  const [busqueda, setBusqueda] = useState("");
  const [filtroTipo, setFiltroTipo] = useState<"todos" | "entrada" | "salida">(
    "todos",
  );
  const [paginaActual, setPaginaActual] = useState(1);
  const [modalVisible, setModalVisible] = useState(false);
  const [form, setForm] = useState<FormMovimiento>(formVacio);
  const [errores, setErrores] = useState<Partial<FormMovimiento>>({});

  const movimientosFiltrados = movimientos.filter((m) => {
    const coincideBusqueda =
      m.descripcion.toLowerCase().includes(busqueda.toLowerCase()) ||
      (m.referencia ?? "").toLowerCase().includes(busqueda.toLowerCase());
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

  const guardar = () => {
    if (!validar()) return;
    const nuevoId = Math.max(...movimientos.map((m) => m.id)) + 1;
    setMovimientos((prev) => [
      {
        id: nuevoId,
        tipo: form.tipo,
        descripcion: form.descripcion.trim(),
        cantidad: Number(form.cantidad),
        monto: Number(form.monto),
        fecha: ahora(),
        referencia: form.referencia.trim() || undefined,
      },
      ...prev,
    ]);
    setPaginaActual(1);
    cerrarModal();
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
        {/* BUSCADOR */}
        <View style={styles.searchContainer}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar por descripción o referencia..."
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
                <Text style={styles.sub}>{m.fecha}</Text>
                <View style={styles.row}>
                  <Text style={styles.badge}>x{m.cantidad} unid.</Text>
                  {m.referencia ? (
                    <Text style={styles.badge}>Ref: {m.referencia}</Text>
                  ) : null}
                </View>
              </View>
              <Text style={styles.monto}>S/ {m.monto.toFixed(2)}</Text>
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
