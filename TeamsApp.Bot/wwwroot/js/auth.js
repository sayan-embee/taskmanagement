let accessToken;
let idToken;
$(document).ready(function () {
    microsoftTeams.initialize();
   
    getClientSideToken()
        .then((clientSideToken) => {            
            //return getServerSideToken(clientSideToken);
        })
        .catch((error) => {
            console.log(error);
            if (error === "invalid_grant") {
                // Display in-line button so user can consent
                $("#divError").text("Error while exchanging for Server token - invalid_grant - User or admin consent is required.");
                $("#divError").show();
                $("#consent").show();
            } else {
                // Something else went wrong
            }
        });
});

function requestConsent() {
    getToken()
        .then(data => {
        $("#consent").hide();
        $("#divError").hide();
        accessToken = data.accessToken;
        microsoftTeams.getContext((context) => {
            getUserInfo(context.userPrincipalName);
        });
    });
}

function getToken() {
    return new Promise((resolve, reject) => {
        microsoftTeams.authentication.authenticate({
            url: window.location.origin + "/Auth/Start.html",
            width: 600,
            height: 535,
            successCallback: result => {
               
                resolve(result);
            },
            failureCallback: reason => {
                
                reject(reason);
            }
        });
    });
}

function getClientSideToken() {
    return new Promise((resolve, reject) => {
        microsoftTeams.authentication.getAuthToken({
            successCallback: (result) => {               
                resolve(result);
                idToken = result;
                $('#divHomeDetails').show();
                //getDivisions(result);
                //getMyProfile(result);
                //getFilteredUsers(result);

               
            },
            failureCallback: function (error) {                
                reject("Error getting token: " + error);
            }
        });

    });
}

function getServerSideToken(clientSideToken) {
    return new Promise((resolve, reject) => {
        microsoftTeams.getContext((context) => {
            var scopes = ["https://graph.microsoft.com/User.Read"];
            fetch(window.location.origin +'/api/v1.0/GetUserAccessToken', {
                method: 'get',
                headers: {
                    "Content-Type": "application/text",
                    "Authorization": "Bearer " + clientSideToken
                },
                cache: 'default'
            })
                .then((response) => {
                    if (response.ok) {
                        return response.text();
                    } else {
                        reject(response.error);
                    }
                })
                .then((responseJson) => {
                    if (IsValidJSONString(responseJson)) {
                        if (JSON.parse(responseJson).error)
                            reject(JSON.parse(responseJson).error);
                    } else if (responseJson) {
                        accessToken = responseJson;
                        getUserInfo(context.userPrincipalName);
                    }
                });
        });
    });
}

function IsValidJSONString(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}

function getUserInfo(principalName) {
    if (principalName) {
        let graphUrl = "https://graph.microsoft.com/v1.0/users/" + principalName;
        $.ajax({
            url: graphUrl,
            type: "GET",
            beforeSend: function (request) {
                request.setRequestHeader("Authorization", `Bearer ${accessToken}`);
            },
            success: function (profile) {
                let profileDiv = $("#divGraphProfile");
                profileDiv.empty();
                for (let key in profile) {
                    if ((key[0] !== "@") && profile[key]) {
                        $("<div>")
                            .append($("<b>").text(key + ": "))
                            .append($("<span>").text(profile[key]))
                            .appendTo(profileDiv);
                    }
                }
                $("#divGraphProfile").show();
            },
            error: function () {
                console.log("Failed");
            },
            complete: function (data) {
            }
        });
    }
}

function getDivisions(clientSideToken) {
    if (clientSideToken) {
        let apiUrl = window.location.origin + '/api/v1.0/GetDivisions';
        $.ajax({
            url: apiUrl,
            type: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + clientSideToken
            },
            success: function (divisions) {
                console.log(divisions)
            },
            error: function () {
                console.log("Failed");
            },
            complete: function (data) {
            }
        });
    }
}

function getMyProfile(clientSideToken) {
    if (clientSideToken) {
        let apiUrl = window.location.origin + '/api/v1.0/user/GetMyProfile';
        $.ajax({
            url: apiUrl,
            type: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + clientSideToken
            },
            success: function (divisions) {
                console.log(divisions)
            },
            error: function () {
                console.log("Failed");
            },
            complete: function (data) {
            }
        });
    }
}

function getFilteredUsers(clientSideToken) {
    if (clientSideToken) {
        let apiUrl = window.location.origin + '/api/v1.0/user/GetFilteredUsers';
        $.ajax({
            url: apiUrl,
            type: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + clientSideToken
            },
            success: function (divisions) {
                console.log(divisions)
            },
            error: function () {
                console.log("Failed");
            },
            complete: function (data) {
            }
        });
    }
}

