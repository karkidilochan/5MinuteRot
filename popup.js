const saveBtn = document.getElementById("saveBtn");
const sitesInput = document.getElementById("sitesList");
const keywordsInput = document.getElementById("keywordsList");

// Load existing settings
chrome.storage.local.get(["blockedSites", "blockedKeywords"], (data) => {
  if (data.blockedSites) sitesInput.value = data.blockedSites.join("\n");
  if (data.blockedKeywords)
    keywordsInput.value = data.blockedKeywords.join("\n");
});

// Save settings
saveBtn.addEventListener("click", () => {
  const sites = sitesInput.value.split("\n").filter((i) => i.trim() !== "");
  const keywords = keywordsInput.value
    .split("\n")
    .filter((i) => i.trim() !== "");

  chrome.storage.local.set(
    {
      blockedSites: sites,
      blockedKeywords: keywords,
    },
    () => {
      alert("Settings saved!");
    }
  );
});
