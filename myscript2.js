$(document).ready(function() { 
var rating = "\
<div class='rating-stars text-center'>\
<span class=\'ratingLabel\'><span style=\'padding-top: 8px;\'>Rate this playlist: </span>\<ul id='stars'>\
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
</span>\
<select class=\"drop-down\" name=\"flags\">\
<option value=\"default\">(select tutorial difficulty)</option>\
<option value=\"useful\">Basic</option>\
<option value=\"veryUseful\">Intermediate</option>\
<option value=\"extremelyUseful\">Advanced</option>\
</select>\
</div>"

var ratingScore = "\
<div class='rating-stars text-center'>\
<ul id='overallStars'>\
  <li class='star overall' title='Poor' data-value='1'>\
    <i class='fa fa-star fa-fw'></i>\
  </li>\
  <li class='star overall' title='Fair' data-value='2'>\
    <i class='fa fa-star fa-fw'></i>\
  </li>\
  <li class='star overall' title='Good' data-value='3'>\
    <i class='fa fa-star fa-fw'></i>\
  </li>\
  <li class='star overall' title='Excellent' data-value='4'>\
    <i class='fa fa-star fa-fw'></i>\
  </li>\
  <li class='star overall' title='WOW!!!' data-value='5'>\
    <i class='fa fa-star fa-fw'></i>\
  </li>\
  <li class='scoreNum'></li>/5\
</ul>\
</div>"

$(ratingScore).appendTo("ytd-video-meta-block#meta.style-scope.ytd-playlist-renderer");
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
        if(response) {
          stars = element.find("ul#overallStars").children('li.star')
          for (i = 0; i < parseInt(response); i++) {
            $(stars[i]).addClass('selected');
          }
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