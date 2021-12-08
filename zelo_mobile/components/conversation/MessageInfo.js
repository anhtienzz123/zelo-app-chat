import React from 'react';
import {SafeAreaView, StyleSheet, Text, View} from 'react-native';
import PropTypes from 'prop-types';

const MessageInfo = props => {
  const {createdAt, numberUnread} = props;

  return (
    <SafeAreaView style={styles.container}>
      <Text
        style={{
          ...styles.text,
          marginTop: numberUnread === 0 ? -16 : 0,
        }}>
        {createdAt}
      </Text>

      {numberUnread > 0 && (
        <View style={styles.iconBadge}>
          <Text style={styles.badgeElement}>
            {numberUnread > 99 ? 'N' : numberUnread}
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
};

MessageInfo.propTypes = {
  createdAt: PropTypes.string,
  numberUnread: PropTypes.number,
};

MessageInfo.defaultProps = {
  createdAt: '2 giờ',
  numberUnread: 0,
};

export default MessageInfo;

const styles = StyleSheet.create({
  container: {
    // backgroundColor: "red",
    flexDirection: 'column',
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  text: {
    fontSize: 12,
    // backgroundColor: "blue",
    paddingBottom: 8,
  },
  badgeElement: {color: 'white', fontSize: 10},
  iconBadge: {
    color: 'white',
    fontSize: 10,
    minWidth: 15,
    height: 15,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF5B05',
  },
});
