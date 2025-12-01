# WhatsApp Setup Guide - Step by Step

## 🎯 Quick Setup Options

Choose one of these methods to get WhatsApp working:

---

## Option 1: Twilio WhatsApp API (Recommended - Easiest)

### Step 1: Sign up for Twilio
1. Go to https://www.twilio.com/
2. Sign up for a free account (includes $15.50 credit)
3. Verify your email and phone number

### Step 2: Get WhatsApp Sandbox Number
1. Log into Twilio Console
2. Go to **Messaging** → **Try it out** → **Send a WhatsApp message**
3. Follow instructions to join the sandbox (send "join [code]" to the number)
4. Note your sandbox WhatsApp number (format: `whatsapp:+14155238886`)

### Step 3: Get Your Credentials
1. In Twilio Console, go to **Account** → **API Keys & Tokens**
2. Copy your **Account SID**
3. Copy your **Auth Token**

### Step 4: Configure Laravel
Edit your `.env` file:

```env
WHATSAPP_PROVIDER=twilio
WHATSAPP_RECIPIENT_NUMBERS=3740280,3569074

TWILIO_ACCOUNT_SID=your_account_sid_here
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_WHATSAPP_FROM=whatsapp:+14155238886
```

**Note**: Replace `+14155238886` with your actual Twilio WhatsApp sandbox number.

### Step 5: Test It!
```bash
cd backend
php artisan whatsapp:test
```

---

## Option 2: Meta WhatsApp Business API (Official)

### Step 1: Create Meta App
1. Go to https://developers.facebook.com/
2. Click **My Apps** → **Create App**
3. Choose **Business** type
4. Add **WhatsApp** product

### Step 2: Get Phone Number ID
1. In your app, go to **WhatsApp** → **API Setup**
2. Copy your **Phone Number ID**
3. Copy your **Temporary Access Token** (or create a permanent one)

### Step 3: Configure Laravel
Edit your `.env` file:

```env
WHATSAPP_PROVIDER=meta
WHATSAPP_RECIPIENT_NUMBERS=3740280,3569074

META_PHONE_NUMBER_ID=your_phone_number_id
META_ACCESS_TOKEN=your_access_token
```

**Note**: For production, you'll need to:
- Verify your business
- Get a permanent access token
- Set up webhooks

### Step 4: Test It!
```bash
cd backend
php artisan whatsapp:test
```

---

## Option 3: Generic HTTP API (Custom Gateway)

If you have your own WhatsApp gateway:

### Step 1: Configure Laravel
Edit your `.env` file:

```env
WHATSAPP_PROVIDER=http
WHATSAPP_API_URL=https://your-gateway.com/api/send
WHATSAPP_API_KEY=your_api_key
WHATSAPP_RECIPIENT_NUMBERS=3740280,3569074
```

### Step 2: Test It!
```bash
cd backend
php artisan whatsapp:test
```

---

## Option 4: Development Mode (Logs Only)

For testing without an API:

```env
WHATSAPP_PROVIDER=log
WHATSAPP_RECIPIENT_NUMBERS=3740280,3569074
```

Messages will be logged to `storage/logs/laravel.log`

---

## 📱 Phone Number Formatting

The system automatically formats phone numbers. Make sure your recipient numbers include country code:

- ✅ Correct: `3740280` (will add + if needed)
- ✅ Better: `+1234567890` (full format)
- ❌ Wrong: `123-456-7890` (will be cleaned)

To add country code automatically, edit `formatPhoneNumber()` in `WhatsAppService.php`.

---

## 🧪 Testing

### Test Command
```bash
cd backend
php artisan whatsapp:test
```

### Test with Specific Order
```bash
php artisan whatsapp:test 1
```

### Check Logs
```bash
tail -f storage/logs/laravel.log | grep -i whatsapp
```

### Create Test Order via Frontend
1. Go to http://localhost:3000
2. Add products to cart
3. Complete checkout
4. WhatsApp notification will be sent automatically!

---

## 🔧 Troubleshooting

### Twilio Issues
- **Error: "From number not verified"**
  - Make sure you're using the sandbox number format: `whatsapp:+14155238886`
  - Join the sandbox first by sending the code to the number

- **Error: "To number not in sandbox"**
  - Add recipient numbers to Twilio sandbox
  - Send "join [code]" from recipient numbers

### Meta Issues
- **Error: "Invalid access token"**
  - Regenerate access token in Meta Developer Console
  - Make sure token has WhatsApp permissions

- **Error: "Phone number not verified"**
  - Complete business verification in Meta
  - Use verified phone number ID

### General Issues
- **Messages not sending?**
  - Check `.env` file has correct values
  - Run `php artisan config:clear`
  - Check logs: `storage/logs/laravel.log`

- **Wrong phone format?**
  - Update `formatPhoneNumber()` method
  - Add country code if needed

---

## ✅ Verification Checklist

- [ ] Provider selected (`WHATSAPP_PROVIDER` in `.env`)
- [ ] Credentials configured (API keys, tokens, etc.)
- [ ] Recipient numbers set (`WHATSAPP_RECIPIENT_NUMBERS`)
- [ ] Test command runs successfully
- [ ] Logs show successful sends
- [ ] Actual WhatsApp messages received

---

## 🚀 Quick Start (Twilio - Recommended)

1. **Sign up**: https://www.twilio.com/try-twilio
2. **Get sandbox number**: Twilio Console → Messaging → WhatsApp
3. **Add to `.env`**:
   ```env
   WHATSAPP_PROVIDER=twilio
   TWILIO_ACCOUNT_SID=ACxxxxx
   TWILIO_AUTH_TOKEN=your_token
   TWILIO_WHATSAPP_FROM=whatsapp:+14155238886
   ```
4. **Test**: `php artisan whatsapp:test`
5. **Done!** 🎉

---

Need help? Check the logs or test with the command above!


