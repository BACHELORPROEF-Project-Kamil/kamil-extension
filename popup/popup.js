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
};

chrome.storage.local.get(["protectionEnabled", "lastResult"], (result) => {
	toggle.checked = !!result.protectionEnabled;

	if (result.protectionEnabled && result.lastResult) {
		updateUI(result.lastResult.status);
	} else if (!result.protectionEnabled) {
		statusTitle.innerText = "Bescherming uit.";
		statusDesc.innerText = "Zet Kamil aan voor beveiliging.";
	}
});

toggle.addEventListener("change", () => {
	const enabled = toggle.checked;
	chrome.storage.local.set({ protectionEnabled: enabled }, () => {
		if (!enabled) {
			statusTitle.innerText = "Bescherming uit.";
			statusDesc.innerText = "Zet Kamil aan voor beveiliging.";
			kamilImg.src = "../icons/kamilGreen.webp";
		} else {
			statusTitle.innerText = "Alles is veilig.";
			statusDesc.innerText = "Kamil houdt de wacht...";
		}
	});
});

function updateUI(status) {
  const config = STATUS_MAP[status] || STATUS_MAP.good;
  kamilImg.src = config.img;
  statusTitle.innerText = config.title;
  statusDesc.innerText = config.desc;
}

chrome.storage.onChanged.addListener((changes) => {
  if (changes.lastResult && toggle.checked) {
    updateUI(changes.lastResult.newValue.status);
  }
});

