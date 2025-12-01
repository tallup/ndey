# 🚀 Quick WhatsApp Setup

## Choose Your Provider

### Option A: Twilio (Easiest - Recommended) ⭐

**Why Twilio?**
- Free trial with $15.50 credit
- Easy setup (5 minutes)
- Works immediately
- No business verification needed for testing

**Steps:**
1. Sign up: https://www.twilio.com/try-twilio
2. Get sandbox WhatsApp number (in Twilio Console)
3. Copy Account SID and Auth Token
4. Update `.env` file (see below)

### Option B: Meta WhatsApp Business API

**Why Meta?**
- Official WhatsApp API
- Better for production
- Requires business verification

**Steps:**
1. Go to https://developers.facebook.com/
2. Create app and add WhatsApp product
3. Get Phone Number ID and Access Token
4. Update `.env` file

---

## 📝 Configuration

### For Twilio (Recommended):

Edit `/home/taal/ecommerce-project/backend/.env`:

```env
WHATSAPP_PROVIDER=twilio
WHATSAPP_RECIPIENT_NUMBERS=3740280,3569074

TWILIO_ACCOUNT_SID=your_account_sid_here
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_WHATSAPP_FROM=whatsapp:+14155238886
```

**Get Twilio Credentials:**
1. Login to https://console.twilio.com/
2. Dashboard shows your **Account SID**
3. Click "Show" next to Auth Token to see **Auth Token**
4. Go to **Messaging** → **Try it out** → **Send a WhatsApp message**
5. Copy the WhatsApp number (format: `whatsapp:+14155238886`)

### For Meta:

Edit `/home/taal/ecommerce-project/backend/.env`:

```env
WHATSAPP_PROVIDER=meta
WHATSAPP_RECIPIENT_NUMBERS=3740280,3569074

META_PHONE_NUMBER_ID=your_phone_number_id
META_ACCESS_TOKEN=your_access_token
```

---

## 🧪 Test It!

After configuring, run:

```bash
cd /home/taal/ecommerce-project/backend
php artisan config:clear
php artisan whatsapp:test
```

---

## 📱 Important Notes

1. **Twilio Sandbox**: For testing, recipient numbers must join the sandbox first
   - Send "join [code]" to the Twilio WhatsApp number
   - Code is shown in Twilio Console

2. **Phone Numbers**: Make sure recipient numbers include country code
   - Example: `+1234567890` or `1234567890` (will auto-add +)

3. **Test Mode**: If no provider configured, messages log to `storage/logs/laravel.log`

---

## ✅ Quick Start (Copy-Paste Ready)

**For Twilio:**
```bash
cd /home/taal/ecommerce-project/backend
nano .env  # or use your preferred editor
```

Add these lines:
```env
WHATSAPP_PROVIDER=twilio
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_WHATSAPP_FROM=whatsapp:+14155238886
```

Then:
```bash
php artisan config:clear
php artisan whatsapp:test
```

---

Need help? Check `WHATSAPP_SETUP_GUIDE.md` for detailed instructions!


