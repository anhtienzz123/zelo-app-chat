import React, {useEffect, useLayoutEffect, useState} from 'react';
import {
  Alert,
  Dimensions,
  Modal,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {Avatar, Button, Image, ListItem} from 'react-native-elements';
import {Icon} from 'react-native-elements/dist/icons/Icon';
import {ScrollView} from 'react-native-gesture-handler';
// import defaultCoverImage from '../assets/default-cover-image.jpg';
// import ImageView from 'react-native-image-view';
import ImageViewer from 'react-native-image-zoom-viewer';
import {useDispatch, useSelector} from 'react-redux';
import {friendApi, meApi} from '../api';
import OptionButton from '../components/conversation/OptionButton';
import ViewImageModal from '../components/modal/ViewImageModal';
import {
  DEFAULT_COVER_IMAGE,
  DEFAULT_IMAGE_MODAL,
  ERROR_MESSAGE,
  friendType,
} from '../constants';
import {
  addNewFriendRequest,
  cancelMyFriendRequest,
  deleteFriend,
  deleteFriendRequest,
  fetchFriends,
  updateFriendStatus,
} from '../redux/friendSlice';
import {fetchSyncContacts} from '../redux/meSlice';
import {OVERLAY_AVATAR_COLOR, WINDOW_HEIGHT, WINDOW_WIDTH} from '../styles';
import commonFuc, {handleCreateChat} from '../utils/commonFuc';

export default function FriendDetailsScreen({navigation}) {
  const {searchFriend} = useSelector(state => state.friend);
  const {currentConversationId} = useSelector(state => state.message);
  const {phoneBooks} = useSelector(state => state.me);
  const dispatch = useDispatch();
  const AVATAR =
    'https://wiki.tino.org/wp-content/uploads/2020/10/react-native-final-file.jpg';

  const [isImageViewVisible, setIsImageViewVisible] = useState(false);
  const [imageView, setImageView] = useState([]);
  const [imageProps, setImageProps] = useState(DEFAULT_IMAGE_MODAL);

  // const buttonTitle = 'Nhắn tin';
  const friendStatus = searchFriend.status;
  const buttonTitle =
    friendStatus === friendType.FRIEND
      ? 'Nhắn tin'
      : friendStatus === friendType.FOLLOWER
      ? 'Đồng ý'
      : friendStatus === friendType.YOU_FOLLOW
      ? 'Hủy yêu cầu'
      : 'Kết bạn';

  useEffect(() => {
    dispatch(fetchSyncContacts());
  }, []);

  const handleOnPress = () => {
    switch (friendStatus) {
      case friendType.FRIEND:
        handleCreateChat(
          searchFriend._id,
          navigation,
          dispatch,
          currentConversationId,
        );
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
      default:
        break;
    }
  };

  const handleAddFriendRequest = async () => {
    try {
      const userId = searchFriend._id;
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
      const userId = searchFriend._id;
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
      const userId = searchFriend._id;
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
      const userId = searchFriend._id;
      const response = await friendApi.acceptFriend(userId);
      dispatch(updateFriendStatus(friendType.FRIEND));
      dispatch(deleteFriendRequest(userId));
      dispatch(fetchFriends());
    } catch (error) {
      console.error(error);
      commonFuc.notifyMessage(ERROR_MESSAGE);
    }
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      title: searchFriend.name,
    });
  }, [navigation]);

  const handleViewImage = url => {
    setImageProps({
      isVisible: true,
      userName: searchFriend.name,
      content: [{url: url || DEFAULT_COVER_IMAGE}],
      isImage: true,
    });
  };

  const handleDoB = () => {
    let dob = '';

    if (friendStatus !== friendType.FRIEND) {
      return '**********';
    }
    if (searchFriend.dateOfBirth) {
      const day = ('00' + searchFriend.dateOfBirth.day).slice(-2);
      const month = ('00' + searchFriend.dateOfBirth.month).slice(-2);
      const year = searchFriend.dateOfBirth.year;
      dob = `${day}/${month}/${year}`;
    }
    return dob;
  };

  const handleEmail = () => {
    const username = searchFriend.username;
    let email = '';

    if (username.includes('@')) {
      email = searchFriend.username;

      if (friendStatus !== friendType.FRIEND) {
        email = '**********';
      }
    }
    return email;
  };

  const handlePhoneNumber = () => {
    const username = searchFriend.username;
    let phoneNumber = '';

    if (!username.includes('@')) {
      if (friendStatus !== friendType.FRIEND) {
        phoneNumber = '**********';
      }
      const index = phoneBooks.findIndex(ele => ele.username === username);
      if (index < 0) {
        phoneNumber = '**********';
      } else {
        phoneNumber = searchFriend.username;
      }
    }

    return phoneNumber;
  };

  const handleUnFriend = () => {
    Alert.alert(
      'Cảnh báo',
      `Bạn có muốn xóa kết bạn với ${searchFriend.name} không?`,
      [
        {
          text: 'Không',
        },
        {
          text: 'Có',
          onPress: async () => {
            try {
              const response = await friendApi.deleteFriend(searchFriend._id);
              dispatch(deleteFriend(searchFriend._id));
            } catch (error) {
              commonFuc.notifyMessage(ERROR_MESSAGE);
              console.error('Xoa kêt ban loi: ', error);
            }
          },
        },
      ],
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <Image
            source={{uri: searchFriend?.coverImage || DEFAULT_COVER_IMAGE}}
            style={styles.coverImage}
            onPress={() => handleViewImage(searchFriend?.coverImage)}
          />
          {/* <View style={{width: '100%', justifyContent: 'center'}}>
          </View> */}
          <Avatar
            title={commonFuc.getAcronym(searchFriend.name)}
            source={searchFriend.avatar ? {uri: searchFriend.avatar} : null}
            size={120}
            rounded
            overlayContainerStyle={{
              backgroundColor:
                searchFriend?.avatarColor || OVERLAY_AVATAR_COLOR,
            }}
            containerStyle={styles.avatar}
            onPress={() =>
              searchFriend.avatar && handleViewImage(searchFriend.avatar)
            }
          />
        </View>
        <View style={styles.action}>
          <Text style={styles.name}>{searchFriend.name}</Text>

          <View style={styles.buttonWrap}>
            {friendStatus === friendType.FOLLOWER && (
              <Button
                containerStyle={styles.buttonContainer}
                title="Từ chối"
                buttonStyle={styles.button}
                type="outline"
                onPress={handleDeleteFriendRequest}
              />
            )}
            {friendStatus !== friendType.FOLLOWER &&
              friendStatus !== friendType.FRIEND && (
                <Button
                  containerStyle={styles.buttonContainer}
                  title="Nhắn tin"
                  buttonStyle={styles.button}
                  type="outline"
                  onPress={() =>
                    handleCreateChat(searchFriend._id, navigation, dispatch)
                  }
                />
              )}
            <Button
              containerStyle={styles.buttonContainer}
              title={buttonTitle}
              buttonStyle={styles.button}
              onPress={handleOnPress}
              type={
                friendStatus === friendType.YOU_FOLLOW ? 'outline' : 'solid'
              }
            />
          </View>
        </View>
        <View style={styles.detailsContainer}>
          <ListItem topDivider>
            <Text style={styles.title}>Giới tính</Text>
            <Text style={styles.content}>
              {searchFriend.gender ? 'Nữ' : 'Nam'}
            </Text>
          </ListItem>
          <ListItem topDivider>
            <Text style={styles.title}>Ngày sinh</Text>
            <Text style={styles.content}>{handleDoB()}</Text>
          </ListItem>
          {searchFriend.username.includes('@') ? (
            <ListItem topDivider>
              <Text style={styles.title}>Email</Text>
              <Text style={styles.content}>{handleEmail()}</Text>
            </ListItem>
          ) : (
            <>
              <ListItem topDivider>
                <Text style={styles.title}>Điện thoại</Text>
                <Text style={styles.content}>{handlePhoneNumber()}</Text>
              </ListItem>
              <ListItem containerStyle={{paddingTop: 0}}>
                <Text style={styles.title}></Text>
                <Text style={styles.content}>
                  Số điện thoại chỉ hiển thị khi bạn có lưu số người này trong
                  danh bạ
                </Text>
              </ListItem>
            </>
          )}
        </View>

        {friendStatus === friendType.FRIEND && (
          <OptionButton
            onPress={handleUnFriend}
            iconType="antdesign"
            iconName="deleteuser"
            title="Xóa kết bạn"
            iconColor="red"
            titleStyle={{color: 'red'}}
          />
        )}

        {/* {friendStatus === friendType.FRIEND && (
          <Button
            containerStyle={styles.buttonContainer}
            title="Xóa kết bạn"
            buttonStyle={[styles.button, {borderColor: 'red'}]}
            titleStyle={{color: 'red'}}
            type="outline"
            onPress={handleUnFriend}
          />
        )} */}

        <ViewImageModal imageProps={imageProps} setImageProps={setImageProps} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
  },
  header: {
    // alignItems: 'center',
  },
  action: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    // backgroundColor: 'cyan',
  },
  detailsContainer: {width: '100%'},
  title: {
    // backgroundColor: 'pink',
    // width: WINDOW_WIDTH / 4,
    width: '20%',
  },
  content: {
    color: 'grey',
    width: '80%',
    // width: (WINDOW_WIDTH * 3) / 4,
    // backgroundColor: 'cyan',
    paddingRight: 16,
  },
  coverImage: {
    width: '100%',
    height: WINDOW_HEIGHT * 0.28,
  },
  avatar: {
    marginTop: -80,
    transform: [{translateX: WINDOW_WIDTH / 2 - 60}],
    borderWidth: 3,
    borderColor: '#fff',
  },
  name: {
    fontSize: 24,
  },
  indicator: {
    position: 'absolute',
    zIndex: 9999,
    width: '100%',
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  buttonWrap: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    // backgroundColor: 'red',
  },
  buttonContainer: {
    margin: 10,
    borderRadius: 20,
  },
  button: {borderRadius: 20, minWidth: WINDOW_WIDTH / 3},
});
