import { Dimensions, StyleSheet } from "react-native";
const { width } = Dimensions.get("window");

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F4F6F8" },
  content: { padding: 16 },

  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  searchIcon: { fontSize: 16, marginRight: 8, color: "#aaa" },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: width * 0.035,
    color: "#333",
  },

  filterContainer: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 12,
    flexWrap: "wrap",
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  filterChipActive: { backgroundColor: "#4CAF50", borderColor: "#4CAF50" },
  filterChipText: { fontSize: 12, color: "#555", fontWeight: "600" },
  filterChipTextActive: { color: "#fff" },

  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: { fontSize: width * 0.045, fontWeight: "700", color: "#444" },
  headerRight: { flexDirection: "row", alignItems: "center", gap: 8 },
  totalBadge: {
    backgroundColor: "#4CAF50",
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  totalText: { color: "#fff", fontSize: 12, fontWeight: "700" },
  addButton: {
    backgroundColor: "#f4a261",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  addButtonText: { color: "#fff", fontWeight: "700", fontSize: 13 },

  emptyContainer: { alignItems: "center", paddingVertical: 40 },
  emptyIcon: { fontSize: 48, marginBottom: 10 },
  emptyText: { fontSize: 15, color: "#aaa" },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "flex-end",
  },
  modalContainer: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: { fontSize: width * 0.05, fontWeight: "700", color: "#333" },
  closeButton: { fontSize: 22, color: "#aaa" },
  errorText: { color: "red", fontSize: 12, marginBottom: 6, marginTop: -6 },

  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    marginTop: 10,
    marginBottom: 20,
  },
  pageButton: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 8,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  pageButtonActive: { backgroundColor: "#4CAF50", borderColor: "#4CAF50" },
  pageButtonDisabled: { opacity: 0.4 },
  pageButtonText: { fontSize: 13, color: "#555", fontWeight: "600" },
  pageButtonTextActive: { color: "#fff" },
});
