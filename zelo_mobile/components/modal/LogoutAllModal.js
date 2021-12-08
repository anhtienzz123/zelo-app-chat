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
import {Button} from 'react-native-elements';
import {meApi} from '../../api';
import commonFuc, {makeId} from '../../utils/commonFuc';
import {logoutAllValid} from '../../utils/validator';
import InputField from '../InputField';
import CustomModal from './CustomModal';

const LogoutAllModal = props => {
  const {modalVisible, setModalVisible} = props;

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  const handleOnSubmit = async values => {
    const {password} = values;

    try {
      const key = makeId();
      const response = await meApi.logoutAllDevice(password, key);
      await AsyncStorage.setItem('token', response.token);
      await AsyncStorage.setItem('refreshToken', response.refreshToken);
      commonFuc.notifyMessage('Đăng xuất thành công');
    } catch (error) {
      commonFuc.notifyMessage('Đăng xuất thất bại');
    }

    handleCloseModal();
  };

  return (
    <CustomModal
      visible={modalVisible}
      onCloseModal={handleCloseModal}
      title="Đăng xuất ra khỏi các thiết bị khác">
      <Formik
        initialValues={logoutAllValid.initial}
        validationSchema={logoutAllValid.validationSchema}
        onSubmit={values => handleOnSubmit(values)}>
        {formikProps => {
          const {values, errors, handleChange, handleSubmit} = formikProps;
          return (
            <>
              <View style={styles.body}>
                <InputField
                  placeholder="Nhập mật khẩu hiện tại"
                  autoFocus
                  onChangeText={handleChange('password')}
                  secureTextEntry={true}
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
              </View>
              <View style={styles.footer}>
                <Button
                  title="Hủy"
                  onPress={handleCloseModal}
                  type="clear"
                  titleStyle={{color: 'black'}}
                  containerStyle={{marginRight: 20}}
                />
                <Button title="Đăng xuất" onPress={handleSubmit} type="clear" />
              </View>
            </>
          );
        }}
      </Formik>
    </CustomModal>
  );
};

LogoutAllModal.propTypes = {
  modalVisible: PropTypes.bool,
  setModalVisible: PropTypes.func,
};

LogoutAllModal.defaultProps = {
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

export default LogoutAllModal;
