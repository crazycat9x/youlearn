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
    console.log(request.difficulty);
    var ref = database.ref("videos/" + request.videoLink);
    ref.once("value").then(function(snapshot) {
      if(snapshot.hasChild("rating")) {
        var rating = parseFloat(snapshot.val().rating);
        var count = parseInt(snapshot.val().count);
        var newAverage = (rating * count + request.rating) / (count + 1);
        
        var difficulty = parseFloat(snapshot.val().difficulty);
        var diffCount = snapshot.val().diffCount;
        
        if(request.difficulty != 0) {
          difficulty = (difficulty * count + request.difficulty) / (diffCount + 1);
        }
        
        database.ref("videos/" + request.videoLink).set({
          rating: newAverage,
          count: (count + 1),
          difficulty: difficulty,
          diffCount: (diffCount + 1)
        });
      } else {
        var difficulty = 0;
        var diffCount = 0;
        if(request.difficulty != 0) {
          difficulty = request.difficulty;
          diffCount = 1;
        }
        
        database.ref("videos/" + request.videoLink).set({
          rating: request.rating,
          count: 1,
          difficulty: difficulty,
          diffCount: diffCount
        });
      }
    });
  }
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if(request.type == "get-rating") {
    var ref = database.ref("videos/" + request.videoLink);
    ref.once("value").then(function(snapshot) {
      if(snapshot.hasChild("rating")) {
        sendResponse(snapshot.val().rating);
      } else {
        sendResponse("(Not rated yet)");
      }
    })
  }
  return true;
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if(request.type == "get-basic") {
    var orderedUrlList = [];
    request.urls.forEach(function(e) {
      var ref = database.ref("videos/" + e);
      ref.once("value").then(function(snapshot) {
        if(snapshot.val() != null) {
          if(snapshot.val().difficulty >= 0 && snapshot.val().difficulty < 1.5) {
            orderedUrlList.push({
              url: e,
              rating: snapshot.val().rating
            });
          }
        }
      });
    });
    //console.log(orderedUrlList);
    sendResponse(customSort(orderedUrlList));
    //console.log(orderedUrlList);
  } else if(request.type == "get-intermediate") {
    var orderedUrlList = [];
    request.urls.forEach(function(e) {
      var ref = database.ref("videos/" + e);
      ref.once("value").then(function(snapshot) {
        if(snapshot.val() != null) {
          if(snapshot.val().difficulty >= 1.5 && snapshot.val().difficulty < 2.5) {
            orderedUrlList.push({
              url: e,
              rating: snapshot.val().rating
            });
          }
        }
      });
    });
    //console.log(orderedUrlList);
    sendResponse(customSort(orderedUrlList));
    //console.log(orderedUrlList);
  } else if (request.type == "get-advanced") {
    var orderedUrlList = [];
    request.urls.forEach(function(e) {
      var ref = database.ref("videos/" + e);
      ref.once("value").then(function(snapshot) {
        if(snapshot.val() != null) {
          if(snapshot.val().difficulty >= 2.5 && snapshot.val().difficulty < 3) {
            orderedUrlList.push({
              url: e,
              rating: snapshot.val().rating
            });
          }
        }
      });
    });
    //console.log(orderedUrlList);
    sendResponse(customSort(orderedUrlList));
    //console.log(orderedUrlList);
  }
});

function customSort(arr) {
  var resultArr = [];
  var temp = {};
  for(var i = 0; i < arr.length; i++) {
    for(var j = 1; j < arr.length - 1; j++) {
      if(arr[j].rating < arr[j - 1].rating) {
        temp = arr[j - 1];
        arr[j - 1] = arr[j];
        arr[j] = temp;
      }
    }
  }
  
  arr.forEach(function(e) {
    resultArr.push(e.url);
  });
  
  return resultArr;
}