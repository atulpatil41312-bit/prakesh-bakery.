@extends('layouts.admin', ['title' => 'Order Details'])

@section('content')
  <section class="grid two-col">
    <article class="card">
      <h2>{{ $order->order_number }}</h2>
      <div class="list" style="margin-top: 16px;">
        <div class="item">
          <strong>{{ $order->customer->name }}</strong>
          <p class="muted">{{ $order->customer->phone }}</p>
          <p class="muted">{{ $order->delivery_address }}</p>
          <p class="muted">Slot: {{ $order->delivery_date?->format('Y-m-d') }} • {{ $order->delivery_slot }}</p>
        </div>
        <div class="item">
          <div class="row"><span>Subtotal</span><strong>Rs. {{ number_format($order->subtotal, 2) }}</strong></div>
          <div class="row"><span>Delivery fee</span><strong>Rs. {{ number_format($order->delivery_fee, 2) }}</strong></div>
          <div class="row"><span>Total</span><strong>Rs. {{ number_format($order->total, 2) }}</strong></div>
          <div class="row"><span>OTP</span><strong>{{ $order->otp_code ?? 'Generated when accepted' }}</strong></div>
        </div>
      </div>
    </article>

    <article class="card">
      <h2>Update status</h2>
      <form action="{{ route('admin.orders.update-status', $order) }}" method="POST" style="margin-top: 16px;">
        @csrf
        @method('PUT')
        <label>
          Current status
          <select name="status" required>
            @foreach($statuses as $status)
              <option value="{{ $status }}" @selected($order->status === $status)>{{ $status }}</option>
            @endforeach
          </select>
        </label>
        <label>
          Delivery OTP
          <input type="text" name="otp_code" placeholder="Required when marking delivered">
        </label>
        <button class="primary" type="submit">Save status</button>
      </form>

      @if($order->whatsapp_message)
        <div class="item" style="margin-top: 16px;">
          <strong>WhatsApp message preview</strong>
          <p class="muted">{{ $order->whatsapp_message }}</p>
        </div>
      @endif
    </article>
  </section>

  <article class="card" style="margin-top: 20px;">
    <h2>Order items</h2>
    <table style="margin-top: 16px;">
      <thead>
        <tr>
          <th>Product</th>
          <th>Qty</th>
          <th>Unit price</th>
          <th>Line total</th>
        </tr>
      </thead>
      <tbody>
        @foreach($order->items as $item)
          <tr>
            <td>{{ $item->product_name }}</td>
            <td>{{ $item->quantity }}</td>
            <td>Rs. {{ number_format($item->unit_price, 2) }}</td>
            <td>Rs. {{ number_format($item->line_total, 2) }}</td>
          </tr>
        @endforeach
      </tbody>
    </table>
  </article>
@endsection
