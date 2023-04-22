import { StatusBar } from 'expo-status-bar';

import React, { useState, useEffect, useRef } from 'react';

import { StyleSheet, Text, View } from 'react-native';
import MapView from 'react-native-maps'
import { PROVIDER_GOOGLE, Marker, Animated, AnimatedRegion } from 'react-native-maps'
import * as Location from 'expo-location';


export default function App() {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const mapRef = useRef(null);

  // Set the update rate in ms for user location
  const updateRate = 200; // ms

  /*
  useEffect(() => {
      const interval = setInterval(async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setErrorMsg('Permission to access location was denied');
          return;
        }

        let locationData = await Location.getCurrentPositionAsync({});

        setLocation({
          latitude: locationData.coords.latitude,
          longitude: locationData.coords.longitude,
          latitudeDelta: 0.0922/8,
          longitudeDelta: 0.0421/8,
        })

        // center map at user location
        //mapRef.current.animateToRegion(location, 1000);

    }, updateRate);
    return () => clearInterval(interval);
  }, []);
  */

  let text = 'Waiting..';
  if (errorMsg) {
    text = errorMsg;
  } else if (location) {
    text = JSON.stringify(location);
    console.log(text);
  }



  const UserMarker = () => {
    if (location != null) {
      return (
        <Marker 
          title="My Location"
          coordinate={{latitude: location.latitude, longitude: location.longitude}}
        />
      )
    }
  }

  const updateCamera = (e) => {
    console.log("Updating region");
    if (mapRef != null) {
      const userLat = e.nativeEvent.coordinate.latitude;
      const userLong = e.nativeEvent.coordinate.longitude;
      mapRef.current.getCamera().then((camera) => {
        console.log(camera);
        
        // Animate camera to user location
        mapRef.current.animateCamera({
          center: {
            latitude: userLat,
            longitude: userLong,
          }
        }, 1000);
  
      }).catch(() => {
        console.log("Error getting camera");
      });
    }
  }

  return (
    <View style={styles.container}>
      <MapView 
      ref={mapRef}
      provider={PROVIDER_GOOGLE} 
      initialRegion={location} 
      style={styles.map} 
      showsUserLocation={true}
      onUserLocationChange={(e) => updateCamera(e)}
      >
        {/*<UserMarker />*/}
      </MapView>
      
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  map: {
    width: '100%',
    height: '100%',
  },
});
