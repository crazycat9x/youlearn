chrome.runtime.onMessage.addListener( function(request, sender, sendResponse) {
  if (request.clicked == "yes") {
    var redirectUrl = urlCreator(request.searchTerm);
    chrome.tabs.query( { active: true, currentWindow: true }, function( tabs ) {
      chrome.tabs.update( tabs[0].id, { url: redirectUrl } ); 
    });
  }
});

function urlCreator(input) {
  output = "https://www.youtube.com/results?sp=EgIQA1AU&q=" + input.replace(" ", "%20");
  return output
}