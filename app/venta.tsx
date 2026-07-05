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
import { useClientes } from "../hooks/useClientes";
import { useProductos } from "../hooks/useProductos";
import { apiPost } from "../services/api";
import { styles } from "../styles/venta.styles";

type ItemVenta = {
  productoId: number;
  nombre: string;
  codigo: string;
  cantidad: number;
  precio_unitario: number;
  stockMax: number;
};

export default function Venta() {
  const insets = useSafeAreaInsets();
  const { productos, loading: loadingProductos } = useProductos();
  const {
    clientes,
    loading: loadingClientes,
    error: errorClientes,
  } = useClientes();

  const [clienteSel, setClienteSel] = useState<{
    id: number;
    nombre: string;
    dni: string;
    empresa?: string;
  } | null>(null);
  const [items, setItems] = useState<ItemVenta[]>([]);
  const [modalCliente, setModalCliente] = useState(false);
  const [modalProducto, setModalProducto] = useState(false);
  const [busqCli, setBusqCli] = useState("");
  const [busqProd, setBusqProd] = useState("");
  const [enviando, setEnviando] = useState(false);

  const subtotal = items.reduce(
    (s, i) => s + i.cantidad * i.precio_unitario,
    0,
  );
  const igv = subtotal * 0.18;
  const total = subtotal + igv;

  const agregarProducto = (p: (typeof productos)[number]) => {
    if (p.stock <= 0) {
      Alert.alert("Sin stock", `"${p.nombre}" no tiene stock disponible`);
      return;
    }
    setItems((prev) => {
      const existe = prev.find((i) => i.productoId === p.id);
      if (existe) {
        if (existe.cantidad >= p.stock) {
          Alert.alert(
            "Stock máximo",
            `Solo hay ${p.stock} unidades disponibles`,
          );
          return prev;
        }
        return prev.map((i) =>
          i.productoId === p.id
            ? { ...i, cantidad: Math.min(i.stockMax, i.cantidad + 1) }
            : i,
        );
      }
      return [
        ...prev,
        {
          productoId: p.id,
          nombre: p.nombre,
          codigo: p.codigo ?? "",
          cantidad: 1,
          precio_unitario: p.precio_venta,
          stockMax: p.stock,
        },
      ];
    });
    setModalProducto(false);
  };

  const cambiarCantidad = (id: number, delta: number) => {
    setItems((prev) =>
      prev.map((i) =>
        i.productoId === id
          ? {
              ...i,
              cantidad: Math.min(i.stockMax, Math.max(1, i.cantidad + delta)),
            }
          : i,
      ),
    );
  };

  const eliminarItem = (id: number) =>
    setItems((prev) => prev.filter((i) => i.productoId !== id));

  const confirmar = async () => {
    if (items.length === 0) {
      Alert.alert("Atención", "Agrega al menos un producto");
      return;
    }
    setEnviando(true);
    try {
      await apiPost("/movimientos", {
        tipo: "salida",
        descripcion: `Venta a ${clienteSel ? clienteSel.nombre : "Cliente general"}`,
        monto: total,
        cliente_id: clienteSel?.id ?? null,
        items: items.map((i) => ({
          producto_id: i.productoId,
          cantidad: i.cantidad,
          precio_unitario: i.precio_unitario,
        })),
      });

      const clienteNombre = clienteSel ? clienteSel.nombre : "Cliente general";
      Alert.alert(
        "✅ Venta registrada",
        `Total: S/ ${total.toFixed(2)}\nCliente: ${clienteNombre}`,
        [
          {
            text: "OK",
            onPress: () => {
              setClienteSel(null);
              setItems([]);
            },
          },
        ],
      );
    } catch (e: any) {
      Alert.alert(
        "❌ Error al registrar la venta",
        e.message || "Intenta de nuevo",
      );
    } finally {
      setEnviando(false);
    }
  };

  const clientesFiltrados = clientes.filter(
    (c) =>
      c.nombre.toLowerCase().includes(busqCli.toLowerCase()) ||
      c.dni.includes(busqCli),
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
        <Text style={styles.sectionTitle}>🧾 Nueva Venta</Text>

        {errorClientes && (
          <Text
            style={{
              color: "#e67e22",
              textAlign: "center",
              padding: 8,
              fontSize: 13,
            }}
          >
            ⚠️ {errorClientes}
          </Text>
        )}

        {/* CLIENTE */}
        <TouchableOpacity
          style={styles.clienteBtn}
          onPress={() => setModalCliente(true)}
        >
          {clienteSel ? (
            <View>
              <Text style={styles.clienteSeleccionado}>
                {clienteSel.nombre}
              </Text>
              <Text style={{ fontSize: 12, color: "#888" }}>
                DNI: {clienteSel.dni}
                {clienteSel.empresa ? ` · ${clienteSel.empresa}` : ""}
              </Text>
            </View>
          ) : (
            <Text style={styles.clienteBtnText}>
              👤 Seleccionar cliente (opcional)...
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
                  {(item.cantidad * item.precio_unitario).toFixed(2)} · Stock:{" "}
                  {item.stockMax}
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
          label={enviando ? "Guardando..." : "✅ Confirmar Venta"}
          onPress={confirmar}
          disabled={enviando}
          style={{ backgroundColor: "#f4a261" }}
        />
      </ScrollView>

      {/* MODAL CLIENTE */}
      <Modal
        visible={modalCliente}
        transparent
        animationType="slide"
        onRequestClose={() => setModalCliente(false)}
      >
        <KeyboardAvoidingView
          style={styles.modalOverlay}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <TouchableOpacity
            style={{ flex: 1 }}
            onPress={() => setModalCliente(false)}
          />
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Seleccionar Cliente</Text>
              <TouchableOpacity onPress={() => setModalCliente(false)}>
                <Text style={styles.closeButton}>✕</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.searchContainer}>
              <Text style={styles.searchIcon}>🔍</Text>
              <TextInput
                style={styles.searchInput}
                placeholder="Buscar cliente..."
                value={busqCli}
                onChangeText={setBusqCli}
                placeholderTextColor="#aaa"
              />
            </View>
            {loadingClientes ? (
              <ActivityIndicator
                size="small"
                color="#f4a261"
                style={{ marginVertical: 20 }}
              />
            ) : (
              <ScrollView>
                {clientesFiltrados.length === 0 ? (
                  <Text
                    style={{ color: "#888", textAlign: "center", padding: 16 }}
                  >
                    No hay clientes registrados
                  </Text>
                ) : (
                  clientesFiltrados.map((c) => (
                    <TouchableOpacity
                      key={c.id}
                      style={styles.optionRow}
                      onPress={() => {
                        setClienteSel(c);
                        setModalCliente(false);
                        setBusqCli("");
                      }}
                    >
                      <Text style={styles.optionNombre}>{c.nombre}</Text>
                      <Text style={styles.optionSub}>
                        DNI: {c.dni}
                        {c.empresa ? ` · ${c.empresa}` : ""}
                      </Text>
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
                color="#f4a261"
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
                        {p.codigo ?? "-"} · S/ {p.precio_venta.toFixed(2)} ·
                        Stock: {p.stock}
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
