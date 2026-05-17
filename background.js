chrome.runtime.onInstalled.addListener(() => {
	chrome.storage.local.set({ protectionEnabled: false, lastResult: null });
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
	if (changeInfo.status === "complete" && tab.url && tab.url.startsWith("http")) {
		chrome.storage.local.get(["protectionEnabled"], (result) => {
			if (result.protectionEnabled) {
				checkUrl(tab.url);
			}
		});
	}
});

async function checkUrl(url) {
	try {
		const response = await fetch("http://localhost:5001/api/v1/check", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ url: url }),
		});
		const data = await response.json();
		chrome.storage.local.set({ lastResult: data, lastCheckedUrl: url });
	} catch (error) {
		console.error("Error checking URL:", error);
		chrome.storage.local.set({ lastResult: { error: error.message }, lastCheckedUrl: url });
	}
}
