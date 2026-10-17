import { Pieza, Datos } from "./models";
// Buscamos cada ID dentro de su categoría; descartamos las selecciones que no están en el catálogo.
export function obtenerPiezas(seleccion: Record<string, string>, catalogo: Pieza[]) {
  const categorias = ["cpu", "placa", "ram", "gpu", "ssd", "fuente"];
  const piezas = [];
  for (const categoria of categorias) {
    const pieza = catalogo.find(function (item) {
      return item.id === seleccion[categoria] && item.categoria === categoria;
    });
    if (pieza) piezas.push(pieza);
  }
  return piezas;
}

// Sumamos el precio de las piezas al costo fijo del gabinete, la refrigeración y el ensamblaje.
export function calcularTotal(piezas: Pieza[], costoBase: number) {
  let total = costoBase;
  for (const pieza of piezas) total += pieza.precio;
  return total;
}

// Devolvemos los problemas detectados; una lista vacía indica que pasan estas comprobaciones básicas.
export function validarCompatibilidad(piezas: Pieza[]) {
  const errores = [];
  const cpu = piezas.find((pieza) => pieza.categoria === "cpu");
  const placa = piezas.find((pieza) => pieza.categoria === "placa");
  const ram = piezas.find((pieza) => pieza.categoria === "ram");
  const gpu = piezas.find((pieza) => pieza.categoria === "gpu");
  const fuente = piezas.find((pieza) => pieza.categoria === "fuente");
  const ssd = piezas.find((pieza) => pieza.categoria === "ssd");
  if (!cpu || !placa || !ram || !gpu || !fuente || !ssd) {
    errores.push("Selecciona un componente en cada categoría.");
    return errores;
  }
  if (cpu.socket !== placa.socket) {
    errores.push(
      `El socket ${cpu.socket} del procesador no coincide con el socket ${placa.socket} de la placa.`,
    );
  }
  if (ram.memoria !== placa.memoria) {
    errores.push(`La placa requiere ${placa.memoria}; elegiste memoria ${ram.memoria}.`);
  }
  if ((fuente.potencia ?? 0) < (gpu.fuenteMinima ?? 0)) {
    errores.push(
      `Esta gráfica requiere una fuente de al menos ${gpu.fuenteMinima} W; elegiste ${fuente.potencia} W.`,
    );
  }
  return errores;
}

// Validamos los datos de contacto, el uso y el presupuesto antes de guardar la cotización.
export function validarFormulario(datos: Datos, total: number) {
  const errores = [];
  if (
    typeof datos.nombre !== "string" ||
    datos.nombre.trim().length < 2 ||
    datos.nombre.length > 80
  ) {
    errores.push("Escribe tu nombre (entre 2 y 80 caracteres).");
  }
  // Comprobar el formato del correo con una expresión regular.
  if (
    typeof datos.correo !== "string" ||
    datos.correo.length > 120 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(datos.correo)
  ) {
    errores.push("Escribe un correo válido, por ejemplo nombre@ejemplo.com.");
  }
  if (!["estudios", "gaming", "creacion"].includes(datos.uso)) {
    errores.push("Selecciona el uso principal de tu PC.");
  }
  const presupuesto = Number(datos.presupuesto);
  if (!Number.isFinite(presupuesto) || presupuesto <= 0 || presupuesto > 1000000) {
    errores.push("Ingresa un presupuesto entre S/ 0.01 y S/ 1,000,000.");
  } else if (presupuesto < total) {
    errores.push(
      "Tu configuración supera el presupuesto. Ajusta los componentes o el presupuesto.",
    );
  }
  return errores;
}
