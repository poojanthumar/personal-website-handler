#!/usr/bin/env bash
set -euo pipefail

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
target_commit="${1:-HEAD}"
preview_root=/home/ubuntu/website-preview
state_dir=/home/ubuntu/website-deployments
history="$state_dir/history.tsv"
production_env=/opt/website-handler/.env

cd "$repo_root"
target_commit="$(git rev-parse "$target_commit^{commit}")"
if ! git diff --quiet || ! git diff --cached --quiet; then
	printf 'Commit changes before starting a preview.\n' >&2
	exit 1
fi

./mvnw test
./mvnw -q -DskipTests package

mkdir -p "$preview_root/releases/$target_commit" "$state_dir"
cp target/personal-website-handler-0.0.1-SNAPSHOT.jar \
	"$preview_root/releases/$target_commit/app.jar"

sudo systemctl stop website-preview.service 2>/dev/null || true
sudo -u postgres dropdb --if-exists website_preview
sudo -u postgres createdb --owner=website website_preview
dump_file="/tmp/website-preview-$target_commit.dump"
sudo -u postgres pg_dump --format=custom --file="$dump_file" website
sudo -u postgres pg_restore --no-owner --dbname=website_preview "$dump_file"
sudo -u postgres rm -f "$dump_file"

grep -Ev '^(SPRING_PROFILES_ACTIVE|SERVER_ADDRESS|SERVER_PORT|DATABASE_URL|APP_HOSTS_WEDDING)=' \
	"$production_env" > "$preview_root/preview.env"
cat >> "$preview_root/preview.env" <<'ENV'
SPRING_PROFILES_ACTIVE=postgres,prod
SERVER_ADDRESS=127.0.0.1
SERVER_PORT=9080
DATABASE_URL=jdbc:postgresql://localhost:5432/website_preview
APP_HOSTS_WEDDING=test.wedding.poojanthumar.in,wedding.poojanthumar.in,wedding.localhost
ENV
chmod 600 "$preview_root/preview.env"

ln -sfn "$preview_root/releases/$target_commit" "$preview_root/current"
sudo systemctl restart website-preview.service

healthy=false
for attempt in $(seq 1 30); do
	if curl --fail --silent http://127.0.0.1:9080/actuator/health >/dev/null; then
		healthy=true
		break
	fi
	sleep 1
done
if [[ "$healthy" != true ]]; then
	printf 'preview health check failed\n' >&2
	sudo systemctl stop website-preview.service
	exit 1
fi

sudo systemctl stop website-preview-expiry.timer 2>/dev/null || true
sudo systemctl reset-failed website-preview-expiry.service website-preview-expiry.timer 2>/dev/null || true
sudo systemd-run --quiet --unit=website-preview-expiry --on-active=24h \
	/usr/bin/systemctl stop website-preview.service

printf '%s\n' "$target_commit" > "$state_dir/preview.current"
printf '%s\tpreview\tstarted\t-\t%s\n' \
	"$(date -u +%Y-%m-%dT%H:%M:%SZ)" "$target_commit" >> "$history"
printf 'previewing %s at https://test.wedding.poojanthumar.in (expires in 24 hours)\n' \
	"$target_commit"
