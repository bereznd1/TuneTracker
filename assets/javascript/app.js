//Hides the form from appearing on the page upon first load
$('#formy').hide();
$('#successform').hide();
$('#emptyform').hide();
$('#badlink').hide();
$('#bademail').hide();

//Velocity JS for animations
$(".jumbotron").velocity("fadeIn", { duration: 1500 })
$("#map").velocity("fadeIn", { duration: 2500 })
$("#upload").velocity({ translateY: 20 }, {
    duration: 1950,
    easing: [300, 8]
});
$("body").velocity({
    backgroundColor: "#00004d"
}, {
        duration: 2500,
        easing: "easeInQuad"
    });

//Code for what happens when you hit the Upload button - form pops up
$('#upload').on('click', function (event) {
    event.preventDefault();
    var slideDir = $('#formy').is(':visible') ? 'slideUp' : 'slideDown';
    $('#formy').velocity(slideDir);
    $('#upload').hide();
    $('#map').hide();
});

//Code for what happens when you hit the Cancel button once you're already typing inside the form
$('#cancel-btn').on('click', function (event) {
    event.preventDefault();
    $('#formy').hide();
    $('#upload').show();
    $('#map').show();
    // Clears all of the text-boxes
    $("#user-name").val("");
    $("#user-contact").val("");
    $("#user-file").val("");
    $("#user-description").val("");

});





// Initializes Firebase
var config = {
    apiKey: "AIzaSyC9fF0OACaRvyDOUZcLG5bX_LEUgmK6yGo",
    authDomain: "tunetracker-2260d.firebaseapp.com",
    databaseURL: "https://tunetracker-2260d.firebaseio.com",
    projectId: "tunetracker-2260d",
    storageBucket: "tunetracker-2260d.appspot.com",
    messagingSenderId: "474472193819"
};

firebase.initializeApp(config);

var database = firebase.database();





//Generates the map
mapboxgl.accessToken = 'pk.eyJ1Ijoia2hhbGlsb3dlbnM5MiIsImEiOiJjamV2bDR0aXQ3NDdrMzlvNzFjbGw1MHI4In0.Rj8983ke7W9GO3QnOLJg8A';
var map = new mapboxgl.Map({
    container: 'map', // container id
    style: 'mapbox://styles/mapbox/streets-v9',
    center: [-75.1252, 39.90006],//starting position
    zoom: 9 // starting zoom
}).addControl(new mapboxgl.GeolocateControl({
    positionOptions: {
        enableHighAccuracy: true
    },
    trackUserLocation: true
}));



var player;
var yts = [];
function onYouTubeIframeAPIReady() {

    //Sets up what happens when the map loads (adding map markers & popups)
    map.on('load', function () {

        //Empty array where popup info will go
        var popUps = [];

        //Firebase watcher, gets run every time a new child is added
        database.ref().on("child_added", function (childSnapshot, prevChildKey) {


            //Firebase watcher, is run once to be able to use the value of the response
            database.ref().once('value', function (snapshot) {

                console.log("CHILD SNAPSHOT", childSnapshot);

                //Runs code for each child within the overall snapshot
                snapshot.forEach(function (childSnapshot, index) {

                    if (!childSnapshot.val().coords) {
                        return;
                    }
                    console.log("child snapshot", childSnapshot.val());




                    //Gets the relavant info for the popups from firebase
                    var name = childSnapshot.val().name;
                    var contact = childSnapshot.val().contact;
                    var desc = childSnapshot.val().desc;
                    var coords = childSnapshot.val().coords;
                    coords = coords.split(',');

                    var fileURL = childSnapshot.val().fileURL;
                    var userVideoID = getId(fileURL);



                    console.log("key", childSnapshot.key);



                    //JSON code for Mapbox popups
                    var formattedData = {
                        "type": "Feature",
                        "properties": {
                            "description": "<table style='line-height: 1.8'><tr><td><p style='font-size:16px; font-weight:bold'>" + name + "</p></td></tr><tr><td><a href='mailto:" + contact + "'>" + contact + "</a></td></tr><tr><td><em>" + desc + "</em></td></tr><tr><td><div id='ytPlayer" + childSnapshot.key + "'></div></td></tr></table>",
                            "icon": "theatre"
                        },
                        "geometry": {
                            "type": "Point",
                            "coordinates": coords
                        }
                    };

                    //Adds the code for each popup to the array
                    popUps.push(formattedData);


                    yts.push({
                        key: 'ytPlayer' + childSnapshot.key,
                        videoId: userVideoID
                    });

                });

                console.log(popUps);

                //Adds a map layer which uses the popUps array we filled up previously
                map.addLayer({
                    "id": "places",
                    "type": "symbol",
                    "source": {
                        "type": "geojson",
                        "data": {
                            "type": "FeatureCollection",
                            "features": popUps
                        }
                    },
                    "layout": {
                        "icon-image": "{icon}-15",
                        "icon-allow-overlap": true
                    }
                });
            });

        });


        // When a click event occurs on a feature in the places layer, open a popup at the
        // location of the feature, with description HTML from its properties.
        map.on('click', 'places', function (e) {
            var coordinates = e.features[0].geometry.coordinates.slice();
            var description = e.features[0].properties.description;


            // Ensures that if the map is zoomed out such that multiple
            // copies of the feature are visible, the popup appears
            // over the copy being pointed to.
            while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
            }
            new mapboxgl.Popup()
                .setLngLat(coordinates)
                .setHTML(description)
                .addTo(map);

            yts.forEach(function (element) {
                player = new YT.Player((element.key), {
                    height: '100%',
                    width: '100%',
                    videoId: element.videoId,
                });
            });

        });

        // Changes the cursor to a pointer when the mouse is over the places layer.
        map.on('mouseenter', 'places', function () {
            map.getCanvas().style.cursor = 'pointer';
        });
        // Changes it back to a pointer when it leaves.
        map.on('mouseleave', 'places', function () {
            map.getCanvas().style.cursor = '';
        });


    });





}


