# Bosdandjian Rodríguez · propuesta de web nueva

Web nueva para **Bosdandjian Rodríguez, Estudio Jurídico Notarial**, con diseño propio y los textos, propiedades, equipo y reseñas de su web actual (bosdandjianrodriguez.com.uy).

- Es una **propuesta**: no reemplaza la web oficial.
- Está marcada **`noindex, nofollow`** y su `canonical` apunta a la web oficial, para que Google no la muestre ni compita con ella.
- El WhatsApp está en **modo demo** (`CONFIG.whatsapp = ""`): en vez de abrir el chat muestra el mensaje que se enviaría. En la web real va `59894617681`.

## Qué tiene

1. **Portada** con el mensaje principal y cifras reales: fundado en 2019, 3 áreas, 5,0 en Google y 19 reseñas.
2. **Servicios**: abogacía, escribanía e inmobiliaria, con lo que incluye cada una.
3. **Propiedades** con filtro (disponibles, Montevideo, Maldonado, operaciones recientes), galería de fotos, consulta por WhatsApp y **link propio** para compartir (`#casa-buceo`, `#terreno-av-italia`, `#casa-playa-hermosa`). En el celular van en carrusel.
4. **Por qué elegirnos** y **cómo trabajamos** en 4 pasos.
5. **Equipo** con el mismo formato para los dos.
6. **Opiniones**: las 19 reseñas de Google, **sin fechas inventadas**. Con `resenas.php` se muestran el promedio, el total y 5 reseñas con su **fecha real** (ver abajo).
7. **Preguntas frecuentes** y **contacto completo**: WhatsApp, teléfono para llamar, mail, Instagram y formulario.

## Para completar con el estudio

- **Dirección exacta y horario** (en la web aparecen punteados).
- **Nombre de él**: pusimos "Dr. Andrés Bosdandjian" porque así lo nombran en las reseñas.
- **5 fotos de las galerías** que no se pudieron descargar de su servidor.
- **Logo**: la versión completa dice "Bosdan**j**ian" (le falta la "d") y "Rodriguez" y "JURIDICO" sin tilde. En esta web se usa solo el monograma BR.

## Imágenes

Optimizadas en WebP y ordenadas:

| Archivo | Antes | Después |
|---|---|---|
| `img/marca/monograma.webp` (logo) | 2.096 KB | 15 KB |
| `img/portada/estudio-1100.webp` | 1.577 KB | 44 KB |
| `img/compartir/compartir.jpg` (al compartir el link) | 1.577 KB | 61 KB |
| `img/equipo/paula-rodriguez-1400.webp` | 5.518 KB | 97 KB |
| `img/inmuebles/` (55 fotos) | 10.070 KB | 7.034 KB |

```
img/
  marca/       monograma.webp, icono-64.png, icono-180.png
  portada/     estudio-700.webp, estudio-1100.webp
  compartir/   compartir.jpg
  equipo/      andres-bosdandjian-700.webp, paula-rodriguez-700.webp, paula-rodriguez-1400.webp
  inmuebles/   casa-buceo/, terreno-av-italia/, casa-playa-hermosa/, apto-barrio-sur/, casa-tres-cruces/
               (cada una con portada.webp y 01.webp, 02.webp…)
```

## Reseñas con fecha real

Google Maps no muestra la fecha exacta de las reseñas; solo la da la **API de Google Places**. `resenas.php` ya está listo:

1. En Google Cloud: crear un proyecto, activar **Places API (New)** y crear una clave restringida a esa API.
2. Buscar el **Place ID** del estudio: https://developers.google.com/maps/documentation/places/web-service/place-id
3. Guardar la clave y el Place ID **fuera de la carpeta pública**, en `../resenas-config.php`:
   ```php
   <?php return ['key' => 'LA_CLAVE', 'place_id' => 'EL_PLACE_ID'];
   ```
4. Subir `resenas.php` junto a `index.html`. La web lo detecta sola.

- Consulta a Google como máximo una vez por día y guarda una copia.
- Google entrega hasta 5 reseñas con fecha. Las demás se muestran igual, sin fecha.
- Si algo falla, quedan las reseñas fijas.
