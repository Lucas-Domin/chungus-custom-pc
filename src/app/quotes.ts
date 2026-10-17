import { Component, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterLink } from "@angular/router";
import { PcService } from "./pc.service";
import { Cotizacion } from "./models";

@Component({
  selector: "app-quotes",
  imports: [CommonModule, RouterLink],
  templateUrl: "./quotes.html",
})
export class QuotesComponent {
  api = inject(PcService);
  lista: Cotizacion[] = [];
  cargando = true;
  error = "";
  // Guardamos el ID en proceso para deshabilitar únicamente su botón de eliminación.
  eliminando?: number;

  constructor() {
    this.cargar();
  }

  // then recibe los datos, catch muestra el error y finally cierra el estado de carga.
  cargar() {
    this.cargando = true;
    this.error = "";

    this.api
      .cotizaciones()
      .then((cotizaciones) => {
        this.lista = cotizaciones;
      })
      .catch(() => {
        this.error = "No se pudieron cargar las cotizaciones. Vuelve a intentar.";
      })
      .finally(() => {
        this.cargando = false;
      });
  }

  eliminar(cotizacion: Cotizacion) {
    if (cotizacion.id == null) return;
    if (!confirm("¿Eliminar esta cotización?")) return;

    this.eliminando = cotizacion.id;
    this.error = "";

    this.api
      .eliminar(cotizacion.id)
      .then(() => {
        // Actualizamos la lista solo después de que el servidor confirma la eliminación.
        this.lista = this.lista.filter((item) => item.id !== cotizacion.id);
      })
      .catch(() => {
        this.error = "No se pudo eliminar. Inténtalo nuevamente.";
      })
      .finally(() => {
        this.eliminando = undefined;
      });
  }
}
