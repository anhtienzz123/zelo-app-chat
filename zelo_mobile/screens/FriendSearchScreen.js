import React, {useEffect, useRef, useState} from 'react';
import {FlatList, SafeAreaView, StyleSheet, Text, View} from 'react-native';
import {Avatar, Button, Icon, Input, ListItem} from 'react-native-elements';
import {ScrollView, TouchableOpacity} from 'react-native-gesture-handler';
import {useDispatch, useSelector} from 'react-redux';
import {conversationApi, friendApi} from '../api';
import FriendItem from '../components/FriendItem';
import {ERROR_MESSAGE, friendType} from '../constants';
import {
  clearMessagePages,
  fetchConversations,
  fetchListLastViewer,
  fetchMembers,
  setCurrentChannel,
  updateCurrentConversation,
} from '../redux/messageSlice';
import {GREY_COLOR, OVERLAY_AVATAR_COLOR_GREY} from '../styles';
import commonFuc from '../utils/commonFuc';

export default function FriendSearchScreen({navigation, route}) {
  const {isAddToGroup, currentConversationId} = route.params;
  const dispatch = useDispatch();
  const {listFriends} = useSelector(state => state.friend);
  const {members} = useSelector(state => state.message);

  const [friendList, setFriendList] = useState(listFriends);
  const [listAddToGroup, setListAddToGroup] = useState([]);
  const [errorText, setErrorText] = useState('');

  const nameRef = useRef('');
  const inputRef = useRef('');
  const typingTimeoutRef = useRef(null);

  useEffect(() => {
    navigation.setOptions({
      title: currentConversationId
        ? 'Thêm thành viên'
        : isAddToGroup
        ? 'Tạo nhóm mới'
        : 'Tìm kiếm bạn bè',
    });
  }, [navigation]);

  const handleSearchFriendChange = userName => {
    inputRef.current = userName;

    // if (typingTimeoutRef.current) {
    //   clearTimeout(typingTimeoutRef.current);
    // }

    // typingTimeoutRef.current = setTimeout(() => {
    //   handleSearchFriendSubmit(userName);
    // }, 250);

    const friendSearchs = listFriends.filter(ele =>
      ele.name.toLowerCase().includes(userName.toLowerCase()),
    );
    setFriendList(friendSearchs);
  };

  const handleSearchFriendSubmit = async userName => {
    try {
      // const response = await userApi.fetchUsers(userName);
      const response = await friendApi.fetchFriends({name: userName});
      setFriendList(response);
      response.length === 0 && commonFuc.notifyMessage('Không tìm thấy');
    } catch (error) {
      commonFuc.notifyMessage('Không tìm thấy');
      console.error(error);
    }
  };
  // const handleSearchFriendSubmit = async userName => {
  //   try {
  //     // const response = await userApi.fetchUsers(userName);
  //     const response = await friendApi.fetchFriends({name: userName});
  //     setFriendList(response);
  //     response.length === 0 && commonFuc.notifyMessage('Không tìm thấy');
  //   } catch (error) {
  //     commonFuc.notifyMessage('Không tìm thấy');
  //   }
  // };

  const handleAddToGroup = item => {
    const listAddToGroupNew = [...listAddToGroup, item];
    setListAddToGroup(listAddToGroupNew);
  };
  const handleRemoveFromGroup = itemId => {
    const listAddToGroupNew = listAddToGroup.filter(ele => ele._id !== itemId);

    setListAddToGroup(listAddToGroupNew);
  };

  const handleOnchangeText = value => {
    nameRef.current = value.trim();

    if (/^(?!\s+$).+/.test(value.trim())) {
      errorText.length > 0 && setErrorText('');
    } else {
      setErrorText('Tên nhóm không hợp lệ');
    }
  };

  const handleCreateGroup = async () => {
    const name = nameRef.current;

    if (typeof name !== 'string') {
      setErrorText('Tên nhóm không hợp lệ');
      return;
    }

    if (name.length <= 0) {
      setErrorText('Tên nhóm không hợp lệ');
      return;
    }
    if (!/^(?!\s+$).+/.test(name)) {
      setErrorText('Tên nhóm không hợp lệ');
      return;
    }

    if (listAddToGroup.length === 0) {
      setErrorText('Nhóm chưa có thành viên');
      return;
    }

    const userIds = listAddToGroup.map(ele => ele._id);
    try {
      const response = await conversationApi.createGroup(name, userIds);
      await dispatch(fetchConversations());
      const conversationId = response._id;
      handleEnterChat(conversationId);
    } catch (error) {
      commonFuc.notifyMessage(ERROR_MESSAGE);
      console.error('Create group: ', error);
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
    navigation.replace('Nhắn tin', {
      conversationId,
    });
  };

  const handleAddMembers = async () => {
    if (listAddToGroup.length === 0) {
      setErrorText('Bạn chưa thêm thành viên');
      return;
    }

    const userIds = listAddToGroup.map(ele => ele._id);
    try {
      const response = await conversationApi.addMembers(
        currentConversationId,
        userIds,
      );
      navigation.goBack('Nhắn tin');
    } catch (error) {
      commonFuc.notifyMessage(ERROR_MESSAGE);
      console.error('Create group: ', error);
    }
  };

  return (
    <SafeAreaView>
      {isAddToGroup && (
        <>
          {!currentConversationId && (
            <ListItem
              containerStyle={{
                padding: 0,
                // backgroundColor: 'pink',
                // paddingHorizontal: 0,
              }}>
              <Input
                ref={nameRef}
                rightIcon={
                  <Button
                    icon={
                      <Icon
                        type="antdesign"
                        name="arrowright"
                        color="#fff"
                        // size={15}
                      />
                    }
                    containerStyle={{borderRadius: 50}}
                    buttonStyle={{borderRadius: 50}}
                    onPress={handleCreateGroup}
                  />
                }
                // rightIcon={{type: 'ionicon', name: 'search', color: GREY_COLOR}}
                renderErrorMessage={false}
                inputContainerStyle={{
                  width: '100%',
                  borderBottomWidth: 0,
                  borderRadius: 50,
                  // backgroundColor: 'red',
                  // paddingHorizontal: 15,
                  // marginHorizontal: 0,
                }}
                // inputStyle={{marginHorizontal: 0, padding: 0}}
                placeholder="Đặt tên nhóm"
                onChangeText={value => handleOnchangeText(value)}
              />
            </ListItem>
          )}
          <View
            style={{
              backgroundColor: '#fff',
              paddingHorizontal: 15,
              paddingVertical: 8,
            }}>
            {errorText.length > 0 && (
              <Text style={{color: 'red', marginBottom: 8}}>{errorText}</Text>
            )}
            <ScrollView>
              <View
                style={{
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  justifyContent: 'flex-start',
                  alignContent: 'center',
                  alignItems: 'center',
                }}>
                {listAddToGroup.length > 0 &&
                  listAddToGroup.map(item => (
                    <TouchableOpacity
                      key={item._id}
                      style={{marginRight: 8}}
                      onPress={() => handleRemoveFromGroup(item._id)}>
                      <Avatar
                        rounded
                        title={commonFuc.getAcronym(item.name)}
                        overlayContainerStyle={{
                          backgroundColor: item?.avatarColor,
                        }}
                        source={
                          item?.avatar?.length > 0
                            ? {
                                uri: item.avatar,
                              }
                            : null
                        }
                        size="medium">
                        <Avatar.Accessory name="x" type="feather" />
                      </Avatar>
                    </TouchableOpacity>
                  ))}
                {currentConversationId && listAddToGroup.length > 0 && (
                  <Button
                    icon={
                      <Icon
                        type="antdesign"
                        name="arrowright"
                        color="#fff"
                        // size={15}
                      />
                    }
                    containerStyle={{borderRadius: 50}}
                    buttonStyle={{borderRadius: 50}}
                    onPress={handleAddMembers}
                  />
                )}
              </View>
            </ScrollView>
          </View>
        </>
      )}

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
          placeholder="Tìm kiếm theo tên"
          onChangeText={value => handleSearchFriendChange(value)}
        />
      </ListItem>

      <FlatList
        data={friendList}
        keyExtractor={(item, index) => item._id}
        initialNumToRender={12}
        renderItem={({item}) => {
          const isExists = listAddToGroup.some(ele => ele._id === item._id);

          const type = !isAddToGroup
            ? friendType.FRIEND
            : isExists
            ? friendType.REMOVE_FROM_GROUP
            : friendType.ADD_TO_GROUP;
          let isShowButton = true;
          if (currentConversationId) {
            isShowButton = !members.some(ele => ele._id === item._id);
          }

          return (
            <TouchableOpacity
            // onPress={
            //   item.isExists ? () => handleGoToPersonalScreen(item._id) : null
            // }
            >
              <View style={{backgroundColor: '#fff'}}>
                <FriendItem
                  name={item.name}
                  avatar={item?.avatar}
                  type={type}
                  userId={item?._id}
                  navigation={navigation}
                  avatarColor={item?.avatarColor}
                  handleGroup={
                    !isAddToGroup
                      ? null
                      : () =>
                          isExists
                            ? handleRemoveFromGroup(item._id)
                            : handleAddToGroup(item)
                  }
                  isShowButton={isShowButton}
                />
                <View
                  style={{
                    width: '100%',
                    backgroundColor: '#E5E6E8',
                    height: 1,
                    marginLeft: 82,
                  }}></View>
              </View>
            </TouchableOpacity>
          );
        }}
      />
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
