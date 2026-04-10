const state = {
  products: [],
  users: [],
  shops: [],
  orders: []
};

const loginForm = document.getElementById("loginForm");
const loginMessage = document.getElementById("loginMessage");
const orderForm = document.getElementById("orderForm");
const orderMessage = document.getElementById("orderMessage");
const productForm = document.getElementById("productForm");
const catalogGrid = document.getElementById("catalogGrid");
const productSelect = document.getElementById("productSelect");
const userTableBody = document.getElementById("userTableBody");
const shopTableBody = document.getElementById("shopTableBody");
const orderTableBody = document.getElementById("orderTableBody");
const userCount = document.getElementById("userCount");
const shopCount = document.getElementById("shopCount");
const orderCount = document.getElementById("orderCount");
const shopOrderStack = document.getElementById("shopOrderStack");
const themeToggle = document.getElementById("themeToggle");

async function request(url, options = {}) {
  const response = await fetch(url, options);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Request failed");
  }

  return data;
}

function renderCatalog() {
  catalogGrid.innerHTML = state.products
    .map(
      (product) => `
        <article class="product-tile">
          <h3>${product.name}</h3>
          <p>${product.description}</p>
          <div class="catalog-meta">
            <span>${product.category}</span>
            <span>Rs ${product.price}</span>
          </div>
        </article>
      `
    )
    .join("");

  productSelect.innerHTML = state.products
    .map((product) => `<option value="${product.id}">${product.name} - Rs ${product.price}</option>`)
    .join("");
}

function renderTables() {
  userTableBody.innerHTML = state.users
    .map(
      (user) => `
        <tr>
          <td>${user.name}</td>
          <td>${user.email}</td>
          <td>${user.role}</td>
          <td>${user.phone}</td>
        </tr>
      `
    )
    .join("");

  shopTableBody.innerHTML = state.shops
    .map(
      (shop) => `
        <tr>
          <td>${shop.name}</td>
          <td>${shop.type}</td>
          <td>${shop.email}</td>
          <td>${shop.owner}</td>
        </tr>
      `
    )
    .join("");

  orderTableBody.innerHTML = state.orders
    .map(
      (order) => `
        <tr>
          <td>${order.customerName}</td>
          <td>${order.productName}</td>
          <td>${order.quantity}</td>
          <td>${order.status}</td>
        </tr>
      `
    )
    .join("");

  userCount.textContent = `${state.users.length} records`;
  shopCount.textContent = `${state.shops.length} records`;
  orderCount.textContent = `${state.orders.length} orders`;

  shopOrderStack.innerHTML = `
    <h3>Recent shop orders</h3>
    ${state.orders
      .slice(0, 4)
      .map(
        (order) => `
          <div class="mini-order">
            <strong>${order.productName}</strong>
            <span>${order.customerName}</span>
          </div>
        `
      )
      .join("")}
  `;
}

async function loadDashboard() {
  const data = await request("/api/dashboard");
  state.products = data.products;
  state.users = data.users;
  state.shops = data.shops;
  state.orders = data.orders;
  renderCatalog();
  renderTables();
}

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const payload = {
    role: document.getElementById("role").value,
    email: document.getElementById("email").value.trim(),
    password: document.getElementById("password").value.trim()
  };

  try {
    const data = await request("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    loginMessage.textContent = `${data.message} Welcome ${data.account.name}.`;
  } catch (error) {
    loginMessage.textContent = error.message;
  }
});

orderForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  try {
    const order = await request("/api/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        customerName: document.getElementById("customerName").value.trim(),
        productId: productSelect.value,
        quantity: Number(document.getElementById("quantity").value)
      })
    });

    orderMessage.textContent = `Order placed for ${order.productName}.`;
    document.getElementById("customerName").value = "";
    document.getElementById("quantity").value = 1;
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
      headers: {
        "Content-Type": "application/json"
      },
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
