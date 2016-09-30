/* global $ */
"use strict";

$(document).ready(function() {
  $(".localfy-btn").on("click", function(e) {
    var location = prompt("Please enter your city. If nothing returns, try again with State or region.");
    getRequest(location, 4);
  });
});

// to keep track of all things state
var state = {
  artists: {},
  countCallbacks: 0
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

function getRequestArtistInfo(artistName) {
  var params = {
    api_key: "28013ebbad44c5793cdc84377c824554",
    method: "artist.getInfo",
    format: "json",
    artist: artistName
  };
  var url = "http://ws.audioscrobbler.com/2.0";
  state.countCallbacks++;
  $.getJSON(url, params).done(setArtistInfo).fail(function(){ console.log('Error getting artist') });
}

function setArtistInfo(data) {
  var artistName = data.artist.name;
  console.log(`artist : ${artistName}`);
  var bio = data.artist.bio.summary;
  console.log(`bio : ${bio}`);
  state.artists[artistName].bio = bio;
  state.countCallbacks--;
  if (state.countCallbacks === 0) renderData(state, $('.artists-container'));
}

function setArtistsObject(data) {
  data.topartists.artist.forEach(function(item, index) {
    var name = item.name;
    var img = item.image[1]["#text"];
    var url = item.url;
    var obj = new Artist(name, img, url);
    state.artists[name] = obj;
  });
  for (var artist in state.artists) {
    if (state.artists.hasOwnProperty(artist)) {
      getRequestArtistInfo(state.artists[artist]['name']);
    }
  }
}

function renderData (state, parentEl) {
  var htmlEl = Object.keys(state.artists).map(function(index) {
    var item = state.artists[index];
    var div = "<div class='artist'>";
    div += "<img class='artist-img' src='" + item.img + "'>";
    div += "<h1 class='artist-name'>" + item.name + "</h1>";
    div += "<p class='bio'>" + item.bio + "..." + "</p>";
    return div;
  });
  parentEl.html(htmlEl);
}
