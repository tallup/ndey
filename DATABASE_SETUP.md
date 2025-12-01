# Database Setup Guide

## Quick Setup (Automated)

Run the setup script:

```bash
cd backend
./setup-database.sh
```

## Manual Setup

### 1. Install Dependencies

```bash
cd backend
composer install
```

### 2. Configure Environment

```bash
cp .env.example .env
php artisan key:generate
```

### 3. Update Database Configuration in `.env`

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=ecommerce
DB_USERNAME=root
DB_PASSWORD=your_password
```

### 4. Create Database

```bash
mysql -u root -p
CREATE DATABASE ecommerce;
exit;
```

### 5. Run Migrations

```bash
php artisan migrate
```

### 6. Create Storage Link

```bash
php artisan storage:link
```

### 7. Seed Database (Optional)

```bash
php artisan db:seed
```

This will create:
- Admin user (email: admin@example.com, password: password)
- Sample categories (Bowls, Cups, Spoons, Plates, Lunch Bowls, Bottles, Gift Bags)
- Sample products

### 8. Install Filament Admin Panel

```bash
php artisan filament:install --panels
php artisan make:filament-user
```

### 9. Configure WhatsApp (in `.env`)

```env
WHATSAPP_API_URL=your_whatsapp_api_url
WHATSAPP_API_KEY=your_api_key
WHATSAPP_RECIPIENT_NUMBERS=3740280,3569074
```

**Note:** If you don't have a WhatsApp API configured yet, the system will log messages to Laravel logs for testing. You can integrate with:
- Twilio WhatsApp API
- WhatsApp Business API
- Custom WhatsApp gateway

## Product Fields

Your products now support:
- **Product Type**: Bowl, Cup, Spoon, Plate, Lunch Bowl, Bottle, Gift Bag, Other
- **Size**: Small, Medium, Large
- **Capacity**: For bottles (250ml, 350ml, 500ml)
- **Material**: e.g., Transparent Plastic, Plastic
- **Color**: e.g., Clear, White, Assorted

## WhatsApp Integration

When a new order is created, WhatsApp notifications will be automatically sent to:
- 3740280
- 3569074

The notification includes:
- Order number
- Customer details
- Shipping address
- Order items with quantities
- Total amount
- Payment information

## Testing Orders

You can test the order creation via API:

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

## Troubleshooting

### Migration Errors

If you get migration errors, you may need to refresh:

```bash
php artisan migrate:fresh --seed
```

### WhatsApp Not Working

1. Check `.env` file has correct WhatsApp configuration
2. Check Laravel logs: `storage/logs/laravel.log`
3. If no API is configured, messages will be logged instead of sent

### Storage Link Issues

```bash
php artisan storage:link
```

Make sure `storage/app/public` directory exists and has proper permissions.

