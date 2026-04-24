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
import ClienteCard from "../components/ClienteCard";
import FormButton from "../components/FormButton";
import FormInput from "../components/FormInput";
import { styles } from "../styles/clientes.styles";

// ─── TIPOS ────────────────────────────────────────────────────
type Cliente = {
  id: number;
  nombre: string;
  empresa?: string;
  dni: string;
  telefono: string;
};

type FormCliente = {
  nombre: string;
  empresa: string;
  dni: string;
  telefono: string;
};

// ─── DATOS DE PRUEBA ──────────────────────────────────────────
const DATOS_INICIALES: Cliente[] = [
  {
    id: 1,
    nombre: "Juan Pérez",
    empresa: "Librería Central",
    dni: "12345678",
    telefono: "987654321",
  },
  {
    id: 2,
    nombre: "María López",
    empresa: "Colegio San José",
    dni: "87654321",
    telefono: "912345678",
  },
  {
    id: 3,
    nombre: "Carlos Ruiz",
    empresa: "Distribuidora Norte",
    dni: "11223344",
    telefono: "945678901",
  },
  {
    id: 4,
    nombre: "Ana Torres",
    empresa: "",
    dni: "44332211",
    telefono: "932109876",
  },
  {
    id: 5,
    nombre: "Pedro Sánchez",
    empresa: "Papelería El Estudiante",
    dni: "55667788",
    telefono: "965432198",
  },
  {
    id: 6,
    nombre: "Lucía Flores",
    empresa: "Colegio Los Andes",
    dni: "99887766",
    telefono: "978901234",
  },
  {
    id: 7,
    nombre: "Miguel Quispe",
    empresa: "",
    dni: "33221100",
    telefono: "921098765",
  },
  {
    id: 8,
    nombre: "Rosa Mamani",
    empresa: "Librería Nueva Era",
    dni: "66778899",
    telefono: "954321987",
  },
];

const ITEMS_POR_PAGINA = 4;

const formVacio: FormCliente = {
  nombre: "",
  empresa: "",
  dni: "",
  telefono: "",
};