function getId(url) {
    var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;

    var match = url.match(regExp);

    if (match && match[2].length == 11) {
        return match[2];
    } else {
        return "Error: Can't get Video ID";
    }

};







// Sets up what happens when the submit button is clicked on the form
$("#submit").on("click", function (event) {

    event.preventDefault();


    //Takes in the values that were entered in the form
    var name = $("#user-name").val().trim();
    var contact = $("#user-contact").val().trim();
    var fileURL = $("#user-file").val().trim();
    var userVideoID = getId(fileURL);
    var desc = $("#user-description").val().trim();





    function validateYouTubeUrl(url) {
        if (url != undefined || url != '') {
            var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|\?v=|\?vi=)([^#\&\?]*).*/;
            var match = url.match(regExp);
            if (match && match[2].length == 11) {
                return true;
            }
            else {
                return false;
            }
        }
    }



    function validateEmail(email) {
        if (email != undefined || email != '') {
            var regExp2 = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
            var match2 = email.match(regExp2);
            if (match2 && match2[2].length == 11) {
                return true;
            }
            else {
                return false;
            }
        }
    }





    if (name === "" || contact === "" || fileURL === "" || desc === "") {
        $('#emptyform').show();
        setTimeout(function () { $("#emptyform").hide(); }, 4000);
    }

    else if (!validateYouTubeUrl(fileURL)) {
        $('#badlink').show();
        setTimeout(function () { $("#badlink").hide(); }, 4000);

    }


    // else if (!validateEmail(contact)) {

    //         $('#bademail').show();
    //         setTimeout(function () { $("#bademail").hide(); }, 4000);

    // }



    else {

        var x = document.getElementById("coords");


        //Runs a function to acquire the user's coordinates when they are submitting a new post
        function getLocation(callback) {
            if (navigator.geolocation) {
                var lat_lng = navigator.geolocation.getCurrentPosition(function (position) {
                    var lng = position.coords.longitude;
                    var lat = position.coords.latitude;
                    callback(lng + ", " + lat);
                });

            }


            else {
                x.innerHTML = "Geolocation is not supported by this browser.";
            }
        }

        //Runs the getLocation function to push the values from the form to Firebase, as an object
        getLocation(function (lat_lng) {

            database.ref().push({
                name: name,
                contact: contact,
                fileURL: fileURL,
                desc: desc,
                coords: lat_lng

            });

        });


        // Clears all of the text-boxes
        $("#user-name").val("");
        $("#user-contact").val("");
        $("#user-file").val("");
        $("#user-description").val("");

        //Hides the form & shows the upload button again
        $('#formy').hide();
        $('#map').show();
        $('#successform').show();
        setTimeout(function () { $("#successform").hide(); }, 3000);
        setTimeout(function () { $("#upload").show(); }, 3000);



    }

});



