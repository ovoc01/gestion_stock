#!/bin/bash

# --- Configuration ---
REPO_URL="git@github.com:your-username/your-repo.git"
VPS_USER="deploy_user"
VPS_IP="your_vps_ip"
APP_DIR="/path/to/your/app" 

# --- Get parameters ---
BRANCH="${1:-main}"  # Default to 'main' if not provided
COMMIT_MSG="${2:-"Automated deployment: $(date)"}" 

# --- Git Push ---
git add .
git commit -m "$COMMIT_MSG"
git push origin "$BRANCH"

# --- SSH & Deployment ---
ssh "$VPS_USER@$VPS_IP" << EOF
  cd "$APP_DIR"
  git pull origin "$BRANCH"
  docker-compose pull 
  docker-compose down 
  docker-compose up -d --build 
EOF

echo "Deployment complete!" 