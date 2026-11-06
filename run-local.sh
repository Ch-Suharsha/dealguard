#!/bin/zsh
set -e

PORT="${1:-4173}"
echo "DealGuard local preview: http://127.0.0.1:${PORT}"
echo "Press Ctrl-C to stop the server."
PORT="$PORT" node server/index.js
