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

El visor permite rotar, acercar, cambiar vistas, mostrar malla y despiece ilustrativo, seleccionar piezas, buscar y ocultar componentes. No modifica CAD. Las fichas y archivos son una captura exportada del proyecto y no se sincronizan automaticamente con FreeCAD.

Las carcasas y mecanismos son prototipos conceptuales. El ajuste universal, los cierres, materiales y autonomia de bateria requieren definicion y validacion.
