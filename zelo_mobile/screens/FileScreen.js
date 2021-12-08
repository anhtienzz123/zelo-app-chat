import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import React, {useEffect} from 'react';
import {StyleSheet, Text} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import ListFileSent from '../components/conversation/ListFileSent';
import {messageType} from '../constants';

export default function FileScreen({navigation}) {
  const dispatch = useDispatch();

  const {files, members} = useSelector(state => state.message);

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
          return <Text style={{color}}>{route.name}</Text>;
        },
      })}>
      <Tab.Screen
        name="Ảnh"
        children={() => (
          <ListFileSent
            listFiles={files?.images}
            type={messageType.IMAGE}
            membersList={members}
          />
        )}
      />
      <Tab.Screen
        name="Video"
        children={() => (
          <ListFileSent
            listFiles={files?.videos}
            type={messageType.VIDEO}
            membersList={members}
          />
        )}
      />
      <Tab.Screen
        name="File"
        children={() => (
          <ListFileSent
            listFiles={files?.files}
            type={messageType.FILE}
            membersList={members}
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
