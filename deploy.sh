#!/bin/bash
git add .
git commit -m "$1"
git push -u origin $2
ssh ssdebian@192.168.0.13
cd gestion_stock
docker-compose up --build