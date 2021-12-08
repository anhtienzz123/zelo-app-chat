import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import ConfirmAccountScreen from '../screens/ConfirmAccountScreen';
import ConfirmOTPScreen from '../screens/ConfirmOTPScreen';
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import {globalScreenOptions} from '../styles';

const Stack = createStackNavigator();

const LoginStackNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={globalScreenOptions}>
        <Stack.Screen name="Đăng nhập" component={LoginScreen} />
        <Stack.Screen name="Đăng ký" component={RegisterScreen} />
        <Stack.Screen name="Quên mật khẩu" component={ForgotPasswordScreen} />
        <Stack.Screen
          name="Xác nhận tài khoản"
          component={ConfirmAccountScreen}
        />
        <Stack.Screen name="Xác nhận" component={ConfirmOTPScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default LoginStackNavigator;
