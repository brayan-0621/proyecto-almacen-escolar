import { Dimensions, StyleSheet } from "react-native";

export const { width } = Dimensions.get("window");
export const cardWidth = (width - 16 * 2 - 10) / 2;

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F6F8",
  },

  content: {
    padding: 16,
  },

  greeting: {
    fontSize: width * 0.055,
    fontWeight: "700",
    color: "#333",
    marginBottom: 2,
  },

  date: {
    fontSize: width * 0.033,
    color: "#999",
    marginBottom: 20,
  },

  sectionTitle: {
    fontSize: width * 0.042,
    fontWeight: "700",
    color: "#444",
    marginBottom: 10,
    marginTop: 6,
  },

  kpiGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 20,
  },

  kpiCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: width * 0.035,
    borderLeftWidth: 5,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },

  kpiIcon: {
    fontSize: width * 0.06,
    marginBottom: 6,
  },

  kpiValue: {
    fontSize: width * 0.055,
    fontWeight: "800",
    color: "#333",
  },

  kpiLabel: {
    fontSize: width * 0.03,
    color: "#888",
    marginTop: 2,
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 4,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },

  alertRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },

  alertLeft: {
    flex: 1,
    marginRight: 10,
  },

  alertProduct: {
    fontSize: width * 0.035,
    fontWeight: "600",
    color: "#333",
  },

  alertSub: {
    fontSize: width * 0.028,
    color: "#aaa",
    marginTop: 2,
  },

  alertBadge: {
    backgroundColor: "#fdecea",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 4,
    minWidth: width * 0.1,
    alignItems: "center",
  },

  alertBadgeText: {
    color: "#f44336",
    fontWeight: "800",
    fontSize: width * 0.038,
  },

  // MOVIMIENTOS
  movRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    gap: 10,
  },

  tipoBadge: {
    borderRadius: 8,
    paddingHorizontal: width * 0.02,
    paddingVertical: 6,
    width: width * 0.18,
    alignItems: "center",
  },

  entrada: {
    backgroundColor: "#e8f5e9",
  },

  salida: {
    backgroundColor: "#fdecea",
  },

  tipoText: {
    fontSize: width * 0.028,
    fontWeight: "700",
    color: "#555",
  },

  movInfo: {
    flex: 1,
  },

  movDesc: {
    fontSize: width * 0.033,
    fontWeight: "600",
    color: "#333",
  },

  movFecha: {
    fontSize: width * 0.028,
    color: "#aaa",
    marginTop: 2,
  },

  movRight: {
    alignItems: "flex-end",
  },

  movMonto: {
    fontSize: width * 0.035,
    fontWeight: "700",
    color: "#333",
  },

  movCantidad: {
    fontSize: width * 0.028,
    color: "#aaa",
    marginTop: 2,
  },
});
