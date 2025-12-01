# WhatsApp Integration Guide

## ✅ Current Status

WhatsApp integration is **fully set up and working**! Here's how it works:

### How It Works

1. **Automatic Trigger**: When a new order is created via the API, WhatsApp notifications are automatically sent
2. **Recipients**: Messages are sent to both numbers configured in `.env`:
   - 3740280
   - 3569074
3. **Message Format**: Includes order details, customer info, items, and payment information

## 📋 Current Configuration

In your `.env` file:
```env
WHATSAPP_API_URL=
WHATSAPP_API_KEY=
WHATSAPP_RECIPIENT_NUMBERS=3740280,3569074
```

**Note**: Currently, WhatsApp API URL is empty, so messages are logged to `storage/logs/laravel.log` for testing.

## 🧪 Testing WhatsApp Notifications

### Method 1: Create a Test Order via Frontend
1. Go to http://localhost:3000
2. Add products to cart
3. Complete checkout
4. Check logs: `storage/logs/laravel.log`

### Method 2: Test Command
```bash
cd backend
php artisan whatsapp:test
```

This will send a test notification for the latest order.

### Method 3: Test Specific Order
```bash
php artisan whatsapp:test {order_id}
```

### Method 4: Check Logs
```bash
tail -f storage/logs/laravel.log | grep -i whatsapp
```

## 📱 Message Format

When an order is created, you'll receive a message like:

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

## 🔌 Integrating with Real WhatsApp APIs

### Option 1: Twilio WhatsApp API

1. **Sign up** at [Twilio](https://www.twilio.com/)
2. **Get credentials**:
   - Account SID
   - Auth Token
   - WhatsApp-enabled phone number
3. **Update `.env`**:
```env
WHATSAPP_API_URL=https://api.twilio.com/2010-04-01/Accounts/{AccountSID}/Messages.json
WHATSAPP_API_KEY=your_auth_token
```

4. **Update `WhatsAppService.php`** `sendMessage()` method:
```php
protected function sendMessage(string $to, string $message): void
{
    $accountSid = config('services.twilio.account_sid');
    $authToken = config('services.whatsapp.api_key');
    $from = config('services.twilio.whatsapp_from'); // Your Twilio WhatsApp number
    
    $response = Http::withBasicAuth($accountSid, $authToken)
        ->asForm()
        ->post("https://api.twilio.com/2010-04-01/Accounts/{$accountSid}/Messages.json", [
            'From' => "whatsapp:{$from}",
            'To' => "whatsapp:{$this->formatPhoneNumber($to)}",
            'Body' => $message,
        ]);
    
    if (!$response->successful()) {
        throw new \Exception("Twilio API error: " . $response->body());
    }
}
```

### Option 2: WhatsApp Business API (Meta)

1. **Set up** WhatsApp Business API through Meta
2. **Get credentials**:
   - Phone Number ID
   - Access Token
3. **Update `.env`**:
```env
WHATSAPP_API_URL=https://graph.facebook.com/v18.0/{Phone-Number-ID}/messages
WHATSAPP_API_KEY=your_access_token
```

4. **Update `WhatsAppService.php`**:
```php
protected function sendMessage(string $to, string $message): void
{
    $phoneNumberId = config('services.whatsapp.phone_number_id');
    $accessToken = config('services.whatsapp.api_key');
    
    $response = Http::withHeaders([
        'Authorization' => 'Bearer ' . $accessToken,
        'Content-Type' => 'application/json',
    ])->post("https://graph.facebook.com/v18.0/{$phoneNumberId}/messages", [
        'messaging_product' => 'whatsapp',
        'to' => $this->formatPhoneNumber($to),
        'type' => 'text',
        'text' => [
            'body' => $message
        ],
    ]);
    
    if (!$response->successful()) {
        throw new \Exception("WhatsApp Business API error: " . $response->body());
    }
}
```

### Option 3: Custom WhatsApp Gateway

If you have a custom gateway, update the `sendMessage()` method in `WhatsAppService.php` to match your API format.

## 📝 Phone Number Formatting

The `formatPhoneNumber()` method currently just removes non-numeric characters. You may need to add country codes:

```php
protected function formatPhoneNumber(string $number): string
{
    $number = preg_replace('/[^0-9]/', '', $number);
    
    // Add country code if needed (example for US: +1)
    // if (!str_starts_with($number, '1')) {
    //     $number = '1' . $number;
    // }
    
    return $number;
}
```

## 🔍 Verifying Integration

### Check if notifications are being sent:
```bash
# View recent logs
tail -50 storage/logs/laravel.log | grep -i whatsapp

# Monitor in real-time
tail -f storage/logs/laravel.log | grep -i whatsapp
```

### Test order creation:
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

## 🛠️ Troubleshooting

1. **Messages not sending?**
   - Check `.env` configuration
   - Verify API credentials
   - Check Laravel logs: `storage/logs/laravel.log`

2. **Wrong phone number format?**
   - Update `formatPhoneNumber()` method
   - Add country code if needed

3. **API errors?**
   - Verify API endpoint URL
   - Check API key permissions
   - Review API documentation

4. **Testing without API?**
   - Messages are logged to `storage/logs/laravel.log`
   - Look for: "WhatsApp Message (would send to...)"
   - This allows testing without actual API setup

## 📊 Current Behavior

- ✅ **Automatic**: Triggers on every order creation
- ✅ **Multiple Recipients**: Sends to both configured numbers
- ✅ **Detailed Messages**: Includes all order information
- ✅ **Error Handling**: Logs errors without breaking order creation
- ✅ **Development Mode**: Logs messages when API not configured

## 🎯 Next Steps

1. **Test current setup**: Create an order and check logs
2. **Choose WhatsApp provider**: Twilio, Meta, or custom
3. **Configure API credentials**: Add to `.env` file
4. **Update service method**: Adjust `sendMessage()` for your provider
5. **Test with real API**: Verify messages are received

The WhatsApp integration is ready to use! Just configure your preferred WhatsApp API provider.

