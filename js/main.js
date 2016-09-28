/* global $ */

$(document).ready(function() {
  "use strict";

});

var state = {
  artists: [
    {
      name: "Best Band!",
      img: "http://placekitten.com/g/150/150",
      url: "http://last.fm/best+band"
    },
    {
      name: "2nd Best Band!",
      img: "http://placekitten.com/g/151/151",
      url: "http://last.fm/best+band2"
    }
  ]
};

//constructor for artist object
function Artist(name, img, url) {
  this.name = name;
  this.img = img;
  this.url = url;
  this.topTrack = undefined;
}

function renderData (state, parentEl) {
  var htmlEl = state.artists.map(function(item) {
      var div = "<div class='artist'>"
      div += "<img class='artist-img' src='" + item.img + "'>";
      div += "<h1 class='artist-name'>" + item.name + "</h1>";
      return div;
  });
  parentEl.html(htmlEl);

}
