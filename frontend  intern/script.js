const foods = [
  { id: 1, name: "Masala Dosa", category: "Starters", price: 120, rating: "4.9", image: "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=900&q=80", desc: "Crisp rice crepe filled with spiced potato masala." },
  { id: 2, name: "Idli Sambar", category: "Starters", price: 90, rating: "4.8", image: "https://images.unsplash.com/photo-1630383249896-424e482df921?auto=format&fit=crop&w=900&q=80", desc: "Soft steamed idlis served with hot sambar and chutney." },
  { id: 3, name: "Hyderabadi Biryani", category: "Main Course", price: 260, rating: "4.9", image: "https://images.unsplash.com/photo-1563379091339-03246963d96c?auto=format&fit=crop&w=900&q=80", desc: "Aromatic basmati rice cooked with spices and herbs." },
  { id: 4, name: "Paneer Butter Masala", category: "Main Course", price: 230, rating: "4.7", image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=900&q=80", desc: "Paneer cubes simmered in creamy tomato gravy." },
  { id: 5, name: "Garlic Naan", category: "Breads", price: 70, rating: "4.6", image: "https://images.unsplash.com/photo-1574894709920-11b28e7367e3?auto=format&fit=crop&w=900&q=80", desc: "Soft tandoor bread topped with garlic butter." },
  { id: 6, name: "Kerala Parotta", category: "Breads", price: 60, rating: "4.8", image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=900&q=80", desc: "Layered flaky bread served warm." },
  { id: 7, name: "Gulab Jamun", category: "Desserts", price: 85, rating: "4.9", image: "https://images.unsplash.com/photo-1601303516381-77920eeb99d2?auto=format&fit=crop&w=900&q=80", desc: "Soft milk dumplings in saffron sugar syrup." },
  { id: 8, name: "Mango Lassi", category: "Drinks", price: 110, rating: "4.8", image: "https://images.unsplash.com/photo-1627308595229-7830a5c91f9f?auto=format&fit=crop&w=900&q=80", desc: "Chilled yogurt drink blended with ripe mango." }
];

const rupee = value => `Rs. ${value}`;
const getCart = () => JSON.parse(localStorage.getItem("spiceCart") || "[]");

function saveCart(cart) {
  localStorage.setItem("spiceCart", JSON.stringify(cart));
  updateCartCount();
}

function addToCart(id, qty = 1) {
  const food = foods.find(item => item.id === Number(id)) || foods[0];
  const cart = getCart();
  const existing = cart.find(item => item.id === food.id);
  if (existing) existing.qty += qty;
  else cart.push({ ...food, qty });
  saveCart(cart);
  alert(`${food.name} added to cart`);
}

function updateCartCount() {
  const count = getCart().reduce((sum, item) => sum + item.qty, 0);
  document.querySelectorAll("[data-cart-count]").forEach(el => el.textContent = count);
}

function foodCard(food) {
  return `
    <article class="card food-card" data-category="${food.category}" data-name="${food.name.toLowerCase()}">
      <img class="food-img" src="${food.image}" alt="${food.name}">
      <div class="card-body">
        <div class="price-row"><h3>${food.name}</h3><span class="rating">${food.rating}/5</span></div>
        <p class="muted">${food.desc}</p>
        <div class="price-row">
          <span class="price">${rupee(food.price)}</span>
          <button class="btn-primary" onclick="addToCart(${food.id})">Add to Cart</button>
        </div>
      </div>
    </article>`;
}

function renderFoodGrid(targetId, list = foods) {
  const target = document.getElementById(targetId);
  if (target) target.innerHTML = list.map(foodCard).join("");
}

function setupMenu() {
  if (!document.getElementById("menuGrid")) return;
  renderFoodGrid("menuGrid");
  const search = document.getElementById("menuSearch");
  const filter = document.getElementById("menuFilter");
  const tabs = document.querySelectorAll(".tab");

  function applyFilters(category = document.querySelector(".tab.active")?.dataset.category || "All") {
    const text = (search.value || "").toLowerCase();
    const chosen = filter.value || category;
    const result = foods.filter(food => {
      const categoryOk = chosen === "All" || food.category === chosen;
      const searchOk = food.name.toLowerCase().includes(text) || food.desc.toLowerCase().includes(text);
      return categoryOk && searchOk;
    });
    renderFoodGrid("menuGrid", result);
  }

  tabs.forEach(tab => tab.addEventListener("click", () => {
    tabs.forEach(item => item.classList.remove("active"));
    tab.classList.add("active");
    filter.value = tab.dataset.category;
    applyFilters(tab.dataset.category);
  }));
  search.addEventListener("input", () => applyFilters());
  filter.addEventListener("change", () => applyFilters(filter.value));
}

function setupDetails() {
  if (!document.getElementById("detailName")) return;
  const food = foods[0];
  document.getElementById("detailImage").src = food.image;
  document.getElementById("detailName").textContent = food.name;
  document.getElementById("detailDesc").textContent = `${food.desc} Served with coconut chutney, tomato chutney, and sambar.`;
  document.getElementById("detailPrice").textContent = rupee(food.price);
  let qty = 1;
  const qtyEl = document.getElementById("detailQty");
  document.getElementById("minusQty").addEventListener("click", () => {
    qty = Math.max(1, qty - 1);
    qtyEl.textContent = qty;
  });
  document.getElementById("plusQty").addEventListener("click", () => {
    qty += 1;
    qtyEl.textContent = qty;
  });
  document.getElementById("detailAdd").addEventListener("click", () => addToCart(food.id, qty));
}

function renderCart() {
  const list = document.getElementById("cartList");
  if (!list) return;
  const cart = getCart();
  if (!cart.length) {
    list.innerHTML = `<div class="summary-box"><h3>Your cart is empty</h3><p class="muted">Add some South Indian favorites from the menu.</p><a class="btn btn-primary" href="menu.html">View Menu</a></div>`;
  } else {
    list.innerHTML = cart.map(item => `
      <article class="card cart-item">
        <img src="${item.image}" alt="${item.name}">
        <div>
          <h3>${item.name}</h3>
          <p class="muted">${rupee(item.price)} each</p>
          <div class="qty"><button onclick="changeQty(${item.id}, -1)">-</button><strong>${item.qty}</strong><button onclick="changeQty(${item.id}, 1)">+</button></div>
          <button class="btn btn-outline" onclick="removeItem(${item.id})">Remove</button>
        </div>
        <strong class="price">${rupee(item.price * item.qty)}</strong>
      </article>`).join("");
  }
  updateTotals();
}

function changeQty(id, delta) {
  const cart = getCart().map(item => item.id === id ? { ...item, qty: Math.max(1, item.qty + delta) } : item);
  saveCart(cart);
  renderCart();
}

function removeItem(id) {
  saveCart(getCart().filter(item => item.id !== id));
  renderCart();
}

function updateTotals() {
  const subtotal = getCart().reduce((sum, item) => sum + item.price * item.qty, 0);
  const delivery = subtotal ? 40 : 0;
  const total = subtotal + delivery;
  document.querySelectorAll("[data-subtotal]").forEach(el => el.textContent = rupee(subtotal));
  document.querySelectorAll("[data-delivery]").forEach(el => el.textContent = rupee(delivery));
  document.querySelectorAll("[data-total]").forEach(el => el.textContent = rupee(total));
}

function renderCheckoutSummary() {
  const target = document.getElementById("checkoutItems");
  if (!target) return;
  const cart = getCart();
  target.innerHTML = cart.length
    ? cart.map(item => `<div class="summary-row"><span>${item.name} x ${item.qty}</span><strong>${rupee(item.price * item.qty)}</strong></div>`).join("")
    : `<p class="muted">No items selected yet.</p>`;
  updateTotals();
}

function setupForms() {
  document.querySelectorAll("form[data-demo-form]").forEach(form => {
    form.addEventListener("submit", event => {
      event.preventDefault();
      alert(form.dataset.message || "Submitted successfully");
      if (form.id === "checkoutForm") {
        localStorage.removeItem("spiceCart");
        updateCartCount();
        location.href = "index.html";
      }
    });
  });
  document.querySelectorAll("[data-admin-action]").forEach(button => {
    button.addEventListener("click", () => alert(`${button.dataset.adminAction} food item demo action`));
  });
}

document.addEventListener("DOMContentLoaded", () => {
  updateCartCount();
  renderFoodGrid("featuredGrid", foods.slice(0, 3));
  renderFoodGrid("popularGrid", foods.slice(2, 6));
  setupMenu();
  setupDetails();
  renderCart();
  renderCheckoutSummary();
  setupForms();
});

function setupSiteDashboard() {
  const grid = document.getElementById("pageGrid");
  if (!grid) return;
  const pages = [
    { title: "Home Page", type: "Main", icon: "HM", href: "index.html", desc: "Hero banner, featured dishes, offers, reviews, and footer." },
    { title: "Menu Page", type: "Food", icon: "MN", href: "menu.html", desc: "Category tabs, search, food cards, prices, ratings, and cart buttons." },
    { title: "Food Details", type: "Food", icon: "FD", href: "food-details.html", desc: "Large dish image, ingredients, quantity selector, reviews, and add to cart." },
    { title: "Cart Page", type: "Order", icon: "CT", href: "cart.html", desc: "Selected items, quantity controls, remove buttons, and bill total." },
    { title: "Checkout Page", type: "Order", icon: "CO", href: "checkout.html", desc: "Delivery address, payment method, summary, and place order action." },
    { title: "Login Page", type: "Account", icon: "LI", href: "login.html", desc: "Email, password, forgot password, and Google login button." },
    { title: "Signup Page", type: "Account", icon: "SU", href: "signup.html", desc: "Name, email, phone number, password, and confirm password form." },
    { title: "Admin Panel", type: "Admin", icon: "AD", href: "admin.html", desc: "Stats, recent orders table, and food item action buttons." },
    { title: "Contact Us", type: "Info", icon: "CU", href: "contact.html", desc: "Contact form, map placeholder, address, and social media links." },
    { title: "About Page", type: "Info", icon: "AB", href: "about.html", desc: "Restaurant story, chef cards, mission, and vision." }
  ];
  const search = document.getElementById("pageSearch");
  const filters = document.querySelectorAll(".dash-filter");
  const resultCount = document.getElementById("resultCount");
  const cartDashCount = document.getElementById("dashCartCount");
  const timeBox = document.getElementById("dashTime");
  let activeType = "All";
  function renderPages() {
    const text = (search.value || "").toLowerCase();
    const filtered = pages.filter(page => (activeType === "All" || page.type === activeType) && `${page.title} ${page.type} ${page.desc}`.toLowerCase().includes(text));
    grid.innerHTML = filtered.map(page => `<article class="card page-card"><span class="page-icon">${page.icon}</span><span class="page-tag">${page.type}</span><h3>${page.title}</h3><p class="muted">${page.desc}</p><div class="dash-actions"><a class="btn btn-primary" href="${page.href}">Open</a><a class="btn btn-outline" href="${page.href}" target="_blank">New Tab</a></div></article>`).join("");
    resultCount.textContent = `${filtered.length} pages`;
  }
  function tick() {
    const now = new Date();
    timeBox.textContent = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    cartDashCount.textContent = getCart().reduce((sum, item) => sum + item.qty, 0);
  }
  filters.forEach(button => button.addEventListener("click", () => {
    filters.forEach(item => item.classList.remove("active"));
    button.classList.add("active");
    activeType = button.dataset.type;
    renderPages();
  }));
  search.addEventListener("input", renderPages);
  document.getElementById("themeToggle").addEventListener("click", () => document.body.classList.toggle("dark-mode"));
  renderPages();
  tick();
  setInterval(tick, 1000);
}

document.addEventListener("DOMContentLoaded", setupSiteDashboard);