export default function Clientes() {
  const insets = useSafeAreaInsets();

  const [clientes, setClientes] = useState<Cliente[]>(DATOS_INICIALES);
  const [busqueda, setBusqueda] = useState("");
  const [paginaActual, setPaginaActual] = useState(1);

  const [modalVisible, setModalVisible] = useState(false);
  const [clienteEditando, setClienteEditando] = useState<Cliente | null>(null);
  const [form, setForm] = useState<FormCliente>(formVacio);
  const [errores, setErrores] = useState<Partial<FormCliente>>({});

  // ── FILTRO ──────────────────────────────────────────────────
  const clientesFiltrados = clientes.filter(
    (c) =>
      c.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      c.empresa?.toLowerCase().includes(busqueda.toLowerCase()) ||
      c.dni.includes(busqueda),
  );

  // ── PAGINACIÓN ──────────────────────────────────────────────
  const totalPaginas = Math.ceil(clientesFiltrados.length / ITEMS_POR_PAGINA);
  const clientesPaginados = clientesFiltrados.slice(
    (paginaActual - 1) * ITEMS_POR_PAGINA,
    paginaActual * ITEMS_POR_PAGINA,
  );

  const cambiarPagina = (pagina: number) => {
    if (pagina >= 1 && pagina <= totalPaginas) setPaginaActual(pagina);
  };

  // ── MODAL ───────────────────────────────────────────────────
  const abrirModalCrear = () => {
    setClienteEditando(null);
    setForm(formVacio);
    setErrores({});
    setModalVisible(true);
  };

  const abrirModalEditar = (cliente: Cliente) => {
    setClienteEditando(cliente);
    setForm({
      nombre: cliente.nombre,
      empresa: cliente.empresa ?? "",
      dni: cliente.dni,
      telefono: cliente.telefono,
    });
    setErrores({});
    setModalVisible(true);
  };

  const cerrarModal = () => {
    setModalVisible(false);
    setClienteEditando(null);
    setForm(formVacio);
    setErrores({});
  };

  // ── VALIDACIONES ────────────────────────────────────────────
  const validar = () => {
    const nuevosErrores: Partial<FormCliente> = {};

    if (!form.nombre.trim()) nuevosErrores.nombre = "El nombre es obligatorio";

    if (!form.dni.trim()) nuevosErrores.dni = "El DNI es obligatorio";
    else if (!/^\d{8}$/.test(form.dni))
      nuevosErrores.dni = "El DNI debe tener exactamente 8 dígitos";

    if (!form.telefono.trim())
      nuevosErrores.telefono = "El teléfono es obligatorio";
    else if (!/^\d{9}$/.test(form.telefono))
      nuevosErrores.telefono = "El teléfono debe tener exactamente 9 dígitos";

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  // ── GUARDAR ─────────────────────────────────────────────────
  const guardar = () => {
    if (!validar()) return;

    if (clienteEditando) {
      setClientes((prev) =>
        prev.map((c) => (c.id === clienteEditando.id ? { ...c, ...form } : c)),
      );
    } else {
      const nuevoId = Math.max(...clientes.map((c) => c.id)) + 1;
      setClientes((prev) => [...prev, { id: nuevoId, ...form }]);
      setPaginaActual(Math.ceil((clientes.length + 1) / ITEMS_POR_PAGINA));
    }
    cerrarModal();
  };

  // ── ELIMINAR ────────────────────────────────────────────────
  const eliminar = () => {
    if (!clienteEditando) return;
    setClientes((prev) => prev.filter((c) => c.id !== clienteEditando.id));
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
            placeholder="Buscar por nombre, empresa o DNI..."
            value={busqueda}
            onChangeText={(t) => {
              setBusqueda(t);
              setPaginaActual(1);
            }}
            placeholderTextColor="#aaa"
          />
        </View>

        {/* ENCABEZADO con botón + inline ✅ */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Clientes</Text>
          <View style={styles.headerRight}>
            <View style={styles.totalBadge}>
              <Text style={styles.totalText}>
                {clientesFiltrados.length} registros
              </Text>
            </View>
            <TouchableOpacity
              style={styles.addButton}
              onPress={abrirModalCrear}
            >
              <Text style={styles.addButtonText}>+ Nuevo</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* LISTA */}
        {clientesPaginados.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>👤</Text>
            <Text style={styles.emptyText}>No se encontraron clientes</Text>
          </View>
        ) : (
          clientesPaginados.map((c) => (
            <ClienteCard
              key={c.id}
              {...c}
              onPress={() => abrirModalEditar(c)}
            />
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

      {/* MODAL CREAR / EDITAR */}
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
            {/* HEADER MODAL */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {clienteEditando ? "Editar Cliente" : "Nuevo Cliente"}
              </Text>
              <TouchableOpacity onPress={cerrarModal}>
                <Text style={styles.closeButton}>✕</Text>
              </TouchableOpacity>
            </View>

            {/* CAMPOS */}
            <FormInput
              placeholder="Nombre completo *"
              value={form.nombre}
              onChangeText={(t) => setForm({ ...form, nombre: t })}
            />
            {errores.nombre && (
              <Text style={styles.errorText}>{errores.nombre}</Text>
            )}

            <FormInput
              placeholder="Empresa (opcional)"
              value={form.empresa}
              onChangeText={(t) => setForm({ ...form, empresa: t })}
            />

            <FormInput
              placeholder="DNI *"
              value={form.dni}
              onChangeText={(t) => setForm({ ...form, dni: t })}
              keyboardType="numeric"
              maxLength={8}
            />
            {errores.dni && <Text style={styles.errorText}>{errores.dni}</Text>}

            <FormInput
              placeholder="Teléfono *"
              value={form.telefono}
              onChangeText={(t) => setForm({ ...form, telefono: t })}
              keyboardType="numeric"
              maxLength={9}
            />
            {errores.telefono && (
              <Text style={styles.errorText}>{errores.telefono}</Text>
            )}

            <FormButton
              label={clienteEditando ? "Guardar cambios" : "Crear cliente"}
              onPress={guardar}
            />

            {clienteEditando && (
              <FormButton
                label="Eliminar cliente"
                onPress={eliminar}
                style={{ backgroundColor: "#f44336", marginTop: 8 }}
              />
            )}
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}
