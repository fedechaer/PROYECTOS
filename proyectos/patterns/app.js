/* =========================================================
   PATTERNS · Lógica de la tienda
   - Catálogo con filtros y stock
   - Ficha de producto con color, talle y disponibilidad
   - Carrito que respeta el stock (se guarda en el navegador)
   - Pedido y contacto por WhatsApp, Instagram o correo
   - Favoritas (T1), galería con zoom (T2), "¿Qué talle soy?" (T3)
     y "Avisame cuando vuelva" (T4)
   Los datos salen de la planilla de Google (ver datos.js y config.js).
   ========================================================= */
let CFG = { marca: AJUSTES.marca, moneda: AJUSTES.moneda, promo: AJUSTES.promo, pocasUnidades: 2 };
let TALLES = [];
let PRODUCTOS = [];

const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const fmt = n => CFG.moneda + " " + Number(n).toLocaleString("es-UY");
const findP = id => PRODUCTOS.find(p => p.id === id);

/* ---------------- Stock ---------------- */
const stockDe = (p, ci, t) => Number(p.colores[ci]?.stock?.[t] || 0);
const stockColor = (p, ci) => TALLES.reduce((a, t) => a + stockDe(p, ci, t), 0);
const stockTotal = p => p.colores.reduce((a, _, ci) => a + stockColor(p, ci), 0);
const enCarrito = (id, ci, t) => cart.filter(l => l.id === id && l.ci === ci && l.size === t).reduce((a, l) => a + l.q, 0);
const disponible = (p, ci, t) => stockDe(p, ci, t) - enCarrito(p.id, ci, t);
// "Pocas unidades": todos los talles que tienen stock están en el umbral o por debajo
const pocas = p => {
  const vals = p.colores.flatMap((_, ci) => TALLES.map(t => stockDe(p, ci, t))).filter(v => v > 0);
  return vals.length > 0 && vals.every(v => v <= CFG.pocasUnidades);
};

/* ---------------- Canales de contacto ---------------- */
const CANAL = {
  whatsapp: { ok: () => !!CFG.whatsapp, url: (msg = "") => `https://wa.me/${CFG.whatsapp}${msg ? "?text=" + encodeURIComponent(msg) : ""}`, nombre: "WhatsApp" },
  instagram:{ ok: () => !!CFG.instagram, url: () => `https://www.instagram.com/${CFG.instagram}/`, dm: () => `https://ig.me/m/${CFG.instagram}`, nombre: "Instagram" },
  email:    { ok: () => !!CFG.email, url: (msg = "", asunto = "Consulta PATTERNS") => `mailto:${CFG.email}?subject=${encodeURIComponent(asunto)}${msg ? "&body=" + encodeURIComponent(msg) : ""}`, nombre: "correo" }
};

function prepararLinks(){
  $$("[data-canal]").forEach(a => {
    const c = CANAL[a.dataset.canal];
    if (c.ok()) {
      const saludo = `¡Hola ${CFG.marca}! 👋`;
      a.href = a.dataset.canal === "whatsapp" ? c.url(saludo) : c.url();
      if (a.dataset.canal !== "email") { a.target = "_blank"; a.rel = "noopener"; }
    } else {
      a.href = "#";
      a.onclick = e => { e.preventDefault(); toast(`Demo: falta cargar ${c.nombre} en la planilla (pestaña Contacto)`); };
    }
  });
  if (CFG.instagram) $("#igUser").textContent = "@" + CFG.instagram + " →";
  if (CFG.email) $("#mailTxt").textContent = CFG.email + " →";
}

/* ---------------- Catálogo ---------------- */
let filtro = "Todas";
let cats = ["Todas"];

function renderFilters(){
  $("#filters").innerHTML = cats.map(c => `<button class="chip ${c === filtro ? "on" : ""}" data-c="${c}">${c}</button>`).join("")
    + `<button class="chip fav ${filtro === "fav" ? "on" : ""}" data-c="fav">♡ Favoritas${favs.length ? ` (${favs.length})` : ""}</button>`;
  $$("#filters .chip").forEach(b => b.onclick = () => { filtro = b.dataset.c; renderFilters(); renderGrid(); });
}

