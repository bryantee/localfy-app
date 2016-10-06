/* global $ */
"use strict";

var autocomplete;

$(document).ready(function() {
  $(".button-collapse").sideNav();
  geolocate();
  $("#location").on("change", function() {
    state.locations = {};
  });
  $("#search-form").on("submit", function(e) {
    e.preventDefault();
    state.searchType = "city";
    var location = locationToString();
    if (location !== "undefined") getRequest(location, state.artistCount);
  });
  $(".new-search").on("click", function() {
    window.location = "/";
  });
  $(".load-more-btn").on("click", function() {
    var location = locationToString();
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
  this.topTrack = undefined;  // TODO: Get top track for artist. Spotify API?
  this.updated = false;
}

function locationToString() {
  var location = state.locations;
  if (location.city) {
    return location.city;
  } else if (location.state) {
    return location.state;
  } else if (location.country) {
    return location.country;
  } else {
    Materialize.toast("Select a valid location from the dropbdown.", 5000);
    console.log("Error, no location data available.");
  }
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
  $.getJSON(url, params).done(setArtistInfo).fail(function(){ console.log("Error getting artist"); });
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
  if (data.topartists.artist.length == 0 && state.searchType == "city") {
    state.searchType = "state";
    var location = state.locations.state;
    getRequest(location, state.artistCount);
  }
  data.topartists.artist.forEach(function(item) {
    var name = item.name;
    if (state.artists[name] == null) {
      var img;
      if (item.image[3]["#text"] !== "") {
        img = item.image[3]["#text"];
      } else {
        img = "images/default.png";
      }
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
    var listEl = "<ul>";
    item.tags.forEach(function(item) {
      listEl += "<li class='chip'>" + item;
    });
    listEl += "</ul>";
    var div = "<div class='col s12 m8 l6'><div class='card large'>"; // open col, card
    div += "<div class='card-image waves-effect waves-block waves-light'><img class='artist-img activator' src='" + item.img + "'></div><div class='card-content'>";
    div += "<span class='artist-name card-title activator'>" + item.name + "<i class='material-icons right'>more_vert</i></span>";
    div += listEl;
    div += "</div>"; // close out card-content
    div += "<div class='card-reveal'><span class='artist-name card-title'>" + item.name + "<i class='material-icons right'>close</i></span><p class='bio'>" + item.bio + "</p></div>";
    div += "<div class='card-action'><a target='_new' href='" + item.url + "'>Artist Page</a></div>";
    div += "</div></div>"; // close col, card
    return div;
  });
  if (state.searchType == "state") {
    var prependDiv = "<div class='col s12 m12 l12'><div class='card-panel teal'><span class='white-text'>Looks like " + state.locations.city + " returned no results, so we used " + state.locations.state + " as a search term here. Try doing a new search and using a surrounding city instead. Sorry...</span></div></div>";
    htmlEl.unshift(prependDiv);
  }
  parentEl.html(htmlEl);
  $(".bottom-panel").css("display", "flex");
}

// google maps api function to get location
function geolocate() {
  if (navigator.geolocation && state.getGeoLocation == false) {
    navigator.geolocation.getCurrentPosition(function (position) {
      var geolocation = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
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

// callback for geolocation
function callbackGeolocate(location) {
  var locationString = "";
  var locations = state.locations = {};
  location.results[0].address_components.forEach(function(val) {
    if (val.types[0] == "country") locations["country"] = val.long_name;
    if (val.types[0] == "locality") locations["city"] = val.long_name;
    if (val.types[0] == "administrative_area_level_1") locations["state"] = val.long_name;
  });
  if (state.locations.city) locationString += state.locations.city;
  if (state.locations.state) locationString += ", " + state.locations.state;
  if (state.locations.country) locationString += ", " + state.locations.country;
  if (locationString == "") alert("There was an error getting your location.");
  $("#location").val(locationString);
  state.getGeoLocation = true;
}

// callback when selecting using google autocomplete input
function callbackPlace(place) {
  if (!place) place = autocomplete.getPlace();
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
    (document.getElementById("location")), {
      types: ["geocode"]
    });

  autocomplete.addListener("place_changed", callbackPlace);
}
