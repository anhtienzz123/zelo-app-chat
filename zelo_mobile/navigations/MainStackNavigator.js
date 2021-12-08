import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import React, {useEffect} from 'react';
import {Platform, StatusBar, TouchableOpacity, View} from 'react-native';
import {Icon} from 'react-native-elements';
import LinearGradient from 'react-native-linear-gradient';
import PushNotification from 'react-native-push-notification';
import {useDispatch, useSelector} from 'react-redux';
import {setModalVisible} from '../redux/globalSlice';
import AddNewFriendScreen from '../screens/AddNewFriendScreen';
import ConversationOptionsScreen from '../screens/ConversationOptionsScreen';
import ConversationSearchScreen from '../screens/ConversationSearchScreen';
import FileScreen from '../screens/FileScreen';
import ForwardMessageScreen from '../screens/ForwardMessageScreen';
import FriendDetailsScreen from '../screens/FriendDetailsScreen';
import FriendRequestScreen from '../screens/FriendRequestScreen';
import FriendSearchScreen from '../screens/FriendSearchScreen';
import MemberScreen from '../screens/MemberScreen';
import MessageScreen from '../screens/MessageScreen';
import PhonebookScreen from '../screens/PhonebookScreen';
import VoteDetailScreen from '../screens/VoteDetailScreen';
import {globalScreenOptions} from '../styles';
import TabNavigator from './TabNavigator';

const Stack = createStackNavigator();

const MainStackNavigator = ({navigation}) => {
  const dispatch = useDispatch();
  const {modalVisible} = useSelector(state => state.global);

  // const headerRightButton = () => (
  //   <View
  //     style={{
  //       flexDirection: 'row',
  //       justifyContent: 'space-between',
  //       marginRight: 20,
  //     }}>
  //     <TouchableOpacity
  //       onPress={() => dispatch(setModalVisible(!modalVisible))}>
  //       <IconAntDesign name="plus" size={22} color="white" />
  //     </TouchableOpacity>
  //   </View>
  // );
  const headerRightButton = (
    navigation,
    isMessageScreen,
    iconName,
    iconType,
  ) => (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginRight: 20,
      }}>
      <TouchableOpacity
        onPress={() =>
          isMessageScreen
            ? dispatch(setModalVisible(!modalVisible))
            : navigation.navigate('Thêm bạn')
        }>
        <Icon name={iconName} type={iconType} size={22} color="white" />
      </TouchableOpacity>
    </View>
  );

  useEffect(() => {
    createChannels();
  }, []);

  const createChannels = () => {
    PushNotification.createChannel({
      channelId: 'new-message',
      channelName: 'Tin nhắn mới',
    });
  };

  return (
    <>
      <LinearGradient
        // Background Linear Gradient
        // colors={['#257afe', '#00bafa']}
        colors={['#1e63cb', '#0195c7']}
        style={{height: Platform.OS === 'ios' ? 20 : StatusBar.currentHeight}}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 0}}>
        <StatusBar
          translucent={true}
          backgroundColor={'transparent'}
          barStyle="light-content"
        />
      </LinearGradient>
      <NavigationContainer>
        <Stack.Navigator screenOptions={globalScreenOptions}>
          <Stack.Screen
            name="Trang chủ"
            component={TabNavigator}
            options={({navigation, route}) => {
              let title = 'Tin nhắn';
              let headerRight = () =>
                headerRightButton(navigation, true, 'plus', 'antdesign');
              const state = navigation.getState()?.routes[0]?.state;
              if (state) {
                const routeNames = state.routeNames;
                const index = state.index;
                const routeName = routeNames[index];

                switch (routeName) {
                  case 'Tin nhắn': {
                    title = 'Tin nhắn';

                    break;
                  }
                  case 'Bạn bè': {
                    title = 'Bạn bè';
                    headerRight = () =>
                      headerRightButton(
                        navigation,
                        false,
                        'person-add-outline',
                        'ionicon',
                      );
                    break;
                  }
                  case 'Cá nhân': {
                    title = 'Cá nhân';
                    headerRight = undefined;
                    break;
                  }
                  default:
                    title = 'Tin nhắn';
                    headerRight = () =>
                      headerRightButton(navigation, true, 'plus', 'antdesign');
                    break;
                }
              }
              return {
                title,
                headerRight,
              };
            }}>
            {/* {props => (
              <TabNavigator
                {...props}
                socket={socket}
                navigation={navigation}
              />
            )} */}
          </Stack.Screen>
          <Stack.Screen name="Nhắn tin" component={MessageScreen} />
          <Stack.Screen name="Tùy chọn" component={ConversationOptionsScreen} />
          <Stack.Screen
            name="Lời mời kết bạn"
            component={FriendRequestScreen}
          />
          <Stack.Screen name="Ảnh, video, file đã gửi" component={FileScreen} />
          <Stack.Screen name="Tìm kiếm bạn bè" component={FriendSearchScreen} />
          <Stack.Screen name="Tìm kiếm" component={ConversationSearchScreen} />
          <Stack.Screen name="Thêm bạn" component={AddNewFriendScreen} />
          <Stack.Screen
            name="Chi tiết bạn bè"
            component={FriendDetailsScreen}
          />
          <Stack.Screen
            name="Chi tiết bình chọn"
            component={VoteDetailScreen}
          />
          <Stack.Screen name="Bạn từ danh bạ máy" component={PhonebookScreen} />
          <Stack.Screen name="Thành viên" component={MemberScreen} />
          <Stack.Screen name="Chia sẻ" component={ForwardMessageScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
};

export default MainStackNavigator;
