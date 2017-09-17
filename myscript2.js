$(document).ready(function() { 
var rating = "\
</br><div class='rating-stars text-center'>\
<span class=\'ratingLabel\'>Rating:</span> \<ul id='stars'>\
  <li class='star' title='Poor' data-value='1'>\
    <i class='fa fa-star fa-fw'></i>\
  </li>\
  <li class='star' title='Fair' data-value='2'>\
    <i class='fa fa-star fa-fw'></i>\
  </li>\
  <li class='star' title='Good' data-value='3'>\
    <i class='fa fa-star fa-fw'></i>\
  </li>\
  <li class='star' title='Excellent' data-value='4'>\
    <i class='fa fa-star fa-fw'></i>\
  </li>\
  <li class='star' title='WOW!!!' data-value='5'>\
    <i class='fa fa-star fa-fw'></i>\
  </li>\
</ul>\
</div>\
<li class=\'scoreNum\'>\</li>\
<select>\
<option value=\"useful\">Useful</option>\
<option value=\"veryUseful\">Very Useful</option>\
<option value=\"extremelyUseful\">Opel</option>\
</select>"

 
  $("div#contents.style-scope.ytd-item-section-renderer > ytd-playlist-renderer" ).each(function(){
      $(this).append(rating)
  });
  
    $("#content a.ytd-playlist-renderer").each(function(index) {
      var link = $(this).attr('href');
      var element = $(this);
      chrome.runtime.sendMessage({type: 'get-rating', videoLink: link}, function(response) {
        if(parseInt(response)) {
          element.find("li.scoreNum").html(parseInt(response));
        } else {
          element.find("li.scoreNum").html(response);
        }
        
        var width = 80 * response / 5
        if(width) {
          var widthString = parseInt(width).toString() + "px";
          console.log(widthString);
          element.find("ul#overallStars").css({"width": widthString, "height": "16px", "overflow": "hidden"});
        }
      });
    });
  
    /* 1. Visualizing things on Hover - See next part for action on click */
    $('#stars li').on('mouseover', function(){
      var onStar = parseInt($(this).data('value'), 10); // The star currently mouse on
     
      // Now highlight all the stars that's not after the current hovered star
      $(this).parent().children('li.star').each(function(e){
        if (e < onStar) {
          $(this).addClass('hover');
        }
        else {
          $(this).removeClass('hover');
        }
      });
      
    }).on('mouseout', function(){
      $(this).parent().children('li.star').each(function(e){
        $(this).removeClass('hover');
      });
    });
    
    
    /* 2. Action to perform on click */
    $('#stars li').on('click', function(){
      var onStar = parseInt($(this).data('value'), 10); // The star currently selected
      var stars = $(this).parent().children('li.star');
      
      for (i = 0; i < stars.length; i++) {
        $(stars[i]).removeClass('selected');
      }
      
      for (i = 0; i < onStar; i++) {
        $(stars[i]).addClass('selected');
      }
      
      // JUST RESPONSE (Not needed)
      var ratingValue = parseInt($('#stars li.selected').last().data('value'), 10);
      //console.log(ratingValue)
      var videoId = $('#stars li.selected').last().parent().parent().parent().find("a").attr('href');
      //console.log(videoId);
      
      chrome.runtime.sendMessage({type: "click-star", videoLink: videoId, rating: ratingValue}, function(response) {
      });
      
    });
    
  });