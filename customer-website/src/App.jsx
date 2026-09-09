import { useEffect, useMemo, useState } from "react";
import Storefront from "./Storefront";
import { getCatalog, placeOrder, trackOrdersByPhone } from "./services/customerApi";

const quickLinks = [
  "Eggless Cakes",
  "Birthday Cakes",
  "Fresh Puffs",
  "Khari & Rusk",
  "Tea Cakes",
  "Biscuits",
  "Fresh Bread",
  "Evening Snacks",
];

const navigationItems = [
  { label: "Home", target: "hero-top" },
  { label: "Our Menu", target: "menu-shortcuts" },
  { label: "Delivery Service", target: "checkout-rail" },
  { label: "Contact", target: "footer-section" },
];

const promiseItems = [
  {
    title: "Local bakery delivery",
    text: "Orders move smoothly from acceptance to handover with timings that suit birthdays, tea parties, and home cravings.",
  },
  {
    title: "Fresh from today's batch",
    text: "Soft sponge cakes, buttery biscuits, warm breads, puffs, and evening snacks are refreshed through the day.",
  },
  {
    title: "Simple phone-first ordering",
    text: "Customers can quickly browse cakes, patties, breads, and biscuits without getting lost in a complicated checkout.",
  },
  {
    title: "Trusted neighborhood service",
    text: "Free delivery inside 5 km, automatic fee calculation after that, and OTP handover on delivery.",
  },
];

const faqItems = [
  {
    question: "Can customers choose a delivery slot?",
    answer: "Yes. Customers can select a delivery date and preferred slot before placing the order.",
  },
  {
    question: "How are delivery charges calculated?",
    answer: "Delivery is free within 5 km. Extra delivery distance is added automatically after the free radius.",
  },
  {
    question: "When does the OTP get generated?",
    answer: "The OTP is generated after the owner accepts the order from the admin panel.",
  },
];

const heroSlides = [
  {
    eyebrow: "Neighborhood bakery",
    kicker: "Fresh every day",
    title: "Eggless cakes, puffs, biscuits, and fresh breads",
    titleLines: ["Eggless cakes,", "puffs, biscuits,", "and fresh breads"],
    text: "Browse a familiar Indian bakery menu with celebration cakes, savory snacks, tea-time bites, and easy local ordering.",
    cta: "Order now",
    image: "/images/hero/hero-cake-celebration.svg",
  },
  {
    eyebrow: "Fresh from the oven",
    kicker: "Counter favorites",
    title: "Birthday cakes, veg puffs, rolls, rusks, and cookies",
    titleLines: ["Birthday cakes,", "veg puffs, rolls,", "rusks, and cookies"],
    text: "Pick the items customers usually ask for at an Indian bakery counter, then book a delivery slot in just a few steps.",
    cta: "See menu",
    image: "/images/hero/hero-bakery-counter.svg",
  },
  {
    eyebrow: "Bakery delivery",
    kicker: "Easy celebrations",
    title: "Choose your slot, track by phone, and receive OTP handover",
    titleLines: ["Choose your slot,", "track by phone,", "and receive OTP handover"],
    text: "Prakash Bakery combines local bakery warmth with practical ordering, delivery pricing, and secure order handover.",
    cta: "Book delivery",
    image: "/images/hero/hero-delivery-box.svg",
  },
];

const metrics = [
  { value: "4.9/5", label: "customer satisfaction" },
  { value: "5 km", label: "free delivery radius" },
  { value: "Same day", label: "fast bakery fulfillment" },
];

const offerCards = [
  {
    title: "Curated gifting",
    text: "Premium cakes and bakery boxes that feel special even before they are opened.",
  },
  {
    title: "Flexible slots",
    text: "Morning, noon, and evening delivery options built for birthdays and planned occasions.",
  },
  {
    title: "Live pricing",
    text: "Clear distance-based delivery charges after the free zone with no manual confusion.",
  },
];

const signatureMoments = [
  {
    title: "Birthday Cake Counter",
    text: "Fresh cream and eggless celebration cakes ready for birthdays, anniversaries, and family gatherings.",
    image: "/images/hero/hero-cake-celebration.svg",
  },
  {
    title: "Chai-time Snacks",
    text: "Veg puffs, paneer rolls, khari, and biscuits that feel right at home with evening tea.",
    image: "/images/hero/hero-bakery-counter.svg",
  },
  {
    title: "Nearby Delivery",
    text: "Slot booking, order tracking, and OTP handover keep local bakery delivery simple and reliable.",
    image: "/images/hero/hero-delivery-box.svg",
  },
];

const atelierNotes = [
  {
    title: "Morning to evening freshness",
    text: "Daily baking keeps breads soft, patties flaky, biscuits crisp, and cakes ready for both advance and same-day orders.",
  },
  {
    title: "Built for local bakery shopping",
    text: "The experience feels clean and modern, but still familiar for customers ordering cakes, snacks, and breads from nearby areas.",
  },
];

const conciergePoints = [
  "Choose a delivery slot for birthdays, office treats, and family evenings",
  "Free delivery within 5 km and automatic pricing after that",
  "WhatsApp OTP handover is shared once the owner accepts the order",
];

const locations = ["Prakash Nagar", "Station Road", "Nehru Colony", "Bus Stand", "Model Town"];

