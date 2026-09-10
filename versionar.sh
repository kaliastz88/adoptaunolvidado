#!/bin/sh
# Le pone ?v=<marca de tiempo> a cada script y hoja de estilo propios del sitio.
#
# POR QUÉ: el navegador guarda los .jsx en caché y, al publicar un cambio, sigue
# ejecutando los viejos. El sitio se ve idéntico y parece que no se publicó
# nada. Cambiando la URL, el navegador no tiene más remedio que volver a
# pedirlos.
#
# Se corre ANTES de cada commit que toque archivos del sitio:
#   ./versionar.sh
V=$(date -u +%Y%m%d%H%M%S)
for f in ui_kits/website/index.html ui_kits/website/admin.html; do
  # Se limpia la versión anterior antes de poner la nueva, para no encadenarlas.
  perl -0pi -e 's/(src="(?!https?:)[^"?]+)\?v=\d+/$1/g; s/(href="(?!https?:)[^"?]+\.css)\?v=\d+/$1/g' "$f"
  perl -0pi -e "s/(src=\"(?!https?:)[^\"?]+\.(?:jsx|js))\"/\$1?v=$V\"/g" "$f"
  perl -0pi -e "s/(href=\"(?!https?:)[^\"?]+\.css)\"/\$1?v=$V\"/g" "$f"
done
echo "versión $V aplicada"
