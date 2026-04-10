const express = require("express");
const path = require("path");

const app = express();
const port = process.env.PORT || 3000;

const users = [
  { id: "u1", name: "Aarav Kumar", email: "aarav@market.com", password: "123456", role: "user", phone: "9876501200" },
  { id: "u2", name: "Meera Das", email: "meera@market.com", password: "123456", role: "user", phone: "9876507788" },
  { id: "a1", name: "Platform Admin", email: "admin@avenix.com", password: "admin123", role: "admin", phone: "9000000001" }
];

const shops = [
  { id: "s1", name: "FixFast Mechanic Hub", type: "Mechanic", email: "fixfast@shops.com", password: "shop123", owner: "Rohan Singh" },
  { id: "s2", name: "Rina Spice Corner", type: "Grocery", email: "rina@shops.com", password: "shop123", owner: "Rina Paul" }
];

const products = [
  { id: "p1", name: "Brake Wire", price: 450, category: "Mechanic parts", description: "Fast-moving spare part sold by local mechanic shops." },
  { id: "p2", name: "Engine Oil Pack", price: 780, category: "Vehicle service", description: "Trusted oil pack for nearby service customers." },
  { id: "p3", name: "Spice Box", price: 320, category: "Home grocery", description: "Signature local spice bundle from the neighborhood shop." }
];

const orders = [
  { id: "o1", customerName: "Aarav Kumar", productId: "p1", productName: "Brake Wire", quantity: 2, status: "Pending" },
  { id: "o2", customerName: "Meera Das", productId: "p3", productName: "Spice Box", quantity: 1, status: "Ready" }
];

app.use(express.json());
app.use(express.static(__dirname));

app.get("/api/dashboard", (_req, res) => {
  res.json({
    users: users.map(({ password, ...user }) => user),
    shops: shops.map(({ password, ...shop }) => shop),
    products,
    orders
  });
});

app.post("/api/login", (req, res) => {
  const { role, email, password } = req.body || {};

  if (!role || !email || !password) {
    return res.status(400).json({ error: "Role, email, and password are required." });
  }

  const pool = role === "shop" ? shops : users.filter((item) => item.role === role);
  const account = pool.find((item) => item.email === email && item.password === password);

  if (!account) {
    return res.status(401).json({ error: "Invalid login credentials." });
  }

  return res.json({
    message: `${role.charAt(0).toUpperCase() + role.slice(1)} login successful.`,
    account: {
      name: account.name || account.owner,
      email: account.email,
      role
    }
  });
});

app.post("/api/orders", (req, res) => {
  const { customerName, productId, quantity } = req.body || {};
  const product = products.find((item) => item.id === productId);

  if (!customerName || !product || !quantity || quantity < 1) {
    return res.status(400).json({ error: "Valid shopper, product, and quantity are required." });
  }

  const order = {
    id: `o${orders.length + 1}`,
    customerName,
    productId,
    productName: product.name,
    quantity,
    status: "Pending"
  };

  orders.unshift(order);
  return res.status(201).json(order);
});

app.post("/api/products", (req, res) => {
  const { name, price, category } = req.body || {};

  if (!name || !price || !category) {
    return res.status(400).json({ error: "Product name, price, and category are required." });
  }

  const product = {
    id: `p${products.length + 1}`,
    name,
    price,
    category,
    description: `${name} is now available in the local shop network.`
  };

  products.unshift(product);
  return res.status(201).json(product);
});

app.get("*", (_req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(port, () => {
  console.log(`Avenix running on port ${port}`);
});
