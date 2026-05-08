import { useState, useEffect } from "react";
import { useInventario } from "../context/InventarioContext";

const categorias = ["Hardware", "Software", "Redes", "Perifericos"];
const camposVacios = { nombre: "", cantidad: "", precio: "", categoria: "Hardware" };

export default function FormularioProducto() {
  const { agregarProducto, editarProducto, productoEnEdicion, setProductoEnEdicion } = useInventario();
  const [campos, setCampos]   = useState(camposVacios);
  const [errores, setErrores] = useState({});

  // Bug 1 fix: leer el producto a editar del Context, sin window.*
  useEffect(() => {
    if (productoEnEdicion) {
      const { datos } = productoEnEdicion;
      setCampos({
        nombre:    datos.nombre,
        cantidad:  datos.cantidad,
        precio:    datos.precio,
        categoria: datos.categoria,
      });
      setErrores({});
    }
  }, [productoEnEdicion]);

  function validar() {
    const e = {};
    if (!campos.nombre || campos.nombre.length < 3)
      e.nombre = !campos.nombre ? "El nombre es requerido" : "Minimo 3 caracteres";
    if (campos.cantidad === "" || parseInt(campos.cantidad) < 0)
      e.cantidad = "Cantidad invalida (min. 0)";
    if (!campos.precio || parseFloat(campos.precio) <= 0)
      e.precio = "Precio invalido (debe ser mayor a 0)";
    setErrores(e);
    return Object.keys(e).length === 0;
  }

  function handleSubmit() {
    if (!validar()) return;
    const datos = {
      nombre:    campos.nombre.trim(),
      cantidad:  parseInt(campos.cantidad),
      precio:    parseFloat(campos.precio),
      categoria: campos.categoria,
    };
    if (productoEnEdicion !== null) {
      editarProducto(productoEnEdicion.index, datos);
    } else {
      agregarProducto(datos);
    }
    cancelar();
  }

  function cancelar() {
    setCampos(camposVacios);
    setErrores({});
    setProductoEnEdicion(null);
  }

  function handleChange(e) {
    setCampos({ ...campos, [e.target.name]: e.target.value });
    if (errores[e.target.name]) setErrores({ ...errores, [e.target.name]: null });
  }

  return (
    <section className="card">
      <h3>Registrar / Editar Activo</h3>
      <div className="grid-inputs">

        <div className="input-group">
          <input
            name="nombre"
            value={campos.nombre}
            onChange={handleChange}
            placeholder="Nombre del Producto"
            className={errores.nombre ? "input-error" : ""}
          />
          {errores.nombre && <span className="field-error">{errores.nombre}</span>}
        </div>

        <div className="input-group">
          <input
            name="cantidad"
            type="number"
            value={campos.cantidad}
            onChange={handleChange}
            placeholder="Cantidad"
            min="0"
            className={errores.cantidad ? "input-error" : ""}
          />
          {errores.cantidad && <span className="field-error">{errores.cantidad}</span>}
        </div>

        <div className="input-group">
          <select name="categoria" value={campos.categoria} onChange={handleChange}>
            {categorias.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <div className="input-group">
          <input
            name="precio"
            type="number"
            value={campos.precio}
            onChange={handleChange}
            placeholder="Precio Unitario COP"
            min="1"
            className={errores.precio ? "input-error" : ""}
          />
          {errores.precio && <span className="field-error">{errores.precio}</span>}
        </div>

        <div className="form-actions">
          <button onClick={handleSubmit}>
            {productoEnEdicion !== null ? "Guardar Cambios" : "+ Agregar"}
          </button>
          {productoEnEdicion !== null && (
            <button className="btn-cancelar" onClick={cancelar}>Cancelar</button>
          )}
        </div>

      </div>
    </section>
  );
}
