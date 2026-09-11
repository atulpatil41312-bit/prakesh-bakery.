import OrderHistory from "./OrderHistory";

const photo = (id) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=900&q=85`;
const photos = {
  1: photo('photo-1578985545062-69928b1d9587'),
  2: photo('photo-1601050690597-df0568f70950'),
  3: photo('photo-1499636136210-6f4ee915583e'),
  4: photo('photo-1509440159596-0249088772ff'),
};
const productPhotos = {
  101: photo('photo-1578985545062-69928b1d9587'),
  102: photo('photo-1571115177098-24ec42ed204d'),
  201: photo('photo-1601050690597-df0568f70950'),
  202: photo('photo-1603894584373-5ac82b2ae398'),
  301: photo('photo-1499636136210-6f4ee915583e'),
  302: photo('photo-1558961363-fa8fdf82db35'),
  401: photo('photo-1509440159596-0249088772ff'),
  402: photo('photo-1549931319-a545dcf3bc73'),
};

const productImage = (product) => (
  product.image && !product.image.endsWith('.svg')
    ? product.image
    : productPhotos[product.id] || photos[product.category_id]
);

export default function Storefront({ products, categories, selectedCategory, onCategory, addToCart, onOrderNow, onSignup, onCustomize, customer, checkout, tracking, flash, cartCount }) {
  const mobilePreview = new URLSearchParams(window.location.search).has("mobile-preview");

  return <div className={`shop-shell${mobilePreview ? " mobile-preview" : ""}`}>
    <header className="shop-header"><div className="shop-width flex items-center justify-between gap-4">
      <a href="#hero-top" className="font-display text-lg font-bold">Prakash Bakery</a>
      <nav aria-label="Main navigation" className="shop-navigation flex items-center gap-5 text-sm font-bold"><a href="#menu-shortcuts">Our bakes</a><a href="#favourites">Favourites</a><a href="#footer-section">Visit us</a><a href="#track-orders">Track Order</a><a href="#order-history">Order History</a></nav>
      <div className="shop-header-actions flex items-center gap-2"><button type="button" onClick={onSignup} className="shop-signup">{customer ? `Hi, ${customer.name.split(" ")[0]}` : "Sign up"}</button><button type="button" onClick={onOrderNow} className="shop-button">Order now{cartCount ? ` (${cartCount})` : ''}</button></div>
    </div></header>

    <section className="shop-hero"><div className="shop-width grid items-center gap-12 py-16 md:grid-cols-2 md:py-24">
      <div className="shop-reveal"><p className="shop-eyebrow">Contemporary Indian bakery</p><h1 className="mt-6 font-display text-4xl font-bold leading-tight lg:text-5xl">Freshly Baked. Truly Indian.</h1>
      <p className="mt-8 max-w-lg leading-relaxed">Celebration cakes, flaky savouries, soft breads and buttery biscuits — baked with warmth for every kind of gathering.</p>
      <div className="mt-8 flex flex-wrap gap-3"><button type="button" onClick={onOrderNow} className="shop-button">Order now</button><a href="#menu-shortcuts" className="shop-button shop-button-light">Explore menu</a><button type="button" onClick={onCustomize} className="shop-button shop-button-light">Customize a cake</button></div>
      <p className="mt-7 text-sm font-bold text-[#4e7450]">A little sweetness · A little comfort · Made for sharing</p></div>
      <div className="relative"><img className="shop-hero-photo" src={photo('photo-1509440159596-0249088772ff')} alt="Freshly baked breads at the bakery counter" onError={(event) => { event.currentTarget.onerror = null; event.currentTarget.src = '/images/hero/hero-bakery-counter.svg'; }} /><p className="absolute -bottom-5 left-0 max-w-60 rounded-2xl bg-white p-5 text-sm font-bold shadow-lg md:-left-8">Baked with old-world comfort, styled for today.</p></div>
    </div></section>

    <section id="menu-shortcuts" className="shop-width py-20"><p className="shop-eyebrow">From our counter</p><h2 className="shop-title">Your everyday favourites, beautifully baked.</h2><p className="mt-5 max-w-xl">Choose a few classics or build a generous spread. Every bake is made to bring a little more joy to the table.</p>
      <div className="my-8 flex flex-wrap gap-2" aria-label="Product categories">{[{ id: 'all', name: 'All treats' }, ...categories].map(category => <button type="button" key={category.id} aria-pressed={String(selectedCategory) === String(category.id)} onClick={() => onCategory(category.id)} className={`shop-filter ${String(selectedCategory) === String(category.id) ? 'is-active' : ''}`}>{category.name}</button>)}</div>
      <div id="bestsellers" className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">{products.map(product => <article key={product.id} className="shop-product">
        <img src={productImage(product)} onError={(event) => { event.currentTarget.onerror = null; event.currentTarget.src = photos[product.category_id] || '/images/hero/hero-bakery-counter.svg'; }} alt={product.name} loading="lazy" />
        <div className="flex flex-1 flex-col p-5"><p className="text-xs font-bold uppercase tracking-[0.16em] text-[#4e7450]">{product.badge || 'From our counter'}</p><h3 className="mt-3 font-display text-lg font-bold">{product.name}</h3><p className="mt-3 flex-1 text-sm leading-relaxed">{product.description}</p><p className="my-4 text-sm font-bold text-[#bd7426]">{new Intl.NumberFormat('en-IN', {style:'currency',currency:'INR',maximumFractionDigits:0}).format(product.price)} <span className="font-normal">/ {product.unit}</span></p><button type="button" className="shop-button w-full" onClick={() => addToCart(product.id)}>Add to order</button></div>
      </article>)}</div>{!products.length && <p className="py-10">No bakes in this category just yet.</p>}
    </section>

    <section className="bg-[#f6eddd] py-16"><div className="shop-width grid items-center gap-8 md:grid-cols-[0.85fr_1.15fr]"><div className="rounded-3xl bg-[#fffaf0] p-10"><span className="text-4xl text-[#c79238]" aria-hidden="true">✧</span><h2 className="mt-6 font-display text-2xl font-bold leading-relaxed">Flour on our hands. Warmth in every welcome.</h2></div><div><p className="shop-eyebrow">The Prakash way</p><h2 className="shop-title">A neighbourhood bakery with a distinctly desi heart.</h2><p className="mt-5 leading-relaxed">From the first slice at breakfast to the last biscuit with evening chai, there is always a reason to stop by. Discover familiar bakery classics for everyday moments and family celebrations.</p><div className="mt-6 grid grid-cols-3 gap-3">{['Celebration cakes', 'Chai-time favourites', 'Made for sharing'].map(text => <p key={text} className="rounded-xl bg-white p-4 text-xs font-bold">{text}</p>)}</div></div></div></section>

    <section id="favourites" className="shop-width grid gap-8 py-20 md:grid-cols-2"><div><p className="shop-eyebrow">For your everyday rituals</p><h2 className="shop-title">The little bakery rituals we love.</h2><div className="mt-7 rounded-3xl bg-[#f6eddd] p-8"><span className="font-display text-4xl text-[#c79238]">“</span><p className="font-display text-xl leading-relaxed">A warm cup of chai. Something crisp from the biscuit tin. A little pause, just for you.</p><p className="mt-5 text-sm font-bold text-[#4e7450]">Make room for a little sweetness.</p></div></div><div className="rounded-3xl bg-[#571e36] p-8 text-[#fffaf0]"><h2 className="font-display text-2xl font-bold">Find your next favourite</h2><div className="mt-7 grid gap-5">{['A celebration cake for your special day', 'Buttery biscuits with your evening chai', 'A crisp savoury bite to share'].map((text,index) => <a href="#menu-shortcuts" key={text} className="flex items-center gap-4 text-sm font-semibold"><span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#f2b632] text-[#571e36]">{index + 1}</span>{text}</a>)}</div></div></section>

    <section className="shop-order py-20"><div className="shop-width grid items-start gap-12 md:grid-cols-[0.6fr_1fr]"><div><p className="shop-eyebrow">Easy ordering</p><h2 className="shop-title">Bring something lovely home.</h2><p className="mt-6 leading-relaxed">Add bakery favourites to your order, then choose a delivery time that works for you.</p><p className="mt-5 text-sm font-bold">Free delivery within 5 km. Delivery charges apply beyond that.</p><p className="mt-7 text-sm">For celebration cakes and larger orders, please allow a little extra lead time.</p><a href="#track-orders" className="mt-6 inline-block underline underline-offset-4">Track an existing order</a></div><div className="shop-checkout">{checkout}</div></div></section>
    <section className="shop-width py-14 shop-tracking">{tracking}</section>
    <OrderHistory />
    <section id="footer-section" className="shop-width pb-20"><p className="shop-eyebrow">Come by</p><h2 className="shop-title">Drop in for warm bakes and a little sweetness.</h2><div className="mt-8 grid gap-5 sm:grid-cols-3">{[['Plan your order', 'Choose from the available delivery slots at checkout.'], ['Find your location', 'Confirm your delivery address on the map when ordering.'], ['Say namaste', 'Prakash Bakery. Cakes, breads, biscuits and savoury favourites.']].map(([title,text]) => <div key={title} className="rounded-3xl bg-[#f6eddd] p-7"><h3 className="font-display text-lg font-bold">{title}</h3><p className="mt-4 text-sm">{text}</p></div>)}</div></section>
    <section className="bg-[#4e7450] py-12 text-white"><div className="shop-width flex flex-col justify-between gap-6 sm:flex-row sm:items-center"><div><h2 className="font-display text-2xl font-bold">A little sweetness in your day.</h2><p className="mt-3 text-sm">Find your favourite bakes for your next gathering.</p></div><a href="#menu-shortcuts" className="shop-button bg-[#f5b431]! text-[#571e36]!">Explore our bakes</a></div></section>
    <footer className="bg-[#571e36] py-8 text-[#fffaf0]"><div className="shop-width flex flex-wrap justify-between gap-4 text-sm"><div><p className="font-display font-bold">Prakash Bakery</p><p className="mt-2 opacity-80">Fresh from our oven, for your table.</p></div><a href="#hero-top">Back to top ↑</a></div></footer>
    {flash && <div role="status" className="fixed bottom-5 left-1/2 z-40 w-[min(90%,32rem)] -translate-x-1/2 rounded-2xl bg-[#571e36] px-6 py-4 text-center text-sm text-white shadow-lg">{flash}</div>}
  </div>;
}
