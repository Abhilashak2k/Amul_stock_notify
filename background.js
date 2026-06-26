chrome.runtime.onMessage.addListener((msg) => {
  if (msg.type === "IN_STOCK") {
    chrome.notifications.create({
      type: "basic",
      iconUrl: "icon.png",
      title: "Amul Whey in stock!",
      message: "Go buy now: shop.amul.com",
      priority: 2
    });
  }
});
