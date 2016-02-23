Parse.initialize("O6sl93uSMLWATyiQitsMIuNKoAdpbXVpF75wqAno", "VUrbaYNzteQYethEmqXYJWaowXcH0wA0Ol1TB6rI");

//Login User

var projectBidUsernamesGlobal = [];
var projectBidEquitiesGlobal = [];
var projectBidMessageGlobal = [];

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

function addBidToDatabase(username, equity, message, projName) {
    var user = Parse.User.current();
    var usernameFound = false;
    getProjectData(function(projects) {
        $.each(projects, function(i, project) {
            if (project.get("projectUser") == username && project.get("projectName") == projName) {
                var tempUsernames = project.get("projectBidUsernames");
                var tempEquities = project.get("projectBidEquities");
                var tempMessage = project.get("projectBidMessage");

                console.log(tempUsernames);

                tempUsernames.push(user.get("username"));
                tempEquities.push(equity);
                tempMessage.push(message);

                console.log(tempUsernames);

                project.set("projectBidUsernames", tempUsernames);
                project.set("projectBidEquities", tempEquities);
                project.set("projectBidMessage", tempMessage);

                console.log(project.get("projectBidUsernames"));

                project.save();

                usernameFound = true;
            }
        });

        console.log(projects[0].get("projectBidUsernames"));

        if (!usernameFound) {
            alert("Username: '" + username + "' was not found");
        }
    });
}

function addProjectToDatabase(username, projectName, projectDescription) {
    var Projects = new Parse.Object.extend("Projects");

    var projects = new Projects();

    projects.set("projectUser", username);
    projects.set("projectName", projectName);
    projects.set("projectDescription", projectDescription);
    projects.set("projectBidUsernames", []);
    projects.set("projectBidEquities", []);
    projects.set("projectBidMessage", []);

    projects.save(null, {
        success: function(projects) {

        },
        error: function(projects, error) {
            alert("There was an error posting your project.")
        }
    });

}

function getCurrentUser() {
    return currentUser;
}