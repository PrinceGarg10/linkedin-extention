let allActiveConnectionTabIds = []
let completedConnection = 0
let totalButton = 0
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.type === 'sendRequest') {
    chrome.tabs.query({ active: true }, function (tabs) {
      allActiveConnectionTabIds.push(tabs[0].id)
      chrome.tabs.sendMessage(tabs[0].id, { action: "connection" }, function (response) {
      });
    });

    chrome.tabs.query({ active: true }, function (tabs) {
      console.log({ btabs: tabs, allActiveConnectionTabIds });
      const findActiveTab = allActiveConnectionTabIds.find((tabId) => Number(tabId) === Number(tabs[0].id))
      chrome.runtime.sendMessage({ type: "currentTab", currentTabId: findActiveTab ? true : false })
    })
  }
  else if (request.type === 'buttonCount') {
    totalButton = request.countButton
    // if (request.completedTask) {
    //   completedConnection += 1
    // }
    // chrome.runtime.sendMessage({ type: "totalCountButton", totalButton: totalButton, completedConnection: completedConnection })
  }
  else if (request.type === 'completedButtonTask') {
    completedConnection += 1
    chrome.runtime.sendMessage({ type: "totalCountButton", totalButton: totalButton, completedConnection: completedConnection })
  }
  else if (request.type == "success") {
    allActiveConnectionTabIds = []
    completedConnection = 0
    chrome.runtime.sendMessage({ type: "totalCountButton", totalButton: totalButton, completedConnection: completedConnection })
  }
  else {
    chrome.tabs.query({ active: true }, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id, { action: "connection-cancel" }, function (response) {
      });
    });

    chrome.tabs.query({ active: true }, function (tabs) {
      allActiveConnectionTabIds = allActiveConnectionTabIds.filter((tabId) => tabId !== tabs[0].id)
      chrome.runtime.sendMessage({ type: "currentTab", currentTabId: false })
    })
  }
})