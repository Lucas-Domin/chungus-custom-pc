// Categorías del configurador. Los precios del catálogo son simulados en soles.
export const CATEGORIAS = [
  { id: "cpu", nombre: "Procesador", abreviatura: "CPU" },
  { id: "placa", nombre: "Placa madre", abreviatura: "MB" },
  { id: "ram", nombre: "Memoria RAM", abreviatura: "RAM" },
  { id: "gpu", nombre: "Tarjeta gráfica", abreviatura: "GPU" },
  { id: "ssd", nombre: "Almacenamiento", abreviatura: "SSD" },
  { id: "fuente", nombre: "Fuente de poder", abreviatura: "PSU" },
];
// El paquete base incluye gabinete, refrigeración y ensamblaje demostrativos.
export const COSTO_BASE = 250;
// Cada perfil relaciona categorías con IDs del catálogo recibido desde la API.
// Si cambiás un ID en el catálogo, actualizalo también en los perfiles que lo usan.
export const PERFILES: Record<string, Record<string, string>> = {
  estudios: {
    cpu: "r5600",
    placa: "b550",
    ram: "ddr4-16",
    gpu: "rx6600",
    ssd: "ssd500",
    fuente: "psu550",
  },
  gaming: {
    cpu: "r7600",
    placa: "b650",
    ram: "ddr5-32",
    gpu: "rx7600",
    ssd: "ssd1000",
    fuente: "psu650",
  },
  creacion: {
    cpu: "r7700",
    placa: "b650",
    ram: "ddr5-32",
    gpu: "rx7700xt",
    ssd: "ssd2000",
    fuente: "psu750",
  },
};
// Textos que el componente alterna en la barra de notificaciones.
export const MENSAJES = [
  "Tu próxima PC empieza aquí. Configúrala a tu medida, desde Lima.",
  "¿AM4 o AM5? El socket del procesador debe coincidir con el de la placa.",
  "Más espacio para tus proyectos: explora las opciones de SSD.",
  "Todos los precios se muestran en soles. Catálogo de demostración.",
  "Guarda tu configuración y retómala en Cotizaciones.",
  "Dale espacio a tus ideas. Prueba el perfil de creación de contenido.",
];
