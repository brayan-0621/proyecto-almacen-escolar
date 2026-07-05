import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
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
import { Cliente, ClienteForm, useClientes } from "../hooks/useClientes";
import { styles } from "../styles/clientes.styles";

const ITEMS_POR_PAGINA = 4;

const formVacio: ClienteForm = {
  nombre: "",
  empresa: "",
  dni: "",
  telefono: "",
};

export default function Clientes() {
  const insets = useSafeAreaInsets();
  const { clientes, loading, error, agregar, actualizar, eliminar } =
    useClientes();

  const [busqueda, setBusqueda] = useState("");
  const [paginaActual, setPaginaActual] = useState(1);

  const [modalVisible, setModalVisible] = useState(false);
  const [clienteEditando, setClienteEditando] = useState<Cliente | null>(null);
  const [form, setForm] = useState<ClienteForm>(formVacio);
  const [errores, setErrores] = useState<Partial<ClienteForm>>({});
  const [guardando, setGuardando] = useState(false);

  const clientesFiltrados = clientes.filter(
    (c) =>
      c.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      c.empresa?.toLowerCase().includes(busqueda.toLowerCase()) ||
      c.dni.includes(busqueda),
  );

  const totalPaginas = Math.ceil(clientesFiltrados.length / ITEMS_POR_PAGINA);
  const clientesPaginados = clientesFiltrados.slice(
    (paginaActual - 1) * ITEMS_POR_PAGINA,
    paginaActual * ITEMS_POR_PAGINA,
  );

  const cambiarPagina = (pagina: number) => {
    if (pagina >= 1 && pagina <= totalPaginas) setPaginaActual(pagina);
  };

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

  const validar = () => {
    const nuevosErrores: Partial<ClienteForm> = {};

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

  const guardar = async () => {
    if (!validar()) return;
    setGuardando(true);
    try {
      if (clienteEditando) {
        await actualizar(clienteEditando.id, form);
      } else {
        await agregar(form);
        setPaginaActual(1);
      }
      cerrarModal();
    } catch (e: any) {
      Alert.alert("❌ Error", e.message || "No se pudo guardar el cliente");
    } finally {
      setGuardando(false);
    }
  };

  const confirmarEliminar = () => {
    if (!clienteEditando) return;
    Alert.alert(
      "Eliminar cliente",
      `¿Seguro que deseas eliminar a "${clienteEditando.nombre}"?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            setGuardando(true);
            try {
              await eliminar(clienteEditando.id);
              setPaginaActual(1);
              cerrarModal();
            } catch (e: any) {
              Alert.alert(
                "❌ Error",
                e.message ||
                  "No se pudo eliminar. Puede tener movimientos asociados.",
              );
            } finally {
              setGuardando(false);
            }
          },
        },
      ],
    );
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
            placeholder="Buscar por nombre, empresa o DNI..."
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
        {loading ? (
          <ActivityIndicator
            size="large"
            color="#2e6da4"
            style={{ marginVertical: 20 }}
          />
        ) : clientesPaginados.length === 0 ? (
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
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {clienteEditando ? "Editar Cliente" : "Nuevo Cliente"}
              </Text>
              <TouchableOpacity onPress={cerrarModal}>
                <Text style={styles.closeButton}>✕</Text>
              </TouchableOpacity>
            </View>

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
              label={
                guardando
                  ? "Guardando..."
                  : clienteEditando
                    ? "Guardar cambios"
                    : "Crear cliente"
              }
              onPress={guardar}
              disabled={guardando}
            />

            {clienteEditando && (
              <FormButton
                label="Eliminar cliente"
                onPress={confirmarEliminar}
                disabled={guardando}
                style={{ backgroundColor: "#f44336", marginTop: 8 }}
              />
            )}
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}
