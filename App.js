import { StatusBar } from 'expo-status-bar';

import React, { useState, useEffect } from 'react';

import { StyleSheet, Text, View } from 'react-native';
import MapView from 'react-native-maps'
import { PROVIDER_GOOGLE, Marker } from 'react-native-maps'
import * as Location from 'expo-location';


export default function App() {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    (async () => {
      
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let locationData = await Location.getCurrentPositionAsync({});

      setLocation({
        latitude: locationData.coords.latitude,
        longitude: locationData.coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      })
    })();
  }, []);

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

  return (
    <View style={styles.container}>
      <MapView provider={PROVIDER_GOOGLE} 
      initialRegion={location} 
      style={styles.map} 
      >
        <UserMarker />
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
