const toggle = document.getElementById("protection-toggle");
const kamilImg = document.getElementById("kamil-img");
const statusTitle = document.getElementById("status-title");
const statusDesc = document.getElementById("status-desc");

const STATUS_MAP = {
	good: {
		img: "../icons/kamilGreen.webp",
		title: "Alles is veilig.",
		desc: "Kamil houdt de wacht... u kunt veilig surfen",
	},
	warning: {
		img: "../icons/kamilYellow.webp",
		title: "Wees voorzichtig.",
		desc: "Deze website is splinternieuw, wees voorzichtig met wat je deelt. Dit kan een teken van phishing zijn.",
	},
	critical: {
		img: "../icons/kamilRed.webp",
		title: "Stop!",
		desc: "Deze website doet zich hoogstwaarschijnlijk voor als iemand anders. Het is ten zeerste aangeraden om de website te verlaten.",
	},
	disabled: {
		img: "../icons/kamilGreen.webp",
		title: "Bescherming uit.",
		desc: "Zet Kamil aan voor beveiliging.",
	},
};

function updateUI(status, enabled) {
	const statusToShow = !enabled ? "disabled" : status || "good";
	const config = STATUS_MAP[statusToShow] || STATUS_MAP.good;

	kamilImg.src = config.img;
	statusTitle.innerText = config.title;
	statusDesc.innerText = config.desc;
}

function refreshUI() {
	chrome.tabs.query({ active: true, lastFocusedWindow: true }, ([tab]) => {
		if (!tab) return;

		const resultKey = `result_${tab.id}`;
		chrome.storage.local.get(["protectionEnabled", resultKey], (res) => {
			const enabled = !!res.protectionEnabled;
			toggle.checked = enabled;
			updateUI(res[resultKey]?.status, enabled);
		});
	});
}

refreshUI();

toggle.addEventListener("change", () => {
	chrome.storage.local.set({ protectionEnabled: toggle.checked });
});

chrome.storage.onChanged.addListener((changes) => {
	console.log("Storage changed:", Object.keys(changes));
	refreshUI();
});

chrome.tabs.onActivated.addListener(refreshUI);
