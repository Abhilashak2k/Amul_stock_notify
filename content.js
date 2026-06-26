const CHECK_INTERVAL_MS = 5 * 60 * 1000;
const HYDRATION_WAIT_MS = 3000;

function isOutOfStock() {
  const alert = document.querySelector(".alert.alert-danger");
  const soldOutAlert = !!(alert && alert.textContent.trim().toLowerCase().includes("sold out"));
  const notifyMeBtn = !!document.querySelector(".product_enquiry");
  return soldOutAlert || notifyMeBtn;
}

async function check() {
  await new Promise(r => setTimeout(r, HYDRATION_WAIT_MS));

  const outNow = isOutOfStock();
  const { lastOutOfStock = true } = await chrome.storage.local.get("lastOutOfStock");

  if (lastOutOfStock && !outNow) {
    chrome.runtime.sendMessage({ type: "IN_STOCK" });
  }
  await chrome.storage.local.set({ lastOutOfStock: outNow });
  console.log("[AmulWatcher]", new Date().toLocaleTimeString(), "outOfStock=", outNow);

  setTimeout(() => location.reload(), CHECK_INTERVAL_MS);
}

check();
