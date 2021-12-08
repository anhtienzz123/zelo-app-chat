/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import 'react-native-gesture-handler';
import {Colors, Header} from 'react-native/Libraries/NewAppScreen';
import {Provider, useDispatch, useSelector} from 'react-redux';
import {MainStackNavigator} from './navigations';
import LoginStackNavigator from './navigations/LoginStackNavigator';
import {setCurrentUserId, setLogin} from './redux/globalSlice';
import store from './redux/store';
import SplashScreen from './screens/SplashScreen';
import {init} from './utils/socketClient';

const App = () => {
  return (
    <Provider store={store}>
      <AppScreen />
    </Provider>
  );
};

const AppScreen = () => {
  const {isLogin} = useSelector(state => state.global);
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);

  const handleCheckLogin = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        dispatch(setLogin(true));
        const currentUserId = await AsyncStorage.getItem('userId');
        dispatch(setCurrentUserId(currentUserId));
        const keyboardHeightStr = await AsyncStorage.getItem('keyboardHeight');
        dispatch(setKeyboardHeight(keyboardHeightStr));
      }
    } catch (e) {
      // error reading value
    }
    setIsLoading(false);
  };

  useEffect(() => {
    handleCheckLogin();
  }, []);

  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const Temp = () => (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <Header />
        <View
          style={{
            backgroundColor: isDarkMode ? Colors.black : Colors.white,
          }}>
          <Text style={styles.highlight}>App.js</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );

  return isLoading ? (
    <SplashScreen />
  ) : isLogin ? (
    <MainStackNavigator />
  ) : (
    <LoginStackNavigator />
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
