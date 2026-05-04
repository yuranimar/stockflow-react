import { createContext, useContext, useState } from "react";
import Storage from "../utils/storage";

const datosIniciales = [
  { id: 1, nombre: "Laptop Dell XPS 15",   categoria: "Hardware",    cantidad: 15, precio: 2500000 },
  { id: 2, nombre: "Licencia Windows Pro", categoria: "Software",    cantidad: 3,  precio: 450000  },
  { id: 3, nombre: "Switch TP-Link 24p",   categoria: "Redes",       cantidad: 8,  precio: 320000  },
  { id: 4, nombre: "Mouse Logitech MX",    categoria: "Perifericos", cantidad: 2,  precio: 180000  },
];

const InventarioContext = createContext();

export function InventarioProvider({ children }) {
  const [inventario, setInventario] = useState(Storage.get("inventario_data", datosIniciales));
  const [despachos, setDespachos]   = useState(Storage.get("despachos_data", []));
  const [logs, setLogs]             = useState(Storage.get("audit_logs", []));
  const [nextId, setNextId]         = useState(Storage.get("next_id", 5));

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
    const nuevo = { id: nextId, ...datos };
    const lista = [...inventario, nuevo];
    guardarInventario(lista);
    setNextId(nextId + 1);
    Storage.set("next_id", nextId + 1);
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
    const copia = [...inventario];
    copia[index] = { ...copia[index], cantidad: copia[index].cantidad - cantidad };
    guardarInventario(copia);
    const despacho = {
      id: Date.now(),
      fecha: new Date().toLocaleDateString("es-CO"),
      hora: new Date().toLocaleTimeString("es-CO"),
      producto: inventario[index].nombre,
      responsable,
      cantidad
    };
    guardarDespachos([despacho, ...despachos]);
    agregarLog("Despacho: " + cantidad + "x " + inventario[index].nombre + " a " + responsable);
  }

  return (
    <InventarioContext.Provider value={{
      inventario, despachos, logs,
      agregarProducto, editarProducto, eliminarProducto, registrarDespacho
    }}>
      {children}
    </InventarioContext.Provider>
  );
}

export function useInventario() {
  return useContext(InventarioContext);
}