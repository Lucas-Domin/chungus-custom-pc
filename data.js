// Categorías del configurador. Los precios del catálogo son simulados en soles.
const CATEGORIAS = [
  {id: 'cpu', nombre: 'Procesador', abreviatura: 'CPU'},
  {id: 'placa', nombre: 'Placa madre', abreviatura: 'MB'},
  {id: 'ram', nombre: 'Memoria RAM', abreviatura: 'RAM'},
  {id: 'gpu', nombre: 'Tarjeta gráfica', abreviatura: 'GPU'},
  {id: 'ssd', nombre: 'Almacenamiento', abreviatura: 'SSD'},
  {id: 'fuente', nombre: 'Fuente de poder', abreviatura: 'PSU'}
];
// Objetos con los precios y datos usados para validar las piezas.
const CATALOGO = [
  {id:'r5600',categoria:'cpu',nombre:'AMD Ryzen 5 5600',detalle:'6 núcleos · AM4',precio:520,socket:'AM4'},
  {id:'r7600',categoria:'cpu',nombre:'AMD Ryzen 5 7600',detalle:'6 núcleos · AM5',precio:890,socket:'AM5'},
  {id:'r7700',categoria:'cpu',nombre:'AMD Ryzen 7 7700',detalle:'8 núcleos · AM5',precio:1150,socket:'AM5'},
  {id:'b550',categoria:'placa',nombre:'Placa B550',detalle:'Socket AM4 · Memoria DDR4',precio:360,socket:'AM4',memoria:'DDR4'},
  {id:'b650',categoria:'placa',nombre:'Placa B650',detalle:'Socket AM5 · Memoria DDR5',precio:650,socket:'AM5',memoria:'DDR5'},
  {id:'ddr4-16',categoria:'ram',nombre:'16 GB DDR4',detalle:'Kit 2 × 8 GB · 3200 MT/s',precio:180,memoria:'DDR4'},
  {id:'ddr4-32',categoria:'ram',nombre:'32 GB DDR4',detalle:'Kit 2 × 16 GB · 3200 MT/s',precio:290,memoria:'DDR4'},
  {id:'ddr5-32',categoria:'ram',nombre:'32 GB DDR5',detalle:'Kit 2 × 16 GB · 5200 MT/s',precio:360,memoria:'DDR5'},
  {id:'rx6600',categoria:'gpu',nombre:'Radeon RX 6600',detalle:'8 GB GDDR6 · Fuente desde 450 W',precio:850,fuenteMinima:450},
  {id:'rx7600',categoria:'gpu',nombre:'Radeon RX 7600',detalle:'8 GB GDDR6 · Fuente desde 550 W',precio:1150,fuenteMinima:550},
  {id:'rx7700xt',categoria:'gpu',nombre:'Radeon RX 7700 XT',detalle:'12 GB GDDR6 · Fuente desde 700 W',precio:1900,fuenteMinima:700},
  {id:'ssd500',categoria:'ssd',nombre:'SSD NVMe 500 GB',detalle:'M.2 · PCIe',precio:160},
  {id:'ssd1000',categoria:'ssd',nombre:'SSD NVMe 1 TB',detalle:'M.2 · PCIe',precio:250},
  {id:'ssd2000',categoria:'ssd',nombre:'SSD NVMe 2 TB',detalle:'M.2 · PCIe',precio:450},
  {id:'psu550',categoria:'fuente',nombre:'Fuente 550 W',detalle:'Potencia nominal de 550 W',precio:210,potencia:550},
  {id:'psu650',categoria:'fuente',nombre:'Fuente 650 W',detalle:'Potencia nominal de 650 W',precio:290,potencia:650},
  {id:'psu750',categoria:'fuente',nombre:'Fuente 750 W',detalle:'Potencia nominal de 750 W',precio:350,potencia:750}
];
// El paquete base incluye gabinete, refrigeración y ensamblaje demostrativos.
const COSTO_BASE = 250;
// 2. Configuraciones recomendadas para estudios, gaming y creación.
const PERFILES = {
  estudios: {cpu:'r5600',placa:'b550',ram:'ddr4-16',gpu:'rx6600',ssd:'ssd500',fuente:'psu550'},
  gaming: {cpu:'r7600',placa:'b650',ram:'ddr5-32',gpu:'rx7600',ssd:'ssd1000',fuente:'psu650'},
  creacion: {cpu:'r7700',placa:'b650',ram:'ddr5-32',gpu:'rx7700xt',ssd:'ssd2000',fuente:'psu750'}
};
const NOMBRES_USO = {estudios:'estudios',gaming:'gaming',creacion:'creación de contenido'};
// 10. Mensajes de la barra de notificaciones aleatorias.
const MENSAJES = [
  'Tu próxima PC empieza aquí. Configúrala a tu medida, desde Lima.',
  '¿AM4 o AM5? El socket del procesador debe coincidir con el de la placa.',
  'Más espacio para tus proyectos: explora las opciones de SSD.',
  'Todos los precios se muestran en soles. Catálogo de demostración.',
  'Tu cotización se guarda en este navegador para que puedas retomarla.',
  'Dale espacio a tus ideas. Prueba el perfil de creación de contenido.'
];
