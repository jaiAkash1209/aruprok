const express = require("express");
const path = require("path");

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(__dirname));

function buildProfile({ shopName, shopType, shopStory }) {
  const cleanName = (shopName || "").trim() || "Local Shop";
  const cleanType = (shopType || "").trim() || "Community business";
  const cleanStory =
    (shopStory || "").trim() ||
    "Known in the area for trusted service, familiar faces, and a strong local identity.";

  return {
    title: cleanName,
    category: cleanType,
    story: cleanStory,
    highlights: [
      `A ${cleanType.toLowerCase()} with a recognizable neighborhood identity`,
      "Ready for online discovery, local orders, and repeat customers",
      "Can showcase products, reviews, location details, and seasonal offers"
    ]
  };
}

app.post("/api/shop-preview", (req, res) => {
  const { shopName, shopType, shopStory } = req.body || {};

  if (!shopName || !shopType) {
    return res.status(400).json({
      error: "shopName and shopType are required."
    });
  }

  return res.json(buildProfile({ shopName, shopType, shopStory }));
});

app.get("*", (_req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(port, () => {
  console.log(`Original Street running on port ${port}`);
});
