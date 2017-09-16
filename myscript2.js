var rating = '\
<div class="star-rating">\
<fieldset>\
<input type="radio" id="star5" name="rating" value="5" /><label for="star5" title="Outstanding">5 stars</label>\
<input type="radio" id="star4" name="rating" value="4" /><label for="star4" title="Very Good">4 stars</label>\
<input type="radio" id="star3" name="rating" value="3" /><label for="star3" title="Good">3 stars</label>\
<input type="radio" id="star2" name="rating" value="2" /><label for="star2" title="Poor">2 stars</label>\
<input type="radio" id="star1" name="rating" value="1" /><label for="star1" title="Very Poor">1 star</label>\
</fieldset>\
</div>'
$(rating).appendTo("div#content.style-scope.ytd-playlist-renderer")
console.log(rating)