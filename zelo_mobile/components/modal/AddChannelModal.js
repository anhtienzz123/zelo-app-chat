import PropTypes from 'prop-types';
import React, {useState} from 'react';
import {
  Modal,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {Button, Input} from 'react-native-elements';
import {useDispatch, useSelector} from 'react-redux';
import {channelApi} from '../../api';
import {DEFAULT_CHANNEL_MODAL, ERROR_MESSAGE} from '../../constants';
import commonFuc from '../../utils/commonFuc';

const AddChannelModal = props => {
  const {modalProps, onShowModal} = props;

  const dispatch = useDispatch();

  const {channels, currentConversationId} = useSelector(state => state.message);

  const [name, setName] = useState(modalProps.name);
  const [error, setError] = useState('');

  const handleCloseModal = () => {
    onShowModal(DEFAULT_CHANNEL_MODAL);
  };

  const handleConfirm = async () => {
    if (error.length === 0) {
      try {
        if (modalProps.channelId.length > 0) {
          await channelApi.updateChannel(name, modalProps.channelId);
          commonFuc.notifyMessage('Đổi tên thành công');
          handleCloseModal();
        } else {
          await channelApi.createChannel(name, currentConversationId);
          handleCloseModal();
        }
      } catch (error) {
        console.error('Channel: ', error);
        commonFuc.notifyMessage(ERROR_MESSAGE);
      }
    }
  };

  const onChangeText = value => {
    const index = channels.findIndex(channelEle => channelEle.name === value);

    if (index >= 0) {
      setError('Không được trùng tên');
    } else {
      error.length > 0 && setError('');
    }
    setName(value);
  };

  return (
    <SafeAreaView style={styles.centeredView}>
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalProps.isVisible}
        onRequestClose={handleCloseModal}>
        <TouchableOpacity activeOpacity={1} style={styles.container}>
          <SafeAreaView style={styles.modalView}>
            <View style={styles.header}>
              <Text style={styles.title}>
                {modalProps.channelId.length > 0
                  ? 'Đổi tên channel'
                  : 'Thêm channel'}
              </Text>
            </View>
            <>
              <View style={styles.body}>
                <Input
                  placeholder="Nhập tên channel"
                  autoFocus
                  onChangeText={onChangeText}
                  value={name}
                  errorMessage={error}
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
                <Button
                  title={modalProps.channelId.length > 0 ? 'Cập nhật' : 'Thêm'}
                  onPress={handleConfirm}
                  type="clear"
                />
              </View>
            </>
          </SafeAreaView>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
};

AddChannelModal.propTypes = {
  modalProps: PropTypes.object,
  onShowModal: PropTypes.func,
};

AddChannelModal.defaultProps = {
  modalProps: DEFAULT_CHANNEL_MODAL,
  onShowModal: null,
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

export default AddChannelModal;
