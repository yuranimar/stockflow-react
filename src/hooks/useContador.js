import { useState, useEffect } from "react";

export default function useContador(valorFinal, duracion = 1000) {
  const [contador, setContador] = useState(0);

  useEffect(() => {
    if (valorFinal <= 0) { setContador(0); return; }
    let inicio = 0;
    const pasos = 60;
    const incremento = valorFinal / pasos;
    const intervalo = duracion / pasos;

    const timer = setInterval(() => {
      inicio += incremento;
      if (inicio >= valorFinal) {
        setContador(valorFinal);
        clearInterval(timer);
      } else {
        setContador(Math.floor(inicio));
      }
    }, intervalo);

    return () => clearInterval(timer);
  }, [valorFinal, duracion]);

  return contador;
}