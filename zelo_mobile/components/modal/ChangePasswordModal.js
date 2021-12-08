import AsyncStorage from '@react-native-async-storage/async-storage';
import {Formik} from 'formik';
import PropTypes from 'prop-types';
import React from 'react';
import {
  Modal,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {Button, Icon} from 'react-native-elements';
import {meApi} from '../../api';
import commonFuc, {currentKey, makeId} from '../../utils/commonFuc';
import {changePasswordValid} from '../../utils/validator';
import InputField from '../InputField';
import CustomModal from './CustomModal';

const ChangePasswordModal = props => {
  const {modalVisible, setModalVisible} = props;

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  const handleChangePassword = async values => {
    const {oldPassword, newPassword} = values;

    try {
      await meApi.changePassword(oldPassword, newPassword);

      const key = makeId();
      const response = await meApi.logoutAllDevice(newPassword, key);
      await AsyncStorage.setItem('token', response.token);
      await AsyncStorage.setItem('refreshToken', response.refreshToken);
      commonFuc.notifyMessage('Đổi mật khẩu thành công');
    } catch (error) {
      commonFuc.notifyMessage('Đổi mật khẩu thất bại');
    }

    handleCloseModal();
  };

  return (
    <CustomModal
      visible={modalVisible}
      onCloseModal={handleCloseModal}
      title="Đổi mật khẩu">
      <Formik
        initialValues={changePasswordValid.initial}
        validationSchema={changePasswordValid.validationSchema}
        onSubmit={values => handleChangePassword(values)}>
        {formikProps => {
          const {values, errors, handleChange, handleSubmit} = formikProps;
          return (
            <>
              <View style={styles.body}>
                <InputField
                  placeholder="Nhập mật khẩu hiện tại"
                  autoFocus
                  onChangeText={handleChange('oldPassword')}
                  secureTextEntry={true}
                  value={values.oldPassword}
                  error={errors.oldPassword}
                  leftIcon={
                    <Icon
                      name="lock"
                      type="antdesign"
                      size={24}
                      color="black"
                    />
                  }
                />
                <InputField
                  placeholder="Nhập mật khẩu mới"
                  onChangeText={handleChange('newPassword')}
                  secureTextEntry={true}
                  value={values.newPassword}
                  error={errors.newPassword}
                  leftIcon={
                    <Icon
                      name="lock"
                      type="antdesign"
                      size={24}
                      color="black"
                    />
                  }
                />

                <InputField
                  style={styles.input}
                  placeholder="Nhập lại mật khẩu"
                  secureTextEntry={true}
                  onChangeText={handleChange('passwordConfirmation')}
                  value={values.passwordConfirmation}
                  error={errors.passwordConfirmation}
                  leftIcon={
                    <Icon
                      name="lock"
                      type="antdesign"
                      size={24}
                      color="black"
                    />
                  }
                />
              </View>
              <View style={styles.footer}>
                <Button
                  title="Hủy"
                  onPress={handleCloseModal}
                  type="clear"
                  titleStyle={{color: 'black'}}
                  containerStyle={{marginRight: 20}}
                />
                <Button title="Thay đổi" onPress={handleSubmit} type="clear" />
              </View>
            </>
          );
        }}
      </Formik>
    </CustomModal>
  );
};

ChangePasswordModal.propTypes = {
  modalVisible: PropTypes.bool,
  setModalVisible: PropTypes.func,
};

ChangePasswordModal.defaultProps = {
  modalVisible: false,
  setModalVisible: null,
};

const BUTTON_RADIUS = 10;

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(52, 52, 52, 0.3)',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
  },
  centeredView: {
    // flex: 1,
    // flexDirection: "row",
    // justifyContent: "center",
    // alignItems: "flex-end",
    // width: "100%",
  },
  modalView: {
    width: '100%',
    backgroundColor: 'white',
    borderRadius: 5,
    // padding: 15,
  },

  header: {
    borderBottomWidth: 1,
    borderBottomColor: '#E5E6E8',
    paddingVertical: 5,
    paddingHorizontal: 15,
  },
  title: {
    fontFamily: Platform.OS === 'ios' ? 'Arial' : 'normal',
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'left',
    fontSize: 18,
    borderBottomColor: 'black',
  },
  body: {},
  footer: {
    paddingHorizontal: 15,
    paddingBottom: 5,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
});

export default ChangePasswordModal;
