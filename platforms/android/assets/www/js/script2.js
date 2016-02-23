Parse.initialize("O6sl93uSMLWATyiQitsMIuNKoAdpbXVpF75wqAno", "VUrbaYNzteQYethEmqXYJWaowXcH0wA0Ol1TB6rI");

//Login User

var loginUsername = $("#loginUsername").val();
var loginPassword = $("#loginPassword").val();
var currentUser;

$("#loginBtn").click(function(e) {
    e.preventDefault();
    var loginUsername = $("#loginUsername").val();
    var loginPassword = $("#loginPassword").val();

    Parse.User.logIn(loginUsername, loginPassword, {
        success: function(user) {
            alert("You have successfully logged in!");
            currentUser = Parse.User.current();
            bigFunction(currentUser);
            window.location.href = "../index.html";
        },
        error: function(user, error) {
            alert("Username and password do not match");
        }
    });
});


//Register User

$("#registerBtn").click(function(e) {
    e.preventDefault();
    var registerName = $("#registerName").val();
    var registerEmail = $("#registerEmail").val();
    var registerUsername = $("#registerUsername").val();
    var registerPassword = $("#registerPassword").val();
    var registerConfirmPassword = $("#registerConfirmPassword").val();
    var registerPhone = $("#registerPhone").val();

    if (registerPassword == registerConfirmPassword) {
        var user = new Parse.User();
        user.set("FullName", registerName);
        user.set("email", registerEmail);
        user.set("username", registerUsername);
        user.set("password", registerPassword);
        user.set("Phone", registerPhone);

        user.signUp(null, {

            success: function(user) {

                alert("You've successfully signed up!");
                user.logOut();
                window.location.href = "../login.html";

            },
            error: function(user, error) {
                // Show the error message somewhere and let the user try again.
                alert("Error: " + error.code + " " + error.message);
            }
        });

    } else {
        alert("Error!");
    }
});


function getProjectData(callback) {
    var projects = new Parse.Object.extend("Projects");
    var query = new Parse.Query(projects);

    query.find({
        success: function(projects) {
            callback(projects);
        },
        error: function(projects, error) {
            alert("An error while loading your projects");
        }
    });
}

function addBidToDatabase(username, equity, message) {
    var usernameFound = false;
    getProjectData(function(projects) {
        $.each(projects, function(i, project) {
            if (project.get("projectUser") == username) {
                project.get("projectBidUsernames").push(user.get("username"));
                project.get("projectBidEquities").push(equity);
                project.get("projectBidMessage").push(message);
                usernameFound = true;
            }
        });

        if (!usernameFound) {
            alert("Username: '" + username + "' was not found");
        }
    });
}

function getCurrentUser() {
    return currentUser;
}

/*********************************************/

var parentBox;

var bidColor = 0;

function showHomeHTML() {

    var homeHtml = "";

    homeHtml += '<div class="col-lg-3 col-md-6 col-sm-6 col-xs-12">';
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
    homeHtml += ' </div>';
    homeHtml += '<div class="col-lg-3 col-md-6 col-sm-6 col-xs-12">';
    homeHtml += '<a href="index.html#">';
    homeHtml += '<div class="card yellow summary-inline">';
    homeHtml += '<div class="card-body">';
    homeHtml += '<i class="icon fa fa-comments fa-4x"></i>';
    homeHtml += '<div class="content">';
    homeHtml += '<div class="title">23</div>';
    homeHtml += ' <div class="sub-title">New Message</div>';
    homeHtml += ' </div>';
    homeHtml += ' <div class="clear-both"></div>';
    homeHtml += '</div>';
    homeHtml += ' </div>';
    homeHtml += ' </a>';
    homeHtml += ' </div>';
    homeHtml += ' <div class="col-lg-3 col-md-6 col-sm-6 col-xs-12">';
    homeHtml += '<a href="index.html#">';
    homeHtml += '<div class="card green summary-inline">';
    homeHtml += '<div class="card-body">';
    homeHtml += '<i class="icon fa fa-tags fa-4x"></i>';
    homeHtml += '<div class="content">';
    homeHtml += ' <div class="title">280</div>';
    homeHtml += ' <div class="sub-title">Product View</div>';
    homeHtml += ' </div>';
    homeHtml += '</div>';
    homeHtml += ' </div>';
    homeHtml += ' </a>';
    homeHtml += ' </div>';
    homeHtml += ' <div class="col-lg-3 col-md-6 col-sm-6 col-xs-12">';
    homeHtml += '<a href="index.html#">';
    homeHtml += ' <div class="card blue summary-inline">';
    homeHtml += '<div class="card-body">';
    homeHtml += ' <i class="icon fa fa-share-alt fa-4x"></i>';
    homeHtml += ' <div class="content">';
    homeHtml += ' <div class="title">16</div>';
    homeHtml += ' <div class="sub-title">Share</div>';
    homeHtml += ' </div>';
    homeHtml += ' <div class="clear-both"></div>';
    homeHtml += ' </div>';
    homeHtml += ' </div>';
    homeHtml += ' </a>';
    homeHtml += '</div>';

    $("#contentDiv").html(homeHtml);
}

