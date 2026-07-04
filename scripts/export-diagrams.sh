#!/usr/bin/env sh
set -eu
command -v plantuml >/dev/null 2>&1 || {
  echo "PlantUML is required: https://plantuml.com/starting"
  exit 1
}
mkdir -p docs/diagrams/export
plantuml -charset UTF-8 -tsvg -o export docs/diagrams/*.puml
plantuml -charset UTF-8 -tpdf -o export docs/diagrams/*.puml
echo "Vector SVG and PDF files exported to docs/diagrams/export"
