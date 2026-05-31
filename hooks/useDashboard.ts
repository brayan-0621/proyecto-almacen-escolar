import { useEffect, useState } from "react";
import { apiGet } from "../services/api";

type KpiData = {
  total_productos: number;
  bajo_stock: number;
  mov_hoy: number;
  vendido_hoy: number;
};

export function useDashboard() {
  const [kpis, setKpis] = useState<KpiData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    apiGet<KpiData>("/dashboard/kpis")
      .then((data) => {
        setKpis(data);
      })
      .catch((e) => {
        setError(e.message);
      })
      .finally(() => setLoading(false));
  }, []);

  return { kpis, loading, error };
}
