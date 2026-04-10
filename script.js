const form = document.getElementById("shopForm");
const previewCard = document.getElementById("previewCard");

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const shopName = document.getElementById("shopName").value.trim();
  const shopType = document.getElementById("shopType").value.trim();
  const shopStory = document.getElementById("shopStory").value.trim();

  previewCard.classList.add("active");
  previewCard.innerHTML = `
    <p class="preview-label">Preview</p>
    <h3>Generating your shop identity...</h3>
    <p>The backend is building a digital summary for this business.</p>
  `;

  try {
    const response = await fetch("/api/shop-preview", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        shopName,
        shopType,
        shopStory
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Something went wrong.");
    }

    previewCard.innerHTML = `
      <p class="preview-label">Preview</p>
      <h3>${data.title}</h3>
      <p><strong>Category:</strong> ${data.category}</p>
      <p>${data.story}</p>
      <p>${data.highlights[0]}</p>
      <p>${data.highlights[1]}</p>
      <p>${data.highlights[2]}</p>
    `;
  } catch (error) {
    previewCard.innerHTML = `
      <p class="preview-label">Preview</p>
      <h3>Preview unavailable</h3>
      <p>${error.message}</p>
      <p>Make sure the backend server is running and try again.</p>
    `;
  }
});
