@extends('layouts.admin', ['title' => 'Categories'])

@section('content')
  <section class="grid two-col">
    <article class="card">
      <h2>Create category</h2>
      <form action="{{ route('admin.categories.store') }}" method="POST" style="margin-top: 16px;">
        @csrf
        <label>
          Category name
          <input type="text" name="name" required>
        </label>
        <label>
          Description
          <textarea name="description"></textarea>
        </label>
        <button class="primary" type="submit">Add category</button>
      </form>
    </article>

    <article class="card">
      <h2>Existing categories</h2>
      <div class="list" style="margin-top: 16px;">
        @foreach($categories as $category)
          <div class="item">
            <div class="row">
              <div>
                <strong>{{ $category->name }}</strong>
                <div class="muted">{{ $category->products_count }} products</div>
              </div>
              <form action="{{ route('admin.categories.destroy', $category) }}" method="POST">
                @csrf
                @method('DELETE')
                <button class="ghost" type="submit">Delete</button>
              </form>
            </div>
            <form action="{{ route('admin.categories.update', $category) }}" method="POST" style="margin-top: 12px;">
              @csrf
              @method('PUT')
              <input type="text" name="name" value="{{ $category->name }}" required>
              <textarea name="description">{{ $category->description }}</textarea>
              <button class="primary" type="submit">Update category</button>
            </form>
          </div>
        @endforeach
      </div>
    </article>
  </section>
@endsection
