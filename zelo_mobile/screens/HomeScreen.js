import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {Icon} from 'react-native-elements';
import {useDispatch, useSelector} from 'react-redux';
import Conversation from '../components/conversation/Conversation';
import MessageHeaderModal from '../components/modal/MessageHeaderModal';
import {DEFAULT_MESSAGE_PARAMS} from '../constants';
import {
  cancelMyFriendRequest,
  deleteFriend,
  deleteFriendRequest,
  fetchFriendById,
  fetchFriendRequests,
  fetchFriends,
  fetchMyFriendRequests,
  inviteFriendRequest,
} from '../redux/friendSlice';
import {fetchStickers} from '../redux/globalSlice';
import {
  addChannelMessage,
  addMessage,
  addReaction,
  clearMessages,
  deleteChannel,
  deleteMessage,
  fetchChannels,
  fetchConversations,
  fetchListLastViewer,
  fetchMessages,
  renameConversation,
  setListLastViewer,
  setNotification,
  updateAvatarConversation,
  updateChannel,
  updateCurrentConversation,
  updateVoteMessage,
  usersNotTyping,
  usersTyping,
} from '../redux/messageSlice';
import store from '../redux/store';
import globalStyles, {MAIN_COLOR} from '../styles';
import {currentKey, logout} from '../utils/commonFuc';
import {init, socket} from '../utils/socketClient';

const generateArray = length =>
  Array.from(Array(length), (_, index) => index + 1);
// let socket = io(REACT_APP_SOCKET_URL, {transports: ['websocket']});

let flag = true;