function getEvent() {
    var eventId = $('#txtEventId').val();
    microsoftTeams.getContext((context) => {
        //getEvent(result, context.userObjectId, "AAMkADNkNGZlMzZmLTBjNGItNDBlNy04ZWM0LWRhMDAzY2RjYTQ4YwBGAAAAAADtrlU2hW9PRrkB3sUbv1KtBwDi9HFE_o8mTqVrgifo9MMDAAAAAAENAADi9HFE_o8mTqVrgifo9MMDAABg2fawAAA=");
        if (idToken) {
            let apiUrl = window.location.origin + '/api/v1.0/event/GetEvent?eventId=' + eventId + '&userAdId=' + context.userObjectId;
            $.ajax({
                url: apiUrl,
                type: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + idToken
                },
                success: function (divisions) {
                    console.log(divisions)
                },
                error: function () {
                    console.log("Failed");
                },
                complete: function (data) {
                }
            });
        }
        console.log(context);
    });
    
}
function createEvent1() {
   
    microsoftTeams.getContext((context) => {
        //getEvent(result, context.userObjectId, "AAMkADNkNGZlMzZmLTBjNGItNDBlNy04ZWM0LWRhMDAzY2RjYTQ4YwBGAAAAAADtrlU2hW9PRrkB3sUbv1KtBwDi9HFE_o8mTqVrgifo9MMDAAAAAAENAADi9HFE_o8mTqVrgifo9MMDAABg2fawAAA=");
        if (idToken) {

            var eventData = {
                "organiserName": "Sammy Admin",
                "organiserADID": context.userObjectId,
                "organiserEmail": context.userPrincipalName,
                "subject": "Test online meeting",
                "body": "<html><head><meta http-equiv=\"Content-Type\" content=\"text/html; charset=utf-8\"></head><body>Hey Admin Sammy Dev,!<br><br>Your “Coffee with Genome” has been scheduled in this slot, as per your preferences.<br><ul><li>Enjoy your time learning and building the Future of You</li><li>Further instructions are in the calendar appointment</li><li>Discover Genome 2022 <a href=\"https://sway.office.com/eQ8nuA5WEvGXGFi8?ref=Link\">here</a></li></ul>When the time comes, go to <a href=\"https://genome.genpact.com/my-profile\">My Plan</a> on your PC or mobile, and choose the skill that you want to build today. Remember that My Plan works best if<a href=\"https://genome.genpact.com/my-profile\">My Profile</a> is up to date. Enjoy! Click<a href=\"https://genome.genpact.com/my-plan\">here</a> to access My Plan.<br><br>If you don’t remember how Genome works,<ul><li>Go to <a href=\"https://genome.genpact.com/\">https://genome.genpact.com/</a> or</li><li>Go to the Genome FAQ <a href=\"https://genomedev.blob.core.windows.net/faq/FAQs.pdf\">here</a> or</li><li>Get in touch with your L&amp;D partner</li></ul>You can change your preferences from <a href=\"https://teams.microsoft.com/l/entity/793CCB46-D366-4B4A-A926-7BDB670797D7/preference_cwg?label=Preferences\">here</a>.<br><br><b>If you have any questions or something doesn't look right, check out the <a href=\"https://genomedev.blob.core.windows.net/faq/FAQs.pdf\">FAQs</a></b> or ask for <a href=\"\">support</a>.<br><br>We welcome your <a href=\"\">feedback!</a></body></html>",
                "startDate": "2022-02-24T12:00:00.000",
                "endDate": "2022-02-24T13:00:00.000",
                "RepeatOption": {
                    "repeatType": "Weekly",
                    "interval": 1,
                    "dayOfWeeks": ["monday", "friday"],
                    "startDate": "2022-02-24T00:00:00.000",
                    "noOfOccurence": 6,
                    "repeatRangeType": "Numbered",
                },
                "isAllDayEvent": false,
                "timeZone": "India Standard Time",
                "reminderMinutesBeforeStart": 15,
                "meetingParticipants": [
                    {
                        "participantId":0,
                        "participantTypeEnum": "Participant",
                        "participantName": "Sammy Admin",
                        "participantADID": context.userObjectId,
                        "participantEmail": context.userPrincipalName,
                        "participantType": "Participant",
                        "active": true
                    },
                    {
                        "participantId": 0,
                        "participantTypeEnum": "Participant",
                        "participantName": "SP Development",
                        "participantADID": "06d935b2-18f1-4ccb-a53a-7589f34ea6dc",
                        "participantEmail": "spodev@sammydev.onmicrosoft.com",
                        "participantType": "Participant",
                        "active": true
                    }
                ]
            }
            let apiUrl = window.location.origin + '/api/v1.0/event/CreateMeeting';
            $.ajax({
                url: apiUrl,
                type: "POST",
                contentType: "application/json; charset=utf-8",
                data: JSON.stringify(eventData),
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + idToken
                },
                success: function (divisions) {
                    console.log(divisions)
                },
                error: function () {
                    console.log("Failed");
                },
                complete: function (data) {
                }
            });
        }
        console.log(context);
    });

}