import PropTypes from 'prop-types';
import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {Avatar, Icon, Image} from 'react-native-elements';
import HTMLView from 'react-native-htmlview';
import RNUrlPreview from 'react-native-url-preview';
import {useSelector} from 'react-redux';
import {messageType} from '../../constants';
import globalStyles, {MAIN_COLOR, OVERLAY_AVATAR_COLOR} from '../../styles';
import commonFuc from '../../utils/commonFuc';
import FileMessage from './FileMessage';
import MessageNotifyDivider from './MessageNotifyDivider';
import MessageReply from './MessageReply';
import TextMention from './TextMention';

const SenderMessage = props => {
  const {
    message,
    handleOpenOptionModal,
    handleShowReactDetails,
    content,
    time,
    reactVisibleInfo,
    reactLength,
    handleViewImage,
  } = props;

  const {currentConversation} = useSelector(state => state.message);
  const {currentUserId} = useSelector(state => state.global);

  const {_id, user, isDeleted, type, tagUsers, replyMessage} = message;

  const contentStyle = isDeleted
    ? styles.messageRecall
    : message.messageContent;

  return type === messageType.NOTIFY ? (
    <MessageNotifyDivider
      message={message}
      isReceiverMessage={false}
      userId={currentUserId}
    />
  ) : (
    <TouchableWithoutFeedback
      onLongPress={isDeleted ? null : handleOpenOptionModal}
      delayLongPress={500}>
      <View style={styles.senderContainer}>
        <View
          style={[
            styles.sender,
            currentConversation?.leaderId &&
              currentConversation?.leaderId === user._id && {
                borderColor: '#89daef',
              },
          ]}
          key={_id}>
          <Avatar
            title={commonFuc.getAcronym(user.name)}
            rounded
            // source={{uri: user.avatar}}
            source={
              user.avatar?.length > 0
                ? {
                    uri: user.avatar,
                  }
                : null
            }
            overlayContainerStyle={{
              backgroundColor: user?.avatarColor || OVERLAY_AVATAR_COLOR,
            }}
            containerStyle={styles.avatar}>
            {currentConversation?.leaderId &&
              currentConversation?.leaderId === user._id && (
                <Avatar.Accessory
                  size={15}
                  type="simple-line-icon"
                  name="key"
                  color="yellow"
                />
              )}
          </Avatar>
          <Text
            style={[
              styles.messageName,
              currentConversation?.leaderId &&
                currentConversation?.leaderId === user._id && {
                  // color: '#805d51',
                  color: '#8a6a5e',
                },
            ]}>
            {user.name}
          </Text>

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
              onPress={() => handleViewImage(content, user.name, true)}
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
              onPress={() => handleViewImage(content, user.name, false)}>
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
                    span: {fontSize: 13, flexWrap: 'wrap', color: MAIN_COLOR},
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
            style={styles.reactionContainer}
            onPress={handleShowReactDetails}>
            <Text style={styles.reactionText}>{reactVisibleInfo}</Text>
          </TouchableOpacity>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
};

SenderMessage.propTypes = {
  message: PropTypes.object,
  handleOpenOptionModal: PropTypes.func,
  handleShowReactDetails: PropTypes.func,
  handleViewImage: PropTypes.func,
  content: PropTypes.string,
  time: PropTypes.string,
  reactVisibleInfo: PropTypes.string,
  reactLength: PropTypes.number,
};

SenderMessage.defaultProps = {
  message: {},
  handleOpenOptionModal: null,
  handleShowReactDetails: null,
  handleViewImage: null,
  content: '',
  time: '',
  reactVisibleInfo: '',
  reactLength: 0,
};
export default SenderMessage;

const MIN_WIDTH_MESSAGE = 100;

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'red',
    width: '100%',
  },
  avatar: {
    position: 'absolute',
    top: 0,
    left: -40,
  },

  senderContainer: {
    paddingBottom: 15,

    backgroundColor: 'transparent',
    alignSelf: 'flex-start',
    position: 'relative',
    // borderRadius: 10,
    // borderWidth: 1,
    // borderColor: 'transparent',
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
});
