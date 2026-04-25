import { useState } from "react";
import {
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
import { styles } from "../styles/compra.styles";

type Proveedor = { id: number; nombre: string; ruc: string };
type ProductoOpc = {
  id: number;
  nombre: string;
  codigo: string;
  precio_compra: number;
};
type ItemCompra = {
  productoId: number;
  nombre: string;
  codigo: string;
  cantidad: number;
  precio_unitario: number;
};

const PROVEEDORES: Proveedor[] = [
  { id: 1, nombre: "Distribuidora Escolar SAC", ruc: "20512345678" },
  { id: 2, nombre: "Papelería Mayorista Perú", ruc: "20598765432" },
  { id: 3, nombre: "Útiles del Norte", ruc: "20567891234" },
  { id: 4, nombre: "Importadora Escolar Lima", ruc: "20534567890" },
];

const PRODUCTOS_OPC: ProductoOpc[] = [
  {
    id: 1,
    nombre: "Cuadernos A4 x50 hojas",
    codigo: "CUA-001",
    precio_compra: 2.5,
  },
  {
    id: 2,
    nombre: "Lápices 2B Caja x12",
    codigo: "LAP-002",
    precio_compra: 6.0,
  },
  {
    id: 3,
    nombre: "Papel Bond A4 x500",
    codigo: "PAP-003",
    precio_compra: 18.0,
  },
  {
    id: 4,
    nombre: "Borradores blancos",
    codigo: "BOR-004",
    precio_compra: 0.5,
  },
  {
    id: 5,
    nombre: "Plumones gruesos x12",
    codigo: "PLU-005",
    precio_compra: 12.0,
  },
  { id: 6, nombre: "Tijeras escolares", codigo: "TIJ-006", precio_compra: 3.0 },
  {
    id: 7,
    nombre: "Pegamento en barra",
    codigo: "PEG-007",
    precio_compra: 2.0,
  },
  { id: 8, nombre: "Reglas 30cm", codigo: "REG-008", precio_compra: 1.5 },
];

export default function Compra() {
  const insets = useSafeAreaInsets();
  const [proveedorSel, setProveedorSel] = useState<Proveedor | null>(null);
  const [items, setItems] = useState<ItemCompra[]>([]);
  const [modalProveedor, setModalProveedor] = useState(false);
  const [modalProducto, setModalProducto] = useState(false);
  const [busqProv, setBusqProv] = useState("");
  const [busqProd, setBusqProd] = useState("");

  const subtotal = items.reduce(
    (s, i) => s + i.cantidad * i.precio_unitario,
    0,
  );
  const igv = subtotal * 0.18;
  const total = subtotal + igv;

  const agregarProducto = (p: ProductoOpc) => {
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
          codigo: p.codigo,
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

  const confirmar = () => {
    if (!proveedorSel) {
      Alert.alert("Atención", "Selecciona un proveedor");
      return;
    }
    if (items.length === 0) {
      Alert.alert("Atención", "Agrega al menos un producto");
      return;
    }
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
  };

  const proveedoresFiltrados = PROVEEDORES.filter(
    (p) =>
      p.nombre.toLowerCase().includes(busqProv.toLowerCase()) ||
      p.ruc.includes(busqProv),
  );
  const productosFiltrados = PRODUCTOS_OPC.filter(
    (p) =>
      p.nombre.toLowerCase().includes(busqProd.toLowerCase()) ||
      p.codigo.toLowerCase().includes(busqProd.toLowerCase()),
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
        {/* PROVEEDOR */}
        <Text style={styles.sectionTitle}>📦 Nueva Compra</Text>
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
          label="✅ Confirmar Compra"
          onPress={confirmar}
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
            <ScrollView>
              {proveedoresFiltrados.map((p) => (
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
              ))}
            </ScrollView>
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
            <ScrollView>
              {productosFiltrados.map((p) => (
                <TouchableOpacity
                  key={p.id}
                  style={styles.optionRow}
                  onPress={() => agregarProducto(p)}
                >
                  <Text style={styles.optionNombre}>{p.nombre}</Text>
                  <Text style={styles.optionSub}>
                    {p.codigo} · S/ {p.precio_compra.toFixed(2)} c/u
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}
