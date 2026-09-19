#!/bin/bash
# Carga credenciales del orquestador de promoción de forma segura:
# se piden acá en la Terminal (con el tipeo oculto), nunca pasan por ningún
# chat ni se le muestran a nadie más que a vos. Se guardan directo en
# ~/.config/glosx/promo-bot.env.
set -e
ENV_FILE="$HOME/.config/glosx/promo-bot.env"
mkdir -p "$HOME/.config/glosx"
[ -f "$ENV_FILE" ] || cp "$(dirname "$0")/config.example.env" "$ENV_FILE"

set_key() {
  local var_name="$1"
  local label="$2"
  local current
  current=$(grep "^${var_name}=" "$ENV_FILE" | cut -d= -f2- | sed 's/^["'\'']//;s/["'\'']$//')
  if [ -n "$current" ]; then
    echo "✅ $label ya está cargado."
    return
  fi
  read -rsp "Pegá tu $label (no se va a mostrar en pantalla, Enter para saltear): " value
  echo ""
  if [ -n "$value" ]; then
    # Reemplaza la línea vía variable de entorno (evita que caracteres raros
    # en la key rompan el reemplazo o queden en el historial de comandos).
    VAR_NAME="$var_name" VAR_VALUE="$value" ENV_PATH="$ENV_FILE" python3 -c "
import re, os
path = os.environ['ENV_PATH']
var_name = os.environ['VAR_NAME']
var_value = os.environ['VAR_VALUE']
with open(path) as f: content = f.read()
content = re.sub(rf'^{var_name}=.*$', lambda m: f'{var_name}={var_value}', content, flags=re.MULTILINE)
with open(path, 'w') as f: f.write(content)
"
    echo "✅ $label guardado."
  else
    echo "⏭️  $label salteado."
  fi
}

echo "=== Carga de credenciales — glosx promo bot ==="
echo "(Nada de esto se muestra en pantalla ni sale de tu Mac salvo lo que la propia API necesite.)"
echo ""
set_key "DEVTO_API_KEY" "Dev.to API Key"
set_key "MEDIUM_INTEGRATION_TOKEN" "Medium Integration Token"
set_key "PINTEREST_ACCESS_TOKEN" "Pinterest Access Token"
set_key "PINTEREST_BOARD_ID" "Pinterest Board ID"
echo ""
echo "Listo. Corré 'node armar-campana.js 1' para probar."
