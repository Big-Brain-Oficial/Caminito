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

# Video · 04 Ruta segura al hospital (andador)

Secuencia de 15 s a 1920×1080 y 30 fps. Simula la app de Caminito con perfil de movilidad **andador**.

Guion: *Pedís por voz cómo llegar al hospital. Caminito arma la ruta más segura, te avisa antes de cada obstáculo y, si algo pasa, avisa a tu familia.*

| Tiempo | Escena |
|---|---|
| 0–3 s | Se toca el micrófono: "¿Cómo llego al hospital?". Aparece Hospital Municipal y cae el pin H. |
| 3–7 s | La ruta más corta se descarta (baldosas levantadas, esquina sin rampa). La ruta más segura queda **Apta para andador · Buen estado**. Se toca "Iniciar recorrido". |
| 7–10,5 s | Navegación: aviso por voz y vibración de una grieta adelante y luego indicación de cruzar por la rampa. |
| 10,5–15 s | Golpe fuerte en el andador: "¿Estás bien?" con cuenta regresiva, aviso a la familia con ubicación en vivo. El celular de Ana recibe la notificación y vibra. |

```
node render.mjs --escena ruta-andador          # salida/04-ruta-andador.mp4
node render.mjs --escena ruta-andador --fotos 2.5,6.2,8.3,14.5
```

Vista previa: `http://127.0.0.1:8765/video/ruta-andador/escena.html`. Tiempos en `T`, rutas en `R1` y `R2` dentro de `ruta-andador/escena.html`. Una ruta es apta solo si no tiene cuadras en estado Malo; porcentajes y distancias se calculan de las rutas (1 cuadra = 100 m, andador a 0,55 m/s). Sin audio. Tipografía Roboto, paleta Crimson & Chalk (`--crimson`, `--chalk`) y mapa estilo Google Maps (`MAP`, `COLORS`).
