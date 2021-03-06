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

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.type == "search") {
      var redirectUrl = urlCreator(request.searchTerm);
      chrome.tabs.query({
          active: true,
          currentWindow: true
      }, function(tabs) {
          chrome.tabs.update(tabs[0].id, {
              url: redirectUrl
          });
      });
  }
});

function urlCreator(input) {
  output = "https://www.youtube.com/results?sp=EgIQA1AU&q=" + input.replace(" ", "%20");
  return output
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.type == "click-star") {
      //console.log(request.difficulty);
      var ref = database.ref("videos/" + request.videoLink);
      ref.once("value").then(function(snapshot) {
          if (snapshot.hasChild("rating")) {
              if (snapshot.hasChild("difficulty")) {
                  var rating = parseFloat(snapshot.val().rating);
                  var count = parseInt(snapshot.val().count);
                  var newAverage = (rating * count + request.rating) / (count + 1);

                  var diffCount = snapshot.val().diffCount;
                  var difficulty = snapshot.val().difficulty;

                  database.ref("videos/" + request.videoLink).set({
                      rating: newAverage,
                      count: (count + 1),
                      diffCount: diffCount,
                      difficulty: difficulty
                  });
              } else {
                  var rating = parseFloat(snapshot.val().rating);
                  var count = parseInt(snapshot.val().count);
                  var newAverage = (rating * count + request.rating) / (count + 1);

                  var diffCount = 0;
                  var difficulty = 0;

                  database.ref("videos/" + request.videoLink).set({
                      rating: newAverage,
                      count: (count + 1),
                      diffCount: diffCount,
                      difficulty: difficulty
                  });
              }

          } else {
              if (snapshot.hasChild("difficulty")) {
                  var rating = request.rating;
                  var count = 1;

                  var diffCount = snapshot.val().diffCount;
                  var difficulty = snapshot.val().difficulty;

                  database.ref("videos/" + request.videoLink).set({
                      rating: rating,
                      count: count,
                      diffCount: diffCount,
                      difficulty: difficulty
                  });
              } else {
                  var rating = request.rating;
                  var count = 1;

                  var diffCount = 0;
                  var difficulty = 0;

                  database.ref("videos/" + request.videoLink).set({
                      rating: rating,
                      count: count,
                      diffCount: diffCount,
                      difficulty: difficulty
                  });
              }
          }
      });
  }
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.type == "click-difficulty") {
      console.log(request.difficulty);
      var ref = database.ref("videos/" + request.videoLink);
      ref.once("value").then(function(snapshot) {
          if (snapshot.hasChild("difficulty")) {
              if (snapshot.hasChild("rating")) {
                  var difficulty = parseFloat(snapshot.val().difficulty);
                  var diffCount = snapshot.val().diffCount;

                  var rating = snapshot.val().rating;
                  var count = snapshot.val().count;

                  if (request.difficulty != 0) {
                      difficulty = (difficulty * diffCount + request.difficulty) / (diffCount + 1);
                  }

                  database.ref("videos/" + request.videoLink).set({
                      rating: rating,
                      count: count,
                      difficulty: difficulty,
                      diffCount: (diffCount + 1)
                  });
              } else {
                  var difficulty = parseFloat(snapshot.val().difficulty);
                  var diffCount = snapshot.val().diffCount;

                  if (request.difficulty != 0) {
                      difficulty = (difficulty * diffCount + request.difficulty) / (diffCount + 1);
                  }

                  database.ref("videos/" + request.videoLink).set({
                      rating: 0,
                      count: 0,
                      difficulty: difficulty,
                      diffCount: diffCount
                  });
              }
          } else {
              if (snapshot.hasChild("rating")) {
                  var rating = snapshot.val().rating;
                  var count = snapshot.val().count;

                  var difficulty = request.difficulty;
                  var diffCount = 1;

                  if (difficulty != 0) {
                      database.ref("videos/" + request.videoLink).set({
                          rating: rating,
                          count: count,
                          difficulty: difficulty,
                          diffCount: diffCount
                      });
                  }
              } else {
                  var rating = 0;
                  var count = 0;

                  var difficulty = request.difficulty;
                  var diffCount = 1;

                  if (difficulty != 0) {
                      database.ref("videos/" + request.videoLink).set({
                          rating: rating,
                          count: count,
                          difficulty: difficulty,
                          diffCount: diffCount
                      });
                  }
              }
          }
      });
  }
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.type == "get-rating") {
      var ref = database.ref("videos/" + request.videoLink);
      ref.once("value").then(function(snapshot) {
          if (snapshot.hasChild("rating")) {
              sendResponse({
                  rating: snapshot.val().rating,
                  count: snapshot.val().count
              });
          } else {
              sendResponse({
                  rating: "(Not rated yet)",
                  count: 0
              });
          }
      })
  }
  return true;
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.type == "get-difficulty") {
      var ref = database.ref("videos/" + request.videoLink);
      ref.once("value").then(function(snapshot) {
          if (snapshot.hasChild("difficulty") && snapshot.val().difficulty != 0) {
              sendResponse({
                  difficulty: snapshot.val().difficulty,
                  diffCount: snapshot.val().diffCount
              })
          } else {
              sendResponse({
                  difficulty: "(Not enough data)",
                  diffCount: 0
              })
          }
      });
  }
  return true;
});