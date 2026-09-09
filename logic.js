// 1. Obtener una pieza válida por cada categoría seleccionada.
function obtenerPiezas(seleccion, catalogo) {
  const categorias = ['cpu', 'placa', 'ram', 'gpu', 'ssd', 'fuente'];
  const piezas = [];
  for (const categoria of categorias) {
    const pieza = catalogo.find(function (item) {
      return item.id === seleccion[categoria] && item.categoria === categoria;
    });
    if (pieza) piezas.push(pieza);
  }
  return piezas;
}

// 4. Sumar los precios al costo base mediante una variable acumuladora.
function calcularTotal(piezas, costoBase) {
  let total = costoBase;
  for (const pieza of piezas) total += pieza.precio;
  return total;
}

// 3. Comprobar socket, memoria y potencia con condiciones y comparaciones.
function validarCompatibilidad(piezas) {
  const errores = [];
  const cpu = piezas.find(pieza => pieza.categoria === 'cpu');
  const placa = piezas.find(pieza => pieza.categoria === 'placa');
  const ram = piezas.find(pieza => pieza.categoria === 'ram');
  const gpu = piezas.find(pieza => pieza.categoria === 'gpu');
  const fuente = piezas.find(pieza => pieza.categoria === 'fuente');
  const ssd = piezas.find(pieza => pieza.categoria === 'ssd');
  if (!cpu || !placa || !ram || !gpu || !fuente || !ssd) {
    errores.push('Selecciona un componente en cada categoría.');
    return errores;
  }
  if (cpu.socket !== placa.socket) {
    errores.push(`El socket ${cpu.socket} del procesador no coincide con el socket ${placa.socket} de la placa.`);
  }
  if (ram.memoria !== placa.memoria) {
    errores.push(`La placa requiere ${placa.memoria}; elegiste memoria ${ram.memoria}.`);
  }
  if (fuente.potencia < gpu.fuenteMinima) {
    errores.push(`Esta gráfica requiere una fuente de al menos ${gpu.fuenteMinima} W; elegiste ${fuente.potencia} W.`);
  }
  return errores;
}

// 7. Validar los cuatro datos del formulario antes de guardar.
function validarFormulario(datos, total) {
  const errores = [];
  if (typeof datos.nombre !== 'string' || datos.nombre.trim().length < 2 || datos.nombre.length > 80) {
    errores.push('Escribe tu nombre (entre 2 y 80 caracteres).');
  }
  // Comprobar el formato del correo con una expresión regular.
  if (typeof datos.correo !== 'string' || datos.correo.length > 120 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(datos.correo)) {
    errores.push('Escribe un correo válido, por ejemplo nombre@ejemplo.com.');
  }
  if (!['estudios', 'gaming', 'creacion'].includes(datos.uso)) {
    errores.push('Selecciona el uso principal de tu PC.');
  }
  const presupuesto = Number(datos.presupuesto);
  if (!Number.isFinite(presupuesto) || presupuesto <= 0 || presupuesto > 1000000) {
    errores.push('Ingresa un presupuesto entre S/ 0.01 y S/ 1,000,000.');
  } else if (presupuesto < total) {
    errores.push('Tu configuración supera el presupuesto. Ajusta los componentes o el presupuesto.');
  }
  return errores;
}

// 8. Leer el JSON guardado y rechazar datos dañados o incompatibles.
function leerCotizacion(texto, catalogo, costoBase) {
  try {
    const guardada = JSON.parse(texto);
    if (!guardada || guardada.version !== 1 || !guardada.datos || !guardada.seleccion) return null;
    const piezas = obtenerPiezas(guardada.seleccion, catalogo);
    if (validarCompatibilidad(piezas).length > 0) return null;
    const total = calcularTotal(piezas, costoBase);
    if (validarFormulario(guardada.datos, total).length > 0) return null;
    return {version:1, datos:guardada.datos, seleccion:guardada.seleccion, total:total};
  } catch (error) {
    return null;
  }
}
