#!/bin/bash
# Double-click to serve the Design Canvas and open it in your browser.
cd "$(dirname "$0")" || exit 1
node serve.mjs
