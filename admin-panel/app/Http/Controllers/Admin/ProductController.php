<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Contracts\View\View;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class ProductController extends Controller
{
    public function index(): View
    {
        return view("admin.products.index", [
            "categories" => Category::query()->where("is_active", true)->orderBy("name")->get(),
            "products" => Product::query()->with("category")->latest()->get(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $payload = $request->validate([
            "category_id" => ["required", "exists:categories,id"],
            "name" => ["required", "string", "max:255"],
            "description" => ["nullable", "string"],
            "price" => ["required", "numeric", "min:0"],
            "unit" => ["required", "string", "max:100"],
            "badge" => ["nullable", "string", "max:100"],
            "prep_time_minutes" => ["nullable", "integer", "min:0"],
            "is_eggless" => ["nullable", "boolean"],
            "is_available" => ["nullable", "boolean"],
        ]);

        Product::create([
            ...$payload,
            "slug" => Str::slug($payload["name"] . "-" . Str::random(4)),
            "is_eggless" => (bool) ($payload["is_eggless"] ?? false),
            "is_available" => (bool) ($payload["is_available"] ?? true),
        ]);

        return back()->with("status", "Product added successfully.");
    }

    public function update(Request $request, Product $product): RedirectResponse
    {
        $payload = $request->validate([
            "category_id" => ["required", "exists:categories,id"],
            "name" => ["required", "string", "max:255"],
            "description" => ["nullable", "string"],
            "price" => ["required", "numeric", "min:0"],
            "unit" => ["required", "string", "max:100"],
            "badge" => ["nullable", "string", "max:100"],
            "prep_time_minutes" => ["nullable", "integer", "min:0"],
            "is_eggless" => ["nullable", "boolean"],
            "is_available" => ["nullable", "boolean"],
        ]);

        $product->update([
            ...$payload,
            "slug" => Str::slug($payload["name"] . "-" . $product->id),
            "is_eggless" => (bool) ($payload["is_eggless"] ?? $product->is_eggless),
            "is_available" => (bool) ($payload["is_available"] ?? $product->is_available),
        ]);

        return back()->with("status", "Product updated.");
    }

    public function destroy(Product $product): RedirectResponse
    {
        $product->delete();
        return back()->with("status", "Product deleted.");
    }
}
