import React, {useRef, useState} from 'react';
import {FlatList, Pressable, SafeAreaView, StyleSheet} from 'react-native';
import {Input, ListItem} from 'react-native-elements';
import {useDispatch, useSelector} from 'react-redux';
import Conversation from '../components/conversation/Conversation';
import EmptyData from '../components/EmptyData';
import {GREY_COLOR, OVERLAY_AVATAR_COLOR_GREY} from '../styles';

export default function ConversationSearchScreen({navigation, route}) {
  const dispatch = useDispatch();
  const {conversations} = useSelector(state => state.message);

  const [conversationList, setConversationList] = useState(conversations);
  const [errorText, setErrorText] = useState('');

  const inputRef = useRef('');
  const channelIdRef = useRef('');

  const handleSearchFriendChange = conversationName => {
    inputRef.current = conversationName;
    const conversationsSearch = conversations.filter(ele =>
      ele.name.toLowerCase().includes(conversationName.toLowerCase()),
    );
    setConversationList(conversationsSearch);
  };

  const handleEnterChat = (
    conversationId,
    name,
    totalMembers,
    type,
    avatar,
  ) => {
    channelIdRef.current = conversationId;
    navigation.navigate('Nhắn tin', {
      conversationId,
      channelIdRef,
    });
  };

  return (
    <SafeAreaView>
      <ListItem
        containerStyle={{
          // padding: 0,
          // backgroundColor: 'pink',
          paddingHorizontal: 0,
        }}>
        <Input
          ref={inputRef}
          leftIcon={{type: 'ionicon', name: 'search', color: GREY_COLOR}}
          renderErrorMessage={false}
          inputContainerStyle={{
            width: '100%',
            borderBottomWidth: 0,
            borderRadius: 5,
            backgroundColor: OVERLAY_AVATAR_COLOR_GREY,
            paddingHorizontal: 10,
            paddingVertical: 0,
            marginHorizontal: 0,
          }}
          inputStyle={{marginHorizontal: 0, padding: 0}}
          placeholder="Tìm kiếm cuộc trò chuyện"
          onChangeText={value => handleSearchFriendChange(value)}
        />
      </ListItem>

      <FlatList
        data={conversationList}
        keyExtractor={conversation => conversation._id}
        initialNumToRender={12}
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

      {conversationList.length === 0 && inputRef.current.length > 0 && (
        <EmptyData content="Không tìm thấy" />
      )}
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
  badgeElement: {color: 'white', fontSize: 10},
  iconBadge: {
    color: 'white',
    fontSize: 10,
    width: 15,
    height: 15,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF5B05',
    marginTop: -26,
    marginLeft: 14,
  },
  overlay: {
    backgroundColor: OVERLAY_AVATAR_COLOR_GREY,
  },
});
