// Interfaz, eventos y almacenamiento de Chungus Custom PC.
// Constante para el guardado y variables para el estado de la página.
const CLAVE_GUARDADO = 'chungus-cotizacion-v1';
let seleccionActual = {...PERFILES.gaming};
let cotizacionGuardada = null;
let indiceMensaje = -1;
let temporizador = null;
let notificacionesPausadas = false;

// Mostrar importes en soles con dos decimales.
function moneda(valor) {
  return `S/ ${Number(valor).toLocaleString('es-PE', {minimumFractionDigits:2, maximumFractionDigits:2})}`;
}

// 1. Crear los selectores para personalizar los seis componentes.
function crearSelectores() {
  const contenedor = document.getElementById('selectores-componentes');
  CATEGORIAS.forEach(function (categoria, indice) {
    const fila = document.createElement('div');
    fila.className = 'component-row';
    const numero = document.createElement('span');
    numero.className = 'component-number';
    numero.textContent = `0${indice + 1}`;
    const campo = document.createElement('div');
    campo.className = 'component-field';
    const cabecera = document.createElement('div');
    cabecera.className = 'component-label';
    const etiqueta = document.createElement('label');
    etiqueta.htmlFor = `pieza-${categoria.id}`;
    etiqueta.textContent = categoria.nombre;
    const precio = document.createElement('span');
    precio.id = `precio-${categoria.id}`;
    const selector = document.createElement('select');
    selector.id = `pieza-${categoria.id}`;
    CATALOGO.filter(pieza => pieza.categoria === categoria.id).forEach(function (pieza) {
      const opcion = document.createElement('option');
      opcion.value = pieza.id;
      opcion.textContent = pieza.nombre;
      selector.appendChild(opcion);
    });
    selector.value = seleccionActual[categoria.id];
    // Al cambiar una pieza, guardar su valor y recalcular la cotización.
    selector.onchange = function () {
      seleccionActual[categoria.id] = selector.value;
      document.getElementById('etiqueta-perfil').textContent = 'Personalizada';
      marcarPerfilActivo(null);
      limpiarResultado();
      actualizarConfiguracion();
    };
    cabecera.append(etiqueta, precio);
    campo.append(cabecera, selector);
    fila.append(numero, campo);
    contenedor.appendChild(fila);
  });
}

// Marcar el perfil elegido; null indica una configuración personalizada.
function marcarPerfilActivo(uso) {
  const botones = document.querySelectorAll('[data-perfil]');
  for (const boton of botones) {
    const activo = boton.dataset.perfil === uso;
    boton.classList.toggle('active', activo);
    boton.setAttribute('aria-pressed', String(activo));
  }
}

// 2. Aplicar una configuración recomendada sin cambiar el presupuesto.
function aplicarPerfil(uso) {
  seleccionActual = {...PERFILES[uso]};
  CATEGORIAS.forEach(categoria => {
    document.getElementById(`pieza-${categoria.id}`).value = seleccionActual[categoria.id];
  });
  document.getElementById('uso').value = uso;
  document.getElementById('etiqueta-perfil').textContent = `Base ${NOMBRES_USO[uso]}`;
  marcarPerfilActivo(uso);
  limpiarResultado();
  actualizarConfiguracion();
}

// 4. Actualizar precios, desglose y total de la cotización.
function actualizarConfiguracion() {
  const piezas = obtenerPiezas(seleccionActual, CATALOGO);
  const total = calcularTotal(piezas, COSTO_BASE);
  const desglose = document.getElementById('desglose');
  desglose.replaceChildren();
  piezas.forEach(function (pieza) {
    document.getElementById(`precio-${pieza.categoria}`).textContent = moneda(pieza.precio);
    const fila = document.createElement('li');
    const nombre = document.createElement('span');
    const precio = document.createElement('span');
    nombre.textContent = pieza.nombre;
    precio.textContent = moneda(pieza.precio);
    fila.append(nombre, precio);
    desglose.appendChild(fila);
  });
  document.getElementById('total').textContent = moneda(total);
  document.getElementById('total-formulario').textContent = moneda(total);
  mostrarCompatibilidad(piezas);
  evaluarPresupuesto(total);
}

