import React from 'react';
import {
  Modal,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from 'react-native';
import {Button} from 'react-native-elements';
import {Icon} from 'react-native-elements';
import IconAntDesign from 'react-native-vector-icons/AntDesign';
import {useDispatch, useSelector} from 'react-redux';
import {setModalVisible} from '../../redux/globalSlice';

const MessageHeaderModal = ({navigation}) => {
  const {modalVisible} = useSelector(state => state.global);

  const dispatch = useDispatch();

  const handleCloseModal = () => {
    dispatch(setModalVisible(false));
  };

  return (
    <SafeAreaView style={styles.centeredView}>
      <Modal
        // animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={handleCloseModal}>
        <TouchableOpacity
          activeOpacity={1}
          onPressOut={handleCloseModal}
          style={{
            backgroundColor: 'rgba(52, 52, 52, 0.3)',
            flex: 1,
            alignItems: 'flex-end',
            padding: 10,
          }}>
          <SafeAreaView style={styles.modalView}>
            <Button
              title="Tạo nhóm"
              containerStyle={styles.buttonTop}
              type="clear"
              icon={<Icon name="addusergroup" type="antdesign" size={22} />}
              titleStyle={styles.title}
              onPress={() => {
                handleCloseModal();
                navigation.navigate('Tìm kiếm bạn bè', {isAddToGroup: true});
              }}
            />
            <Button
              title="Tìm kiếm"
              containerStyle={styles.button}
              type="clear"
              icon={<Icon name="search1" type="antdesign" size={22} />}
              titleStyle={styles.title}
              onPress={() => {
                handleCloseModal();
                navigation.navigate('Tìm kiếm');
              }}
            />
            <Button
              title="Thêm bạn"
              containerStyle={styles.buttonBottom}
              type="clear"
              icon={<Icon name="adduser" type="antdesign" size={22} />}
              titleStyle={styles.title}
              onPress={() => {
                handleCloseModal();
                navigation.navigate('Thêm bạn');
              }}
            />
          </SafeAreaView>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
};

MessageHeaderModal.propTypes = {};

MessageHeaderModal.defaultProps = {};

const BUTTON_RADIUS = 10;

const styles = StyleSheet.create({
  centeredView: {
    // flex: 1,
    // flexDirection: "row",
    // justifyContent: "center",
    // alignItems: "flex-end",
    // width: 100,
  },
  modalView: {
    width: 120,
    marginTop: 8,
    backgroundColor: 'white',
    borderRadius: BUTTON_RADIUS,
    // padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    width: '100%',
    borderRadius: 0,
    alignItems: 'stretch',
  },
  buttonTop: {
    width: '100%',
    borderRadius: 0,
    alignItems: 'stretch',
    borderTopStartRadius: BUTTON_RADIUS,
    borderTopEndRadius: BUTTON_RADIUS,
  },
  buttonBottom: {
    width: '100%',
    borderRadius: 0,
    alignItems: 'stretch',
    borderBottomStartRadius: BUTTON_RADIUS,
    borderBottomEndRadius: BUTTON_RADIUS,
  },
  title: {
    fontFamily: Platform.OS === 'ios' ? 'Arial' : 'normal',
    fontWeight: '100',
    color: 'black',
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
});

export default MessageHeaderModal;
