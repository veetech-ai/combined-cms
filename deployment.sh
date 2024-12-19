#!/bin/bash

# Exit script on error
set -e

# Check if DOMAIN and EMAIL are provided as arguments
if [ -z "$1" ]; then
  echo "Error: DOMAIN is required. Usage: $0 <domain> <email>"
  exit 1
fi

if [ -z "$2" ]; then
  echo "Error: EMAIL is required. Usage: $0 <domain> <email>"
  exit 1
fi

if [ -z "$3" ]; then
  echo "Error: PORT is required. Usage: $0 <domain> <email> <port>"
  exit 1
fi

# Environment Variables from command line arguments
DOMAIN="$1"
EMAIL="$2"
PORT="$3"

NGINX_CONF="/etc/nginx/sites-available/$DOMAIN"
NGINX_LINK="/etc/nginx/sites-enabled/$DOMAIN"
WEB_ROOT="/var/www/$DOMAIN/html"

# Function to check for root privileges
if [ "$EUID" -ne 0 ]; then
    echo "Please run as root or use sudo."
    exit 1
fi

# Update system and install required packages
echo "Installing required packages..."
apt update
apt install -y nginx certbot python3-certbot-nginx

# Step 1: Clean Existing Configuration
echo "Removing existing Nginx configurations..."
sudo rm -f "$NGINX_LINK"
sudo rm -f "$NGINX_CONF"

# Step 2: Verify Domain DNS
echo "Verifying domain DNS..."
dig "$DOMAIN"
if [ $? -ne 0 ]; then
  echo "DNS verification failed. Please ensure the domain is correctly pointing to your server's public IP."
  exit 1
fi

# Step 3: Create a Temporary HTTP Configuration for Certbot
echo "Creating temporary HTTP configuration for Certbot verification..."
cat <<EOL | sudo tee "$NGINX_CONF" > /dev/null
server {
    listen 80;
    server_name $DOMAIN www.$DOMAIN;

    location / {
        return 200 "Temporary HTTP server for Certbot verification";
    }
}
EOL

# Enable and test the configuration
echo "Enabling and testing Nginx configuration..."
sudo ln -s "$NGINX_CONF" "$NGINX_LINK"
sudo nginx -t
if [ $? -ne 0 ]; then
  echo "Nginx configuration test failed. Please check the configuration."
  exit 1
fi

# Reload Nginx to apply the changes
echo "Reloading Nginx..."
sudo systemctl reload nginx

# Step 4: Run Certbot to Generate SSL Certificates
echo "Running Certbot to generate SSL certificates..."
sudo certbot certonly --nginx -d "$DOMAIN" -d "www.$DOMAIN" --non-interactive --agree-tos --email "$EMAIL"
if [ $? -ne 0 ]; then
  echo "Certbot certificate generation failed. Please check the Certbot output for errors."
  exit 1
fi

# Step 5: Update Nginx Configuration with SSL and Proxy Settings
echo "Updating Nginx configuration with SSL settings..."
cat <<EOL | sudo tee "$NGINX_CONF" > /dev/null
server {
    listen 80;
    server_name $DOMAIN www.$DOMAIN;
    return 301 https://\$host\$request_uri;
}

server {
    listen 443 ssl;
    server_name $DOMAIN www.$DOMAIN;

    # Add this line to set maximum body size
    client_max_body_size 20M;

    ssl_certificate /etc/letsencrypt/live/$DOMAIN/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/$DOMAIN/privkey.pem;

    location / {
        proxy_pass http://localhost:$PORT; # Your backend server
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOL

# Reload Nginx to apply the SSL configuration
echo "Reloading Nginx..."
sudo nginx -t
if [ $? -ne 0 ]; then
  echo "Nginx configuration test failed after SSL update. Please check the configuration."
  exit 1
fi

sudo systemctl reload nginx

# Step 6: Set Up Firewall
echo "Setting up firewall to allow HTTP and HTTPS traffic..."
sudo ufw allow 'Nginx Full'
if [ $? -ne 0 ]; then
  echo "Failed to update the firewall. Please check UFW status and rules."
  exit 1
fi

echo "Nginx SSL configuration and firewall setup completed successfully."

# Print certificate paths
echo "SSL Certificate Path: /etc/letsencrypt/live/$DOMAIN/fullchain.pem"
echo "SSL Certificate Key Path: /etc/letsencrypt/live/$DOMAIN/privkey.pem"
