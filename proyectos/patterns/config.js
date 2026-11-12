/* =========================================================
   PATTERNS · Configuración
   ---------------------------------------------------------
   Los productos, el stock y los datos de contacto se leen de
   la planilla de Google "PATTERNS - Stock".

   La planilla queda PRIVADA (tiene datos de clientes). La web
   lee solo las pestañas Productos y Contacto, que se publican
   desde Archivo → Compartir → Publicar en la Web.

   "publicado": pegá acá el link que te da Google al publicar
   (o solo la parte que empieza con 2PACX-...).
   Si queda vacío, la web usa los datos de demo.js.
   ========================================================= */
const FUENTE = {
  publicado: "https://docs.google.com/spreadsheets/d/e/2PACX-1vRwiPxs_PirU_o-mPUoBuWCJVD3pvhpnSr1U6Sj9HN-_xMG0Qv2_cBWcJUWzfewAvQ9-EteoMfGs-CM/pubhtml?gid=702248831&single=true",
  gidProductos: 702248831,   // número de la pestaña Productos (gid=... en el link)
  gidContacto: 1759798324    // número de la pestaña Contacto
};

/* Textos fijos de la web (no están en la planilla) */
const AJUSTES = {
  marca: "PATTERNS",
  moneda: "$",
  promo: ["Envíos a todo Uruguay", "Nueva colección disponible", "Cambios de talle sin costo", "Hecho en Uruguay"]
};
