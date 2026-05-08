import { useState } from "react";
import { useInventario } from "../context/InventarioContext";
import { formatearPrecio } from "../utils/formato";

export default function TablaInventario() {
  const { inventario, eliminarProducto, setProductoEnEdicion } = useInventario();
  const [busqueda, setBusqueda]   = useState("");
  const [categoria, setCategoria] = useState("Todos");
  const [pagina, setPagina]       = useState(1);
  const POR_PAGINA = 10;

  const filtrados = inventario.filter(p => {
    const coincideTexto = !busqueda ||
      p.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      p.categoria.toLowerCase().includes(busqueda.toLowerCase());
    const coincideCat = categoria === "Todos" || p.categoria === categoria;
    return coincideTexto && coincideCat;
  });

  const totalPags = Math.max(1, Math.ceil(filtrados.length / POR_PAGINA));
  const paginaActual = Math.min(pagina, totalPags);
  const visibles = filtrados.slice((paginaActual - 1) * POR_PAGINA, paginaActual * POR_PAGINA);

  function handleBusqueda(e) {
    setBusqueda(e.target.value);
    setPagina(1);
  }

  function handleCategoria(e) {
    setCategoria(e.target.value);
    setPagina(1);
  }

  return (
    <section className="card">
      <div className="list-header">
        <h3>Stock Actual</h3>
        <div className="search-bar-group">
          <input
            type="text"
            placeholder="Buscar producto..."
            value={busqueda}
            onChange={handleBusqueda}
          />
          <select value={categoria} onChange={handleCategoria}>
            <option value="Todos">Todas las categorias</option>
            <option value="Hardware">Hardware</option>
            <option value="Software">Software</option>
            <option value="Redes">Redes</option>
            <option value="Perifericos">Perifericos</option>
          </select>
        </div>
      </div>

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Producto</th>
              <th>Precio Unit.</th>
              <th>Cant.</th>
              <th>Subtotal</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {visibles.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ textAlign: "center", padding: "30px", color: "#94a3b8" }}>
                  Sin resultados
                </td>
              </tr>
            ) : visibles.map((prod, i) => {
              const realIndex = inventario.indexOf(prod);
              return (
                <tr key={prod.id} className={prod.cantidad < 5 ? "warning-row" : ""}>
                  <td>#{prod.id}</td>
                  <td>
                    <strong>{prod.nombre}</strong><br />
                    <small className="cat-badge">{prod.categoria}</small>
                  </td>
                  <td>{formatearPrecio(prod.precio)}</td>
                  <td>
                    {prod.cantidad}
                    {prod.cantidad < 5 && <span className="badge-danger"> Critico</span>}
                  </td>
                  <td>{formatearPrecio(prod.precio * prod.cantidad)}</td>
                  <td>
                    <button
                      className="btn-edit"
                      onClick={() => setProductoEnEdicion({ index: realIndex, datos: prod })}
                    >✏️</button>
                    <button className="btn-delete" onClick={() => {
                      if (confirm("Eliminar " + prod.nombre + "?")) eliminarProducto(realIndex);
                    }}>🗑️</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="paginacion">
        <span className="pag-info">{filtrados.length} productos · pag {paginaActual}/{totalPags}</span>
        <div className="pag-btns">
          <button disabled={paginaActual === 1} onClick={() => setPagina(p => p - 1)}>Anterior</button>
          <button disabled={paginaActual === totalPags} onClick={() => setPagina(p => p + 1)}>Siguiente</button>
        </div>
      </div>
    </section>
  );
}