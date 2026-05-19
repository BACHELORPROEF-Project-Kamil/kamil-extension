const toggle = document.getElementById('protection-toggle');

chrome.storage.local.get(['protectionEnabled'], (result) => {
  toggle.checked = !!result.protectionEnabled;
  console.log('Kamil Protection:', toggle.checked ? 'ENABLED' : 'DISABLED');
});

toggle.addEventListener('change', () => {
  const enabled = toggle.checked;
  chrome.storage.local.set({ protectionEnabled: enabled }, () => {
    console.log('Kamil Protection toggled:', enabled ? 'ON' : 'OFF');
  });
});
