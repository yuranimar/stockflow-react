export const formatoMoneda = new Intl.NumberFormat('es-CO', {
  style: 'currency', currency: 'COP', minimumFractionDigits: 0
});

export const formatearPrecio = (valor) => formatoMoneda.format(valor);