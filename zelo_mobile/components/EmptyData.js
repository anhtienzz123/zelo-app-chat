import React from 'react';
import PropTypes from 'prop-types';
import {View, Text, StyleSheet} from 'react-native';
import {Icon} from 'react-native-elements';

const EmptyData = props => {
  const {content, containerStyle, contentStyle} = props;
  return (
    <View style={[styles.emty, containerStyle]}>
      <Icon name="warning" type="antdesign" />
      <Text style={[styles.text, contentStyle]}>{content}</Text>
    </View>
  );
};

EmptyData.propTypes = {
  content: PropTypes.string,
  containerStyle: PropTypes.object,
  contentStyle: PropTypes.object,
};

EmptyData.defaultProps = {
  content: 'Không có dữ liệu',
  containerStyle: {},
  contentStyle: {},
};

export default EmptyData;

const styles = StyleSheet.create({
  emty: {
    alignItems: 'center',
    marginTop: 50,
  },
  text: {
    color: 'grey',
    fontSize: 16,
    marginTop: 15,
  },
});
