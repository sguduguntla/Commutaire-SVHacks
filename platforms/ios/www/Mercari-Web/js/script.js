var CUR_CITY = "";
var CUR_STATE = "";
var MAP;

function showHomeHTML() {
    var homeHtml = "";

    homeHtml += '<div style="width: 100%; height: 600px;" class="card blue summary-inline">';
    homeHtml += '  <div class="card-body">';
    homeHtml += '   <div class="content">';
    homeHtml += '   <h1 style="font-size: 8em; vertical-align: middle; line-height: 600px;"class="userName">Welcome Sriharsha!</h1>';
    homeHtml += '   </div>';
    homeHtml += '    <div class="clear-both"></div>';
    homeHtml += '     </div>';
    homeHtml += '     </div>';

    $("#contentDiv").html(homeHtml);
}

$("#search").click(function(e) {
    e.preventDefault();

    var city = $("#city").val().trim();
    var state = $("#state").val().trim();
    var numBeds = $("#numBeds option:selected").text().trim();
    var numBaths = $("#numBaths option:selected").text().trim();
    var priceRange = $("#priceRange option:selected").text().trim();

    var location = "";
    var beds = "";
    var baths = "";
    var price = "";

    if (city != "" && state != "" && numBeds != "" && numBaths != "" && priceRange != "") {

        CUR_CITY = city;
        CUR_STATE = state;

        $("#myAlert").fadeOut();

        var mapHtml = "";

        mapHtml += '<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">';
        mapHtml += '<div id="map-canvas" style="z-index: 1000;"></div>';
        mapHtml += '</div>';
        mapHtml += '<div id="outer-map-panel">';
        mapHtml += '<div id="map-panel">';
        mapHtml += '<div id="directionsPanel">';
        mapHtml += '<div class="alert fresh-color alert-success" role="alert">';
        mapHtml += '<strong><p class="lead">Total Distance: </strong><span id="total"></span>powered by Uber <img src="../../images/uber.png" /></p>';
        mapHtml += '</div>';
        mapHtml += '</div><br/><br/>';
        mapHtml += '<select class="form-control" id="mode">';
        mapHtml += '<option value="DRIVING">Mode of Transportation</option>';
        mapHtml += '<option value="DRIVING">Driving</option>';
        mapHtml += '<option value="WALKING">Walking</option>';
        mapHtml += '<option value="BICYCLING">Bicycling</option>';
        mapHtml += '<option value="TRANSIT">Transit</option>';
        mapHtml += '</select>';
        mapHtml += '</div>';
        mapHtml += '</div>';

        $("#contentDiv").html(mapHtml);

        location = city + ",-" + state + "_rb";
        beds = numBeds.charAt(0) + "-_beds";
        baths = numBaths.charAt(0) + "-_baths";
        price = "";

        var mapOptions = {
            center: new google.maps.LatLng(0, 0),
            zoom: 6,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };

        MAP = new google.maps.Map(document.getElementById("map-canvas"),
            mapOptions);

        var geocoder = new google.maps.Geocoder;

        var coordinates = [];
        var zpid = 0;
        var url = "";

        if (city == "Cupertino") {
            url = "http://www.zillow.com/webservice/GetSearchResults.htm?zws-id=X1-ZWz1f661ls668b_1vfab&address=10151+Parlett+Pl&citystatezip=Cupertino%2CCA";
        } else if (city == "San Jose") {
            url = "http://www.zillow.com/webservice/GetSearchResults.htm?zws-id=X1-ZWz1f661ls668b_1vfab&address=4495+Strawberry+Park+Dr&citystatezip=San+Jose%2CCA";
        } else if (city == "Santa Clara") {
            url = "http://www.zillow.com/webservice/GetSearchResults.htm?zws-id=X1-ZWz1f661ls668b_1vfab&address=3551+Mauricia+Ave&citystatezip=Santa+Clara%2CCA";
        } else if (city == "Sacramento") {
            url = "http://www.zillow.com/webservice/GetSearchResults.htm?zws-id=X1-ZWz1f661ls668b_1vfab&address=2641+Montgomery+Way&citystatezip=Sacramento%2CCA";
        } else if (city == "San Francisco") {
            url = "http://www.zillow.com/webservice/GetSearchResults.htm?zws-id=X1-ZWz1f661ls668b_1vfab&address=890+48th+Ave&citystatezip=San+Francisco%2CCA";
        }

        $.ajax({
            type: "GET",
            url: url,
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
                    }
                });

                var infowindow = new google.maps.InfoWindow;

                marker.setMap(MAP);
                MAP.setZoom(15);
                MAP.setCenter(marker.getPosition());
                marker.addListener('click', function(e) {
                    if (marker.getAnimation() !== null) {
                        marker.setAnimation(null);
                    } else {
                        marker.setAnimation(google.maps.Animation.BOUNCE);
                    }

                    var lat = e.latLng.lat();
                    var lng = e.latLng.lng();

                    console.log(lat + "," + lng);

                    codeLatLng(geocoder, 1, MAP, marker, infowindow, lat, lng, "House");

                });
            });

        }

        function error() {
            alert("There has been an error");
        }

    } else {
        $("#myAlert").fadeIn();
    }

    /* if (priceRange == "150K or less") {
         price = "0-150000_price";
     } else if (priceRange == "150K - 300K") {
         price = "150000-300000_price";
     } else if (priceRange == "300K - 800K") {
         price = "300000-800000_price";
     } else if (priceRange == "More than 800K") {
         price = "800000-_price";
     }*/



    /*var url = "http://www.zillow.com/homes/" + location + "/" + beds + "/" + baths + "/" + price + "/".trim();

    var query = {
        url: url,
        type: 'html',
        selector: ".search-title-container",
        extract: "innerHTML"
    };

    var encoded = encodeURIComponent(JSON.stringify(query).trim());

    encoded = "http://" + encoded.substring(encoded.indexOf("www"), encoded.length);

    var uriQuery = encoded;
    var request = 'http://example.noodlejs.com/?q=' +
        uriQuery + '&callback=?';

    console.log(uriQuery);

    // Make Ajax request to Noodle server
    jQuery.getJSON(request, function(data) {
        console.log(data[0].results);
        console.log(data);
        console.log("Mitesh");

    });

    console.log("Hi");*/

});

