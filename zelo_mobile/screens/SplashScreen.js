// import {StatusBar} from 'expo-status-bar';
import React from 'react';
import {ImageBackground, StyleSheet, StatusBar} from 'react-native';
import {MAIN_COLOR} from '../styles';

const SplashScreen = props => {
  return (
    <ImageBackground
      style={styles.background}
      source={require('../assets/splash1.png')}
      resizeMode="cover">
      <StatusBar backgroundColor={MAIN_COLOR} barStyle="light-content" />
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0068FF',
    resizeMode: 'cover',
  },
});

export default SplashScreen;
