# Quick Start Guide

## 🚀 Getting Started

### Step 1: Set Up Backend Database

```bash
cd backend

# Copy environment file
cp .env.example .env

# Generate app key
php artisan key:generate

# Edit .env and configure your database:
# DB_DATABASE=ecommerce
# DB_USERNAME=root
# DB_PASSWORD=your_password

# Run migrations
php artisan migrate

# Seed database with sample data
php artisan db:seed

# Create storage link
php artisan storage:link

# Install Filament admin panel
php artisan filament:install --panels

# Create admin user
php artisan make:filament-user
```

### Step 2: Configure WhatsApp (Optional for now)

Edit `.env` and add:
```env
WHATSAPP_API_URL=
WHATSAPP_API_KEY=
WHATSAPP_RECIPIENT_NUMBERS=3740280,3569074
```

**Note:** If no API is configured, WhatsApp messages will be logged to `storage/logs/laravel.log` for testing.

### Step 3: Start Backend Server

```bash
php artisan serve
```

Backend will run on: `http://localhost:8000`
Admin panel: `http://localhost:8000/admin`

### Step 4: Set Up Frontend

```bash
cd ../frontend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env.local

# Start development server
npm run dev
```

Frontend will run on: `http://localhost:3000`

## 📦 What's Included

### Product Types Supported
- ✅ Bowls (Small, Medium)
- ✅ Cups
- ✅ Spoons
- ✅ Plates
- ✅ Lunch Bowls
- ✅ Bottles (250ml, 350ml, 500ml)
- ✅ Gift Bags

### Product Attributes
- Product Type
- Size (Small, Medium, Large)
- Capacity (for bottles)
- Material (e.g., Transparent Plastic)
- Color (e.g., Clear, White, Assorted)

### Features
- ✅ Product management via Filament admin
- ✅ Category management
- ✅ Order creation API
- ✅ WhatsApp notifications (to 3740280 and 3569074)
- ✅ Modern Next.js frontend
- ✅ RESTful API endpoints

## 🧪 Test Order Creation

```bash
curl -X POST http://localhost:8000/api/v1/orders \
  -H "Content-Type: application/json" \
  -d '{
    "shipping_address": {
      "name": "John Doe",
      "phone": "1234567890",
      "email": "john@example.com",
      "address": "123 Main St",
      "city": "City",
      "state": "State",
      "postal_code": "12345"
    },
    "payment_method": "cash",
    "items": [
      {
        "product_id": 1,
        "quantity": 2
      }
    ]
  }'
```

## 📚 Documentation

- `DATABASE_SETUP.md` - Detailed database setup
- `WHATSAPP_SETUP.md` - WhatsApp integration guide
- `SETUP.md` - Full setup instructions

## 🔧 Default Credentials

After seeding:
- **Admin Email:** admin@example.com
- **Admin Password:** password (change this!)

## 📱 WhatsApp Integration

When an order is created, notifications are automatically sent to:
- 3740280
- 3569074

The notification includes order details, customer info, and items.

## 🎯 Next Steps

1. Configure your WhatsApp API (see `WHATSAPP_SETUP.md`)
2. Customize product categories
3. Add more products via admin panel
4. Customize frontend design
5. Add payment gateway integration
6. Set up user authentication

