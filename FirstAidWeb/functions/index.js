const functions = require('firebase-functions');
var fetch = require('node-fetch');
const admin = require('firebase-admin');
const geolib = require('geolib');
const { Expo } = require('expo-server-sdk');
//admin.initializeApp(functions.config().firebase);
const expo = new Expo();
const appOptions = JSON.parse(process.env.FIREBASE_CONFIG);
const app = admin.initializeApp(appOptions, 'app');

exports.sendPush = functions.database.ref('emergency/{id}').onCreate((snapshot, context) => {
    
    const original = snapshot.val();
    var emergencyLoc = snapshot.val().latlon
    const id = context.params.id;
    Object.assign(original, {id: id});
    console.log(original);
    console.log("ID: " + context.params.id);
    //const appOptions = JSON.parse(process.env.FIREBASE_CONFIG);
    appOptions.databaseAuthVariableOverride = context.auth;
    //const app = admin.initializeApp(appOptions, 'app');
    var messages = [];
    var aiderLoc = [];

      //return the main promise 
    return app.database().ref('/users').once('value').then(function (snap) {
      snap.forEach(function (childSnapshot) {
        if(childSnapshot.val().online === true && childSnapshot.val().isBusy === false){
          aiderLoc.push({
            expoToken: childSnapshot.val().expoPushToken,
            lat: childSnapshot.val().location.coords.latitude,
            lng: childSnapshot.val().location.coords.longitude,
            id: childSnapshot.key
          })
        }
      });
      
      //Find closest
      var distFromCurrent = function(coord) {
        return {coord: coord, dist: geolib.getDistance(emergencyLoc, coord)};
      }

      var closest = aiderLoc.map(distFromCurrent).sort(function(a,b)  { return a.dist - b.dist })[0];

      console.log("Closest: " + closest.coord.lat + ", " + closest.coord.lng + ' , ' + closest.dist + ' , ' + closest.coord.expoToken + ' , ' + closest.coord.id);

      app.database().ref('emergency/' + id).update({
        assignedTo: closest.coord.id
      })

      messages.push({
        "to": closest.coord.expoToken,
        "sound": "default",
        "body": "new emergency at " + JSON.stringify(original.location),
        "data": original
      });
      //firebase.database then() respved a single promise that resolves
      //once all the messages have been resolved 
      return Promise.all(messages)


    }).then(msg => {
      console.log("Closest: " + JSON.stringify(msg));
      fetch('https://exp.host/--/api/v2/push/send', {

        method: "POST",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify(msg)
      })
    })
    
});



exports.secondClosest = functions.https.onCall((data, context) => {
  appOptions.databaseAuthVariableOverride = context.auth;
  let arr = [];
  let aiderLoc = [];
  let messages = [];
  return app.database().ref('emergency').once('value', (snapshot) => {
    snapshot.forEach(function (childSnapshot) {
      if(childSnapshot.key === data.id){
        
        arr.push({
          timestamp: childSnapshot.val().timestamp,
          location: childSnapshot.val().location,
          condition: childSnapshot.val().condition,
          latlon: { lat:childSnapshot.val().latlon.lat, lon: childSnapshot.val().latlon.lon},
          age: childSnapshot.val().age,
          allocated: childSnapshot.val().allocated,
          ambulanceComing: childSnapshot.val().ambulanceComing,
          completed: childSnapshot.val().completed,
          gender: childSnapshot.val().gender,
          lifethreataning: childSnapshot.val().lifethreataning,
          locationDescription: childSnapshot.val().locationDescription,
          name: childSnapshot.val().name,
          phone: childSnapshot.val().phone,
          victimName: childSnapshot.val().victimName,
          id: childSnapshot.key
        })
      }
    })
  return Promise.all(arr)

  }).then(result => {
    return app.database().ref('/users').once('value').then(function (snap) {
      snap.forEach(function (child) {
          console.log(child)
          if (!Expo.isExpoPushToken(child.val().expoPushToken)) {
            console.error(`Push token ${child.val().expoPushToken} is not a valid Expo push token`);
          }
          if(child.val().online === true && child.val().isBusy === false){
            aiderLoc.push({
              expoToken: child.val().expoPushToken,
              lat: child.val().location.coords.latitude,
              lng: child.val().location.coords.longitude,
              id: child.key
            })
          }
      });

      var distFromCurrent = function(coord) {
        return {coord: coord, dist: geolib.getDistance(arr[0].latlon, coord)};
      }

      var closest = aiderLoc.map(distFromCurrent).sort(function(a,b)  { return a.dist - b.dist })[1];

      app.database().ref('emergency/' + data.id).update({
        assignedTo: closest.coord.id
      })

      messages.push({
        "to": closest.coord.expoToken,
        "sound": "default",
        "body": "new emergency at " + JSON.stringify(arr[0].location),
        "data": arr[0]
      });


      return Promise.all(messages)
    })
    }).then(msg => {
      let chunks = expo.chunkPushNotifications(msg);
      console.log(chunks);
      for (let chunk in chunks) {
        try {
          expo.sendPushNotificationsAsync(chunks[chunk]);
        } catch (error){
          console.error(error);
        }
      }
    })

});

