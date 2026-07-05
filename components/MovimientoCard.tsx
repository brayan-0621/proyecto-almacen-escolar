import { memo } from "react";
import { Text, View } from "react-native";
import { styles } from "../styles/movimientos.styles";

type Props = {
  tipo: "entrada" | "salida";
  descripcion: string;
  monto: number;
  fecha: string;
  cliente_nombre?: string;
  proveedor_nombre?: string;
};

function MovimientoCard({
  tipo,
  descripcion,
  monto,
  fecha,
  cliente_nombre,
  proveedor_nombre,
}: Props) {
  return (
    <View style={styles.card}>
      <View
        style={[
          styles.tipoBadge,
          tipo === "entrada" ? styles.entrada : styles.salida,
        ]}
      >
        <Text style={styles.tipoIcon}>{tipo === "entrada" ? "▲" : "▼"}</Text>
        <Text
          style={[
            styles.tipoText,
            tipo === "entrada" ? styles.tipoTextEntrada : styles.tipoTextSalida,
          ]}
        >
          {tipo === "entrada" ? "Entrada" : "Salida"}
        </Text>
      </View>
      <View style={styles.info}>
        <Text style={styles.descripcion} numberOfLines={1}>
          {descripcion}
        </Text>
        <Text style={styles.sub}>
          {fecha ? new Date(fecha).toLocaleDateString("es-PE") : ""}
          {cliente_nombre ? `  ·  ${cliente_nombre}` : ""}
          {proveedor_nombre ? `  ·  ${proveedor_nombre}` : ""}
        </Text>
      </View>
      <Text style={styles.monto}>S/ {Number(monto ?? 0).toFixed(2)}</Text>
    </View>
  );
}

export default memo(MovimientoCard);
