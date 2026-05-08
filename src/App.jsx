import { useState, useEffect } from "react";
import { useInventario } from "./context/InventarioContext";
import KPIs from "./components/KPIs";
import FormularioProducto from "./components/FormularioProducto";
import TablaInventario from "./components/TablaInventario";
import Despachos from "./components/Despachos";
import Logs from "./components/Logs";
import Grafico from "./components/Grafico";
import Modal from "./components/Modal";
import "./App.css";

export default function App() {
  const [seccion, setSeccion] = useState("inventario");

  // Fix: lazy initializer — evita leer localStorage en cada render
  const [temaClaro, setTemaClaro] = useState(() => localStorage.getItem("tema") === "light");

  const [verModal, setVerModal] = useState(false);
  const [exportando, setExportando] = useState(false); // Fix: feedback al exportar
  const { inventario, despachos } = useInventario();
  const criticos = inventario.filter(p => p.cantidad < 5);

  useEffect(() => {
    if (temaClaro) {
      document.body.classList.add("light-mode");
      localStorage.setItem("tema", "light");
    } else {
      document.body.classList.remove("light-mode");
      localStorage.setItem("tema", "dark");
    }
  }, [temaClaro]);

  async function exportarExcel() {
    setExportando(true);
    try {
      const XLSX = await import("xlsx");
      const wb = XLSX.utils.book_new();
      const wsInv = XLSX.utils.json_to_sheet(inventario.map(p => ({
        ID: p.id,
        Nombre: p.nombre,
        Categoria: p.categoria,
        Cantidad: p.cantidad,
        "Precio Unitario COP": p.precio,
        "Subtotal COP": p.precio * p.cantidad
      })));
      XLSX.utils.book_append_sheet(wb, wsInv, "Inventario");
      if (despachos.length > 0) {
        const wsDes = XLSX.utils.json_to_sheet(despachos.map(d => ({
          Fecha: d.fecha,
          Hora: d.hora,
          Producto: d.producto,
          Responsable: d.responsable,
          Cantidad: d.cantidad
        })));
        XLSX.utils.book_append_sheet(wb, wsDes, "Despachos");
      }
      XLSX.writeFile(wb, `StockFlow_${new Date().toISOString().split("T")[0]}.xlsx`);
    } finally {
      setExportando(false);
    }
  }

  return (
    <>
      <div className="container">
        <aside className="sidebar">
          <div className="profile-box">
            <div className="avatar">YM</div>
            <h3>Yurani Martínez</h3>
            {/* Fix: título profesional real */}
            <p>Tecnóloga en Desarrollo de Software</p>
            <span className="badge-aprende">🟢 Disponible</span>
          </div>

          <nav>
            {/* Fix: template literals en className */}
            <button
              className={`nav-btn ${seccion === "inventario" ? "active" : ""}`}
              onClick={() => setSeccion("inventario")}
            >
              📦 Inventario
            </button>
            <button
              className={`nav-btn ${seccion === "despachos" ? "active" : ""}`}
              onClick={() => setSeccion("despachos")}
            >
              🚚 Despachos
            </button>
            <button
              className={`nav-btn ${seccion === "grafico" ? "active" : ""}`}
              onClick={() => setSeccion("grafico")}
            >
              📈 Gráfico
            </button>
            {/* Fix: feedback visual al exportar */}
            <button
              className="nav-btn"
              onClick={exportarExcel}
              disabled={exportando}
            >
              {exportando ? "⏳ Generando..." : "📊 Exportar Excel"}
            </button>
            <button className="nav-btn" onClick={() => setVerModal(true)}>
              ℹ️ Acerca de
            </button>
          </nav>

          <div className="sidebar-footer">
            <div className="sistema-info">
              <p>📦 {inventario.length} productos</p>
              <p>🚚 {despachos.length} despachos</p>
              <p>⚡ StockFlow v2.0 React</p>
            </div>
            <div className="sidebar-links">
              <a href="https://www.linkedin.com/in/yurani-mart%C3%ADnez-75b2001a5/" target="_blank" rel="noreferrer">🔗 LinkedIn</a>
              <a href="https://github.com/yuranimar" target="_blank" rel="noreferrer">💻 GitHub</a>
            </div>
            <button className="nav-btn" onClick={() => setTemaClaro(t => !t)}>
              {temaClaro ? "🌙 Modo Oscuro" : "☀️ Modo Claro"}
            </button>
          </div>
        </aside>

        <main className="main-content">
          <header>
            <h1>Gestión de Activos Tecnológicos</h1>
            <p>Medellín Valle del Software — StockFlow v2.0 React</p>
          </header>

          {criticos.length > 0 && (
            <div className="alerta-stock-banner">
              ⚠️ <strong>{criticos.length} producto(s) con stock crítico:</strong>{" "}
              {criticos.map(p => p.nombre).join(", ")}
            </div>
          )}

          {seccion === "inventario" && (
            <>
              <KPIs />
              <FormularioProducto />
              <div className="dashboard-body">
                <TablaInventario />
              </div>
              <Logs />
            </>
          )}

          {seccion === "grafico" && (
            <>
              <KPIs />
              <div className="dashboard-body">
                <Grafico />
              </div>
            </>
          )}

          {seccion === "despachos" && (
            <>
              <Despachos />
              <Logs />
            </>
          )}
        </main>
      </div>

      {verModal && <Modal onCerrar={() => setVerModal(false)} />}
    </>
  );
}