function showMapHTML() {

    var mapHtml = "";

    mapHtml += '<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">';
    mapHtml += '<div id="map-canvas" style="z-index: 1000;"></div>';
    mapHtml += '</div>';
    mapHtml += '<div id="outer-map-panel">';
    mapHtml += '<div id="map-panel">';
    mapHtml += '<input type="text" id="from" placeholder="From Address">';
    mapHtml += '<input type="text" id="destination" placeholder="To Address">';
    mapHtml += '<select class="form-control" id="mode">';
    mapHtml += '<option value="DRIVING">Mode of Transportation</option>';
    mapHtml += '<option value="DRIVING">Driving</option>';
    mapHtml += '<option value="WALKING">Walking</option>';
    mapHtml += '<option value="BICYCLING">Bicycling</option>';
    mapHtml += '<option value="TRANSIT">Transit</option>';
    mapHtml += '</select>';
    mapHtml += '</div>';
    mapHtml += '</div>';
    mapHtml += '<div id="directionsPanel">';
    mapHtml += '<p>Total Distance: <span id="total"></span></p>';
    mapHtml += '</div>';

    $("#contentDiv").html(mapHtml);

    makeMap();

}

function showProfileHTML() {
    var profileHtml = "";

    profileHtml += '<div style="background-color: white" class="container">';
    profileHtml += ' <div class="login-box">';
    profileHtml += ' <div>';
    profileHtml += ' <div class="login-form row">';
    profileHtml += ' <div class="col-sm-12 text-center login-header">';
    profileHtml += '<img src="../../img/commutaire-logo.png" width="150" height="150" />';
    profileHtml += '<h4 class="login-title">&nbsp; U S E R&nbsp; &nbsp; S E T T I N G S</h4>';
    profileHtml += ' </div>';
    profileHtml += ' <div class="col-sm-12">';
    profileHtml += '<div class="login-body">';
    profileHtml += ' <div class="progress hidden" id="login-progress">';
    profileHtml += ' <div class="progress-bar progress-bar-success progress-bar-striped active" role="progressbar" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100" style="width: 100%">';
    profileHtml += 'Registering...';
    profileHtml += ' </div>';
    profileHtml += ' </div>';
    profileHtml += ' <form>';
    profileHtml += ' <div class="control">';
    profileHtml += '<div style="color:#182B52;">';
    profileHtml += ' </div>';
    profileHtml += '</br>';
    profileHtml += ' <input type="text" style="background-color: #ebeef4;" class="form-control" id="updateUser" value="Sriharsha Guduguntla"/>';
    profileHtml += ' </div>';
    profileHtml += ' <div class="control">';
    profileHtml += ' <div style="color:#182B52;">';
    profileHtml += ' </div>';
    profileHtml += '</br>';
    profileHtml += ' <input type="email" style="background-color: #ebeef4;" class="form-control" id="updateEmail" value="sguduguntla11@gmail.com"/>';
    profileHtml += ' </div>';
    profileHtml += ' <div class="control">';
    profileHtml += ' <div style="color:#182B52;">';
    profileHtml += ' <div>';
    profileHtml += '</br>';
    profileHtml += ' <input type="password" style="background-color: #ebeef4;" class="form-control" id="updatePassword" placeholder="New Password" />';
    profileHtml += ' </div>';
    profileHtml += '<br/>';
    profileHtml += '<div class="login-button text-center">';
    profileHtml += '</br>';
    profileHtml += ' <input type="submit" class="btn btn-primary form-control" id="updateProfileBtn" value="Update Profile"/>';
    profileHtml += ' </div>';
    profileHtml += ' </form>';
    profileHtml += ' </div>';
    profileHtml += ' <div class="login-footer">';
    profileHtml += '</div>';
    profileHtml += '</div>';
    profileHtml += '</div>';
    profileHtml += ' </div>';
    profileHtml += ' </div>';
    profileHtml += ' </div>';

    $("#contentDiv").html(profileHtml);
}

function showBidsHTML() {

}