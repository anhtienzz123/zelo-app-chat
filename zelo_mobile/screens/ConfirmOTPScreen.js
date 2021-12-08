// import {StatusBar} from 'expo-status-bar';
import React, {useEffect, useState} from 'react';
import {
  Alert,
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
import {Button} from 'react-native-elements';
import Spinner from 'react-native-loading-spinner-overlay';
import {useDispatch, useSelector} from 'react-redux';
import {loginApi} from '../api';
import {ERROR_MESSAGE} from '../constants';
import {setLoading} from '../redux/globalSlice';
import globalStyles, {MAIN_COLOR} from '../styles';
import commonFuc from '../utils/commonFuc';

const CELL_COUNT = 6;
const RESEND_OTP_TIME_LIMIT = 30;

const ConfirmOTPScreen = ({navigation, route}) => {
  const {account, isForgotPassword} = route.params;
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
    setValue: setOtpValue,
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

  const handleConfirm = async () => {
    if (otpValue.length === 6) {
      try {
        dispatch(setLoading(true));
        const response = await loginApi.confirmPassword({
          ...account,
          otp: otpValue,
        });
        dispatch(setLoading(false));
        if (response.data?.message) {
          setErrorMessage(response.data.message);
        } else {
          Alert.alert('Thông báo', 'Đổi mật khẩu thành công', [
            {
              text: 'Ok',
              onPress: () => {
                isForgotPassword && navigation.popToTop();
              },
            },
          ]);
        }
      } catch (error) {
        dispatch(setLoading(false));
        console.error('Confirm otp: ', error);
        commonFuc.notifyMessage(ERROR_MESSAGE);
      }
    } else {
      setErrorMessage('OTP không hợp lệ');
    }
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
      <SafeAreaView behavior="height" style={styles.container}>
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
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

export default ConfirmOTPScreen;

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    // backgroundColor: "#0068FF",
    paddingTop: 16,
    // alignItems: "center",
    justifyContent: 'center',
  },

  title: {
    textAlign: 'left',
    fontSize: 20,
    marginStart: 20,
    fontWeight: 'bold',
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
    marginTop: 40,
  },
  resendCodeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
