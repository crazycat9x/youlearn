// Set the configuration for your app
// TODO: Replace with your project's config object
var config = {
  apiKey: "AIzaSyCMVhTIfWJHrHaquKzTpIoLHjzfUeOUnpM",
  authDomain: "pennapps2017w.firebaseapp.com",
  databaseURL: "https://pennapps2017w.firebaseio.com",
  projectId: "pennapps2017w",
  storageBucket: "pennapps2017w.appspot.com",
  messagingSenderId: "841640942330"
};
firebase.initializeApp(config);

// Get a reference to the database service
var database = firebase.database();

chrome.runtime.onMessage.addListener( function(request, sender, sendResponse) {
  if (request.type == "search") {
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

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if(request.type == "click-star") {
    database.ref("users/" + "1").set({
      videoId: request.videoLink,
      rating: request.rating
    });
  }
});