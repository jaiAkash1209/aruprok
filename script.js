const form = document.getElementById("shopForm");
const previewCard = document.getElementById("previewCard");

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const shopName = document.getElementById("shopName").value.trim();
  const shopType = document.getElementById("shopType").value.trim();
  const shopStory = document.getElementById("shopStory").value.trim();

  const summary = shopStory || "Known in the area for trusted service and a clear local identity.";

  previewCard.classList.add("active");
  previewCard.innerHTML = `
    <p class="preview-label">Preview</p>
    <h3>${shopName}</h3>
    <p><strong>Category:</strong> ${shopType}</p>
    <p>${summary}</p>
    <p>This shop page could include product highlights, WhatsApp ordering, customer reviews, location details, and special festival offers.</p>
  `;
});
