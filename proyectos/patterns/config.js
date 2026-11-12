/* =========================================================
   PATTERNS · Configuración
   ---------------------------------------------------------
   Los productos, el stock y los datos de contacto se leen de
   la planilla de Google "PATTERNS - Stock".

   Para que la web pueda leerla, la planilla tiene que estar
   compartida como "Cualquier persona con el enlace: Lector".

   Si sheetId queda vacío, la web usa los datos de demo.js.
   ========================================================= */
const FUENTE = {
  // ID de la planilla: es la parte del link entre /d/ y /edit
  sheetId: "1IS-ib6t60ZBEBRZPOj0tgwarbJBM8ogt9qA2NVM9nnE",
  hojaProductos: "Productos",
  hojaContacto: "Contacto"
};

/* Textos fijos de la web (no están en la planilla) */
const AJUSTES = {
  marca: "PATTERNS",
  moneda: "$",
  promo: ["Envíos a todo Uruguay", "Nueva colección disponible", "Cambios de talle sin costo", "Hecho en Uruguay"]
};
