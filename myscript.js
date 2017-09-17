var img = document.createElement("IMG");
img.src = chrome.runtime.getURL('searchWithYouLearnLogo.png');
img.style.setProperty('width', '70px');
$("#search-form").append("<a class=\"btn red\" id=\"learn-search\">\
</a>");
$("#learn-search").append(img)
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
    }, function(response) {});
});