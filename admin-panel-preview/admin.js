const productSection = document.getElementById("products");
const cards = [...productSection.querySelectorAll(".catalog-card")];
const categoryButtons = [...document.querySelectorAll("[data-category]")];
let activeCategory = null;

function showProducts(category = null) {
  activeCategory = category;
  let count = 0;
  cards.forEach(card => {
    card.hidden = Boolean(category && card.querySelector(".tag").textContent.trim() !== category);
    if (!card.hidden) count += 1;
  });
  categoryButtons.forEach(button => {
    button.setAttribute("aria-pressed", String(button.dataset.category === category));
  });
  document.getElementById("inventory-heading").textContent = category ? `${category} products` : "All products";
  document.getElementById("inventory-summary").textContent = count ? `Showing ${count} preview product${count === 1 ? "" : "s"}${category ? ` in ${category}` : ""}.` : "No products have been added to this category yet.";
  window.location.hash = "products";
  productSection.focus({ preventScroll: true });
  productSection.scrollIntoView({ block: "start" });
}

categoryButtons.forEach(button => button.addEventListener("click", () => showProducts(button.dataset.category)));

const categoryKey = "prakash-admin-preview-categories";
const categoryForm = document.getElementById("add-category-form");
const categoryMessage = document.getElementById("category-message");
const categoryGrid = document.querySelector("#categories .inventory");
let savedCategories = [];
const normalizeName = name => name.trim().replace(/\s+/g, " ").toLocaleLowerCase();

function appendCategory(category) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "catalog-card category-button";
  button.dataset.category = category.name;
  button.setAttribute("aria-pressed", "false");
  button.setAttribute("aria-controls", "products");
  const title = document.createElement("strong");
  title.textContent = category.name;
  const description = document.createElement("span");
  description.textContent = category.description || "Browse products in this category.";
  const action = document.createElement("span");
  action.className = "category-action";
  action.textContent = "View products →";
  button.append(title, description, action);
  button.addEventListener("click", () => showProducts(category.name));
  categoryButtons.push(button);
  categoryGrid.append(button);
}

function updateCategoryCount() {
  document.querySelector('.metrics a[href="#categories"] strong').textContent = categoryButtons.length;
}

try {
  const stored = JSON.parse(localStorage.getItem(categoryKey) || "[]");
  if (!Array.isArray(stored)) throw new Error("Invalid categories");
  stored.forEach(category => {
    if (typeof category?.name !== "string" || !category.name.trim() || category.name.length > 80) return;
    if (categoryButtons.some(button => normalizeName(button.dataset.category) === normalizeName(category.name))) return;
    const valid = { name: category.name.trim(), description: typeof category.description === "string" ? category.description.slice(0, 300) : "" };
    savedCategories.push(valid);
    appendCategory(valid);
  });
} catch {
  categoryMessage.textContent = "Saved categories could not be loaded in this browser.";
}
updateCategoryCount();

categoryForm.addEventListener("submit", event => {
  event.preventDefault();
  const name = categoryForm.elements.category_name.value.trim().replace(/\s+/g, " ");
  const description = categoryForm.elements.category_description.value.trim();
  if (!name) {
    categoryMessage.textContent = "Enter a category name.";
    categoryForm.elements.category_name.focus();
    return;
  }
  if (categoryButtons.some(button => normalizeName(button.dataset.category) === normalizeName(name))) {
    categoryMessage.textContent = "A category with this name already exists.";
    categoryForm.elements.category_name.focus();
    return;
  }
  const category = { name, description };
  try {
    localStorage.setItem(categoryKey, JSON.stringify([...savedCategories, category]));
  } catch {
    categoryMessage.textContent = "Unable to save. Please allow browser storage and try again.";
    return;
  }
  savedCategories.push(category);
  appendCategory(category);
  updateCategoryCount();
  categoryForm.reset();
  categoryForm.closest("details").open = false;
  categoryMessage.textContent = `${name} added. Saved in this browser's preview.`;
  categoryButtons.at(-1).focus();
});
document.getElementById("cancel-category").addEventListener("click", () => {
  categoryForm.reset();
  categoryForm.closest("details").open = false;
  categoryForm.closest("details").querySelector("summary").focus();
});
document.getElementById("show-all-products").addEventListener("click", () => showProducts());
document.querySelector('.metrics a[href="#products"]').addEventListener("click", event => {
  event.preventDefault();
  showProducts();
});

const productForm = document.getElementById("add-product-form");
const productMessage = document.getElementById("product-message");
const productKey = "prakash-admin-preview-products";
let savedProducts = [];
let productImage = "";
let imageLoading = false;
let imageVersion = 0;
const imageInput = productForm.elements.product_image;
const imagePreview = document.getElementById("product-image-preview");
const imageMessage = document.getElementById("image-message");
const removeImage = document.getElementById("remove-product-image");

