# Prakash Bakery Workspace

This workspace is split into two modules:

- `customer-website/` - ReactJS customer storefront
- `admin-panel/` - Laravel admin panel with MySQL schema and API/backend structure

## Important note

PHP and Composer are not installed in this environment, so the Laravel dependencies could not be generated or executed here. The Laravel module below is scaffolded in a Laravel-ready structure with models, controllers, migrations, routes, views, and SQL schema so it can be completed on a machine with PHP, Composer, and MySQL installed.

## Suggested next steps

1. Open `customer-website/` and run `npm install` then `npm run dev`
2. Install PHP, Composer, and MySQL
3. Open `admin-panel/`, run `composer install`, configure `.env`, then run migrations
4. Point the React app to the Laravel API by setting `VITE_API_MODE=live`

## Modules

### Customer Website

Responsive React storefront for customers:

- browse bakery products by category
- choose delivery slot
- calculate delivery fee after 5 km
- place orders
- track existing orders by phone number
- install as a PWA

### Admin Panel

Laravel-oriented admin backend for owners:

- manage categories and products
- view order notifications
- accept orders and generate OTP
- move orders through bakery workflow
- store delivery settings
- expose customer-facing API endpoints for the React app
