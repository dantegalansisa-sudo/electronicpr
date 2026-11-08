export const BUSINESS = {
  name: 'Tecnotronics',
  tagline: 'Office Equipment',
  phone: '(787) 347-9393',
  phoneHref: 'tel:+17873479393',
  whatsapp: '17873479393',
  email: 'servicio@tecnotronicspr.com',
  web: 'tecnotronicspr.com',
  address: '130 Winston Churchill Ave, PMB 200, Suite 1',
  city: 'San Juan, Puerto Rico 00926',
  mapQuery: '130 Winston Churchill Ave, San Juan, PR 00926',
};

export const waLink = (msg = 'Hola Tecnotronics, quiero un estimado gratis para mi equipo.') =>
  `https://wa.me/${BUSINESS.whatsapp}?text=${encodeURIComponent(msg)}`;

export const BRANDS = [
  'Canon', 'HP', 'Brother', 'Epson', 'Xerox', 'Ricoh', 'Kyocera',
  'Lexmark', 'Konica Minolta', 'Sharp', 'Toshiba', 'Dell', 'Lenovo',
];

export interface Service {
  id: string;
  num: string;
  title: string;
  kicker: string;
  desc: string;
  points: string[];
  img: string;
  cutout?: boolean;
  tone: 'cyan' | 'cobalt' | 'violet' | 'teal' | 'amber' | 'lime';
}

export const SERVICES: Service[] = [
  {
    id: 'impresoras',
    num: '01',
    title: 'Reparación de impresoras',
    kicker: 'Láser · Inkjet · Multifuncional',
    desc: 'Atascos, manchas, errores de conexión o equipos que no encienden. Diagnosticamos y dejamos tu impresora como nueva.',
    points: ['Todas las marcas', 'Piezas originales', 'Pruebas de calidad'],
    img: 'img/printer-hp.png',
    cutout: true,
    tone: 'cyan',
  },
  {
    id: 'copiadoras',
    num: '02',
    title: 'Reparación de copiadoras',
    kicker: 'Equipos de alto volumen',
    desc: 'Mantenemos en marcha las copiadoras que mueven tu oficina: escaneo, alimentador, fusor y calibración de imagen.',
    points: ['Servicio en sitio', 'Fusores y rodillos', 'Calibración'],
    img: 'img/mfp-use.jpg',
    tone: 'cobalt',
  },
  {
    id: 'computadoras',
    num: '03',
    title: 'Reparación de computadoras',
    kicker: 'Laptops · Desktops',
    desc: 'Equipos lentos, pantallas, baterías, discos y virus. Recuperamos el rendimiento y protegemos tu información.',
    points: ['Upgrades SSD y RAM', 'Limpieza interna', 'Eliminación de virus'],
    img: 'img/laptop.png',
    cutout: true,
    tone: 'violet',
  },
  {
    id: 'venta',
    num: '04',
    title: 'Venta de equipos de oficina',
    kicker: 'Nuevos y reacondicionados',
    desc: 'Te asesoramos para elegir la impresora, copiadora o computadora ideal para el volumen y presupuesto de tu negocio.',
    points: ['Asesoría sin costo', 'Instalación', 'Configuración en red'],
    img: 'img/printer-mfp.png',
    cutout: true,
    tone: 'teal',
  },
  {
    id: 'mantenimiento',
    num: '05',
    title: 'Mantenimiento preventivo',
    kicker: 'Evita paradas inesperadas',
    desc: 'Limpieza, lubricación, cambio de piezas de desgaste y revisión completa para que tu equipo dure más.',
    points: ['Planes para empresas', 'Revisión periódica', 'Menos averías'],
    img: 'img/printer-inside.jpg',
    tone: 'amber',
  },
  {
    id: 'suministros',
    num: '06',
    title: 'Tóner y suministros',
    kicker: 'Siempre listos para imprimir',
    desc: 'Cartuchos, tóner, tintas y piezas para que tu oficina nunca se quede sin imprimir.',
    points: ['Originales y compatibles', 'Entrega rápida', 'Asesoría de rendimiento'],
    img: 'img/ink.jpg',
    tone: 'lime',
  },
];

export const STEPS = [
  { n: '01', t: 'Nos contactas', d: 'Llámanos o escríbenos por WhatsApp y cuéntanos qué le pasa a tu equipo. Respondemos rápido, 24 horas.' },
  { n: '02', t: 'Diagnóstico', d: 'Un técnico evalúa tu impresora, copiadora o computadora y encuentra la causa real de la falla.' },
  { n: '03', t: 'Estimado gratis', d: 'Te damos un estimado claro y sin compromiso. Tú decides antes de que toquemos una sola pieza.' },
  { n: '04', t: 'Reparado y listo', d: 'Reparamos, probamos y te entregamos el equipo funcionando para que tu oficina siga produciendo.' },
];

