# PATTERNS · Tienda de remeras

## De dónde salen los datos

Todo vive en la planilla de Google **"PATTERNS - Stock"**:

| Pestaña | Qué tiene | ¿La lee la web? |
|---|---|---|
| **Productos** | Catálogo, precios y stock por talle (el stock se calcula solo: Inventario − Ventas) | ✅ Sí (publicada) |
| **Contacto** | WhatsApp, Instagram, correo y umbral de "pocas unidades" | ✅ Sí (publicada) |
| **Inventario** | Ingresos de mercadería y ajustes | ❌ Privada |
| **Ventas** | Cada venta: fecha, cliente, modelo, color, talle, cantidad, precio | ❌ Privada |
| **Clientes** | Datos del cliente + compras, productos, total gastado y última compra (automáticos) | ❌ Privada |

**La planilla NO se comparte por enlace**, porque tiene datos personales de clientes.
La web lee solo Productos y Contacto, publicadas desde
*Archivo → Compartir → Publicar en la Web*. El link publicado va en `config.js` → `publicado`.
Google actualiza lo publicado cada pocos minutos.

Mientras `publicado` esté vacío, la web muestra los datos de ejemplo de `demo.js`.

### El día a día
- **Entra mercadería:** fila nueva en *Inventario*.
- **Vendés:** fila nueva en *Ventas*. El stock de la web baja solo.
- **Cliente nuevo:** fila nueva en *Clientes* (antes de cargar su venta).
- Instrucciones completas en la pestaña *Cómo usar* de la planilla.

## Archivos

| Archivo | Para qué sirve |
|---|---|
| `index.html` | La tienda (estructura de la página) |
| `estilos.css` | El diseño. Los colores de la marca están arriba, en `:root` |
| `config.js` | Link publicado de la planilla y textos fijos (moneda, frases de la barra de promo) |
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

> El stock se descuenta cuando **cargás la venta** en la pestaña Ventas, no cuando
> alguien manda un pedido por WhatsApp (ese pedido todavía no es una venta confirmada).

## Power BI

Como la planilla es privada, conectala con el conector **Google Sheets** de Power BI
(Obtener datos → Google Sheets) usando el link de la planilla e iniciando sesión con tu cuenta.
Ventas y Clientes ya están en formato tabla, listas para modelar.
