  var ORIGIN_SELECTED = false;
  var ORIGIN_ADDRESS = "";
  var SCHOOL_ADDRESS = "";
  var DESTINATION_ADDRESS = "";
  var SCHOOLS = [];
  var COORDINATES = [];
  var selectedMode = 0;

  var makeMap = function() {
      var map = null;

      var mapOptions = {
          center: new google.maps.LatLng(0, 0),
          zoom: 6,
          mapTypeId: google.maps.MapTypeId.ROADMAP
      };

      map = new google.maps.Map(document.getElementById("map-canvas"),
          mapOptions);

      var geocoder = new google.maps.Geocoder;
      var infowindow = new google.maps.InfoWindow;

      document.getElementById('submit').addEventListener('click', function() {
          codeLatLng(geocoder, map, infowindow);
      });

      showlocation();

      var image = {
          url: '../../images/house2icon.png',
          // This marker is 20 pixels wide by 32 pixels high.
          size: new google.maps.Size(50, 50),
          // The origin for this image is (0, 0).
          origin: new google.maps.Point(0, 0),
          // The anchor for this image is the base of the flagpole at (0, 32).
          anchor: new google.maps.Point(0, 32)
      };

      var coordinates = [];
      var zpid = 0;
      var city = "Seattle";
      var state = "WA"

      $.ajax({
          type: "GET",
          url: "http://www.zillow.com/webservice/GetSearchResults.htm?zws-id=X1-ZWz1f661ls668b_1vfab&address=516+N+Mathilda+Ave&citystatezip=Sunnyvale%2CCA",
          crossDomain: true,
          dataType: "xml",
          success: processXML,
          error: error
      });

      function processXML(xml) {

          console.log(xml);

          var latitude = 0;
          var longitude = 0;

          $(xml).find("response").each(function() {
              $(xml).find("results").each(function() {
                  $(xml).find("result").each(function() {
                      zpid = parseFloat($(this).find("zpid").text());
                      $(xml).find("address").each(function() {
                          latitude = parseFloat($(this).find("latitude").text());
                          longitude = parseFloat($(this).find("longitude").text());
                      });
                  });
              });
          });


          console.log(latitude + "," + longitude + "," + zpid);

          $.ajax({
              type: "GET",
              url: "http://www.zillow.com/webservice/GetComps.htm?zws-id=X1-ZWz1f661ls668b_1vfab&zpid=" + zpid + "&count=15",
              crossDomain: true,
              dataType: "xml",
              success: processXML2,
              error: error
          });

      }

      function processXML2(xml) {
          $(xml).find("response").each(function() {
              $(xml).find("properties").each(function() {
                  $(xml).find("comparables").each(function() {
                      $(xml).find("comp").each(function() {
                          $(xml).find("address").each(function() {
                              coordinates.push([parseFloat($(this).find("latitude").text()), parseFloat($(this).find("longitude").text())]);
                          });
                      });
                  });
              });
          });

          coordinates = coordinates.slice(0, 15);

          console.log(coordinates);

          coordinates.forEach(function(val) {
              var lat = val[0];
              var lon = val[1];

              var latLong = new google.maps.LatLng(lat, lon);

              var marker = new google.maps.Marker({
                  position: latLong,
                  title: "House near you",
                  animation: google.maps.Animation.DROP,
                  icon: {
                      url: '../../images/houseicon.png',
                      // This marker is 20 pixels wide by 32 pixels high.
                      size: new google.maps.Size(50, 50),
                      // The origin for this image is (0, 0).
                      origin: new google.maps.Point(0, 0),
                      // The anchor for this image is the base of the flagpole at (0, 32).
                      anchor: new google.maps.Point(0, 32)
                  },
                  shape: {
                      type: 'poly'
                  }
              });

              marker.setMap(map);
              map.setZoom(13);
              map.setCenter(marker.getPosition());
              marker.addListener('click', function() {
                  if (marker.getAnimation() !== null) {
                      marker.setAnimation(null);
                  } else {
                      marker.setAnimation(google.maps.Animation.BOUNCE);
                  }
              });
          });

      }

      function error() {
          alert("There has been an error");
      }

      function showlocation() {
          // One-shot position request.

          navigator.geolocation.getCurrentPosition(callback);

      }

      function callback(position) {

          var lat = position.coords.latitude;
          var lon = position.coords.longitude;

          var latLong = new google.maps.LatLng(lat, lon);

          var marker = new google.maps.Marker({
              position: latLong,
              title: "Your current location",
              animation: google.maps.Animation.DROP,
              icon: image,
              shape: {
                  type: 'poly'
              }
          });

          marker.setMap(map);
          map.setZoom(13);
          map.setCenter(marker.getPosition());
          marker.addListener('click', function() {
              if (marker.getAnimation() !== null) {
                  marker.setAnimation(null);
              } else {
                  marker.setAnimation(google.maps.Animation.BOUNCE);
              }
          });
      }

      /************/
  }

  function showSchools() {

      console.log("Origin Address: " + ORIGIN_ADDRESS);

      $("#origin").css("display", "none");
      $("#school").html("Travel Here");
      $("#school").css("display", "block");

      $.ajax({
          type: "GET",
          url: "http://api.greatschools.org/schools/" + CUR_STATE + "/" + CUR_CITY + "?key=mzavtrhnujqe75zpmhxllgxx",
          crossDomain: true,
          xhrFields: {
              withCredentials: true
          },
          dataType: "xml",
          success: processXML,
          error: error
      });

      String.prototype.contains = function(it) {
          return this.indexOf(it) != -1;
      };


      function processXML(xml) {
          var schoolNames = [];
          var schoolCoordinates = [];
          var highSchools = [];
          var middleSchools = [];
          var elemSchools = [];

          $(xml).find("schools").each(function() {
              $(xml).find("school").each(function() {
                  console.log($(this).find("name").text());
                  COORDINATES.push([parseFloat($(this).find("lat").text()),
                      parseFloat($(this).find("lon").text()), $(this).find("name").text()
                  ]);
                  console.log(COORDINATES);
                  if ($(this).find("name").text().contains("High")) {
                      highSchools.push($(this).find("name").text());
                  } else if ($(this).find("name").text().contains("Middle")) {
                      middleSchools.push($(this).find("name").text());
                  } else if ($(this).find("name").text().contains("Elementary")) {
                      elemSchools.push($(this).find("name").text());
                  }
              });
          });

          console.log(COORDINATES);

          COORDINATES.forEach(function(val) {
              var lat = val[0];
              var lon = val[1];

              var latLong = new google.maps.LatLng(lat, lon);

              var marker = new google.maps.Marker({
                  position: latLong,
                  title: "School near you",
                  animation: google.maps.Animation.DROP,
                  icon: {
                      url: '../../images/schoolicon.png',
                      // This marker is 20 pixels wide by 32 pixels high.
                      size: new google.maps.Size(50, 50),
                      // The origin for this image is (0, 0).
                      origin: new google.maps.Point(0, 0),
                      // The anchor for this image is the base of the flagpole at (0, 32).
                      anchor: new google.maps.Point(0, 32)
                  }
              });

              var infowindow = new google.maps.InfoWindow;
              var geocoder = new google.maps.Geocoder;

              marker.setMap(MAP);
              MAP.setZoom(15);
              marker.addListener('click', function(e) {
                  if (marker.getAnimation() !== null) {
                      marker.setAnimation(null);
                  } else {
                      marker.setAnimation(google.maps.Animation.BOUNCE);
                  }

                  console.log(lat + "," + lon);

                  codeLatLng(geocoder, 1, MAP, marker, infowindow, lat, lon, "School");

              });
          });

          /* console.log(schoolNames);
           console.log(highSchools);
           console.log(middleSchools);
           console.log(elemSchools);*/

      }

      function error() {
          alert("there was an error");
      }

  }

  function setDestination() {

      console.log("School Address: " + SCHOOL_ADDRESS);

      $("#school").css("display", "none");

      routeCalculator();

  }

  $("#mode").change(function(e) {
      selectedMode = document.getElementById("mode").value;

      if (ORIGIN_ADDRESS != "" && SCHOOL_ADDRESS != "") {

          routeCalculator();
      }

  });

  function codeLatLng(geocoder, origin, map, marker, infowindow, lat, lng, place) {
      var latlng = new google.maps.LatLng(lat, lng);
      if (origin == 1) {
          geocoder.geocode({
              latLng: latlng
          }, function(results, status) {
              if (status == google.maps.GeocoderStatus.OK) {
                  if (results[0]) {
                      if (place == "House") {
                          ORIGIN_ADDRESS = results[0].formatted_address;
                          infowindow.setContent(results[0].formatted_address + "<br/><br/><button type='button' onclick='showSchools();' id='origin'>Show Nearby Schools</button>");
                      } else if (place == "School") {
                          var b = 0;

                          for (var i = 0; i < COORDINATES.length; i++) {
                              if (COORDINATES[i][0] == lat && COORDINATES[i][1] == lng) {
                                  b = i;
                                  break;
                              }
                          }
                          SCHOOL_ADDRESS = results[0].formatted_address;
                          infowindow.setContent(COORDINATES[b][2] + "<br/>" + results[0].formatted_address + "<br/><br/><button type='button' onclick='setDestination();' id='school'>Set Destination</button>");
                      }
                      infowindow.open(map, marker);
                  }
              } else {
                  alert("Address not found!");
                  console.log("Address not found!");
              }
          })
      }
  }

  function calcRoute(directionsService, directionsDisplay) {
      var from = ORIGIN_ADDRESS;
      var destination = SCHOOL_ADDRESS;
      selectedMode = document.getElementById('mode').value;
      var request = {
          origin: from,
          destination: destination,
          // Note that Javascript allows us to access the constant
          // using square brackets and a string value as its
          // "property."
          travelMode: google.maps.TravelMode[selectedMode]
      };

      directionsService.route(request, function(response, status) {
          if (status == google.maps.DirectionsStatus.OK) {
              directionsDisplay.setDirections(response);
              //$("#directionsPanel").css({"visibility":"visible","overflow-y": "scroll","height": "450px"});
          }
      });
  }

  function computeTotalDistance(result) {
      var total = 0;
      var myroute = result.routes[0];
      for (var i = 0; i < myroute.legs.length; i++) {
          total += myroute.legs[i].distance.value;
      }
      total = total / 1000.0;
      $("#total").html(total + ' km');
  }

  function routeCalculator() {
      var directionsDisplay;
      var directionsService = new google.maps.DirectionsService();
      // var haight = new google.maps.LatLng(37.7699298, -122.4469157);
      //  var oceanBeach = new google.maps.LatLng(37.7683909618184, -122.51089453697205);

      directionsDisplay = new google.maps.DirectionsRenderer();
      /*var mapOptions = {
          zoom: 8,
          center: haight
      }*/
      directionsDisplay.setMap(MAP);

      directionsDisplay.setPanel(document.getElementById('directionsPanel'));

      google.maps.event.addListener(directionsDisplay, 'directions_changed', function() {
          computeTotalDistance(directionsDisplay.getDirections());
      });

      calcRoute(directionsService, directionsDisplay);

  }

  function setOriginButtonType() {
      if (ORIGIN_SELECTED) {
          $("#origin").html("Set Destination");
          $("#origin").attr("onclick", "setDestination()");
      } else {
          $("#origin").html("Set Origin");
          $("#origin").attr("onclick", "setOrigin()");
      }
  }