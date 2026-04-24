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
import FormButton from "../components/FormButton";
import FormInput from "../components/FormInput";
import ProveedorCard from "../components/ProveedorCard";
import { styles } from "../styles/proveedores.styles";

// ─── TIPOS ────────────────────────────────────────────────────
type Proveedor = {
  id: number;
  nombre: string;
  razon_social: string;
  ruc: string;
  telefono: string;
  direccion: string;
  email: string;
};

type FormProveedor = Omit<Proveedor, "id">;

// ─── DATOS DE PRUEBA ──────────────────────────────────────────
const DATOS_INICIALES: Proveedor[] = [
  {
    id: 1,
    nombre: "Distribuidora Escolar SAC",
    razon_social: "Distribuidora Escolar S.A.C.",
    ruc: "20512345678",
    telefono: "014567890",
    direccion: "Av. Industrial 123, Lima",
    email: "ventas@distescolar.com",
  },
  {
    id: 2,
    nombre: "Papelería Mayorista Perú",
    razon_social: "Papelería Mayorista Perú E.I.R.L.",
    ruc: "20598765432",
    telefono: "013456789",
    direccion: "Jr. Comercio 456, Lima",
    email: "contacto@papelmay.pe",
  },
  {
    id: 3,
    nombre: "Útiles del Norte",
    razon_social: "Útiles del Norte S.R.L.",
    ruc: "20567891234",
    telefono: "044123456",
    direccion: "Av. España 789, Trujillo",
    email: "info@utilesnorte.com",
  },
  {
    id: 4,
    nombre: "Importadora Escolar Lima",
    razon_social: "Importadora Escolar Lima S.A.",
    ruc: "20534567890",
    telefono: "016789012",
    direccion: "Calle Los Pinos 321, Lima",
    email: "pedidos@impescolar.com",
  },
  {
    id: 5,
    nombre: "Mayorista Office Perú",
    razon_social: "Mayorista Office Perú S.A.C.",
    ruc: "20523456789",
    telefono: "015678901",
    direccion: "Av. Javier Prado 654, Lima",
    email: "ventas@officepe.com",
  },
  {
    id: 6,
    nombre: "Comercial Andina SRL",
    razon_social: "Comercial Andina S.R.L.",
    ruc: "20556789012",
    telefono: "084234567",
    direccion: "Av. Sol 147, Cusco",
    email: "andina@comercial.pe",
  },
];

const ITEMS_POR_PAGINA = 4;

const formVacio: FormProveedor = {
  nombre: "",
  razon_social: "",
  ruc: "",
  telefono: "",
  direccion: "",
  email: "",
};

