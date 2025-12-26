function checkBlockStatus() {
  chrome.storage.local.get(
    ["blockedSites", "blockedKeywords", "globalUnlockExpiry"],
    (data) => {
      const currentUrl = window.location.href;
      const isBlocked =
        (data.blockedSites || []).some((s) => currentUrl.includes(s)) ||
        (data.blockedKeywords || []).some((k) => currentUrl.includes(k));

      const isUnlocked =
        data.globalUnlockExpiry && Date.now() < data.globalUnlockExpiry;

      if (isBlocked && !isUnlocked) {
        showOverlay();
      } else {
        removeOverlay();
      }
    }
  );
}

function showOverlay() {
  if (document.getElementById("focus-blocker-overlay")) return;

  const overlay = document.createElement("div");
  overlay.id = "focus-blocker-overlay";
  overlay.innerHTML = `
    <div class="blocker-content">
      <div class="status-badge">NEURAL SYSTEM FAILURE</div>
      
      <!-- Heading with icons on the same line -->
      <h1 class="witty-title">
        <span class="warn-icon">⚠️</span> 
        BRAIN ROT <span class="blink-text">DETECTED</span> 
        <span class="warn-icon">⚠️</span>
      </h1>
      
      <!-- Single row of alternatives -->
      <div class="alternatives-row">
        <div class="alt-item">
          <span class="icon">🚶‍♂️</span>
          <span class="label highlight-green">Touch Grass</span>
        </div>
        <div class="alt-item">
          <span class="icon">🎸</span>
          <span class="label highlight-blue">Actually Shred</span>
        </div>
        <div class="alt-item">
          <span class="icon">🎨</span>
          <span class="label highlight-orange">Analog Input</span>
        </div>
        <div class="alt-item">
          <span class="icon">📚</span>
          <span class="label highlight-gold">Repair Neurons</span>
        </div>
        <div class="alt-item">
          <span class="icon">🪟</span>
          <span class="label highlight-pink">Stare at wall</span>
        </div>
      </div>

      <div class="witty-insult">"Your dopamine receptors are screaming for help."</div>

      <button id="unlock-btn">Feed the Rot (5 Mins)</button>
    </div>
  `;
  document.documentElement.appendChild(overlay);

  document.getElementById("unlock-btn").onclick = () => {
    const expiry = Date.now() + 5 * 60 * 1000;
    chrome.storage.local.set({ globalUnlockExpiry: expiry });
  };
}

function removeOverlay() {
  document.getElementById("focus-blocker-overlay")?.remove();
}

chrome.storage.onChanged.addListener(() => {
  checkBlockStatus();
});

// Run immediately on page load
checkBlockStatus();
