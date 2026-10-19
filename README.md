# Caminito

**Veredas más claras para quienes más las necesitan, medidas con celulares que ya nadie usa.**

> 🥈 **2.º puesto en la categoría Impacto Social — sede UTN Facultad Regional Resistencia (UTN FRRe)**
> Rally Latinoamericano de Innovación 2026 · Desafío 02: *Sensores al servicio de la comunidad*

---

## El problema

Para muchas personas, salir a la calle implica una pregunta previa: *¿voy a poder pasar?*
Un escalón sin rampa, una pendiente pronunciada, baldosas rotas o una rampa bloqueada por un auto pueden convertir un trayecto corto en un recorrido imposible. Hoy esa información casi nunca está disponible antes de salir, y quien la necesita suele depender de que otra persona revise el camino.

Esto afecta a usuarios de silla de ruedas, andador, muletas o bastón, a personas con baja visión, a adultos mayores y a familias con cochecito.

## La idea

Caminito es un mapa de veredas que muestra **por dónde se puede pasar y por qué**, adaptado a la forma en que cada persona se desplaza.

Una misma vereda no representa la misma dificultad para una silla de ruedas que para un cochecito. Por eso Caminito no se limita a pintar calles de colores: explica qué barrera hay, de dónde salió el dato, cuándo se registró y qué tramos todavía no tienen información.

El desafío del Rally proponía darles una segunda vida a los celulares en desuso. Caminito los convierte en sensores: un celular viejo puede medir inclinaciones, vibraciones y sacar fotos de obstáculos, y esa información alimenta el mapa.

## Cómo funciona

El sistema tiene tres partes que se complementan:

| | Qué es | Para qué sirve |
|---|---|---|
| 📱 **App Caminito** | Mapa personal, rutas explicadas, avisos y reportes. | Planificar un recorrido según las propias necesidades. Se puede usar sin ningún equipo adicional. |
| 🛠️ **Kit Caminito** | Un celular recuperado, montado en la silla, andador o cochecito de la persona. | Aporta datos durante los recorridos cotidianos y mantiene el mapa actualizado. |
| 🛒 **Caminante** | Un carro de tres ruedas con celulares fijados al chasis, operado por el equipo técnico. | Relevar veredas de forma sistemática, verificar reportes y servir de referencia de calibración. |

A eso se suma la participación de la comunidad: vecinos que avisan sobre una obra o una rampa bloqueada, y familiares que ayudan a planificar un viaje.

### Un ejemplo

Una persona que usa andador indica en la app que le cuestan las subidas. Consulta cómo llegar a un centro de salud y Caminito le muestra dos alternativas: una más corta con una pendiente fuerte y otra un poco más larga pero mejor relevada. Elige la segunda. En el camino encuentra una rampa bloqueada, la reporta desde la app y, una vez revisado, ese aviso queda disponible para las próximas personas que pasen por ahí.

## A quién beneficia

- **A quien se desplaza**, que gana autonomía para anticipar barreras y elegir con información, sin depender de otra persona.
- **A la comunidad**, que puede aportar y confirmar el estado de su barrio.
- **Al municipio**, que obtiene evidencia concreta para priorizar reparaciones, seguir reclamos y verificar que una obra resolvió el problema.
- **Al ambiente**, porque celulares que iban a quedar en un cajón vuelven a tener una función útil.

## Principios

- **Accesible por diseño:** la app se puede usar con texto, voz, sonido o vibración, con alto contraste y texto ampliado. No exige GPS, cámara ni micrófono para consultar.
- **Transparente:** cada dato muestra su origen, su fecha y su calidad. Un tramo sin información se muestra como tal, no se inventa.
- **La persona decide:** controla su perfil, sus recorridos y el uso de sus datos. Las fotos publicadas ocultan rostros y patentes, y los recorridos personales nunca se hacen públicos.
- **Sin costo para quien lo necesita:** el objetivo es que la herramienta sea gratuita para sus usuarios, con el apoyo de la universidad, el municipio y organizaciones sociales.

## Estado del proyecto

Caminito es una **propuesta en etapa de prototipo**. Lo que se encuentra en este repositorio es:

- Un **prototipo interactivo de la app**, con datos simulados, para mostrar la experiencia de uso.
- Los **modelos 3D** del carro Caminante y del Kit, diseñados en FreeCAD y visibles desde el navegador.
- El **informe del proyecto**, con el modelo matemático para medir pendientes y obstáculos y la estimación de costos del carro (entre 140.000 y 210.000 pesos argentinos en materiales).
- **Videos** que explican el funcionamiento.

El siguiente paso es un **piloto** en una zona acotada, junto a personas con distintas necesidades de movilidad, para comprobar que las mediciones son confiables, que la app resulta útil en el día a día y cuánto cuesta sostener el servicio. Las funciones descritas son el producto que se busca desarrollar y todavía no son resultados demostrados.

El informe completo está en [dist/downloads/Caminito_Informe_Rally.docx](dist/downloads/Caminito_Informe_Rally.docx).
