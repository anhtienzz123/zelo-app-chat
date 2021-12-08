import AsyncStorage from '@react-native-async-storage/async-storage';
import {Formik} from 'formik';
import PropTypes from 'prop-types';
import React, {Children} from 'react';
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

const CustomModal = props => {
  const {
    title,
    showFooter,
    visible,
    isPressOut,
    onCloseModal,
    children,
    isShowTitle,
    submitTitle,
    onSubmit,
    cancelTitle,
    containerStyle,
  } = props;

  return (
    <SafeAreaView style={styles.centeredView}>
      <Modal
        animationType="fade"
        transparent={true}
        visible={visible}
        onRequestClose={onCloseModal}>
        <TouchableOpacity
          activeOpacity={1}
          onPressOut={isPressOut ? onCloseModal : null}
          style={styles.container}>
          <SafeAreaView style={[styles.modalView, containerStyle]}>
            {isShowTitle && (
              <>
                <View style={styles.header}>
                  <Text style={styles.title}>{title}</Text>
                </View>
                <View style={styles.headerDivider}></View>
              </>
            )}

            {children}

            {showFooter && (
              <View style={styles.footer}>
                <Button
                  title={cancelTitle}
                  onPress={onCloseModal}
                  type="clear"
                  titleStyle={{color: 'black'}}
                  containerStyle={{marginRight: 20}}
                />
                <Button title={submitTitle} onPress={onSubmit} type="clear" />
              </View>
            )}
          </SafeAreaView>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
};

CustomModal.propTypes = {
  title: PropTypes.string,
  visible: PropTypes.bool,
  showFooter: PropTypes.bool,
  isPressOut: PropTypes.bool,
  isShowTitle: PropTypes.bool,
  onCloseModal: PropTypes.func,
  submitTitle: PropTypes.string,
  onSubmit: PropTypes.func,
  cancelTitle: PropTypes.string,
  containerStyle: PropTypes.object,
};

CustomModal.defaultProps = {
  title: 'Cảnh báo',
  visible: false,
  showFooter: false,
  isPressOut: false,
  isShowTitle: true,
  onCloseModal: null,
  submitTitle: 'Ok',
  onSubmit: null,
  cancelTitle: 'Cancel',
  containerStyle: null,
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
    // borderBottomWidth: 1,
    // borderBottomColor: '#E5E6E8',
    paddingVertical: 15,
    paddingHorizontal: 15,
  },
  headerDivider: {
    borderBottomWidth: 1,
    borderBottomColor: '#E5E6E8',
    marginHorizontal: 12,
  },
  title: {
    fontFamily: Platform.OS === 'ios' ? 'Arial' : 'normal',
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'left',
    fontSize: 20,
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

export default CustomModal;
