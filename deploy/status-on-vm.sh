#!/usr/bin/env bash
set -euo pipefail

state_dir=/home/ubuntu/website-deployments
printf 'production commit: %s\n' "$(git -C /opt/website-handler rev-parse HEAD)"
printf 'production service: %s\n' "$(systemctl is-active website-handler.service || true)"
printf 'preview commit: %s\n' "$(cat "$state_dir/preview.current" 2>/dev/null || printf none)"
printf 'preview service: %s\n' "$(systemctl is-active website-preview.service || true)"
printf 'recent deployments:\n'
tail -n 10 "$state_dir/history.tsv" 2>/dev/null || true
