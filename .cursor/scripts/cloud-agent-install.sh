#!/usr/bin/env bash
set -euo pipefail

chmod +x ./mvnw
./mvnw dependency:go-offline -B
./mvnw test -B
