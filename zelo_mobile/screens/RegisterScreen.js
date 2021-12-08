// import {StatusBar} from 'expo-status-bar';
import {Formik} from 'formik';
import React from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {Button, Icon} from 'react-native-elements';
import {TouchableOpacity} from 'react-native-gesture-handler';
import LinearGradient from 'react-native-linear-gradient';
import Spinner from 'react-native-loading-spinner-overlay';
import {useDispatch, useSelector} from 'react-redux';
import loginApi from '../api/loginApi';
import InputField from '../components/InputField';
import {setLoading} from '../redux/globalSlice';
import globalStyles, {MAIN_COLOR} from '../styles';
import {registerValid} from '../utils/validator';

const RegisterScreen = ({navigation}) => {
  const {isLoading} = useSelector(state => state.global);
  const dispatch = useDispatch();

  // const handleConfirmAccount = async (username, otp) => {
  // 	const response = await loginApi.confirmAccount({ username, otp });
  // 	return response;
  // };

  const handleRegister = async account => {
    const {username} = account;
    dispatch(setLoading(true));

    try {
      await loginApi.register(account);

      navigation.navigate('Xác nhận tài khoản', {
        account,
        // handleConfirmAccount: null,
      });
    } catch (error) {
      console.error(error.response);
      const account = await loginApi.fetchUser(username);
      navigation.navigate('Xác nhận tài khoản', {
        // handleConfirmAccount,
        account,
      });
    }

    dispatch(setLoading(false));
  };

  return (
    <KeyboardAvoidingView style={styles.container}>
      <Text style={styles.zelo}>Zelo</Text>
      <View style={styles.inputContainer}>
        <Spinner
          visible={isLoading}
          textContent={'Loading...'}
          textStyle={globalStyles.spinnerTextStyle}
        />
        <Formik
          initialValues={registerValid.initial}
          validationSchema={registerValid.validationSchema}
          onSubmit={values => handleRegister(values)}>
          {formikProps => {
            const {values, errors, handleChange, handleSubmit} = formikProps;
            return (
              <>
                <InputField
                  placeholder="Tên đầy đủ"
                  autoFocus
                  onChangeText={handleChange('name')}
                  value={values.name}
                  error={errors.name}
                  containerStyle={styles.input}
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
                  placeholder="Email/số điện thoại"
                  onChangeText={handleChange('username')}
                  value={values.username}
                  error={errors.username}
                  containerStyle={styles.input}
                  leftIcon={
                    <Icon
                      name="mail"
                      type="antdesign"
                      size={24}
                      color="black"
                    />
                  }
                />

                <InputField
                  style={styles.input}
                  placeholder="Mật khẩu"
                  secureTextEntry={true}
                  onChangeText={handleChange('password')}
                  value={values.password}
                  error={errors.password}
                  containerStyle={styles.input}
                  leftIcon={
                    <Icon
                      name="lock"
                      type="antdesign"
                      size={24}
                      color="black"
                    />
                  }
                />

                <Button
                  title="Đăng ký"
                  style={styles.button}
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
          <Text style={{fontSize: 15}}>Đã có tài khoản? </Text>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={[styles.forgotPasswordText, {color: MAIN_COLOR}]}>
              Đăng nhập
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    // backgroundColor: "#0068FF",
    paddingTop: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  zelo: {
    textAlign: 'center',
    color: '#0068FF',
    fontWeight: 'bold',
    fontSize: 80,
    // marginTop: 80,
    // marginBottom: 30,
  },

  inputContainer: {
    width: 300,
  },

  input: {
    paddingHorizontal: 0,
  },

  button: {
    marginTop: 20,
    marginHorizontal: 10,
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
