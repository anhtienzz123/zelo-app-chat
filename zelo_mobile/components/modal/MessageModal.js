import Clipboard from '@react-native-clipboard/clipboard';
import PropTypes from 'prop-types';
import React, {useEffect} from 'react';
import {Modal, SafeAreaView, StyleSheet, TouchableOpacity} from 'react-native';
import {Button} from 'react-native-elements';
import {useDispatch, useSelector} from 'react-redux';
import messageApi from '../../api/messageApi';
import pinMessagesApi from '../../api/pinMessagesApi';
import {
  DEFAULT_MESSAGE_MODAL_VISIBLE,
  messageType,
  REACTIONS,
} from '../../constants';
import {deleteMessageOnlyMe} from '../../redux/messageSlice';
import {fetchPinMessages} from '../../redux/pinSlice';
import commonFuc from '../../utils/commonFuc';
import MessageModalButton from '../MessageModalButton';

const BUTTON_RADIUS = 10;

const MessageModal = props => {
  const {
    modalVisible,
    setModalVisible,
    setPinMessageVisible,
    navigation,
    handleOnReplyMessagePress,
  } = props;
  const {currentConversation, currentConversationId, currentChannelId} =
    useSelector(state => state.message);
  const {pinMessages} = useSelector(state => state.pin);

  const messageId = modalVisible.messageId;

  const dispatch = useDispatch();
  useEffect(() => {}, [modalVisible]);

  const handleCloseModal = () => {
    setModalVisible(DEFAULT_MESSAGE_MODAL_VISIBLE);
  };
  const handleCopy = () => {
    Clipboard.setString(modalVisible.messageContent);
    commonFuc.notifyMessage('Đã sao chép');
    handleCloseModal();
  };
  const handleDeleteOnlyMe = async () => {
    dispatch(deleteMessageOnlyMe(messageId));
    handleCloseModal();
    await messageApi.deleteMessageOnlyMe(messageId);
  };
  const handleDelete = async () => {
    await messageApi.deleteMessage(messageId);
    handleCloseModal();
  };
  const handleAddReaction = async type => {
    await messageApi.addReaction(messageId, type);
    handleCloseModal();
  };
  const handlePinMessage = async () => {
    if (pinMessages.length === 3) {
      setPinMessageVisible({
        isVisible: true,
        isError: true,
      });
    } else {
      try {
        const response = await pinMessagesApi.addPinMessage(messageId);

        dispatch(fetchPinMessages({conversationId: currentConversationId}));
      } catch (error) {
        commonFuc.notifyMessage('Ghim tin nhắn thất bại');
        console.error(error);
      }
    }
    handleCloseModal();
  };

  const handleForward = () => {
    navigation.navigate('Chia sẻ', {messageId});
    handleCloseModal();
  };

  const handleReplyMessage = () => {
    handleOnReplyMessagePress(messageId);
    handleCloseModal();
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
          {!modalVisible.isRecall && (
            <SafeAreaView style={styles.reactionContainer}>
              {REACTIONS.map((value, index) => (
                <Button
                  key={index}
                  title={value}
                  containerStyle={styles.reactionButton}
                  type="clear"
                  titleStyle={styles.reactionTitle}
                  onPress={() => handleAddReaction(index + 1)}
                />
              ))}
            </SafeAreaView>
          )}
          <SafeAreaView style={styles.modalView}>
            {!modalVisible.isRecall && (
              <>
                <MessageModalButton
                  title="Trả lời"
                  containerStyle={{
                    borderTopStartRadius: BUTTON_RADIUS,
                  }}
                  iconName="action-undo"
                  iconType="simple-line-icon"
                  iconColor="#ab8ef0"
                  onPress={handleReplyMessage}
                />

                <MessageModalButton
                  title="Chuyển tiếp"
                  iconName="action-redo"
                  iconType="simple-line-icon"
                  iconColor="#5e9be5"
                  onPress={handleForward}
                />
              </>
            )}

            <MessageModalButton
              title="Xóa"
              containerStyle={{
                borderTopEndRadius: BUTTON_RADIUS,
              }}
              iconName="trash"
              iconType="feather"
              iconColor="#c45547"
              onPress={handleDeleteOnlyMe}
            />
            {!modalVisible.isRecall && (
              <>
                {modalVisible.type === messageType.TEXT && (
                  <MessageModalButton
                    title="Copy"
                    containerStyle={{
                      borderBottomStartRadius: BUTTON_RADIUS,
                    }}
                    iconName="content-copy"
                    iconType="material"
                    iconColor="#899ada"
                    onPress={handleCopy}
                  />
                )}
                {modalVisible.type === messageType.HTML && (
                  <MessageModalButton
                    title="Copy"
                    containerStyle={{
                      borderBottomStartRadius: BUTTON_RADIUS,
                    }}
                    iconName="content-copy"
                    iconType="material"
                    iconColor="#899ada"
                    onPress={handleCopy}
                  />
                )}

                {currentConversation?.type &&
                  modalVisible.type !== messageType.STICKER &&
                  currentConversationId === currentChannelId && (
                    <MessageModalButton
                      title="Ghim"
                      iconName="pushpino"
                      iconType="antdesign"
                      iconColor="#dc923c"
                      onPress={handlePinMessage}
                    />
                  )}
                {modalVisible.isMyMessage && (
                  <MessageModalButton
                    title="Thu hồi"
                    iconName="rotate-ccw"
                    iconType="feather"
                    iconColor="#5292af"
                    onPress={handleDelete}
                    containerStyle={{
                      ...styles.button,
                      borderBottomEndRadius: BUTTON_RADIUS,
                    }}
                  />
                )}
              </>
            )}
          </SafeAreaView>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
};

MessageModal.propTypes = {
  modalVisible: PropTypes.object,
  setModalVisible: PropTypes.func,
  setPinMessageVisible: PropTypes.func,
  handleOnReplyMessagePress: PropTypes.func,
};

MessageModal.defaultProps = {
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
    width: '80%',
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
    width: '80%',
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

export default MessageModal;
