import React, {useEffect, useRef} from 'react';
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {Icon} from 'react-native-elements';
import {useDispatch, useSelector} from 'react-redux';
import ContactAction from '../components/ContactAction';
import FriendItem from '../components/FriendItem';
import {friendType} from '../constants';
import {fetchFriendById, fetchFriends} from '../redux/friendSlice';
import {fetchSyncContacts} from '../redux/meSlice';
import {OVERLAY_AVATAR_COLOR, OVERLAY_AVATAR_COLOR_GREY} from '../styles';

export default function ContactScreen({navigation}) {
  const dispatch = useDispatch();

  const {listFriends} = useSelector(state => state.friend);
  const {isLoading} = useSelector(state => state.global);

  const inputRef = useRef('');
  const typingTimeoutRef = useRef(null);

  useEffect(() => {
    dispatch(fetchFriends());
  }, []);

  const handleSearchFriendChange = userName => {
    inputRef.current = userName;

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      handleSearchFriendSubmit(userName);
    }, 300);
  };
  const handleSearchFriendSubmit = async userName => {
    // const response = await userApi.fetchUsers(userName);
    dispatch(fetchFriends({name: userName}));
  };

  const handleGoToSearchScreen = async () => {
    navigation.navigate('Tìm kiếm bạn bè', {isAddToGroup: false});
  };

  const handleGoToPersonalScreen = async userId => {
    await dispatch(fetchFriendById({userId}));
    navigation.navigate('Chi tiết bạn bè');
  };

  const handleGoToPhoneBookScreen = async userId => {
    await dispatch(fetchSyncContacts());
    navigation.navigate('Bạn từ danh bạ máy');
  };

  return (
    <SafeAreaView>
      {/* <ContactAction
          name="phone-square"
          type="font-awesome"
          title="Tìm kiếm bạn bè"
          backgroundColor="#70c43b"
          handlePress={() => navigation.navigate('Tìm kiếm bạn bè')}
        /> */}

      {/* <ListItem>
          <Avatar
            rounded
            icon={{
              type: 'ionicon',
              name: 'search',
              color: GREY_COLOR,
            }}
            size="medium"
          />
          <Input
            ref={inputRef}
            renderErrorMessage={false}
            inputContainerStyle={{
              borderBottomWidth: 0,
              margin: 0,
            }}
            containerStyle={{
              width: WINDOW_WIDTH - 96,
              paddingHorizontal: 0,
            }}
            placeholder="Số điện thoại/email"
            onChangeText={value => handleSearchFriendChange(value)}
          />
        </ListItem> */}

      {/* {listFriends &&
          listFriends.map(friend => {
            const {_id, avatar, name} = friend;
            return (
              <TouchableOpacity
                key={_id}
                onPress={() => handleGoToPersonalScreen(_id)}>
                <View style={{backgroundColor: '#fff'}}>
                  <FriendItem
                    name={name}
                    avatar={avatar}
                    type={friendType.FRIEND}
                    userId={_id}
                    navigation={navigation}
                  />
                  <View style={styles.bottomDivider}></View>
                </View>
              </TouchableOpacity>
            );
          })} */}

      {listFriends?.length > 0 ? (
        <FlatList
          data={listFriends}
          keyExtractor={item => item._id}
          initialNumToRender={12}
          renderItem={({item, index}) => (
            <>
              {index === 0 && (
                <>
                  <ContactAction
                    name="search"
                    type="ionicon"
                    title="Tìm kiếm bạn bè"
                    backgroundColor={OVERLAY_AVATAR_COLOR_GREY}
                    handlePress={handleGoToSearchScreen}
                  />
                  <ContactAction
                    name="group"
                    type="material"
                    title="Lời mời kết bạn"
                    backgroundColor="#00a4f4"
                    handlePress={() => navigation.navigate('Lời mời kết bạn')}
                  />
                  <ContactAction
                    name="phone-square"
                    type="font-awesome"
                    title="Bạn từ danh bạ máy"
                    backgroundColor="#70c43b"
                    handlePress={handleGoToPhoneBookScreen}
                    // handlePress={handleSyncContacts}
                  />
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: 'bold',
                      marginHorizontal: 15,
                      marginVertical: 8,
                    }}>
                    Danh sách bạn bè
                  </Text>
                </>
              )}
              <TouchableOpacity
                key={item._id}
                onPress={() => handleGoToPersonalScreen(item._id)}>
                <View style={{backgroundColor: '#fff'}}>
                  <FriendItem
                    name={item.name}
                    avatar={item.avatar}
                    type={friendType.FRIEND}
                    userId={item._id}
                    navigation={navigation}
                    avatarColor={item?.avatarColor}
                  />
                  <View style={styles.bottomDivider}></View>
                </View>
              </TouchableOpacity>
            </>
          )}
        />
      ) : (
        <>
          <ContactAction
            name="search"
            type="ionicon"
            title="Tìm kiếm bạn bè"
            backgroundColor={OVERLAY_AVATAR_COLOR}
            handlePress={handleGoToSearchScreen}
          />
          <ContactAction
            name="group"
            type="material"
            title="Lời mời kết bạn"
            backgroundColor="#00a4f4"
            handlePress={() => navigation.navigate('Lời mời kết bạn')}
          />
          <ContactAction
            name="phone-square"
            type="font-awesome"
            title="Bạn từ danh bạ máy"
            backgroundColor="#70c43b"
            handlePress={handleGoToPhoneBookScreen}
            // handlePress={handleSyncContacts}
          />
          <View style={styles.emty}>
            <Icon name="warning" type="antdesign" />
            <Text style={styles.text}>Chưa có bạn bè</Text>
          </View>
        </>
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
  test: {
    alignItems: 'center',
    width: 100,
    height: 100,
  },
  emty: {
    alignItems: 'center',
    marginTop: 50,
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
