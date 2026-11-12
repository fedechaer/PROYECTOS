/* =========================================================
   PATTERNS · Dibujo de remeras de ejemplo (SVG)
   Se usa mientras un color no tenga foto real (campo img).
   Lo comparten la tienda (app.js) y el inventario.
   ========================================================= */
let _uid = 0;

function patternDef(id, tipo, ink, bg){
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

/* Imagen de un producto en un color: foto real si hay, si no la remera dibujada */
function productImage(p, ci=0){
  const c = p.colores[ci];
  if(c.img){
    return `<img src="${c.img}" alt="Remera ${p.nombre} ${c.nombre}" loading="lazy"
      onerror="this.outerHTML=teeSVG('${p.patron}','${c.tee}','${c.tinta}')">`;
  }
  return teeSVG(p.patron, c.tee, c.tinta);
}
