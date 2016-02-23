Parse.initialize("O6sl93uSMLWATyiQitsMIuNKoAdpbXVpF75wqAno", "VUrbaYNzteQYethEmqXYJWaowXcH0wA0Ol1TB6rI");

var user = Parse.User.current();

var parentBox;

var bidColor = 0;

$(".userFullName").prepend(user.get("FullName"));

$(".userName").append(user.get("FullName"));

$("#userEmail").html(user.get("email"));

function showHomeHTML() {
    var homeHtml = "";

    /*homeHtml += '<div class="col-lg-3 col-md-6 col-sm-6 col-xs-12">';
    homeHtml += '<a href="index.html#">';
    homeHtml += '<div class="card red summary-inline">';
    homeHtml += '<div class="card-body">';
    homeHtml += ' <i class="icon fa fa-inbox fa-4x"></i>';
    homeHtml += ' <div class="content">';
    homeHtml += '<div class="title">50</div>';
    homeHtml += ' <div class="sub-title">New Mails</div>';
    homeHtml += ' </div>';
    homeHtml += '<div class="clear-both"></div>';
    homeHtml += ' </div>';
    homeHtml += '</div>';
    homeHtml += ' </a>';
    homeHtml += ' </div>';*/

    homeHtml += '<div style="width: 100%; height: 600px;" class="card blue summary-inline">';
    homeHtml += '  <div class="card-body">';
    homeHtml += '   <div class="content">';
    homeHtml += '   <h1 style="font-size: 8em; vertical-align: middle; line-height: 600px;"class="userName">Welcome ' + user.get("FullName") + '</h1>';
    homeHtml += '   </div>';
    homeHtml += '    <div class="clear-both"></div>';
    homeHtml += '     </div>';
    homeHtml += '     </div>';

    $("#contentDiv").html(homeHtml);
}

$("#postProject").click(function(e) {


    //e.preventDefault();

    var projectName = $("#projectName").val();
    var projectDescription = $("#projectDescription").val();

    addProjectToDatabase(user.get("username"), projectName, projectDescription);

    getProjectData(function(projects) {
        for (var project = 0; project < projects.length; project++) {
            if (project == 0) $("#contentDiv").html("");

            var projectUsername = projects[project].get("projectUser");

            if (projectUsername == user.get("username")) {
                var projectName = projects[project].get("projectName");
                var projectDescription = projects[project].get("projectDescription");
                var projectBidUsernames = projects[project].get("projectBidUsernames");
                var projectBidEquities = projects[project].get("projectBidEquities");
                var projectBidMessage = projects[project].get("projectBidMessage");

                var numCards = projectBidUsernames.length;

                var postHtml = "";

                postHtml += '<div style="background-color: #d8d8d8; width: 100%; padding-bottom: 20px;" class="col-lg-3 col-md-6 col-sm-6 col-xs-12"><h1>' + projectUsername + '</h1><h3>' + projectName + '</h3><button type="button" class="btn btn-primary btn-md deleteBtn">';
                postHtml += '<span class="icon fa fa-trash"></span> Delete</button><br/><p>' + projectDescription + '</p>';

                for (var i = 0; i < numCards; i++) {

                    postHtml += makeBidCard(projectBidUsernames[i], projectBidEquities[i], projectBidMessage[i]);

                }


                postHtml += '</div>';

                $("#contentDiv").prepend(postHtml);
            }
        }
    });

    $(".deleteBtn").on("click", function(e) {
        e.preventDefault();
        $(this).parent().fadeOut();
    });
});

function showMyBids() {
    $("#contentDiv").append("<h1>My Projects</h1>");
    getProjectData(function(projects) {
        for (var project = 0; project < projects.length; project++) {
            if (project == 0) $("#contentDiv").html("");

            var projectUsername = projects[project].get("projectUser");

            if (projectUsername == user.get("username")) {
                var projectName = projects[project].get("projectName");
                var projectDescription = projects[project].get("projectDescription");
                var projectBidUsernames = projects[project].get("projectBidUsernames");
                var projectBidEquities = projects[project].get("projectBidEquities");
                var projectBidMessage = projects[project].get("projectBidMessage");

                var numCards = projectBidUsernames.length;

                var postHtml = "";

                postHtml += '<div style="background-color: #d8d8d8; width: 100%; padding-bottom: 20px;" class="col-lg-3 col-md-6 col-sm-6 col-xs-12"><h1>' + projectUsername + '</h1><h3>' + projectName + '</h3><button type="button" class="btn btn-primary btn-md deleteBtn">';
                postHtml += '<span class="icon fa fa-trash"></span> Delete</button><br/><p>' + projectDescription + '</p>';

                for (var i = 0; i < numCards; i++) {

                    postHtml += makeBidCard(projectBidUsernames[i], projectBidEquities[i], projectBidMessage[i]);

                }

                postHtml += '</div>';

                $("#contentDiv").prepend(postHtml);
            }
        }

    });

    $(".deleteBtn").on("click", function(e) {
        e.preventDefault();
        $(this).parent().fadeOut();
    });
}

