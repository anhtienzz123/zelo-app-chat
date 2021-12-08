import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import React, {useEffect} from 'react';
import {StyleSheet, Text} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import ListFriendRequest from '../components/ListFriendRequest';
import {friendType} from '../constants';
import MeScreen from '../screens/MeScreen';

export default function FriendRequestScreen() {
  const dispatch = useDispatch();

  const {listFriends, friendRequests, myFriendRequests} = useSelector(
    state => state.friend,
  );

  const Tab = createMaterialTopTabNavigator();

  useEffect(() => {
    // dispatch(fetchFriends({}));
  }, []);

  return (
    <Tab.Navigator
      screenOptions={({route, navigation}) => ({
        tabBarLabelStyle: {fontSize: 12},
        tabBarItemStyle: {height: 50},
        tabBarActiveTintColor: '#0275d8',
        tabBarInactiveTintColor: 'grey',
        swipeEnabled: true,
        // tabBarLabel: navigation.isFocused() ? route.name : "",
        tabBarLabel: ({focused, color}) => {
          const routeName = route.name;
          const type = routeName === 'Đã nhận';
          const content = `${routeName} ${
            type ? friendRequests?.length : myFriendRequests?.length
          }`;

          return <Text style={{color}}>{content}</Text>;
        },
      })}>
      <Tab.Screen
        name="Đã nhận"
        children={() => (
          <ListFriendRequest
            listFriends={friendRequests}
            type={friendType.FOLLOWER}
          />
        )}
      />
      <Tab.Screen
        name="Đã gửi"
        children={() => (
          <ListFriendRequest
            listFriends={myFriendRequests}
            type={friendType.YOU_FOLLOW}
          />
        )}
      />
    </Tab.Navigator>
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
});
