# Video · 03 Cómo funciona

Secuencia de 40 s a 1920×1080 y 30 fps, hecha con el modelo real de Caminante (`dist/models/carrito.json`).

| Tiempo | Escena |
|---|---|
| 0–9 s | Caminante recorre la vereda. Etiquetas de sensores y cámaras. |
| 9–19,5 s | Pasa por un pozo. El acelerómetro de cada rueda se sincroniza con el golpe. |
| 19,5–29,5 s | Vista desde la cámara de detalle. Se marcan una grieta y una baldosa levantada. |
| 29,5–40 s | Mapa del barrio pintado cuadra por cuadra. |

Los datos, la detección y el recorrido son ilustrativos. El video lo indica en pantalla.

## Ver y generar

```
npm install
node render.mjs                          # salida/03-como-funciona.mp4
node render.mjs --desde 9 --hasta 19.5   # solo un tramo
node render.mjs --fotos 3,14,25,36       # capturas PNG para revisar
```

Para previsualizar en el navegador, servir la raíz del repo (`python -m http.server 8765`) y abrir `http://127.0.0.1:8765/video/como-funciona/escena.html`. Espacio pausa y la barra permite moverse por la línea de tiempo. Con `?t=14` se abre en un instante fijo.

Los textos, tiempos y posiciones están en `como-funciona/escena.html`: `updateDOM` para los textos, `shotAt` para las cámaras y `DETECTIONS`, `STATES` y `ROUTE` para los datos. Necesita Google Chrome instalado. Otra ruta se indica con `CHROME_PATH`.
