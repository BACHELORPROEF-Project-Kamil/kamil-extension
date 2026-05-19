console.log("Kamil Background Script Loaded");

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
	if (changeInfo.status === "complete" && tab.url?.startsWith("http")) {
		chrome.storage.local.get(["protectionEnabled"], (res) => {
			if (!res.protectionEnabled) {
				chrome.storage.local.remove(`result_${tabId}`);
				return;
			}

			console.log(`Checking Tab ${tabId}: ${tab.url}`);

			fetch("http://localhost:5001/api/v1/check", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ url: tab.url, uid: "arno-test-001" }),
			})
				.then((r) => r.json())
				.then((data) => {
					const status = data.status?.toLowerCase() || "good";
					const result = { status, timestamp: Date.now() };
					chrome.storage.local.set({ [`result_${tabId}`]: result });
					console.log(`Result Tab ${tabId}: ${status}`);
				})
				.catch((err) => {
					console.error(`Error Tab ${tabId}:`, err.message);
					chrome.storage.local.remove(`result_${tabId}`);
				});
		});
	}
});

chrome.tabs.onRemoved.addListener((tabId) => {
	chrome.storage.local.remove(`result_${tabId}`);
});
