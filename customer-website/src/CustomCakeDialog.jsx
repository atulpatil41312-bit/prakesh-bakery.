import { useEffect, useState } from "react";

const REQUESTS_KEY = "prakash-bakery-custom-requests";
const emptyRequest = { occasion: "Birthday", servings: "", budget: "", message: "", phone: "" };

function readRequests() {
  try {
    const requests = JSON.parse(window.localStorage.getItem(REQUESTS_KEY) || "[]");
    return Array.isArray(requests) ? requests : [];
  } catch {
    return [];
  }
}

function saveRequests(requests) {
  window.localStorage.setItem(REQUESTS_KEY, JSON.stringify(requests));
}

export default function CustomCakeDialog({ open, onClose, customer, onAcceptQuote }) {
  const [form, setForm] = useState(emptyRequest);
  const [image, setImage] = useState("");
  const [requests, setRequests] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!open) return;
    setRequests(readRequests());
    setForm((current) => ({ ...current, phone: customer?.phone || current.phone }));
    setMessage("");
  }, [open, customer]);

  if (!open) return null;

  const latest = requests[0];
  const update = (field, value) => setForm((current) => ({ ...current, [field]: value }));

  async function addImage(file) {
    if (!file) return;
    if (!file.type.startsWith("image/") || file.size > 1024 * 1024) {
      setMessage("Choose an image smaller than 1 MB.");
      return;
    }
    const value = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
    setImage(value);
  }

  function submitRequest(event) {
    event.preventDefault();
    if (!form.message.trim() || !form.phone.trim()) {
      setMessage("Please describe your cake and enter a phone number.");
      return;
    }
    const request = {
      id: `CC-${Date.now().toString().slice(-8)}`,
      customerName: customer?.name || "Bakery customer",
      phone: form.phone.trim(),
      occasion: form.occasion,
      servings: form.servings.trim(),
      budget: form.budget.trim(),
      message: form.message.trim(),
      image,
      status: "awaiting quotation",
      quote: null,
      messages: [
        { from: "customer", text: form.message.trim() },
        { from: "bot", text: "Thank you. Our cake specialist will review your design and send a quotation shortly." },
      ],
      createdAt: new Date().toISOString(),
    };
    const next = [request, ...requests];
    saveRequests(next);
    setRequests(next);
    setForm({ ...emptyRequest, phone: customer?.phone || "" });
    setImage("");
    setMessage("Your custom cake request has been sent to the bakery.");
  }

  function acceptQuote(request) {
    const next = requests.map((item) => item.id === request.id ? { ...item, status: "quotation accepted" } : item);
    saveRequests(next);
    setRequests(next);
    onAcceptQuote(request);
  }

  return <div className="fixed inset-0 z-50 grid place-items-center bg-[rgba(45,32,25,.52)] px-4 py-5" role="dialog" aria-modal="true" aria-labelledby="custom-cake-title">
    <div className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-[2rem] bg-[#fffaf0] p-5 shadow-2xl sm:p-8">
      <div className="flex items-start justify-between gap-4"><div><p className="shop-eyebrow">Custom cake concierge</p><h2 id="custom-cake-title" className="mt-3 font-display text-3xl font-bold text-[#571e36]">Design your celebration cake</h2><p className="mt-3 text-sm leading-6">Tell us your cake idea, share a reference image, and our bakery team will send a quotation.</p></div><button type="button" onClick={onClose} aria-label="Close custom cake chat" className="grid h-10 w-10 place-items-center rounded-full border border-[#e8dcd7] text-xl text-[#571e36]">×</button></div>
      {latest ? <section className="mt-6 rounded-3xl border border-[#eadcc9] bg-white p-5"><div className="flex flex-wrap items-center justify-between gap-3"><strong className="font-display text-lg text-[#571e36]">Request {latest.id}</strong><span className="rounded-full bg-[#f6eddd] px-3 py-1 text-xs font-bold text-[#571e36]">{latest.status}</span></div><div className="mt-4 grid gap-3">{latest.messages.map((entry, index) => <p key={`${entry.from}-${index}`} className={`rounded-2xl px-4 py-3 text-sm leading-6 ${entry.from === "customer" ? "bg-[#571e36] text-white" : "bg-[#f6eddd] text-[#571e36]"}`}><strong className="mr-2 capitalize">{entry.from}:</strong>{entry.text}</p>)}</div>{latest.quote ? <div className="mt-4 rounded-2xl border border-[#d8c39a] bg-[#fff4d8] p-4"><p className="text-xs font-bold uppercase tracking-widest text-[#bd7426]">Bakery quotation</p><p className="mt-2 font-display text-2xl font-bold text-[#571e36]">₹{latest.quote.amount}</p><p className="mt-2 text-sm leading-6">{latest.quote.note}</p>{latest.status !== "quotation accepted" ? <button type="button" onClick={() => acceptQuote(latest)} className="shop-button mt-4">Accept quotation & add to order</button> : <p className="mt-3 text-sm font-bold text-[#4e7450]">Quotation accepted and added to your order.</p>}</div> : null}</section> : null}
      <form onSubmit={submitRequest} className="mt-6 grid gap-4 rounded-3xl bg-[#f6eddd] p-5"><h3 className="font-display text-xl font-bold text-[#571e36]">Start a new cake request</h3><div className="grid gap-4 sm:grid-cols-2"><label className="grid gap-2 text-sm font-bold text-[#571e36]">Occasion<select value={form.occasion} onChange={(event) => update("occasion", event.target.value)} className="rounded-xl border border-[#e8dcd7] bg-white p-3"><option>Birthday</option><option>Anniversary</option><option>Wedding</option><option>Baby shower</option><option>Other celebration</option></select></label><label className="grid gap-2 text-sm font-bold text-[#571e36]">Servings<input value={form.servings} onChange={(event) => update("servings", event.target.value)} placeholder="For example: 15 people" className="rounded-xl border border-[#e8dcd7] bg-white p-3" /></label></div><div className="grid gap-4 sm:grid-cols-2"><label className="grid gap-2 text-sm font-bold text-[#571e36]">Budget (optional)<input value={form.budget} onChange={(event) => update("budget", event.target.value)} placeholder="For example: ₹1,500" className="rounded-xl border border-[#e8dcd7] bg-white p-3" /></label><label className="grid gap-2 text-sm font-bold text-[#571e36]">Phone number<input value={form.phone} onChange={(event) => update("phone", event.target.value)} required className="rounded-xl border border-[#e8dcd7] bg-white p-3" /></label></div><label className="grid gap-2 text-sm font-bold text-[#571e36]">Tell our cake concierge what you need<textarea value={form.message} onChange={(event) => update("message", event.target.value)} required placeholder="Flavour, colour, message on cake, theme, eggless preference, delivery date..." className="min-h-28 rounded-xl border border-[#e8dcd7] bg-white p-3" /></label><label className="grid gap-2 text-sm font-bold text-[#571e36]">Reference image (optional)<input type="file" accept="image/jpeg,image/png,image/webp" onChange={(event) => addImage(event.target.files[0])} className="rounded-xl border border-[#e8dcd7] bg-white p-3" /></label>{image ? <img src={image} alt="Custom cake reference" className="h-44 w-full rounded-2xl object-cover" /> : null}{message ? <p role="status" className="text-sm font-semibold text-[#571e36]">{message}</p> : null}<button type="submit" className="shop-button w-full">Send custom cake request</button></form>
    </div>
  </div>;
}
