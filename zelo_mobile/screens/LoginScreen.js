import AsyncStorage from '@react-native-async-storage/async-storage';
import LinearGradient from 'react-native-linear-gradient';
import {Formik} from 'formik';
import React, {useState} from 'react';
import {
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  View,
  StatusBar,
  Platform,
} from 'react-native';
import {Button, Icon} from 'react-native-elements';
import Spinner from 'react-native-loading-spinner-overlay';
import {useDispatch, useSelector} from 'react-redux';
import {loginApi, meApi} from '../api';
import InputField from '../components/InputField';
import {useKeyboardHeight} from '../hooks';
import {setCurrentUserId, setLoading, setLogin} from '../redux/globalSlice';
import globalStyles, {MAIN_COLOR} from '../styles';
import {loginValid} from '../utils/validator';
import {TouchableOpacity} from 'react-native-gesture-handler';

const LoginScreen = ({navigation}) => {
  const {isLoading} = useSelector(state => state.global);
  const [errorMessage, setErrorMessage] = useState('');
  const dispatch = useDispatch();
  const keyboardHeight = useKeyboardHeight();

  const handleLogin = async acount => {
    errorMessage !== '' && setErrorMessage('');
    dispatch(setLoading(true));

    try {
      const response = await loginApi.login(acount);

      await AsyncStorage.setItem('token', response.token);
      await AsyncStorage.setItem('refreshToken', response.refreshToken);
      const userProfile = await meApi.fetchProfile();
      await AsyncStorage.setItem('userId', userProfile._id);
      dispatch(setCurrentUserId(userProfile._id));
      dispatch(setLogin(true));
    } catch (error) {
      setErrorMessage('Tài khoản hay mật khẩu không chính xác');
    }

    // if (response.data) {
    //   setErrorMessage('Tài khoản hay mật khẩu không chính xác');
    // } else {
    //   await AsyncStorage.setItem('token', response.token);
    //   await AsyncStorage.setItem('refreshToken', response.refreshToken);
    //   const userProfile = await meApi.fetchProfile();
    //   await AsyncStorage.setItem('userId', userProfile._id);
    //   dispatch(setLogin(true));
    // }

    dispatch(setLoading(false));
  };

  return (
    <KeyboardAvoidingView style={styles.container}>
      <LinearGradient
        // Background Linear Gradient
        colors={['#257afe', '#00bafa']}
        style={{height: Platform.OS === 'ios' ? 20 : StatusBar.currentHeight}}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 0}}>
        <StatusBar
          translucent={true}
          backgroundColor={'transparent'}
          barStyle="light-content"
        />
      </LinearGradient>

      <Text style={styles.zelo}>Zelo</Text>
      <View style={styles.inputContainer}>
        <Spinner
          visible={isLoading}
          textContent={'Loading...'}
          textStyle={globalStyles.spinnerTextStyle}
        />
        <Formik
          initialValues={loginValid.initial}
          validationSchema={loginValid.validationSchema}
          onSubmit={values => handleLogin(values)}>
          {formikProps => {
            const {values, errors, handleChange, handleSubmit} = formikProps;
            return (
              <>
                <InputField
                  containerStyle={styles.input}
                  placeholder="Email/số điện thoại"
                  autoFocus
                  onChangeText={handleChange('username')}
                  value={values.username}
                  error={errors.username}
                  leftIcon={
                    <Icon
                      name="user"
                      type="antdesign"
                      size={24}
                      color="black"
                    />
                  }
                />

                <InputField
                  containerStyle={styles.input}
                  placeholder="Mật khẩu"
                  secureTextEntry={true}
                  onChangeText={handleChange('password')}
                  value={values.password}
                  error={errors.password}
                  leftIcon={
                    <Icon
                      name="lock"
                      type="antdesign"
                      size={24}
                      color="black"
                    />
                  }
                />
                {errorMessage.length > 0 && (
                  <Text style={{color: 'red'}}>{errorMessage}</Text>
                )}

                <View style={styles.forgotPasswordContainer}>
                  <TouchableOpacity
                    onPress={() => navigation.navigate('Quên mật khẩu')}>
                    <Text style={styles.forgotPasswordText}>
                      Quên mật khẩu?
                    </Text>
                  </TouchableOpacity>
                </View>

                <Button
                  title="Đăng nhập"
                  containerStyle={styles.button}
                  onPress={handleSubmit}
                  buttonStyle={{
                    backgroundColor: MAIN_COLOR,
                  }}
                />
              </>
            );
          }}
        </Formik>

        <View style={styles.registerContainer}>
          <Text style={{fontSize: 15}}>Không có tài khoản? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Đăng ký')}>
            <Text style={[styles.forgotPasswordText, {color: MAIN_COLOR}]}>
              Đăng ký
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    // backgroundColor: "#0068FF",
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 100,
  },
  zelo: {
    textAlign: 'center',
    color: '#0068FF',
    fontWeight: 'bold',
    fontSize: 80,
    // marginTop: 80,
    // marginBottom: 30,
    // backgroundColor: 'cyan',
  },

  inputContainer: {
    width: 300,
  },

  input: {
    // backgroundColor: 'red',
    paddingHorizontal: 0,
  },

  button: {
    marginTop: 20,
  },

  forgotPasswordContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',

    // backgroundColor: 'red',
  },
  forgotPasswordText: {
    fontWeight: 'bold',
    fontSize: 15,
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
});
