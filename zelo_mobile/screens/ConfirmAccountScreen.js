// import {StatusBar} from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useEffect, useState} from 'react';
import {
  KeyboardAvoidingView,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';
import {Avatar, Button} from 'react-native-elements';
import Spinner from 'react-native-loading-spinner-overlay';
import {useDispatch, useSelector} from 'react-redux';
import {loginApi, meApi} from '../api';
import {setCurrentUserId, setLoading, setLogin} from '../redux/globalSlice';
import globalStyles, {MAIN_COLOR, OVERLAY_AVATAR_COLOR} from '../styles';
import commonFuc from '../utils/commonFuc';

const CELL_COUNT = 6;
const RESEND_OTP_TIME_LIMIT = 60;

const ConfirmAccountScreen = ({navigation, route}) => {
  const {account} = route.params;
  const {isLoading} = useSelector(state => state.global);
  const dispatch = useDispatch();
  let resendOtpTimerInterval;

  const [errorMessage, setErrorMessage] = useState('');
  const [resendButtonDisabledTime, setResendButtonDisabledTime] = useState(
    RESEND_OTP_TIME_LIMIT,
  );

  //declarations for input field
  const [otpValue, setOtpValue] = useState('');
  const ref = useBlurOnFulfill({value: otpValue, cellCount: CELL_COUNT});
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value: otpValue,
    setValue: text => setOtpValue(text),
  });

  //to start resent otp option
  const startResendOtpTimer = () => {
    if (resendOtpTimerInterval) {
      clearInterval(resendOtpTimerInterval);
    }
    resendOtpTimerInterval = setInterval(() => {
      if (resendButtonDisabledTime <= 0) {
        clearInterval(resendOtpTimerInterval);
      } else {
        setResendButtonDisabledTime(resendButtonDisabledTime - 1);
      }
    }, 1000);
  };

  const handleLogin = async () => {
    const {username, password} = account;
    const response = await loginApi.login({username, password});
    await AsyncStorage.setItem('token', response.token);
    await AsyncStorage.setItem('refreshToken', response.refreshToken);
    const userProfile = await meApi.fetchProfile();
    await AsyncStorage.setItem('userId', userProfile._id);
    dispatch(setCurrentUserId(userProfile._id));
    dispatch(setLoading(false));
    dispatch(setLogin(true));
  };

  const handleConfirm = async () => {
    if (otpValue.length === 6) {
      dispatch(setLoading(true));

      try {
        const response = await handleConfirmAccount(account.username, otpValue);
        await handleLogin();
      } catch (error) {
        console.error('ConfirmAccountScreen', error);
        dispatch(setLoading(false));
        setErrorMessage('OTP không đúng hoặc hết hạn');
      }

      // if (response.data) {
      //   dispatch(setLoading(false));
      //   setErrorMessage(response.data.message);
      // } else {
      //   await handleLogin();
      // }
    } else {
      setErrorMessage('OTP không hợp lệ');
    }
  };

  const handleConfirmAccount = async (username, otp) => {
    const response = await loginApi.confirmAccount({username, otp});
    return response;
  };

  //on click of resend button
  const handleOnResendOtp = async () => {
    //clear input field
    setOtpValue('');
    setResendButtonDisabledTime(RESEND_OTP_TIME_LIMIT);
    startResendOtpTimer();
    dispatch(setLoading(true));
    const response = await loginApi.changePassword({
      username: account.username,
    });
    dispatch(setLoading(false));
  };

  //start timer on screen on launch
  useEffect(() => {
    startResendOtpTimer();
    return () => {
      if (resendOtpTimerInterval) {
        clearInterval(resendOtpTimerInterval);
      }
    };
  }, [resendButtonDisabledTime]);

  useEffect(() => {
    dispatch(setLoading(false));
  }, []);

  return (
    <KeyboardAvoidingView behavior="height" style={styles.container}>
      {/* <StatusBar style="light" /> */}
      <Spinner
        visible={isLoading}
        textContent={'Loading...'}
        textStyle={globalStyles.spinnerTextStyle}
      />

      <SafeAreaView style={styles.root}>
        {account?.password ? (
          <>
            <Text style={styles.title}>Nhập mã OTP</Text>
            <Text style={styles.subTitle}>
              Đã gửi mã OTP đến {account.username}
            </Text>
            <CodeField
              ref={ref}
              {...props}
              value={otpValue}
              onChangeText={setOtpValue}
              cellCount={CELL_COUNT}
              rootStyle={styles.codeFieldRoot}
              keyboardType="number-pad"
              textContentType="oneTimeCode"
              renderCell={({index, symbol, isFocused}) => (
                <View
                  onLayout={getCellOnLayoutHandler(index)}
                  key={index}
                  style={[styles.cellRoot, isFocused && styles.focusCell]}>
                  <Text style={styles.cellText}>
                    {symbol || (isFocused ? <Cursor /> : null)}
                  </Text>
                </View>
              )}
            />

            <Text
              style={{
                ...globalStyles.errorText,
                marginLeft: 24,
                marginTop: 20,
                marginBottom: -12,
              }}>
              {errorMessage}
            </Text>

            {/* View for resend otp  */}
            {resendButtonDisabledTime > 0 ? (
              <Text style={styles.resendCodeText}>
                Gửi lại mã OTP sau {resendButtonDisabledTime} giây
              </Text>
            ) : (
              <TouchableOpacity onPress={handleOnResendOtp}>
                <View style={styles.resendCodeContainer}>
                  <Text style={styles.resendCode}> Gửi lại mã OTP</Text>
                </View>
              </TouchableOpacity>
            )}
            <View style={styles.button}>
              <Button
                title="Xác nhận"
                onPress={handleConfirm}
                buttonStyle={{
                  backgroundColor: MAIN_COLOR,
                }}
              />
            </View>
          </>
        ) : (
          <View style={{width: '100%'}}>
            <View style={{alignItems: 'center', paddingTop: 20}}>
              <Avatar
                title={commonFuc.getAcronym(account?.name)}
                rounded
                size="large"
                overlayContainerStyle={{backgroundColor: OVERLAY_AVATAR_COLOR}}
                source={account?.avatar && {uri: account?.avatar}}
              />
            </View>
            <Text
              style={{fontSize: 20, fontWeight: 'bold', textAlign: 'center'}}>
              {account.name}
            </Text>
            <Text style={{fontSize: 16, textAlign: 'center'}}>
              {account.username}
            </Text>
            <Text style={styles.title}>
              {`${account.username.includes('@') ? 'Email' : 'Số điện thoại'} ${
                account.username
              } đã được sử dụng`}{' '}
            </Text>

            <Button
              title="Đăng nhập"
              buttonStyle={{backgroundColor: MAIN_COLOR}}
              onPress={() => navigation.popToTop()}
            />
            <Button
              title="Dùng số điện thoại/email khác"
              type="outline"
              buttonStyle={{borderColor: MAIN_COLOR}}
              titleStyle={{color: MAIN_COLOR}}
              onPress={() => navigation.goBack()}
              containerStyle={{marginTop: 15}}
            />
          </View>
        )}
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

export default ConfirmAccountScreen;

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    // backgroundColor: "#0068FF",
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },

  title: {
    textAlign: 'left',
    fontSize: 20,
    marginStart: 20,
    marginVertical: 20,
    // fontWeight: 'bold',
  },
  subTitle: {
    textAlign: 'left',
    fontSize: 16,
    marginStart: 20,
    marginTop: 10,
  },
  codeFieldRoot: {
    marginTop: 20,
    width: '90%',
    marginLeft: 20,
    marginRight: 20,
  },
  cellRoot: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
  },
  cellText: {
    color: '#000',
    fontSize: 28,
    textAlign: 'center',
  },
  focusCell: {
    borderBottomColor: '#007AFF',
    borderBottomWidth: 2,
  },

  button: {
    marginTop: 20,
    marginHorizontal: 20,
  },
  resendCode: {
    color: MAIN_COLOR,
    marginStart: 20,
    marginTop: 20,
  },
  resendCodeText: {
    marginStart: 20,
    marginTop: 20,
  },
  resendCodeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
