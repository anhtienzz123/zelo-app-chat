import PropTypes from 'prop-types';
import React from 'react';
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {Icon, Image} from 'react-native-elements';
import {EMPTY_IMAGE, friendType} from '../constants';
import {WINDOW_HEIGHT} from '../styles';
import FriendItem from './FriendItem';

export default function ListFriendRequest(props) {
  const {listFriends, type} = props;
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {listFriends.length > 0 &&
          listFriends.map(friend => {
            const {_id, avatar, name, avatarColor} = friend;
            return (
              <Pressable key={_id}>
                <View style={{backgroundColor: '#fff'}}>
                  <FriendItem
                    avatar={avatar}
                    name={name}
                    type={type}
                    userId={_id}
                    avatarColor={avatarColor}
                  />
                  <View style={styles.bottomDivider}></View>
                </View>
              </Pressable>
            );
          })}
        {listFriends.length == 0 && (
          <View style={styles.emty}>
            <Icon name="warning" type="antdesign" />
            <Text style={styles.text}>
              {type === friendType.FOLLOWER
                ? 'Không có lời mời kết bạn nào'
                : 'Chưa gửi lời mời kết bạn nào'}
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
ListFriendRequest.propTypes = {
  listFriends: PropTypes.array,
  type: PropTypes.string,
};

ListFriendRequest.defaultProps = {
  listFriends: [],
  type: friendType.FOLLOWER,
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    height: '100%',
  },
  emty: {
    alignItems: 'center',
    marginTop: 50,
  },
  image: {
    alignItems: 'center',
    width: '100%',
    height: WINDOW_HEIGHT * 0.28,
  },
  text: {
    color: 'grey',
    fontSize: 16,
    marginTop: 15,
  },
});
