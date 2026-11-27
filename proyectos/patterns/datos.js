/* =========================================================
   PATTERNS · Lectura de la planilla de Google
   ---------------------------------------------------------
   Descarga las pestañas publicadas "Productos" y "Contacto"
   como CSV y las convierte al formato que usa la tienda:

   { config: {...}, talles: [...], productos: [ {.., colores:[{.., stock:{S:3,...}}]} ] }

   Pestaña Productos: una fila por modelo y color.
   Columnas: id, modelo, precio, categoria, etiqueta, descripcion,
             patron, color, <una columna por talle>, total
   Opcionales: color_remera y color_estampa (#hex; si faltan se
   deducen del nombre del color) y foto (uno o varios links
   separados por |).
   Los talles son todas las columnas que no son datos del producto.
   ========================================================= */

// Acepta el link completo de "Publicar en la Web" o solo la clave 2PACX-...
function clavePublicada(){
  const s = String(FUENTE.publicado || "").trim();
  const m = s.match(/\/d\/e\/([^/]+)/);
  return m ? m[1] : s;
}

function urlHoja(gid){
  return `https://docs.google.com/spreadsheets/d/e/${clavePublicada()}/pub?gid=${gid}&single=true&output=csv`;
}

/* Parser de CSV que respeta comillas, comas y saltos de línea dentro de un campo */
function parseCSV(txt){
  const filas = []; let fila = [], campo = "", comillas = false;
  for (let i = 0; i < txt.length; i++){
    const ch = txt[i];
    if (comillas){
      if (ch === '"' && txt[i+1] === '"'){ campo += '"'; i++; }
      else if (ch === '"') comillas = false;
      else campo += ch;
    } else if (ch === '"') comillas = true;
    else if (ch === ",") { fila.push(campo); campo = ""; }
    else if (ch === "\n" || ch === "\r"){
      if (ch === "\r" && txt[i+1] === "\n") i++;
      fila.push(campo); filas.push(fila); fila = []; campo = "";
    } else campo += ch;
  }
  if (campo !== "" || fila.length) { fila.push(campo); filas.push(fila); }
  return filas.filter(f => f.some(c => c.trim() !== ""));
}

async function leerHoja(gid){
  const r = await fetch(urlHoja(gid), { cache: "no-store" });
  if (!r.ok) throw new Error(`No se pudo leer la pestaña gid=${gid} (HTTP ${r.status})`);
  const txt = await r.text();
  // Si la pestaña no está publicada, Google devuelve una página HTML en vez de CSV
  if (/^\s*</.test(txt)) throw new Error(`La pestaña gid=${gid} no está publicada en la Web`);
  return parseCSV(txt);
}

const limpio = s => String(s ?? "").trim();
const clave  = s => limpio(s).toLowerCase().replace(/\s+/g, "_");
const hex    = (s, def) => /^#[0-9a-f]{6}$/i.test(limpio(s)) ? limpio(s) : def;
const entero = s => { const n = parseInt(String(s).replace(/[^\d-]/g, ""), 10); return isNaN(n) || n < 0 ? 0 : n; };
const slug   = s => limpio(s).toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

/* Colores por nombre, para cuando la planilla no trae color_remera / color_estampa */
const COLORES = {
  blanco:"#fafafa", negro:"#1a1a1a", gris:"#9a9a9a", arena:"#e8dcc6", beige:"#e8dcc6", crudo:"#efe8da",
  azul:"#2f4bff", marino:"#1d2a4d", celeste:"#9cc9f5", verde:"#16a37f", oliva:"#6b6b3a", amarillo:"#ffd23f",
  rojo:"#d7263d", bordo:"#6d1a2a", naranja:"#ff5a36", rosa:"#f4a6c0", violeta:"#7b4fd1", marron:"#7a4e2d", camel:"#c19a6b"
};
const colorPorNombre = n => COLORES[slug(n).split("-")[0]];

const NO_TALLE = new Set(["id","modelo","precio","categoria","etiqueta","descripcion","patron","color","color_remera","color_estampa","foto","total"]);

function armarProductos(filas){
  const [enc, ...datos] = filas;
  const cols = enc.map(clave);
  const iTalles = cols.map((c, i) => c && !NO_TALLE.has(c) ? i : -1).filter(i => i >= 0);
  const talles = iTalles.map(i => limpio(enc[i]));
  if (!talles.length) throw new Error("No encontré columnas de talles en la pestaña Productos");

  const porId = new Map();
  for (const f of datos){
    const v = Object.fromEntries(cols.map((c, i) => [c, limpio(f[i])]));
    if (!v.modelo && !v.id) continue;
    const id = v.id || slug(v.modelo);
    if (!porId.has(id)){
      porId.set(id, {
        id, nombre: v.modelo || id, precio: entero(v.precio), patron: v.patron || "puntos",
        cat: v.categoria || "Otras", tag: v.etiqueta || "", desc: v.descripcion || "", colores: []
      });
    }
    const stock = {};
    talles.forEach((t, k) => stock[t] = entero(f[iTalles[k]]));
    const tee = hex(v.color_remera, colorPorNombre(v.color) || "#fafafa");
    porId.get(id).colores.push({
      nombre: v.color || "Único", tee, tinta: hex(v.color_estampa, isDark(tee) ? "#ffffff" : "#111111"),
      img: v.foto || "", stock
    });
  }
  return { talles, productos: [...porId.values()] };
}

function armarContacto(filas){
  if (!filas || filas.length < 2) return {};
  const cols = filas[0].map(clave), val = filas[1];
  const v = Object.fromEntries(cols.map((c, i) => [c, limpio(val[i])]));
  return {
    whatsapp: (v.whatsapp || "").replace(/\D/g, ""),
    instagram: (v.instagram || "").replace(/^@/, "").replace(/^https?:\/\/(www\.)?instagram\.com\//, "").replace(/\/.*$/, ""),
    email: v.email || "",
    pocasUnidades: v.pocas_unidades !== undefined && v.pocas_unidades !== "" ? entero(v.pocas_unidades) : 2
  };
}

/* Devuelve los datos de la tienda: de la planilla publicada, o de demo.js si todavía no se publicó */
async function cargarTienda(){
  if (!clavePublicada()) return TIENDA_DEMO;
  const [prod, cont] = await Promise.all([
    leerHoja(FUENTE.gidProductos),
    leerHoja(FUENTE.gidContacto).catch(() => null)
  ]);
  const { talles, productos } = armarProductos(prod);
  return {
    config: { marca: AJUSTES.marca, moneda: AJUSTES.moneda, promo: AJUSTES.promo, ...armarContacto(cont) },
    talles, productos
  };
}