const deliverySteps = ["pending", "accepted", "preparing", "ready", "out_for_delivery", "delivered"];
const fallbackBakeryLocation = {
  label: "Prakash Bakery",
  address: "Dindoli, Surat, Gujarat 394210",
  latitude: 21.1525,
  longitude: 72.8752,
};

const emptyForm = {
  customer_name: "",
  phone: "",
  delivery_date: "",
  delivery_slot: "",
  distance_km: 0,
  delivery_address: "",
  notes: "",
};
const CUSTOMER_KEY = "prakash-bakery-customer";
const emptySignupForm = { name: "", phone: "", email: "", password: "" };

function readSavedCustomer() {
  try {
    return JSON.parse(window.localStorage.getItem(CUSTOMER_KEY) || "null");
  } catch {
    return null;
  }
}

function formatMoney(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value || 0);
}

function formatReviewCount(value) {
  if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}K`;
  }

  return `${value}`;
}

function formatStatus(status) {
  return status.replaceAll("_", " ");
}

function getStatusClasses(status) {
  const styles = {
    pending: "bg-amber-200/70 text-bakery-brown-deep",
    accepted: "bg-yellow-200/70 text-bakery-brown-deep",
    preparing: "bg-orange-200/70 text-bakery-brown-deep",
    ready: "bg-lime-200/80 text-emerald-900",
    out_for_delivery: "bg-sky-200/80 text-sky-900",
    delivered: "bg-emerald-200/80 text-emerald-900",
  };

  return styles[status] || "bg-white/70 text-bakery-brown-deep";
}

function getCategoryTone(categoryId) {
  const tones = {
    1: "from-amber-100 via-yellow-100 to-orange-100",
    2: "from-stone-100 via-yellow-50 to-amber-100",
    3: "from-yellow-50 via-amber-50 to-stone-100",
    4: "from-amber-50 via-orange-50 to-yellow-100",
  };

  return tones[categoryId] || "from-yellow-50 via-amber-50 to-stone-100";
}

function calculateDistanceKm(fromLatitude, fromLongitude, toLatitude, toLongitude) {
  const earthRadiusKm = 6371;
  const latDelta = ((toLatitude - fromLatitude) * Math.PI) / 180;
  const lonDelta = ((toLongitude - fromLongitude) * Math.PI) / 180;
  const startLatitude = (fromLatitude * Math.PI) / 180;
  const endLatitude = (toLatitude * Math.PI) / 180;

  const a =
    Math.sin(latDelta / 2) * Math.sin(latDelta / 2) +
    Math.cos(startLatitude) *
      Math.cos(endLatitude) *
      Math.sin(lonDelta / 2) *
      Math.sin(lonDelta / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return earthRadiusKm * c;
}

function buildMapEmbedUrl(latitude, longitude) {
  const offset = 0.02;
  const bbox = [
    Number(longitude) - offset,
    Number(latitude) - offset,
    Number(longitude) + offset,
    Number(latitude) + offset,
  ].join("%2C");

  return `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${latitude}%2C${longitude}`;
}

function SectionHeader({ eyebrow, title, action }) {
  return (
    <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="mb-2 inline-flex rounded-full border border-bakery-line bg-white/60 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.28em] text-bakery-brown">
          {eyebrow}
        </p>
        <h2 className="max-w-3xl font-display text-4xl leading-none text-bakery-copy sm:text-5xl">
          {title}
        </h2>
      </div>
      {action}
    </div>
  );
}

function App() {
  const [catalog, setCatalog] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [cart, setCart] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [orderFlash, setOrderFlash] = useState("");
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState("");
  const [trackingPhone, setTrackingPhone] = useState("");
  const [trackedOrders, setTrackedOrders] = useState([]);
  const [tracking, setTracking] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeSlide, setActiveSlide] = useState(0);
  const [selectedLocation, setSelectedLocation] = useState(locations[0]);
  const [addressModalOpen, setAddressModalOpen] = useState(false);
  const [addressQuery, setAddressQuery] = useState("");
  const [addressResults, setAddressResults] = useState([]);
  const [addressSearching, setAddressSearching] = useState(false);
  const [addressSearchError, setAddressSearchError] = useState("");
  const [selectedAddressResult, setSelectedAddressResult] = useState(null);
  const [orderMethodOpen, setOrderMethodOpen] = useState(false);
  const [fulfillmentMethod, setFulfillmentMethod] = useState("delivery");
  const [signupOpen, setSignupOpen] = useState(false);
  const [customer, setCustomer] = useState(readSavedCustomer);
  const [signupForm, setSignupForm] = useState(emptySignupForm);
  const [signupError, setSignupError] = useState("");

  useEffect(() => {
    getCatalog()
      .then((data) => setCatalog(data))
      .catch(() => setPageError("Unable to load the bakery catalog right now."))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % heroSlides.length);
    }, 4200);

    return () => window.clearInterval(timer);
  }, []);

  const featuredProducts = useMemo(() => {
    if (!catalog) {
      return [];
    }

    return catalog.products.filter((product) => {
      const inCategory =
        selectedCategory === "all" || String(product.category_id) === String(selectedCategory);
      const searchable = `${product.name} ${product.description} ${product.badge}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      return inCategory && searchable;
    });
  }, [catalog, selectedCategory, searchTerm]);

  const cartRows = useMemo(() => {
    if (!catalog) {
      return [];
    }

    return cart
      .map((item) => {
        const product = catalog.products.find((entry) => entry.id === item.productId);
        if (!product) {
          return null;
        }

        return {
          ...item,
          product,
          lineTotal: product.price * item.quantity,
        };
      })
      .filter(Boolean);
  }, [cart, catalog]);

  const subtotal = cartRows.reduce((sum, row) => sum + row.lineTotal, 0);
  const deliveryFee = catalog && fulfillmentMethod === "delivery"
    ? Math.ceil(Math.max(0, Number(form.distance_km) - Number(catalog.settings.freeDeliveryKm))) *
      Number(catalog.settings.deliveryChargePerKm)
    : 0;
  const total = subtotal + deliveryFee;
  const currentSlide = heroSlides[activeSlide];
  const minimumDate = new Date().toISOString().split("T")[0];
  const showcaseProducts = featuredProducts.slice(0, 3).length
    ? featuredProducts.slice(0, 3)
    : catalog?.products?.slice(0, 3) || [];
  const bakeryLocation = catalog?.settings?.bakeryLocation || fallbackBakeryLocation;
  const selectedDistanceKm = selectedAddressResult
    ? calculateDistanceKm(
        Number(bakeryLocation.latitude),
        Number(bakeryLocation.longitude),
        Number(selectedAddressResult.latitude),
        Number(selectedAddressResult.longitude)
      )
    : null;

  function scrollToSection(id) {
    const target = document.getElementById(id);
    if (!target) {
      return;
    }

    const headerOffset = window.innerWidth >= 1024 ? 144 : 124;
    const elementTop = target.getBoundingClientRect().top + window.scrollY;

    window.scrollTo({
      top: Math.max(0, elementTop - headerOffset),
      behavior: "smooth",
    });
  }

  function updateField(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  function addToCart(productId) {
    setCart((current) => {
      const found = current.find((item) => item.productId === productId);
      if (found) {
        return current.map((item) =>
          item.productId === productId ? { ...item, quantity: item.quantity + 1 } : item
        );
      }

      return [...current, { productId, quantity: 1 }];
    });
    setOrderFlash("Item added to cart.");
  }

  function changeQuantity(productId, direction) {
    setCart((current) =>
      current
        .map((item) =>
          item.productId === productId ? { ...item, quantity: item.quantity + direction } : item
        )
        .filter((item) => item.quantity > 0)
    );
  }

  function openSignup() {
    setSignupError("");
    setSignupForm(customer ? { ...emptySignupForm, name: customer.name, phone: customer.phone, email: customer.email } : emptySignupForm);
    setSignupOpen(true);
  }

  function submitSignup(event) {
    event.preventDefault();
    const account = {
      name: signupForm.name.trim(),
      phone: signupForm.phone.trim(),
      email: signupForm.email.trim(),
    };

    if (!account.name || !account.phone || !account.email || signupForm.password.length < 6) {
      setSignupError("Enter your name, phone, email, and a password with at least 6 characters.");
      return;
    }

    window.localStorage.setItem(CUSTOMER_KEY, JSON.stringify(account));
    setCustomer(account);
    setForm((current) => ({ ...current, customer_name: account.name, phone: account.phone }));
    setSignupOpen(false);
    setOrderFlash(`Welcome to Prakash Bakery, ${account.name.split(" ")[0]}!`);
  }

  function openOrderMethod() {
    if (!cartRows.length) {
      setOrderFlash("Add a bakery product before starting your order.");
      scrollToSection("menu-shortcuts");
      return;
    }

    setOrderMethodOpen(true);
  }

  function selectFulfillmentMethod(method) {
    setFulfillmentMethod(method);
    setOrderMethodOpen(false);
    scrollToSection("checkout-rail");
  }

  function openAddressModal() {
    setAddressModalOpen(true);
    setAddressQuery(form.delivery_address || "");
    setAddressSearchError("");
  }

  function closeAddressModal() {
    setAddressModalOpen(false);
    setAddressSearchError("");
  }

  async function searchAddress(event) {
    event.preventDefault();

    if (!addressQuery.trim()) {
      setAddressSearchError("Enter a delivery address to search on the map.");
      setAddressResults([]);
      return;
    }

    setAddressSearching(true);
    setAddressSearchError("");

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=jsonv2&addressdetails=1&limit=5&countrycodes=in&q=${encodeURIComponent(
          addressQuery.trim()
        )}`
      );

      if (!response.ok) {
        throw new Error("Unable to search the address right now.");
      }

      const results = await response.json();
      const normalized = results.map((item) => ({
        id: item.place_id,
        label: item.display_name,
        latitude: Number(item.lat),
        longitude: Number(item.lon),
      }));

      setAddressResults(normalized);
      setSelectedAddressResult(normalized[0] || null);

      if (!normalized.length) {
        setAddressSearchError("No matching address was found. Try adding area, city, or landmark.");
      }
    } catch (error) {
      setAddressSearchError(error.message || "Unable to search the address right now.");
    } finally {
      setAddressSearching(false);
    }
  }

  function confirmAddressSelection() {
    if (!selectedAddressResult) {
      setAddressSearchError("Choose the correct location from the map results first.");
      return;
    }

    setForm((current) => ({
      ...current,
      delivery_address: selectedAddressResult.label,
      distance_km:
        selectedDistanceKm !== null ? selectedDistanceKm.toFixed(1) : current.distance_km,
    }));
    setOrderFlash(
      `Address confirmed. Distance from bakery updated to ${
        selectedDistanceKm !== null ? selectedDistanceKm.toFixed(1) : "0"
      } km.`
    );
    closeAddressModal();
  }

  async function submitOrder(event) {
    event.preventDefault();
    if (!cartRows.length) {
      setOrderFlash("Add at least one product before placing the order.");
      return;
    }

    if (fulfillmentMethod === "delivery" && !form.delivery_address.trim()) {
      setOrderFlash("Please add and confirm the delivery address from the map.");
      return;
    }

    try {
      const response = await placeOrder({
        ...form,
        fulfillment_method: fulfillmentMethod,
        distance_km: fulfillmentMethod === "delivery" ? form.distance_km : 0,
        delivery_latitude: selectedAddressResult?.latitude ?? null,
        delivery_longitude: selectedAddressResult?.longitude ?? null,
        items: cartRows.map((row) => ({
          product_id: row.product.id,
          product_name: row.product.name,
          unit_price: row.product.price,
          quantity: row.quantity,
        })),
      });

      setOrderFlash(`${response.order.order_number} placed successfully.`);
      setCart([]);
      setTrackingPhone(form.phone);
      setForm(emptyForm);
      setSelectedAddressResult(null);
      setAddressQuery("");
      setAddressResults([]);
      scrollToSection("track-orders");
    } catch (error) {
      setOrderFlash(error.message || "Unable to place the order right now.");
    }
  }

  async function runTracking(event) {
    event.preventDefault();
    if (!trackingPhone.trim()) {
      return;
    }

    setTracking(true);
    try {
      const response = await trackOrdersByPhone(trackingPhone.trim());
      setTrackedOrders(response.data || []);
    } catch (error) {
      setOrderFlash(error.message || "Unable to track this order right now.");
    } finally {
      setTracking(false);
    }
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center px-6 text-center text-lg text-bakery-brown-deep">
        Loading Prakash Bakery...
      </main>
    );
  }

  if (pageError) {
    return (
      <main className="flex min-h-screen items-center justify-center px-6 text-center text-lg text-bakery-brown-deep">
        {pageError}
      </main>
    );
  }

  return (
    <main id="hero-top">
      <Storefront products={featuredProducts} categories={catalog.categories} selectedCategory={selectedCategory}
        onCategory={(id) => { setSelectedCategory(id); setSearchTerm(""); }} addToCart={addToCart}
        onOrderNow={openOrderMethod} onSignup={openSignup} customer={customer} cartCount={cartRows.reduce((sum, row) => sum + row.quantity, 0)} flash={orderFlash}
        checkout={<aside id="checkout-rail" className="xl:sticky xl:top-28 xl:self-start">
            <div className="rounded-[2.2rem] border border-white/60 bg-[rgba(250,243,220,0.94)] p-6 shadow-[0_24px_60px_rgba(104,72,32,0.1)] sm:p-7">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between xl:flex-col xl:items-start">
                <div>
                  <p className="mb-2 inline-flex rounded-full border border-[var(--bakery-line)] bg-white/60 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.28em] text-[var(--bakery-brown)]">
                    Cart
                  </p>
                  <h2 className="font-display text-4xl leading-none text-[var(--bakery-copy)]">
                    Your order
                  </h2>
                  <p className="mt-3 max-w-sm text-sm leading-7 text-[var(--bakery-muted)]">
                    Bakery checkout with delivery timing, nearby area charges, and simple customer details.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setCart([])}
                  className="rounded-full border border-[var(--bakery-line)] bg-white/70 px-5 py-3 text-sm font-semibold text-[var(--bakery-brown)] transition hover:-translate-y-0.5"
                >
                  Clear
                </button>
              </div>

              <div className="mt-5 grid gap-3">
                {conciergePoints.map((point) => (
                  <article
                    key={point}
                    className="rounded-[1.4rem] border border-[var(--bakery-line)] bg-[linear-gradient(180deg,rgba(250,242,215,0.98),rgba(231,211,148,0.95))] px-4 py-3 text-sm leading-6 text-[var(--bakery-muted-strong)]"
                  >
                    {point}
                  </article>
                ))}
              </div>

              <div className="mt-6 grid gap-4">
                {cartRows.length ? (
                  cartRows.map((row) => (
                    <article
                      key={row.product.id}
                      className="rounded-[1.5rem] border border-[var(--bakery-line)] bg-white/70 p-4"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <strong className="block text-[var(--bakery-brown-deep)]">
                            {row.product.name}
                          </strong>
                          <span className="mt-1 block text-sm text-[var(--bakery-muted)]">
                            {formatMoney(row.product.price)} each
                          </span>
                        </div>
                        <strong className="text-[var(--bakery-brown-deep)]">
                          {formatMoney(row.lineTotal)}
                        </strong>
                      </div>
                      <div className="mt-4 inline-flex items-center gap-3 rounded-full bg-[var(--bakery-panel-gold)] p-2">
                        <button
                          type="button"
                          onClick={() => changeQuantity(row.product.id, -1)}
                          className="grid h-8 w-8 place-items-center rounded-full bg-white text-[var(--bakery-brown-deep)]"
                        >
                          -
                        </button>
                        <span className="min-w-5 text-center text-sm font-semibold text-[var(--bakery-brown-deep)]">
                          {row.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => changeQuantity(row.product.id, 1)}
                          className="grid h-8 w-8 place-items-center rounded-full bg-white text-[var(--bakery-brown-deep)]"
                        >
                          +
                        </button>
                      </div>
                    </article>
                  ))
                ) : (
                  <div className="rounded-[1.7rem] border border-[var(--bakery-line)] bg-white/70 p-5">
                    <h3 className="font-display text-3xl leading-none text-[var(--bakery-copy)]">
                      No items yet
                    </h3>
                    <p className="mt-3 text-sm leading-7 text-[var(--bakery-muted-strong)]">
                      Add cakes, snacks, biscuits, or breads to continue.
                    </p>
                  </div>
                )}
              </div>

              <div className="mt-6 rounded-[1.7rem] border border-[var(--bakery-line)] bg-white/70 p-5">
                <div className="flex items-center justify-between gap-3 text-sm text-[var(--bakery-muted-strong)]">
                  <span>Subtotal</span>
                  <span>{formatMoney(subtotal)}</span>
                </div>
                <div className="mt-3 flex items-center justify-between gap-3 text-sm text-[var(--bakery-muted-strong)]">
                  <span>{fulfillmentMethod === "delivery" ? "Delivery fee" : "Take away fee"}</span>
                  <span>{formatMoney(deliveryFee)}</span>
                </div>
                <div className="mt-4 flex items-center justify-between gap-3 border-t border-[var(--bakery-line)] pt-4">
                  <strong className="text-[var(--bakery-brown-deep)]">Total</strong>
                  <strong className="text-lg text-[var(--bakery-brown-deep)]">
                    {formatMoney(total)}
                  </strong>
                </div>
              </div>

              <form onSubmit={submitOrder} className="mt-6 grid gap-4">
                <div className="rounded-2xl border border-[var(--bakery-line)] bg-[var(--bakery-panel-warm)] px-4 py-3 text-sm font-semibold text-[var(--bakery-brown-deep)]">
                  Order type: {fulfillmentMethod === "delivery" ? "Delivery" : "Take away"}
                  <button type="button" onClick={openOrderMethod} className="ml-3 underline underline-offset-2">Change</button>
                </div>
                <label className="grid gap-2 text-sm font-semibold text-[var(--bakery-brown)]">
                  Customer name
                  <input
                    name="customer_name"
                    value={form.customer_name}
                    onChange={updateField}
                    required
                    className="h-13 rounded-2xl border border-[var(--bakery-line)] bg-white/80 px-4 py-3 text-[var(--bakery-copy)] outline-none"
                  />
                </label>
                <label className="grid gap-2 text-sm font-semibold text-[var(--bakery-brown)]">
                  Phone number
                  <input
                    name="phone"
                    type="tel"
                    value={form.phone}
                    onChange={updateField}
                    required
                    className="h-13 rounded-2xl border border-[var(--bakery-line)] bg-white/80 px-4 py-3 text-[var(--bakery-copy)] outline-none"
                  />
                </label>
                <label className="grid gap-2 text-sm font-semibold text-[var(--bakery-brown)]">
                  Delivery date
                  <input
                    name="delivery_date"
                    type="date"
                    min={minimumDate}
                    value={form.delivery_date}
                    onChange={updateField}
                    required
                    className="h-13 rounded-2xl border border-[var(--bakery-line)] bg-white/80 px-4 py-3 text-[var(--bakery-copy)] outline-none"
                  />
                </label>
                <label className="grid gap-2 text-sm font-semibold text-[var(--bakery-brown)]">
                  Time slot
                  <select
                    name="delivery_slot"
                    value={form.delivery_slot}
                    onChange={updateField}
                    required
                    className="h-13 rounded-2xl border border-[var(--bakery-line)] bg-white/80 px-4 py-3 text-[var(--bakery-copy)] outline-none"
                  >
                    <option value="">Choose a slot</option>
                    {catalog.settings.timeSlots.map((slot) => (
                      <option key={slot} value={slot}>
                        {slot}
                      </option>
                    ))}
                  </select>
                </label>
                {fulfillmentMethod === "delivery" ? <><label className="grid gap-2 text-sm font-semibold text-[var(--bakery-brown)]">
                  Delivery address
                  <button
                    type="button"
                    onClick={openAddressModal}
                    className="min-h-28 rounded-2xl border border-[var(--bakery-line)] bg-white/80 px-4 py-4 text-left text-[var(--bakery-copy)] outline-none transition hover:-translate-y-0.5"
                  >
                    <span className="block text-sm font-semibold text-[var(--bakery-brown-deep)]">
                      {form.delivery_address ? "Update delivery location" : "Add delivery location"}
                    </span>
                    <span className="mt-2 block text-sm leading-6 text-[var(--bakery-muted-strong)]">
                      {form.delivery_address
                        ? form.delivery_address
                        : "Click to search the customer's address, view it on the map, confirm the correct location, and auto-calculate the distance from bakery."}
                    </span>
                  </button>
                  {selectedAddressResult ? (
                    <span className="text-xs font-medium text-[var(--bakery-muted)]">
                      Confirmed map location: {selectedAddressResult.latitude.toFixed(4)},{" "}
                      {selectedAddressResult.longitude.toFixed(4)}
                    </span>
                  ) : null}
                </label>
                <label className="grid gap-2 text-sm font-semibold text-[var(--bakery-brown)]">
                  Distance from bakery (km)
                  <input
                    name="distance_km"
                    type="number"
                    step="0.1"
                    min="0"
                    value={form.delivery_address ? form.distance_km : ""}
                    placeholder="Confirm your address first"
                    required
                    readOnly
                    className="h-13 rounded-2xl border border-[var(--bakery-line)] bg-stone-100/90 px-4 py-3 text-[var(--bakery-copy)] outline-none"
                  />
                  <span className="text-xs font-medium text-[var(--bakery-muted)]">
                    This value is calculated automatically after address confirmation.
                  </span>
                </label></> : <div className="rounded-2xl border border-[var(--bakery-line)] bg-white/80 p-4 text-sm leading-6 text-[var(--bakery-muted-strong)]">
                  Collect your order from Prakash Bakery during your selected time slot. We will share the pickup confirmation on your phone.
                </div>}
                <label className="grid gap-2 text-sm font-semibold text-[var(--bakery-brown)]">
                  Notes
                  <textarea
                    name="notes"
                    value={form.notes}
                    onChange={updateField}
                    className="min-h-24 rounded-2xl border border-[var(--bakery-line)] bg-white/80 px-4 py-3 text-[var(--bakery-copy)] outline-none"
                  />
                </label>
                <button
                  type="submit"
                  className="mt-2 rounded-full bg-[linear-gradient(135deg,var(--bakery-brown-deep),var(--bakery-brown))] px-6 py-4 text-sm font-semibold text-white shadow-[0_18px_30px_rgba(104,72,32,0.18)] transition hover:-translate-y-0.5"
                >
                  Place order
                </button>
              </form>
            </div>
          </aside>}
        tracking={<section id="track-orders" className="mt-10">
              <SectionHeader eyebrow="Track order" title="Check bakery order progress by phone number" />
              <form onSubmit={runTracking} className="flex flex-col gap-3 sm:flex-row">
                <input
                  name="trackingPhone"
                  placeholder="Enter phone number"
                  value={trackingPhone}
                  onChange={(event) => setTrackingPhone(event.target.value)}
                  className="h-14 flex-1 rounded-full border border-[var(--bakery-line)] bg-white/75 px-5 text-[var(--bakery-copy)] outline-none placeholder:text-[var(--bakery-muted)]"
                />
                <button
                  type="submit"
                  className="h-14 rounded-full border border-[var(--bakery-line)] bg-white/75 px-6 text-sm font-semibold text-[var(--bakery-brown)] transition hover:-translate-y-0.5"
                >
                  {tracking ? "Checking..." : "Track order"}
                </button>
              </form>

              <div className="mt-5 grid gap-4">
                {trackedOrders.map((order) => (
                  <article
                    key={order.order_number}
                    className="rounded-[1.8rem] border border-white/60 bg-white/70 p-5 shadow-[0_16px_34px_rgba(104,72,32,0.07)]"
                  >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <h3 className="font-display text-3xl leading-none text-[var(--bakery-copy)]">
                          {order.order_number}
                        </h3>
                        <span className="mt-2 block text-sm text-[var(--bakery-muted)]">
                          {order.delivery_date} | {order.delivery_slot}
                        </span>
                      </div>
                      <span
                        className={`rounded-full px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] ${getStatusClasses(
                          order.status
                        )}`}
                      >
                        {formatStatus(order.status)}
                      </span>
                    </div>

                    <p className="mt-4 text-sm text-[var(--bakery-muted-strong)]">
                      Total <strong>{formatMoney(order.total)}</strong>
                    </p>

                    <div className="mt-4 flex flex-wrap gap-2">
                      {deliverySteps.map((step) => {
                        const done =
                          deliverySteps.indexOf(step) <= deliverySteps.indexOf(order.status);
                        return (
                          <span
                            key={step}
                            className={`rounded-full px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] ${
                              done
                                ? "bg-[var(--bakery-gold)] text-[var(--bakery-brown-deep)]"
                                : "bg-white/70 text-[var(--bakery-muted)]"
                            }`}
                          >
                            {done ? "Done" : "Open"}: {formatStatus(step)}
                          </span>
                        );
                      })}
                    </div>

                    <p className="mt-4 text-xs uppercase tracking-[0.18em] text-[var(--bakery-brown)]">
                      OTP: {order.otp_code || "Generated after order acceptance"}
                    </p>
                  </article>
                ))}
              </div>
            </section>} />

      {signupOpen ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-[rgba(45,32,25,0.5)] px-5 py-6" role="dialog" aria-modal="true" aria-labelledby="signup-title">
          <form onSubmit={submitSignup} className="w-full max-w-md rounded-[2rem] border border-white/60 bg-[var(--bakery-paper)] p-6 shadow-[0_30px_80px_rgba(45,32,25,0.3)] sm:p-8">
            <div className="flex items-start justify-between gap-4">
              <div><p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--bakery-brown)]">Prakash Bakery</p><h2 id="signup-title" className="mt-3 font-display text-3xl text-[var(--bakery-copy)]">Create your account</h2><p className="mt-3 text-sm leading-6 text-[var(--bakery-muted-strong)]">Save your details for faster bakery ordering and order tracking.</p></div>
              <button type="button" onClick={() => setSignupOpen(false)} aria-label="Close sign up" className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-[var(--bakery-line)] text-lg text-[var(--bakery-brown-deep)]">×</button>
            </div>
            <div className="mt-6 grid gap-4">
              <label className="grid gap-2 text-sm font-semibold text-[var(--bakery-brown)]">Full name<input value={signupForm.name} onChange={(event) => setSignupForm((current) => ({ ...current, name: event.target.value }))} autoComplete="name" required className="h-12 rounded-xl border border-[var(--bakery-line)] bg-white px-4 text-[var(--bakery-copy)] outline-none" /></label>
              <label className="grid gap-2 text-sm font-semibold text-[var(--bakery-brown)]">Phone number<input type="tel" value={signupForm.phone} onChange={(event) => setSignupForm((current) => ({ ...current, phone: event.target.value }))} autoComplete="tel" required className="h-12 rounded-xl border border-[var(--bakery-line)] bg-white px-4 text-[var(--bakery-copy)] outline-none" /></label>
              <label className="grid gap-2 text-sm font-semibold text-[var(--bakery-brown)]">Email address<input type="email" value={signupForm.email} onChange={(event) => setSignupForm((current) => ({ ...current, email: event.target.value }))} autoComplete="email" required className="h-12 rounded-xl border border-[var(--bakery-line)] bg-white px-4 text-[var(--bakery-copy)] outline-none" /></label>
              <label className="grid gap-2 text-sm font-semibold text-[var(--bakery-brown)]">Password<input type="password" value={signupForm.password} onChange={(event) => setSignupForm((current) => ({ ...current, password: event.target.value }))} autoComplete="new-password" minLength="6" required className="h-12 rounded-xl border border-[var(--bakery-line)] bg-white px-4 text-[var(--bakery-copy)] outline-none" /></label>
            </div>
            {signupError ? <p role="alert" className="mt-4 text-sm font-semibold text-red-700">{signupError}</p> : null}
            <button type="submit" className="mt-6 w-full rounded-full bg-[linear-gradient(135deg,var(--bakery-brown-deep),var(--bakery-brown))] px-6 py-4 text-sm font-semibold text-white shadow-[0_18px_30px_rgba(104,72,32,0.18)]">Create account</button>
            <p className="mt-4 text-center text-xs leading-5 text-[var(--bakery-muted)]">This local preview saves account details only in this browser.</p>
          </form>
        </div>
      ) : null}

      {orderMethodOpen ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-[rgba(45,32,25,0.5)] px-5 py-6" role="dialog" aria-modal="true" aria-labelledby="order-method-title">
          <div className="w-full max-w-md rounded-[2rem] border border-white/60 bg-[var(--bakery-paper)] p-6 shadow-[0_30px_80px_rgba(45,32,25,0.3)] sm:p-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--bakery-brown)]">Choose order type</p>
                <h2 id="order-method-title" className="mt-3 font-display text-3xl text-[var(--bakery-copy)]">How would you like your order?</h2>
                <p className="mt-3 text-sm leading-6 text-[var(--bakery-muted-strong)]">Choose delivery for your address or take away to collect from the bakery.</p>
              </div>
              <button type="button" onClick={() => setOrderMethodOpen(false)} aria-label="Close order type selection" className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-[var(--bakery-line)] text-lg text-[var(--bakery-brown-deep)]">×</button>
            </div>
            <div className="mt-7 grid gap-3">
              <button type="button" onClick={() => selectFulfillmentMethod("delivery")} className="rounded-[1.5rem] border border-[var(--bakery-line)] bg-[linear-gradient(135deg,#fff7e6,#f4dfab)] p-5 text-left transition hover:-translate-y-0.5 hover:border-[var(--bakery-brown)]">
                <span className="text-2xl" aria-hidden="true">&#128666;</span>
                <span className="mt-3 block font-display text-2xl font-bold text-[var(--bakery-copy)]">Delivery</span>
                <span className="mt-2 block text-sm leading-6 text-[var(--bakery-muted-strong)]">Delivered to your confirmed address. Free within 5 km.</span>
              </button>
              <button type="button" onClick={() => selectFulfillmentMethod("takeaway")} className="rounded-[1.5rem] border border-[var(--bakery-line)] bg-white/80 p-5 text-left transition hover:-translate-y-0.5 hover:border-[var(--bakery-brown)]">
                <span className="text-2xl" aria-hidden="true">&#128717;</span>
                <span className="mt-3 block font-display text-2xl font-bold text-[var(--bakery-copy)]">Take away</span>
                <span className="mt-2 block text-sm leading-6 text-[var(--bakery-muted-strong)]">Collect your fresh order directly from Prakash Bakery.</span>
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {addressModalOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(45,32,25,0.45)] px-4 py-6">
          <div className="max-h-[90vh] w-full max-w-5xl overflow-auto rounded-[2rem] border border-white/60 bg-[var(--bakery-paper)] p-5 shadow-[0_30px_80px_rgba(45,32,25,0.28)] sm:p-7">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="inline-flex rounded-full border border-[var(--bakery-line)] bg-white/70 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.28em] text-[var(--bakery-brown)]">
                  Delivery location
                </p>
                <h3 className="mt-3 font-display text-4xl leading-none text-[var(--bakery-copy)]">
                  Search and confirm customer address
                </h3>
                <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--bakery-muted-strong)]">
                  Search the address, open the matching map location, and confirm the correct point.
                  After confirmation, the bakery-to-customer distance is filled automatically.
                </p>
              </div>
              <button
                type="button"
                onClick={closeAddressModal}
                className="rounded-full border border-[var(--bakery-line)] bg-white px-4 py-2 text-sm font-semibold text-[var(--bakery-brown-deep)]"
              >
                Close
              </button>
            </div>

            <div className="mt-5 rounded-[1.5rem] border border-[var(--bakery-line)] bg-white/70 p-4">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--bakery-brown)]">
                Distance origin
              </p>
              <p className="mt-2 text-sm font-semibold text-[var(--bakery-brown-deep)]">
                {bakeryLocation.label}
              </p>
              <p className="mt-1 text-sm leading-6 text-[var(--bakery-muted-strong)]">
                {bakeryLocation.address}
              </p>
            </div>

            <div className="mt-6 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
              <div>
                <form onSubmit={searchAddress} className="flex flex-col gap-3">
                  <label className="grid gap-2 text-sm font-semibold text-[var(--bakery-brown)]">
                    Customer delivery address
                    <input
                      value={addressQuery}
                      onChange={(event) => setAddressQuery(event.target.value)}
                      placeholder="House number, area, landmark, city"
                      className="h-13 rounded-2xl border border-[var(--bakery-line)] bg-white px-4 py-3 text-[var(--bakery-copy)] outline-none"
                    />
                  </label>
                  <button
                    type="submit"
                    className="rounded-full bg-[linear-gradient(135deg,var(--bakery-brown-deep),var(--bakery-brown))] px-6 py-3 text-sm font-semibold text-white shadow-[0_18px_30px_rgba(104,72,32,0.18)]"
                  >
                    {addressSearching ? "Searching map..." : "Search location on map"}
                  </button>
                </form>

                {addressSearchError ? (
                  <div className="mt-4 rounded-[1.2rem] border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
                    {addressSearchError}
                  </div>
                ) : null}

                <div className="mt-5 grid gap-3">
                  {addressResults.map((result) => {
                    const isActive = selectedAddressResult?.id === result.id;

                    return (
                      <button
                        key={result.id}
                        type="button"
                        onClick={() => setSelectedAddressResult(result)}
                        className={`rounded-[1.35rem] border px-4 py-4 text-left transition ${
                          isActive
                            ? "border-[var(--bakery-brown)] bg-[linear-gradient(180deg,#f8efcc,#ebd18a)] shadow-[0_16px_30px_rgba(104,72,32,0.12)]"
                            : "border-[var(--bakery-line)] bg-white/75 hover:-translate-y-0.5"
                        }`}
                      >
                        <span className="block text-sm font-semibold text-[var(--bakery-brown-deep)]">
                          {isActive ? "Selected location" : "Choose this location"}
                        </span>
                        <span className="mt-2 block text-sm leading-6 text-[var(--bakery-muted-strong)]">
                          {result.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid gap-4">
                <div className="overflow-hidden rounded-[1.8rem] border border-[var(--bakery-line)] bg-white shadow-[0_18px_36px_rgba(104,72,32,0.08)]">
                  {selectedAddressResult ? (
                    <iframe
                      title="Customer delivery map"
                      src={buildMapEmbedUrl(
                        selectedAddressResult.latitude,
                        selectedAddressResult.longitude
                      )}
                      className="h-[22rem] w-full border-0"
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    />
                  ) : (
                    <div className="grid h-[22rem] place-items-center bg-[linear-gradient(180deg,#fff8e8,#f2deb0)] px-6 text-center">
                      <div>
                        <p className="text-sm font-semibold text-[var(--bakery-brown-deep)]">
                          Search an address to preview the location on map
                        </p>
                        <p className="mt-2 text-sm leading-6 text-[var(--bakery-muted-strong)]">
                          The customer can review the address before confirming it for delivery.
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="rounded-[1.6rem] border border-[var(--bakery-line)] bg-white/80 p-5">
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--bakery-brown)]">
                    Confirmation summary
                  </p>
                  <p className="mt-3 text-sm leading-7 text-[var(--bakery-muted-strong)]">
                    {selectedAddressResult
                      ? selectedAddressResult.label
                      : "Select a searched location to confirm the address and calculate the distance."}
                  </p>
                  <div className="mt-4 flex flex-wrap items-center gap-3">
                    <span className="rounded-full bg-[var(--bakery-panel-warm)] px-4 py-2 text-sm font-semibold text-[var(--bakery-brown-deep)]">
                      Distance:{" "}
                      {selectedDistanceKm !== null ? `${selectedDistanceKm.toFixed(1)} km` : "--"}
                    </span>
                    <button
                      type="button"
                      onClick={confirmAddressSelection}
                      disabled={!selectedAddressResult}
                      className="rounded-full bg-[linear-gradient(135deg,var(--bakery-brown-deep),var(--bakery-brown))] px-6 py-3 text-sm font-semibold text-white shadow-[0_18px_30px_rgba(104,72,32,0.18)] transition disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Confirm this location
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </main>
  );
}

export default App;
