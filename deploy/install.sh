#!/usr/bin/env bash
# Ejecutá como root desde la carpeta del paquete de despliegue en Ubuntu.
set -euo pipefail
export DEBIAN_FRONTEND=noninteractive
if [ ! -f /swapfile ]; then
    fallocate -l 1G /swapfile
    chmod 600 /swapfile
    mkswap /swapfile
    swapon /swapfile
    echo "/swapfile none swap sw 0 0" >> /etc/fstab
fi
apt-get update
apt-get install -y --no-install-recommends nginx nodejs npm
install -d /opt/chungus-api /var/www/chungus
install -d -o www-data -g www-data /var/lib/chungus
npm install --prefix /opt/chungus-api --omit=dev --no-audit --no-fund json-server@0.17.4
cp -a browser/. /var/www/chungus/
# Conservamos las cotizaciones existentes al volver a desplegar.
if [ ! -f /var/lib/chungus/db.json ]; then
    install -o www-data -g www-data -m 600 db.json /var/lib/chungus/db.json
fi
install -m 644 deploy/chungus-api.service /etc/systemd/system/chungus-api.service
install -m 644 deploy/nginx.conf /etc/nginx/sites-available/chungus
ln -sf /etc/nginx/sites-available/chungus /etc/nginx/sites-enabled/default
nginx -t
systemctl daemon-reload
systemctl enable --now chungus-api nginx
systemctl restart chungus-api
systemctl reload nginx
curl --retry 10 --retry-all-errors --retry-delay 1 --fail --silent http://127.0.0.1/api/catalogo > /dev/null
printf 'Chungus deployment ready.\n'
