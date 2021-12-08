import React from 'react';
import {View, Text, StyleSheet, ActivityIndicator} from 'react-native';
import PropTypes from 'prop-types';
import dateUtils from '../../utils/dateUtils';
import {MAIN_COLOR} from '../../styles';

const MessageDivider = props => {
  const {dateString, isLoading} = props;
  const time = dateUtils.getTime(dateString);
  const date = dateUtils.getDate(dateString);
  return isLoading ? (
    <View style={styles.loading}>
      <ActivityIndicator size={12} color={MAIN_COLOR} />
      <Text style={styles.date}> Đang tải...</Text>
    </View>
  ) : (
    <View style={styles.container}>
      <Text style={styles.date}>{`${time}, ${date}`}</Text>
    </View>
  );
};
MessageDivider.propTypes = {
  dateString: PropTypes.any,
  isLoading: PropTypes.bool,
};
MessageDivider.defaultProps = {
  dateString: '',
  isLoading: false,
};

export default MessageDivider;

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(52, 52, 52, 0.3)',
    // backgroundColor: "#B4B9BF",
    alignSelf: 'center',
    justifyContent: 'center',
    borderRadius: 100,
    paddingVertical: 1,
    paddingHorizontal: 10,
    // marginVertical: 5,
    marginBottom: 10,
  },
  loading: {
    backgroundColor: 'rgba(52, 52, 52, 0.3)',
    flexDirection: 'row',
    alignSelf: 'center',
    justifyContent: 'center',
    borderRadius: 100,
    paddingVertical: 1,
    paddingHorizontal: 10,
    marginVertical: 5,
  },
  date: {
    color: '#FFF',
    fontSize: 12,
    textAlignVertical: 'center',
  },
});