$("#postProject").click(function(e) {
    //e.preventDefault();

    var projectName = $("#projectName").val();
    var projectDescription = $("#projectDescription").val();

    var projectHtml = "";

    var userFullName = "Sriharsha Guduguntla";

    projectHtml += '<div style="background-color: #d8d8d8; width: 100%; padding-bottom: 20px;" class="col-lg-3 col-md-6 col-sm-6 col-xs-12"><h1>' + userFullName + '</h1><h3>' + projectName + '</h3><button type="button" class="btn btn-primary btn-md deleteBtn">';
    projectHtml += '<span class="icon fa fa-trash"></span> Delete</button><br/><p>' + projectDescription + '</p>';

    $("#contentDiv").html(projectHtml);

    $(".deleteBtn").on("click", function(e) {
        e.preventDefault();
        $(this).parent().fadeOut();
    });
});

function showMyBids() {
    var projectName = $("#projectName").val();
    var projectDescription = $("#projectDescription").val();

    var projectHtml = "";

    var userFullName = "Sriharsha Guduguntla";

    projectHtml += '<div style="background-color: #d8d8d8; width: 100%; padding-bottom: 20px;" class="col-lg-3 col-md-6 col-sm-6 col-xs-12"><h1>' + userFullName + '</h1><h3>' + projectName + '</h3><button type="button" class="btn btn-primary btn-md deleteBtn">';
    projectHtml += '<span class="icon fa fa-trash"></span> Delete</button><br/><p>' + projectDescription + '</p>';

    $("#contentDiv").html(projectHtml);

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
    profileHtml += ' <input type="text" style="background-color: #ebeef4;" class="form-control" id="updateUser" placeholder="Update Username" ';
    profileHtml += ' </div>';
    profileHtml += ' <div class="control">';
    profileHtml += ' <div style="color:#182B52;">';
    profileHtml += ' </div>';
    profileHtml += '</br>';
    profileHtml += ' <input type="email" style="background-color: #ebeef4;" class="form-control" id="updateEmail" placeholder="Update Email" />';
    profileHtml += ' </div>';
    profileHtml += ' <div class="control">';
    profileHtml += ' <div style="color:#182B52;">';
    profileHtml += ' <div>';
    profileHtml += '</br>';
    profileHtml += ' <input type="password" style="background-color: #ebeef4;" class="form-control" id="updatePassword" placeholder="Update Password" />';
    profileHtml += ' </div>';
    profileHtml += ' <div style="color:#182B52;">';
    profileHtml += '</br>';
    profileHtml += ' <input type="text" style="background-color: #ebeef4;" class="form-control" id="updatePassword" placeholder="Update Skills" />';
    profileHtml += '</div>';
    profileHtml += '<div class="login-button text-center">';
    profileHtml += '</br>';
    profileHtml += ' <input type="submit" class="btn btn-primary form-control" id="registerBtn" value="Update Profile"/>';
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
    getProjectData(function(projects) {
        for (var project = 0; project < projects.length; project++) {
            if (project == 0) $("#contentDiv").html("");

            var projectUsername = projects[project].get("projectUser");
            var projectName = projects[project].get("projectName");
            var projectDescription = projects[project].get("projectDescription");
            var projectBidUsernames = projects[project].get("projectBidUsernames");
            var projectBidEquities = projects[project].get("projectBidEquities");
            var projectBidMessage = projects[project].get("projectBidMessage");

            var numCards = projectBidUsernames.length;

            var bidsHtml = "";

            bidsHtml += '<div style="background-color: #d8d8d8; width: 100%; padding-bottom: 20px;" class="col-lg-3 col-md-6 col-sm-6 col-xs-12"><h1>' + projectUsername + '</h1><h3>' + projectName + '</h3><button type="button" class="btn btn-primary btn-lg" data-toggle="modal" onclick="parentBox = $(this).parent();" data-target="#myModal">';
            bidsHtml += '<span class="icon fa fa-plus"></span>Add Bid</button><br/><p>' + projectDescription + '</p>';

            for (var i = 1; i <= numCards; i++) {

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
    console.log(username);
    var equity = $("#bidderEquity").val();
    var message = $("#bidderMessage").val();

    addBidToDatabase(username, equity, message);

    $(parentBox).append(makeBidCard(user.get("username"), equity, message));
});