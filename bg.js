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

// Create an instance of the Google provider object.
var provider = new firebase.auth.GoogleAuthProvider();

chrome.runtime.onMessage.addListener( function(request, sender, sendResponse) {
  console.log("IN BG");
  if(request.type == "googleAuth") {
    signIn();
  }
});

function signIn() { 
  firebase.auth().signInWithPopup(provider).then(function(result) {
    // This gives you a Google Access Token. You can use it to access the Google API.
    var token = result.credential.accessToken;
    // The signed-in user info.
    var user = result.user;
    // ...
  }).catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    // The email of the user's account used.
    var email = error.email;
    // The firebase.auth.AuthCredential type that was used.
    var credential = error.credential;
    // ...
  });
}

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
    database.ref("video/" + request.videoLink).puhs().set({
      "gosar": {
        rating: request.rating
      }
    });
  }
});