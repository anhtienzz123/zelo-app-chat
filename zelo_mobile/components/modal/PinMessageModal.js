import PropTypes from 'prop-types';
import React from 'react';
import {
  Dimensions,
  Modal,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
} from 'react-native';
import {Button, Divider, Icon, ListItem} from 'react-native-elements';
import {useDispatch, useSelector} from 'react-redux';
import pinMessagesApi from '../../api/pinMessagesApi';
import {
  DEFAULT_PIN_MESSAGE_MODAL,
  ERROR_MESSAGE,
  messageType,
} from '../../constants';
import {fetchPinMessages} from '../../redux/pinSlice';
import {GREY_COLOR, WINDOW_HEIGHT, WINDOW_WIDTH} from '../../styles';
import commonFuc, {checkPermissionDownloadFile} from '../../utils/commonFuc';

const PinMessageModal = props => {
  const {modalVisible, setModalVisible, onViewImage, onViewDetail} = props;
  const {pinMessages} = useSelector(state => state.pin);
  const {currentConversationId} = useSelector(state => state.message);
  const dispatch = useDispatch();

  const handleCloseModal = () => {
    setModalVisible(DEFAULT_PIN_MESSAGE_MODAL);
  };

  const showConfirmDialog = messageId => {
    return Alert.alert(
      'Bạn có muốn bỏ ghim tin nhắn này?',
      'Sau khi bỏ ghim, nội dung vẫn lưu trữ trong bảng tin nhắn nhóm.',
      [
        // The "No" button
        // Does nothing but dismiss the dialog when tapped
        {
          text: 'Hủy',
        },
        // The "Yes" button
        {
          text: 'Bỏ ghim',
          onPress: async () => {
            try {
              const response = await pinMessagesApi.deletePinMessage(messageId);
              dispatch(
                fetchPinMessages({conversationId: currentConversationId}),
              );
            } catch (error) {
              console.error(error);
              commonFuc.notifyMessage(ERROR_MESSAGE);
            }
          },
        },
      ],
    );
  };

  const renderContent = message => {
    let content = message.content;
    let iconName = 'message1';
    let iconType = 'antdesign';
    switch (message?.type) {
      case messageType.TEXT:
        content = message.content;
        break;
      case messageType.IMAGE:
        content = '[Hình ảnh]';
        iconName = 'image-outline';
        iconType = 'ionicon';
        break;
      case messageType.VIDEO:
        content = commonFuc.getFileName(message.content);
        iconName = 'file-video-o';
        iconType = 'font-awesome';
        break;
      case messageType.FILE:
        content = commonFuc.getFileName(message.content);
        iconName = 'file1';
        break;
      case messageType.HTML:
        content = '[Văn bản]';
        iconName = 'filetext1';
        break;

      default:
        content = message.content;
        break;
    }

    return {content, iconName, iconType};
  };

  const handleOnPress = (type, message) => {
    switch (type) {
      case messageType.IMAGE:
        onViewImage({
          isVisible: true,
          userName: message.user.name,
          content: [{url: message.content}],
          isImage: true,
        });
        break;
      case messageType.VIDEO:
        onViewImage({
          isVisible: true,
          userName: message.user.name,
          content: message.content,
          isImage: false,
        });
        break;
      case messageType.FILE:
        checkPermissionDownloadFile(message.content);
        break;

      default:
        onViewDetail({isVisible: true, message});
        break;
    }
  };

  return (
    <SafeAreaView style={styles.centeredView}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible.isVisible}
        onRequestClose={handleCloseModal}>
        <TouchableOpacity activeOpacity={1} style={styles.container}>
          <SafeAreaView style={styles.modalView}>
            <View style={styles.bodyContainer}>
              <View style={styles.header}>
                <Button
                  icon={
                    <Icon
                      type="antdesign"
                      name="pushpin"
                      color="white"
                      size={18}
                    />
                  }
                  disabled
                  disabledStyle={{
                    backgroundColor: '#f68330',
                    borderRadius: 50,
                    marginBottom: 5,
                  }}
                />
                {modalVisible.isError ? (
                  <>
                    <Text style={styles.title}>Danh sách tối đa 3 ghim.</Text>
                    <Text style={styles.title}>Bạn cần bỏ bớt ghim cũ.</Text>
                  </>
                ) : (
                  <Text style={styles.title}>Danh sách ghim</Text>
                )}
              </View>
              <Divider />
              <View
                style={{
                  ...styles.body,
                  maxHeight: modalVisible.isError
                    ? viewHeight - 80 - 107
                    : viewHeight - 80 - 85,
                }}>
                <ScrollView>
                  {pinMessages.length > 0
                    ? pinMessages.map(item => {
                        const {content, iconName, iconType} =
                          renderContent(item);
                        return (
                          <View key={item._id}>
                            <TouchableOpacity
                              onPress={() => handleOnPress(item.type, item)}>
                              <ListItem
                                topDivider={true}
                                containerStyle={{
                                  width: WINDOW_WIDTH,
                                  // backgroundColor: 'grey',
                                }}>
                                <Icon
                                  name={iconName}
                                  type={iconType}
                                  // name="message1"
                                  // type="antdesign"
                                  color="#4cacfc"
                                />
                                <ListItem.Content>
                                  <ListItem.Title>{content}</ListItem.Title>
                                  <ListItem.Subtitle
                                    numberOfLines={
                                      1
                                    }>{`Tin nhắn của ${item.user.name}`}</ListItem.Subtitle>
                                </ListItem.Content>

                                <Button
                                  type="clear"
                                  icon={
                                    <Icon
                                      name="minus-circle"
                                      type="feather"
                                      color={GREY_COLOR}
                                    />
                                  }
                                  onPress={() => showConfirmDialog(item._id)}
                                />
                              </ListItem>
                            </TouchableOpacity>
                          </View>
                        );
                      })
                    : handleCloseModal()}
                </ScrollView>
              </View>
            </View>
            <View style={styles.footer}>
              <Button
                title="Quay lại"
                containerStyle={styles.buttonClose}
                buttonStyle={{borderRadius: 50}}
                onPress={handleCloseModal}
              />
            </View>
          </SafeAreaView>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
};

