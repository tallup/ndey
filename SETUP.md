# Setup Guide

## Prerequisites

- PHP 8.2 or higher
- Composer
- Node.js 18+ and npm
- MySQL/PostgreSQL database
- Laravel CLI (optional but recommended)

## Backend Setup (Laravel + Filament)

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install PHP dependencies:**
   ```bash
   composer install
   ```

3. **Set up environment file:**
   ```bash
   cp .env.example .env
   php artisan key:generate
   ```

4. **Configure database in `.env`:**
   ```env
   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=ecommerce
   DB_USERNAME=root
   DB_PASSWORD=your_password
   ```

5. **Run migrations:**
   ```bash
   php artisan migrate
   ```

6. **Install Filament:**
   ```bash
   php artisan filament:install --panels
   ```

7. **Create storage link:**
   ```bash
   php artisan storage:link
   ```

8. **Create admin user:**
   ```bash
   php artisan make:filament-user
   ```

9. **Start Laravel server:**
   ```bash
   php artisan serve
   ```
   Backend will run on `http://localhost:8000`
   Admin panel: `http://localhost:8000/admin`

## Frontend Setup (Next.js)

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment file:**
   ```bash
   cp .env.example .env.local
   ```

4. **Update `.env.local` with your API URL:**
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
   ```

5. **Start development server:**
   ```bash
   npm run dev
   ```
   Frontend will run on `http://localhost:3000`

## Project Structure

```
ecommerce-project/
├── backend/              # Laravel + Filament
│   ├── app/
│   │   ├── Filament/    # Admin panel resources
│   │   ├── Http/
│   │   │   └── Controllers/Api/  # API controllers
│   │   └── Models/      # Eloquent models
│   ├── database/
│   │   └── migrations/  # Database migrations
│   └── routes/
│       └── api.php      # API routes
│
└── frontend/            # Next.js
    ├── app/             # Next.js app directory
    ├── components/      # React components
    ├── lib/             # Utilities (API client)
    └── types/           # TypeScript types
```

## Features Implemented

### Backend (Laravel Filament)
- ✅ Product management (CRUD)
- ✅ Category management (CRUD)
- ✅ Order management structure
- ✅ RESTful API endpoints
- ✅ CORS configuration
- ✅ Image upload support

### Frontend (Next.js)
- ✅ Modern, responsive design
- ✅ Product listing with grid layout
- ✅ Hero section with animations
- ✅ Product cards with hover effects
- ✅ API integration
- ✅ TypeScript support
- ✅ Tailwind CSS styling

## Next Steps

1. **Add Authentication:**
   - Implement user registration/login
   - Add Laravel Sanctum for API auth
   - Create protected routes

2. **Shopping Cart:**
   - Add cart state management (Zustand store)
   - Implement add/remove/update cart items
   - Persist cart in localStorage or backend

3. **Checkout Process:**
   - Create checkout page
   - Integrate payment gateway (Stripe, PayPal)
   - Order confirmation

4. **Product Details Page:**
   - Create individual product pages
   - Image gallery
   - Related products

5. **Search & Filters:**
   - Implement search functionality
   - Add filter sidebar
   - Sort options

6. **User Dashboard:**
   - Order history
   - Profile management
   - Wishlist

## Admin Panel Access

After creating an admin user, access the panel at:
`http://localhost:8000/admin`

You can manage:
- Products
- Categories
- Orders (once implemented)
- Users

## API Endpoints

- `GET /api/v1/products` - List products (with filters)
- `GET /api/v1/products/{slug}` - Get single product
- `GET /api/v1/categories` - List categories
- `GET /api/v1/categories/{slug}` - Get single category

## Troubleshooting

**CORS Issues:**
- Make sure `config/cors.php` includes your frontend URL
- Check Laravel CORS middleware is enabled

**Image Upload Issues:**
- Run `php artisan storage:link`
- Check `storage/app/public` permissions
- Verify `FILESYSTEM_DISK=local` in `.env`

**API Connection Issues:**
- Verify backend is running on port 8000
- Check `.env.local` has correct API URL
- Ensure CORS is properly configured

