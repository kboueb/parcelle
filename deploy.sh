#!/bin/bash
set -e

echo "=== Parcelles - Deployment ==="

# Check Docker
if ! command -v docker &> /dev/null; then
    echo "Docker not found. Installing..."
    curl -fsSL https://get.docker.com | sh
    sudo usermod -aG docker $USER
    echo "Docker installed. Log out and back in, then re-run this script."
    exit 1
fi

# Check Docker Compose
if ! docker compose version &> /dev/null; then
    echo "Docker Compose plugin not found."
    exit 1
fi

# Create .env.production if not exists
if [ ! -f .env.production ]; then
    echo "Creating .env.production..."
    SECRET=$(openssl rand -hex 32)
    DB_PASS=$(openssl rand -hex 16)
    SERVER_IP=$(curl -s ifconfig.me 2>/dev/null || echo "YOUR_SERVER_IP")
    cat > .env.production <<EOF
DB_PASSWORD=$DB_PASS
NEXTAUTH_SECRET=$SECRET
NEXTAUTH_URL=http://$SERVER_IP
EOF
    echo ".env.production created with NEXTAUTH_URL=http://$SERVER_IP"
    echo "Edit it if needed: nano .env.production"
fi

# Create nginx dirs
mkdir -p nginx/certs nginx/www

# Build and start
echo "Building and starting containers..."
docker compose --env-file .env.production up -d --build

# Wait for DB
echo "Waiting for PostgreSQL..."
sleep 5

# Run migrations
echo "Running Prisma migrations..."
docker compose exec -T app npx prisma migrate deploy

echo ""
echo "=== Done! ==="
echo ""
SERVER_IP=$(curl -s ifconfig.me 2>/dev/null || echo "YOUR_SERVER_IP")
echo "App accessible at: http://$SERVER_IP"
echo ""
echo "To seed the database:"
echo "  curl -X POST http://$SERVER_IP/api/seed"
echo ""
echo "Useful commands:"
echo "  docker compose logs -f app       # View app logs"
echo "  docker compose exec app sh       # Shell into container"
echo "  docker compose down              # Stop all"
echo "  docker compose up -d --build     # Rebuild & restart"
echo ""
echo "When you get a domain:"
echo "  1. Point DNS A record to $SERVER_IP"
echo "  2. Edit nginx/default.conf (uncomment HTTPS block)"
echo "  3. Run: docker compose run --rm certbot certonly --nginx -d ton-domaine.com"
echo "  4. docker compose exec app sh -c 'NEXTAUTH_URL=https://ton-domaine.com node server.js'"
echo "     Or update .env.production and docker compose up -d"
