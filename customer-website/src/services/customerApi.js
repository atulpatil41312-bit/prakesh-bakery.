import { sampleCatalog } from "../data/sampleCatalog";

const API_MODE = import.meta.env.VITE_API_MODE || "mock";
const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api";
const ORDERS_KEY = "prakash-bakery-customer-orders";

function buildDeliveryFee(distanceKm, settings) {
  const extraDistance = Math.max(0, Number(distanceKm) - Number(settings.freeDeliveryKm));
  return Math.ceil(extraDistance) * Number(settings.deliveryChargePerKm);
}

function getMockOrders() {
  try {
    return JSON.parse(window.localStorage.getItem(ORDERS_KEY) || "[]");
  } catch {
    return [];
  }
}

function saveMockOrders(orders) {
  window.localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
}

export async function getCatalog() {
  if (API_MODE === "live") {
    const response = await fetch(`${API_BASE}/catalog`);
    if (!response.ok) {
      throw new Error("Unable to load catalog");
    }
    return response.json();
  }

  return structuredClone(sampleCatalog);
}

export async function placeOrder(payload) {
  if (API_MODE === "live") {
    const response = await fetch(`${API_BASE}/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error("Unable to place order");
    }

    return response.json();
  }

  const subtotal = payload.items.reduce((sum, item) => sum + item.unit_price * item.quantity, 0);
  const deliveryFee = buildDeliveryFee(payload.distance_km, sampleCatalog.settings);
  const orders = getMockOrders();

  const order = {
    id: Date.now(),
    order_number: `PB-${String(Date.now()).slice(-6)}`,
    customer_name: payload.customer_name,
    phone: payload.phone,
    address: payload.delivery_address,
    delivery_slot: payload.delivery_slot,
    delivery_date: payload.delivery_date,
    distance_km: payload.distance_km,
    subtotal,
    delivery_fee: deliveryFee,
    total: subtotal + deliveryFee,
    status: "pending",
    otp_code: null,
    items: payload.items,
    notes: payload.notes,
    created_at: new Date().toISOString(),
  };

  orders.unshift(order);
  saveMockOrders(orders);

  return {
    message: "Order placed successfully",
    order,
  };
}

export async function trackOrdersByPhone(phone) {
  if (API_MODE === "live") {
    const response = await fetch(`${API_BASE}/orders/track/${encodeURIComponent(phone)}`);
    if (!response.ok) {
      throw new Error("Unable to track orders");
    }
    return response.json();
  }

  const orders = getMockOrders().filter((order) => order.phone.includes(phone));
  return { data: orders };
}
