/* =========================================================
   PATTERNS · Lectura de la planilla de Google
   ---------------------------------------------------------
   Descarga las pestañas "Productos" y "Contacto" como CSV y
   las convierte al formato que usa la tienda:

   { config: {...}, talles: [...], productos: [ {.., colores:[{.., stock:{S:3,...}}]} ] }

   Pestaña Productos: una fila por modelo y color.
   Columnas: id, modelo, precio, categoria, etiqueta, descripcion,
             patron, color, color_remera, color_estampa, foto,
             <una columna por talle>, total
   Los talles son las columnas entre "foto" y "total".
   ========================================================= */

function urlHoja(hoja){
  return `https://docs.google.com/spreadsheets/d/${FUENTE.sheetId}/gviz/tq?tqx=out:csv&headers=1&sheet=${encodeURIComponent(hoja)}`;
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

async function leerHoja(hoja){
  const r = await fetch(urlHoja(hoja), { cache: "no-store" });
  if (!r.ok) throw new Error(`No se pudo leer la pestaña "${hoja}" (HTTP ${r.status})`);
  const txt = await r.text();
  // Si la planilla no está compartida, Google devuelve una página HTML de login
  if (/^\s*</.test(txt)) throw new Error("La planilla no está compartida como 'Cualquier persona con el enlace'");
  return parseCSV(txt);
}

const limpio = s => String(s ?? "").trim();
const clave  = s => limpio(s).toLowerCase().replace(/\s+/g, "_");
const hex    = (s, def) => /^#[0-9a-f]{6}$/i.test(limpio(s)) ? limpio(s) : def;
const entero = s => { const n = parseInt(String(s).replace(/[^\d-]/g, ""), 10); return isNaN(n) || n < 0 ? 0 : n; };
const slug   = s => limpio(s).toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

function armarProductos(filas){
  const [enc, ...datos] = filas;
  const cols = enc.map(clave);
  const iFoto = cols.indexOf("foto");
  const iTotal = cols.indexOf("total");
  if (iFoto < 0) throw new Error('Falta la columna "foto" en la pestaña Productos');
  const talles = enc.slice(iFoto + 1, iTotal > iFoto ? iTotal : undefined).map(limpio).filter(Boolean);

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
    talles.forEach((t, k) => stock[t] = entero(f[iFoto + 1 + k]));
    porId.get(id).colores.push({
      nombre: v.color || "Único", tee: hex(v.color_remera, "#fafafa"), tinta: hex(v.color_estampa, "#111111"),
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

/* Devuelve los datos de la tienda: de la planilla, o de demo.js si no hay planilla configurada */
async function cargarTienda(){
  if (!FUENTE.sheetId) return TIENDA_DEMO;
  const [prod, cont] = await Promise.all([
    leerHoja(FUENTE.hojaProductos),
    leerHoja(FUENTE.hojaContacto).catch(() => null)
  ]);
  const { talles, productos } = armarProductos(prod);
  return {
    config: { marca: AJUSTES.marca, moneda: AJUSTES.moneda, promo: AJUSTES.promo, ...armarContacto(cont) },
    talles, productos
  };
}
