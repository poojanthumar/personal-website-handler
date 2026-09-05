#!/usr/bin/env bash
set -euo pipefail

state_dir=/home/ubuntu/website-deployments
target_commit="${1:-}"
if [[ -z "$target_commit" ]]; then
	target_commit="$(cat "$state_dir/production.previous")"
fi

script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
"$script_dir/release-on-vm.sh" "$target_commit"
