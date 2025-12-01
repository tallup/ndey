# 🚀 Meta WhatsApp Business API - Quick Setup Steps

## Step-by-Step Instructions

### 1️⃣ Create Meta Developer Account
- Go to: https://developers.facebook.com/
- Click **"Get Started"** or log in with Facebook
- Accept terms and create account

### 2️⃣ Create App
- Click **"My Apps"** → **"Create App"**
- Select **"Business"** type
- Enter app name: `E-Commerce Store`
- Enter contact email
- Click **"Create App"**

### 3️⃣ Add WhatsApp Product
- In app dashboard, find **"WhatsApp"** product
- Click **"Set up"** or **"Add Product"**
- You'll see WhatsApp setup page

### 4️⃣ Get Your Credentials

#### Phone Number ID:
1. Go to **"API Setup"** tab
2. Find **"Phone number ID"** 
3. Copy the number (looks like: `123456789012345`)

#### Access Token:
1. On same page, find **"Temporary access token"**
2. Click **"Copy"** 
   - ⚠️ Temporary tokens expire in 24 hours
   - For production, generate permanent token later

### 5️⃣ Update .env File

Edit: `/home/taal/ecommerce-project/backend/.env`

Replace these lines:
```env
META_PHONE_NUMBER_ID=YOUR_PHONE_NUMBER_ID_HERE
META_ACCESS_TOKEN=YOUR_ACCESS_TOKEN_HERE
```

With your actual values:
```env
META_PHONE_NUMBER_ID=123456789012345
META_ACCESS_TOKEN=EAAxxxxxxxxxxxxxxxxxxxxx
```

### 6️⃣ Clear Config & Test

```bash
cd /home/taal/ecommerce-project/backend
php artisan config:clear
php artisan whatsapp:test
```

### 7️⃣ Verify Setup

Check logs:
```bash
tail -f storage/logs/laravel.log | grep -i whatsapp
```

---

## ⚠️ Important Notes

### Phone Number Verification
- **For testing**: Meta provides test numbers you can use
- **For production**: You need to verify recipient numbers in Meta Business Manager
- Recipient numbers must be added to your Meta Business Account

### Access Token Types
- **Temporary Token**: Expires in 24 hours, good for testing
- **Permanent Token**: For production, generate in Meta Developer Console

### Rate Limits
- Meta has rate limits on WhatsApp messages
- Check usage in Meta Business Manager
- For high volume, implement message queuing

---

## 🔧 Troubleshooting

### "Invalid access token"
→ Regenerate token in Meta Developer Console

### "Phone number not verified"  
→ Add recipient numbers to Meta Business Account

### "Permission denied"
→ Check app permissions, ensure WhatsApp is enabled

---

## ✅ Quick Test

After setup:
```bash
php artisan whatsapp:test
```

Create real order:
1. Go to http://localhost:3000
2. Add products to cart
3. Complete checkout
4. WhatsApp notification sent automatically!

---

## 📚 Resources

- Meta Developer Console: https://developers.facebook.com/
- WhatsApp API Docs: https://developers.facebook.com/docs/whatsapp
- API Reference: https://developers.facebook.com/docs/whatsapp/cloud-api

---

**Ready?** Get your credentials from Meta Developer Console and update `.env` file!


