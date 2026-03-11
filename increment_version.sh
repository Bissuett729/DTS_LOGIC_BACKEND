#!/bin/bash

# Obtener el último tag
latest_tag=$(git describe --tags `git rev-list --tags --max-count=1` 2>/dev/null)

# Si no hay tags, establecer el primer tag
if [ -z "$latest_tag" ]; then
  new_tag="v0.0.1"
else
  # Separar la versión en partes
  IFS='.' read -r -a version_parts <<< "$latest_tag"

  # Incrementar la parte menor (puedes ajustar esto según tus necesidades)
  new_patch=$((version_parts[2] + 1))

  # Crear el nuevo tag
  new_tag="${version_parts[0]}.${version_parts[1]}.$new_patch"
fi

# Crear el nuevo tag en Git
git tag -a "$new_tag" -m "Release $new_tag"
git push origin "$new_tag"

echo "New tag created: $new_tag"