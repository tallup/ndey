# Meta WhatsApp Business API Setup Guide

## 🚀 Step-by-Step Setup

### Step 1: Create Meta Developer Account

1. Go to https://developers.facebook.com/
2. Click **"Get Started"** or **"Log In"**
3. Use your Facebook account to log in

### Step 2: Create a New App

1. Click **"My Apps"** → **"Create App"**
2. Select **"Business"** as the app type
3. Fill in:
   - **App Name**: E-Commerce Store (or your preferred name)
   - **App Contact Email**: Your email
   - Click **"Create App"**

### Step 3: Add WhatsApp Product

1. In your app dashboard, find **"WhatsApp"** in the products list
2. Click **"Set up"** or **"Add Product"**
3. You'll be taken to the WhatsApp setup page

### Step 4: Get Your Credentials

#### A. Phone Number ID

1. In WhatsApp setup, go to **"API Setup"** tab
2. You'll see **"Phone number ID"** - copy this number
   - Example: `123456789012345`

#### B. Temporary Access Token (for testing)

1. On the same **"API Setup"** page
2. Find **"Temporary access token"**
3. Click **"Copy"** to copy the token
   - ⚠️ This token expires in 24 hours (for production, you'll need a permanent token)

#### C. Permanent Access Token (for production)

1. Go to **"WhatsApp"** → **"API Setup"**
2. Scroll to **"Access Tokens"**
3. Click **"Generate Token"**
4. Select your app and permissions
5. Copy the permanent token

### Step 5: Configure Laravel

Edit your `.env` file:

```env
WHATSAPP_PROVIDER=meta
WHATSAPP_RECIPIENT_NUMBERS=3740280,3569074

META_PHONE_NUMBER_ID=your_phone_number_id_here
META_ACCESS_TOKEN=your_access_token_here
```

**Important**: 
- Replace `your_phone_number_id_here` with your Phone Number ID
- Replace `your_access_token_here` with your Access Token
- For testing, use Temporary Token
- For production, use Permanent Token

### Step 6: Verify Phone Numbers

**Important**: Before you can send messages, you need to:

1. **Add recipient numbers to your Meta Business Account**
   - Go to Meta Business Settings
   - Add phone numbers that will receive messages
   - Verify them via SMS/call

2. **Or use test numbers** (for development):
   - Meta provides test numbers you can use
   - Check WhatsApp API documentation for test numbers

### Step 7: Test It!

```bash
cd /home/taal/ecommerce-project/backend
php artisan config:clear
php artisan whatsapp:test
```

### Step 8: Check Logs

```bash
tail -f storage/logs/laravel.log | grep -i whatsapp
```

---

## 📋 Quick Checklist

- [ ] Meta Developer account created
- [ ] App created with WhatsApp product
- [ ] Phone Number ID copied
- [ ] Access Token obtained (temporary or permanent)
- [ ] `.env` file updated with credentials
- [ ] Config cleared (`php artisan config:clear`)
- [ ] Test command run successfully
- [ ] Recipient numbers verified in Meta Business

---

## 🔧 Troubleshooting

### Error: "Invalid access token"
- **Solution**: Regenerate token in Meta Developer Console
- Make sure token hasn't expired (temporary tokens expire in 24 hours)

### Error: "Phone number not verified"
- **Solution**: 
  - Add recipient numbers to Meta Business Account
  - Verify them via SMS/call
  - Or use Meta's test numbers for development

### Error: "Permission denied"
- **Solution**: 
  - Check app permissions in Meta Developer Console
  - Make sure WhatsApp permissions are granted
  - Verify your app is in development mode (for testing)

### Error: "Rate limit exceeded"
- **Solution**: 
  - Meta has rate limits for WhatsApp messages
  - Check your usage in Meta Business Manager
  - Wait before sending more messages

---

## 📱 Phone Number Format

Meta WhatsApp API requires phone numbers in international format:
- ✅ Correct: `+1234567890` (with country code)
- ✅ Correct: `1234567890` (will auto-add +)
- ❌ Wrong: `123-456-7890` (with dashes)

The system automatically formats numbers, but make sure recipient numbers include country code.

---

## 🎯 Production Setup

For production use, you'll need:

1. **Business Verification**
   - Complete Meta Business verification
   - Provide business documents

2. **Permanent Access Token**
   - Generate permanent token (not temporary)
   - Store securely (consider using environment variables)

3. **Webhook Setup** (optional)
   - Set up webhook to receive incoming messages
   - Configure in Meta Developer Console

4. **Rate Limits**
   - Understand Meta's rate limits
   - Implement queuing for high volume

---

## 📚 Resources

- Meta WhatsApp API Docs: https://developers.facebook.com/docs/whatsapp
- API Reference: https://developers.facebook.com/docs/whatsapp/cloud-api
- Getting Started: https://developers.facebook.com/docs/whatsapp/cloud-api/get-started

---

## ✅ Testing

After setup, test with:

```bash
# Test latest order
php artisan whatsapp:test

# Test specific order
php artisan whatsapp:test 1

# Create real order via frontend
# Go to http://localhost:3000 and complete checkout
```

---

Need help? Check Meta Developer Console or WhatsApp API documentation!


