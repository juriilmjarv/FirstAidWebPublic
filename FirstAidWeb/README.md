First aid system lets the administrators to register new emergencies which will send the notifications to the cloesest available first aiders.

This is one of the two developed apps. To test the full system download the mobile app source code from here: 

## Installing node modules

In the project directory run:

### `npm install`

In the '/functions' directory run:

### `npm install`

This will install packages required for Cloud functions.

## Running the app

To run the project:

### `npm start`

## API keys and config files

Create an empty firebase project and enable Realtime database. Insert your obtained credentials into: '/FirstAidWebPublic/src/firebase.config.js'.

Create Google API key containing Maps JavaScript API, Places API, Geocoding API and Geolocations API. Insert the key into '/FirstAidWebPublic/src/Aiders.js' on line 47. Insert the same key into '/FirstAidWebPublic/public/index.html' on line 24.

