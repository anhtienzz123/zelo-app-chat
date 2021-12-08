import {Formik} from 'formik';
import PropTypes from 'prop-types';
import React, {useEffect, useState} from 'react';
import {
  Modal,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {Button, CheckBox} from 'react-native-elements';
// import DateTimePicker from '@react-native-community/datetimepicker';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {useDispatch, useSelector} from 'react-redux';
import {meApi} from '../../api';
import InputField from '../InputField';
import {ERROR_MESSAGE} from '../../constants';
import {fetchProfile} from '../../redux/meSlice';
import commonFuc from '../../utils/commonFuc';
import {userProfileValid} from '../../utils/validator';
import CustomModal from './CustomModal';

const UpdateUserProfileModal = props => {
  const {modalVisible, setModalVisible} = props;

  const dispatch = useDispatch();

  const {userProfile} = useSelector(state => state.me);
  const date = userProfile?.dateOfBirth;

  const [genderValue, setGenderValue] = useState(userProfile?.gender || false);
  const [show, setShow] = useState(false);
  const [dateOfBirth, setDateOfBirth] = useState(new Date(1598051730000));
  const [dobTitle, setDobTitle] = useState('');

  useEffect(() => {
    const date = userProfile?.dateOfBirth;
    const dob = new Date(date?.year, date?.month - 1, date?.day);
    // setDateOfBirth(dob);
    setDobTitle(handleDateOfBirth(dob));
    setDateOfBirth(dob);
  }, [modalVisible]);

  const initialValues = {
    name: userProfile?.name,
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };
  const handleDateOfBirth = dateOfBirth => {
    const date = dateOfBirth.getDate();
    const month = dateOfBirth.getMonth() + 1;
    const year = dateOfBirth.getFullYear();

    return (
      ('00' + date).slice(-2) + '/' + ('00' + month).slice(-2) + '/' + year
    );
  };
  const handleUpdateUserProfile = async profile => {
    try {
      const dateOfBirthObj = {
        day: dateOfBirth.getDate(),
        month: dateOfBirth.getMonth() + 1,
        year: dateOfBirth.getFullYear(),
      };

      const response = await meApi.updateProfile({
        name: profile.name,
        gender: genderValue ? 1 : 0,
        dateOfBirth: dateOfBirthObj,
      });
      dispatch(fetchProfile());
      handleCloseModal();
      commonFuc.notifyMessage('Cập nhật thành công');
    } catch (error) {
      console.error('Update profile: ', error);
      commonFuc.notifyMessage(ERROR_MESSAGE);
    }
  };

  const handleConfirm = selectedDate => {
    const dateSelected = selectedDate || dateOfBirth;
    setDateOfBirth(dateSelected);
    setDobTitle(handleDateOfBirth(dateSelected));
    hideDatePicker();
  };

  const hideDatePicker = () => {
    setShow(false);
  };

  const handleOpenDatePicker = () => {
    const date = userProfile?.dateOfBirth;
    const dob = new Date(date?.year, date?.month - 1, date?.day);
    setDateOfBirth(dob);
    setShow(true);
  };

  return (
    <>
      <CustomModal
        visible={modalVisible}
        onCloseModal={handleCloseModal}
        title="Cập nhật thông tin">
        <Formik
          initialValues={initialValues}
          validationSchema={userProfileValid.validationSchema}
          onSubmit={values => handleUpdateUserProfile(values)}>
          {formikProps => {
            const {values, errors, handleChange, handleSubmit} = formikProps;
            return (
              <>
                <View style={styles.body}>
                  <View style={styles.row}>
                    <Text style={styles.titleBody}>Họ và tên</Text>
                    <InputField
                      placeholder={'Họ và tên'}
                      autoFocus
                      onChangeText={handleChange('name')}
                      value={values.name}
                      error={errors.name}
                      style={{fontSize: 15, paddingBottom: 0}}
                      inputContainerStyle={{
                        borderBottomWidth: 0,
                        width: '100%',
                      }}
                      maxLength={30}
                    />
                  </View>

                  <View style={styles.row}>
                    <Text style={styles.titleBody}>Giới tính</Text>
                    <CheckBox
                      center
                      title="Nam"
                      checkedIcon="dot-circle-o"
                      uncheckedIcon="circle-o"
                      checked={!genderValue}
                      onPress={() => setGenderValue(false)}
                      value={false}
                      containerStyle={{
                        // width: 100,
                        backgroundColor: '#fff',
                        borderColor: '#fff',
                        borderWidth: 0,
                      }}
                    />
                    <CheckBox
                      center
                      title="Nữ"
                      checkedIcon="dot-circle-o"
                      uncheckedIcon="circle-o"
                      checked={genderValue}
                      onPress={() => setGenderValue(true)}
                      value={true}
                      containerStyle={{
                        // width: 100,
                        backgroundColor: '#fff',
                        borderColor: '#fff',
                        borderWidth: 0,
                      }}
                    />
                  </View>

                  <View style={styles.row}>
                    <Text style={styles.titleBody}>Ngày sinh</Text>
                    <Button
                      type="clear"
                      title={dobTitle}
                      onPress={handleOpenDatePicker}
                      titleStyle={{color: '#000'}}
                      containerStyle={{marginLeft: 10}}
                    />
                  </View>
                </View>
                <View style={styles.footer}>
                  <Button
                    title="Hủy"
                    onPress={handleCloseModal}
                    type="clear"
                    titleStyle={{color: 'black'}}
                    containerStyle={{marginRight: 20}}
                  />
                  <Button
                    title="Cập nhật"
                    onPress={handleSubmit}
                    type="clear"
                  />
                </View>
              </>
            );
          }}
        </Formik>
      </CustomModal>

      {show && (
        <DateTimePickerModal
          isVisible={show}
          date={dateOfBirth}
          mode="date"
          onConfirm={handleConfirm}
          onCancel={hideDatePicker}
        />
      )}
    </>
  );
};

UpdateUserProfileModal.propTypes = {
  modalVisible: PropTypes.bool,
  setModalVisible: PropTypes.func,
  userProfile: PropTypes.object,
};

UpdateUserProfileModal.defaultProps = {
  modalVisible: false,
  setModalVisible: null,
  userProfile: {},
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
  titleBody: {
    width: '20%',
    alignSelf: 'center',
    // backgroundColor: 'pink',
    fontSize: 15,
  },
  row: {
    flexDirection: 'row',
    paddingHorizontal: 15,
  },
  footer: {
    paddingHorizontal: 15,
    paddingBottom: 5,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
});

export default UpdateUserProfileModal;