function renderGrid(){
  const solo = $("#soloStock").checked;
  const list = PRODUCTOS
    .filter(p => filtro === "Todas" || (filtro === "fav" ? esFav(p.id) : p.cat === filtro))
    .filter(p => !solo || stockTotal(p) > 0)
    .sort((a, b) => (stockTotal(b) > 0) - (stockTotal(a) > 0)); // agotados al final
  renderShare();
  if (!list.length) {
    $("#grid").innerHTML = filtro === "fav"
      ? `<p class="none">Todavía no guardaste ninguna.<br>Tocá el ♡ de las remeras que te gusten y quedan acá.</p>`
      : `<p class="none">No hay remeras para mostrar con este filtro.</p>`;
    return;
  }
  $("#grid").innerHTML = list.map(p => {
    const out = stockTotal(p) === 0;
    const ci = Math.max(0, p.colores.findIndex((_, i) => stockColor(p, i) > 0));
    const tag = out ? `<span class="tag out">Agotada</span>` : p.tag ? `<span class="tag ${p.tag === "Nuevo" ? "new" : ""}">${p.tag}</span>` : "";
    const low = !out && pocas(p) ? `<span class="tag low">¡Últimas!</span>` : "";
    return `<article class="prod ${out ? "out" : ""}" data-id="${p.id}" tabindex="0">
      <div class="img">${productImage(p, ci)}${tag}${low}
        <button type="button" class="heart ${esFav(p.id) ? "on" : ""}" data-fav="${p.id}" aria-pressed="${esFav(p.id)}" aria-label="${esFav(p.id) ? "Quitar de" : "Guardar en"} favoritas">${esFav(p.id) ? "♥" : "♡"}</button></div>
      <div class="body">
        <div><h3>${p.nombre}</h3><small>${p.cat}</small>
          <div class="dots">${p.colores.map(c => `<i style="background:${c.tee}" title="${c.nombre}"></i>`).join("")}</div></div>
        <div class="price">${fmt(p.precio)}</div>
      </div>
    </article>`;
  }).join("");
  $$("#grid .heart").forEach(b => b.onclick = e => { e.stopPropagation(); toggleFav(b.dataset.fav); });
  $$("#grid .prod").forEach(el => {
    el.onclick = () => openModal(el.dataset.id);
    el.onkeydown = e => { if (e.key === "Enter") openModal(el.dataset.id); };
  });
}

/* ---------------- Ficha de producto ---------------- */
let cur = null, curColor = 0, curSize = null;

function openModal(id){
  cur = findP(id);
  curColor = Math.max(0, cur.colores.findIndex((_, i) => stockColor(cur, i) > 0));
  curSize = talleSugerido && stockDe(cur, curColor, talleSugerido) > 0 ? talleSugerido : null;   // T3: preselecciona su talle
  galKey = "";
  $("#mName").textContent = cur.nombre;
  $("#mPrice").textContent = fmt(cur.precio);
  $("#mDesc").textContent = cur.desc;
  drawModal();
  $("#overlay").classList.add("show");
}

