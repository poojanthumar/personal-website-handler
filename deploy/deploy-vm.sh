#!/usr/bin/env bash
set -euo pipefail

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
ssh_key="${ORACLE_SSH_KEY:-$HOME/Library/Mobile Documents/com~apple~CloudDocs/Code/secrets/ssh-keys-oracle-vm.key}"
vm_host="${ORACLE_VM_HOST:-ubuntu@100.105.56.99}"

cd "$repo_root"
./mvnw test
git fetch origin main

target_commit="${1:-$(git rev-parse origin/main)}"
if ! git merge-base --is-ancestor "$target_commit" origin/main; then
	printf 'Refusing to deploy %s because it is not on origin/main.\n' "$target_commit" >&2
	exit 1
fi

ssh -i "$ssh_key" -o BatchMode=yes "$vm_host" \
	bash -s -- "$target_commit" < "$repo_root/deploy/release-on-vm.sh"

curl --fail --silent --show-error --head https://www.poojanthumar.in/ >/dev/null
curl --fail --silent --show-error --head https://wedding.poojanthumar.in/ >/dev/null
curl --fail --silent --show-error --head https://admin.poojanthumar.in/login >/dev/null

printf 'public HTTPS checks passed\n'
