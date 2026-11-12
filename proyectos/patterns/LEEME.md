# PATTERNS · Tienda de remeras

## Archivos

| Archivo | Para qué sirve |
|---|---|
| `index.html` | La tienda (estructura de la página) |
| `estilos.css` | El diseño. Los colores de la marca están arriba, en `:root` |
| `app.js` | La lógica: catálogo, stock, carrito y envío de pedidos |
| `dibujo.js` | Dibuja las remeras de ejemplo mientras no haya fotos |
| `productos.js` | **Los datos**: contacto, modelos, precios, colores y stock |
| `inventario.html` | **Panel para gestionar el stock** sin tocar código |
| `img/` | Fotos reales de las remeras |

## Gestionar el stock

1. Abrí `inventario.html` (en la web: `.../proyectos/patterns/inventario.html`).
2. Cambiá stock, precios o modelos, o usá **Registrar una venta** para descontar unidades.
3. Tocá **Descargar productos.js** y subilo a GitHub, en la carpeta `proyectos/patterns`, reemplazando el anterior.

Los cambios quedan guardados en tu navegador hasta que los publiques.
**Exportar CSV** baja el stock en formato tabla, listo para Excel o Power BI.

## Cómo funciona el stock en la tienda

- Los talles sin stock aparecen tachados y no se pueden elegir.
- Con pocas unidades avisa "¡Quedan solo N!". El umbral se configura en el inventario.
- El carrito no deja agregar más unidades de las que hay.
- Los modelos agotados van al final, en gris, y hay un filtro "Solo con stock".
- Si el stock baja y alguien tenía más unidades en el carrito, se ajusta solo.

> El stock **no se descuenta solo** cuando alguien manda un pedido, porque no hay servidor.
> Cuando cerrás una venta, la registrás en el inventario.

## Contacto

En el inventario, sección **Datos de contacto** (o en `productos.js` → `config`):

- `whatsapp`: 598 + número sin el 0, por ejemplo `59899123456`
- `instagram`: el usuario, sin @
- `email`: el correo

Mientras estén vacíos, los botones muestran un aviso de demo.
El pedido por Instagram copia el mensaje y abre el chat, porque Instagram no deja precargar el texto.
