# Bosdandjian Rodríguez · propuesta de mejora

Maqueta de la web **bosdandjianrodriguez.com.uy** con mejoras aplicadas, para que el estudio la vea y, si le gusta, se implemente en la web oficial.

- Es una **copia de su web** (diseño y código originales) con los cambios encima. No reemplaza la oficial.
- Está marcada **`noindex, nofollow`**: Google no la muestra, así no compite con la web real. Además, la dirección "oficial" para Google (`canonical`) sigue siendo la del estudio.
- Se **sacó Google Analytics**, para que las visitas a la maqueta no se mezclen con sus estadísticas.
- Cinco fotos de las galerías no se pudieron descargar de su servidor y no están en la maqueta (siguen en la web oficial).

## Qué cambió

| # | Cambio | Dónde |
|---|---|---|
| 1 | Imágenes livianas, en WebP y ordenadas en carpetas con nombres claros | `img/` |
| 2 | Ícono de la pestaña con el monograma BR (el logo completo dice "Bosdan**j**ian", le falta la "d", y "Rodriguez" y "JURIDICO" van sin tilde) | `img/marca/` |
| 3 | Reseñas sin fechas fijas ("Hace 4 horas" escrito a mano); listas para mostrar la fecha real desde Google | `index.html`, `js/mejoras.js`, `resenas.php` |
| 4 | La reseña del mismo apellido del estudio pasa al final del carrusel | `index.html` |
| 5 | Contacto completo: dirección, horario, teléfono para llamar y mail. **Lo punteado lo completa el estudio** | `index.html` |
| 6 | Cifras concretas: "5,0 ★ en Google" y "19 reseñas" en lugar de "Cobertura" y "100% Respaldo" | `index.html` |
| 7 | Nombres del equipo con el mismo formato: "Dr. Andrés Bosdandjian" y "Dra. Paula Rodríguez" (**confirmar el nombre de él**: lo tomamos de las reseñas) | `index.html` |
| 8 | Propiedades disponibles arriba; las alquiladas o reservadas en una franja chica de "Operaciones recientes" | `index.html`, `css/mejoras.css` |
| 9 | Cada propiedad con su propio link (`#casa-buceo`, `#terreno-av-italia`, `#casa-playa-hermosa`) y botón "Compartir" | `js/mejoras.js` |
| 10 | En el celular, propiedades en carrusel con puntos: la sección pasa de unos 4.100 a 2.000 px | `css/mejoras.css` |
| 11 | Menú sin opciones partidas en dos renglones y portada con menos espacio vacío arriba | `css/mejoras.css` |

Los cambios de diseño y las funciones nuevas están en **archivos aparte** (`css/mejoras.css` y `js/mejoras.js`), así se ve fácil qué se agregó. La parte de "Ver qué cambió" y la cinta de abajo son solo de la maqueta: no van en la web oficial.

## Imágenes: antes y después

| Archivo nuevo | Uso | Antes | Después |
|---|---|---|---|
| `img/marca/monograma.webp` | Logo del menú y del pie | 2.096 KB | 15 KB |
| `img/portada/estudio-1100.webp` | Foto principal | 1.577 KB | 44 KB |
| `img/compartir/compartir.jpg` | Imagen al compartir el link (1200 × 630) | 1.577 KB | 61 KB |
| `img/equipo/paula-rodriguez-1400.webp` | Foto del equipo | 5.518 KB | 97 KB |
| `img/inmuebles/` (55 fotos) | Fotos de las propiedades | 10.070 KB | 7.034 KB |

Nueva organización:

```
img/
  marca/       monograma.webp, icono-64.png, icono-180.png
  portada/     estudio-700.webp, estudio-1100.webp
  compartir/   compartir.jpg
  equipo/      andres-bosdandjian-700.webp, paula-rodriguez-700.webp, paula-rodriguez-1400.webp
  inmuebles/
    casa-buceo/          portada.webp, 01.webp … 12.webp
    apto-barrio-sur/     portada.webp, 01.webp … 10.webp
    casa-tres-cruces/    portada.webp, 01.webp …          (antes "apt-tres-cruces": era una casa)
    terreno-av-italia/   portada.webp, 01.webp …          (antes "terreno-tres-cruces": está cerca de Av. Italia)
    casa-playa-hermosa/  portada.webp, 01.webp … 13.webp
```

## Reseñas con fecha real (para implementar)

Google Maps no muestra la fecha exacta de las reseñas ("hace 2 años"). La fecha exacta solo la da la **API de Google Places**. `resenas.php` ya está listo:

1. En Google Cloud: crear un proyecto, activar **Places API (New)** y crear una clave restringida a esa API.
2. Buscar el **Place ID** del estudio: https://developers.google.com/maps/documentation/places/web-service/place-id
3. Guardar la clave y el Place ID **fuera de la carpeta pública**, en `../resenas-config.php`:
   ```php
   <?php return ['key' => 'LA_CLAVE', 'place_id' => 'EL_PLACE_ID'];
   ```
   (o en las variables de entorno `GOOGLE_PLACES_KEY` y `GOOGLE_PLACE_ID`).
4. Subir `resenas.php` junto a `index.html`. La web lo detecta sola y muestra el promedio, el total y las reseñas con su fecha ("marzo de 2025").

- Consulta a Google como máximo **una vez por día** y guarda una copia (`resenas-cache.json`), así no se gasta cuota.
- Google entrega **hasta 5 reseñas** (las más relevantes). El resto sigue igual, sin fecha, y está el botón "Ver en Google".
- Si algo falla, la web sigue mostrando las reseñas fijas.