function clearProductImage() {
  imageVersion += 1;
  productImage = "";
  imageLoading = false;
  imageInput.value = "";
  imageInput.setCustomValidity("");
  imagePreview.removeAttribute("src");
  imagePreview.hidden = true;
  removeImage.hidden = true;
  imageMessage.textContent = "";
}
productForm.addEventListener("reset", clearProductImage);
removeImage.addEventListener("click", clearProductImage);
imageInput.addEventListener("change", async () => {
  const file = imageInput.files[0];
  clearProductImage();
  if (!file) return;
  const version = imageVersion;
  removeImage.hidden = false;
  if (!["image/jpeg", "image/png", "image/webp"].includes(file.type) || file.size > 1024 * 1024) {
    imageMessage.textContent = "Choose a JPG, PNG or WebP file no larger than 1 MB.";
    imageInput.setCustomValidity(imageMessage.textContent);
    return;
  }
  imageLoading = true;
  imageMessage.textContent = "Loading image...";
  try {
    const data = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => reject(new Error("Read failed"));
      reader.readAsDataURL(file);
    });
    const check = new Image();
    check.src = data;
    await check.decode();
    if (version !== imageVersion) return;
    productImage = data;
    imagePreview.src = data;
    imagePreview.hidden = false;
    imageMessage.textContent = `${file.name} selected.`;
  } catch {
    if (version !== imageVersion) return;
    imageMessage.textContent = "This image could not be read. Choose another file.";
    imageInput.setCustomValidity(imageMessage.textContent);
  } finally {
    if (version === imageVersion) imageLoading = false;
  }
});

function updateProductCount() {
  document.querySelector('.metrics a[href="#products"] strong').textContent = cards.length;
  document.querySelector('.pill-row .pill').textContent = `Products: ${cards.length}`;
}

function appendProduct(product) {
  const card = document.createElement("article");
  card.className = "catalog-card";
  if (typeof product.image === "string" && /^data:image\/(jpeg|png|webp);base64,/.test(product.image)) {
    const image = document.createElement("img");
    image.src = product.image;
    image.alt = product.name;
    image.className = "product-image";
    image.loading = "lazy";
    card.append(image);
  }
  for (const [tag, text, className] of [
    ["span", product.category, "tag"],
    ["h3", product.name, ""],
    ["p", product.description, ""],
    ["p", `${product.unit} | ${product.prep} mins prep`, ""],
    ["strong", new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(product.price), ""],
    ["span", product.availability, `status ${product.availability === "available" ? "ready" : "pending"}`],
  ]) {
    const element = document.createElement(tag);
    element.textContent = text;
    element.className = className;
    card.append(element);
  }
  productSection.querySelector(".inventory").append(card);
  cards.push(card);
}

function validProduct(product) {
  return product && typeof product.name === "string" && product.name.trim().length > 0 && product.name.length <= 120 &&
    typeof product.unit === "string" && product.unit.trim().length > 0 && product.unit.length <= 60 &&
    typeof product.description === "string" && product.description.length <= 500 &&
    Number.isFinite(product.price) && product.price > 0 && product.price <= 999999 &&
    Number.isInteger(product.prep) && product.prep >= 0 && product.prep <= 10080 &&
    ["available", "unavailable"].includes(product.availability) &&
    categoryButtons.some(button => button.dataset.category === product.category);
}

try {
  const stored = JSON.parse(localStorage.getItem(productKey) || "[]");
  if (!Array.isArray(stored)) throw new Error("Invalid products");
  savedProducts = stored.filter(validProduct);
  savedProducts.forEach(appendProduct);
} catch {
  productMessage.textContent = "Saved products could not be loaded in this browser.";
}
updateProductCount();
document.getElementById("inventory-summary").textContent = `Showing all ${cards.length} preview products.`;

document.getElementById("open-product").addEventListener("click", () => {
  const select = productForm.elements.category;
  select.replaceChildren(...categoryButtons.map(button => new Option(button.dataset.category, button.dataset.category)));
  if (activeCategory) select.value = activeCategory;
  productForm.hidden = false;
  productMessage.textContent = "";
  productForm.elements.product_name.focus();
});
document.getElementById("cancel-product").addEventListener("click", () => {
  productForm.reset();
  productForm.hidden = true;
  document.getElementById("open-product").focus();
});
productForm.addEventListener("submit", event => {
  event.preventDefault();
  if (imageLoading) {
    imageMessage.textContent = "Please wait for the image to finish loading before saving.";
    return;
  }
  const fields = productForm.elements;
  const product = {
    name: fields.product_name.value.trim(), category: fields.category.value, image: productImage,
    description: fields.description.value.trim(), unit: fields.unit.value.trim(),
    price: Number(fields.price.value), prep: Number(fields.prep.value), availability: fields.availability.value,
  };
  if (!validProduct(product)) {
    productMessage.textContent = "Please enter a valid product name, category, unit, price and preparation time.";
    return;
  }
  if (cards.some(card => normalizeName(card.querySelector("h3").textContent) === normalizeName(product.name) && card.querySelector(".tag").textContent === product.category)) {
    productMessage.textContent = "This product name already exists in the selected category.";
    return;
  }
  try {
    localStorage.setItem(productKey, JSON.stringify([...savedProducts, product]));
  } catch {
    productMessage.textContent = "Unable to save. Browser storage may be full or blocked. Try a smaller image or allow browser storage.";
    return;
  }
  savedProducts.push(product);
  appendProduct(product);
  updateProductCount();
  productForm.reset();
  productForm.hidden = true;
  showProducts(product.category);
  productMessage.textContent = `${product.name} added to ${product.category}. Saved in this browser's preview.`;
});
