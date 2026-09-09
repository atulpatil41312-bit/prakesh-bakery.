import { useState } from "react";
import { trackOrdersByPhone } from "./services/customerApi";

export default function OrderHistory() {
  const [phone, setPhone] = useState("");
  const [orders, setOrders] = useState([]);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  async function search(event) {
    event.preventDefault();
    setBusy(true);
    setMessage("");
    setOrders([]);
    try {
      const result = await trackOrdersByPhone(phone.trim());
      const matches = (result.data || []).filter(order => order.phone === phone.trim());
      matches.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      setOrders(matches);
      if (!matches.length) setMessage("No orders found for this phone number.");
    } catch {
      setMessage("Unable to load your order history. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return <section id="order-history" className="shop-width pb-16">
    <p className="shop-eyebrow">Your past orders</p>
    <h2 className="shop-title">Order History</h2>
    <p className="my-5">Enter the phone number used at checkout to see your orders.</p>
    <form onSubmit={search} className="flex flex-col gap-3 sm:flex-row">
      <label className="flex-1"><span className="sr-only">Order history phone number</span><input type="tel" required value={phone} onChange={event => setPhone(event.target.value)} placeholder="Phone number used for ordering" className="w-full rounded-full border border-bakery-line bg-white px-5 py-3" /></label>
      <button disabled={busy} className="shop-button disabled:opacity-50">{busy ? "Loading..." : "View order history"}</button>
    </form>
    <p role="status" className="mt-4 text-sm">{message}</p>
    <div className="mt-5 grid gap-4 sm:grid-cols-2">{orders.map(order => <article key={order.order_number} className="rounded-2xl bg-[#f6eddd] p-6">
      <div className="flex flex-wrap justify-between gap-3"><h3 className="font-display text-xl font-bold">{order.order_number}</h3><span className="text-sm capitalize">{order.status.replaceAll('_', ' ')}</span></div>
      <p className="mt-3 text-sm">Delivery: {order.delivery_date} · {order.delivery_slot}</p>
      <ul className="my-4 space-y-2 text-sm">{(order.items || []).map((item, index) => <li key={index}>{item.quantity} × {item.product_name}</li>)}</ul>
      <p className="font-bold">Total: {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(order.total)}</p>
    </article>)}</div>
  </section>;
}
