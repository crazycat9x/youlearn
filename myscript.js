$("#search-form").append("<button id=\"learn-search\">Learn</button>");
$("#learn-search").css({
  "margin-left": "20px",
  "width": "100px",
  "font-family": "Roboto, Arial, sans-serif",
  "font-size": "16px" 
});

$("#learn-search").click(function() {
  chrome.runtime.sendMessage({specialClick: "yes"}, function(response) {});
});

$("#search-icon-legacy").click(function() {
  chrome.runtime.sendMessage({specialClick: "no"}, function(response) {});
});