exports.sendPushAgain = functions.https.onCall((data, context) => {
  appOptions.databaseAuthVariableOverride = context.auth;
  let arr = [];
  let aiderLoc = [];
  let messages = [];
  return app.database().ref('emergency').once('value', (snapshot) => {
    snapshot.forEach(function (childSnapshot) {
      if(childSnapshot.key === data.id){
        
        arr.push({
          timestamp: childSnapshot.val().timestamp,
          location: childSnapshot.val().location,
          condition: childSnapshot.val().condition,
          latlon: { lat:childSnapshot.val().latlon.lat, lon: childSnapshot.val().latlon.lon},
          age: childSnapshot.val().age,
          allocated: childSnapshot.val().allocated,
          ambulanceComing: childSnapshot.val().ambulanceComing,
          completed: childSnapshot.val().completed,
          gender: childSnapshot.val().gender,
          lifethreataning: childSnapshot.val().lifethreataning,
          locationDescription: childSnapshot.val().locationDescription,
          name: childSnapshot.val().name,
          phone: childSnapshot.val().phone,
          victimName: childSnapshot.val().victimName,
          id: childSnapshot.key
        })
      }
    })
  return Promise.all(arr)

  }).then(result => {
    return app.database().ref('/users').once('value').then(function (snap) {
      snap.forEach(function (child) {
          console.log(child)
          if (!Expo.isExpoPushToken(child.val().expoPushToken)) {
            console.error(`Push token ${child.val().expoPushToken} is not a valid Expo push token`);
          }
          if(child.val().online === true && child.val().isBusy === false){
            aiderLoc.push({
              expoToken: child.val().expoPushToken,
              lat: child.val().location.coords.latitude,
              lng: child.val().location.coords.longitude,
              id: child.key
            })
          }
      });

      var distFromCurrent = function(coord) {
        return {coord: coord, dist: geolib.getDistance(arr[0].latlon, coord)};
      }

      var closest = aiderLoc.map(distFromCurrent).sort(function(a,b)  { return a.dist - b.dist })[0];

      app.database().ref('emergency/' + data.id).update({
        assignedTo: closest.coord.id
      })

      messages.push({
        "to": closest.coord.expoToken,
        "sound": "default",
        "body": "new emergency at " + JSON.stringify(arr[0].location),
        "data": arr[0]
      });


      return Promise.all(messages)
    })
    }).then(msg => {
      let chunks = expo.chunkPushNotifications(msg);
      console.log(chunks);
      for (let chunk in chunks) {
        try {
          expo.sendPushNotificationsAsync(chunks[chunk]);
        } catch (error){
          console.error(error);
        }
      }
    })

});