export type Device = 'impresora' | 'copiadora' | 'computadora';

export const DIAGNOSTIC: Record<Device, { label: string; issues: { id: string; label: string; cause: string; level: number }[] }> = {
  impresora: {
    label: 'Impresora',
    issues: [
      { id: 'atasco', label: 'Se atasca el papel', cause: 'Rodillos de alimentación gastados o un sensor sucio. Suele resolverse con limpieza y cambio de rodillos.', level: 2 },
      { id: 'manchas', label: 'Imprime con manchas o rayas', cause: 'Posible tambor, fusor o cabezal dañado. Lo verificamos y te decimos si conviene reparar o reemplazar la pieza.', level: 3 },
      { id: 'no-enciende', label: 'No enciende', cause: 'Puede ser la fuente de poder o la tarjeta principal. Requiere diagnóstico técnico.', level: 4 },
      { id: 'red', label: 'No conecta a la red / WiFi', cause: 'Configuración, drivers o firmware. Muchas veces se resuelve en una sola visita.', level: 1 },
      { id: 'error', label: 'Muestra un código de error', cause: 'Cada código apunta a una pieza. Envíanos una foto del error por WhatsApp y lo identificamos.', level: 2 },
    ],
  },
  copiadora: {
    label: 'Copiadora',
    issues: [
      { id: 'copias-claras', label: 'Copias claras o borrosas', cause: 'Tóner bajo, tambor desgastado o cristal sucio. Requiere calibración y revisión de la unidad de imagen.', level: 2 },
      { id: 'escaner', label: 'El escáner no funciona', cause: 'Lámpara, cable o configuración de escaneo a correo/carpeta. Lo revisamos completo.', level: 2 },
      { id: 'alimentador', label: 'Falla el alimentador (ADF)', cause: 'Rodillos del alimentador gastados. Cambio de kit y ajuste.', level: 2 },
      { id: 'ruido', label: 'Hace ruidos extraños', cause: 'Engranajes o fusor con desgaste. Conviene revisarlo antes de que la falla sea mayor.', level: 3 },
      { id: 'no-enciende', label: 'No enciende', cause: 'Fuente de poder o placa principal. Requiere diagnóstico en sitio.', level: 4 },
    ],
  },
  computadora: {
    label: 'Computadora',
    issues: [
      { id: 'lenta', label: 'Está muy lenta', cause: 'Disco lleno, poca memoria o malware. Un upgrade a SSD y limpieza la deja como nueva.', level: 1 },
      { id: 'pantalla', label: 'Pantalla rota o sin imagen', cause: 'Panel, cable flex o tarjeta de video. Cotizamos la pieza exacta para tu modelo.', level: 3 },
      { id: 'bateria', label: 'La batería no dura', cause: 'Batería degradada. Reemplazo con pieza compatible y calibración.', level: 1 },
      { id: 'virus', label: 'Virus o ventanas extrañas', cause: 'Infección de malware. Limpieza profunda y protección de tus archivos.', level: 2 },
      { id: 'no-enciende', label: 'No enciende', cause: 'Fuente, cargador o placa madre. Diagnóstico técnico para recuperar tu equipo y tu información.', level: 4 },
    ],
  },
};

export const FAQS = [
  { q: '¿El estimado realmente es gratis?', a: 'Sí. Evaluamos tu equipo y te damos un estimado sin costo y sin compromiso. Tú decides si seguimos con la reparación.' },
  { q: '¿Qué marcas reparan?', a: 'Reparamos todas las marcas: Canon, HP, Brother, Epson, Xerox, Ricoh, Kyocera, Lexmark, Konica Minolta, Sharp y más, además de laptops y desktops.' },
  { q: '¿Ofrecen servicio a empresas y oficinas?', a: 'Sí. Atendemos oficinas, comercios, escuelas y organizaciones con mantenimiento preventivo y servicio en sitio.' },
  { q: '¿Cuál es su horario?', a: 'Ofrecemos servicio 24 horas. Escríbenos por WhatsApp o llámanos al (787) 347-9393 a cualquier hora.' },
  { q: '¿Venden equipos y suministros?', a: 'Sí. Vendemos impresoras, copiadoras, computadoras, tóner y suministros, y te asesoramos para elegir el ideal.' },
  { q: '¿Dónde están ubicados?', a: 'En el 130 Winston Churchill Ave, PMB 200, Suite 1, San Juan, Puerto Rico 00926.' },
];
