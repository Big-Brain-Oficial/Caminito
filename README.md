# Caminito — Biblioteca de prototipos

Sitio estatico con visor Three.js y modelos reales exportados desde FreeCAD, el modelo matemático y los costos del informe, y un prototipo interactivo simulado de la app.

El proyecto se desarrolla en el contexto del Rally Innovación 2026.

## Vista local

Desde esta carpeta: `python3 -m http.server 8765 --directory dist` (en Windows, `python` en lugar de `python3`).

Abrir `http://127.0.0.1:8765`. Se necesita un servidor HTTP para cargar modulos y geometria; no abrir index.html con file://.

## Publicación

El sitio se publica en Vercel. `vercel.json` toma `dist/` como salida y activa `cleanUrls`, por eso `/prototipo` funciona sin `.html`. No hay paso de compilación.

## Biblioteca

El menú lateral (`BIBLIOTECA 05`) tiene cinco opciones:

| N.º | Opción | Contenido |
|---|---|---|
| 01 | Caminante (`carrito`) | Carro de tres apoyos para relevar veredas. CAD `CarroVeredas.FCStd`. |
| 02 | Kit (`carcasa`) | Soporte de celular con pantalla accesible y montaje orientable. CAD `PrototipoCarcasasCelulares.FCStd`. |
| 03 | Batería (`powerbank`) | Módulo de energía desmontable sujeto al bastidor. Comparte el CAD del Kit. |
| 04 | Modelo matemático (`#modelo`) | Apartado 3.2 del informe. |
| 05 | Costos (`#costos`) | Apartado 3.3 del informe. |

## Contenido

- `dist/index.html`, `style.css`, `app.js`: interfaz, fichas de los modelos y carga de las secciones del informe.
- `dist/models/*.json`: triangulos y colores de las piezas visibles, en metros.
- `dist/downloads/`: proyectos FreeCAD, paquetes OBJ/MTL actuales y copia de `Caminito_Informe_Rally.docx`.
- `dist/modelo-fragmento.html`, `modelo.js`, `modelo-integrado.css`: sección del modelo matemático.
- `dist/costos-fragmento.html`, `costos.js`, `costos.css`: sección de costos.
- `dist/prototipo.html`, `prototipo.css`, `prototipo.js`: prototipo interactivo.
- `dist/vendor/`: Three.js 0.180.0, OrbitControls y licencia MIT. El visor no requiere CDN.
- `exportar_modelos_web.py`: ejecutar dentro de FreeCAD, con los proyectos abiertos, para actualizar la geometria exportada. No cambia los documentos CAD.
- `video/`: secuencias animadas renderizadas a MP4 (ver más abajo).

## Agregar un modelo

Exportar su geometria con el mismo esquema JSON y agregar una ficha al objeto `models` de `dist/app.js`. La ficha define las medidas, explicacion, pendientes y descargas. Actualizar el contador de biblioteca en index.html. No inventar dimensiones: obtenerlas del CAD y distinguir medidas objetivo de medidas verificadas.

Una sección de texto del informe se agrega en `informationViews` de `dist/app.js`, con su fragmento HTML, su script y una `<section>` vacía en index.html. El fragmento se descarga la primera vez que se abre la opción.

## Alcance del visor CAD

El visor permite rotar, acercar, cambiar vistas, mostrar malla y despiece ilustrativo, seleccionar piezas, buscar y ocultar componentes. No modifica CAD. Las fichas y archivos son una captura exportada del proyecto y no se sincronizan automaticamente con FreeCAD.

Las carcasas y mecanismos son prototipos conceptuales. El ajuste universal, los cierres, materiales y autonomia de bateria requieren definicion y validacion.

## Modelo matemático del informe

La cuarta opción de la biblioteca (`#modelo`) presenta el apartado 3.2 de `Caminito_Informe_Rally.docx` dentro de la página principal. El contenido está en `dist/modelo-fragmento.html`; los controles de `dist/modelo.js` calculan ejemplos ilustrativos del filtro complementario, las pendientes y la profundidad estéreo. No representan mediciones reales ni cambian el modelo del informe. La copia en `dist/downloads/Caminito_Informe_Rally.docx` permite descargar el documento original desde la web.

La quinta opción (`#costos`) presenta el apartado 3.3 de viabilidad económica, incluida su tabla de ocho rubros y las aclaraciones sobre el alcance del subtotal. `dist/costos.js` permite comparar los extremos mínimo y máximo sin modificar los importes del informe.

## Prototipo interactivo de Caminito

La sección `/prototipo` (o `/prototipo.html` con el servidor HTTP local) muestra una demo completamente simulada, separada del visor CAD. No aparece en el menú de la biblioteca.

- **Mi recorrido:** preferencias, tres alternativas sobre un mapa SVG ilustrativo, origen y estado de los registros, capas, zoom y un recorrido guiado con avance manual.
- **Comunidad:** avisos de ejemplo, confirmaciones y reportes locales con fotografía opcional. Los aportes se mantienen solo en memoria y se eliminan al recargar. No se envían reclamos ni archivos.
- **Segunda vida:** tres perfiles ficticios de celulares, asignación de funciones y circuito propuesto de recuperación y préstamo. El diagnóstico no inspecciona el dispositivo.
- **Asistente:** respuestas predefinidas para explicar la demo; no utiliza un modelo de IA ni un servicio externo.
- **Accesibilidad:** controles por teclado, diálogos nativos, vista de alto contraste y texto ampliado, movimiento reducido e indicaciones con la síntesis de voz del navegador cuando esté disponible.

No solicita geolocalización, micrófono, cámara ni sensores. No calcula rutas reales ni publica mediciones, y el mapa no debe utilizarse para navegar en la ciudad. Los únicos archivos seleccionados por la persona se muestran como vista previa local. La tipografía conserva la carga desde Google Fonts del sitio original.

No requiere compilación ni nuevas dependencias.

## Videos

`video/` contiene escenas HTML animadas que `video/render.mjs` captura cuadro por cuadro con Chrome (Puppeteer) y codifica en MP4 con ffmpeg. No forma parte del sitio publicado.

- `como-funciona/`: 03 Cómo funciona, 40 s, con el modelo real de Caminante.
- `ruta-andador/`: 04 Ruta segura al hospital, 15 s, app simulada con perfil andador.

```
cd video
npm install
node render.mjs                         # salida/03-como-funciona.mp4
node render.mjs --escena ruta-andador   # salida/04-ruta-andador.mp4
```

Necesita Google Chrome instalado (otra ruta se indica con `CHROME_PATH`). Guiones, tiempos y opciones de render en [video/README.md](video/README.md).
