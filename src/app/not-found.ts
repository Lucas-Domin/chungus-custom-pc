import { Component } from "@angular/core";
import { RouterLink } from "@angular/router";

// La última ruta muestra esta pantalla cuando la dirección no existe.
@Component({
  selector: "app-not-found",
  imports: [RouterLink],
  template: `
    <section class="container not-found">
      <p class="error-code">404</p>
      <p class="eyebrow">PÁGINA NO ENCONTRADA</p>
      <h1>Esta pieza no está aquí.</h1>
      <p>La dirección no existe. Vuelve al configurador para seguir armando tu PC.</p>
      <a routerLink="/" class="button">Volver al configurador <span aria-hidden="true">↗</span></a>
    </section>
  `,
})
export class NotFoundComponent {}
