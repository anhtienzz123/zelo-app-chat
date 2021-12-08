import PropTypes from 'prop-types';
import React from 'react';
import {View, Text} from 'react-native';
import {Icon, ListItem} from 'react-native-elements';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {DEFAULT_REPLY_MESSAGE, messageType} from '../../constants';
import {GREY_COLOR, MAIN_COLOR, WINDOW_WIDTH} from '../../styles';
import commonFuc from '../../utils/commonFuc';

const MessageReply = props => {
  const {message, onClose, isNewMessage} = props;

  const getReplyMessageContent = message => {
    if (!message?.type) return '';
    let content = message.content;
    switch (message.type) {
      case messageType.IMAGE:
        content = '[Hình ảnh]';
        break;
      case messageType.STICKER:
        content = '[Nhãn dán]';
        break;
      case messageType.HTML:
        content = '[Văn bản]';
        break;
      case messageType.VIDEO:
        const fileNameVideo = commonFuc.getFileName(message.content);
        content = `[Video] ${fileNameVideo}`;
        break;
      case messageType.FILE:
        const fileName = commonFuc.getFileName(message.content);
        content = `[File] ${fileName}`;
        break;
      default:
        content = message.content;
        break;
    }

    return content;
  };

  return (
    <ListItem
      containerStyle={{
        paddingHorizontal: 8,
        paddingVertical: 2,
        backgroundColor: 'transparent',
        width: isNewMessage ? '100%' : WINDOW_WIDTH / 2,
      }}
      style={{
        borderLeftWidth: 3,
        borderLeftColor: MAIN_COLOR,
      }}>
      <ListItem.Content>
        <ListItem.Title
          style={{
            width: '100%',
            fontWeight: 'bold',
            fontSize: 13,
          }}
          numberOfLines={1}>
          {message?.user?.name}
        </ListItem.Title>
        <ListItem.Subtitle
          style={{
            width: '100%',
            fontWeight: 'normal',
            fontSize: 12,
          }}
          numberOfLines={1}>
          {getReplyMessageContent(message)}
        </ListItem.Subtitle>
      </ListItem.Content>
      {isNewMessage && (
        <TouchableOpacity onPress={onClose}>
          <Icon
            type="antdesign"
            name="close"
            color={GREY_COLOR}
            // containerStyle={{
            //   // backgroundColor: "red",
            //   flexDirection: 'row',
            //   alignItems: 'flex-end',
            //   justifyContent: 'center',
            // }}
          />
        </TouchableOpacity>
      )}
    </ListItem>
  );
};

MessageReply.propTypes = {
  message: PropTypes.object,
  onClose: PropTypes.func,
  isNewMessage: PropTypes.bool,
};

MessageReply.defaultProps = {
  message: {},
  onClose: null,
  isNewMessage: true,
};
export default MessageReply;
