/* =========================================================
   Lista de webs del portfolio (la usan index.html y webs.html)
   - Para sumar una web: agregarla acá, en PROYECTOS o EJEMPLOS.
   - En la portada se muestran todos los PROYECTOS y los
     primeros EN_PORTADA ejemplos; el resto se ve en webs.html.
   - rubro: agrupa las webs en el filtro de webs.html.
   ========================================================= */
const EN_PORTADA = 6;

// Proyectos reales (carpeta en /proyectos)
const PROYECTOS = [
  {ruta:"proyectos/patterns/", img:"previews/patterns.jpg", tag:"Mi marca", rubro:"Tiendas", nombre:"PATTERNS", desc:"Tienda de remeras: catálogo con stock desde Google Sheets, carrito y pedidos por WhatsApp, Instagram o correo."},
  {ruta:"proyectos/colab-dental/", img:"previews/colab-dental.jpg", tag:"En curso", rubro:"Salud y deporte", nombre:"Colab Dental", desc:"Propuesta de web para un laboratorio dental: servicios, proceso, plazos y contacto directo para odontólogos."}
];

// Ejemplos por rubro (los primeros EN_PORTADA salen en la portada)
const EJEMPLOS = [
  {ruta:"proyectos/bosdandjian-rodriguez/", img:"previews/bosdandjian-rodriguez.jpg", tag:"Estudio jurídico", rubro:"Profesionales", nombre:"Bosdandjian Rodríguez", desc:"Servicios integrados, propiedades con filtro, galería y link propio, equipo y reseñas de Google."},
  {ruta:"proyectos/eme-training/", img:"previews/eme-training.jpg", tag:"Gimnasio", rubro:"Salud y deporte", nombre:"EME Training", desc:"Grilla de clases con cupos, planes con comparador, equipo, el gym y reserva de clase de prueba."},
  {ruta:"proyectos/kogan-training/", img:"previews/kogan-training.jpg", tag:"Entrenamiento", rubro:"Salud y deporte", nombre:"Kogan Training", desc:"Preguntas previas para agendar la entrevista presencial, planes con cuponera, horarios, reto del mes y progresos."},
  {ruta:"ejemplos/viandas/", img:"previews/ejemplo-viandas.jpg", tag:"Viandas", rubro:"Gastronomía", nombre:"Vianda Casera", desc:"Menú de la semana día por día, planes y pedido armado por WhatsApp."},
  {ruta:"ejemplos/panaderia/", img:"previews/ejemplo-panaderia.jpg", tag:"Panadería y pastelería", rubro:"Gastronomía", nombre:"Horno de Barrio", desc:"Productos del día y encargos de tortas para cumpleaños y eventos."},
  {ruta:"ejemplos/peluqueria/", img:"previews/ejemplo-peluqueria.jpg", tag:"Peluquería", rubro:"Belleza", nombre:"Studio Bruma", desc:"Servicios con precio y duración, turno guiado paso a paso y galería de antes y después."},
  {ruta:"ejemplos/barberia/", img:"previews/ejemplo-barberia.jpg", tag:"Barbería", rubro:"Belleza", nombre:"Filo Barbería", desc:"Precios con combos, turno exprés al próximo lugar libre y galería de estilos."},
  {ruta:"ejemplos/restaurante/", img:"previews/ejemplo-restaurante.jpg", tag:"Restaurante", rubro:"Gastronomía", nombre:"Parrilla El Fogón", desc:"Momentos del día y cartel de \"Abierto ahora\" en vivo."},
  {ruta:"ejemplos/cerveceria/", img:"previews/ejemplo-cerveceria.jpg", tag:"Bar y cervecería", rubro:"Gastronomía", nombre:"Patio Lúpulo", desc:"Días de apertura, canillas y reserva de mesa por WhatsApp."}
];

const tarjetaWeb = (p, real) => `<a class="card" href="${p.ruta}" target="_blank" rel="noopener">
    <div class="shot"><img src="${p.img}" alt="Vista de ${p.nombre}" loading="lazy"></div>
    <div class="body"><span class="tag ${real ? "real" : ""}">${p.tag}</span><h3>${p.nombre}</h3><p>${p.desc}</p><span class="go">${real ? "Ver web ↗" : "Ver ejemplo ↗"}</span></div>
  </a>`;
