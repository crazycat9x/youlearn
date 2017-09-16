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
    var ref = database.ref("videos/" + request.videoLink)
    ref.once("value").then(function(snapshot) {
      if(snapshot.hasChild("rating")) {
        var rating = parseFloat(snapshot.val().rating);
        var count = parseInt(snapshot.val().count);
        var newAverage = (rating * count + request.rating) / (count + 1);
        database.ref("videos/" + request.videoLink).set({
          rating: newAverage,
          count: (count + 1)
        });
      } else {
        database.ref("videos/" + request.videoLink).set({
          rating: request.rating,
          count: 1
        });
      }
    });
  }
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if(request.type == "get-rating") {
    var ref = database.ref("videos/" + request.videoLink);
    ref.once("value").then(function(snapshot) {
      if(shapshot.hasChild("rating")) {
        sendResponse({rating: snapshot.val().rating});
      } else {
        sendResponse({rating: 0});
      }
    })
  }
});