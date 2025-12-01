# Modern E-Commerce Platform

A sleek, interactive e-commerce site built with Laravel Filament (backend) and Next.js (frontend).

## Project Structure

- `backend/` - Laravel application with Filament admin panel
- `frontend/` - Next.js application with modern UI

## Tech Stack

### Backend
- Laravel 11
- Laravel Filament 3
- MySQL/PostgreSQL
- Laravel Sanctum (API authentication)

### Frontend
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Framer Motion (animations)
- Shadcn/ui (components)
- Axios (API client)

## Getting Started

### Backend Setup

```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan filament:install --panels
php artisan serve
```

### Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env.local
npm run dev
```

## Features

- 🛍️ Product catalog with categories
- 🛒 Shopping cart functionality
- 💳 Checkout process
- 👤 User authentication
- 📦 Order management
- 🎨 Modern, responsive design
- ⚡ Fast performance with SSR
- 🎭 Smooth animations

