<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Contracts\View\View;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class CategoryController extends Controller
{
    public function index(): View
    {
      return view("admin.categories.index", [
          "categories" => Category::query()->withCount("products")->latest()->get(),
      ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $payload = $request->validate([
            "name" => ["required", "string", "max:255", "unique:categories,name"],
            "description" => ["nullable", "string"],
        ]);

        Category::create([
            ...$payload,
            "slug" => Str::slug($payload["name"]),
            "is_active" => true,
        ]);

        return back()->with("status", "Category created successfully.");
    }

    public function update(Request $request, Category $category): RedirectResponse
    {
        $payload = $request->validate([
            "name" => ["required", "string", "max:255", "unique:categories,name," . $category->id],
            "description" => ["nullable", "string"],
            "is_active" => ["nullable", "boolean"],
        ]);

        $category->update([
            ...$payload,
            "slug" => Str::slug($payload["name"]),
            "is_active" => (bool) ($payload["is_active"] ?? true),
        ]);

        return back()->with("status", "Category updated.");
    }

    public function destroy(Category $category): RedirectResponse
    {
        if ($category->products()->exists()) {
            return back()->with("status", "Remove products from this category first.");
        }

        $category->delete();
        return back()->with("status", "Category deleted.");
    }
}
