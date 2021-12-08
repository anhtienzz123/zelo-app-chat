import PropTypes from 'prop-types';
import React from 'react';
import {StyleSheet} from 'react-native';
import {Button, Icon} from 'react-native-elements';

const MessageModalButton = props => {
  const {
    title,
    onPress,
    iconName,
    iconType,
    iconsize,
    iconColor,
    containerStyle,
  } = props;
  return (
    <Button
      title={title}
      containerStyle={[styles.button, containerStyle]}
      onPress={onPress}
      type="clear"
      icon={
        <Icon
          name={iconName}
          type={iconType}
          size={iconsize}
          color={iconColor}
        />
      }
      titleStyle={styles.title}
      iconPosition="top"
    />
  );
};

MessageModalButton.propTypes = {
  title: PropTypes.string,
  onPress: PropTypes.func,
  iconName: PropTypes.string,
  iconType: PropTypes.string,
  iconsize: PropTypes.number,
  iconColor: PropTypes.string,
  containerStyle: PropTypes.object,
};

MessageModalButton.defaultProps = {
  title: '',
  onPress: null,
  iconName: '',
  iconType: '',
  iconsize: 22,
  iconColor: '',
  containerStyle: null,
};

const styles = StyleSheet.create({
  button: {
    width: '33.33%',
    borderRadius: 0,

    // backgroundColor: "red",
  },

  title: {
    fontFamily: 'normal' || 'Arial',
    fontWeight: '100',
    color: 'black',
    fontSize: 13,
  },
});

export default MessageModalButton;
