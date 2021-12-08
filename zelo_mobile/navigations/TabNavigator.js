import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import IconAntDesign from 'react-native-vector-icons/AntDesign';
import {useDispatch, useSelector} from 'react-redux';
import ContactScreen from '../screens/ContactScreen';
import HomeScreen from '../screens/HomeScreen';
import MeScreen from '../screens/MeScreen';
import commonFuc from '../utils/commonFuc';

export default function TabNavigator(props) {
  const dispatch = useDispatch();

  const Tab = createMaterialTopTabNavigator();
  const {conversations} = useSelector(state => state.message);
  const {friendRequests} = useSelector(state => state.friend);

  return (
    <Tab.Navigator
      // screenListeners={(navigation, route) => {
      // 	const title = navigation.route.name;
      // 	dispatch(setHeaderTitle(title));
      // }}

      tabBarPosition="bottom"
      keyboardDismissMode={true}
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

        tabBarShowLabel: navigation.isFocused(),
        tabBarIcon: ({focused, color}) => {
          let iconName;
          let count = 0;

          switch (route.name) {
            case 'Tin nhắn': {
              iconName = 'message1';
              count = commonFuc.totalNumberUnread(conversations);

              break;
            }
            case 'Bạn bè': {
              iconName = 'contacts';
              count = friendRequests?.length || 0;
              break;
            }
            case 'Cá nhân': {
              iconName = 'user';
              count = 0;
              break;
            }
            default:
              iconName = 'message1';
              count = 99;
              break;
          }
          return (
            <View style={{flex: 1}}>
              <IconAntDesign name={iconName} size={22} color={color} />
              {count > 0 && (
                <>
                  <View style={styles.iconBadge}>
                    <Text style={styles.badgeElement}>
                      {count > 99 ? 'N' : count}
                    </Text>
                  </View>
                </>
              )}
            </View>
          );
        },
      })}>
      <Tab.Screen name="Tin nhắn" component={HomeScreen} />
      <Tab.Screen name="Bạn bè" component={ContactScreen} />
      <Tab.Screen name="Cá nhân" component={MeScreen} />
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
