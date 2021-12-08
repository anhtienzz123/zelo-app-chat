import PropTypes from 'prop-types';
import React, {useEffect, useRef, useState} from 'react';
import {
  Keyboard,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {MentionInput} from 'react-native-controlled-mentions';
import DocumentPicker from 'react-native-document-picker';
import {Avatar, Icon, ListItem} from 'react-native-elements';
import RNFetchBlob from 'react-native-fetch-blob';
import Spinner from 'react-native-loading-spinner-overlay';
import {useSelector} from 'react-redux';
import {messageApi} from '../../api';
import {
  DEFAULT_REPLY_MESSAGE,
  ERROR_MESSAGE,
  messageType,
} from '../../constants';
import globalStyles, {
  MAIN_COLOR,
  OVERLAY_AVATAR_COLOR,
  WINDOW_WIDTH,
} from '../../styles';
import commonFuc from '../../utils/commonFuc';
import {socket} from '../../utils/socketClient';
import MessageReply from './MessageReply';

const TAG_REGEX = /((\@)\[([^[]*)]\(([^(^)]*)\))/g;

const MessageBottomBar = props => {
  const {
    conversationId,
    showStickyBoard,
    showImageModal,
    stickyBoardVisible,
    members,
    type,
    replyMessage,
    setReplyMessage,
  } = props;
  const [messageValue, setMessageValue] = useState('');
  const {userProfile} = useSelector(state => state.me);
  const {currentChannelId} = useSelector(state => state.message);

  const [isLoading, setIsLoading] = useState(false);
  const [loadingText, setLoadingText] = useState('upload... 0%');

  const tagRef = useRef([]);

  useEffect(() => {
    const replyUser = replyMessage.replyMessage.user;

    if (type && replyMessage.isReply && userProfile._id !== replyUser._id) {
      setMessageValue(`@[${replyUser.name}](${replyUser._id}) `);
      tagRef.current = [replyUser];
    }
  }, [replyMessage]);

  const onUploadProgress = percentCompleted => {
    if (percentCompleted < 99) {
      setLoadingText(`upload... ${percentCompleted}%`);
    } else {
      setIsLoading(false);
      setLoadingText('upload... 0%');
    }
  };

  const handleShowStickyBoard = () => {
    showStickyBoard(!stickyBoardVisible);
    Keyboard.dismiss();
  };

  const handleSendMessage = async () => {
    const isNotEmpty = messageValue.replace(/\s/g, '').length;
    if (isNotEmpty) {
      Keyboard.dismiss();

      let content = messageValue;
      let tags = [];

      const tagRefCurrent = tagRef.current;
      if (tagRefCurrent.length > 0) {
        tagRefCurrent.map(tagEle => {
          tags.push(tagEle._id);
          if (content.includes(`@[${tagEle.name}](${tagEle._id})`))
            content = content.replace(
              `@[${tagEle.name}](${tagEle._id})`,
              `@${tagEle.name}`,
            );
        });

        // tags = tagRefCurrent.map(tag => tag._id);
        // const tagList = content.match(TAG_REGEX);
        // if (tagList.length > 0) {
        //   tagList.map(tagEle => {
        //     const tagReplace = tagEle.replace(
        //       `@[${tagEle.name}](${tagEle._id})`,
        //       `@${tagEle.name}`,
        //     );

        //     if (content.includes(tagEle))
        //       content = content.replace(tagEle, tagReplace);
        //   });
        // }
      }

      const replyMessageId = replyMessage.isReply
        ? replyMessage.replyMessage._id
        : null;

      const channelId =
        currentChannelId !== conversationId ? currentChannelId : null;

      const newMessage = {
        content,
        type: 'TEXT',
        conversationId,
        tags,
        replyMessageId,
        channelId,
      };

      // messageApi
      //   .sendMessage(newMessage)
      //   .then(res => {
      //     socket.emit('not-typing', conversationId, userProfile);
      //     tagRef.current = [];
      //     replyMessage.isReply && setReplyMessage(DEFAULT_REPLY_MESSAGE);
      //   })
      //   .catch(err => console.error('Send Message Fail', err));

      try {
        await messageApi.sendMessage(newMessage);
        socket.emit('not-typing', conversationId, userProfile);
        tagRef.current = [];
        replyMessage.isReply && setReplyMessage(DEFAULT_REPLY_MESSAGE);
      } catch (error) {
        console.error('Send Message Fail', err);
        commonFuc.notifyMessage(ERROR_MESSAGE);
      }
    } else {
    }
    setMessageValue('');
  };

  const handleOnChangeTextInput = value => {
    setMessageValue(value);

    if (value.length > 0) {
      currentChannelId === conversationId &&
        socket.emit('typing', conversationId, userProfile);
    } else {
      socket.emit('not-typing', conversationId, userProfile);
    }

    const oldTag = tagRef.current;

    if (oldTag.length > 0) {
      const newTag = oldTag.filter(ele =>
        value.includes(`@[${ele.name}](${ele._id})`),
      );
      tagRef.current = newTag;
    }
  };

  const handleOnTextInputTouch = () => {
    socket.emit('conversation-last-view', conversationId, currentChannelId);
  };

  const selectFile = async () => {
    // Opening Document Picker to select one file
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
      });
      handleUploadFile(res);
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        commonFuc.notifyMessage('Đã hủy');
      } else {
        commonFuc.notifyMessage(ERROR_MESSAGE);
        throw err;
      }
    }
  };

  const handleUploadFile = async singleFile => {
    if (singleFile) {
      const fileToUpload = singleFile[0];

      const type = fileToUpload.type.includes('video')
        ? messageType.VIDEO
        : fileToUpload.type.includes('image')
        ? messageType.IMAGE
        : messageType.FILE;

      const channelId =
        currentChannelId !== conversationId ? currentChannelId : null;

      const params = {
        type,
        conversationId: conversationId,
        channelId,
      };

      if (fileToUpload.size > 20000000) {
        // if (fileToUpload.size > 20971520) {
        commonFuc.notifyMessage('Tối đa 20Mb');
      } else {
        try {
          setIsLoading(true);
          const fileBase64 = await RNFetchBlob.fs.readFile(
            fileToUpload.uri,
            'base64',
          );

          const body = {
            fileName: fileToUpload.name.split('.')[0],
            fileExtension: '.' + fileToUpload.name.split('.')[1],
            fileBase64,
          };

          try {
            await messageApi.sendFileBase64Message(
              body,
              params,
              onUploadProgress,
            );
          } catch (error) {
            console.error(error);
          }
        } catch (error) {
          console.error(error);
          setIsLoading(false);
          commonFuc.notifyMessage('Có lõi xảy ra');
        }
      }
    } else {
      commonFuc.notifyMessage('Chưa chọn file');
    }
  };

  const renderSuggestions =
    suggestions =>
    ({keyword, onSuggestionPress}) => {
      if (keyword == null) {
        return null;
      }

      return (
        <View style={styles.suggestion}>
          <ScrollView>
            {suggestions
              .filter(item =>
                item.name
                  .toLocaleLowerCase()
                  .includes(keyword.toLocaleLowerCase()),
              )
              .map((item, index) => {
                const findTagIndex = tagRef.current.findIndex(
                  ele => ele._id === item._id,
                );
                return (
                  findTagIndex < 0 &&
                  userProfile._id !== item._id && (
                    <TouchableOpacity
                      key={item._id}
                      onPress={() => {
                        onSuggestionPress(item);
                        tagRef.current.push(item);
                      }}>
                      <ListItem
                        containerStyle={{
                          paddingVertical: 5,
                        }}>
                        <Avatar
                          title={commonFuc.getAcronym(item.name)}
                          rounded
                          avatars={item.avatars}
                          totalMembers={1}
                          source={
                            item.avatar?.length > 0
                              ? {
                                  uri: item.avatar,
                                }
                              : null
                          }
                          overlayContainerStyle={{
                            backgroundColor: OVERLAY_AVATAR_COLOR,
                          }}
                        />

                        <ListItem.Content>
                          <ListItem.Title
                            style={{
                              width: '100%',
                              fontWeight: 'normal',
                            }}>
                            {item.name}
                          </ListItem.Title>
                        </ListItem.Content>
                      </ListItem>
                    </TouchableOpacity>
                  )
                );
              })}
          </ScrollView>
        </View>
      );
    };

  const renderMentionSuggestions = renderSuggestions(members);

  return (
    <>
      {replyMessage.isReply && (
        <View
          style={{
            width: '100%',
            backgroundColor: '#fff',
            paddingHorizontal: 15,
            paddingVertical: 8,
          }}>
          <MessageReply
            message={replyMessage.replyMessage}
            onClose={() => setReplyMessage(DEFAULT_REPLY_MESSAGE)}
            isNewMessage={true}
          />
        </View>
      )}

      <View style={styles.footer}>
        <Spinner
          visible={isLoading}
          textContent={loadingText}
          textStyle={globalStyles.spinnerTextStyle}
        />
        <TouchableOpacity
          onPress={handleShowStickyBoard}
          style={{
            paddingBottom: 8,
          }}>
          <View>
            <Icon name="sticker-emoji" type="material-community" size={22} />
          </View>
        </TouchableOpacity>

        {type ? (
          <MentionInput
            placeholder="Tin nhắn, @"
            value={messageValue}
            onChange={value => handleOnChangeTextInput(value)}
            onFocus={() => showStickyBoard(false)}
            onBlur={() =>
              socket.emit('not-typing', conversationId, userProfile)
            }
            style={styles.mentionInput}
            containerStyle={[
              styles.textInput,
              {
                paddingHorizontal: 10,
                paddingVertical: 0,
              },
            ]}
            multiline
            editable
            onTouchStart={handleOnTextInputTouch}
            partTypes={[
              {
                trigger: '@',
                renderSuggestions: renderMentionSuggestions,
                textStyle: {color: MAIN_COLOR},
              },
            ]}
          />
        ) : (
          <TextInput
            placeholder="Tin nhắn, @"
            value={messageValue}
            onChangeText={value => handleOnChangeTextInput(value)}
            onFocus={() => showStickyBoard(false)}
            onBlur={() =>
              socket.emit('not-typing', conversationId, userProfile)
            }
            style={[
              styles.textInput,
              {maxHeight: 110, padding: 10, paddingVertical: 5},
            ]}
            multiline
            editable
            onTouchStart={handleOnTextInputTouch}
          />
        )}

        {messageValue ? (
          <TouchableOpacity
            style={{
              paddingBottom: 8,
            }}
            onPress={handleSendMessage}>
            <Icon name="send" type="ionicon" size={22} color={MAIN_COLOR} />
          </TouchableOpacity>
        ) : (
          <>
            <TouchableOpacity
              style={{
                paddingBottom: 8,
                marginRight: 10,
              }}
              onPress={selectFile}>
              <Icon
                name="ellipsis-horizontal-outline"
                type="ionicon"
                size={22}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                paddingBottom: 8,
              }}
              onPress={() => showImageModal(true)}>
              <Icon name="image-outline" type="ionicon" size={22} />
            </TouchableOpacity>
          </>
        )}
      </View>
    </>
  );
};

