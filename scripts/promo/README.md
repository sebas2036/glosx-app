# Orquestador de promoción glosx.app

El botón "ARMAR CAMPAÑA": corré un comando, se arma una tanda de contenido
para las rutas/posts menos promocionados, y se reparte entre los canales
que tengas conectados. Vos das la orden cada vez — nada corre solo en
segundo plano.

## Setup (una sola vez)

1. Copiá `config.example.env` a `~/.config/glosx/promo-bot.env`.
2. Completá ahí los campos que vayas conectando (Metricool, Pinterest, etc.)
   pegando vos mismo los valores reales — nunca se los pases a Claude en el
   chat. Ese archivo vive fuera del repo, como el resto de las claves de glosx.
3. Lo que dejes vacío, el orquestador lo salta solo.

## Uso

```bash
# 1. Actualizar la cola (agrega rutas/posts nuevos, no toca el historial)
node scripts/promo/build-content-queue.js

# 2. Armar una campaña — arma 5 items por defecto
node scripts/promo/armar-campana.js

# ...o una tanda más grande
node scripts/promo/armar-campana.js 10
```

Cada corrida:
- Elige los items que menos se promocionaron (o nunca).
- Genera el texto (caption corto para redes + texto largo para foros/Quora/Reddit) en inglés, listo para pegar.
- Si hay canales conectados (Metricool, Pinterest), intenta publicar ahí directamente.
- Guarda todo en `campañas/<fecha>/` — un .txt por item, con la URL y los dos textos.
- Actualiza `content-queue.json` para no repetir lo mismo la próxima vez.

## Qué está automatizado y qué no

| Canal | Estado |
|---|---|
| Redes (IG/FB/TikTok/Pinterest) vía Metricool | Conectable — falta cargar el token y confirmar el endpoint |
| Pinterest directo | Conectable — falta cargar el token |
| Quora / Reddit / Discord / comunidades | **A propósito no automatizado** — esas plataformas banean cuentas con posteo automatizado. El texto sale listo en inglés, vos solo pegás. |

## Archivos de esta carpeta

- `config.example.env` — plantilla de credenciales (sin valores reales, se puede commitear).
- `build-content-queue.js` — arma/actualiza `content-queue.json` a partir de las rutas y el blog.
- `armar-campana.js` — el botón. Genera contenido, reparte, actualiza el historial.
- `content-queue.json` — el estado (qué se promocionó y cuándo). Se commitea para no perder el historial entre sesiones.
- `campañas/` — salida generada por cada corrida (no se commitea, es descartable).
