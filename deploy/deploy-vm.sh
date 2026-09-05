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

ssh -i "$ssh_key" -o BatchMode=yes "$vm_host" bash -s -- "$target_commit" <<'REMOTE'
set -euo pipefail

target_commit="$1"
checkout=/opt/website-handler
previous_commit="$(git -C "$checkout" rev-parse HEAD)"

restore_previous() {
	git -C "$checkout" checkout --detach "$previous_commit"
	"$checkout/mvnw" -q -f "$checkout/pom.xml" -DskipTests package
	sudo systemctl restart website-handler
}
trap restore_previous ERR

git -C "$checkout" fetch --prune origin
git -C "$checkout" checkout --detach "$target_commit"
"$checkout/mvnw" -q -f "$checkout/pom.xml" -DskipTests package
sudo systemctl restart website-handler

for attempt in $(seq 1 30); do
	if curl --fail --silent http://127.0.0.1:8080/actuator/health >/dev/null; then
		trap - ERR
		printf 'deployed %s (previous %s)\n' "$target_commit" "$previous_commit"
		exit 0
	fi
	sleep 1
done

printf 'website health check failed after deploy\n' >&2
exit 1
REMOTE

curl --fail --silent --show-error --head https://www.poojanthumar.in/ >/dev/null
curl --fail --silent --show-error --head https://wedding.poojanthumar.in/ >/dev/null
curl --fail --silent --show-error --head https://admin.poojanthumar.in/login >/dev/null

printf 'public HTTPS checks passed\n'
