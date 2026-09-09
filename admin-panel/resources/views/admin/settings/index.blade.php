@extends('layouts.admin', ['title' => 'Settings'])

@section('content')
  <article class="card">
    <h2>Delivery and WhatsApp settings</h2>
    <form action="{{ route('admin.settings.update') }}" method="POST" style="margin-top: 16px;">
      @csrf
      @method('PUT')
      <label>
        Bakery name
        <input type="text" name="bakery_name" value="{{ old('bakery_name', $settings?->bakery_name ?? 'Prakash Bakery') }}" required>
      </label>
      <label>
        Bakery address
        <textarea name="bakery_address" placeholder="Dindoli, Surat, Gujarat 394210">{{ old('bakery_address', $settings?->bakery_address ?? '') }}</textarea>
      </label>
      <label>
        Bakery latitude
        <input type="number" step="0.0000001" name="bakery_latitude" value="{{ old('bakery_latitude', $settings?->bakery_latitude ?? 25.4358) }}">
      </label>
      <label>
        Bakery longitude
        <input type="number" step="0.0000001" name="bakery_longitude" value="{{ old('bakery_longitude', $settings?->bakery_longitude ?? 81.8463) }}">
      </label>
      <label>
        Free delivery radius (km)
        <input type="number" step="0.01" min="0" name="free_delivery_radius_km" value="{{ old('free_delivery_radius_km', $settings?->free_delivery_radius_km ?? 5) }}" required>
      </label>
      <label>
        Charge per extra km
        <input type="number" step="0.01" min="0" name="charge_per_extra_km" value="{{ old('charge_per_extra_km', $settings?->charge_per_extra_km ?? 18) }}" required>
      </label>
      <label>
        Minimum prep notice hours
        <input type="number" step="0.01" min="0" name="minimum_prep_notice_hours" value="{{ old('minimum_prep_notice_hours', $settings?->minimum_prep_notice_hours ?? 2) }}" required>
      </label>
      <label>
        Time slots
        <textarea name="time_slots" required>{{ old('time_slots', implode(PHP_EOL, $settings?->time_slots ?? ['08:00 AM - 10:00 AM', '10:00 AM - 12:00 PM'])) }}</textarea>
      </label>
      <label>
        WhatsApp template
        <textarea name="whatsapp_template" required>{{ old('whatsapp_template', $settings?->whatsapp_template ?? 'Hello {{name}}, your order {{orderId}} from Prakash Bakery is accepted. Share OTP {{otp}} with the delivery partner on handover.') }}</textarea>
      </label>
      <button class="primary" type="submit">Save settings</button>
    </form>
  </article>
@endsection
