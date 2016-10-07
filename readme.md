# Localfy

## Contents
- [About](#about)
- [Use](#use)
- [Technology Used](#technology-used)
- [Todo](#todo)
- [Screenshots](#screenshots)

## About
Localfy is a mobile-first responsive web app designed to help people find music from artists local to them using the Last.fm API.

## Use
Localfy is fairly straightforward to use. If the user allows the app to get their current location, the search query is automatically pre-filled with the user's currentl location using the Google reverse geocode Places API. The user can also specify a location in the input field on the main page. Once selected, the user clicks "Localfy Me" and is presented 4 results that match the location using Last.fm's "tags". Included in the information is the artist image, biography, associated tags (often genres) and a link to their Last.fm page. The user can optionally select to see more artists or click on the Localfy logo at the top to start a new search. That's it.

## Technology Used
- [Materialize CSS](http://materializecss.com/)
- [jQuery](https://jquery.com/)
- [Google Places API](https://developers.google.com/places/)
    - [Reverse geocoding](https://developers.google.com/maps/documentation/geocoding/start)
    - Places autocomplete
- [Browser geolocation Web API](https://developer.mozilla.org/en-US/docs/Web/API/Geolocation/Using_geolocation)
- HTML5
- JavaScript ES5
- CSS3

## Todo
- [ ] Improve search algorithm for more accurate and relevant results
- [ ] Add more [Material Design]() styles and transitions
    - ie: loading animations

## Screenshots
![Main Page](http://imgur.com/bTpJa7E.png)
![Results](http://i.imgur.com/YZ230uk.png)
![Mobile Main Page](http://i.imgur.com/dPSkTua.png)
![Mobile Results](http://i.imgur.com/mDVVgDa.png)
