#!/bin/bash

echo "🚀 Personal Link Tree - Quick Start"
echo "===================================="
echo ""

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed."
    echo "Please install Docker first: https://docs.docker.com/get-docker/"
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
    echo "❌ Docker Compose is not installed."
    echo "Please install Docker Compose first: https://docs.docker.com/compose/install/"
    exit 1
fi

echo "✅ Docker and Docker Compose are installed"
echo ""

# Build and start containers
echo "🏗️  Building Docker image..."
docker-compose build

echo ""
echo "🚀 Starting application..."
docker-compose up -d

echo ""
echo "⏳ Waiting for application to start..."
sleep 5

# Check if container is running
if [ "$(docker ps -q -f name=personal-linktree)" ]; then
    echo ""
    echo "✅ Application is running!"
    echo ""
    echo "📝 Next steps:"
    echo "   1. Open your browser and visit: http://localhost:3000/setup"
    echo "   2. Complete the initial setup wizard"
    echo "   3. Login at: http://localhost:3000/admin/login"
    echo ""
    echo "📖 Useful commands:"
    echo "   View logs:    docker-compose logs -f"
    echo "   Stop app:     docker-compose down"
    echo "   Restart app:  docker-compose restart"
    echo ""
else
    echo ""
    echo "❌ Failed to start application"
    echo "   Check logs: docker-compose logs"
    exit 1
fi
