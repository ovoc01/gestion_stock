#!/bin/bash

# --- Configuration ---
REPO_URL="git@github.com:ovoc01/gestion_stock.git"
VPS_USER="zephyr"
VPS_IP="192.168.1.100"
APP_DIR="/home/zephyr/gestion_stock" 

# --- Get parameters ---
BRANCH="${1:-main}"  # Default to 'main' if not provided
COMMIT_MSG="${2:-"Automated deployment: $(date)"}" 

# --- Git Push ---
#git add .
#git commit -m "$COMMIT_MSG"
#git push origin "$BRANCH"

# --- SSH & Deployment ---
ssh "$VPS_USER@$VPS_IP" << EOF
 pwd
  cd "$APP_DIR"
  git pull origin "$BRANCH"
  docker-compose pull 
  docker-compose down 
  docker-compose up -d --build 
EOF

echo "Deployment complete!" 