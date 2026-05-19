console.log('Kamil Background Script Loaded');

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url?.startsWith('http')) {
    
    chrome.storage.local.get(['protectionEnabled'], (result) => {
      if (!result.protectionEnabled) {
        console.log('Protection DISABLED. Skipping check for:', tab.url);
        return;
      }

      console.log('🔍 Checking URL:', tab.url);
      
      fetch('http://localhost:5001/api/v1/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: tab.url, uid: 'arno-test-001' })
      })
      .then(res => res.json())
      .then(data => console.log('Result:', data))
      .catch(err => console.error('Error:', err.message));
    });
  }
});
