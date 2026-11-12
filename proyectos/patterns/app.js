/* =========================================================
   PATTERNS · Lógica de la tienda
   - Catálogo con filtros y stock
   - Ficha de producto con color, talle y disponibilidad
   - Carrito que respeta el stock (se guarda en el navegador)
   - Pedido y contacto por WhatsApp, Instagram o correo
   Los datos salen de productos.js (objeto TIENDA).
   ========================================================= */
const CFG = TIENDA.config;
const TALLES = TIENDA.talles;
const PRODUCTOS = TIENDA.productos;

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
      a.onclick = e => { e.preventDefault(); toast(`Demo: falta configurar ${c.nombre} en productos.js`); };
    }
  });
  if (CFG.instagram) $("#igUser").textContent = "@" + CFG.instagram + " →";
  if (CFG.email) $("#mailTxt").textContent = CFG.email + " →";
}

/* ---------------- Catálogo ---------------- */
let filtro = "Todas";
const cats = ["Todas", ...new Set(PRODUCTOS.map(p => p.cat))];

function renderFilters(){
  $("#filters").innerHTML = cats.map(c => `<button class="chip ${c === filtro ? "on" : ""}" data-c="${c}">${c}</button>`).join("");
  $$("#filters .chip").forEach(b => b.onclick = () => { filtro = b.dataset.c; renderFilters(); renderGrid(); });
}

function renderGrid(){
  const solo = $("#soloStock").checked;
  const list = PRODUCTOS
    .filter(p => filtro === "Todas" || p.cat === filtro)
    .filter(p => !solo || stockTotal(p) > 0)
    .sort((a, b) => (stockTotal(b) > 0) - (stockTotal(a) > 0)); // agotados al final
  if (!list.length) { $("#grid").innerHTML = `<p class="none">No hay remeras para mostrar con este filtro.</p>`; return; }
  $("#grid").innerHTML = list.map(p => {
    const out = stockTotal(p) === 0;
    const ci = Math.max(0, p.colores.findIndex((_, i) => stockColor(p, i) > 0));
    const tag = out ? `<span class="tag out">Agotada</span>` : p.tag ? `<span class="tag ${p.tag === "Nuevo" ? "new" : ""}">${p.tag}</span>` : "";
    const low = !out && pocas(p) ? `<span class="tag low">¡Últimas!</span>` : "";
    return `<article class="prod ${out ? "out" : ""}" data-id="${p.id}" tabindex="0">
      <div class="img">${productImage(p, ci)}${tag}${low}</div>
      <div class="body">
        <div><h3>${p.nombre}</h3><small>${p.cat}</small>
          <div class="dots">${p.colores.map(c => `<i style="background:${c.tee}" title="${c.nombre}"></i>`).join("")}</div></div>
        <div class="price">${fmt(p.precio)}</div>
      </div>
    </article>`;
  }).join("");
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
  curSize = null;
  $("#mName").textContent = cur.nombre;
  $("#mPrice").textContent = fmt(cur.precio);
  $("#mDesc").textContent = cur.desc;
  drawModal();
  $("#overlay").classList.add("show");
}

function drawModal(){
  const c = cur.colores[curColor];
  $("#mImg").innerHTML = productImage(cur, curColor);
  $("#mColorName").textContent = c.nombre + (stockColor(cur, curColor) === 0 ? " (agotado)" : "");
  $("#mColors").innerHTML = cur.colores.map((col, i) =>
    `<button class="${i === curColor ? "on" : ""}" style="background:${col.tee}" title="${col.nombre}" aria-label="${col.nombre}" data-i="${i}"></button>`).join("");
  $$("#mColors button").forEach(b => b.onclick = () => { curColor = +b.dataset.i; curSize = null; drawModal(); });

  $("#mSizes").innerHTML = TALLES.map(t => {
    const d = disponible(cur, curColor, t);
    return `<button class="${t === curSize ? "on" : ""}" data-t="${t}" ${stockDe(cur, curColor, t) <= 0 ? "disabled title='Sin stock'" : ""}>${t}</button>`;
  }).join("");
  $$("#mSizes button").forEach(b => b.onclick = () => { curSize = b.dataset.t; drawModal(); });

  // Mensaje de stock y estado del botón
  const msg = $("#mStock"), add = $("#mAdd");
  msg.className = "stock-msg";
  add.disabled = false; add.textContent = "Agregar al carrito";
  if (stockTotal(cur) === 0) {
    msg.classList.add("out"); msg.textContent = "Este modelo está agotado por ahora.";
    add.disabled = true; add.textContent = "Agotada";
  } else if (stockColor(cur, curColor) === 0) {
    msg.classList.add("out"); msg.textContent = "Este color está agotado. Probá con otro 👆";
    add.disabled = true;
  } else if (!curSize) {
    msg.textContent = "Elegí tu talle";
  } else {
    const d = disponible(cur, curColor, curSize);
    if (d <= 0) { msg.classList.add("out"); msg.textContent = "Ya tenés en el carrito todas las unidades disponibles."; add.disabled = true; }
    else if (d <= CFG.pocasUnidades) { msg.classList.add("low"); msg.textContent = `¡Quedan solo ${d}!`; }
    else { msg.classList.add("ok"); msg.textContent = "✓ En stock"; }
  }

  // Link de consulta por talle
  $("#mAsk").onclick = e => {
    e.preventDefault();
    const m = `¡Hola ${CFG.marca}! Quería consultar por la remera ${cur.nombre} en color ${c.nombre}${curSize ? ", talle " + curSize : ""}. ¿Tienen o va a volver?`;
    abrirCanal("whatsapp", m);
  };
}

function closeModal(){ $("#overlay").classList.remove("show"); }
$("#mClose").onclick = closeModal;
$("#mGuide").onclick = closeModal;
$("#overlay").onclick = e => { if (e.target.id === "overlay") closeModal(); };
$("#mAdd").onclick = () => {
  if (!curSize) { $("#mStock").className = "stock-msg low"; $("#mStock").textContent = "Elegí un talle 👆"; return; }
  if (disponible(cur, curColor, curSize) <= 0) return;
  addToCart(cur, curColor, curSize);
  closeModal();
  toast("Agregado al carrito ✓");
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
  if (!c.ok()) { alert(`Demo: acá se abriría ${c.nombre} con este mensaje:\n\n${msg}\n\n(Configurar ${canal} en productos.js)`); return; }
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
$("#statN").textContent = PRODUCTOS.length;
$("#yr").textContent = new Date().getFullYear();
$("#heroA").innerHTML = swatchSVG("ondas", "#2f4bff", "#ffd23f");
$("#heroB").innerHTML = swatchSVG("cuadros", "#111", "#ff5a36");
$("#heroC").innerHTML = swatchSVG("circulos", "#fff", "#16a37f");
$("#aboutArt").innerHTML = swatchSVG("triangulos", "#ff5a36", "#111");
$("#soloStock").onchange = renderGrid;

ajustarCarrito();
prepararLinks();
renderFilters();
renderGrid();
renderCart();
