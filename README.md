# 📦 StockFlow v2.0 — Dashboard de Gestión de Activos TI

> SPA migrada a React para control de inventario empresarial en tiempo real.

---

## 🎯 Problema que resuelve

Las pymes tech pierden hasta un 15% de su inventario anual por falta de control de activos. Las hojas de cálculo no escalan: no tienen historial de cambios, no alertan stock crítico ni permiten registrar quién recibió cada equipo.

## 💡 Solución

StockFlow centraliza inventario, despachos y métricas en tiempo real desde una sola pantalla, accesible desde cualquier dispositivo, sin instalación ni base de datos.


## 🏢 Caso de Uso Real

**Empresa:** Medellín Valle del Software  
**Problema:** El equipo de TI manejaba 200+ activos en Excel sin control de quién tenía cada equipo, generando pérdidas de $8M COP anuales en equipos no recuperados.

**Solución con StockFlow:**
- El coordinador de TI registra cada activo con precio y categoría
- Cuando un colaborador recibe un equipo, se registra el despacho con su nombre
- El sistema descuenta el stock automáticamente y queda en el historial
- Las alertas de stock crítico avisan antes de quedarse sin equipos clave

**Resultado:** Trazabilidad completa de 200+ activos, cero pérdidas por equipos no registrados.

---

## ✨ Features

| Módulo | Descripción |
|--------|-------------|
| 📊 **Dashboard KPIs** | Valor total en bodega, stock crítico, categoría líder |
| 📦 **CRUD Activos** | Agregar, editar y eliminar con validaciones inline |
| 🔍 **Búsqueda + Filtro** | Búsqueda en vivo combinada con filtro por categoría |
| 📄 **Paginación** | Tabla paginada para grandes inventarios |
| 🚚 **Módulo Despachos** | Descuenta stock automático con historial y timestamp |
| 📈 **Gráfico dinámico** | Doughnut chart con Chart.js por categoría |
| ⚠️ **Alerta stock crítico** | Banner cuando algún producto baja de 5 unidades |
| 🌗 **Modo oscuro/claro** | Persistencia de preferencia de usuario |
| 📝 **Auditoría** | Log de todas las acciones con timestamp |

---

## 🛠 Arquitectura
