// 1. Define the function at the very top so it's available everywhere
async function updateBadge() {
  chrome.storage.local.get("globalUnlockExpiry", (data) => {
    const expiry = data.globalUnlockExpiry;
    const now = Date.now();

    if (expiry && expiry > now) {
      const remainingTotalSeconds = Math.floor((expiry - now) / 1000);
      const mins = Math.floor(remainingTotalSeconds / 60);
      const secs = remainingTotalSeconds % 60;

      // Format as M:SS
      const timeString = `${mins}:${secs.toString().padStart(2, "0")}`;

      chrome.action.setBadgeText({ text: timeString });
      chrome.action.setBadgeBackgroundColor({ color: "#ff003c" }); // Hazard Red
    } else {
      // If time is up, clear the badge and ensure the expiry is removed
      chrome.action.setBadgeText({ text: "" });
      if (expiry) {
        chrome.storage.local.remove("globalUnlockExpiry");
      }
    }
  });
}

// 2. Set up the interval to update the badge every second
setInterval(updateBadge, 1000);

// 3. Listen for storage changes to trigger an update immediately
chrome.storage.onChanged.addListener((changes) => {
  if (changes.globalUnlockExpiry) {
    updateBadge();
  }
});

// 4. Run once when the background script starts
updateBadge();
