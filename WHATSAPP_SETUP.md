# WhatsApp Integration Setup

## Overview

The e-commerce system automatically sends WhatsApp notifications to your specified numbers (3740280 and 3569074) whenever a new order is created.

## Configuration

Add these settings to your `.env` file:

```env
WHATSAPP_API_URL=your_whatsapp_api_url
WHATSAPP_API_KEY=your_api_key
WHATSAPP_RECIPIENT_NUMBERS=3740280,3569074
```

## WhatsApp Service Providers

You can integrate with various WhatsApp services:

### Option 1: Twilio WhatsApp API

1. Sign up at [Twilio](https://www.twilio.com/)
2. Get your Account SID and Auth Token
3. Configure in `.env`:

```env
WHATSAPP_API_URL=https://api.twilio.com/2010-04-01/Accounts/{AccountSID}/Messages.json
WHATSAPP_API_KEY=your_twilio_auth_token
```

Update `WhatsAppService.php` to use Twilio format.

### Option 2: WhatsApp Business API (Meta)

1. Set up WhatsApp Business API through Meta
2. Get your Phone Number ID and Access Token
3. Configure in `.env`:

```env
WHATSAPP_API_URL=https://graph.facebook.com/v18.0/{Phone-Number-ID}/messages
WHATSAPP_API_KEY=your_access_token
```

### Option 3: Custom HTTP Gateway

If you have a custom WhatsApp gateway, configure:

```env
WHATSAPP_API_URL=https://your-gateway.com/api/send
WHATSAPP_API_KEY=your_api_key
```

### Option 4: Development/Testing (No API)

If no API is configured, messages will be logged to Laravel logs (`storage/logs/laravel.log`) for testing purposes.

## Message Format

When an order is created, a formatted message is sent with:

- 🛒 Order header
- Order number
- Order status
- Total amount
- Customer details (name, phone, email)
- Shipping address
- Order items with quantities and prices
- Payment method and status

Example message:
```
🛒 *New Order Received*

Order Number: *ORD-ABC12345*
Status: *pending*
Total: *$25.50*

*Customer Details:*
Name: John Doe
Phone: 1234567890
Email: john@example.com

*Shipping Address:*
123 Main St
City, State 12345

*Order Items:*
• Transparent Plastic Bowl - Small (Qty: 2) - $5.00
• Plastic Water Bottle - 500ml (Qty: 1) - $3.00

*Payment:*
Method: cash
Status: pending
```

## Testing

### Test Order Creation via API

```bash
curl -X POST http://localhost:8000/api/v1/orders \
  -H "Content-Type: application/json" \
  -d '{
    "shipping_address": {
      "name": "Test Customer",
      "phone": "1234567890",
      "email": "test@example.com",
      "address": "123 Test St",
      "city": "Test City",
      "state": "Test State",
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

### Check Logs

If WhatsApp API is not configured, check logs:

```bash
tail -f storage/logs/laravel.log
```

## Customization

To customize the message format, edit:
- `app/Services/WhatsAppService.php` → `formatOrderMessage()` method

To change recipients, update `.env`:
```env
WHATSAPP_RECIPIENT_NUMBERS=3740280,3569074,another_number
```

## Troubleshooting

1. **Messages not sending:**
   - Check `.env` configuration
   - Verify API credentials
   - Check Laravel logs for errors

2. **Wrong phone number format:**
   - Update `formatPhoneNumber()` method in `WhatsAppService.php`
   - Add country code if needed

3. **API errors:**
   - Verify API endpoint URL
   - Check API key permissions
   - Review API documentation for correct request format

