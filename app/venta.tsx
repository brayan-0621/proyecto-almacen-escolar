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
import { styles } from "../styles/venta.styles";

type Cliente = { id: number; nombre: string; dni: string; empresa?: string };
type ProductoOpc = {
  id: number;
  nombre: string;
  codigo: string;
  precio_venta: number;
  stock: number;
};
type ItemVenta = {
  productoId: number;
  nombre: string;
  codigo: string;
  cantidad: number;
  precio_unitario: number;
  stockMax: number;
};

const CLIENTES: Cliente[] = [
  { id: 1, nombre: "Juan Pérez", dni: "12345678", empresa: "Librería Central" },
  {
    id: 2,
    nombre: "María López",
    dni: "87654321",
    empresa: "Colegio San José",
  },
  {
    id: 3,
    nombre: "Carlos Ruiz",
    dni: "11223344",
    empresa: "Distribuidora Norte",
  },
  { id: 4, nombre: "Ana Torres", dni: "44332211" },
  {
    id: 5,
    nombre: "Pedro Sánchez",
    dni: "55667788",
    empresa: "Papelería El Estudiante",
  },
];

const PRODUCTOS_OPC: ProductoOpc[] = [
  {
    id: 1,
    nombre: "Cuadernos A4 x50 hojas",
    codigo: "CUA-001",
    precio_venta: 4.0,
    stock: 120,
  },
  {
    id: 2,
    nombre: "Lápices 2B Caja x12",
    codigo: "LAP-002",
    precio_venta: 10.0,
    stock: 8,
  },
  {
    id: 3,
    nombre: "Papel Bond A4 x500",
    codigo: "PAP-003",
    precio_venta: 25.0,
    stock: 45,
  },
  {
    id: 4,
    nombre: "Borradores blancos",
    codigo: "BOR-004",
    precio_venta: 1.0,
    stock: 3,
  },
  {
    id: 5,
    nombre: "Plumones gruesos x12",
    codigo: "PLU-005",
    precio_venta: 18.0,
    stock: 30,
  },
  {
    id: 6,
    nombre: "Tijeras escolares",
    codigo: "TIJ-006",
    precio_venta: 5.5,
    stock: 4,
  },
  {
    id: 7,
    nombre: "Pegamento en barra",
    codigo: "PEG-007",
    precio_venta: 3.5,
    stock: 50,
  },
  {
    id: 8,
    nombre: "Reglas 30cm",
    codigo: "REG-008",
    precio_venta: 2.5,
    stock: 2,
  },
];

export default function Venta() {
  const insets = useSafeAreaInsets();
  const [clienteSel, setClienteSel] = useState<Cliente | null>(null);
  const [items, setItems] = useState<ItemVenta[]>([]);
  const [modalCliente, setModalCliente] = useState(false);
  const [modalProducto, setModalProducto] = useState(false);
  const [busqCli, setBusqCli] = useState("");
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
          i.productoId === p.id
            ? { ...i, cantidad: Math.min(i.stockMax, i.cantidad + 1) }
            : i,
        );
      return [
        ...prev,
        {
          productoId: p.id,
          nombre: p.nombre,
          codigo: p.codigo,
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

  const confirmar = () => {
    if (items.length === 0) {
      Alert.alert("Atención", "Agrega al menos un producto");
      return;
    }
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
  };

  const clientesFiltrados = CLIENTES.filter(
    (c) =>
      c.nombre.toLowerCase().includes(busqCli.toLowerCase()) ||
      c.dni.includes(busqCli),
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
        <Text style={styles.sectionTitle}>🧾 Nueva Venta</Text>

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
          label="✅ Confirmar Venta"
          onPress={confirmar}
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
            <ScrollView>
              {clientesFiltrados.map((c) => (
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
                    {p.codigo} · S/ {p.precio_venta.toFixed(2)} · Stock:{" "}
                    {p.stock}
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
