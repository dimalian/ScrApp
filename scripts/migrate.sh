#!/usr/bin/env bash
set -euo pipefail

docker-compose -f docker-compose.yml run unique-service npm run migrate
