// Las interfaces describen los datos para TypeScript; no validan la respuesta del servidor.
export interface Pieza {
  id: string;
  categoria: string;
  nombre: string;
  detalle: string;
  precio: number;
  // El signo ? indica un dato opcional: no todas las piezas tienen estas características.
  socket?: string;
  memoria?: string;
  potencia?: number;
  fuenteMinima?: number;
}
export interface Datos {
  nombre: string;
  correo: string;
  uso: string;
  presupuesto: number;
}
export interface Cotizacion {
  // El servicio agrega navegadorId; JSON Server asigna id al crear el registro.
  navegadorId?: string;
  id?: number;
  datos: Datos;
  // Relacionamos cada categoría con el ID de la pieza elegida, por ejemplo cpu: "r7600".
  seleccion: Record<string, string>;
  total: number;
  fecha: string;
}
