let TimeoutIds = [];
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === 'connection') {
    // DEFINE TIMEOUT FOR OPEN MODEL AND CLOSE MODEL
    const waitTimeForConnectOpen = 1000;
    const applyTimeForConnectOpen = 1000;
    let currentApplyCount = 1;

    // SEND BUTTON COUNT TO BACKGROUND JS 
    chrome.runtime.sendMessage({ type: "buttonCount", countButton: getToTalConnectButon(), completedTask: false })
    // GET ALL BUTTON 
    const allButton = document.querySelectorAll(".artdeco-button.artdeco-button--2.artdeco-button--secondary.ember-view");

    allButton.forEach((button) => {
      button.childNodes.forEach((child) => {
        // MATCH BUTTON ITS CONNECT OR NOT
        if (child['innerText'] === 'Connect') {
          let currentEventId = window.setTimeout(() => {
            button.click();

            window.setTimeout(() => {
              TimeoutIds = TimeoutIds.filter(i => i !== currentEventId)
              document.querySelector(".artdeco-button.artdeco-button--2.artdeco-button--primary.ember-view.ml1").click()
            }, applyTimeForConnectOpen / 2);

            //SENT COMPLETED TASK
            chrome.runtime.sendMessage({ type: "buttonCount", countButton: getToTalConnectButon(), completedTask: true })

          }, (waitTimeForConnectOpen + applyTimeForConnectOpen) * currentApplyCount);
          TimeoutIds.push(currentEventId);
          currentApplyCount++;
        }
      })
    });
  } else if (request.action === 'connection-cancel') {
    TimeoutIds.forEach(id => {
      window.clearTimeout(id);
    })
    TimeoutIds = [];
  }
  else {
    console.log("conncection not found");
    return true
  }
})

function getToTalConnectButon() {
  var totalConnectButton = 0
  const allButton = document.querySelectorAll(".artdeco-button.artdeco-button--2.artdeco-button--secondary.ember-view");
  allButton.forEach((button) => {
    return button.childNodes.forEach((child) => {
      if (child['innerText'] === 'Connect') {
        totalConnectButton += 1
      }
    })
  })
  return totalConnectButton
}