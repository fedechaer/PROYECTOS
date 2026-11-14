# PROYECTOS

Webs demo para negocios de barrio (Malvín, Montevideo) que no tienen presencia en Google.

## Estructura

```
├── index.html            ← portada con links a todas las demos
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
2. Agregarlo a la lista `PROYECTOS` del `index.html` de la raíz.
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
Después sumá el proyecto a la lista `PROYECTOS` del `index.html` de la raíz.
