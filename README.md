# "Tune Tracker" Map-Based App 

![Tune Tracker App](assets/images/TuneTracker_Screenshot.png)

 [View Live!](https://bereznd1.github.io/TuneTracker/) 

   
## General Description:

The purpose behind this app is to bring local musicians together based on their locations, so that they can contact one another and collaborate.

The app allows artists to submit their name, email address, a YouTube link to their work, and a brief description of their music, which is then stored in a **Firebase** database. Their browser picks up on their current location & creates a marker on a map (which is loaded through the **Mapbox** API onto the page) at the exact coordinates from which the artist submitted his/her music. When this marker is clicked, a pop-up appears with the artist's information & their YouTube video.

Other users who load up the app can navigate to their own locations using the Geolocation feature, or scroll around on the map wherever else they may please, and view the music that has been submitted. If they find somebody whose work impresses them, they can click that person's email address & get in touch in order to collaborate. 

## Motivation:

What motivated this project was knowing how difficult it can sometimes be, as a musician, to find other musicians in your area to collaborate on songs with. **Tune Tracker** aims to simplify this process providing a visual representation of artists that are available in a particular location, and also previews their work.


## Technologies Used:

* **Mapbox API** - the main API that is called to load up the map & place markers/popups on it 
* **YouTube iFrame API** - the API that is used to embed users' submitted YouTube clips as iFrames within each popup
* **Firebase** - the database service that is used to store users' submissions
* **Velocity JS** - JavaScript library that is used to create slick animations within the UI
* **jQuery** - JavaScript library that is used to simplify DOM manipulation
* **Bootstrap** - CSS framework that is used to make page layout/design easier
* **HTML/CSS** - used to create the basic design of the app

## Team Roles: 

**Dennis B.:**

* Handled majority of **Firebase** implementation 
* Lead development of **Mapbox API** features (creation of pop-ups on the map with users' info, based on their locations)
* Assisted with **Front-End Design**

**Matt:**

* Handled majority of **Front-End Design**
* Integrated **VelocityJS** library to create slick animations

**Dennis R.:**

* Handled **YouTube iFrame API** integration to allow user-submitted YouTube URLs to be converted into embed code
* Assisted with **Firebase** implementation

**Khalil:**

* Assisted with **Mapbox API** implementation
* Assisted with **Firebase** implementation

## Challenges:

* Getting Firebase to save the geo-coordinates of users' submissions, and then properly integrating those saved coordinates with the Mapbox API so that map markers would be created at the correct points, and so that clicking each marker would cause an informational pop-up to appear. Resolving this challenge involved a lot of **jQuery** trial and error, as well as an understanding of **scope**. Proper scoping proved crucial in getting the Mapbox API to behave as desired.

* Figuring out how to convert a simple YouTube URL into the embed code necessary to actually create an iFrame in each popup with the playable YouTube video. 

## Future Improvements:

* Integrate the app with other music APIs (i.e. SoundCloud & Spotify) to give users more options as far as sharing their music.
* Integrate the app with social networking services such as Facebook to improve users' ability to contact one another.
* Add tags to each submission based on genre.