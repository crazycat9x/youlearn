function convert_time(duration) {
    var a = duration.match(/\d+/g)
    var duration = 0

    if(a.length == 3) {
        duration = duration + parseInt(a[0]) * 3600;
        duration = duration + parseInt(a[1]) * 60;
        duration = duration + parseInt(a[2]);
    }

    if(a.length == 2) {
        duration = duration + parseInt(a[0]) * 60;
        duration = duration + parseInt(a[1]);
    }

    if(a.length == 1) {
        duration = duration + parseInt(a[0]);
    }
    return duration
}

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
<select class=\"drop-down\" id=\"flags\" name=\"flags\">\
<option value=\"default\">Select level</option>\
<option value=\"basic\">Basic</option>\
<option value=\"intermediate\">Intermediate</option>\
<option value=\"advanced\">Advanced</option>\
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
  <li class='scoreNum'></li>\
</ul>\
</div>"

    var yt = new YTLib("AIzaSyAXyjwTcQU0qXOM5vCHbKYPk5szI8OmoC8");

   

    $(ratingScore).appendTo("ytd-video-meta-block#meta.style-scope.ytd-playlist-renderer");
    $("div#contents.style-scope.ytd-item-section-renderer > ytd-playlist-renderer").each(function() {
        $(this).append(rating)
    });

    $("#content a.ytd-playlist-renderer").each(function(index) {
        var link = $(this).attr('href');
        var element = $(this);

        // console.log(link);

        chrome.runtime.sendMessage({
            type: 'get-rating',
            videoLink: link
        }, function(response) {
            if (parseInt(response.rating) > 0) {
                element.find("li.scoreNum").html(parseInt(response.rating) + "/5" + " (" + response.count + " rated)&nbsp;&nbsp;&nbsp;&nbsp;");
            } else {
                element.find("li.scoreNum").html(response.rating);
            }
            if (response) {
                stars = element.find("ul#overallStars").children('li.star')
                for (i = 0; i < parseInt(response.rating); i++) {
                    $(stars[i]).addClass('selected');
                }
            }
        });

        var playlistId = link.substring(link.indexOf('&list=')+6);
        // console.log(playlistId);
        yt.getPlaylist(playlistId).then(Data => {
            //console.log(Data);

            var dateCreated = Data.snippet.publishedAt;

            var duration = 0;
            var views = 0;
            var videos = Data.videos;

            for (var i = 0; i < videos.length; i++) {
                var durationStr = videos[i].contentDetails.duration
                duration += convert_time(durationStr);
                views += parseInt(videos[i].statistics.viewCount);
            }
            element.find("li.scoreNum").append("<span id='views'>"+"<i class='fa fa-eye' aria-hidden='true'></i>&nbsp;" +views+"</span>");
        });

            // var dateCreated = "<div class='dateCreated'>" + Data.snippet.publishedAt + "</div>";
            // element.find("li.scoreNum").append(dateCreated);
        yt.getPlaylistInformation(playlistId).then(Data => {
            pubDate = Data.snippet.publishedAt
            var dateCreated = "<span class='dateCreated'> "+"<i class='fa fa-calendar' aria-hidden='true'></i>&nbsp;" + pubDate.slice(0,pubDate.indexOf("T")) + "</span>&nbsp;&nbsp;&nbsp;&nbsp;";
            element.find("li.scoreNum").append(dateCreated);
          });
        var link = $(this).attr('href');
        chrome.runtime.sendMessage({type: 'get-difficulty', videoLink: link}, function(response) {
            element.find("#overallStars").append("<span id='difficulty'>"+"<i class='fa fa-sliders' aria-hidden='true'></i>&nbsp;" +response.difficulty+"</span>")
            console.log('st')
        });
    });

    /* 1. Visualizing things on Hover - See next part for action on click */
    $('#stars li').on('mouseover', function() {
        var onStar = parseInt($(this).data('value'), 10); // The star currently mouse on

        // Now highlight all the stars that's not after the current hovered star
        $(this).parent().children('li.star').each(function(e) {
            if (e < onStar) {
                $(this).addClass('hover');
            } else {
                $(this).removeClass('hover');
            }
        });

    }).on('mouseout', function() {
        $(this).parent().children('li.star').each(function(e) {
            $(this).removeClass('hover');
        });
    });

    /*
Reference: http://jsfiddle.net/BB3JK/47/
*/

    $('select').each(function() {
        var $this = $(this),
            numberOfOptions = $(this).children('option').length;

        $this.addClass('select-hidden');
        $this.wrap('<div class="select"></div>');
        $this.after('<div class="select-styled"></div>');

        var $styledSelect = $this.next('div.select-styled');
        $styledSelect.text($this.children('option').eq(0).text());

        var $list = $('<ul />', {
            'class': 'select-options'
        }).insertAfter($styledSelect);

        for (var i = 0; i < numberOfOptions; i++) {
            $('<li />', {
                text: $this.children('option').eq(i).text(),
                rel: $this.children('option').eq(i).val()
            }).appendTo($list);
        }

        var $listItems = $list.children('li');

        $styledSelect.click(function(e) {
            e.stopPropagation();
            $('div.select-styled.active').not(this).each(function() {
                $(this).removeClass('active').next('ul.select-options').hide();
            });
            $(this).toggleClass('active').next('ul.select-options').toggle();
        });

        $listItems.click(function(e) {
            e.stopPropagation();
            $styledSelect.text($(this).text()).removeClass('active');
            var videoId = $(this).parent().parent().parent().parent().find("a").attr('href');
            $this.val($(this).attr('rel'));
            $list.hide();
            //console.log($this.val());
            var difficultyId = 0;
            var switchVal = $(this).text();
            console.log(switchVal);
            switch(switchVal) {
                case "Basic":
                difficultyId = 1;
                break;
                case "Intermediate":
                difficultyId = 2;
                break;
                case "Advanced":
                difficultyId = 3;
                break;
                default:
                difficultyId = 0;
            }
            chrome.runtime.sendMessage({type: "click-difficulty", videoLink: videoId, difficulty: difficultyId}, function(response) {
            });
        });

        $(document).click(function() {
            $styledSelect.removeClass('active');
            $list.hide();
        });

    });
    $('select').on('change', function(){
        var option = $(this).val()
        console.log(option)
    })
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
      var videoId = $('#stars li.selected').last().parent().parent().parent().parent().find("a").attr('href');
    //   var difficultyId = 0;
    //   var switchVal = $("#flags").val();
    //   console.log(switchVal);
    //   switch(switchVal) {
    //     case "basic":
    //       difficultyId = 1;
    //       break;
    //     case "intermediate":
    //       difficultyId = 2;
    //       break;
    //     case "advanced":
    //       difficultyId = 3;
    //       break;
    //     default:
    //       difficultyId = 0;
    //   }
    //   console.log(difficultyId);
      chrome.runtime.sendMessage({type: "click-star", videoLink: videoId, rating: ratingValue}, function(response) {
      });
    });
});