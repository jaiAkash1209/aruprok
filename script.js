const state = {
  products: [],
  users: [],
  shops: [],
  orders: [],
  verifications: []
};

const loginForm = document.getElementById("loginForm");
const userSignupForm = document.getElementById("userSignupForm");
const shopSignupForm = document.getElementById("shopSignupForm");
const productForm = document.getElementById("productForm");
const orderForm = document.getElementById("orderForm");
const themeToggle = document.getElementById("themeToggle");

const loginMessage = document.getElementById("loginMessage");
const userSignupMessage = document.getElementById("userSignupMessage");
const shopSignupMessage = document.getElementById("shopSignupMessage");
const orderMessage = document.getElementById("orderMessage");

const catalogGrid = document.getElementById("catalogGrid");
const productSelect = document.getElementById("productSelect");
const userTableBody = document.getElementById("userTableBody");
const shopTableBody = document.getElementById("shopTableBody");
const verificationTableBody = document.getElementById("verificationTableBody");
const orderTableBody = document.getElementById("orderTableBody");
const shopOrderStack = document.getElementById("shopOrderStack");

const heroUserCount = document.getElementById("heroUserCount");
const heroShopCount = document.getElementById("heroShopCount");
const heroOrderCount = document.getElementById("heroOrderCount");
const userCount = document.getElementById("userCount");
const shopCount = document.getElementById("shopCount");
const verificationCount = document.getElementById("verificationCount");
const orderCount = document.getElementById("orderCount");

async function request(url, options = {}) {
  const response = await fetch(url, options);
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || "Request failed");
  return data;
}

function renderCatalog() {
  catalogGrid.innerHTML = state.products.map((product) => `
    <article class="product-tile">
      <h3>${product.name}</h3>
      <p>${product.description}</p>
      <div class="catalog-meta">
        <span>${product.category}</span>
        <span>Rs ${product.price}</span>
      </div>
    </article>
  `).join("");

  productSelect.innerHTML = state.products.map((product) =>
    `<option value="${product.id}">${product.name} - Rs ${product.price}</option>`
  ).join("");
}

function renderTables() {
  userTableBody.innerHTML = state.users.map((user) => `
    <tr><td>${user.name}</td><td>${user.email}</td><td>${user.role}</td><td>${user.phone}</td></tr>
  `).join("");

  shopTableBody.innerHTML = state.shops.map((shop) => `
    <tr><td>${shop.name}</td><td>${shop.type}</td><td>${shop.email}</td><td>${shop.owner}</td></tr>
  `).join("");

  verificationTableBody.innerHTML = state.verifications.map((record) => `
    <tr><td>${record.shopName}</td><td>${record.shopPhotoName}</td><td>${record.aadharPhotoName}</td><td>${record.status}</td></tr>
  `).join("");

  orderTableBody.innerHTML = state.orders.map((order) => `
    <tr><td>${order.customerName}</td><td>${order.productName}</td><td>${order.quantity}</td><td>${order.status}</td></tr>
  `).join("");

  heroUserCount.textContent = state.users.length;
  heroShopCount.textContent = state.shops.length;
  heroOrderCount.textContent = state.orders.length;
  userCount.textContent = `${state.users.length} records`;
  shopCount.textContent = `${state.shops.length} records`;
  verificationCount.textContent = `${state.verifications.length} records`;
  orderCount.textContent = `${state.orders.length} orders`;

  shopOrderStack.innerHTML = `<h3>Recent shop orders</h3>${state.orders.slice(0, 4).map((order) => `
    <div class="mini-order"><strong>${order.productName}</strong><span>${order.customerName}</span></div>
  `).join("")}`;
}

async function loadDashboard() {
  const data = await request("/api/dashboard");
  state.products = data.products;
  state.users = data.users;
  state.shops = data.shops;
  state.orders = data.orders;
  state.verifications = data.verifications;
  renderCatalog();
  renderTables();
}

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  try {
    const data = await request("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        role: document.getElementById("role").value,
        email: document.getElementById("email").value.trim(),
        password: document.getElementById("password").value.trim()
      })
    });
    loginMessage.textContent = `${data.message} Welcome ${data.account.name}.`;
  } catch (error) {
    loginMessage.textContent = error.message;
  }
});

userSignupForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  try {
    const data = await request("/api/signup/user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: document.getElementById("signupUserName").value.trim(),
        email: document.getElementById("signupUserEmail").value.trim(),
        phone: document.getElementById("signupUserPhone").value.trim(),
        password: document.getElementById("signupUserPassword").value.trim()
      })
    });
    userSignupForm.reset();
    userSignupMessage.textContent = `${data.message} ${data.user.name} is now in admin records.`;
    await loadDashboard();
  } catch (error) {
    userSignupMessage.textContent = error.message;
  }
});

shopSignupForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const formData = new FormData();
  formData.append("name", document.getElementById("signupShopName").value.trim());
  formData.append("owner", document.getElementById("signupShopOwner").value.trim());
  formData.append("type", document.getElementById("signupShopType").value.trim());
  formData.append("email", document.getElementById("signupShopEmail").value.trim());
  formData.append("password", document.getElementById("signupShopPassword").value.trim());
  formData.append("shopPhoto", document.getElementById("shopPhoto").files[0]);
  formData.append("aadharPhoto", document.getElementById("aadharPhoto").files[0]);

  try {
    const data = await request("/api/signup/shop", { method: "POST", body: formData });
    shopSignupForm.reset();
    shopSignupMessage.textContent = `${data.message} Verification is marked as ${data.verification.status}.`;
    await loadDashboard();
  } catch (error) {
    shopSignupMessage.textContent = error.message;
  }
});

orderForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  try {
    const data = await request("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customerName: document.getElementById("customerName").value.trim(),
        productId: document.getElementById("productSelect").value,
        quantity: Number(document.getElementById("quantity").value)
      })
    });
    orderForm.reset();
    document.getElementById("quantity").value = 1;
    orderMessage.textContent = `Order placed for ${data.productName}.`;
    await loadDashboard();
  } catch (error) {
    orderMessage.textContent = error.message;
  }
});

productForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  try {
    await request("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: document.getElementById("productName").value.trim(),
        price: Number(document.getElementById("productPrice").value),
        category: document.getElementById("productCategory").value.trim()
      })
    });
    productForm.reset();
    await loadDashboard();
  } catch (error) {
    orderMessage.textContent = error.message;
  }
});

themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
});

loadDashboard().catch((error) => {
  loginMessage.textContent = error.message;
});
