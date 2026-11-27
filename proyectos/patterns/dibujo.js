/* =========================================================
   PATTERNS · Dibujo de remeras de ejemplo (SVG)
   Se usa mientras un color no tenga foto real (campo img).
   Lo usa la tienda (app.js).
   ========================================================= */
let _uid = 0;

/* Logo de PATTERNS en vector (1794x404). Mismo dibujo que img/logo.svg */
const LOGO_D = "M1.0 370.0L1.0 337.0L338.8 336.8L676.6 336.5L625.8 217.0C597.9 151.3 575.0 97.2 575.0 96.7C575.0 96.3 592.6 96.1 614.2 96.2L653.3 96.5L704.3 216.8L755.3 337.0L1274.2 337.0L1793.0 337.0L1793.0 370.0L1793.0 403.0L897.0 403.0L1.0 403.0L1.0 370.0ZM1625.2 308.9C1595.6 307.0 1574.1 302.2 1557.5 293.6L1549.5 289.5L1542.4 282.5L1535.3 275.5L1531.7 268.0C1527.2 258.8 1525.2 251.1 1524.3 240.2L1523.7 232.0L1562.9 232.0L1602.1 232.0L1602.6 233.8C1604.7 240.8 1609.6 244.2 1621.2 246.6L1628.5 248.2L1657.0 248.7L1685.6 249.2L1696.0 248.1C1701.7 247.5 1708.0 246.2 1709.9 245.2C1716.3 242.0 1716.2 234.2 1709.6 231.5C1705.1 229.6 1689.7 228.3 1657.5 227.0C1590.6 224.4 1559.1 216.8 1541.4 199.2C1526.3 184.1 1522.5 155.8 1532.7 134.2L1535.3 128.5L1541.9 121.9C1555.7 108.2 1576.6 99.9 1609.5 95.4L1622.5 93.6L1655.0 93.6L1687.5 93.6L1700.5 95.4C1742.1 101.2 1766.6 114.2 1777.5 136.3C1781.3 144.1 1784.0 154.6 1784.0 162.2L1784.0 167.0L1745.1 167.0L1706.2 167.0L1705.0 164.0C1703.4 160.3 1700.5 158.4 1692.8 156.2L1686.5 154.5L1650.5 154.5L1614.5 154.5L1610.5 156.5L1606.5 158.5L1606.2 162.7L1605.9 166.9L1608.9 168.4L1611.8 170.0L1626.2 171.0C1634.1 171.5 1652.0 172.4 1666.0 173.0C1720.0 175.3 1745.6 179.4 1764.9 188.8L1772.5 192.5L1778.6 198.5C1788.9 208.6 1793.0 219.6 1793.0 237.3C1793.0 249.2 1790.9 259.1 1786.4 268.7L1783.0 275.8L1777.2 281.7C1767.5 291.6 1754.9 297.9 1735.3 302.9C1711.5 308.9 1665.1 311.5 1625.2 308.9ZM545.7 304.8C542.5 297.3 451.5 82.8 448.3 75.3L444.8 67.0L222.9 67.0L1.0 67.0L1.0 34.0L1.0 1.0L897.0 1.0L1793.0 1.0L1793.0 34.0L1793.0 67.0L1158.4 67.0L523.8 67.0L524.3 68.8C524.5 69.7 547.2 123.2 574.5 187.5C601.9 251.8 624.5 305.3 624.7 306.2L625.2 308.0L586.1 308.0L547.0 308.0L545.7 304.8ZM1.0 201.5L1.0 95.9L91.8 96.2L182.5 96.5L191.5 99.3C196.4 100.9 203.7 103.8 207.5 105.8L214.5 109.5L224.0 119.0L233.5 128.5L237.2 135.5C239.2 139.3 242.1 146.6 243.6 151.5L246.4 160.5L246.4 176.0L246.5 191.5L244.6 198.5C235.7 232.2 210.5 253.3 175.0 257.0C169.4 257.5 145.5 258.0 121.9 258.0L79.0 258.0L79.0 282.5L79.0 307.0L40.0 307.0L1.0 307.0L1.0 201.5ZM214.0 306.2C214.0 305.8 233.5 258.5 257.4 201.0L300.7 96.5L359.1 96.5L417.4 96.5L460.7 200.9C484.5 258.4 504.0 305.8 504.0 306.2C504.0 306.6 484.7 307.0 461.2 307.0L418.3 307.0L414.2 296.2C411.9 290.3 408.7 281.8 407.0 277.2L403.8 269.0L359.0 269.0L314.2 269.0L310.2 279.8C308.0 285.7 304.7 294.2 303.0 298.8L299.8 307.0L256.9 307.0C233.3 307.0 214.0 306.7 214.0 306.2ZM779.2 297.2C777.0 291.9 758.5 246.1 738.2 195.5C717.8 144.9 700.4 101.8 699.5 99.7L698.0 96.0L794.3 96.0L890.7 96.0L903.4 125.9C910.3 142.3 916.0 156.0 916.0 156.4C916.0 156.7 891.4 157.0 861.4 157.0L806.9 157.0L807.6 159.2C808.0 160.5 809.8 164.8 811.6 168.8L814.9 176.0L869.7 176.0L924.5 176.0L935.2 201.3L945.8 226.5L891.0 226.8L836.1 227.0L839.9 236.3L843.8 245.5L899.0 246.0L954.3 246.5L966.6 275.9C973.4 292.0 979.0 305.7 979.0 306.1C979.0 306.6 935.3 307.0 881.1 307.0L783.2 307.0L779.2 297.2ZM988.1 304.8C987.6 303.5 968.0 256.4 944.6 200.1C921.2 143.8 902.0 97.3 902.0 96.8C902.0 96.3 905.9 96.1 910.6 96.2L919.2 96.5L962.6 200.5C986.4 257.7 1006.2 305.1 1006.5 305.8L1006.9 307.0L997.9 307.0L989.0 307.0L988.1 304.8ZM972.7 202.2C948.6 144.6 929.0 97.2 929.0 96.8C929.0 96.3 932.9 96.0 937.8 96.0L946.5 96.0L989.7 199.8C1013.5 256.8 1033.2 304.3 1033.6 305.2L1034.2 307.0L1025.3 307.0L1016.4 307.0L972.7 202.2ZM1043.7 306.2C1043.3 305.6 958.1 101.8 956.3 97.2L955.8 95.9L1063.1 96.2L1170.5 96.5L1179.3 99.3C1190.7 102.8 1198.2 106.7 1206.1 113.0C1221.2 125.1 1230.8 142.0 1234.1 162.5L1235.3 170.1L1234.7 181.8L1234.1 193.5L1232.0 200.9C1226.8 219.2 1216.1 234.1 1200.2 245.0L1198.1 246.5L1216.5 276.3C1226.7 292.7 1235.0 306.4 1235.0 306.6C1235.0 306.8 1214.2 307.0 1188.7 307.0L1142.3 307.0L1127.9 282.5L1113.5 258.0L1090.2 258.0L1067.0 258.0L1067.0 282.5L1067.0 307.0L1055.6 307.0C1049.3 307.0 1043.9 306.7 1043.7 306.2ZM1244.0 201.5L1244.0 96.0L1295.2 96.0L1346.5 96.0L1391.5 157.6L1436.5 219.2L1436.8 157.6L1437.0 96.0L1476.0 96.0L1515.0 96.0L1515.0 201.5L1515.0 307.0L1463.8 306.8L1412.7 306.5L1368.8 246.5C1344.7 213.5 1324.3 185.8 1323.5 185.0L1322.0 183.6L1322.0 245.3L1322.0 307.0L1283.0 307.0L1244.0 307.0L1244.0 201.5ZM381.2 209.2C380.2 206.6 374.9 192.7 369.5 178.2C364.0 163.8 359.3 152.0 359.0 152.0C358.7 152.0 354.2 163.4 349.0 177.2C343.8 191.1 338.5 205.0 337.3 208.2L335.1 214.0L359.0 214.0L383.0 214.0L381.2 209.2ZM161.5 189.6C163.3 188.8 165.6 187.0 166.5 185.6L168.2 183.1L168.2 177.6C168.3 170.6 166.5 166.3 162.9 164.5L160.1 163.0L119.5 163.0L79.0 163.0L79.0 177.0L79.0 191.0L118.5 191.0L158.1 191.0L161.5 189.6ZM1149.5 189.6C1154.1 187.6 1156.2 184.0 1156.4 177.7C1156.5 171.2 1154.5 166.3 1150.9 164.5L1148.1 163.0L1107.5 163.0L1067.0 163.0L1067.0 177.0L1067.0 191.0L1106.5 191.0L1146.1 191.0L1149.5 189.6Z";
const logoEn = (x, y, ancho, color) => `<g transform="translate(${x - ancho/2} ${y}) scale(${ancho/1794})"><path fill="${color}" fill-rule="evenodd" d="${LOGO_D}"/></g>`;

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
    ${logoEn(150, 204, 62, ink)}
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
    ${logoEn(150, 78, 44, ink)}
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
