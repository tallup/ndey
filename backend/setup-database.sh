#!/bin/bash

echo "🚀 Setting up E-Commerce Database..."

# Check if .env exists
if [ ! -f .env ]; then
    echo "📝 Creating .env file from .env.example..."
    cp .env.example .env
    echo "✅ .env file created"
else
    echo "✅ .env file already exists"
fi

# Generate application key if not set
if ! grep -q "APP_KEY=base64:" .env; then
    echo "🔑 Generating application key..."
    php artisan key:generate
    echo "✅ Application key generated"
else
    echo "✅ Application key already exists"
fi

# Prompt for database credentials
echo ""
echo "📊 Database Configuration:"
read -p "Database name [ecommerce]: " DB_NAME
DB_NAME=${DB_NAME:-ecommerce}

read -p "Database user [root]: " DB_USER
DB_USER=${DB_USER:-root}

read -p "Database password: " DB_PASS
read -p "Database host [127.0.0.1]: " DB_HOST
DB_HOST=${DB_HOST:-127.0.0.1}

read -p "Database port [3306]: " DB_PORT
DB_PORT=${DB_PORT:-3306}

# Update .env file
echo "📝 Updating .env file with database credentials..."
sed -i "s/DB_DATABASE=.*/DB_DATABASE=$DB_NAME/" .env
sed -i "s/DB_USERNAME=.*/DB_USERNAME=$DB_USER/" .env
sed -i "s/DB_PASSWORD=.*/DB_PASSWORD=$DB_PASS/" .env
sed -i "s/DB_HOST=.*/DB_HOST=$DB_HOST/" .env
sed -i "s/DB_PORT=.*/DB_PORT=$DB_PORT/" .env

echo "✅ Database configuration updated"

# Create database if it doesn't exist
echo ""
echo "🗄️  Creating database (if it doesn't exist)..."
mysql -u"$DB_USER" -p"$DB_PASS" -h"$DB_HOST" -P"$DB_PORT" -e "CREATE DATABASE IF NOT EXISTS $DB_NAME;" 2>/dev/null || echo "⚠️  Could not create database automatically. Please create it manually."

# Run migrations
echo ""
echo "🔄 Running migrations..."
php artisan migrate --force

# Create storage link
echo ""
echo "🔗 Creating storage link..."
php artisan storage:link

# Run seeders
echo ""
read -p "Do you want to seed the database with sample data? (y/n): " SEED_DB
if [[ $SEED_DB == "y" || $SEED_DB == "Y" ]]; then
    echo "🌱 Seeding database..."
    php artisan db:seed
    echo "✅ Database seeded with sample data"
fi

# Install Filament
echo ""
read -p "Do you want to install Filament admin panel? (y/n): " INSTALL_FILAMENT
if [[ $INSTALL_FILAMENT == "y" || $INSTALL_FILAMENT == "Y" ]]; then
    echo "📦 Installing Filament..."
    php artisan filament:install --panels
    echo "✅ Filament installed"
    
    echo ""
    read -p "Do you want to create an admin user? (y/n): " CREATE_ADMIN
    if [[ $CREATE_ADMIN == "y" || $CREATE_ADMIN == "Y" ]]; then
        php artisan make:filament-user
    fi
fi

echo ""
echo "✅ Database setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. Configure WhatsApp settings in .env file:"
echo "   WHATSAPP_API_URL=your_api_url"
echo "   WHATSAPP_API_KEY=your_api_key"
echo "   WHATSAPP_RECIPIENT_NUMBERS=3740280,3569074"
echo ""
echo "2. Start the Laravel server:"
echo "   php artisan serve"
echo ""
echo "3. Access admin panel at: http://localhost:8000/admin"

