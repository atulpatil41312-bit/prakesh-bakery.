@extends('layouts.admin', ['title' => 'Products'])

@section('content')
  <section class="grid two-col">
    <article class="card">
      <h2>Add product</h2>
      <form action="{{ route('admin.products.store') }}" method="POST" style="margin-top: 16px;">
        @csrf
        <label>
          Category
          <select name="category_id" required>
            <option value="">Choose category</option>
            @foreach($categories as $category)
              <option value="{{ $category->id }}">{{ $category->name }}</option>
            @endforeach
          </select>
        </label>
        <label>
          Product name
          <input type="text" name="name" required>
        </label>
        <label>
          Description
          <textarea name="description"></textarea>
        </label>
        <label>
          Price
          <input type="number" name="price" step="0.01" min="0" required>
        </label>
        <label>
          Unit
          <input type="text" name="unit" required>
        </label>
        <label>
          Badge
          <input type="text" name="badge">
        </label>
        <label>
          Prep time in minutes
          <input type="number" name="prep_time_minutes" min="0">
        </label>
        <label>
          Available for customer website
          <select name="is_available">
            <option value="1">Yes</option>
            <option value="0">No</option>
          </select>
        </label>
        <label>
          Eggless option
          <select name="is_eggless">
            <option value="0">No</option>
            <option value="1">Yes</option>
          </select>
        </label>
        <button class="primary" type="submit">Create product</button>
      </form>
    </article>

    <article class="card">
      <h2>Inventory</h2>
      <div class="list" style="margin-top: 16px;">
        @foreach($products as $product)
          <div class="item">
            <div class="row">
              <div>
                <strong>{{ $product->name }}</strong>
                <div class="muted">{{ $product->category?->name }} • Rs. {{ number_format($product->price, 2) }}</div>
              </div>
              <form action="{{ route('admin.products.destroy', $product) }}" method="POST">
                @csrf
                @method('DELETE')
                <button class="ghost" type="submit">Delete</button>
              </form>
            </div>
            <form action="{{ route('admin.products.update', $product) }}" method="POST" style="margin-top: 12px;">
              @csrf
              @method('PUT')
              <select name="category_id" required>
                @foreach($categories as $category)
                  <option value="{{ $category->id }}" @selected($product->category_id === $category->id)>{{ $category->name }}</option>
                @endforeach
              </select>
              <input type="text" name="name" value="{{ $product->name }}" required>
              <textarea name="description">{{ $product->description }}</textarea>
              <input type="number" name="price" step="0.01" min="0" value="{{ $product->price }}" required>
              <input type="text" name="unit" value="{{ $product->unit }}" required>
              <input type="text" name="badge" value="{{ $product->badge }}">
              <input type="number" name="prep_time_minutes" min="0" value="{{ $product->prep_time_minutes }}">
              <select name="is_available">
                <option value="1" @selected($product->is_available)>Yes</option>
                <option value="0" @selected(!$product->is_available)>No</option>
              </select>
              <select name="is_eggless">
                <option value="0" @selected(!$product->is_eggless)>No</option>
                <option value="1" @selected($product->is_eggless)>Yes</option>
              </select>
              <button class="primary" type="submit">Update product</button>
            </form>
          </div>
        @endforeach
      </div>
    </article>
  </section>
@endsection
