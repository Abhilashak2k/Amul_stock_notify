# Amul Whey Stock Watcher

Tiny Chrome extension that watches the [Amul Whey Protein product page](https://shop.amul.com/en/product/amul-whey-protein-32-g-or-pack-of-60-sachets) and fires a Chrome notification the moment the "Sold Out" alert disappears.

Polls every 5 minutes. Requires the product tab to stay open.

## Files

- `manifest.json` — extension manifest (v3)
- `content.js` — runs on the product page, checks for the "Sold Out" alert
- `background.js` — service worker that creates the notification
- `icon.png` — placeholder icon (replace with any 128x128 PNG if you like)

## Setup

### 1. Get the code

```bash
git clone https://github.com/Abhilashak2k/Amul_stock_notify.git
cd Amul_stock_notify
```

Or download the ZIP from GitHub and extract it anywhere on disk.

### 2. Load the extension in Chrome

1. Open `chrome://extensions` in Chrome.
2. Toggle **Developer mode** (top-right).
3. Click **Load unpacked**.
4. Select the `Amul_stock_notify` folder.
5. The extension should appear in the list with name **Amul Whey Stock Watcher**.

### 3. Allow Chrome notifications at the OS level

**macOS**: System Settings → Notifications → Google Chrome → Allow Notifications.

**Windows**: Settings → System → Notifications → Google Chrome → On.

**Linux**: depends on desktop environment; ensure Chrome is allowed to send desktop notifications.

### 4. Open the product page and pin the tab

Open: https://shop.amul.com/en/product/amul-whey-protein-32-g-or-pack-of-60-sachets

Right-click the tab → **Pin tab** so you don't accidentally close it.

## Verify it's working

1. On the product page, right-click → **Inspect** → **Console** tab.
2. Every 5 minutes you should see a log line like:
   ```
   [AmulWatcher] 14:23:05 outOfStock= true
   ```

## Force-test the notification

Paste this into the page console and hit Enter:

```javascript
chrome.runtime.sendMessage({ type: "IN_STOCK" });
```

A Chrome notification should pop up titled **"Amul Whey in stock!"**. If it doesn't, recheck step 3 (OS-level notification permission for Chrome).

## How it detects stock

The product page renders this element when out of stock:

```html
<div class="alert alert-danger mt-3">Sold Out</div>
```

When the product is back in stock, that element is gone. `content.js` polls for it every 5 minutes; if the previous check was "out" and the current check is "in", it messages the background service worker, which fires `chrome.notifications.create(...)`.

## Tuning

- **Poll interval**: edit `CHECK_INTERVAL_MS` in `content.js`. Default is 5 minutes. Faster polling = more requests = risk of rate-limiting.
- **Icon**: replace `icon.png` with any 128x128 PNG (same filename), then reload the extension at `chrome://extensions`.
- **Watch a different product**: change the `matches` URL in `manifest.json` to that product's page. The `.alert.alert-danger` selector should work for any shop.amul.com product.

## Caveats

- Tab close = watcher dead. Keep the product tab open and pinned.
- Chrome service workers can sleep; the content script polling is what drives the check, so this is fine.
- No retry on transient DOM hiccups — false negatives just mean you wait one more cycle.

## Uninstall

`chrome://extensions` → find **Amul Whey Stock Watcher** → **Remove**.
