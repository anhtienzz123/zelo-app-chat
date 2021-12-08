import PropTypes from 'prop-types';
import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {Avatar, Image} from 'react-native-elements';
import {Icon} from 'react-native-elements/dist/icons/Icon';
import HTMLView from 'react-native-htmlview';
import RNUrlPreview from 'react-native-url-preview';
import {useSelector} from 'react-redux';
import {messageType} from '../../constants';
import globalStyles, {MAIN_COLOR, OVERLAY_AVATAR_COLOR} from '../../styles';
import commonFuc from '../../utils/commonFuc';
import FileMessage from './FileMessage';
import MessageNotifyDivider from './MessageNotifyDivider';
import MessageReply from './MessageReply';

const ReceiverMessage = props => {
  const {
    message,
    handleOpenOptionModal,
    handleShowReactDetails,
    content,
    time,
    reactVisibleInfo,
    reactLength,
    handleViewImage,
    isLastMessage,
    onLastView,
  } = props;

  const {_id, isDeleted, type, tagUsers, replyMessage} = message;

  const {listLastViewer} = useSelector(state => state.message);
  const {currentUserId} = useSelector(state => state.global);

  const contentStyle = isDeleted
    ? styles.messageRecall
    : message.messageContent;

  const checkLastView = () => {
    let usersViewed = [];
    if (!isLastMessage) {
      return usersViewed;
    }

    const removeCurrentUser = listLastViewer.filter(
      lastViewerEle => currentUserId !== lastViewerEle.user._id,
    );

    removeCurrentUser.forEach(lastViewerEle => {
      const {lastView, user} = lastViewerEle;

      if (new Date(lastView) >= new Date(message?.createdAt))
        usersViewed.push(user);
    });

    return usersViewed;
  };

  const handleLastView = () => {
    const userList = checkLastView();
    onLastView({isVisible: true, userList});
  };

  return (
    <View>
      {type === messageType.NOTIFY ? (
        <MessageNotifyDivider message={message} userId={currentUserId} />
      ) : (
        <TouchableWithoutFeedback
          onLongPress={isDeleted ? null : handleOpenOptionModal}
          delayLongPress={500}>
          <View style={styles.receiverContainer}>
            <View style={styles.receiver} key={_id}>
              {message?.replyMessage &&
                Object.keys(message?.replyMessage).length > 0 && (
                  <MessageReply
                    message={message.replyMessage}
                    isNewMessage={false}
                  />
                )}
              {type === messageType.IMAGE ? (
                <Image
                  source={{uri: content}}
                  style={globalStyles.imageMessage}
                  onPress={() =>
                    handleViewImage(content, message.user.name, true)
                  }
                  onLongPress={handleOpenOptionModal}
                  delayLongPress={500}
                />
              ) : type === messageType.STICKER ? (
                <Image
                  source={{uri: content}}
                  style={globalStyles.stickerMessage}
                  onLongPress={handleOpenOptionModal}
                  delayLongPress={500}
                />
              ) : type === messageType.FILE ? (
                <FileMessage
                  content={content}
                  handleOpenOptionModal={handleOpenOptionModal}
                />
              ) : type === messageType.VIDEO ? (
                <TouchableOpacity
                  style={globalStyles.fileMessage}
                  onLongPress={handleOpenOptionModal}
                  delayLongPress={500}
                  onPress={() =>
                    handleViewImage(content, message.user.name, false)
                  }>
                  <View style={globalStyles.video}>
                    <Icon name="play" type="antdesign" color="#fff" size={30} />
                  </View>
                  <Text>{commonFuc.getFileName(content)}</Text>
                </TouchableOpacity>
              ) : type === messageType.HTML ? (
                <HTMLView
                  value={content}
                  stylesheet={{p: {fontSize: 13, flexWrap: 'wrap'}}}
                />
              ) : (
                <View>
                  {message?.tagUsers?.length > 0 ? (
                    <HTMLView
                      value={commonFuc.convertMessageToHtml(
                        content,
                        [...tagUsers]
                          .sort((a, b) => a.name.localeCompare(b.name))
                          .reverse(),
                      )}
                      stylesheet={{
                        p: {fontSize: 13, flexWrap: 'wrap'},
                        span: {
                          fontSize: 13,
                          flexWrap: 'wrap',
                          color: MAIN_COLOR,
                        },
                      }}
                    />
                  ) : (
                    <Text style={contentStyle}>{content}</Text>
                  )}
                  <RNUrlPreview text={content} />
                </View>
              )}
              <Text style={styles.messageTime}>{time}</Text>
            </View>
            {reactLength > 0 && (
              <TouchableOpacity
                style={{...styles.reactionContainer, right: 25}}
                onPress={handleShowReactDetails}>
                <Text style={styles.reactionText}>{reactVisibleInfo}</Text>
              </TouchableOpacity>
            )}
          </View>
        </TouchableWithoutFeedback>
      )}
      {checkLastView().length > 0 && (
        <TouchableOpacity onPress={handleLastView}>
          <View style={styles.lastView}>
            {checkLastView().map((item, index) => {
              if (index < 5) {
                return (
                  <Avatar
                    key={item._id}
                    rounded
                    title={commonFuc.getAcronym(item?.name)}
                    overlayContainerStyle={{
                      backgroundColor: OVERLAY_AVATAR_COLOR,
                    }}
                    source={
                      item?.avatar?.length > 0
                        ? {
                            uri: item.avatar,
                          }
                        : null
                    }
                    size={20}
                  />
                );
              }
              if (index === 5) {
                const numOfView = checkLastView().length - 5;
                return (
                  <Avatar
                    key={item._id}
                    rounded
                    title={`+${numOfView <= 99 ? numOfView : '99'}`}
                    overlayContainerStyle={{
                      backgroundColor: '#7562d8',
                    }}
                    source={null}
                    size={20}
                  />
                );
              }
            })}
            {/* <Text style={{fontSize: 12}}>Đã xem</Text> */}
          </View>
        </TouchableOpacity>
      )}
    </View>
  );
};

