# PATTERNS · Tienda de remeras

## De dónde salen los datos

Los productos, los precios, el stock y los datos de contacto se leen de la planilla de Google
**"PATTERNS - Stock"**. La web la lee cada vez que alguien entra, así que lo que cambies
en la planilla se ve en la tienda en uno o dos minutos. No hay que subir nada a GitHub.

**Requisito:** la planilla tiene que estar compartida como
*Cualquier persona con el enlace → Lector* (Compartir → Acceso general).
Si no lo está, la tienda muestra "No pudimos cargar la colección".

### Pestaña Productos
Una fila por cada modelo y color.

| Columna | Qué va |
|---|---|
| `id` | Identificador del modelo, sin espacios. Todas las filas de un modelo llevan el mismo |
| `modelo`, `precio`, `categoria`, `etiqueta`, `descripcion`, `patron` | Se toman de la primera fila de cada modelo |
| `color` | Nombre del color (Blanco, Negro...) |
| `color_remera`, `color_estampa` | Colores `#RRGGBB` para la remera dibujada |
| `foto` | Ruta de la foto real, ej: `img/ondas-blanco.jpg`. Vacío = remera dibujada |
| `S`, `M`, `L`, `XL`, `XXL` | Stock de cada talle. Para sumar un talle, insertá una columna antes de `total` |
| `total` | Se calcula solo. La web no la usa |

### Pestaña Contacto
`whatsapp` (598 + número sin el 0), `instagram` (usuario sin @), `email` y `pocas_unidades`
(desde cuántas unidades por talle se avisa "¡Quedan solo N!").

> No cambies los nombres de las pestañas ni los encabezados de la fila 1: la web los usa para encontrar los datos.

## Archivos

| Archivo | Para qué sirve |
|---|---|
| `index.html` | La tienda (estructura de la página) |
| `estilos.css` | El diseño. Los colores de la marca están arriba, en `:root` |
| `config.js` | ID de la planilla y textos fijos (moneda, frases de la barra de promo) |
| `datos.js` | Lee la planilla y la convierte en productos |
| `app.js` | Catálogo, stock, carrito y envío de pedidos |
| `dibujo.js` | Dibuja las remeras de ejemplo mientras no haya fotos |
| `demo.js` | Datos de ejemplo, solo si `config.js` no tiene planilla |
| `img/` | Fotos reales de las remeras |

## Cómo funciona el stock en la tienda

- Los talles sin stock aparecen tachados y no se pueden elegir.
- Con pocas unidades avisa "¡Quedan solo N!".
- El carrito no deja agregar más unidades de las que hay.
- Los modelos agotados van al final, en gris, y hay un filtro "Solo con stock".
- Si el stock baja y alguien tenía más unidades en el carrito, se ajusta solo.

> El stock **no se descuenta solo** cuando alguien manda un pedido. Cuando cerrás una venta,
> restá las unidades en la planilla.

## Power BI

Podés conectar Power BI directo a la planilla (Obtener datos → Web) con esta URL:

```
https://docs.google.com/spreadsheets/d/1IS-ib6t60ZBEBRZPOj0tgwarbJBM8ogt9qA2NVM9nnE/gviz/tq?tqx=out:csv&sheet=Productos
```
