document.querySelector('#connect').addEventListener('click', (e) => {
  chrome.runtime.sendMessage({ type: 'sendRequest' })
})

document.querySelector('#cancel').addEventListener('click', (e) => {
  chrome.runtime.sendMessage({ type: 'cancelRequest' })
})

document.querySelector('#success').addEventListener('click', (e) => {
  document.querySelector(".okBtn").classList.add("show")
  document.querySelector(".okBtn").classList.remove("hide")
  document.querySelector(".cancelBtn").classList.add("hide")
  document.querySelector(".cancelBtn").classList.remove("show")
  document.querySelector(".successBtn").classList.add("hide")
  document.querySelector(".successBtn").classList.remove("show")
  document.querySelector(".sentRequestCount").innerHTML = 0
  document.querySelector(".wheel").style.background = "radial-gradient(black 55%, transparent 56%), conic-gradient(white 0% 100%)";

})

const checkStatus = (activeTab) => {
  if (activeTab) {
    document.querySelector(".okBtn").classList.add("hide")
    document.querySelector(".okBtn").classList.remove("show")
    document.querySelector(".cancelBtn").classList.add("show")
    document.querySelector(".cancelBtn").classList.remove("hide")
  } else {
    document.querySelector(".okBtn").classList.add("show")
    document.querySelector(".okBtn").classList.remove("hide")
    document.querySelector(".cancelBtn").classList.add("hide")
    document.querySelector(".cancelBtn").classList.remove("show")
  }
}
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.type === 'currentTab') {
    const currentTabId = request.currentTabId;
    checkStatus(currentTabId)
  }
  if (request.type === 'totalCountButton') {
    const totalButton = request.totalButton
    const totalSendRequest = request.completedConnection
    if (totalSendRequest > 0) {
      const percentForCss = Number(totalSendRequest / totalButton) * 100
      document.querySelector(".wheel").style.background = `radial-gradient(black 55%, transparent 56%), conic-gradient(green 0% ${percentForCss}%)`;
      document.querySelector(".sentRequestCount").innerHTML = totalSendRequest
    }
    if (totalButton === totalSendRequest) {
      document.querySelector(".okBtn").classList.add("hide")
      document.querySelector(".okBtn").classList.remove("show")
      document.querySelector(".cancelBtn").classList.add("hide")
      document.querySelector(".cancelBtn").classList.remove("show")
      document.querySelector(".successBtn").classList.add("show")

      document.querySelector('#success').addEventListener('click', (e) => {
        chrome.runtime.sendMessage({ type: 'success' })
      })
    }
  }
})