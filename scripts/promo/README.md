# Orquestador de promoción glosx.app

El botón "ARMAR CAMPAÑA": corré un comando (o tocá el botón en el panel
web), se arma una tanda de contenido para las rutas/posts menos
promocionados, y se publica de verdad en los canales conectados. Vos das
la orden cada vez — nada corre solo en segundo plano.

## Setup (una sola vez)

1. Copiá `config.example.env` a `~/.config/glosx/promo-bot.env`.
2. Completá ahí los campos que vayas conectando (Pinterest, Medium, Dev.to)
   pegando vos mismo los valores reales — nunca se los pases a Claude en el
   chat. Ese archivo vive fuera del repo, como el resto de las claves de glosx.
3. Lo que dejes vacío, el orquestador lo salta solo.

## Uso

Lo más simple: doble clic en `~/Desktop/Panel Promoción Glosx.command`,
se abre el panel en el navegador con el botón.

O por terminal:

```bash
# 1. Actualizar la cola (agrega rutas/posts nuevos, no toca el historial)
node scripts/promo/build-content-queue.js

# 2. Armar una campaña — arma 5 items por defecto
node scripts/promo/armar-campana.js

# ...o una tanda más grande
node scripts/promo/armar-campana.js 10
```

Cada corrida, por cada item de la tanda:
- Genera un reel de video 9:16 con "glosx.app" quemado en la imagen.
- Genera un artículo corto en inglés con la marca metida en el texto (no solo un link al final).
- Publica ese artículo en Pinterest, Medium y Dev.to — los canales que tengas conectados.
- Guarda todo en `campañas/<fecha>/`.
- Actualiza `content-queue.json`: nada se repite antes de 14 días.

## Qué está automatizado y qué no

| Canal | Estado |
|---|---|
| Reel de video (glosx.app quemado) | **Automático**, no necesita credencial nueva |
| Pinterest | **Automático** en vivo — falta cargar el token |
| Medium (artículo por ruta/post) | **Automático** en vivo — falta cargar el token |
| Dev.to (artículo por ruta/post) | **Automático** en vivo — falta cargar la key |
| Metricool | Sacado del flujo — no se va a usar |
| Quora / Reddit / Discord | Sacado del flujo — requeriría que el usuario lea/escriba inglés para engancharse en el hilo, y automatizarlo banea la cuenta |

## Archivos de esta carpeta

- `config.example.env` — plantilla de credenciales (sin valores reales, se puede commitear).
- `build-content-queue.js` — arma/actualiza `content-queue.json` a partir de las rutas y el blog.
- `armar-campana.js` — el botón. Genera contenido, publica, actualiza el historial.
- `generate-reel.js` — genera el video de una ruta (fotos de Pexels + make_reel.sh).
- `server.js` + `public/index.html` — panel web local (puerto 4747) con el botón.
- `content-queue.json` — el estado (qué se promocionó y cuándo). Se commitea para no perder el historial entre sesiones.
- `campañas/` — salida generada por cada corrida (no se commitea, es descartable).