ReceiverMessage.propTypes = {
  message: PropTypes.object,
  handleOpenOptionModal: PropTypes.func,
  handleShowReactDetails: PropTypes.func,
  handleViewImage: PropTypes.func,
  onLastView: PropTypes.func,
  content: PropTypes.string,
  time: PropTypes.string,
  reactVisibleInfo: PropTypes.string,
  reactLength: PropTypes.number,
  isLastMessage: PropTypes.bool,
};

ReceiverMessage.defaultProps = {
  message: {},
  handleOpenOptionModal: null,
  handleShowReactDetails: null,
  handleViewImage: null,
  onLastView: null,
  content: '',
  time: '',
  reactVisibleInfo: '',
  reactLength: 0,
  isLastMessage: false,
};
export default ReceiverMessage;

const MIN_WIDTH_MESSAGE = 100;

const styles = StyleSheet.create({
  avatar: {
    position: 'absolute',
    top: 0,
    left: -40,
  },
  receiverContainer: {
    paddingBottom: 15,
    // backgroundColor: 'red',
    backgroundColor: 'transparent',
    alignSelf: 'flex-end',
    position: 'relative',
    maxWidth: '75%',
    minWidth: MIN_WIDTH_MESSAGE,
  },

  receiver: {
    padding: 10,
    paddingVertical: 5,
    backgroundColor: '#D5F0FF',
    alignSelf: 'flex-end',
    borderRadius: 10,
    marginRight: 15,
    // marginVertical: 10,
    position: 'relative',
    borderWidth: 1,
    borderColor: '#CADEE9',
    maxWidth: '75%',
    minWidth: MIN_WIDTH_MESSAGE,
  },

  senderContainer: {
    paddingBottom: 15,
    backgroundColor: 'transparent',
    alignSelf: 'flex-start',
    borderRadius: 10,
    position: 'relative',
    borderWidth: 1,
    borderColor: '#E5E6E7',
    maxWidth: '73%',
    minWidth: MIN_WIDTH_MESSAGE,
  },

  sender: {
    padding: 10,
    paddingVertical: 5,
    backgroundColor: '#FFF',
    alignSelf: 'flex-start',
    borderRadius: 10,
    // marginVertical: 10,
    marginLeft: 50,
    position: 'relative',
    borderWidth: 1,
    borderColor: '#E5E6E7',
    maxWidth: '73%',
    minWidth: MIN_WIDTH_MESSAGE,
  },

  messageContent: {fontSize: 16},

  messageRecall: {fontSize: 16, color: '#909CA5'},

  messageName: {color: '#218A7E', fontSize: 14, marginBottom: 4},

  messageTime: {color: '#909CA5', fontSize: 12},

  reactionContainer: {
    borderColor: '#E5E6E7',
    backgroundColor: '#FFF',
    borderRadius: 10,
    paddingVertical: 2,
    paddingHorizontal: 5,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 3,
    right: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  reactionText: {fontSize: 11},
  lastView: {
    flexDirection: 'row',
    alignSelf: 'flex-end',
    marginRight: 15,
    // backgroundColor: 'cyan',
    marginTop: -3,
    marginBottom: 8,
  },
});