export default function HomeScreen({navigation}) {
  init();
  const dispatch = useDispatch();

  const [refreshing, setRefreshing] = useState(false);

  const channelIdRef = useRef('');

  const {conversations, isLoading, currentChannelId} = useSelector(
    state => state.message,
  );
  const {currentUserId} = useSelector(state => state.global);
  const {userProfile} = useSelector(state => state.me);

  const handleFetchConversations = async () => {
    await dispatch(fetchConversations());
    await dispatch(fetchStickers());
    dispatch(fetchFriendRequests());
    dispatch(fetchMyFriendRequests());
  };

  useEffect(() => {
    if (!conversations) return;

    const conversationIds = conversations.map(
      conversationEle => conversationEle._id,
    );

    socket.emit('join-conversations', conversationIds);
    socket.emit('join', currentUserId);
  }, [conversations]);

  useEffect(() => {
    handleFetchConversations();
  }, []);

  useEffect(() => {
    // TODO:<====================== conversation socket ======================>
    socket.on(
      'create-individual-conversation-when-was-friend',
      conversationId => {
        console.log('create-individual-conversation-when-was-friend');
        dispatch(fetchConversations());
      },
    );

    socket.on('create-individual-conversation', conversationId => {
      // handleEnterChat(conversationId);
      dispatch(fetchConversations());
    });

    socket.on('create-conversation', conversationId => {
      console.log('create-conversation');
      // handleEnterChat(conversationId);
      dispatch(fetchConversations());
    });

    socket.on(
      'rename-conversation',
      (conversationId, conversationName, message) => {
        console.log('Rename conversation');
        dispatch(
          renameConversation({conversationId, conversationName, message}),
        );
      },
    );

    socket.on('added-group', conversationId => {
      console.log('added-group');
      // handleEnterChat(conversationId);
      dispatch(fetchConversations());
    });

    socket.on('update-member', async conversationId => {
      console.log('update-member');
      // handleEnterChat(conversationId);
      await dispatch(fetchConversations());
      dispatch(updateCurrentConversation({conversationId}));
    });

    socket.on('deleted-group', conversationId => {
      console.log('deleted-group');
      socket.emit('leave-conversation', conversationId);
      dispatch(fetchConversations());
    });

    socket.on('delete-conversation', conversationId => {
      console.log('delete-conversation');
      dispatch(fetchConversations());
    });

    socket.on(
      'update-avatar-conversation',
      (conversationId, conversationAvatar, message) => {
        console.log('update-avatar-conversation');
        dispatch(
          updateAvatarConversation({
            conversationId,
            conversationAvatar,
            message,
          }),
        );
      },
    );

    // TODO:<====================== message socket ======================>
    socket.on('new-message', (conversationId, message) => {
      console.log('new-message');
      if (flag) {
        dispatch(addMessage({conversationId, message}));
      } else {
        flag = true;
      }
      dispatch(
        setNotification({conversationId, message, userId: currentUserId}),
      );
    });

    socket.on('delete-message', ({conversationId, channelId, id}) => {
      console.log('delete-message');
      dispatch(deleteMessage({conversationId, channelId, id}));
    });

    // TODO:<====================== channel socket ======================>
    socket.on('new-channel', ({_id, name, conversationId, createdAt}) => {
      dispatch(fetchChannels({conversationId}));
    });

    socket.on('update-channel', ({_id, name, conversationId}) => {
      dispatch(fetchChannels({conversationId}));
      dispatch(
        updateChannel({channelId: _id, conversationId, newChannelName: name}),
      );
    });

    socket.on('delete-channel', ({conversationId, channelId}) => {
      dispatch(deleteChannel({conversationId, channelId}));

      console.error('channelId: ', channelId);
      console.error('channelIdRef.current: ', channelIdRef.current);

      if (channelId === channelIdRef.current) {
        dispatch(clearMessages());
        dispatch(
          fetchMessages({conversationId, apiParams: DEFAULT_MESSAGE_PARAMS}),
        );
        flag = false;
      }
    });

    socket.on(
      'new-message-of-channel',
      (conversationId, channelId, message) => {
        console.log('new-message-of-channel');
        dispatch(addChannelMessage({conversationId, channelId, message}));
        // dispatch(
        //   setNotification({conversationId, message, userId: currentUserId}),
        // );
      },
    );

    // TODO:<====================== vote socket ======================>
    socket.on('update-vote-message', (conversationId, message) => {
      console.log('update-vote-message');
      dispatch(updateVoteMessage({conversationId, message}));
    });

    // TODO:<====================== reaction socket ======================>
    socket.on(
      'add-reaction',
      ({conversationId, channelId, messageId, user, type}) => {
        console.log('Add reaction: ');
        dispatch(
          addReaction({conversationId, channelId, messageId, user, type}),
        );
      },
    );

    // TODO:<====================== typing socket ======================>
    socket.on('typing', (conversationId, user) => {
      const currentUserId = store.getState()?.global?.currentUserId;
      dispatch(usersTyping({conversationId, user, currentUserId}));
    });

    socket.on('not-typing', (conversationId, user) => {
      dispatch(usersNotTyping({conversationId, user}));
    });

    // TODO:<====================== lastview socket ======================>
    socket.on(
      'user-last-view',
      ({conversationId, channelId, userId, lastView}) => {
        console.log('user-last-view');
        // currentUserId !== userId &&
        //   dispatch(fetchListLastViewer({conversationId}));
        currentUserId !== userId &&
          dispatch(
            setListLastViewer({
              conversationId,
              channelId,
              userId,
              lastView,
            }),
          );
      },
    );

    // TODO:<====================== friend socket ======================>

    socket.on('deleted-friend', userId => {
      console.log('deleted-friend');
      dispatch(deleteFriend(userId));
    });

    socket.on('accept-friend', details => {
      console.log('accept-friend');
      dispatch(cancelMyFriendRequest({userId: details._id, type: true}));
      dispatch(fetchFriends());
      dispatch(fetchFriendById({userId: details._id}));
    });

    socket.on('deleted-invite-was-send', userId => {
      console.log('deleted-invite-was-send');
      dispatch(deleteFriendRequest(userId));
      dispatch(fetchFriends());
      dispatch(fetchFriendById({userId}));
    });

    socket.on('deleted-friend-invite', userId => {
      console.log('deleted-friend-invite');
      dispatch(cancelMyFriendRequest({userId, type: false}));
      dispatch(fetchFriends());
      dispatch(fetchFriendById({userId}));
    });

    socket.on('send-friend-invite', details => {
      console.log('send-friend-invite');
      dispatch(inviteFriendRequest(details));
      dispatch(fetchFriendById({userId: details._id}));
    });

    // TODO:<====================== revoke-token socket ======================>

    socket.on('revoke-token', ({key}) => {
      if (currentKey !== key) {
        logout(dispatch);
      }
    });
  }, []);

  const handleEnterChat = (
    conversationId,
    name,
    totalMembers,
    type,
    avatar,
  ) => {
    // dispatch(clearMessagePages());
    channelIdRef.current = conversationId;
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
      channelIdRef,
    });
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    dispatch(fetchConversations());
    setRefreshing(false);
  }, []);

  return (
    <SafeAreaView>
      {conversations?.length > 0 ? (
        <FlatList
          data={conversations}
          keyExtractor={conversation => conversation._id}
          initialNumToRender={12}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          renderItem={({item}) => (
            <Pressable key={item?._id}>
              <Conversation
                name={item?.name}
                avatars={item?.avatar}
                numberUnread={item?.numberUnread}
                lastMessage={item?.lastMessage}
                handleEnterChat={handleEnterChat}
                type={item?.type}
                conversationId={item?._id}
                totalMembers={item?.totalMembers}
                avatarColor={item?.avatarColor}
              />
            </Pressable>
          )}
        />
      ) : (
        <ScrollView
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }>
          <View style={globalStyles.emty}>
            {isLoading ? (
              <ActivityIndicator size={22} color={MAIN_COLOR} />
            ) : (
              <>
                <Icon name="warning" type="antdesign" />
                <Text style={globalStyles.emptyText}>
                  Không có tin nhắn nào
                </Text>
              </>
            )}
          </View>
        </ScrollView>
      )}

      {/* <Image
          source={{
            uri: 'https://i.pinimg.com/originals/86/b3/31/86b3315f71d8e1177f32d8007aa49ceb.gif',
          }}
          style={[globalStyles.imageMessage, {width: 300, height: 200}]}
        />
        <Image
          source={{uri: 'http://www.clicktorelease.com/code/gif/1.gif'}}
          style={{width: 100, height: 100}}
        /> */}

      <MessageHeaderModal navigation={navigation} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  test: {
    alignItems: 'center',
    width: 100,
    height: 100,
  },
});
