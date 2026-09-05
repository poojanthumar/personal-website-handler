#!/usr/bin/env bash
set -euo pipefail

target_commit="${1:?usage: release-on-vm.sh COMMIT}"
checkout=/opt/website-handler
state_dir=/home/ubuntu/website-deployments
history="$state_dir/history.tsv"

mkdir -p "$state_dir"
git -C "$checkout" fetch --prune origin
target_commit="$(git -C "$checkout" rev-parse "$target_commit^{commit}")"
if ! git -C "$checkout" merge-base --is-ancestor "$target_commit" origin/main; then
	printf 'Refusing to deploy %s because it is not on origin/main.\n' "$target_commit" >&2
	exit 1
fi

previous_commit="$(git -C "$checkout" rev-parse HEAD)"

record() {
	printf '%s\tproduction\t%s\t%s\t%s\n' \
		"$(date -u +%Y-%m-%dT%H:%M:%SZ)" "$1" "$2" "$3" >> "$history"
}

restore_previous() {
	result=$?
	trap - ERR
	record failed "$previous_commit" "$target_commit"
	git -C "$checkout" checkout --detach "$previous_commit"
	"$checkout/mvnw" -q -f "$checkout/pom.xml" -DskipTests package
	sudo systemctl restart website-handler
	exit "$result"
}
trap restore_previous ERR

git -C "$checkout" checkout --detach "$target_commit"
"$checkout/mvnw" -q -f "$checkout/pom.xml" -DskipTests package
sudo systemctl restart website-handler

healthy=false
for attempt in $(seq 1 30); do
	if curl --fail --silent http://127.0.0.1:8080/actuator/health >/dev/null; then
		healthy=true
		break
	fi
	sleep 1
done
if [[ "$healthy" != true ]]; then
	printf 'website health check failed after deploy\n' >&2
	false
fi

trap - ERR
printf '%s\n' "$previous_commit" > "$state_dir/production.previous"
printf '%s\n' "$target_commit" > "$state_dir/production.current"
record deployed "$previous_commit" "$target_commit"
printf 'deployed %s (previous %s)\n' "$target_commit" "$previous_commit"
