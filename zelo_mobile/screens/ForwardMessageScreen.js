import React, {useState} from 'react';
import {FlatList, SafeAreaView, StyleSheet, Text, View} from 'react-native';
import {Button, Icon, Input, ListItem} from 'react-native-elements';
import {ScrollView, TouchableOpacity} from 'react-native-gesture-handler';
import {useDispatch, useSelector} from 'react-redux';
import {messageApi} from '../api';
import Conversation from '../components/conversation/Conversation';
import CustomAvatar from '../components/CustomAvatar';
import {ERROR_MESSAGE} from '../constants';
import {useGoback} from '../hooks';
import {GREY_COLOR, OVERLAY_AVATAR_COLOR_GREY} from '../styles';
import commonFuc from '../utils/commonFuc';

export default function ForwardMessageScreen({navigation, route}) {
  const {messageId} = route.params;
  const {conversations} = useSelector(state => state.message);
  const {userProfile} = useSelector(state => state.me);

  const dispatch = useDispatch();
  useGoback(navigation);

  const [listConversations, setListConversations] = useState(conversations);
  const [listForward, setListForward] = useState([]);
  const [errorText, setErrorText] = useState('');

  const handleOnchangeText = text => {
    const conversationSearchs = conversations.filter(ele =>
      ele.name.toLowerCase().includes(text.toLowerCase()),
    );
    setListConversations(conversationSearchs);
  };

  const handleOnSeleted = (conversation, isChecked) => {
    let newListForward = [...listForward];
    if (isChecked) {
      newListForward.push(conversation);
    } else {
      newListForward = listForward.filter(ele => ele._id !== conversation._id);
    }

    setListForward(newListForward);
  };

  const handleRemoveFromList = conversationId => {
    let newListForward = listForward.filter(ele => ele._id !== conversationId);
    setListForward(newListForward);
  };

  const handleForWard = async () => {
    const conversationIds = listForward.map(ele => ele._id);
    for (let conversationId of conversationIds) {
      try {
        await messageApi.forwardMessage(messageId, conversationId);
      } catch (error) {
        console.error('Forward: ', error);
        commonFuc.notifyMessage(ERROR_MESSAGE);
      }
    }
    commonFuc.notifyMessage('Chuyển tiếp thành công');
    navigation.goBack();
  };

  return (
    <SafeAreaView>
      {listForward.length > 0 && (
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
              {listForward.map(item => (
                <TouchableOpacity
                  key={item._id}
                  style={{marginRight: 8, marginBottom: 8}}
                  onPress={() => handleRemoveFromList(item._id)}>
                  <CustomAvatar
                    name={item.name}
                    avatars={item.avatar}
                    totalMembers={item.totalMembers}
                    avatarColor={item?.avatarColor}
                  />
                </TouchableOpacity>
              ))}

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
                onPress={handleForWard}
              />
            </View>
          </ScrollView>
        </View>
      )}

      <ListItem
        containerStyle={{
          // padding: 0,
          // backgroundColor: 'pink',
          paddingHorizontal: 0,
        }}>
        <Input
          // ref={inputRef}
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
          onChangeText={value => handleOnchangeText(value)}
        />
      </ListItem>

      <FlatList
        data={listConversations}
        keyExtractor={item => item._id}
        initialNumToRender={12}
        renderItem={({item}) => {
          const findIndex = listForward.findIndex(ele => ele._id === item._id);
          const isChecked = findIndex >= 0;
          return (
            <TouchableOpacity
              key={item?._id}
              onPress={() => handleOnSeleted(item, !isChecked)}>
              <Conversation
                name={item?.name}
                avatars={item?.avatar}
                numberUnread={item?.numberUnread}
                lastMessage={item?.lastMessage}
                type={item?.type}
                conversationId={item?._id}
                totalMembers={item?.totalMembers}
                isForward={true}
                checked={isChecked}
                avatarColor={item?.avatarColor}
              />
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
  bottomDivider: {
    width: '100%',
    backgroundColor: '#E5E6E8',
    height: 1,
    marginLeft: 82,
    // alignItems: "center",
    // justifyContent: "center",
  },
});