PinMessageModal.propTypes = {
  modalVisible: PropTypes.object,
  setModalVisible: PropTypes.func,
  onViewImage: PropTypes.func,
  onViewDetail: PropTypes.func,
};

PinMessageModal.defaultProps = {
  modalVisible: DEFAULT_PIN_MESSAGE_MODAL,
  setModalVisible: null,
  onViewImage: null,
  onViewDetail: null,
};

const BUTTON_RADIUS = 10;
const viewHeight = WINDOW_HEIGHT - 80;

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(52, 52, 52, 0.8)',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    // padding: 10,
  },
  centeredView: {},
  modalView: {
    width: '100%',
    height: '100%',
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  bodyContainer: {
    // backgroundColor: 'green',
    width: '100%',
    // padding: 15,
    paddingBottom: 0,
  },
  header: {
    // backgroundColor: 'red',
    width: '100%',
    alignItems: 'center',
    paddingTop: 15,
    paddingBottom: 10,
  },
  body: {
    // backgroundColor: 'cyan',
    width: '100%',
    paddingBottom: 0,
    alignItems: 'center',
  },
  footer: {
    // backgroundColor: 'pink',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 15,
    paddingVertical: 20,

    shadowColor: '#000',
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 2,
  },
  title: {
    fontFamily: Platform.OS === 'ios' ? 'Arial' : 'normal',
    fontWeight: 'bold',
    color: 'black',
    fontSize: 16,
  },
  buttonClose: {
    backgroundColor: '#2196F3',
    width: '100%',
    borderRadius: 50,
  },
});

export default PinMessageModal;
