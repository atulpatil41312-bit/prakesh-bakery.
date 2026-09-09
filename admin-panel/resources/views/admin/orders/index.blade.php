@extends('layouts.admin', ['title' => 'Orders'])

@section('content')
  <article class="card">
    <h2>All orders</h2>
    <table style="margin-top: 16px;">
      <thead>
        <tr>
          <th>Order</th>
          <th>Customer</th>
          <th>Slot</th>
          <th>Total</th>
          <th>Status</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        @forelse($orders as $order)
          <tr>
            <td>{{ $order->order_number }}</td>
            <td>{{ $order->customer->name }}</td>
            <td>{{ $order->delivery_date?->format('Y-m-d') }}<br>{{ $order->delivery_slot }}</td>
            <td>Rs. {{ number_format($order->total, 2) }}</td>
            <td><span class="status">{{ $order->status }}</span></td>
            <td><a class="ghost" href="{{ route('admin.orders.show', $order) }}">Open</a></td>
          </tr>
        @empty
          <tr>
            <td colspan="6">No orders found.</td>
          </tr>
        @endforelse
      </tbody>
    </table>
  </article>
@endsection