function drawModal(){
  const c = cur.colores[curColor];
  drawGaleria();
  const fv = esFav(cur.id);
  $("#mFav").textContent = fv ? "♥ Guardada" : "♡ Guardar";
  $("#mFav").classList.toggle("on", fv);
  $("#mFav").setAttribute("aria-pressed", fv);
  $("#mColorName").textContent = c.nombre + (stockColor(cur, curColor) === 0 ? " (agotado)" : "");
  $("#mColors").innerHTML = cur.colores.map((col, i) =>
    `<button class="${i === curColor ? "on" : ""}" style="background:${col.tee}" title="${col.nombre}" aria-label="${col.nombre}" data-i="${i}"></button>`).join("");
  $$("#mColors button").forEach(b => b.onclick = () => {
    curColor = +b.dataset.i;
    if (curSize && stockDe(cur, curColor, curSize) <= 0 && stockColor(cur, curColor) > 0) curSize = null;
    drawModal();
  });

  // Los talles agotados se pueden tocar: así se pide el aviso (T4)
  $("#mSizes").innerHTML = TALLES.map(t => {
    const agot = stockDe(cur, curColor, t) <= 0;
    return `<button class="${t === curSize ? "on" : ""} ${agot ? "agot" : ""} ${t === talleSugerido ? "rec" : ""}" data-t="${t}" ${agot ? "title='Agotado: tocá para que te avisemos'" : ""} aria-label="Talle ${t}${agot ? ", agotado" : ""}${t === talleSugerido ? ", tu talle sugerido" : ""}">${t}</button>`;
  }).join("");
  $$("#mSizes button").forEach(b => b.onclick = () => { curSize = curSize === b.dataset.t ? null : b.dataset.t; drawModal(); });

  // Mensaje de stock y estado del botón
  const msg = $("#mStock"), add = $("#mAdd");
  msg.className = "stock-msg";
  add.disabled = false; add.textContent = "Agregar al carrito"; add.style.display = "";
  $("#mNotify").style.display = "none";
  if (stockTotal(cur) === 0) {
    msg.classList.add("out"); msg.textContent = "Este modelo está agotado por ahora.";
    add.style.display = "none"; mostrarAviso();
  } else if (stockColor(cur, curColor) === 0) {
    msg.classList.add("out"); msg.textContent = `El ${c.nombre.toLowerCase()} está agotado. Probá con otro color 👆`;
    add.style.display = "none"; mostrarAviso();
  } else if (!curSize) {
    msg.textContent = talleSugerido ? `Elegí tu talle (el sugerido para vos es ${talleSugerido})` : "Elegí tu talle";
  } else if (stockDe(cur, curColor, curSize) <= 0) {
    msg.classList.add("out"); msg.textContent = `Talle ${curSize} agotado en ${c.nombre.toLowerCase()}.`;
    add.style.display = "none"; mostrarAviso();
  } else {
    const d = disponible(cur, curColor, curSize);
    if (d <= 0) { msg.classList.add("out"); msg.textContent = "Ya tenés en el carrito todas las unidades disponibles."; add.disabled = true; }
    else if (d <= CFG.pocasUnidades) { msg.classList.add("low"); msg.textContent = `¡Quedan solo ${d}!`; }
    else { msg.classList.add("ok"); msg.textContent = "✓ En stock" + (curSize === talleSugerido ? " · tu talle sugerido" : ""); }
  }

  // Link de consulta por talle
  $("#mAsk").onclick = e => {
    e.preventDefault();
    const m = `¡Hola ${CFG.marca}! Quería consultar por la remera ${cur.nombre} en color ${c.nombre}${curSize ? ", talle " + curSize : ""}. ¿Tienen o va a volver?`;
    abrirCanal("whatsapp", m);
  };
}

function closeModal(){ $("#overlay").classList.remove("show"); devolverCalc(); }
$("#mClose").onclick = closeModal;
$("#mFav").onclick = () => toggleFav(cur.id);
$("#overlay").onclick = e => { if (e.target.id === "overlay") closeModal(); };
$("#mAdd").onclick = () => {
  if (!curSize) { $("#mStock").className = "stock-msg low"; $("#mStock").textContent = "Elegí un talle 👆"; return; }
  if (disponible(cur, curColor, curSize) <= 0) return;
  addToCart(cur, curColor, curSize);
  closeModal();
  toast("Agregado al carrito ✓");
};

