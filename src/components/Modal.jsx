export default function Modal({ onCerrar }) {
  return (
    <div className="modal-overlay" onClick={onCerrar}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <button className="modal-cerrar" onClick={onCerrar}>✕</button>

        <div className="modal-avatar">YM</div>
        <h2>StockFlow v2.0</h2>
        <p className="modal-subtitulo">Dashboard de Gestión de Activos TI</p>

        <div className="modal-descripcion">
          <p>
            Sistema SPA para control de inventario tecnológico en pymes.
            Permite registrar activos, controlar despachos y visualizar
            métricas en tiempo real sin necesidad de backend ni base de datos.
          </p>
        </div>

        <div className="modal-caso">
          <h4>🏢 Caso de Uso</h4>
          <p>
            Empresa con 200+ activos tecnológicos manejados en Excel sin
            trazabilidad. StockFlow centraliza el inventario, registra quién
            recibe cada equipo y alerta cuando el stock es crítico.
          </p>
        </div>

        <div className="modal-stack">
          <span>React 19</span>
          <span>Vite</span>
          <span>Chart.js</span>
          <span>localStorage</span>
          <span>CSS Grid</span>
        </div>

        <div className="modal-links">
         <a href="https://www.linkedin.com/in/yurani-mart%C3%ADnez-75b2001a5/" target="_blank" rel="noreferrer">🔗 LinkedIn</a>
         <a href="https://github.com/yuranimar" target="_blank" rel="noreferrer">💻 GitHub</a>
        </div>

        <p className="modal-autor">Desarrollado por <strong>Yurani Martínez</strong> · Medellín 🇨🇴 · 2026</p>
      </div>
    </div>
  );
}