// 3. Mostrar si las piezas son compatibles y explicar los errores.
function mostrarCompatibilidad(piezas) {
  const errores = validarCompatibilidad(piezas);
  const panel = document.getElementById('compatibilidad');
  panel.replaceChildren();
  panel.classList.toggle('error', errores.length > 0);
  const titulo = document.createElement('strong');
  if (errores.length === 0) {
    titulo.textContent = '✓ Compatibilidad básica verificada';
    const detalle = document.createElement('p');
    detalle.textContent = 'El socket, la memoria y la potencia de fuente coinciden.';
    panel.append(titulo, detalle);
  } else {
    titulo.textContent = 'Revisa estos componentes';
    const lista = document.createElement('ul');
    errores.forEach(function (error) {
      const item = document.createElement('li');
      item.textContent = error;
      lista.appendChild(item);
    });
    panel.append(titulo, lista);
  }
}

// 5. Restar el total al presupuesto e indicar si alcanza.
function evaluarPresupuesto(total) {
  const presupuesto = Number(document.getElementById('presupuesto').value);
  const estado = document.getElementById('estado-presupuesto');
  const diferencia = presupuesto - total;
  if (!Number.isFinite(presupuesto) || presupuesto <= 0 || presupuesto > 1000000) {
    estado.textContent = 'Ingresa un presupuesto válido para comparar.';
    estado.classList.add('error');
  } else if (diferencia >= 0) {
    estado.textContent = `Dentro de tu presupuesto. Te quedan ${moneda(diferencia)}.`;
    estado.classList.remove('error');
  } else {
    estado.textContent = `Superas tu presupuesto por ${moneda(Math.abs(diferencia))}.`;
    estado.classList.add('error');
  }
}

// 6. Filtrar componentes por categoría y texto de búsqueda.
function filtrarCatalogo() {
  const categoria = document.getElementById('categoria').value;
  const busqueda = document.getElementById('busqueda').value.trim().toLowerCase();
  const resultados = CATALOGO.filter(function (pieza) {
    const coincideCategoria = categoria === 'todas' || pieza.categoria === categoria;
    const texto = `${pieza.nombre} ${pieza.detalle}`.toLowerCase();
    const coincideTexto = texto.includes(busqueda);
    return coincideCategoria && coincideTexto;
  });
  const lista = document.getElementById('lista-catalogo');
  lista.replaceChildren();
  resultados.forEach(function (pieza) {
    const tarjeta = document.createElement('article');
    tarjeta.className = 'catalog-item';
    const categoria = document.createElement('span');
    categoria.className = 'catalog-tag';
    categoria.textContent = CATEGORIAS.find(item => item.id === pieza.categoria).abreviatura;
    const titulo = document.createElement('h3');
    titulo.textContent = pieza.nombre;
    const detalle = document.createElement('p');
    detalle.textContent = pieza.detalle;
    const precio = document.createElement('strong');
    precio.textContent = moneda(pieza.precio);
    tarjeta.append(categoria, titulo, detalle, precio);
    lista.appendChild(tarjeta);
  });
  document.getElementById('cantidad-resultados').textContent = `${resultados.length} componente${resultados.length === 1 ? '' : 's'}`;
  document.getElementById('sin-resultados').hidden = resultados.length !== 0;
}

// Quitar el resultado anterior cuando cambian los datos.
function limpiarResultado() {
  document.getElementById('resultado-formulario').textContent = '';
}

