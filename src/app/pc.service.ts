import { Injectable, inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { firstValueFrom } from "rxjs";
import { Pieza, Cotizacion } from "./models";

// Este servicio es el único archivo que hace peticiones al servidor.
// HttpClient devuelve un Observable; firstValueFrom toma la primera respuesta y devuelve una promesa.
// La ruta relativa /api pasa por el proxy local o por Nginx en Lightsail.
@Injectable({ providedIn: "root" })
export class PcService {
  private http = inject(HttpClient);
  private navegadorId: string;

  constructor() {
    // Reutilizamos el ID guardado para este sitio y perfil del navegador, incluso entre pestañas.
    // Si borrás el almacenamiento local, se genera otro ID y se pierde la asociación anterior.
    // Esto organiza la interfaz; no autentica al usuario ni restringe el acceso a la API.
    let id = localStorage.getItem("chungus-navegador");
    if (!id) {
      id = Array.from(crypto.getRandomValues(new Uint32Array(4))).join("-");
      localStorage.setItem("chungus-navegador", id);
    }
    this.navegadorId = id;
  }

  catalogo() {
    return firstValueFrom(this.http.get<Pieza[]>("/api/catalogo"));
  }

  cotizaciones() {
    const url = "/api/cotizaciones?navegadorId=" + this.navegadorId;
    return firstValueFrom(this.http.get<Cotizacion[]>(url)).then(cotizaciones => {
      // Repetimos el filtro en el cliente para excluir también registros antiguos sin navegadorId.
      return cotizaciones.filter(cotizacion => cotizacion.navegadorId === this.navegadorId);
    });
  }

  cotizacion(id: string) {
    // Buscamos por ID y navegador; encodeURIComponent permite incluir el ID en la URL.
    // La consulta devuelve una lista, aunque esperamos una sola coincidencia.
    const url = "/api/cotizaciones?id=" + encodeURIComponent(id)
      + "&navegadorId=" + this.navegadorId;
    return firstValueFrom(this.http.get<Cotizacion[]>(url)).then(cotizaciones => {
      cotizaciones = cotizaciones.filter(cotizacion => {
        return cotizacion.navegadorId === this.navegadorId && String(cotizacion.id) === id;
      });
      if (cotizaciones.length === 0) {
        throw new Error("La cotización no pertenece a este navegador.");
      }
      return cotizaciones[0];
    });
  }

  guardar(cotizacion: Cotizacion) {
    cotizacion.navegadorId = this.navegadorId;
    // POST crea un registro; PATCH actualiza los campos enviados de uno existente.
    if (cotizacion.id == null) {
      return firstValueFrom(this.http.post<Cotizacion>("/api/cotizaciones", cotizacion));
    }

    const url = "/api/cotizaciones/" + cotizacion.id;
    return firstValueFrom(this.http.patch<Cotizacion>(url, cotizacion));
  }

  eliminar(id: number) {
    return firstValueFrom(this.http.delete("/api/cotizaciones/" + id));
  }
}
