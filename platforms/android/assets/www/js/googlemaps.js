  var makeMap = function() {
      var map = null;

      initMap();

      showlocation();

      function showlocation() {
          // One-shot position request.

          navigator.geolocation.getCurrentPosition(callback);

      }

      function callback(position) {

          var lat = position.coords.latitude;
          var lon = position.coords.longitude;
          console.log(lat);
          var latLong = new google.maps.LatLng(lat, lon);

          var marker = new google.maps.Marker({
              position: latLong
          });

          marker.setMap(map);
          map.setZoom(8);
          map.setCenter(marker.getPosition());
      }

     // google.maps.event.addDomListener(window, 'load', initMap);

      function initMap() {
  
          var mapOptions = {
              center: new google.maps.LatLng(0, 0),
              zoom: 6,
              mapTypeId: google.maps.MapTypeId.ROADMAP
          };
          map = new google.maps.Map(document.getElementById("map-canvas"),
              mapOptions);

      }

  }