export default function Proveedores() {
  const insets = useSafeAreaInsets();

  const [proveedores, setProveedores] = useState<Proveedor[]>(DATOS_INICIALES);
  const [busqueda, setBusqueda] = useState("");
  const [paginaActual, setPaginaActual] = useState(1);

  const [modalVisible, setModalVisible] = useState(false);
  const [proveedorEditando, setProveedorEditando] = useState<Proveedor | null>(
    null,
  );
  const [form, setForm] = useState<FormProveedor>(formVacio);
  const [errores, setErrores] = useState<Partial<FormProveedor>>({});

  // ── FILTRO ──────────────────────────────────────────────────
  const proveedoresFiltrados = proveedores.filter(
    (p) =>
      p.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      p.razon_social.toLowerCase().includes(busqueda.toLowerCase()) ||
      p.ruc.includes(busqueda),
  );

  // ── PAGINACIÓN ──────────────────────────────────────────────
  const totalPaginas = Math.ceil(
    proveedoresFiltrados.length / ITEMS_POR_PAGINA,
  );
  const proveedoresPaginados = proveedoresFiltrados.slice(
    (paginaActual - 1) * ITEMS_POR_PAGINA,
    paginaActual * ITEMS_POR_PAGINA,
  );

  const cambiarPagina = (pagina: number) => {
    if (pagina >= 1 && pagina <= totalPaginas) setPaginaActual(pagina);
  };

  // ── MODAL ───────────────────────────────────────────────────
  const abrirModalCrear = () => {
    setProveedorEditando(null);
    setForm(formVacio);
    setErrores({});
    setModalVisible(true);
  };

  const abrirModalEditar = (proveedor: Proveedor) => {
    setProveedorEditando(proveedor);
    setForm({
      nombre: proveedor.nombre,
      razon_social: proveedor.razon_social,
      ruc: proveedor.ruc,
      telefono: proveedor.telefono,
      direccion: proveedor.direccion,
      email: proveedor.email,
    });
    setErrores({});
    setModalVisible(true);
  };

  const cerrarModal = () => {
    setModalVisible(false);
    setProveedorEditando(null);
    setForm(formVacio);
    setErrores({});
  };

  // ── VALIDACIONES ────────────────────────────────────────────
  const validar = () => {
    const nuevosErrores: Partial<FormProveedor> = {};

    if (!form.nombre.trim()) nuevosErrores.nombre = "El nombre es obligatorio";

    if (!form.razon_social.trim())
      nuevosErrores.razon_social = "La razón social es obligatoria";

    if (!form.ruc.trim()) nuevosErrores.ruc = "El RUC es obligatorio";
    else if (!/^\d{11}$/.test(form.ruc))
      nuevosErrores.ruc = "El RUC debe tener exactamente 11 dígitos";

    if (!form.telefono.trim())
      nuevosErrores.telefono = "El teléfono es obligatorio";
    else if (
      !/^\d{9,9}$/.test(form.telefono) &&
      !/^\d{6,9}$/.test(form.telefono)
    )
      nuevosErrores.telefono = "El teléfono debe tener entre 6 y 9 dígitos";

    if (!form.direccion.trim())
      nuevosErrores.direccion = "La dirección es obligatoria";

    if (!form.email.trim()) nuevosErrores.email = "El email es obligatorio";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      nuevosErrores.email = "Ingresa un email válido";

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  // ── GUARDAR ─────────────────────────────────────────────────
  const guardar = () => {
    if (!validar()) return;

    if (proveedorEditando) {
      setProveedores((prev) =>
        prev.map((p) =>
          p.id === proveedorEditando.id ? { ...p, ...form } : p,
        ),
      );
    } else {
      const nuevoId = Math.max(...proveedores.map((p) => p.id)) + 1;
      setProveedores((prev) => [...prev, { id: nuevoId, ...form }]);
      setPaginaActual(Math.ceil((proveedores.length + 1) / ITEMS_POR_PAGINA));
    }
    cerrarModal();
  };

  // ── ELIMINAR ────────────────────────────────────────────────
  const eliminar = () => {
    if (!proveedorEditando) return;
    setProveedores((prev) => prev.filter((p) => p.id !== proveedorEditando.id));
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
            placeholder="Buscar por nombre, razón social o RUC..."
            value={busqueda}
            onChangeText={(t) => {
              setBusqueda(t);
              setPaginaActual(1);
            }}
            placeholderTextColor="#aaa"
          />
        </View>

        {/* ENCABEZADO */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Proveedores</Text>
          <View style={styles.headerRight}>
            <View style={styles.totalBadge}>
              <Text style={styles.totalText}>
                {proveedoresFiltrados.length} registros
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
        {proveedoresPaginados.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>🏢</Text>
            <Text style={styles.emptyText}>No se encontraron proveedores</Text>
          </View>
        ) : (
          proveedoresPaginados.map((p) => (
            <ProveedorCard
              key={p.id}
              {...p}
              onPress={() => abrirModalEditar(p)}
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
          <ScrollView
            style={styles.modalContainer}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {/* HEADER MODAL */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {proveedorEditando ? "Editar Proveedor" : "Nuevo Proveedor"}
              </Text>
              <TouchableOpacity onPress={cerrarModal}>
                <Text style={styles.closeButton}>✕</Text>
              </TouchableOpacity>
            </View>

            {/* CAMPOS */}
            <FormInput
              placeholder="Nombre *"
              value={form.nombre}
              onChangeText={(t) => setForm({ ...form, nombre: t })}
            />
            {errores.nombre && (
              <Text style={styles.errorText}>{errores.nombre}</Text>
            )}

            <FormInput
              placeholder="Razón Social *"
              value={form.razon_social}
              onChangeText={(t) => setForm({ ...form, razon_social: t })}
            />
            {errores.razon_social && (
              <Text style={styles.errorText}>{errores.razon_social}</Text>
            )}

            <FormInput
              placeholder="RUC * (11 dígitos)"
              value={form.ruc}
              onChangeText={(t) => setForm({ ...form, ruc: t })}
              keyboardType="numeric"
              maxLength={11}
            />
            {errores.ruc && <Text style={styles.errorText}>{errores.ruc}</Text>}

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

            <FormInput
              placeholder="Dirección *"
              value={form.direccion}
              onChangeText={(t) => setForm({ ...form, direccion: t })}
            />
            {errores.direccion && (
              <Text style={styles.errorText}>{errores.direccion}</Text>
            )}

            <FormInput
              placeholder="Email *"
              value={form.email}
              onChangeText={(t) => setForm({ ...form, email: t })}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            {errores.email && (
              <Text style={styles.errorText}>{errores.email}</Text>
            )}

            <FormButton
              label={proveedorEditando ? "Guardar cambios" : "Crear proveedor"}
              onPress={guardar}
            />

            {proveedorEditando && (
              <FormButton
                label="Eliminar proveedor"
                onPress={eliminar}
                style={{
                  backgroundColor: "#f44336",
                  marginTop: 8,
                  marginBottom: 20,
                }}
              />
            )}
          </ScrollView>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}
