/* =========================================================
   Mejoras propuestas (se carga después de main.js)
   1. Cada propiedad con su propio link y botón "Compartir"
   2. Carrusel de propiedades en el celular, con puntos
   3. Reseñas con fecha real desde Google (si está resenas.php)
   4. Aviso de propuesta y lista de cambios (solo en la maqueta)
   ========================================================= */
(function () {
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];

  function toast(t) {
    let el = $(".prop-toast");
    if (!el) { el = document.createElement("div"); el.className = "prop-toast"; el.setAttribute("role", "status"); document.body.appendChild(el); }
    el.textContent = t; el.classList.add("on");
    clearTimeout(el._t); el._t = setTimeout(() => el.classList.remove("on"), 2200);
  }

  /* ---------- 1. Link propio por propiedad ---------- */
  const cards = $$("article[data-slug]");
  cards.forEach(card => {
    const body = $(".inmueble-body", card);
    if (!body) return;
    const b = document.createElement("button");
    b.type = "button"; b.className = "inm-share";
    b.innerHTML = '<i class="bi bi-share" aria-hidden="true"></i> Compartir esta propiedad';
    b.onclick = async () => {
      const url = location.href.split("#")[0] + "#" + card.dataset.slug;
      const titulo = ($("h3", card) || {}).textContent || "Propiedad";
      if (navigator.share) { try { await navigator.share({ title: titulo, url }); return; } catch (e) { if (e.name === "AbortError") return; } }
      try { await navigator.clipboard.writeText(url); toast("Link copiado ✓"); }
      catch (e) { window.open("https://wa.me/?text=" + encodeURIComponent(titulo + " " + url), "_blank"); }
    };
    body.appendChild(b);
  });

  function irAPropiedad() {
    const slug = decodeURIComponent(location.hash.slice(1));
    const card = cards.find(c => c.dataset.slug === slug);
    if (!card) return;
    card.classList.add("visible", "is-visible", "in-view", "revealed", "destacado");
    const grid = card.parentElement;
    if (grid.scrollWidth > grid.clientWidth) grid.scrollTo({ left: card.offsetLeft - (grid.clientWidth - card.clientWidth) / 2, behavior: "smooth" });
    card.scrollIntoView({ behavior: "smooth", block: "center" });
    setTimeout(() => card.classList.remove("destacado"), 3500);
  }
  window.addEventListener("hashchange", irAPropiedad);
  if (location.hash) setTimeout(irAPropiedad, 400);

  /* ---------- 2. Puntos del carrusel en el celular ---------- */
  const grid = $(".inmuebles-grid");
  if (grid) {
    const items = $$(":scope > .inmueble-card", grid);
    const dots = document.createElement("div");
    dots.className = "inm-dots"; dots.setAttribute("aria-label", "Propiedades");
    dots.innerHTML = items.map((_, i) => `<button type="button" aria-label="Propiedad ${i + 1}"></button>`).join("");
    grid.after(dots);
    const marcar = () => {
      const centro = grid.scrollLeft + grid.clientWidth / 2;
      let k = 0, mejor = Infinity;
      items.forEach((c, i) => { const d = Math.abs(c.offsetLeft + c.clientWidth / 2 - centro); if (d < mejor) { mejor = d; k = i; } });
      $$("button", dots).forEach((b, i) => b.classList.toggle("on", i === k));
    };
    $$("button", dots).forEach((b, i) => b.onclick = () => grid.scrollTo({ left: items[i].offsetLeft - (grid.clientWidth - items[i].clientWidth) / 2, behavior: "smooth" }));
    grid.addEventListener("scroll", () => requestAnimationFrame(marcar), { passive: true });
    marcar();
  }

  /* ---------- 3. Reseñas con fecha real (Google Places, vía resenas.php) ---------- */
  const track = $("[data-resenas]");
  if (track && location.protocol.startsWith("http")) {
    fetch(track.dataset.resenas, { cache: "no-store" })
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(d => {
        if (!d || !Array.isArray(d.reviews) || !d.reviews.length) return;
        const fmt = iso => new Date(iso).toLocaleDateString("es-UY", { month: "long", year: "numeric" });
        $$(".test-card", track).slice(0, d.reviews.length).forEach((card, i) => {
          const r = d.reviews[i];
          $(".test-card-text", card).textContent = "“" + r.texto + "”";
          $(".test-card-name", card).textContent = r.autor;
          $(".test-card-avatar", card).textContent = (r.autor || "?").trim().charAt(0).toUpperCase();
          $(".test-card-date", card).textContent = (r.fecha ? fmt(r.fecha) + " · " : "") + "Google";
        });
        if (d.rating) $$(".test-badge-score").forEach(e => e.textContent = String(d.rating).replace(".", ","));
        if (d.total) $$(".test-badge-count").forEach(e => e.textContent = d.total + " reseñas de clientes en Google");
      })
      .catch(() => { /* sin API: quedan las reseñas fijas, sin fecha */ });
  }

  /* ---------- 4. Aviso de propuesta (solo maqueta) ---------- */
  const CAMBIOS = [
    "Imágenes livianas y ordenadas en carpetas (marca, portada, equipo, inmuebles, compartir): la página pesa mucho menos.",
    "Ícono de la pestaña con el monograma BR (el logo completo tenía \"Bosdanjian\" sin la d).",
    "Reseñas sin fechas fijas inventadas; listas para mostrar la fecha real desde Google.",
    "La reseña del mismo apellido pasa al final del carrusel.",
    "Contacto completo: dirección, horario, teléfono para llamar y mail (lo punteado lo completan ustedes).",
    "Cifras concretas: 5,0 en Google y 19 reseñas, en lugar de \"Cobertura\" y \"100% Respaldo\".",
    "Nombres del equipo con el mismo formato.",
    "Propiedades disponibles arriba y las cerradas en \"Operaciones recientes\", más chicas.",
    "Cada propiedad con su propio link y botón para compartir.",
    "En el celular, propiedades en carrusel: la página queda bastante más corta.",
    "Menú sin opciones partidas en dos renglones y portada sin espacio vacío arriba."
  ];
  const cinta = document.createElement("a");
  cinta.className = "prop-cinta"; cinta.href = "../../"; cinta.textContent = "Propuesta de mejora · Federico Chaer ↗";
  const btn = document.createElement("button");
  btn.type = "button"; btn.className = "prop-btn"; btn.textContent = "✨ Ver qué cambió"; btn.setAttribute("aria-expanded", "false");
  const panel = document.createElement("div");
  panel.className = "prop-panel"; panel.hidden = true; panel.setAttribute("role", "dialog"); panel.setAttribute("aria-label", "Cambios propuestos");
  panel.innerHTML = '<button type="button" class="x" aria-label="Cerrar">✕</button><h4>Qué cambió en esta versión</h4><ol>' +
    CAMBIOS.map(c => "<li></li>").join("") + "</ol><small>Es una maqueta para mostrar: no está indexada en Google ni reemplaza la web oficial.</small>";
  $$("li", panel).forEach((li, i) => li.textContent = CAMBIOS[i]);
  const abrir = v => { panel.hidden = !v; btn.setAttribute("aria-expanded", String(v)); };
  btn.onclick = () => abrir(panel.hidden);
  $(".x", panel).onclick = () => abrir(false);
  document.addEventListener("keydown", e => { if (e.key === "Escape") abrir(false); });
  document.body.append(cinta, btn, panel);
})();
