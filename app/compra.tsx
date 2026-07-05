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
import FormButton from "../components/FormButton";
import { useProductos } from "../hooks/useProductos";
import { useProveedores } from "../hooks/useProveedores";
import { apiPost } from "../services/api";
import { styles } from "../styles/compra.styles";

type ItemCompra = {
  productoId: number;
  nombre: string;
  codigo: string;
  cantidad: number;
  precio_unitario: number;
};

export default function Compra() {
  const insets = useSafeAreaInsets();
  const { productos, loading: loadingProductos } = useProductos();
  const {
    proveedores,
    loading: loadingProveedores,
    error: errorProveedores,
  } = useProveedores();

  const [proveedorSel, setProveedorSel] = useState<{
    id: number;
    nombre: string;
    ruc: string;
  } | null>(null);
  const [items, setItems] = useState<ItemCompra[]>([]);
  const [modalProveedor, setModalProveedor] = useState(false);
  const [modalProducto, setModalProducto] = useState(false);
  const [busqProv, setBusqProv] = useState("");
  const [busqProd, setBusqProd] = useState("");
  const [enviando, setEnviando] = useState(false);

  const subtotal = items.reduce(
    (s, i) => s + i.cantidad * i.precio_unitario,
    0,
  );
  const igv = subtotal * 0.18;
  const total = subtotal + igv;

  const agregarProducto = (p: (typeof productos)[number]) => {
    setItems((prev) => {
      const existe = prev.find((i) => i.productoId === p.id);
      if (existe)
        return prev.map((i) =>
          i.productoId === p.id ? { ...i, cantidad: i.cantidad + 1 } : i,
        );
      return [
        ...prev,
        {
          productoId: p.id,
          nombre: p.nombre,
          codigo: p.codigo ?? "",
          cantidad: 1,
          precio_unitario: p.precio_compra,
        },
      ];
    });
    setModalProducto(false);
  };

  const cambiarCantidad = (id: number, delta: number) => {
    setItems((prev) =>
      prev.map((i) =>
        i.productoId === id
          ? { ...i, cantidad: Math.max(1, i.cantidad + delta) }
          : i,
      ),
    );
  };

  const eliminarItem = (id: number) =>
    setItems((prev) => prev.filter((i) => i.productoId !== id));

  const confirmar = async () => {
    if (!proveedorSel) {
      Alert.alert("Atención", "Selecciona un proveedor");
      return;
    }
    if (items.length === 0) {
      Alert.alert("Atención", "Agrega al menos un producto");
      return;
    }
    setEnviando(true);
    try {
      await apiPost("/movimientos", {
        tipo: "entrada",
        descripcion: `Compra a ${proveedorSel.nombre}`,
        monto: total,
        proveedor_id: proveedorSel.id,
        items: items.map((i) => ({
          producto_id: i.productoId,
          cantidad: i.cantidad,
          precio_unitario: i.precio_unitario,
        })),
      });

      Alert.alert(
        "✅ Compra registrada",
        `Total: S/ ${total.toFixed(2)}\nProveedor: ${proveedorSel.nombre}`,
        [
          {
            text: "OK",
            onPress: () => {
              setProveedorSel(null);
              setItems([]);
            },
          },
        ],
      );
    } catch (e: any) {
      Alert.alert(
        "❌ Error al registrar la compra",
        e.message || "Intenta de nuevo",
      );
    } finally {
      setEnviando(false);
    }
  };

  const proveedoresFiltrados = proveedores.filter(
    (p) =>
      p.nombre.toLowerCase().includes(busqProv.toLowerCase()) ||
      p.ruc.includes(busqProv),
  );
  const productosFiltrados = productos.filter(
    (p) =>
      p.nombre.toLowerCase().includes(busqProd.toLowerCase()) ||
      (p.codigo ?? "").toLowerCase().includes(busqProd.toLowerCase()),
  );

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom }]}>
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingBottom: insets.bottom + 100 },
        ]}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.sectionTitle}>📦 Nueva Compra</Text>

        {errorProveedores && (
          <Text
            style={{
              color: "#e67e22",
              textAlign: "center",
              padding: 8,
              fontSize: 13,
            }}
          >
            ⚠️ {errorProveedores}
          </Text>
        )}

        {/* PROVEEDOR */}
        <TouchableOpacity
          style={styles.proveedorBtn}
          onPress={() => setModalProveedor(true)}
        >
          {proveedorSel ? (
            <View>
              <Text style={styles.proveedorSeleccionado}>
                {proveedorSel.nombre}
              </Text>
              <Text style={{ fontSize: 12, color: "#888" }}>
                RUC: {proveedorSel.ruc}
              </Text>
            </View>
          ) : (
            <Text style={styles.proveedorBtnText}>
              🏢 Seleccionar proveedor...
            </Text>
          )}
          <Text style={{ color: "#aaa", fontSize: 18 }}>›</Text>
        </TouchableOpacity>

        {/* PRODUCTOS */}
        <Text style={styles.sectionTitle}>🛒 Productos</Text>
        {items.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>🛒</Text>
            <Text style={styles.emptyText}>Aún no hay productos</Text>
          </View>
        ) : (
          items.map((item) => (
            <View key={item.productoId} style={styles.itemRow}>
              <View style={styles.itemInfo}>
                <Text style={styles.itemNombre} numberOfLines={1}>
                  {item.nombre}
                </Text>
                <Text style={styles.itemSub}>
                  S/ {item.precio_unitario.toFixed(2)} c/u · Total: S/{" "}
                  {(item.cantidad * item.precio_unitario).toFixed(2)}
                </Text>
              </View>
              <View style={styles.itemControls}>
                <TouchableOpacity
                  style={styles.cantBtn}
                  onPress={() => cambiarCantidad(item.productoId, -1)}
                >
                  <Text style={styles.cantBtnText}>−</Text>
                </TouchableOpacity>
                <Text style={styles.cantText}>{item.cantidad}</Text>
                <TouchableOpacity
                  style={styles.cantBtn}
                  onPress={() => cambiarCantidad(item.productoId, 1)}
                >
                  <Text style={styles.cantBtnText}>+</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.removeBtn}
                  onPress={() => eliminarItem(item.productoId)}
                >
                  <Text style={styles.removeBtnText}>🗑</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}

        <TouchableOpacity
          style={styles.addProductoBtn}
          onPress={() => setModalProducto(true)}
        >
          <Text style={styles.addProductoBtnText}>+ Agregar producto</Text>
        </TouchableOpacity>

        {/* TOTALES */}
        {items.length > 0 && (
          <View style={styles.totalCard}>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Subtotal</Text>
              <Text style={styles.totalValue}>S/ {subtotal.toFixed(2)}</Text>
            </View>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>IGV (18%)</Text>
              <Text style={styles.totalValue}>S/ {igv.toFixed(2)}</Text>
            </View>
            <View
              style={[
                styles.totalRow,
                {
                  marginTop: 6,
                  paddingTop: 6,
                  borderTopWidth: 1,
                  borderTopColor: "#f0f0f0",
                },
              ]}
            >
              <Text style={styles.totalFinalLabel}>Total</Text>
              <Text style={styles.totalFinalValue}>S/ {total.toFixed(2)}</Text>
            </View>
          </View>
        )}

        <FormButton
          label={enviando ? "Guardando..." : "✅ Confirmar Compra"}
          onPress={confirmar}
          disabled={enviando}
          style={{ backgroundColor: "#4CAF50" }}
        />
      </ScrollView>

      {/* MODAL PROVEEDOR */}
      <Modal
        visible={modalProveedor}
        transparent
        animationType="slide"
        onRequestClose={() => setModalProveedor(false)}
      >
        <KeyboardAvoidingView
          style={styles.modalOverlay}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <TouchableOpacity
            style={{ flex: 1 }}
            onPress={() => setModalProveedor(false)}
          />
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Seleccionar Proveedor</Text>
              <TouchableOpacity onPress={() => setModalProveedor(false)}>
                <Text style={styles.closeButton}>✕</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.searchContainer}>
              <Text style={styles.searchIcon}>🔍</Text>
              <TextInput
                style={styles.searchInput}
                placeholder="Buscar proveedor..."
                value={busqProv}
                onChangeText={setBusqProv}
                placeholderTextColor="#aaa"
              />
            </View>
            {loadingProveedores ? (
              <ActivityIndicator
                size="small"
                color="#4CAF50"
                style={{ marginVertical: 20 }}
              />
            ) : (
              <ScrollView>
                {proveedoresFiltrados.length === 0 ? (
                  <Text
                    style={{ color: "#888", textAlign: "center", padding: 16 }}
                  >
                    No hay proveedores registrados
                  </Text>
                ) : (
                  proveedoresFiltrados.map((p) => (
                    <TouchableOpacity
                      key={p.id}
                      style={styles.optionRow}
                      onPress={() => {
                        setProveedorSel(p);
                        setModalProveedor(false);
                        setBusqProv("");
                      }}
                    >
                      <Text style={styles.optionNombre}>{p.nombre}</Text>
                      <Text style={styles.optionSub}>RUC: {p.ruc}</Text>
                    </TouchableOpacity>
                  ))
                )}
              </ScrollView>
            )}
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* MODAL PRODUCTO */}
      <Modal
        visible={modalProducto}
        transparent
        animationType="slide"
        onRequestClose={() => setModalProducto(false)}
      >
        <KeyboardAvoidingView
          style={styles.modalOverlay}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <TouchableOpacity
            style={{ flex: 1 }}
            onPress={() => setModalProducto(false)}
          />
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Agregar Producto</Text>
              <TouchableOpacity onPress={() => setModalProducto(false)}>
                <Text style={styles.closeButton}>✕</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.searchContainer}>
              <Text style={styles.searchIcon}>🔍</Text>
              <TextInput
                style={styles.searchInput}
                placeholder="Buscar producto..."
                value={busqProd}
                onChangeText={setBusqProd}
                placeholderTextColor="#aaa"
              />
            </View>
            {loadingProductos ? (
              <ActivityIndicator
                size="small"
                color="#4CAF50"
                style={{ marginVertical: 20 }}
              />
            ) : (
              <ScrollView>
                {productosFiltrados.length === 0 ? (
                  <Text
                    style={{ color: "#888", textAlign: "center", padding: 16 }}
                  >
                    No hay productos disponibles
                  </Text>
                ) : (
                  productosFiltrados.map((p) => (
                    <TouchableOpacity
                      key={p.id}
                      style={styles.optionRow}
                      onPress={() => agregarProducto(p)}
                    >
                      <Text style={styles.optionNombre}>{p.nombre}</Text>
                      <Text style={styles.optionSub}>
                        {p.codigo ?? "-"} · S/ {p.precio_compra.toFixed(2)} c/u
                      </Text>
                    </TouchableOpacity>
                  ))
                )}
              </ScrollView>
            )}
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}
