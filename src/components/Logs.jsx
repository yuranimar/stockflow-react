import { useInventario } from "../context/InventarioContext";

export default function Logs() {
  const { logs } = useInventario();

  return (
    <section className="card">
      <h3>Monitor de Sistema</h3>
      <div className="log-list">
        {logs.length === 0 ? (
          <p style={{ color: "#94a3b8" }}>Sin actividad registrada</p>
        ) : logs.map((log, i) => (
          <p key={i} className="log-item">
            <span>[{log.hora}]</span> {log.texto}
          </p>
        ))}
      </div>
    </section>
  );
}