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
import ProductoCard from "../../components/ProductoCard";
import { useProductos } from "../../hooks/useProductos";
import { styles } from "../../styles/productos.styles";

type Producto = {
  id: number;
  nombre: string;
  categoria: string;
  codigo?: string;
  stock: number;
  stock_minimo: number;
  precio_compra: number;
  precio_venta: number;
  descripcion?: string;
};

type FormProducto = {
  nombre: string;
  categoria: string;
  codigo: string;
  stock: string;
  stock_minimo: string;
  precio_compra: string;
  precio_venta: string;
  descripcion: string;
};

const CATEGORIAS = [
  "Todas",
  "Escritura",
  "Papelería",
  "Arte",
  "Oficina",
  "Otros",
];

const ITEMS_POR_PAGINA = 4;
const formVacio: FormProducto = {
  nombre: "",
  categoria: "Papelería",
  codigo: "",
  stock: "",
  stock_minimo: "",
  precio_compra: "",
  precio_venta: "",
  descripcion: "",
};

export default function Productos() {
  const insets = useSafeAreaInsets();
  const { productos, loading, error, recargar, agregar } = useProductos();

  const [busqueda, setBusqueda] = useState("");
  const [categoriaFiltro, setCategoriaFiltro] = useState("Todas");
  const [paginaActual, setPaginaActual] = useState(1);
  const [modalVisible, setModalVisible] = useState(false);
  const [productoEditando, setProductoEditando] = useState<Producto | null>(
    null,
  );
  const [form, setForm] = useState<FormProducto>(formVacio);
  const [errores, setErrores] = useState<Partial<FormProducto>>({});
  const [guardando, setGuardando] = useState(false);

  if (loading && !productos.length) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#2e6da4" />
        <Text style={{ marginTop: 10, color: "#555" }}>
          Cargando productos...
        </Text>
      </View>
    );
  }

  const productosFiltrados = productos.filter((p) => {
    const coincideBusqueda =
      (p.nombre ?? "").toLowerCase().includes(busqueda.toLowerCase()) ||
      (p.codigo ?? "").toLowerCase().includes(busqueda.toLowerCase());
    const coincideCategoria =
      categoriaFiltro === "Todas" || p.categoria === categoriaFiltro;
    return coincideBusqueda && coincideCategoria;
  });

  const totalPaginas = Math.ceil(productosFiltrados.length / ITEMS_POR_PAGINA);
  const productosPaginados = productosFiltrados.slice(
    (paginaActual - 1) * ITEMS_POR_PAGINA,
    paginaActual * ITEMS_POR_PAGINA,
  );

  const cambiarPagina = (pagina: number) => {
    if (pagina >= 1 && pagina <= totalPaginas) setPaginaActual(pagina);
  };

  const abrirModalCrear = () => {
    setProductoEditando(null);
    setForm(formVacio);
    setErrores({});
    setModalVisible(true);
  };

  const abrirModalEditar = (producto: Producto) => {
    setProductoEditando(producto);
    setForm({
      nombre: producto.nombre,
      categoria: producto.categoria,
      codigo: producto.codigo ?? "",
      stock: String(producto.stock),
      stock_minimo: String(producto.stock_minimo),
      precio_compra: String(Number(producto.precio_compra ?? 0)),
      precio_venta: String(Number(producto.precio_venta ?? 0)),
      descripcion: producto.descripcion ?? "",
    });
    setErrores({});
    setModalVisible(true);
  };

  const cerrarModal = () => {
    setModalVisible(false);
    setProductoEditando(null);
    setForm(formVacio);
    setErrores({});
  };

  const validar = () => {
    const e: Partial<FormProducto> = {};
    if (!form.nombre.trim()) e.nombre = "El nombre es obligatorio";
    if (
      !form.stock.trim() ||
      isNaN(Number(form.stock)) ||
      Number(form.stock) < 0
    )
      e.stock = "Stock debe ser un número válido";
    if (
      !form.stock_minimo.trim() ||
      isNaN(Number(form.stock_minimo)) ||
      Number(form.stock_minimo) < 0
    )
      e.stock_minimo = "Stock mínimo debe ser un número válido";
    if (
      !form.precio_compra.trim() ||
      isNaN(Number(form.precio_compra)) ||
      Number(form.precio_compra) <= 0
    )
      e.precio_compra = "Precio de compra inválido";
    if (
      !form.precio_venta.trim() ||
      isNaN(Number(form.precio_venta)) ||
      Number(form.precio_venta) <= 0
    )
      e.precio_venta = "Precio de venta inválido";
    setErrores(e);
    return Object.keys(e).length === 0;
  };

  const guardar = async () => {
    if (!validar()) return;
    setGuardando(true);
    try {
      const datos = {
        nombre: form.nombre.trim(),
        categoria: form.categoria,
        stock: Number(form.stock),
        stock_minimo: Number(form.stock_minimo),
        precio_compra: Number(form.precio_compra),
        precio_venta: Number(form.precio_venta),
        descripcion: form.descripcion.trim(),
      };
      await agregar(datos);
      cerrarModal();
    } catch (e: any) {
      setErrores({ nombre: e.message || "Error al guardar" });
    } finally {
      setGuardando(false);
    }
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

        <View style={styles.searchContainer}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar por nombre o código..."
            value={busqueda}
            onChangeText={(t) => {
              setBusqueda(t);
              setPaginaActual(1);
            }}
            placeholderTextColor="#aaa"
          />
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ marginBottom: 12 }}
        >
          <View style={styles.filterContainer}>
            {CATEGORIAS.map((cat) => (
              <TouchableOpacity
                key={cat}
                style={[
                  styles.filterChip,
                  categoriaFiltro === cat && styles.filterChipActive,
                ]}
                onPress={() => {
                  setCategoriaFiltro(cat);
                  setPaginaActual(1);
                }}
              >
                <Text
                  style={[
                    styles.filterChipText,
                    categoriaFiltro === cat && styles.filterChipTextActive,
                  ]}
                >
                  {cat}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Productos</Text>
          <View style={styles.headerRight}>
            <View style={styles.totalBadge}>
              <Text style={styles.totalText}>
                {productosFiltrados.length} registros
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

        {loading && productos.length > 0 && (
          <ActivityIndicator
            size="small"
            color="#2e6da4"
            style={{ marginBottom: 8 }}
          />
        )}

        {productosPaginados.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>📦</Text>
            <Text style={styles.emptyText}>No se encontraron productos</Text>
          </View>
        ) : (
          productosPaginados.map((p) => (
            <ProductoCard
              key={p.id}
              {...p}
              codigo={p.codigo ?? "S/C"}
              precio_venta={Number(p.precio_venta ?? 0)}
              onPress={() => abrirModalEditar(p)}
            />
          ))
        )}

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
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {productoEditando ? "Editar Producto" : "Nuevo Producto"}
              </Text>
              <TouchableOpacity onPress={cerrarModal}>
                <Text style={styles.closeButton}>✕</Text>
              </TouchableOpacity>
            </View>

            <FormInput
              placeholder="Nombre *"
              value={form.nombre}
              onChangeText={(t) => setForm({ ...form, nombre: t })}
            />
            {errores.nombre && (
              <Text style={styles.errorText}>{errores.nombre}</Text>
            )}

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={{ marginBottom: 10 }}
            >
              <View style={{ flexDirection: "row", gap: 8 }}>
                {CATEGORIAS.filter((c) => c !== "Todas").map((cat) => (
                  <TouchableOpacity
                    key={cat}
                    style={[
                      styles.filterChip,
                      form.categoria === cat && styles.filterChipActive,
                    ]}
                    onPress={() => setForm({ ...form, categoria: cat })}
                  >
                    <Text
                      style={[
                        styles.filterChipText,
                        form.categoria === cat && styles.filterChipTextActive,
                      ]}
                    >
                      {cat}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>

            <FormInput
              placeholder="Stock actual *"
              value={form.stock}
              onChangeText={(t) => setForm({ ...form, stock: t })}
              keyboardType="numeric"
            />
            {errores.stock && (
              <Text style={styles.errorText}>{errores.stock}</Text>
            )}

            <FormInput
              placeholder="Stock mínimo *"
              value={form.stock_minimo}
              onChangeText={(t) => setForm({ ...form, stock_minimo: t })}
              keyboardType="numeric"
            />
            {errores.stock_minimo && (
              <Text style={styles.errorText}>{errores.stock_minimo}</Text>
            )}

            <FormInput
              placeholder="Precio de compra S/ *"
              value={form.precio_compra}
              onChangeText={(t) => setForm({ ...form, precio_compra: t })}
              keyboardType="decimal-pad"
            />
            {errores.precio_compra && (
              <Text style={styles.errorText}>{errores.precio_compra}</Text>
            )}

            <FormInput
              placeholder="Precio de venta S/ *"
              value={form.precio_venta}
              onChangeText={(t) => setForm({ ...form, precio_venta: t })}
              keyboardType="decimal-pad"
            />
            {errores.precio_venta && (
              <Text style={styles.errorText}>{errores.precio_venta}</Text>
            )}

            <FormInput
              placeholder="Descripción (opcional)"
              value={form.descripcion}
              onChangeText={(t) => setForm({ ...form, descripcion: t })}
            />

            {guardando ? (
              <ActivityIndicator
                size="large"
                color="#2e6da4"
                style={{ marginVertical: 16 }}
              />
            ) : (
              <FormButton
                label={productoEditando ? "Guardar cambios" : "Crear producto"}
                onPress={guardar}
              />
            )}
          </ScrollView>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}
