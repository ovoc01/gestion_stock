#!/bin/bash
sleep 5
# Run your database initialization scripts here
psql -U postgres -d gestion_stock_dev -f /docker-entrypoint-initdb.d/my-script.sql
# ... any other initialization commands