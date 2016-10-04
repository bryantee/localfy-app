/* global $ */
"use strict";

var autocomplete;

$(document).ready(function() {
  $(".localfy-btn").on("click", function(e) {
    $(".load-more-btn").show();
    //location = prompt("Please enter your city. If nothing returns, try again with State or region.");
    var location = state.locations.city;
    var artistCount = state.artistCount;
    getRequest(location, artistCount);
  });
  $(".load-more-btn").on("click", function(e) {
    var location = state.locations.city;
    state.artistCount += 4;
    getRequest(location, state.artistCount);
  });
});

// to keep track of all things state
var state = {
  artists: {},
  countCallbacks: 0,
  locations: {},
  artistCount: 4,
  getGeoLocation: false
};

//constructor for artist object
function Artist(name, img, url) {
  this.name = name;
  this.img = img;
  this.url = url;
  this.topTrack = undefined;
  this.updated = false;
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
  $.getJSON(url, params).done(setArtistInfo).fail(function(){ console.log('Error getting artist'); });
}

function setArtistInfo(data) {
  var artistName = data.artist.name;
  var bio = data.artist.bio.summary;
  var tags = data.artist.tags.tag.map(function(tag) {
    return tag.name;
  });
  state.artists[artistName].bio = bio;
  state.artists[artistName].tags = tags;
  state.artists[artistName].updated = true;
  state.countCallbacks--;
  if (state.countCallbacks === 0) renderData(state, $(".artists-container"));
}

function setArtistsObject(data) {
  data.topartists.artist.forEach(function(item) {
    var name = item.name;
    if (state.artists[name] == null) {
      var img = item.image[3]["#text"];
      var url = item.url;
      var obj = new Artist(name, img, url);
      state.artists[name] = obj;
    }
  });
  // call for more info on each artist
  for (var artist in state.artists) {
    if (state.artists.hasOwnProperty(artist) && state.artists[artist].updated == false) {
      getRequestArtistInfo(state.artists[artist]["name"]);
    }
  }
}

function renderData (state, parentEl) {
  var htmlEl = Object.keys(state.artists).map(function(index) {
    var item = state.artists[index];
    var listEl = '<ul>';
    item.tags.forEach(function(item) {
      listEl += "<li>" + item;
    });
    listEl += "</ul>";
    var div = "<div class='artist'>";
    div += "<img class='artist-img' src='" + item.img + "'>";
    div += "<h1 class='artist-name'>" + item.name + "</h1>";
    div += listEl;
    div += "<p class='bio'>" + item.bio + "..." + "</p>";
    return div;
  });
  parentEl.html(htmlEl);
}

// google maps api function to get location
function geolocate() {
  if (navigator.geolocation && state.getGeoLocation == false) {
    navigator.geolocation.getCurrentPosition(function (position) {
      var geolocation = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
      console.log(geolocation);
      var params = {
        latlng: geolocation.lat + "," + geolocation.lng,
        key: "AIzaSyAbWcPOXZQgFeeM2OHtK1Y-Gje8yl6KU1Y"
      };
      var url = "https://maps.googleapis.com/maps/api/geocode/json";
      $.getJSON(url, params)
        .done(callbackGeolocate)
        .fail(function() {
          console.log("Error in geolocate...");
        });
    });
  }
}

function callbackGeolocate(location) {
  var locationString = '';
  var locations = state.locations = {};
  location.results[0].address_components.forEach(function(val) {
    if (val.types[0] == "country") locations["country"] = val.long_name;
    if (val.types[0] == "locality") locations["city"] = val.long_name;
    if (val.types[0] == "administrative_area_level_1") locations["state"] = val.long_name;
  });
  if (state.locations.city) locationString += state.locations.city;
  if (state.locations.state) locationString += ", " + state.locations.state;
  if (state.locations.country) locationString += ", " + state.locations.country;
  if (locationString == '') alert("There was an error getting your location.");
  $('#location').val(locationString);
  state.getGeoLocation = true;
}

function callbackPlace(place) {
  console.log("place : ", place);
  if (!place) place = autocomplete.getPlace();
  var locations = state.locations;
  console.log("Locations: ", locations);
  var locations = state.locations = {};
  // Set state.locations object with data from reverse geocoding from google
  place.address_components.forEach(function (val) {
    if (val.types[0] == "country") locations["country"] = val.long_name;
    if (val.types[0] == "locality") locations["city"] = val.long_name;
    if (val.types[0] == "administrative_area_level_1") locations["state"] = val.long_name;
  });
}

function initAutocomplete() {
  // Create the autocomplete object, restricting the search to geographical
  // location types.
  autocomplete = new google.maps.places.Autocomplete(
    /** @type {!HTMLInputElement} */
    (document.getElementById('location')), {
      types: ['geocode']
    });

  //geolocate();
  autocomplete.addListener('place_changed', callbackPlace);
}
