#!/usr/bin/env bash
set -euo pipefail

state_dir=/home/ubuntu/website-deployments
sudo systemctl stop website-preview.service
sudo systemctl stop website-preview-expiry.timer 2>/dev/null || true
sudo truncate -s 0 /etc/caddy/preview.caddy
sudo caddy validate --config /etc/caddy/Caddyfile
sudo systemctl reload caddy.service
printf '%s\tpreview\tstopped\t%s\t-\n' \
	"$(date -u +%Y-%m-%dT%H:%M:%SZ)" \
	"$(cat "$state_dir/preview.current" 2>/dev/null || printf unknown)" \
	>> "$state_dir/history.tsv"
printf 'preview stopped\n'
