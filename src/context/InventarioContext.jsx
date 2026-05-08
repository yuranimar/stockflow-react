import { createContext, useContext, useState } from "react";
import Storage from "../utils/storage";

const datosIniciales = [
  { id: crypto.randomUUID(), nombre: "Laptop Dell XPS 15",   categoria: "Hardware",    cantidad: 15, precio: 2500000 },
  { id: crypto.randomUUID(), nombre: "Licencia Windows Pro", categoria: "Software",    cantidad: 3,  precio: 450000  },
  { id: crypto.randomUUID(), nombre: "Switch TP-Link 24p",   categoria: "Redes",       cantidad: 8,  precio: 320000  },
  { id: crypto.randomUUID(), nombre: "Mouse Logitech MX",    categoria: "Perifericos", cantidad: 2,  precio: 180000  },
];

const InventarioContext = createContext();

export function InventarioProvider({ children }) {
  const [inventario, setInventario] = useState(Storage.get("inventario_data", datosIniciales));
  const [despachos, setDespachos]   = useState(Storage.get("despachos_data", []));
  const [logs, setLogs]             = useState(Storage.get("audit_logs", []));
  const [productoEnEdicion, setProductoEnEdicion] = useState(null); // { index, datos }

  function guardarInventario(data) {
    setInventario(data);
    Storage.set("inventario_data", data);
  }

  function guardarDespachos(data) {
    setDespachos(data);
    Storage.set("despachos_data", data);
  }

  function agregarLog(mensaje) {
    const nuevo = { hora: new Date().toLocaleTimeString("es-CO"), texto: mensaje };
    const nuevos = [nuevo, ...logs].slice(0, 100);
    setLogs(nuevos);
    Storage.set("audit_logs", nuevos);
  }

  function agregarProducto(datos) {
    const nuevo = { id: crypto.randomUUID(), ...datos };
    const lista = [...inventario, nuevo];
    guardarInventario(lista);
    agregarLog("Anadido: " + datos.nombre);
  }

  function editarProducto(index, datos) {
    const copia = [...inventario];
    copia[index] = { ...copia[index], ...datos };
    guardarInventario(copia);
    agregarLog("Editado: " + datos.nombre);
  }

  function eliminarProducto(index) {
    const nombre = inventario[index].nombre;
    guardarInventario(inventario.filter((_, i) => i !== index));
    agregarLog("Eliminado: " + nombre);
  }

  function registrarDespacho(idProducto, responsable, cantidad) {
    const index = inventario.findIndex(p => p.id === idProducto);
    if (index === -1) return;
    // Bug 4 fix: capturar nombre ANTES de mutar el array
    const nombreProducto = inventario[index].nombre;
    const copia = [...inventario];
    copia[index] = { ...copia[index], cantidad: copia[index].cantidad - cantidad };
    guardarInventario(copia);
    const despacho = {
      id: crypto.randomUUID(),
      fecha: new Date().toLocaleDateString("es-CO"),
      hora: new Date().toLocaleTimeString("es-CO"),
      producto: nombreProducto,
      responsable,
      cantidad
    };
    guardarDespachos([despacho, ...despachos]);
    agregarLog("Despacho: " + cantidad + "x " + nombreProducto + " a " + responsable);
  }

  return (
    <InventarioContext.Provider value={{
      inventario, despachos, logs,
      productoEnEdicion, setProductoEnEdicion,
      agregarProducto, editarProducto, eliminarProducto, registrarDespacho
    }}>
      {children}
    </InventarioContext.Provider>
  );
}

export function useInventario() {
  return useContext(InventarioContext);
}