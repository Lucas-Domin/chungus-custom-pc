import { Component, inject, OnDestroy } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, NgForm } from "@angular/forms";
import { ActivatedRoute, RouterLink } from "@angular/router";
import { PcService } from "./pc.service";
import { Pieza, Datos, Cotizacion } from "./models";
import { CATEGORIAS, PERFILES, COSTO_BASE, MENSAJES } from "./data";
import { obtenerPiezas, calcularTotal, validarCompatibilidad, validarFormulario } from "./logic";

@Component({
  selector: "app-builder",
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: "./builder.html",
})
export class BuilderComponent implements OnDestroy {
  // Angular entrega el servicio HTTP y la información de la ruta mediante inyección de dependencias.
  api = inject(PcService);
  route = inject(ActivatedRoute);

  // Datos que se muestran en la pantalla.
  catalogo: Pieza[] = [];
  categorias = CATEGORIAS;
  perfiles = Object.keys(PERFILES);
  seleccion = Object.assign({}, PERFILES["gaming"]);
  datos: Datos = { nombre: "", correo: "", uso: "gaming", presupuesto: 4500 };
  id?: number;
  fecha = "";
  categoria = "todas";
  busqueda = "";

  // Mensajes y estado de los botones.
  cargando = true;
  guardando = false;
  error = "";
  resultado = "";
  mensaje = MENSAJES[0];
  pausado = false;
  visible = true;
  timer = setInterval(() => this.cambiarMensaje(), 7000);

  constructor() {
    this.cargar();
  }

  // Angular llama a este método al destruir el componente; evitamos dejar el intervalo activo.
  ngOnDestroy() {
    clearInterval(this.timer);
  }

  // Cargamos primero el catálogo para poder calcular precios y compatibilidad.
  // El parámetro ?editar=ID indica que hay que recuperar una cotización existente.
  cargar() {
    this.error = "";
    this.cargando = true;

    this.api
      .catalogo()
      .then((catalogo) => {
        this.catalogo = catalogo;
        const id = this.route.snapshot.queryParamMap.get("editar");

        if (id != null) {
          this.cargarCotizacion(id);
        } else {
          this.cargando = false;
        }
      })
      .catch(() => {
        this.error = "No se pudieron cargar los datos. Comprueba la conexión y vuelve a intentar.";
        this.cargando = false;
      });
  }

  cargarCotizacion(id: string) {
    this.api
      .cotizacion(id)
      .then((cotizacion) => {
        this.id = cotizacion.id;
        this.fecha = cotizacion.fecha;
        this.datos = cotizacion.datos;
        this.seleccion = cotizacion.seleccion;
        this.cargando = false;
      })
      .catch(() => {
        this.error = "No se pudo recuperar la cotización. Vuelve a Cotizaciones.";
        this.cargando = false;
      });
  }

  // Los getters calculan valores derivados de la selección, sin guardar copias que puedan desactualizarse.
  // Reutilizamos las funciones de Avance 1 para precios y compatibilidad.
  get piezas() {
    return obtenerPiezas(this.seleccion, this.catalogo);
  }

  get total() {
    return calcularTotal(this.piezas, COSTO_BASE);
  }

  get errores() {
    return validarCompatibilidad(this.piezas);
  }

  opciones(categoria: string) {
    return this.catalogo.filter((pieza) => pieza.categoria === categoria);
  }

  // Combinamos categoría y texto; normalizamos mayúsculas y espacios para facilitar la búsqueda.
  get filtradas() {
    const resultados: Pieza[] = [];
    const busqueda = this.busqueda.toLowerCase().trim();

    for (const pieza of this.catalogo) {
      const mismaCategoria = this.categoria === "todas" || pieza.categoria === this.categoria;
      const texto = (pieza.nombre + " " + pieza.detalle).toLowerCase();

      if (mismaCategoria && texto.includes(busqueda)) {
        resultados.push(pieza);
      }
    }
    return resultados;
  }

  perfil(uso: string) {
    // Copiamos el perfil para poder editarlo sin cambiar el original.
    this.seleccion = Object.assign({}, PERFILES[uso]);
    this.datos.uso = uso;
    this.resultado = "";
  }

  precioPerfil(uso: string) {
    const piezas = obtenerPiezas(PERFILES[uso], this.catalogo);
    return calcularTotal(piezas, COSTO_BASE);
  }

  cambiarMensaje() {
    if (this.pausado) return;

    const mensajes = MENSAJES.filter((mensaje) => mensaje !== this.mensaje);
    const indice = Math.floor(Math.random() * mensajes.length);
    this.mensaje = mensajes[indice];
  }

  guardar(form: NgForm) {
    this.resultado = "";
    // Revisamos compatibilidad y datos antes de enviar la petición.
    const errores = this.errores.concat(validarFormulario(this.datos, this.total));

    // Marcar los controles como tocados hace visibles los mensajes de validación del formulario.
    if (errores.length > 0) {
      form.control.markAllAsTouched();
      this.resultado = errores.join(" ");
      return;
    }

    if (form.invalid) {
      form.control.markAllAsTouched();
      this.resultado = "Completa los campos requeridos.";
      return;
    }

    // Copiamos los objetos planos para enviar los valores actuales del formulario.
    // Al editar conservamos la fecha original; al crear usamos una fecha ISO en UTC.
    const cotizacion: Cotizacion = {
      datos: Object.assign({}, this.datos),
      seleccion: Object.assign({}, this.seleccion),
      total: this.total,
      fecha: this.fecha || new Date().toISOString(),
    };

    if (this.id != null) {
      cotizacion.id = this.id;
    }

    this.guardando = true;
    this.api
      .guardar(cotizacion)
      .then((guardada) => {
        // Conservamos el ID devuelto para que el próximo guardado actualice este registro.
        this.id = guardada.id;
        this.fecha = guardada.fecha;
        this.resultado = "Cotización guardada. Puedes verla en Cotizaciones.";
      })
      .catch(() => {
        this.resultado = "No se pudo guardar. Comprueba la conexión e inténtalo nuevamente.";
      })
      .finally(() => {
        // Reactivamos el botón tanto si la petición salió bien como si falló.
        this.guardando = false;
      });
  }

  get textoGuardar() {
    if (this.guardando) return "Guardando…";
    if (this.id != null) return "Actualizar cotización";
    return "Guardar cotización";
  }
}