// Mostrar el resultado en la página y en una alerta.
function mostrarResultado(mensaje, esError) {
  const resultado = document.getElementById('resultado-formulario');
  resultado.textContent = mensaje; // Texto del usuario: nunca se interpreta como HTML.
  resultado.classList.toggle('error', esError);
  resultado.focus({preventScroll:true});
  alert(mensaje);
}

// 7. Procesar el formulario desde onclick o el envío con teclado.
function procesarSolicitud(evento) {
  if (evento) evento.preventDefault();
  // Obtener los datos con .value y almacenarlos antes de procesar.
  const nombre = document.getElementById('nombre').value.trim();
  const correo = document.getElementById('correo').value.trim();
  const uso = document.getElementById('uso').value;
  const presupuesto = Number(document.getElementById('presupuesto').value);
  const datos = {nombre:nombre, correo:correo, uso:uso, presupuesto:presupuesto};
  const piezas = obtenerPiezas(seleccionActual, CATALOGO);
  const total = calcularTotal(piezas, COSTO_BASE);
  const errores = [...validarFormulario(datos, total), ...validarCompatibilidad(piezas)];
  if (errores.length > 0) {
    mostrarResultado(errores.join('\n'), true);
    return;
  }
  const cotizacion = {version:1, datos:datos, seleccion:{...seleccionActual}, total:total};
  // Mensaje dinámico: insertar los datos del usuario mediante ${}.
  const mensaje = `Hola, ${nombre}. Tu Chungus Custom PC para ${NOMBRES_USO[uso]} cuesta ${moneda(total)}. Tu cotización quedó guardada en este navegador. ¡Gracias por configurar con nosotros desde Lima!`;
  try {
    // 8. Guardar los datos como JSON en localStorage.
    localStorage.setItem(CLAVE_GUARDADO, JSON.stringify(cotizacion));
    cotizacionGuardada = cotizacion;
    mostrarGuardado();
    mostrarResultado(mensaje, false);
  } catch (error) {
    mostrarResultado(`Hola, ${nombre}. Tu PC cuesta ${moneda(total)}, pero no pudimos guardar la cotización. Habilita el almacenamiento del navegador e inténtalo de nuevo.`, true);
  }
}

// 8. Mostrar el resumen de la cotización guardada.
function mostrarGuardado() {
  const panel = document.getElementById('cotizacion-guardada');
  panel.hidden = cotizacionGuardada === null;
  if (cotizacionGuardada) {
    document.getElementById('detalle-guardado').textContent = `${cotizacionGuardada.datos.nombre}, tu configuración para ${NOMBRES_USO[cotizacionGuardada.datos.uso]} tiene un total de ${moneda(cotizacionGuardada.total)}.`;
  }
}

// 8. Restaurar los componentes y los datos del formulario.
function recuperarCotizacion() {
  if (!cotizacionGuardada) return;
  seleccionActual = {...cotizacionGuardada.seleccion};
  CATEGORIAS.forEach(categoria => {
    document.getElementById(`pieza-${categoria.id}`).value = seleccionActual[categoria.id];
  });
  ['nombre', 'correo', 'uso', 'presupuesto'].forEach(campo => {
    document.getElementById(campo).value = cotizacionGuardada.datos[campo];
  });
  document.getElementById('etiqueta-perfil').textContent = 'Cotización recuperada';
  marcarPerfilActivo(null);
  limpiarResultado();
  actualizarConfiguracion();
}

// 8. Recuperar la cotización al abrir la página.
function cargarGuardado() {
  try {
    const texto = localStorage.getItem(CLAVE_GUARDADO);
    if (!texto) return;
    cotizacionGuardada = leerCotizacion(texto, CATALOGO, COSTO_BASE);
    if (cotizacionGuardada) {
      recuperarCotizacion();
      mostrarGuardado();
    } else {
      document.getElementById('resultado-formulario').textContent = 'La cotización guardada no es válida para este catálogo. Puedes crear una nueva.';
    }
  } catch (error) {
    document.getElementById('resultado-formulario').textContent = 'El almacenamiento no está disponible. Puedes configurar tu PC, pero quizá no puedas guardarla.';
  }
}

