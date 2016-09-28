/* global $ */

$(document).ready(function() {
  "use strict";

});

var state = {
  artists: []
};

//constructor for artist object
function Artist(name, img, url) {
  this.name = name;
  this.img = img;
  this.url = url;
  this.topTrack = undefined;
}

function getRequest(tag, limit) {
  var params = {
    api_key: "28013ebbad44c5793cdc84377c824554",
    method: "tag.getTopArtists",
    format: "json",
    tag: tag,
    limit: limit
  };
  var url = "http://ws.audioscrobbler.com/2.0";
  // start the call
  $.getJSON(url, params, setArtistsObject);
}

function setArtistsObject(data) {
  data.topartists.artist.forEach(function(item, index) {
    var name = item.name;
    var img = item.image[1]["#text"];
    var url = item.url;
    var obj = new Artist(name, img, url);
    state.artists.push(obj);
  });

}

function renderData (state, parentEl) {
  var htmlEl = state.artists.map(function(item) {
    var div = "<div class='artist'>";
    div += "<img class='artist-img' src='" + item.img + "'>";
    div += "<h1 class='artist-name'>" + item.name + "</h1>";
    return div;
  });
  parentEl.html(htmlEl);
}
