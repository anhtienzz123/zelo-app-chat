import PropTypes from 'prop-types';
import React from 'react';
import {Linking, Platform, StyleSheet, View} from 'react-native';
import {Avatar, Button, ListItem} from 'react-native-elements';
import {useDispatch, useSelector} from 'react-redux';
import {conversationApi, friendApi} from '../api';
import {ERROR_MESSAGE, friendType} from '../constants';
import {
  addNewFriendRequest,
  cancelMyFriendRequest,
  deleteFriendRequest,
  fetchFriends,
  updateFriendStatus,
} from '../redux/friendSlice';
import {
  clearMessagePages,
  fetchConversations,
  fetchListLastViewer,
  fetchMembers,
  setCurrentChannel,
  updateCurrentConversation,
} from '../redux/messageSlice';
import {OVERLAY_AVATAR_COLOR} from '../styles';
import commonFuc, {handleCreateChat} from '../utils/commonFuc';

export default function FriendItem(props) {
  const {
    type,
    name,
    avatar,
    topDivider,
    userId,
    navigation,
    handleGroup,
    avatarColor,
    isShowButton,
  } = props;

  const {currentConversationId} = useSelector(state => state.message);

  const dispatch = useDispatch();

  const buttonTitle =
    type === friendType.FRIEND
      ? 'Nhắn tin'
      : type === friendType.FOLLOWER
      ? 'Đồng ý'
      : type === friendType.YOU_FOLLOW
      ? 'Hủy yêu cầu'
      : 'Kết bạn';

  const getButtonTitle = () => {
    let title = 'Kết bạn';
    switch (type) {
      case friendType.FRIEND:
        title = 'Nhắn tin';
        break;
      case friendType.FOLLOWER:
        title = 'Đồng ý';
        break;
      case friendType.YOU_FOLLOW:
        title = 'Hủy yêu cầu';
        break;
      case friendType.DONT_HAVE_ACCOUNT:
        title = 'Mời';
        break;
      case friendType.ADD_TO_GROUP:
        title = 'Thêm';
        break;
      case friendType.REMOVE_FROM_GROUP:
        title = 'Xóa';
        break;
      case 'DETAILS':
        title = 'Chi tiết';
        break;
      default:
        title = 'Kết bạn';
        break;
    }
    return title;
  };

  const handleOnPress = () => {
    switch (type) {
      case friendType.FRIEND:
        handleCreateChat(userId, navigation, dispatch, currentConversationId);
        break;
      case friendType.FOLLOWER:
        handleAcceptFriend();
        break;
      case friendType.YOU_FOLLOW:
        handleDeleteMyFriendRequest();
        break;
      case friendType.NOT_FRIEND:
        handleAddFriendRequest();
        break;
      case friendType.ADD_TO_GROUP:
        handleGroup();
        break;
      case friendType.REMOVE_FROM_GROUP:
        handleGroup();
        break;
      case friendType.DONT_HAVE_ACCOUNT:
        const messageBody =
          'Moi ban cai dat Zelo de nhan tin va goi dien thoai mien phi: https://zelochat.xyz';

        const url = `sms:${userId}${
          Platform.OS === 'ios' ? '&' : '?'
        }body=${messageBody}`;

        Linking.openURL(url);
        break;
      case 'DETAILS':
        break;
      default:
        break;
    }
  };

  const handleAddFriendRequest = async () => {
    try {
      const response = await friendApi.addFriendRequest(userId);
      dispatch(updateFriendStatus(friendType.YOU_FOLLOW));
      dispatch(addNewFriendRequest());
    } catch (error) {
      console.error(error);
      commonFuc.notifyMessage(ERROR_MESSAGE);
    }
  };
  const handleDeleteMyFriendRequest = async () => {
    try {
      const response = await friendApi.deleteMyFriendRequest(userId);
      dispatch(updateFriendStatus(friendType.NOT_FRIEND));
      dispatch(cancelMyFriendRequest(userId));
    } catch (error) {
      console.error(error);
      commonFuc.notifyMessage(ERROR_MESSAGE);
    }
  };

  const handleDeleteFriendRequest = async () => {
    try {
      const response = await friendApi.deleteFriendRequest(userId);
      dispatch(updateFriendStatus(friendType.NOT_FRIEND));
      dispatch(deleteFriendRequest(userId));
    } catch (error) {
      console.error(error);
      commonFuc.notifyMessage(ERROR_MESSAGE);
    }
  };
  const handleAcceptFriend = async () => {
    try {
      const response = await friendApi.acceptFriend(userId);
      dispatch(updateFriendStatus(friendType.FRIEND));
      dispatch(deleteFriendRequest(userId));
      dispatch(fetchFriends());
    } catch (error) {
      console.error(error);
      commonFuc.notifyMessage(ERROR_MESSAGE);
    }
  };

  const handleCreateChat = async userId => {
    try {
      const response = await conversationApi.addConversation(userId);
      await dispatch(fetchConversations());
      // if (response?.isExists) {
      handleEnterChat(response._id);
      // }
    } catch (error) {
      console.error('CreateChat', error);
      commonFuc.notifyMessage(ERROR_MESSAGE);
    }
  };

  const handleEnterChat = conversationId => {
    dispatch(clearMessagePages());
    // dispatch(updateCurrentConversation({conversationId}));
    // dispatch(
    //   setCurrentChannel({
    //     currentChannelId: conversationId,
    //     currentChannelName: conversationId,
    //   }),
    // );
    // dispatch(fetchListLastViewer({conversationId}));
    // dispatch(fetchMembers({conversationId}));
    navigation.navigate('Nhắn tin', {
      conversationId,
    });
  };

  const handleInvite = userId => {};

  return (
    <ListItem
      topDivider={topDivider}
      // bottomDivider={false}
    >
      <Avatar
        rounded
        title={commonFuc.getAcronym(name)}
        overlayContainerStyle={{backgroundColor: avatarColor}}
        source={
          avatar.length > 0
            ? {
                uri: avatar,
              }
            : null
        }
        size="medium"
      />
      <ListItem.Content>
        <ListItem.Title numberOfLines={1}>{name}</ListItem.Title>
        {/* <ListItem.Subtitle
                        numberOfLines={
                          1
                        }>{`${senderName}${content}`}</ListItem.Subtitle> */}
      </ListItem.Content>
      {/* <MessageInfo
                      createdAt={createdAt}
                      numberUnread={numberUnread}
                    /> */}
      <View style={styles.buttonWrap}>
        {type === friendType.FOLLOWER && (
          <Button
            containerStyle={styles.buttonContainer}
            buttonStyle={styles.buttonStyle}
            titleStyle={styles.buttonTitle}
            title="Từ chối"
            type="outline"
            onPress={handleDeleteFriendRequest}
          />
        )}
        {isShowButton && (
          <Button
            title={getButtonTitle()}
            type={
              type === friendType.YOU_FOLLOW ||
              type === friendType.REMOVE_FROM_GROUP ||
              type === friendType.DONT_HAVE_ACCOUNT
                ? 'outline'
                : 'solid'
            }
            buttonStyle={styles.buttonStyle}
            titleStyle={styles.buttonTitle}
            onPress={handleOnPress}
          />
        )}
      </View>
    </ListItem>
  );
}

FriendItem.propTypes = {
  type: PropTypes.string,
  name: PropTypes.string,
  avatar: PropTypes.string,
  avatarColor: PropTypes.string,
  userId: PropTypes.string,
  topDivider: PropTypes.bool,
  isShowButton: PropTypes.bool,
  handleGroup: PropTypes.func,
};

FriendItem.defaultProps = {
  type: friendType.FRIEND,
  name: '',
  avatar: '',
  userId: '',
  topDivider: false,
  isShowButton: true,
  handleGroup: null,
  avatarColor: OVERLAY_AVATAR_COLOR,
};

const styles = StyleSheet.create({
  buttonWrap: {
    // backgroundColor: "red",
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  buttonStyle: {
    borderRadius: 50,
    paddingHorizontal: 15,
    paddingVertical: 5,
    minWidth: 60,
  },
  buttonTitle: {fontSize: 13},
  buttonContainer: {
    marginRight: 10,
    minWidth: 60,
  },
});
