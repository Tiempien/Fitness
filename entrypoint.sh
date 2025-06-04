#!/bin/sh

# Genereer SSL-certificaten als ze niet bestaan
if [ ! -f /app/server.crt ] || [ ! -f /app/server.key ]; then
    openssl req -newkey rsa:2048 -nodes -keyout /app/server.key -x509 -days 365 -out /app/server.crt -subj "/C=US/ST=State/L=City/O=Organization/OU=Unit/CN=example.com"
fi

# Start de applicatie
if [ "$NODE_ENV" = "production" ]; then
    npm run build && npm run preview
else
    npm run dev
fi
