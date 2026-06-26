const CHECK_INTERVAL_MS = 5 * 60 * 1000;
let wasOutOfStock = true;

function isOutOfStock() {
  const alert = document.querySelector(".alert.alert-danger");
  return !!(alert && alert.textContent.trim().toLowerCase().includes("sold out"));
}

function check() {
  const outNow = isOutOfStock();
  if (wasOutOfStock && !outNow) {
    chrome.runtime.sendMessage({ type: "IN_STOCK" });
  }
  wasOutOfStock = outNow;
  console.log("[AmulWatcher]", new Date().toLocaleTimeString(), "outOfStock=", outNow);
}

check();
setInterval(check, CHECK_INTERVAL_MS);
