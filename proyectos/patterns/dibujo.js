/* =========================================================
   PATTERNS · Dibujo de remeras de ejemplo (SVG)
   Se usa mientras un color no tenga foto real (campo img).
   Lo usa la tienda (app.js).
   ========================================================= */
let _uid = 0;

const SINONIMOS = {serpiente:"vibora", snake:"vibora", leopard:"leopardo", zebra:"cebra", tiger:"tigre", giraffe:"jirafa", cow:"vaca"};

function patternDef(id, tipo, ink, bg){
  tipo = String(tipo || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
  tipo = SINONIMOS[tipo] || tipo;
  const P = (w,h,inner,extra="") => `<pattern id="${id}" width="${w}" height="${h}" patternUnits="userSpaceOnUse" ${extra}><rect width="${w}" height="${h}" fill="${bg}"/>${inner}</pattern>`;
  switch(tipo){
    case "rayas":      return P(12,12,`<rect width="6" height="12" fill="${ink}"/>`,'patternTransform="rotate(45)"');
    case "puntos":     return P(14,14,`<circle cx="7" cy="7" r="3.2" fill="${ink}"/>`);
    case "ondas":      return P(28,14,`<path d="M0 7 Q7 0 14 7 T28 7" fill="none" stroke="${ink}" stroke-width="3"/>`);
    case "cuadros":    return P(20,20,`<rect width="10" height="10" fill="${ink}"/><rect x="10" y="10" width="10" height="10" fill="${ink}"/>`);
    case "triangulos": return P(20,18,`<path d="M0 18 L10 0 L20 18Z" fill="${ink}"/>`);
    case "zigzag":     return P(20,12,`<path d="M0 10 L5 2 L10 10 L15 2 L20 10" fill="none" stroke="${ink}" stroke-width="3"/>`);
    case "grilla":     return P(12,12,`<path d="M12 0V12M0 12H12" stroke="${ink}" stroke-width="1.2"/>`);
    case "circulos":   return P(40,40,`<circle cx="20" cy="20" r="16" fill="none" stroke="${ink}" stroke-width="3"/><circle cx="20" cy="20" r="8" fill="none" stroke="${ink}" stroke-width="3"/>`);
    /* ---- Pieles animales (drop 01) ---- */
    case "leopardo": {
      const ros = (x,y,r) => `<ellipse cx="${x}" cy="${y}" rx="${r*.55}" ry="${r*.45}" fill="${ink}" opacity=".35"/>` +
        [0,70,140,215,290].map((a,i) => { const t=a*Math.PI/180; return `<ellipse cx="${(x+Math.cos(t)*r).toFixed(1)}" cy="${(y+Math.sin(t)*r).toFixed(1)}" rx="${(1.7+i%2*.7).toFixed(1)}" ry="3" transform="rotate(${a} ${(x+Math.cos(t)*r).toFixed(1)} ${(y+Math.sin(t)*r).toFixed(1)})" fill="${ink}"/>`; }).join("");
      return P(48,48, ros(12,12,7) + ros(35,24,6.5) + ros(15,37,6) + `<circle cx="32" cy="6" r="1.8" fill="${ink}"/><circle cx="42" cy="42" r="2.2" fill="${ink}"/><circle cx="27" cy="40" r="1.4" fill="${ink}"/>`);
    }
    case "cebra":
      return P(36,60, [3,21].map(x => `<path d="M${x} 0 Q${x+9} 7.5 ${x} 15 T${x} 30 T${x} 45 T${x} 60" fill="none" stroke="${ink}" stroke-width="8"/>`).join(""), 'patternTransform="rotate(-18)"');
    case "tigre":
      return P(40,26, `<path d="M0 3 Q14 6 24 11 Q13 10 0 13Z" fill="${ink}"/><path d="M40 14 Q25 16 15 23 Q27 21 40 24Z" fill="${ink}"/><path d="M0 16 Q7 18 11 20 Q6 20 0 21Z" fill="${ink}"/>`);
    case "jirafa":
      return P(40,40, `<path d="M3 3 L18 2 L20 16 L5 18Z M24 2 L38 5 L37 19 L23 17Z M3 23 L19 21 L21 37 L2 37Z M25 22 L38 24 L38 38 L24 36Z" fill="${ink}" stroke="${ink}" stroke-width="2" stroke-linejoin="round"/>`);
    case "vaca":
      return P(60,60, `<path d="M8 10 C14 2 28 6 26 16 C24 26 10 26 8 20 C4 16 4 14 8 10Z M36 34 C46 28 58 36 54 46 C50 56 36 54 34 46 C32 40 32 38 36 34Z M44 6 C50 4 54 10 50 14 C46 16 42 12 44 6Z M10 42 C14 40 18 44 15 48 C12 50 8 46 10 42Z" fill="${ink}"/>`);
    case "vibora":
      return P(16,12, `<path d="M0 12 Q8 0 16 12 M-8 6 Q0 -6 8 6 M8 6 Q16 -6 24 6" fill="none" stroke="${ink}" stroke-width="1.6"/><path d="M4 9 Q8 5 12 9" fill="none" stroke="${ink}" stroke-width="1" opacity=".5"/>`);
    default:           return P(10,10,"");
  }
}

function isDark(hex){
  const n = parseInt((hex||"#ffffff").slice(1),16);
  return ((n>>16)*299 + ((n>>8)&255)*587 + (n&255)*114)/1000 < 110;
}

function teeSVG(tipo, tee, ink){
  const id = "p"+(_uid++);
  const dark = isDark(tee);
  const bgCard = dark ? "#ece9e3" : "#e9e6df";
  return `<svg viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Remera ${tipo}">
    <defs>${patternDef(id,tipo,ink,tee)}</defs>
    <rect width="300" height="300" fill="${bgCard}"/>
    <ellipse cx="150" cy="272" rx="95" ry="10" fill="rgba(0,0,0,.08)"/>
    <path d="M108 44 L68 58 L28 98 L58 130 L82 114 L82 262 L218 262 L218 114 L242 130 L272 98 L232 58 L192 44 Q150 78 108 44Z"
          fill="${tee}" stroke="${dark?'#000':'rgba(0,0,0,.18)'}" stroke-width="1.5" stroke-linejoin="round"/>
    <path d="M108 44 Q150 78 192 44" fill="none" stroke="${dark?'rgba(255,255,255,.18)':'rgba(0,0,0,.18)'}" stroke-width="3"/>
    <rect x="112" y="108" width="76" height="86" rx="8" fill="url(#${id})"/>
    <text x="150" y="216" text-anchor="middle" font-family="Unbounded,sans-serif" font-weight="800" font-size="9" fill="${ink}" letter-spacing="2">PATTERNS</text>
  </svg>`;
}

function swatchSVG(tipo, ink, bg){
  const id = "s"+(_uid++);
  return `<svg viewBox="0 0 200 200" preserveAspectRatio="xMidYMid slice"><defs>${patternDef(id,tipo,ink,bg)}</defs><rect width="200" height="200" fill="url(#${id})"/></svg>`;
}

/* Espalda de la remera: cuello más alto y un logo chico arriba */
function teeBackSVG(tipo, tee, ink){
  const id = "p"+(_uid++);
  const dark = isDark(tee);
  return `<svg viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Espalda de la remera">
    <defs>${patternDef(id,tipo,ink,tee)}</defs>
    <rect width="300" height="300" fill="${dark ? "#ece9e3" : "#e9e6df"}"/>
    <ellipse cx="150" cy="272" rx="95" ry="10" fill="rgba(0,0,0,.08)"/>
    <path d="M108 44 L68 58 L28 98 L58 130 L82 114 L82 262 L218 262 L218 114 L242 130 L272 98 L232 58 L192 44 Q150 54 108 44Z"
          fill="${tee}" stroke="${dark?'#000':'rgba(0,0,0,.18)'}" stroke-width="1.5" stroke-linejoin="round"/>
    <path d="M108 44 Q150 54 192 44" fill="none" stroke="${dark?'rgba(255,255,255,.18)':'rgba(0,0,0,.18)'}" stroke-width="3"/>
    <rect x="136" y="66" width="28" height="20" rx="4" fill="url(#${id})"/>
    <text x="150" y="98" text-anchor="middle" font-family="Unbounded,sans-serif" font-weight="800" font-size="6" fill="${ink}" letter-spacing="1.5">PATTERNS</text>
  </svg>`;
}

/* Fotos de un color: la columna "foto" admite varios links separados por | */
const fotosDe = c => String(c.img || "").split(/\s*[|\n]\s*/).filter(Boolean);

/* Vistas para la galería de la ficha: fotos reales o, si no hay, frente, espalda y detalle dibujados */
function vistasProducto(p, ci=0){
  const c = p.colores[ci], fotos = fotosDe(c);
  if (fotos.length) return fotos.map((src, i) => ({
    t: `Foto ${i+1}`,
    html: `<img src="${src}" alt="Remera ${p.nombre} ${c.nombre}, foto ${i+1}" ${i ? 'loading="lazy"' : ""} onerror="this.outerHTML=teeSVG('${p.patron}','${c.tee}','${c.tinta}')">`
  }));
  return [
    { t: "Frente",  html: teeSVG(p.patron, c.tee, c.tinta) },
    { t: "Espalda", html: teeBackSVG(p.patron, c.tee, c.tinta) },
    { t: "Estampa", html: swatchSVG(p.patron, c.tinta, c.tee) }
  ];
}

/* Imagen de un producto en un color: primera foto real si hay, si no la remera dibujada */
function productImage(p, ci=0){
  const c = p.colores[ci], foto = fotosDe(c)[0];
  if(foto){
    return `<img src="${foto}" alt="Remera ${p.nombre} ${c.nombre}" loading="lazy"
      onerror="this.outerHTML=teeSVG('${p.patron}','${c.tee}','${c.tinta}')">`;
  }
  return teeSVG(p.patron, c.tee, c.tinta);
}
