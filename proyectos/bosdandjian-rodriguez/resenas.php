<?php
/* =========================================================
   Reseñas de Google con fecha real (Google Places API, versión nueva)
   ---------------------------------------------------------
   - Consulta a Google como máximo una vez cada 24 horas y guarda
     el resultado en resenas-cache.json (así no se gasta cuota).
   - Devuelve JSON: { rating, total, url, reviews: [ {autor, texto, estrellas, fecha, perfil} ] }
   - Google entrega hasta 5 reseñas (las "más relevantes").

   Configuración (NO subir la clave al repositorio):
   1. En Google Cloud: crear un proyecto, activar "Places API (New)"
      y crear una clave de API restringida a esa API.
   2. Guardar la clave en una variable de entorno del servidor
      GOOGLE_PLACES_KEY, o en el archivo ../resenas-config.php
      (fuera de la carpeta pública) con:
        <?php return ['key' => 'LA_CLAVE', 'place_id' => 'EL_PLACE_ID'];
   3. El place_id del estudio se busca en:
      https://developers.google.com/maps/documentation/places/web-service/place-id
   ========================================================= */

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: public, max-age=3600');

$config = [];
$archivo_config = __DIR__ . '/../resenas-config.php';
if (is_file($archivo_config)) {
    $config = include $archivo_config;
}
$key      = getenv('GOOGLE_PLACES_KEY') ?: ($config['key'] ?? '');
$place_id = getenv('GOOGLE_PLACE_ID') ?: ($config['place_id'] ?? '');
$cache    = __DIR__ . '/resenas-cache.json';
$vigencia = 24 * 60 * 60;

// 1. Si hay copia de menos de 24 horas, se devuelve esa
if (is_file($cache) && (time() - filemtime($cache)) < $vigencia) {
    readfile($cache);
    exit;
}

// 2. Sin configuración: error claro (la web sigue mostrando las reseñas fijas)
if ($key === '' || $place_id === '') {
    http_response_code(503);
    echo json_encode(['error' => 'Falta configurar la clave o el place_id']);
    exit;
}

// 3. Consulta a Google
$url = 'https://places.googleapis.com/v1/places/' . rawurlencode($place_id) . '?languageCode=es';
$ch = curl_init($url);
curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_TIMEOUT        => 10,
    CURLOPT_HTTPHEADER     => [
        'X-Goog-Api-Key: ' . $key,
        'X-Goog-FieldMask: rating,userRatingCount,googleMapsUri,reviews',
    ],
]);
$respuesta = curl_exec($ch);
$codigo    = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

$datos = json_decode((string) $respuesta, true);
if ($codigo !== 200 || !is_array($datos)) {
    // Si Google falla, se usa la última copia aunque sea vieja
    if (is_file($cache)) {
        readfile($cache);
        exit;
    }
    http_response_code(502);
    echo json_encode(['error' => 'No se pudo consultar Google']);
    exit;
}

$salida = [
    'rating'  => $datos['rating'] ?? null,
    'total'   => $datos['userRatingCount'] ?? null,
    'url'     => $datos['googleMapsUri'] ?? null,
    'reviews' => [],
];
foreach (($datos['reviews'] ?? []) as $r) {
    $salida['reviews'][] = [
        'autor'     => $r['authorAttribution']['displayName'] ?? 'Cliente de Google',
        'perfil'    => $r['authorAttribution']['uri'] ?? null,
        'texto'     => $r['originalText']['text'] ?? ($r['text']['text'] ?? ''),
        'estrellas' => $r['rating'] ?? null,
        'fecha'     => $r['publishTime'] ?? null,   // fecha exacta, formato ISO 8601
    ];
}

$json = json_encode($salida, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
@file_put_contents($cache, $json, LOCK_EX);
echo $json;