/* ---------------- T2 · Galería con zoom ---------------- */
let galKey = "";
function drawGaleria(){
  const key = cur.id + "|" + curColor;
  if (key === galKey) return;            // no rehacer la galería al tocar un talle
  galKey = key;
  const vs = vistasProducto(cur, curColor);
  $("#mImg").innerHTML = `<div class="track" id="mTrack">${vs.map((v, i) =>
    `<div class="slide" data-i="${i}" role="img" aria-label="${v.t}"><div class="zw">${v.html}</div></div>`).join("")}</div>
    <span class="zhint" id="zHint">🔍 Tocá para ampliar</span>`;
  $("#mThumbs").innerHTML = vs.length > 1 ? vs.map((v, i) =>
    `<button type="button" class="${i ? "" : "on"}" data-i="${i}" aria-label="Ver ${v.t}">${v.html.replace(/ id="([ps]\d+)"/g, ' id="t$1"').replace(/url\(#([ps]\d+)\)/g, "url(#t$1)")}<span>${v.t}</span></button>`).join("") : "";
  const track = $("#mTrack");
  $$("#mThumbs button").forEach(b => b.onclick = () => track.scrollTo({ left: +b.dataset.i * track.clientWidth, behavior: "smooth" }));
  track.onscroll = () => {
    const i = Math.round(track.scrollLeft / track.clientWidth);
    $$("#mThumbs button").forEach(b => b.classList.toggle("on", +b.dataset.i === i));
    $$("#mTrack .slide.z").forEach(s => { if (+s.dataset.i !== i) s.classList.remove("z"); });
  };
  $$("#mTrack .slide").forEach(s => {
    const zw = s.firstElementChild;
    let x0 = 0, y0 = 0, movio = false;
    const foco = e => {
      const r = s.getBoundingClientRect();
      const fx = Math.min(100, Math.max(0, (e.clientX - r.left) / r.width * 100));
      const fy = Math.min(100, Math.max(0, (e.clientY - r.top) / r.height * 100));
      zw.style.transformOrigin = `${fx}% ${fy}%`;
    };
    s.onpointerdown = e => { x0 = e.clientX; y0 = e.clientY; movio = false; };
    s.onpointermove = e => {
      if (Math.abs(e.clientX - x0) + Math.abs(e.clientY - y0) > 8) movio = true;
      if (s.classList.contains("z")) foco(e);      // con el dedo o el mouse se recorre la imagen ampliada
    };
    s.onclick = e => {
      if (movio && s.classList.contains("z")) return;
      foco(e); s.classList.toggle("z");
      $("#zHint").textContent = s.classList.contains("z") ? "Mové para recorrer · tocá para salir" : "🔍 Tocá para ampliar";
    };
  });
}

/* ---------------- T1 · Favoritas ---------------- */
let favs = [];
try { favs = JSON.parse(localStorage.getItem("patterns-fav") || "[]"); } catch (e) {}
const esFav = id => favs.includes(id);
function toggleFav(id){
  const on = !esFav(id);
  favs = on ? [...favs, id] : favs.filter(x => x !== id);
  try { localStorage.setItem("patterns-fav", JSON.stringify(favs)); } catch (e) {}
  renderFavN(); renderFilters(); renderGrid();
  if (cur && cur.id === id && $("#overlay").classList.contains("show")) drawModal();
  toast(on ? "Guardada en favoritas ♥" : "La sacaste de favoritas");
}
function renderFavN(){
  $("#favN").textContent = favs.filter(id => findP(id)).length;
  $("#openFav").classList.toggle("on", favs.length > 0);
}
function renderShare(){
  const lista = favs.map(findP).filter(Boolean);
  const box = $("#favShare");
  if (filtro !== "fav" || !lista.length) { box.style.display = "none"; return; }
  box.style.display = "";
  box.innerHTML = `<span>🎁 ¿Querés que te la regalen? Mandá tu lista.</span><button type="button" class="btn sm" id="shareBtn">Compartir mi lista</button>`;
  $("#shareBtn").onclick = async () => {
    const txt = `Mi lista de ${CFG.marca} ♥\n\n${lista.map(p => `• ${p.nombre} — ${fmt(p.precio)}`).join("\n")}\n\nMirala acá: ${location.href.split("#")[0]}`;
    if (navigator.share) { try { await navigator.share({ title: `Mi lista de ${CFG.marca}`, text: txt }); return; } catch (e) { if (e.name === "AbortError") return; } }
    window.open("https://wa.me/?text=" + encodeURIComponent(txt), "_blank");
  };
}
$("#openFav").onclick = () => {
  filtro = "fav"; renderFilters(); renderGrid();
  $("#tienda").scrollIntoView({ behavior: "smooth" });
};

