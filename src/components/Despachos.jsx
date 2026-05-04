import { useState } from "react";
import { useInventario } from "../context/InventarioContext";
import { formatearPrecio } from "../utils/formato";

export default function Despachos() {
  const { inventario, despachos, registrarDespacho } = useInventario();
  const [idProducto, setIdProducto] = useState("");
  const [responsable, setResponsable] = useState("");
  const [cantidad, setCantidad] = useState("");
  const [errores, setErrores] = useState({});

  const disponibles = inventario.filter(p => p.cantidad > 0);

  function validar() {
    const e = {};
    if (!idProducto) e.idProducto = "Seleccione un producto";
    if (!responsable) e.responsable = "Ingrese el colaborador";
    if (!cantidad || parseInt(cantidad) <= 0) e.cantidad = "Cantidad debe ser mayor a 0";

    if (idProducto && cantidad) {
      const prod = inventario.find(p => p.id === parseInt(idProducto));
      if (prod && parseInt(cantidad) > prod.cantidad) {
        e.cantidad = "Stock insuficiente (disponible: " + prod.cantidad + ")";
      }
    }
    setErrores(e);
    return Object.keys(e).length === 0;
  }

  function handleSubmit() {
    if (!validar()) return;
    const prod = inventario.find(p => p.id === parseInt(idProducto));
    if (!confirm("Confirmar despacho?\n" + cantidad + "x " + prod.nombre + " a " + responsable)) return;
    registrarDespacho(parseInt(idProducto), responsable, parseInt(cantidad));
    setIdProducto("");
    setResponsable("");
    setCantidad("");
    setErrores({});
  }
function exportarHistorial() {
  if (despachos.length === 0) return alert("No hay despachos registrados");
  
  let csv = "Fecha,Hora,Producto,Responsable,Cantidad\n";
  despachos.forEach(d => {
    csv += `${d.fecha},${d.hora},${d.producto},${d.responsable},${d.cantidad}\n`;
  });
  
  const blob = new Blob([csv], { type: "text/csv" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `despachos_${new Date().toISOString().split("T")[0]}.csv`;
  a.click();
}

  return (
    <div>
      <section className="card">
        <h3>Registrar Salida</h3>
        <p style={{ color: "#94a3b8", marginBottom: "16px", fontSize: "0.85rem" }}>
          Registra la entrega de equipos a colaboradores.
        </p>
        <div className="grid-inputs">
          <div className="input-group">
            <select
              value={idProducto}
              onChange={e => { setIdProducto(e.target.value); setErrores({ ...errores, idProducto: null }); }}
              className={errores.idProducto ? "input-error" : ""}
            >
              <option value="">Seleccione producto...</option>
              {disponibles.map(p => (
                <option key={p.id} value={p.id}>
                  {p.nombre} ({p.cantidad} disponibles)
                </option>
              ))}
            </select>
            {errores.idProducto && <span className="field-error">{errores.idProducto}</span>}
          </div>

          <div className="input-group">
            <input
              type="text"
              placeholder="Nombre del Colaborador"
              value={responsable}
              onChange={e => { setResponsable(e.target.value); setErrores({ ...errores, responsable: null }); }}
              className={errores.responsable ? "input-error" : ""}
            />
            {errores.responsable && <span className="field-error">{errores.responsable}</span>}
          </div>

          <div className="input-group">
            <input
              type="number"
              placeholder="Cantidad"
              value={cantidad}
              min="1"
              onChange={e => { setCantidad(e.target.value); setErrores({ ...errores, cantidad: null }); }}
              className={errores.cantidad ? "input-error" : ""}
            />
            {errores.cantidad && <span className="field-error">{errores.cantidad}</span>}
          </div>

          <div className="form-actions">
            <button onClick={handleSubmit} style={{ background: "#22c55e" }}>
              Confirmar Salida
            </button>
          </div>
        </div>
      </section>

   <section className="card">
  <div className="list-header">
    <h3>Historial de Entregas</h3>
    <button onClick={exportarHistorial} style={{ fontSize: "0.8rem", padding: "8px 14px" }}>
      📥 Descargar CSV
    </button>
  </div>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Producto</th>
                <th>Responsable</th>
                <th>Cantidad</th>
              </tr>
            </thead>
            <tbody>
              {despachos.length === 0 ? (
                <tr>
                  <td colSpan="4" style={{ textAlign: "center", padding: "20px", color: "#94a3b8" }}>
                    Sin despachos registrados
                  </td>
                </tr>
              ) : despachos.map(d => (
                <tr key={d.id}>
                  <td>{d.fecha}<br /><small style={{ color: "#94a3b8" }}>{d.hora}</small></td>
                  <td>{d.producto}</td>
                  <td>{d.responsable}</td>
                  <td>{d.cantidad}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}