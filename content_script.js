let TimeoutIds = [];
let textMessage
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === 'connection') {
    // DEFINE TIMEOUT FOR OPEN MODEL AND CLOSE MODEL
    const waitTimeForConnectOpen = 1000;
    const applyTimeForConnectOpen = 500;
    const applyTimeForMessageConnectOpen = 800;
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
            //FIND PROFILE NAME
            const contentDiv = button.closest(".entity-result__item")
            const profileDiv = contentDiv.querySelector(".entity-result__content.entity-result__divider")
            const innerTextofco = profileDiv.querySelector(".app-aware-link").innerText
            const profileName = innerTextofco.split("\n")[0]

            window.setTimeout(() => {
              TimeoutIds = TimeoutIds.filter(i => i !== currentEventId)
              if (textMessage?.length > 1) {
                const finalMessage = textMessage.replace("$var", profileName)
                document.querySelector(".artdeco-button.artdeco-button--muted.artdeco-button--2.artdeco-button--secondary.ember-view.mr1").click()
                window.setTimeout(() => {
                  document.querySelector(".ember-text-area.ember-view.connect-button-send-invite__custom-message.mb3").value = finalMessage;
                  document.querySelector(".ember-text-area.ember-view.connect-button-send-invite__custom-message.mb3").dispatchEvent(new Event('change'));
                  document.querySelector(".artdeco-button.artdeco-button--2.artdeco-button--primary.ember-view.ml1").disabled = false
                  document.querySelector(".artdeco-button.artdeco-button--2.artdeco-button--primary.ember-view.ml1")?.click()
                }, (applyTimeForMessageConnectOpen / 2))
              }
              else {
                const sendButton = document.querySelector(".artdeco-button.artdeco-button--2.artdeco-button--primary.ember-view.ml1")
                if (sendButton) {
                  sendButton.click()
                }
              }

            }, ((applyTimeForConnectOpen + applyTimeForMessageConnectOpen) / 2));

            //SENT COMPLETED TASK
            chrome.runtime.sendMessage({ type: "completedButtonTask", completedTask: true })

          }, (waitTimeForConnectOpen + applyTimeForConnectOpen + applyTimeForMessageConnectOpen + 100) * currentApplyCount);
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
  else if (request.action === 'textMessage') {
    textMessage = request.message
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

function checkPageOnReload() {
  if (performance.navigation.type === performance.navigation.TYPE_RELOAD) {
    chrome.runtime.sendMessage({ type: "success" })
  }
}

checkPageOnReload()