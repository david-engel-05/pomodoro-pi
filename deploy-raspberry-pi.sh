#!/bin/bash

# 🍅 Pomodoro Pi - Raspberry Pi Deployment Script
# This script pulls and runs the latest Docker image from GitHub Container Registry

set -e

echo "🍅 Pomodoro Pi - Raspberry Pi Deployment"
echo "========================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker is not installed. Please install Docker first.${NC}"
    echo "Install Docker: curl -fsSL https://get.docker.com -o get-docker.sh && sh get-docker.sh"
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo -e "${RED}❌ Docker Compose is not installed. Please install Docker Compose first.${NC}"
    echo "Install Docker Compose: sudo apt-get install docker-compose-plugin"
    exit 1
fi

# Create environment file if it doesn't exist
if [ ! -f .env ]; then
    echo -e "${YELLOW}⚠️  Creating .env file...${NC}"
    cp .env.example .env
    echo -e "${BLUE}📝 Please edit .env file with your Supabase credentials (optional for local-only use)${NC}"
fi

# Pull latest image
echo -e "${BLUE}📥 Pulling latest Docker image...${NC}"
docker pull ghcr.io/david-engel-05/pomodoro-pi:latest

# Stop existing container if running
if [ "$(docker ps -q -f name=pomodoro-pi)" ]; then
    echo -e "${YELLOW}🛑 Stopping existing container...${NC}"
    docker-compose -f docker-compose.prod.yml down
fi

# Start the application
echo -e "${BLUE}🚀 Starting Pomodoro Pi...${NC}"
docker-compose -f docker-compose.prod.yml up -d

# Wait for container to be healthy
echo -e "${BLUE}⏳ Waiting for application to start...${NC}"
timeout=60
counter=0
while [ $counter -lt $timeout ]; do
    if curl -f http://localhost:3000/api/health >/dev/null 2>&1; then
        break
    fi
    sleep 2
    counter=$((counter + 2))
    echo -n "."
done

if [ $counter -ge $timeout ]; then
    echo -e "\n${RED}❌ Application failed to start within ${timeout} seconds${NC}"
    echo -e "${YELLOW}📋 Check logs: docker-compose -f docker-compose.prod.yml logs${NC}"
    exit 1
fi

echo -e "\n${GREEN}✅ Pomodoro Pi is running successfully!${NC}"
echo ""
echo -e "${GREEN}🌐 Application URL: http://localhost:3000${NC}"
echo -e "${GREEN}🌐 Network URL: http://$(hostname -I | awk '{print $1}'):3000${NC}"
echo ""
echo -e "${BLUE}📋 Useful commands:${NC}"
echo -e "  View logs: ${YELLOW}docker-compose -f docker-compose.prod.yml logs -f${NC}"
echo -e "  Stop app:  ${YELLOW}docker-compose -f docker-compose.prod.yml down${NC}"
echo -e "  Restart:   ${YELLOW}docker-compose -f docker-compose.prod.yml restart${NC}"
echo -e "  Update:    ${YELLOW}./deploy-raspberry-pi.sh${NC}"
echo ""
echo -e "${GREEN}🎉 Happy Pomodoro sessions! 🍅${NC}"