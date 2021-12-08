import PropTypes from 'prop-types';
import React from 'react';
import {
  Alert,
  Modal,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {useSelector} from 'react-redux';
import {channelApi} from '../../api';
import {
  DEFAULT_CHANNEL_MODAL,
  DEFAULT_MESSAGE_MODAL_VISIBLE,
} from '../../constants';
import commonFuc from '../../utils/commonFuc';
import MessageModalButton from '../MessageModalButton';

const BUTTON_RADIUS = 10;

const ChannelModal = props => {
  const {modalVisible, setModalVisible, onShowRenameModal, channelIdRef} =
    props;

  const {currentConversationId, currentConversation} = useSelector(
    state => state.message,
  );
  const {currentUserId} = useSelector(state => state.global);

  const handleCloseModal = () => {
    setModalVisible(DEFAULT_CHANNEL_MODAL);
  };

  const handleRename = () => {
    onShowRenameModal({
      isVisible: true,
      name: modalVisible.name,
      channelId: modalVisible.channelId,
    });
    handleCloseModal();
  };

  const handleDelete = () => {
    Alert.alert('Cảnh báo', 'Bạn có muốn xóa channel này không?', [
      {
        text: 'Không',
      },
      {
        text: 'Có',
        onPress: async () => {
          try {
            await channelApi.deleteChannel(modalVisible.channelId);
            commonFuc.notifyMessage('Xóa channel thành công');
            channelIdRef.current = currentConversationId;
          } catch (error) {
            console.error('Delete channel: ', error);
          }
          handleCloseModal();
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.centeredView}>
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible.isVisible}
        onRequestClose={handleCloseModal}>
        <TouchableOpacity
          activeOpacity={1}
          onPressOut={handleCloseModal}
          style={styles.container}>
          <SafeAreaView style={styles.modalView}>
            <MessageModalButton
              title="Đổi tên channel"
              containerStyle={{
                borderTopStartRadius: BUTTON_RADIUS,
              }}
              iconName="edit"
              iconType="antdesign"
              iconColor="#5e9be5"
              onPress={handleRename}
            />

            {currentConversation.leaderId === currentUserId && (
              <MessageModalButton
                title="Xóa channel"
                iconName="trash"
                iconType="feather"
                iconColor="#c45547"
                onPress={handleDelete}
              />
            )}
          </SafeAreaView>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
};

ChannelModal.propTypes = {
  modalVisible: PropTypes.object,
  setModalVisible: PropTypes.func,
  setPinMessageVisible: PropTypes.func,
  handleOnReplyMessagePress: PropTypes.func,
};

ChannelModal.defaultProps = {
  modalVisible: DEFAULT_MESSAGE_MODAL_VISIBLE,
  setModalVisible: null,
  setPinMessageVisible: null,
  handleOnReplyMessagePress: null,
};

const styles = StyleSheet.create({
  centeredView: {
    // flex: 1,
    // flexDirection: "row",
    // justifyContent: "center",
    // alignItems: "flex-end",
    // width: 100,
  },
  container: {
    backgroundColor: 'rgba(52, 52, 52, 0.5)',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  reactionContainer: {
    // width: '80%',
    marginTop: 8,
    backgroundColor: 'white',
    borderRadius: BUTTON_RADIUS,
    // paddingHorizontal: 10,
    // paddingVertical: 5,
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    flexWrap: 'nowrap',
  },
  modalView: {
    // width: '80%',
    marginTop: 8,
    backgroundColor: 'white',
    borderRadius: BUTTON_RADIUS,
    // padding: 35,
    alignItems: 'center',
    alignContent: 'stretch',
    // justifyContent: "space-between",
    flexDirection: 'row',
    flexWrap: 'wrap',
    // flexGrow: 1,
    // flexBasis: 0,
  },
  reactionButton: {
    // width: "30%",
    borderRadius: BUTTON_RADIUS,
  },
  reactionTitle: {
    fontSize: 20,
  },
  button: {
    width: '33.33%',
    borderRadius: 0,

    // backgroundColor: "red",
  },

  title: {
    fontFamily: 'normal' || 'Arial',
    fontWeight: '100',
    color: 'black',
    fontSize: 13,
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

export default ChannelModal;
