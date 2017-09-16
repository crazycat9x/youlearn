var searchActive = false;

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if(request.specialClick == "yes") {
    searchActive = true;
    console.log("yes");
  } else if(request.specialClick == "no") {
    searchActive = false;
    console.log("No");
  }
});