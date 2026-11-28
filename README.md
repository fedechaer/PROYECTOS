# PROYECTOS

Webs demo para negocios de barrio (Malvín, Montevideo) que no tienen presencia en Google.

## Estructura

```
├── index.html            ← portada: proyectos y los primeros ejemplos
├── webs.html             ← todas las webs, con filtro por rubro
├── webs.js               ← lista de webs (la usan las dos páginas)
├── estilos.css           ← estilos compartidos de la portada y webs.html
└── proyectos/
    ├── patterns/               ⭐ Marca propia: tienda de remeras con carrito a WhatsApp
    ├── colab-dental/           Laboratorio dental: servicios y canal de contacto (portfolio)
    ├── peluqueria-kn/        Peluquería k&n (Malvín Norte)
    ├── soberbia-peluqueria/  Soberbia Peluquería (Rimac 1617)
    ├── decano-malvin/          Decano, bar/parrilla/pizzería (Orinoco y Michigan)
    ├── barber-shop-malvin/     Barber Shop Malvín (Hipólito Yrigoyen 1609)
    ├── la-rotiseria-de-malvin/ Rotisería con carrito → pedido por WhatsApp
    ├── la-redonda-malvin/      Restaurante/parrilla con indicador "Abierto ahora"
    ├── la-fabrica-malvin/      Patio cervecero con formulario de reserva
    ├── barraca-malvin/         Barraca/ferretería con pedido de presupuesto
    └── panaderia-nueva-malvin/ Panadería con encargos
```

### Número de WhatsApp

Las webs con formularios o carrito tienen al principio del `<script>` una constante:

```js
const WHATSAPP = ""; // 598 + número sin el 0, ej: "59899123456"
```

Mientras esté vacía, la demo muestra un aviso con el mensaje que se enviaría.

Cada carpeta es una web independiente (un solo `index.html`, sin dependencias), así se puede entregar o publicar por separado.

## Ver las demos online

Activar **GitHub Pages**: Settings → Pages → Source: *Deploy from a branch* → `main` / root.
Queda en `https://fedechaer.github.io/proyectos/`.

## Agregar un proyecto nuevo

1. Crear `proyectos/<nombre-negocio>/index.html`.
2. Agregarlo a la lista `PROYECTOS` (o `EJEMPLOS`) de `webs.js`, con su `rubro`.
3. Regenerar las capturas (ver abajo).

## Pendiente por cliente

Los datos marcados `[A confirmar con el cliente]` (horarios, precios, carta) hay que completarlos con el negocio antes de entregar.

## Capturas de la portada

La portada muestra una captura de cada web, sacada de `previews/<carpeta>.jpg`.
Si cambiás una web o agregás una nueva, regenerá las capturas con:

```bash
node herramientas/generar-previews.js
```

(Necesita Node y Playwright: `npm i -D playwright && npx playwright install chromium`.)
Después sumá el proyecto a la lista `PROYECTOS` (o `EJEMPLOS`) de `webs.js`. La portada muestra los primeros 6 ejemplos (`EN_PORTADA`) y `webs.html` muestra todos.

## Portada pública y ejemplos

- `index.html`: página de Federico ("Webs para emprendimientos"), para mandar a interesados.
  Muestra PATTERNS, Colab Dental y los ejemplos por rubro.
- `ejemplos/<rubro>/`: sitios de ejemplo con **nombres inventados** (viandas, panadería, peluquería,
  barbería, restaurante, cervecería). Se generan a partir de las demos, con una cinta de "Sitio de ejemplo".
- `prospectos.html`: página **interna** con las demos hechas con datos de negocios reales.
  No está enlazada desde la portada; no compartirla.
