/* =========================================================
   PATTERNS · Datos de la tienda
   ---------------------------------------------------------
   Este archivo se puede editar a mano o desde inventario.html
   (que te descarga una versión nueva de este mismo archivo).

   - config: datos de contacto de la marca
   - talles: talles disponibles, en orden
   - productos: cada producto tiene uno o más colores, y cada
     color tiene su propio stock por talle.
       img:    foto real (ej: "img/ondas-blanco.jpg"). Vacío = remera dibujada.
       patron: rayas | puntos | ondas | cuadros | triangulos | zigzag | grilla | circulos
   Precios, nombres y stock de ejemplo: cambiar por los reales.
   ========================================================= */
const TIENDA = {
  "config": {
    "marca": "PATTERNS",
    "whatsapp": "",
    "instagram": "",
    "email": "",
    "moneda": "$",
    "pocasUnidades": 2,
    "promo": ["Envíos a todo Uruguay", "Nueva colección disponible", "Cambios de talle sin costo", "Hecho en Uruguay"]
  },
  "talles": ["S", "M", "L", "XL", "XXL"],
  "productos": [
    {
      "id": "ondas", "nombre": "Ondas", "precio": 990, "patron": "ondas", "cat": "Clásicas", "tag": "Nuevo",
      "desc": "Ondas que se repiten como el mar de la rambla. Estampa frontal.",
      "colores": [
        {"nombre": "Blanco", "tee": "#fafafa", "tinta": "#2f4bff", "img": "", "stock": {"S": 4, "M": 6, "L": 5, "XL": 2, "XXL": 1}},
        {"nombre": "Negro",  "tee": "#1a1a1a", "tinta": "#ffd23f", "img": "", "stock": {"S": 3, "M": 5, "L": 4, "XL": 3, "XXL": 0}}
      ]
    },
    {
      "id": "puntos", "nombre": "Puntos", "precio": 990, "patron": "puntos", "cat": "Clásicas", "tag": "",
      "desc": "Un clásico que nunca falla. Puntos en grilla perfecta.",
      "colores": [
        {"nombre": "Negro", "tee": "#1a1a1a", "tinta": "#ffffff", "img": "", "stock": {"S": 2, "M": 4, "L": 4, "XL": 2, "XXL": 1}},
        {"nombre": "Arena", "tee": "#e8dcc6", "tinta": "#ff5a36", "img": "", "stock": {"S": 1, "M": 3, "L": 2, "XL": 0, "XXL": 0}}
      ]
    },
    {
      "id": "rayas", "nombre": "Rayas 45°", "precio": 1090, "patron": "rayas", "cat": "Clásicas", "tag": "Más vendida",
      "desc": "Rayas diagonales con mucha actitud.",
      "colores": [
        {"nombre": "Blanco", "tee": "#fafafa", "tinta": "#111111", "img": "", "stock": {"S": 0, "M": 2, "L": 1, "XL": 1, "XXL": 0}},
        {"nombre": "Azul",   "tee": "#2f4bff", "tinta": "#ffffff", "img": "", "stock": {"S": 2, "M": 3, "L": 3, "XL": 2, "XXL": 1}}
      ]
    },
    {
      "id": "cuadros", "nombre": "Damero", "precio": 1090, "patron": "cuadros", "cat": "Gráficas", "tag": "",
      "desc": "Cuadros blancos y negros, inspiración skate.",
      "colores": [
        {"nombre": "Blanco", "tee": "#fafafa", "tinta": "#111111", "img": "", "stock": {"S": 3, "M": 4, "L": 4, "XL": 2, "XXL": 2}},
        {"nombre": "Verde",  "tee": "#16a37f", "tinta": "#ffffff", "img": "", "stock": {"S": 1, "M": 2, "L": 2, "XL": 1, "XXL": 0}}
      ]
    },
    {
      "id": "triangulos", "nombre": "Triángulos", "precio": 1190, "patron": "triangulos", "cat": "Gráficas", "tag": "Nuevo",
      "desc": "Geometría pura en una estampa de impacto.",
      "colores": [
        {"nombre": "Negro",  "tee": "#1a1a1a", "tinta": "#ff5a36", "img": "", "stock": {"S": 2, "M": 5, "L": 5, "XL": 3, "XXL": 1}},
        {"nombre": "Blanco", "tee": "#fafafa", "tinta": "#16a37f", "img": "", "stock": {"S": 2, "M": 3, "L": 3, "XL": 1, "XXL": 1}}
      ]
    },
    {
      "id": "zigzag", "nombre": "Zigzag", "precio": 1190, "patron": "zigzag", "cat": "Gráficas", "tag": "",
      "desc": "Movimiento constante, para los que no paran.",
      "colores": [
        {"nombre": "Amarillo", "tee": "#ffd23f", "tinta": "#111111", "img": "", "stock": {"S": 1, "M": 2, "L": 2, "XL": 1, "XXL": 0}},
        {"nombre": "Negro",    "tee": "#1a1a1a", "tinta": "#ffd23f", "img": "", "stock": {"S": 2, "M": 3, "L": 3, "XL": 2, "XXL": 1}}
      ]
    },
    {
      "id": "grilla", "nombre": "Grilla", "precio": 990, "patron": "grilla", "cat": "Minimal", "tag": "",
      "desc": "Líneas finas, diseño sutil para todos los días.",
      "colores": [
        {"nombre": "Gris",   "tee": "#cfcfcf", "tinta": "#111111", "img": "", "stock": {"S": 3, "M": 4, "L": 4, "XL": 3, "XXL": 2}},
        {"nombre": "Blanco", "tee": "#fafafa", "tinta": "#2f4bff", "img": "", "stock": {"S": 2, "M": 3, "L": 3, "XL": 2, "XXL": 1}}
      ]
    },
    {
      "id": "circulos", "nombre": "Órbitas", "precio": 1290, "patron": "circulos", "cat": "Edición limitada", "tag": "Limitada",
      "desc": "Círculos concéntricos. Pocas unidades por talle.",
      "colores": [
        {"nombre": "Negro", "tee": "#1a1a1a", "tinta": "#ff5a36", "img": "", "stock": {"S": 0, "M": 0, "L": 0, "XL": 0, "XXL": 0}},
        {"nombre": "Arena", "tee": "#e8dcc6", "tinta": "#2f4bff", "img": "", "stock": {"S": 0, "M": 0, "L": 0, "XL": 0, "XXL": 0}}
      ]
    }
  ]
};