function showMapHTML() {

    var mapHtml = "";

    mapHtml += '<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">';
    mapHtml += '<div id="map-canvas" style="z-index: 1000;"></div>';
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
    profileHtml += '<img src="../img/mercari.png" width="150" height="150" />';
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
    profileHtml += ' <input type="text" style="background-color: #ebeef4;" class="form-control" id="updateUser" value="' + user.get("username") + '"/>';
    profileHtml += ' </div>';
    profileHtml += ' <div class="control">';
    profileHtml += ' <div style="color:#182B52;">';
    profileHtml += ' </div>';
    profileHtml += '</br>';
    profileHtml += ' <input type="email" style="background-color: #ebeef4;" class="form-control" id="updateEmail" value="' + user.get("email") + '"/>';
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

    $("#updateProfileBtn").click(function(e) {
        e.preventDefault();
        var username = $("#updateUser").val();
        var email = $("#updateEmail").val();
        var password = $("#updatePassword").val();

        user.set("username", username);
        user.set("email", email);
        user.set("password", password);

        user.save(null, {
            success: function(user) {
                alert("You have successfully updated your profile!");
            },
            error: function(user, error) {
                alert("There was an error while updating your profile. Please try again later.")
            }
        });
    });
}

function showBidsHTML() {
    getProjectData(function(projects) {
        for (var project = 0; project < projects.length; project++) {
            if (project == 0) $("#contentDiv").html("");

            var projectUsername = projects[project].get("projectUser");
            var projectName = projects[project].get("projectName");
            var projectDescription = projects[project].get("projectDescription");
            var projectBidUsernames = projects[project].get("projectBidUsernames");
            var projectBidEquities = projects[project].get("projectBidEquities");
            var projectBidMessage = projects[project].get("projectBidMessage");
            var projectBidEmail = projects[project].get("projectBidEmails");
            var projectPhoneNumber = projects[project].get("projectBidPhones");

            var numCards = projectBidUsernames.length;

            var bidsHtml = "";

            bidsHtml += '<div style="background-color: #d8d8d8; width: 100%; padding-bottom: 20px;" class="col-lg-3 col-md-6 col-sm-6 col-xs-12"><h1>' + projectUsername + '</h1><h3>' + projectName + '</h3><button type="button" class="btn btn-primary btn-lg" data-toggle="modal" onclick="parentBox = $(this).parent();" data-target="#myModal">';
            bidsHtml += '<span class="icon fa fa-plus"></span>Add Bid</button><br/><p>' + projectDescription + '</p>';

            for (var i = 0; i < numCards; i++) {

                bidsHtml += makeBidCard(projectBidUsernames[i], projectBidEquities[i], projectBidMessage[i]);

            }

            bidsHtml += '</div>';

            $("#contentDiv").append(bidsHtml);
        }
    });

}

function makeBidCard(name, bid, message) {
    var color = "";

    bidColor++;

    if (bidColor == 5) bidColor = 1;

    switch (bidColor) {
        case 1:
            color = "red";
            break;
        case 2:
            color = "yellow";
            break;

        case 3:
            color = "green";
            break;
        case 4:
            color = "blue";
            break;
        default:
            color = "red";

    }

    var bidHtml = "";

    bidHtml += '<div class="col-lg-3 col-md-6 col-sm-6 col-xs-12">';
    bidHtml += '<a href="">';
    bidHtml += '<div class="card ' + color + ' summary-inline" style="margin-bottom: 20px">';
    bidHtml += '<div class = "card-body">';
    bidHtml += '<h3>' + message + '</h3>';
    bidHtml += '<div class="content">';
    bidHtml += '<div class="title">' + bid + '%</div>';
    bidHtml += '<div class = "sub-title">' + name + '</div>';
    bidHtml += '</div>';
    bidHtml += '<div class="clear-both"></div>';
    bidHtml += '</div>';
    bidHtml += '</div>';
    bidHtml += '</a>';
    bidHtml += '</div>';

    return bidHtml;
}


$("#submitBid").click(function(e) {
    e.preventDefault();

    var username = $(parentBox).children("h1").html();
    var projName = $(parentBox).children("h3").html();
    console.log(username);
    var equity = $("#bidderEquity").val();
    var message = $("#bidderMessage").val();

    addBidToDatabase(username, equity, message, projName);

    $(parentBox).append(makeBidCard(user.get("username"), equity, message));
});