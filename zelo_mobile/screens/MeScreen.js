import React, {useEffect, useRef, useState} from 'react';
import {
  Alert,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {Avatar, Image, ListItem} from 'react-native-elements';
import Spinner from 'react-native-loading-spinner-overlay';
import {useDispatch, useSelector} from 'react-redux';
import {meApi} from '../api';
import test from '../assets/favicon1.png';
import OptionButton from '../components/conversation/OptionButton';
import AvatarModal from '../components/modal/AvatarModal';
import ChangePasswordModal from '../components/modal/ChangePasswordModal';
import LogoutAllModal from '../components/modal/LogoutAllModal';
import UpdateUserProfileModal from '../components/modal/UpdateUserProfileModal';
import ViewImageModal from '../components/modal/ViewImageModal';
import {
  DEFAULT_COVER_IMAGE,
  DEFAULT_IMAGE_MODAL,
  ERROR_MESSAGE,
} from '../constants';
import {fetchProfile, updateImage} from '../redux/meSlice';
import globalStyles, {
  OVERLAY_AVATAR_COLOR,
  WINDOW_HEIGHT,
  WINDOW_WIDTH,
} from '../styles';
import commonFuc, {currentKey, logout, makeId} from '../utils/commonFuc';

export default function MeScreen({navigation}) {
  const dispatch = useDispatch();

  const {userProfile} = useSelector(state => state.me);

  const [isUpdateProfile, setIsUpdateProfile] = useState(false);
  const [isChangePasswordVisible, setIsChangePasswordVisible] = useState(false);
  const [isLogoutAll, setIsLogoutAll] = useState(false);
  const [isImageVisible, setIsImageVisible] = useState(false);
  const isCoverImageRef = useRef(false);
  const [imageProps, setImageProps] = useState(DEFAULT_IMAGE_MODAL);

  const handleFetchProfile = async () => {
    await dispatch(fetchProfile());
  };

  useEffect(() => {
    handleFetchProfile();
  }, []);

  const images = [
    {
      source: {
        uri: userProfile?.avatar || `${test}`,
      },
    },
  ];

  const handleLogOut = () => {
    Alert.alert('Cảnh báo', 'Bạn có muốn đăng xuất không?', [
      {
        text: 'Không',
      },
      {
        text: 'Có',
        onPress: async () => {
          await logout(dispatch);
        },
      },
    ]);
  };

  const handleLogoutAll = () => {
    Alert.prompt(
      'Đăng xuất ra khỏi các thiết bị khác',
      'Nhập mật khẩu hiện tại của bạn đề đăng xuất ra khỏi các thiết bị khác',
      [
        {
          text: 'Không',
        },
        {
          text: 'Có',
          onPress: async password => {
            makeId();
          },
        },
      ],
      'secure-text',
    );
  };

  const handleViewImage = isCoverImage => {
    let url = null;
    if (isCoverImage) {
      url = userProfile?.coverImage;
    } else {
      url = userProfile?.avatar;
    }

    if (!isCoverImage && !url) {
      commonFuc.notifyMessage('Bạn chưa có ảnh đại diện');
      return;
    }

    setImageProps({
      isVisible: true,
      userName: userProfile?.name,
      content: [{url: url || DEFAULT_COVER_IMAGE}],
      isImage: true,
    });
  };

  const handleDoB = () => {
    let dob = '';

    if (userProfile?.dateOfBirth) {
      const day = ('00' + userProfile?.dateOfBirth.day).slice(-2);
      const month = ('00' + userProfile?.dateOfBirth.month).slice(-2);
      const year = userProfile?.dateOfBirth.year;
      dob = `${day}/${month}/${year}`;
    }
    return dob;
  };

  const handleEmail = () => {
    const username = userProfile?.username;
    let email = '';
    if (username) {
      if (username.includes('@')) {
        email = username;
      }
    }
    return email;
  };

  const handlePhoneNumber = () => {
    const username = userProfile?.username;
    let phoneNumber = '';
    if (username) {
      if (!username.includes('@')) {
        phoneNumber = username;
      }
    }
    return phoneNumber;
  };

  const onImagePress = isCoverImage => {
    isCoverImageRef.current = isCoverImage;
    setIsImageVisible(true);
  };

  const [isLoading, setIsLoading] = useState(false);
  const [loadingText, setLoadingText] = useState('upload... 0%');

  const onUploadProgress = percentCompleted => {
    if (percentCompleted < 99) {
      setLoadingText(`upload... ${percentCompleted}%`);
    } else {
      setIsLoading(false);
      setLoadingText('upload... 0%');
    }
  };

  const handleUploadFile = async (body, isCoverImage) => {
    setIsImageVisible(false);
    try {
      if (isCoverImage) {
        const response = await meApi.updateCoverImageBase64(
          body,
          onUploadProgress,
        );
        dispatch(updateImage({isCoverImage, uri: response.coverImage}));
      } else {
        const response = await meApi.updateAvatarBase64(body, onUploadProgress);
        dispatch(updateImage({isCoverImage, uri: response.avatar}));
      }
    } catch (error) {
      console.error('Upload image: ', error);
      commonFuc.notifyMessage(ERROR_MESSAGE);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Spinner
        visible={isLoading}
        textContent={loadingText}
        textStyle={globalStyles.spinnerTextStyle}
      />
      <ScrollView>
        <View style={{backgroundColor: '#fff'}}>
          <View style={styles.header}>
            <Image
              source={{uri: userProfile?.coverImage || DEFAULT_COVER_IMAGE}}
              style={styles.coverImage}
              onPress={() => onImagePress(true)}
              // onPress={() => handleViewImage(userProfile?.coverImage)}
            />
            {/* <View style={{width: '100%', justifyContent: 'center'}}>
            </View> */}
            <Avatar
              title={commonFuc.getAcronym(userProfile?.name)}
              source={userProfile?.avatar ? {uri: userProfile?.avatar} : null}
              size={120}
              rounded
              overlayContainerStyle={{
                backgroundColor:
                  userProfile?.avatarColor || OVERLAY_AVATAR_COLOR,
              }}
              containerStyle={styles.avatar}
              onPress={() => onImagePress(false)}
              // onPress={() =>
              //   userProfile?.avatar && handleViewImage(userProfile?.avatar)
              // }
            />
          </View>
          <View style={styles.action}>
            <Text style={styles.name}>{userProfile?.name}</Text>
          </View>
        </View>
        <View style={styles.detailsContainer}>
          <View style={styles.dividerContainer}>
            <View style={styles.divider}></View>
          </View>
          <ListItem>
            <Text style={styles.title}>Giới tính</Text>
            <Text style={styles.content}>
              {userProfile?.gender ? 'Nữ' : 'Nam'}
            </Text>
          </ListItem>
          <View style={styles.dividerContainer}>
            <View style={styles.divider}></View>
          </View>
          <ListItem>
            <Text style={styles.title}>Ngày sinh</Text>
            <Text style={styles.content}>{handleDoB()}</Text>
          </ListItem>
          {handleEmail().length > 0 && (
            <>
              <View style={styles.dividerContainer}>
                <View style={styles.divider}></View>
              </View>
              <ListItem>
                <Text style={styles.title}>Email</Text>
                <Text style={styles.content}>{handleEmail()}</Text>
              </ListItem>
            </>
          )}
          {handlePhoneNumber().length > 0 && (
            <>
              <View style={styles.dividerContainer}>
                <View style={styles.divider}></View>
              </View>
              <ListItem>
                <Text style={styles.title}>Điện thoại</Text>
                <Text style={styles.content}>{handlePhoneNumber()}</Text>
              </ListItem>
              <ListItem containerStyle={{paddingTop: 0}}>
                <Text style={styles.title}></Text>
                <Text style={styles.content}>
                  Số điện thoại của bạn chỉ hiển thị với bạn bè có lưu số của
                  bạn trong danh bạ
                </Text>
              </ListItem>
            </>
          )}
        </View>

        <ViewImageModal imageProps={imageProps} setImageProps={setImageProps} />

        <Pressable style={globalStyles.viewEle}>
          <OptionButton
            onPress={() => setIsUpdateProfile(true)}
            iconType="antdesign"
            iconName="edit"
            title="Đổi thông tin"
          />
          <OptionButton
            onPress={() => setIsChangePasswordVisible(true)}
            iconType="antdesign"
            iconName="lock"
            title="Đổi mật khẩu"
          />
          <OptionButton
            onPress={() => setIsLogoutAll(true)}
            iconType="material"
            iconName="logout"
            title="Đăng xuất ra khỏi các thiết bị khác"
          />
          <OptionButton
            onPress={handleLogOut}
            iconType="material"
            iconName="logout"
            title="Đăng xuất"
            iconColor="red"
            titleStyle={{color: 'red'}}
          />
        </Pressable>
      </ScrollView>

      {isUpdateProfile && (
        <UpdateUserProfileModal
          modalVisible={isUpdateProfile}
          setModalVisible={setIsUpdateProfile}
          userProfile={userProfile}
        />
      )}

      {isChangePasswordVisible && (
        <ChangePasswordModal
          modalVisible={isChangePasswordVisible}
          setModalVisible={setIsChangePasswordVisible}
        />
      )}
      {isLogoutAll && (
        <LogoutAllModal
          modalVisible={isLogoutAll}
          setModalVisible={setIsLogoutAll}
        />
      )}
      {isImageVisible && (
        <AvatarModal
          modalVisible={isImageVisible}
          setModalVisible={setIsImageVisible}
          isCoverImage={isCoverImageRef.current}
          onViewImage={handleViewImage}
          onUploadFile={handleUploadFile}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#E2E9F1',
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
    borderRadius: 50,
  },
  button: {
    borderRadius: 50,
  },
  dividerContainer: {
    backgroundColor: '#fff',
    height: 2,
  },
  divider: {
    borderBottomWidth: 1,
    // borderBottomColor: 'red',
    borderBottomColor: '#E5E6E8',
    marginHorizontal: 15,
  },
});
