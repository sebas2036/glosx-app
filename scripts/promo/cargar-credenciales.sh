#!/bin/bash
# Pide keys en la Terminal (tipeo oculto) y las guarda en
# ~/.config/glosx/promo-bot.env. Nunca pasan por el chat.
set -euo pipefail
ENV_FILE="$HOME/.config/glosx/promo-bot.env"
mkdir -p "$HOME/.config/glosx"
[ -f "$ENV_FILE" ] || cp "$(dirname "$0")/config.example.env" "$ENV_FILE"

write_key() {
  local var_name="$1"
  local value="$2"
  VAR_NAME="$var_name" VAR_VALUE="$value" ENV_PATH="$ENV_FILE" python3 << 'PY'
import os, re
path = os.environ['ENV_PATH']
var_name = os.environ['VAR_NAME']
var_value = os.environ['VAR_VALUE'].strip().strip('"').strip("'")
var_value = re.sub(r'\s+', '', var_value)
with open(path) as f:
    content = f.read()
line = f'{var_name}={var_value}'
if re.search(rf'^{var_name}=', content, re.MULTILINE):
    content = re.sub(rf'^{var_name}=.*$', line, content, count=1, flags=re.MULTILINE)
else:
    content = content.rstrip() + '\n' + line + '\n'
with open(path, 'w') as f:
    f.write(content)
PY
}

is_set() {
  local var_name="$1"
  VAR_NAME="$var_name" ENV_PATH="$ENV_FILE" python3 << 'PY'
import os, re
path = os.environ['ENV_PATH']
var_name = os.environ['VAR_NAME']
for line in open(path):
    if line.startswith(var_name + '='):
        val = line.split('=', 1)[1].strip().strip('"').strip("'")
        raise SystemExit(0 if val else 1)
raise SystemExit(1)
PY
}

set_key() {
  local var_name="$1"
  local label="$2"
  if is_set "$var_name"; then
    echo "✅ $label ya está cargado."
    return
  fi
  read -rsp "Pegá tu $label (no se va a mostrar, Enter para saltear): " value
  echo ""
  if [ -n "${value:-}" ]; then
    write_key "$var_name" "$value"
    echo "✅ $label guardado."
  else
    echo "⏭️  $label salteado."
  fi
}

echo "=== Carga de credenciales — glosx promo bot ==="
echo ""
set_key "DEVTO_API_KEY" "Dev.to API Key"
set_key "PINTEREST_ACCESS_TOKEN" "Pinterest Access Token"
set_key "PINTEREST_BOARD_ID" "Pinterest Board ID"
echo ""
echo "Listo. Si Dev.to quedó guardado, en el chat escribí: dale"
