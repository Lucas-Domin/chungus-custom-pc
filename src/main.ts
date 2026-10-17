import "zone.js";
import { Component, provideZoneChangeDetection } from "@angular/core";
import { bootstrapApplication } from "@angular/platform-browser";
import { provideHttpClient } from "@angular/common/http";
import { provideRouter, RouterLink, RouterLinkActive, RouterOutlet } from "@angular/router";
import { registerLocaleData } from "@angular/common";
import esPE from "@angular/common/locales/es-PE";
import { BuilderComponent } from "./app/builder";
import { QuotesComponent } from "./app/quotes";
import { NotFoundComponent } from "./app/not-found";
// Registramos el formato peruano que usan los pipes de moneda y fecha.
registerLocaleData(esPE);
@Component({
  selector: "app-root",
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: "./app/app.html",
})
class AppComponent {}
// Iniciamos Angular con detección de cambios, cliente HTTP y navegación.
bootstrapApplication(AppComponent, {
  providers: [
    provideZoneChangeDetection(),
    provideHttpClient(),
    provideRouter([
      { path: "", component: BuilderComponent, title: "Configura tu PC · Chungus" },
      { path: "cotizaciones", component: QuotesComponent, title: "Cotizaciones · Chungus" },
      // Mantené esta ruta al final: captura las direcciones que no coinciden con las anteriores.
      { path: "**", component: NotFoundComponent, title: "404 · Chungus Custom PC" },
    ]),
  ],
}).catch(console.error);