/* ---------------- T3 · ¿Qué talle soy? ---------------- */
let talleSugerido = null;
try { talleSugerido = localStorage.getItem("patterns-talle"); } catch (e) {}
let modoCalc = "remera", calce = 0;
const tallesConMedida = () => (TALLES.length ? TALLES : Object.keys(MEDIDAS)).filter(t => MEDIDAS[t]);

function renderTabla(){
  $("#tBody").innerHTML = tallesConMedida().map(t => `<tr class="${t === talleSugerido ? "rec" : ""}"><td><b>${t}</b>${t === talleSugerido ? " ✓" : ""}</td><td>${MEDIDAS[t][0]}</td><td>${MEDIDAS[t][1]}</td></tr>`).join("");
}
function calcular(){
  const ts = tallesConMedida(), res = $("#cRes");
  let t = null, por = "";
  if (modoCalc === "remera") {
    const a = parseFloat($("#cAncho").value);
    if (!a) { res.innerHTML = ""; return; }
    t = ts.reduce((best, x) => Math.abs(MEDIDAS[x][0] - a) <= Math.abs(MEDIDAS[best][0] - a) ? x : best, ts[0]);
    por = `Tu remera mide ${a} cm de ancho y la ${t} mide ${MEDIDAS[t][0]} cm.`;
    if (a > MEDIDAS[ts[ts.length - 1]][0] + 3) por += " Es la más grande que tenemos.";
    if (a < MEDIDAS[ts[0]][0] - 3) por += " Es la más chica que tenemos.";
  } else {
    const alt = parseFloat($("#cAlt").value), peso = parseFloat($("#cPeso").value);
    if (!alt || !peso) { res.innerHTML = ""; return; }
    let i = [60, 72, 85, 98].filter(x => peso >= x).length;
    if (alt >= 186) i++;
    if (alt <= 162) i--;
    i = Math.min(ts.length - 1, Math.max(0, i + calce));
    t = ts[i];
    por = `Es una estimación para ${alt} cm y ${peso} kg. Para ir a lo seguro, medí una remera tuya.`;
  }
  talleSugerido = t;
  try { localStorage.setItem("patterns-talle", t); } catch (e) {}
  const enModal = !!$("#calc").closest(".modal");
  res.innerHTML = `<div class="big">Tu talle: <b>${t}</b></div><small>${por}</small>${enModal ? `<button type="button" class="btn sm" id="cUsar">Elegir talle ${t}</button>` : ""}`;
  if (enModal) $("#cUsar").onclick = () => { curSize = t; devolverCalc(); drawModal(); };
  renderTabla();
}
$$("#cModo button").forEach(b => b.onclick = () => {
  modoCalc = b.dataset.m;
  $$("#cModo button").forEach(x => x.classList.toggle("on", x === b));
  $$("#calc .cm").forEach(d => d.style.display = d.dataset.m === modoCalc ? "" : "none");
  calcular();
});
$$("#cFit button").forEach(b => b.onclick = () => {
  calce = +b.dataset.f;
  $$("#cFit button").forEach(x => x.classList.toggle("on", x === b));
  calcular();
});
["#cAncho", "#cAlt", "#cPeso"].forEach(s => $(s).oninput = calcular);
// La misma calculadora se muestra en la guía de talles o dentro de la ficha
function devolverCalc(){ if ($("#calc").closest(".modal")) { $("#calcHome").appendChild($("#calc")); $("#mCalcBtn").classList.remove("on"); calcular(); } }
$("#mCalcBtn").onclick = () => {
  if ($("#calc").closest(".modal")) { devolverCalc(); if (cur) drawModal(); return; }
  $("#mCalcSlot").appendChild($("#calc")); $("#mCalcBtn").classList.add("on"); calcular();
  $("#calc").scrollIntoView({ behavior: "smooth", block: "nearest" });
};

