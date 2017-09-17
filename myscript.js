$("#search-form").append("<a class=\"btn red\" id=\"learn-search\">You Learn</a>");
$("#learn-search").css({
  "margin-left": "20px",
  "padding": "10px",
  "font-family": "Roboto, Arial, sans-serif",
  "font-size": "16px",
});

$("#learn-search").click(function() {
  chrome.runtime.sendMessage({
    type: "search", 
    searchTerm: $("#search-input #search").val()
  }, function(response) {
  });
});