import { useEffect, useRef } from "react";
import { useInventario } from "../context/InventarioContext";
import { Chart, ArcElement, Tooltip, Legend, DoughnutController } from "chart.js";

Chart.register(ArcElement, Tooltip, Legend, DoughnutController);

export default function Grafico() {
  const { inventario } = useInventario();
  const canvasRef = useRef(null);
  const chartRef  = useRef(null);

  useEffect(() => {
    const cats   = [...new Set(inventario.map(p => p.categoria))];
    const counts = cats.map(c =>
      inventario.filter(p => p.categoria === c).reduce((a, p) => a + p.cantidad, 0)
    );
    const colores = ["#38bdf8", "#818cf8", "#22c55e", "#f59e0b", "#f43f5e"];

    if (chartRef.current) chartRef.current.destroy();

    chartRef.current = new Chart(canvasRef.current, {
      type: "doughnut",
      data: {
        labels: cats,
        datasets: [{
          data: counts,
          backgroundColor: colores.slice(0, cats.length),
          borderWidth: 0,
          hoverOffset: 8
        }]
      },
      options: {
        cutout: "70%",
        animation: { animateScale: true },
        plugins: {
          legend: {
            position: "bottom",
            labels: { color: "#94a3b8", padding: 12, font: { size: 12 } }
          },
          tooltip: {
            callbacks: { label: ctx => " " + ctx.label + ": " + ctx.raw + " uds" }
          }
        }
      }
    });

    return () => { if (chartRef.current) chartRef.current.destroy(); };
  }, [inventario]);

  return (
    <section className="card chart-container">
      <h3>Distribucion por Categoria</h3>
      <canvas ref={canvasRef} style={{ maxHeight: "240px", marginTop: "12px" }} />
    </section>
  );
}