/* ---------------- T4 · Avisame cuando vuelva ---------------- */
let avisos = [];
try { avisos = JSON.parse(localStorage.getItem("patterns-avisos") || "[]"); } catch (e) {}
const claveAviso = () => `${cur.id}|${curColor}|${curSize || "*"}`;
function mostrarAviso(){
  const c = cur.colores[curColor], ya = avisos.includes(claveAviso());
  $("#mNotify").style.display = "";
  $("#nTxt").textContent = ya
    ? "✓ Ya pediste el aviso para esta combinación. Te escribimos cuando vuelva."
    : `Te mandamos un WhatsApp cuando vuelva la ${cur.nombre} en ${c.nombre.toLowerCase()}${curSize ? `, talle ${curSize}` : " (elegí el talle arriba)"}.`;
  $("#mNotify").classList.toggle("ya", ya);
  if (!$("#nName").value) $("#nName").value = $("#cName").value;
}
$("#nBtn").onclick = () => {
  const nom = $("#nName").value.trim();
  if (!nom) { $("#nName").focus(); toast("Poné tu nombre así sabemos a quién avisarle"); return; }
  const c = cur.colores[curColor];
  const m = `¡Hola ${CFG.marca}! 🔔 ¿Me avisan cuando vuelva la remera ${cur.nombre} en ${c.nombre.toLowerCase()}, talle ${curSize || "(a definir)"}? Soy ${nom}.`;
  abrirCanal(CFG.whatsapp || !CFG.email ? "whatsapp" : "email", m);
  if (!avisos.includes(claveAviso())) avisos.push(claveAviso());
  try { localStorage.setItem("patterns-avisos", JSON.stringify(avisos)); } catch (e) {}
  if ($("#cName") && !$("#cName").value) $("#cName").value = nom;
  mostrarAviso();
};

/* ---------------- Carrito ---------------- */
let cart = [];
try { cart = JSON.parse(localStorage.getItem("patterns-cart") || "[]"); } catch (e) {}
const save = () => { try { localStorage.setItem("patterns-cart", JSON.stringify(cart)); } catch (e) {} };

// Si el stock cambió desde la última visita, ajustamos el carrito
function ajustarCarrito(){
  let cambio = false;
  cart = cart.filter(l => {
    const p = findP(l.id);
    if (!p || !p.colores[l.ci]) { cambio = true; return false; }
    const max = stockDe(p, l.ci, l.size);
    if (l.q > max) { l.q = max; cambio = true; }
    return l.q > 0;
  });
  if (cambio) { save(); setTimeout(() => toast("Ajustamos tu carrito según el stock disponible"), 600); }
}

function addToCart(p, ci, size){
  const ex = cart.find(l => l.id === p.id && l.ci === ci && l.size === size);
  if (ex) ex.q++; else cart.push({ id: p.id, ci, size, q: 1 });
  save(); renderCart(); renderGrid();
}

const total = () => cart.reduce((a, l) => a + (findP(l.id)?.precio || 0) * l.q, 0);

function renderCart(){
  $("#cartN").textContent = cart.reduce((a, l) => a + l.q, 0);
  $("#cFoot").style.display = cart.length ? "" : "none";
  if (!cart.length) { $("#lines").innerHTML = `<div class="empty">Tu carrito está vacío.<br>¡Elegí tu patrón! 👕</div>`; return; }
  $("#lines").innerHTML = cart.map((l, i) => {
    const p = findP(l.id);
    const lleno = disponible(p, l.ci, l.size) <= 0;
    return `<div class="line"><div class="th">${productImage(p, l.ci)}</div>
      <div><b>${p.nombre}</b><small>${p.colores[l.ci].nombre} · Talle ${l.size}</small>
        <div class="q"><button data-i="${i}" data-d="-1" aria-label="Quitar uno">−</button>${l.q}<button data-i="${i}" data-d="1" aria-label="Agregar uno" ${lleno ? "disabled title='No hay más stock'" : ""}>+</button></div></div>
      <b>${fmt(p.precio * l.q)}</b></div>`;
  }).join("");
  $$("#lines .q button").forEach(b => b.onclick = () => {
    const l = cart[+b.dataset.i];
    l.q += +b.dataset.d;
    if (l.q <= 0) cart.splice(+b.dataset.i, 1);
    save(); renderCart(); renderGrid();
  });
  $("#cTotal").textContent = fmt(total());
}

