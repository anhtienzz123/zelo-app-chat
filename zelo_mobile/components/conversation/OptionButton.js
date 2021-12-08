import PropTypes from 'prop-types';
import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Icon, ListItem} from 'react-native-elements';
import {TouchableOpacity} from 'react-native-gesture-handler';

export default function OptionButton(props) {
  const {
    onPress,
    title,
    dividerStyle,
    titleStyle,
    iconType,
    iconName,
    iconColor,
    subtitle,
    containerStyle,
  } = props;
  return (
    <>
      <TouchableOpacity onPress={onPress}>
        <ListItem
          // topDivider={false}
          // bottomDivider={false}
          containerStyle={containerStyle}>
          <Icon type={iconType} name={iconName} color={iconColor} />
          <ListItem.Content>
            <ListItem.Title style={titleStyle}>{title}</ListItem.Title>
            {subtitle.length > 0 && (
              <ListItem.Subtitle style={titleStyle}>
                {subtitle}
              </ListItem.Subtitle>
            )}
          </ListItem.Content>
        </ListItem>
      </TouchableOpacity>
      <View style={[styles.divider, dividerStyle]}></View>
    </>
  );
}

OptionButton.propTypes = {
  onPress: PropTypes.func,
  title: PropTypes.string,
  dividerStyle: PropTypes.object,
  titleStyle: PropTypes.object,
  containerStyle: PropTypes.object,
  iconType: PropTypes.string,
  iconName: PropTypes.string,
  iconColor: PropTypes.string,
  subtitle: PropTypes.string,
};

OptionButton.defaultProps = {
  onPress: null,
  title: '',
  dividerStyle: {},
  titleStyle: {},
  containerStyle: null,
  iconType: '',
  iconName: '',
  subtitle: '',
  iconColor: null,
};

const styles = StyleSheet.create({
  divider: {
    width: '100%',
    backgroundColor: '#E5E6E8',
    height: 1,
    marginLeft: 55,
  },
});
