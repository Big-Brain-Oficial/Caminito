# Caminito — Biblioteca de prototipos

Sitio estatico con visor Three.js y modelos reales exportados desde FreeCAD.

## Vista local

Desde esta carpeta: `python3 -m http.server 8765 --directory dist`.

Abrir `http://127.0.0.1:8765`. Se necesita un servidor HTTP para cargar modulos y geometria; no abrir index.html con file://.

## Contenido

- `dist/index.html`, `style.css`, `app.js`: interfaz y fichas.
- `dist/models/*.json`: triangulos y colores de las piezas visibles, en metros.
- `dist/downloads/`: proyectos FreeCAD y paquetes OBJ/MTL actuales.
- `dist/vendor/`: Three.js 0.180.0, OrbitControls y licencia MIT. El visor no requiere CDN.
- `exportar_modelos_web.py`: ejecutar dentro de FreeCAD, con los proyectos abiertos, para actualizar la geometria exportada. No cambia los documentos CAD.

## Agregar un modelo

Exportar su geometria con el mismo esquema JSON y agregar una ficha al objeto `models` de `dist/app.js`. La ficha define las medidas, explicacion, pendientes y descargas. Actualizar el contador de biblioteca en index.html. No inventar dimensiones: obtenerlas del CAD y distinguir medidas objetivo de medidas verificadas.

## Alcance

## Prototipo interactivo de Caminito

La sección `/prototipo` (o `/prototipo.html` con el servidor HTTP local) muestra una demo completamente simulada, separada del visor CAD. Se accede desde “Probar Caminito” en la biblioteca.

- **Mi recorrido:** preferencias, tres alternativas sobre un mapa SVG ilustrativo, origen y estado de los registros, capas, zoom y un recorrido guiado con avance manual.
- **Comunidad:** avisos de ejemplo, confirmaciones y reportes locales con fotografía opcional. Los aportes se mantienen solo en memoria y se eliminan al recargar. No se envían reclamos ni archivos.
- **Segunda vida:** tres perfiles ficticios de celulares, asignación de funciones y circuito propuesto de recuperación y préstamo. El diagnóstico no inspecciona el dispositivo.
- **Asistente:** respuestas predefinidas para explicar la demo; no utiliza un modelo de IA ni un servicio externo.
- **Accesibilidad:** controles por teclado, diálogos nativos, vista de alto contraste y texto ampliado, movimiento reducido e indicaciones con la síntesis de voz del navegador cuando esté disponible.

No solicita geolocalización, micrófono, cámara ni sensores. No calcula rutas reales ni publica mediciones, y el mapa no debe utilizarse para navegar en la ciudad. Los únicos archivos seleccionados por la persona se muestran como vista previa local. La tipografía conserva la carga desde Google Fonts del sitio original.

Archivos de esta sección: `dist/prototipo.html`, `dist/prototipo.css` y `dist/prototipo.js`. No requiere compilación ni nuevas dependencias.

## Alcance del visor CAD

El visor permite rotar, acercar, cambiar vistas, mostrar malla y despiece ilustrativo, seleccionar piezas, buscar y ocultar componentes. No modifica CAD. Las fichas y archivos son una captura exportada del proyecto y no se sincronizan automaticamente con FreeCAD.

Las carcasas y mecanismos son prototipos conceptuales. El ajuste universal, los cierres, materiales y autonomia de bateria requieren definicion y validacion.