function openCart(){ $("#drawer").classList.add("show"); $("#shade").classList.add("show"); }
function closeCart(){ $("#drawer").classList.remove("show"); $("#shade").classList.remove("show"); }
$("#openCart").onclick = openCart;
$("#cClose").onclick = closeCart;
$("#shade").onclick = closeCart;
document.addEventListener("keydown", e => { if (e.key === "Escape") { closeModal(); closeCart(); } });

/* ---------------- Enviar pedido ---------------- */
function mensajePedido(){
  const nombre = $("#cName").value.trim();
  const lineas = cart.map(l => {
    const p = findP(l.id);
    return `• ${l.q} x ${p.nombre} (${p.colores[l.ci].nombre}, talle ${l.size}) — ${fmt(p.precio * l.q)}`;
  });
  return `¡Hola ${CFG.marca}! 👋 Quiero hacer este pedido:\n\n${lineas.join("\n")}\n\nTotal: ${fmt(total())}\nEntrega: ${$("#cShip").value}\nNombre: ${nombre}`;
}

async function copiar(txt){
  try { await navigator.clipboard.writeText(txt); return true; } catch (e) { return false; }
}

async function abrirCanal(canal, msg){
  const c = CANAL[canal];
  if (!c.ok()) { alert(`Demo: acá se abriría ${c.nombre} con este mensaje:\n\n${msg}\n\n(Falta cargar ${canal} en la planilla, pestaña Contacto)`); return; }
  if (canal === "whatsapp") window.open(c.url(msg), "_blank");
  if (canal === "email") location.href = c.url(msg, "Pedido " + CFG.marca);
  if (canal === "instagram") {
    // Instagram no permite precargar el texto: lo copiamos y abrimos el chat
    const ok = await copiar(msg);
    toast(ok ? "Pedido copiado ✓ Pegalo en el chat de Instagram" : "Abrí el chat y contanos tu pedido");
    setTimeout(() => window.open(c.dm(), "_blank"), 900);
  }
}

$$("[data-send]").forEach(b => b.onclick = () => {
  if (!cart.length) return;
  if (!$("#cName").value.trim()) { $("#cName").focus(); toast("Poné tu nombre así sabemos de quién es el pedido"); return; }
  abrirCanal(b.dataset.send, mensajePedido());
});

/* ---------------- Toast ---------------- */
let tt;
function toast(t){ const el = $("#toast"); el.textContent = t; el.classList.add("show"); clearTimeout(tt); tt = setTimeout(() => el.classList.remove("show"), 2400); }

/* ---------------- Inicio ---------------- */
$("#promo").textContent = (CFG.promo.join("  ✦  ") + "  ✦  ").repeat(6);
$("#yr").textContent = new Date().getFullYear();
$("#heroA").innerHTML = swatchSVG("leopardo", "#2a1a0e", "#e0a84c");
$("#heroB").innerHTML = swatchSVG("cebra", "#111", "#f4f2ee");
$("#heroC").innerHTML = swatchSVG("vibora", "#16a37f", "#111");
$("#aboutArt").innerHTML = swatchSVG("jirafa", "#7a4e2d", "#f2dcb3");
renderTabla();
$("#soloStock").onchange = renderGrid;
$("#grid").innerHTML = `<p class="none">Cargando la colección…</p>`;
$("#cartN").textContent = cart.reduce((a, l) => a + l.q, 0);

(async () => {
  try {
    const T = await cargarTienda();
    CFG = { ...CFG, ...T.config };
    TALLES = T.talles;
    PRODUCTOS = T.productos;
  } catch (err) {
    console.error("PATTERNS:", err);
    $("#grid").innerHTML = `<p class="none">No pudimos cargar la colección en este momento 😕<br>Probá recargar la página o <a href="#contacto">escribinos</a>.</p>`;
    prepararLinks();
    return;
  }
  cats = ["Todas", ...new Set(PRODUCTOS.map(p => p.cat))];
  $("#statN").textContent = PRODUCTOS.length;
  ajustarCarrito();
  prepararLinks();
  renderFavN();
  renderTabla();
  renderFilters();
  renderGrid();
  renderCart();
})();
