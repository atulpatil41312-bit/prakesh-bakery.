# Customer Website

ReactJS storefront for Prakash Bakery customers.

## Features

- responsive bakery shopping UI
- category-based product browsing
- delivery slot selection
- free delivery within 5 km
- automatic per-km delivery charges after free radius
- customer order placement
- order tracking by phone number
- PWA manifest and service worker

## Run locally

1. `npm install`
2. `npm run dev`

## API modes

- `VITE_API_MODE=mock` uses browser local storage for demo orders
- `VITE_API_MODE=live` uses the Laravel API
