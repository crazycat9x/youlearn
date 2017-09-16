$("#search-form").append("<a id=\"learn-search\">You Learn</a>");
$("#learn-search").css({
  "margin-left": "20px",
  "padding": "10px",
  "font-family": "Roboto, Arial, sans-serif",
  "font-size": "16px",
  "border": "1px solid gray",
  "border-radius": "10px",
  "background-color": "lightgray"
});

$("#learn-search").click(function() {
  chrome.runtime.sendMessage({
    clicked: "yes", 
    searchTerm: $("#search-input #search").val()
  }, function(response) {
  });
});