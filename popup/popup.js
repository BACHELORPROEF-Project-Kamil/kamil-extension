document.addEventListener("DOMContentLoaded", () => {
	const toggle = document.getElementById("protectionToggle");
	const rawOutput = document.getElementById("rawOutput");
	const urlDisplay = document.getElementById("urlDisplay");

	chrome.storage.local.get(["protectionEnabled", "lastResult", "lastCheckedUrl"], (result) => {
		toggle.checked = result.protectionEnabled || false;
		updateDisplay(result.lastResult, result.lastCheckedUrl);
	});

	toggle.addEventListener("change", () => {
		chrome.storage.local.set({ protectionEnabled: toggle.checked });
	});

	chrome.storage.onChanged.addListener((changes, namespace) => {
		if (namespace === "local") {
			chrome.storage.local.get(["lastResult", "lastCheckedUrl"], (result) => {
				updateDisplay(result.lastResult, result.lastCheckedUrl);
			});
		}
	});

	function updateDisplay(result, url) {
		if (url) {
			urlDisplay.textContent = `Checked: ${url}`;
		}
		if (result) {
			rawOutput.textContent = JSON.stringify(result, null, 2);
		} else {
			rawOutput.textContent = "No results yet.";
		}
	}
});
