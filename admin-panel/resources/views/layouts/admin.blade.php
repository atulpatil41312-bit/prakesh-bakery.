<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ $title ?? 'Prakash Bakery Admin' }}</title>
    <style>
      :root {
        --bg: #fff7ed;
        --surface: rgba(255, 251, 247, 0.9);
        --ink: #2f1f17;
        --muted: #6f5a4e;
        --primary: #9c4a2d;
        --accent: #d47f4a;
        --line: rgba(111, 47, 25, 0.12);
        --shadow: 0 24px 50px rgba(95, 46, 24, 0.12);
      }

      * { box-sizing: border-box; }
      body {
        margin: 0;
        font-family: "Segoe UI", Tahoma, sans-serif;
        color: var(--ink);
        background:
          radial-gradient(circle at top left, rgba(244, 208, 182, 0.9), transparent 28%),
          linear-gradient(180deg, #fffaf4 0%, #fff2e4 52%, #fff7ed 100%);
      }
      .shell { width: min(100% - 28px, 1240px); margin: 0 auto; padding: 24px 0 48px; }
      .header, .card, .status {
        border: 1px solid rgba(255,255,255,.5);
        background: var(--surface);
        border-radius: 22px;
        box-shadow: var(--shadow);
      }
      .header { display: flex; justify-content: space-between; gap: 16px; padding: 20px 24px; margin-bottom: 24px; }
      .brand h1, .card h2, .card h3 { margin: 0; font-family: Georgia, serif; }
      .brand p, .muted, small { color: var(--muted); }
      .nav { display: flex; gap: 10px; flex-wrap: wrap; }
      .nav a, button {
        border: none;
        border-radius: 999px;
        padding: 11px 16px;
        text-decoration: none;
        cursor: pointer;
      }
      .nav a, .primary, button.primary {
        color: #fff9f4;
        background: linear-gradient(135deg, var(--primary), var(--accent));
      }
      .ghost, button.ghost {
        color: var(--primary);
        background: #f8e6d8;
      }
      .grid { display: grid; gap: 20px; }
      .metrics { grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); margin-bottom: 24px; }
      .two-col { grid-template-columns: 1fr 1fr; }
      .card { padding: 22px; }
      .list { display: grid; gap: 14px; }
      .item {
        padding: 14px;
        border-radius: 16px;
        background: rgba(255, 255, 255, .76);
        border: 1px solid var(--line);
      }
      .row { display: flex; gap: 12px; align-items: center; justify-content: space-between; flex-wrap: wrap; }
      form { display: grid; gap: 12px; }
      label { display: grid; gap: 6px; color: var(--primary); }
      input, textarea, select {
        width: 100%;
        padding: 12px 14px;
        border-radius: 14px;
        border: 1px solid rgba(156, 74, 45, .15);
        background: #fff;
      }
      textarea { min-height: 100px; resize: vertical; }
      table { width: 100%; border-collapse: collapse; }
      th, td { padding: 12px; border-bottom: 1px solid var(--line); text-align: left; }
      .status {
        display: inline-flex;
        padding: 7px 12px;
        color: var(--primary);
        background: #f8e7db;
      }
      .flash {
        padding: 14px 16px;
        margin-bottom: 18px;
        border-radius: 16px;
        background: linear-gradient(135deg, #6d8b74, #527764);
        color: #fff;
      }
      @media (max-width: 900px) {
        .header, .row { flex-direction: column; align-items: stretch; }
        .two-col { grid-template-columns: 1fr; }
      }
    </style>
  </head>
  <body>
    <div class="shell">
      <header class="header">
        <div class="brand">
          <h1>Prakash Bakery Admin</h1>
          <p>Owner dashboard for products, orders, and delivery operations.</p>
        </div>
        <nav class="nav">
          <a href="{{ route('admin.dashboard') }}">Dashboard</a>
          <a href="{{ route('admin.categories.index') }}">Categories</a>
          <a href="{{ route('admin.products.index') }}">Products</a>
          <a href="{{ route('admin.orders.index') }}">Orders</a>
          <a href="{{ route('admin.settings.index') }}">Settings</a>
        </nav>
      </header>

      @if(session('status'))
        <div class="flash">{{ session('status') }}</div>
      @endif

      @yield('content')
    </div>
  </body>
</html>
