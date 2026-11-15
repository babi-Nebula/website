const sellerForm = document.querySelector("#sellerForm");
const sellerFeedback = document.querySelector("#sellerFeedback");
const sellerApplications = document.querySelector("#sellerApplications");
const productImageInput = document.querySelector("#sellerProductImage");
const sellerImagePreview = document.querySelector("#sellerImagePreview");
const sellerImagePreviewImg = sellerImagePreview?.querySelector("img");
const sellerImagePreviewName = sellerImagePreview?.querySelector("span");
const sellerDescriptionInput = sellerForm?.querySelector('[name="description"]');
const sellerDescriptionCount = document.querySelector("#sellerDescriptionCount");
let productImageObjectUrl = "";
const escapeHtml = (value) => String(value ?? "").replace(/[&<>"']/g, (character) => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
})[character]);

function showFeedback(text, isError = false) {
  sellerFeedback.textContent = text;
  sellerFeedback.dataset.error = String(isError);
  sellerFeedback.hidden = false;
}

productImageInput?.addEventListener("change", () => {
  const file = productImageInput.files?.[0];
  if (productImageObjectUrl) URL.revokeObjectURL(productImageObjectUrl);
  productImageObjectUrl = "";
  if (!file) { sellerImagePreview.hidden = true; return; }
  if (!["image/jpeg", "image/png", "image/webp"].includes(file.type) || file.size > 5 * 1024 * 1024) {
    productImageInput.value = "";
    sellerImagePreview.hidden = true;
    showFeedback("Choose a JPG, PNG, or WebP image smaller than 5 MB.", true);
    return;
  }
  productImageObjectUrl = URL.createObjectURL(file);
  sellerImagePreviewImg.src = productImageObjectUrl;
  sellerImagePreviewName.textContent = file.name;
  sellerImagePreview.hidden = false;
});

sellerDescriptionInput?.addEventListener("input", () => {
  if (sellerDescriptionCount) sellerDescriptionCount.textContent = String(sellerDescriptionInput.value.length);
});

sellerForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!sellerForm.reportValidity()) return;
  const submitButton = sellerForm.querySelector('[type="submit"]');
  submitButton.disabled = true;
  submitButton.textContent = "Submitting…";
  try {
    const seller = await window.ENQUApi.request("/sellers", { method: "POST", body: new FormData(sellerForm) });
    sellerForm.reset();
    if (sellerDescriptionCount) sellerDescriptionCount.textContent = "0";
    sellerImagePreview.hidden = true;
    if (productImageObjectUrl) URL.revokeObjectURL(productImageObjectUrl);
    productImageObjectUrl = "";
    sellerApplications.innerHTML = `<article class="application-row"><div><strong>${escapeHtml(seller.businessName)}</strong><p>${escapeHtml(seller.location)}, ${escapeHtml(seller.country)} · ${escapeHtml(seller.email)}</p></div><span class="status-pill status-pending">Pending</span></article>`;
    showFeedback("Application received. The ENQU MADE team will review it and follow up by email.");
  } catch (error) {
    showFeedback(error.message || "We could not submit your application. Please try again.", true);
  } finally {
    submitButton.disabled = false;
    submitButton.innerHTML = 'Submit application <span aria-hidden="true">→</span>';
  }
});