export default MessageBottomBar;

MessageBottomBar.propTypes = {
  conversationId: PropTypes.string,
  showStickyBoard: PropTypes.func,
  showImageModal: PropTypes.func,
  stickyBoardVisible: PropTypes.bool,
  members: PropTypes.array,
  replyMessage: PropTypes.object,
  setReplyMessage: PropTypes.func,
};

MessageBottomBar.defaultProps = {
  conversationId: '',
  showStickyBoard: null,
  showImageModal: null,
  stickyBoardVisible: false,
  members: [],
  replyMessage: DEFAULT_REPLY_MESSAGE,
  setReplyMessage: null,
};

const styles = StyleSheet.create({
  footer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    width: '100%',
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: '#D0D2D3',
    backgroundColor: '#FFF',
    zIndex: 300, // works on ios
    elevation: 300, // works on android
  },
  textInput: {
    bottom: 0,
    // maxHeight: 282.3529357910156,
    flex: 1,
    marginRight: 15,
    borderColor: 'transparent',
    backgroundColor: '#fff',
    // backgroundColor: 'pink',
    borderWidth: 1,
    borderRadius: 10,
    fontSize: 18,
    fontWeight: '500',
    color: '#000',
  },
  mentionInput: {
    padding: 6,
    fontSize: 18,
    borderTopWidth: 1,
    borderTopColor: 'lightgrey',
    width: '100%',
    // backgroundColor: 'cyan',
    maxHeight: 110,
    borderTopWidth: 0,
    color: '#000',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
  },
  headerSubTitle: {
    color: '#fff',
    fontSize: 12,
  },
  suggestion: {
    maxHeight: 150,
    width: WINDOW_WIDTH,
    // backgroundColor: 'grey',
    marginLeft: -50,
    borderBottomWidth: 1,
    borderBottomColor: '#D0D2D3',
  },
});
