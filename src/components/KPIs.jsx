import { useInventario } from "../context/InventarioContext";
import { formatearPrecio } from "../utils/formato";
import useContador from "../hooks/useContador";

export default function KPIs() {
  const { inventario } = useInventario();

  const total    = inventario.length;
  const criticos = inventario.filter(p => p.cantidad < 5).length;
  const valor    = inventario.reduce((a, p) => a + p.cantidad * p.precio, 0);
  const conteoCats = {};
  inventario.forEach(p => {
    conteoCats[p.categoria] = (conteoCats[p.categoria] || 0) + 1;
  });
  const lider = Object.entries(conteoCats).sort((a, b) => b[1] - a[1])[0]?.[0] || "-";

  const totalAnimado    = useContador(total);
  const criticosAnimado = useContador(criticos);
  const valorAnimado    = useContador(valor);

  return (
    <section className="stats-grid">
      <div className="stat-card">
        <span className="stat-label">Total Productos</span>
        <h2>{totalAnimado}</h2>
      </div>
      <div className="stat-card">
        <span className="stat-label">Stock Critico</span>
        <h2 className="text-danger">{criticosAnimado}</h2>
      </div>
      <div className="stat-card">
        <span className="stat-label">Categoria Lider</span>
        <h2>{lider}</h2>
      </div>
      <div className="stat-card">
        <span className="stat-label">Valor Total Bodega</span>
        <h2 className="text-success">{formatearPrecio(valorAnimado)}</h2>
      </div>
    </section>
  );
}