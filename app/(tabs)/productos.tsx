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
import ProductoCard from "../../components/ProductoCard";
import { styles } from "../../styles/productos.styles";

type Producto = {
  id: number;
  nombre: string;
  categoria: string;
  codigo: string;
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

const DATOS_INICIALES: Producto[] = [
  {
    id: 1,
    nombre: "Cuadernos A4 x50 hojas",
    categoria: "Papelería",
    codigo: "CUA-001",
    stock: 120,
    stock_minimo: 20,
    precio_compra: 2.5,
    precio_venta: 4.0,
    descripcion: "Cuaderno espiral A4 con tapa dura",
  },
  {
    id: 2,
    nombre: "Lápices 2B Caja x12",
    categoria: "Escritura",
    codigo: "LAP-002",
    stock: 8,
    stock_minimo: 15,
    precio_compra: 6.0,
    precio_venta: 10.0,
    descripcion: "Caja de 12 lápices de grafito 2B",
  },
  {
    id: 3,
    nombre: "Papel Bond A4 x500",
    categoria: "Papelería",
    codigo: "PAP-003",
    stock: 45,
    stock_minimo: 10,
    precio_compra: 18.0,
    precio_venta: 25.0,
    descripcion: "Resma de papel bond 75g",
  },
  {
    id: 4,
    nombre: "Borradores blancos",
    categoria: "Escritura",
    codigo: "BOR-004",
    stock: 3,
    stock_minimo: 10,
    precio_compra: 0.5,
    precio_venta: 1.0,
    descripcion: "Borrador plástico blanco",
  },
  {
    id: 5,
    nombre: "Plumones gruesos x12",
    categoria: "Arte",
    codigo: "PLU-005",
    stock: 30,
    stock_minimo: 10,
    precio_compra: 12.0,
    precio_venta: 18.0,
    descripcion: "Plumones de colores punta gruesa",
  },
  {
    id: 6,
    nombre: "Tijeras escolares",
    categoria: "Oficina",
    codigo: "TIJ-006",
    stock: 4,
    stock_minimo: 10,
    precio_compra: 3.0,
    precio_venta: 5.5,
    descripcion: "Tijeras punta redonda para niños",
  },
  {
    id: 7,
    nombre: "Pegamento en barra",
    categoria: "Oficina",
    codigo: "PEG-007",
    stock: 50,
    stock_minimo: 15,
    precio_compra: 2.0,
    precio_venta: 3.5,
    descripcion: "Barra de pegamento 40g",
  },
  {
    id: 8,
    nombre: "Reglas 30cm",
    categoria: "Escritura",
    codigo: "REG-008",
    stock: 2,
    stock_minimo: 10,
    precio_compra: 1.5,
    precio_venta: 2.5,
    descripcion: "Regla plástica transparente 30cm",
  },
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
  const [productos, setProductos] = useState<Producto[]>(DATOS_INICIALES);
  const [busqueda, setBusqueda] = useState("");
  const [categoriaFiltro, setCategoriaFiltro] = useState("Todas");
  const [paginaActual, setPaginaActual] = useState(1);
  const [modalVisible, setModalVisible] = useState(false);
  const [productoEditando, setProductoEditando] = useState<Producto | null>(
    null,
  );
  const [form, setForm] = useState<FormProducto>(formVacio);
  const [errores, setErrores] = useState<Partial<FormProducto>>({});

  const productosFiltrados = productos.filter((p) => {
    const coincideBusqueda =
      p.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      p.codigo.toLowerCase().includes(busqueda.toLowerCase());
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
      codigo: producto.codigo,
      stock: String(producto.stock),
      stock_minimo: String(producto.stock_minimo),
      precio_compra: String(producto.precio_compra),
      precio_venta: String(producto.precio_venta),
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
    if (!form.codigo.trim()) e.codigo = "El código es obligatorio";
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

  const guardar = () => {
    if (!validar()) return;
    const datos = {
      nombre: form.nombre.trim(),
      categoria: form.categoria,
      codigo: form.codigo.trim().toUpperCase(),
      stock: Number(form.stock),
      stock_minimo: Number(form.stock_minimo),
      precio_compra: Number(form.precio_compra),
      precio_venta: Number(form.precio_venta),
      descripcion: form.descripcion.trim(),
    };
    if (productoEditando) {
      setProductos((prev) =>
        prev.map((p) =>
          p.id === productoEditando.id ? { ...p, ...datos } : p,
        ),
      );
    } else {
      const nuevoId = Math.max(...productos.map((p) => p.id)) + 1;
      setProductos((prev) => [...prev, { id: nuevoId, ...datos }]);
      setPaginaActual(Math.ceil((productos.length + 1) / ITEMS_POR_PAGINA));
    }
    cerrarModal();
  };

  const eliminar = () => {
    if (!productoEditando) return;
    setProductos((prev) => prev.filter((p) => p.id !== productoEditando.id));
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
            placeholder="Buscar por nombre o código..."
            value={busqueda}
            onChangeText={(t) => {
              setBusqueda(t);
              setPaginaActual(1);
            }}
            placeholderTextColor="#aaa"
          />
        </View>

        {/* FILTRO POR CATEGORÍA */}
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

        {/* ENCABEZADO */}
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

        {/* LISTA */}
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

            <FormInput
              placeholder="Código *"
              value={form.codigo}
              onChangeText={(t) => setForm({ ...form, codigo: t })}
              autoCapitalize="characters"
            />
            {errores.codigo && (
              <Text style={styles.errorText}>{errores.codigo}</Text>
            )}

            {/* SELECTOR CATEGORÍA */}
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

            <FormButton
              label={productoEditando ? "Guardar cambios" : "Crear producto"}
              onPress={guardar}
            />
            {productoEditando && (
              <FormButton
                label="Eliminar producto"
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