// 8. Borrar la cotización y los datos de contacto guardados.
function eliminarCotizacion() {
  try {
    localStorage.removeItem(CLAVE_GUARDADO);
    cotizacionGuardada = null;
    mostrarGuardado();
    document.getElementById('nombre').value = '';
    document.getElementById('correo').value = '';
    mostrarResultado('La cotización guardada y tus datos de contacto se eliminaron de este navegador.', false);
  } catch (error) {
    mostrarResultado('No pudimos eliminar los datos. Revisa los permisos de almacenamiento de tu navegador.', true);
  }
}

// 10. Elegir otro mensaje aleatorio sin repetir el anterior.
function siguienteNotificacion() {
  // Un salto aleatorio y el módulo (%) mantienen el índice dentro del arreglo.
  const salto = Math.floor(Math.random() * (MENSAJES.length - 1)) + 1;
  indiceMensaje = (indiceMensaje + salto) % MENSAJES.length;
  document.getElementById('mensaje-notificacion').textContent = MENSAJES[indiceMensaje];
}

// 10. Mostrar un mensaje y renovarlo cada siete segundos.
function iniciarNotificaciones() {
  siguienteNotificacion();
  temporizador = setInterval(siguienteNotificacion, 7000);
}

// 10. Pausar o reanudar los mensajes automáticos.
function pausarNotificaciones() {
  notificacionesPausadas = !notificacionesPausadas;
  const boton = document.getElementById('pausar-notificaciones');
  boton.textContent = notificacionesPausadas ? 'Reanudar' : 'Pausar';
  boton.setAttribute('aria-pressed', String(notificacionesPausadas));
  if (notificacionesPausadas) {
    clearInterval(temporizador);
  } else {
    iniciarNotificaciones();
  }
}

// 9. Informar que el teléfono es de demostración.
function mostrarTelefonoDemo(evento) {
  evento.preventDefault();
  alert('Chungus Custom PC es un emprendimiento ficticio en Lima, Perú. El teléfono +51 1 000 0000 es demostrativo y no realiza llamadas.');
}

// Conectar los eventos y cargar el estado inicial de la página.
function iniciarPagina() {
  crearSelectores();
  document.querySelectorAll('[data-perfil]').forEach(boton => {
    const uso = boton.dataset.perfil;
    document.getElementById(`precio-${uso}`).textContent = `Desde ${moneda(calcularTotal(obtenerPiezas(PERFILES[uso], CATALOGO), COSTO_BASE))}`;
    boton.addEventListener('click', function () { aplicarPerfil(uso); });
  });
  marcarPerfilActivo('gaming');
  document.getElementById('presupuesto').addEventListener('input', function () { limpiarResultado(); actualizarConfiguracion(); });
  document.getElementById('categoria').addEventListener('change', filtrarCatalogo);
  document.getElementById('busqueda').addEventListener('input', filtrarCatalogo);
  document.getElementById('formulario-cotizacion').addEventListener('input', limpiarResultado);
  // Soporte adicional para enviar con teclado. El botón conserva onclick explícito.
  document.getElementById('formulario-cotizacion').addEventListener('submit', procesarSolicitud);
  document.getElementById('recuperar-cotizacion').addEventListener('click', recuperarCotizacion);
  document.getElementById('eliminar-cotizacion').addEventListener('click', eliminarCotizacion);
  document.getElementById('pausar-notificaciones').addEventListener('click', pausarNotificaciones);
  document.getElementById('cerrar-notificaciones').addEventListener('click', function () {
    clearInterval(temporizador);
    document.getElementById('barra-notificaciones').hidden = true;
  });
  actualizarConfiguracion();
  filtrarCatalogo();
  cargarGuardado();
  iniciarNotificaciones();
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) pausarNotificaciones();
}

iniciarPagina();
