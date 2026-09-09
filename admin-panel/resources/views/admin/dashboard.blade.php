@extends('layouts.admin', ['title' => 'Dashboard'])

@section('content')
  <section class="grid metrics">
    <article class="card">
      <h2>{{ $categoryCount }}</h2>
      <p class="muted">Categories</p>
    </article>
    <article class="card">
      <h2>{{ $productCount }}</h2>
      <p class="muted">Products</p>
    </article>
    <article class="card">
      <h2>{{ $pendingOrders }}</h2>
      <p class="muted">Pending orders</p>
    </article>
    <article class="card">
      <h2>{{ $processingOrders }}</h2>
      <p class="muted">Orders in progress</p>
    </article>
  </section>

  <section class="grid two-col">
    <article class="card">
      <h3>Recent orders</h3>
      <div class="list" style="margin-top: 16px;">
        @forelse($recentOrders as $order)
          <div class="item">
            <div class="row">
              <div>
                <strong>{{ $order->order_number }}</strong>
                <div class="muted">{{ $order->customer->name }} • {{ $order->delivery_slot }}</div>
              </div>
              <span class="status">{{ $order->status }}</span>
            </div>
            <div class="row" style="margin-top: 10px;">
              <span>Total: Rs. {{ number_format($order->total, 2) }}</span>
              <a class="ghost" href="{{ route('admin.orders.show', $order) }}">View order</a>
            </div>
          </div>
        @empty
          <div class="item">No orders yet.</div>
        @endforelse
      </div>
    </article>

    <article class="card">
      <h3>Delivery settings</h3>
      <div class="list" style="margin-top: 16px;">
        <div class="item">
          <strong>{{ $deliverySettings?->bakery_name ?? 'Prakash Bakery' }}</strong>
          <p class="muted">Free delivery radius: {{ $deliverySettings?->free_delivery_radius_km ?? 5 }} km</p>
          <p class="muted">Charge per extra km: Rs. {{ number_format((float) ($deliverySettings?->charge_per_extra_km ?? 18), 2) }}</p>
          <p class="muted">Minimum prep notice: {{ $deliverySettings?->minimum_prep_notice_hours ?? 2 }} hours</p>
          <a class="ghost" href="{{ route('admin.settings.index') }}">Manage settings</a>
        </div>
      </div>
    </article>
  </section>
@endsection
