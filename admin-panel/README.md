# Prakash Bakery Admin Panel

This folder contains a Laravel-ready admin panel structure for bakery owners.

## What is included

- web admin routes for products, categories, orders, and settings
- API routes for the React customer website
- Eloquent models
- database migrations
- seed data
- Blade admin views
- raw MySQL schema file

## What is not included yet

This environment does not have PHP or Composer installed, so the full Laravel framework files and `vendor/` dependencies could not be generated here.

## Setup after installing PHP, Composer, and MySQL

1. Run `composer install`
2. Copy `.env.example` to `.env`
3. Update database credentials
4. Run `php artisan key:generate`
5. Run `php artisan migrate --seed`
6. Serve the app with `php artisan serve`
7. Point the React app to `http://127.0.0.1:8000/api`

## API endpoints

- `GET /api/catalog`
- `POST /api/orders`
- `GET /api/orders/track/{phone}`

## Admin routes

- `/admin`
- `/admin/categories`
- `/admin/products`
- `/admin/orders`
- `/admin/settings`
