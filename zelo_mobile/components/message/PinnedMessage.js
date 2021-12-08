import PropTypes from 'prop-types';
import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Divider, Icon, ListItem} from 'react-native-elements';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {useSelector} from 'react-redux';
import {messageType} from '../../constants';
import {GREY_COLOR, WINDOW_WIDTH} from '../../styles';

const PinnedMessage = props => {
  const {openPinMessage} = props;
  const {pinMessages} = useSelector(state => state.pin);

  const length = pinMessages.length;
  const lastIndex = length - 1;
  const lastPinMessage = pinMessages?.[lastIndex];

  const handleOpenPinMessage = () => {
    openPinMessage({isVisible: true, isError: false});
  };

  const renderContent = () => {
    let content = lastPinMessage.content;
    switch (lastPinMessage?.type) {
      case messageType.TEXT:
        content = lastPinMessage.content;
        break;
      case messageType.IMAGE:
        content = '[Hình ảnh]';
        break;
      case messageType.VIDEO:
        content = '[Video]';
        break;
      case messageType.FILE:
        content = '[File]';
        break;
      case messageType.HTML:
        content = '[Văn bản]';
        break;

      default:
        content = lastPinMessage.content;
        break;
    }

    return content;
  };

  return (
    length > 0 && (
      <TouchableOpacity onPress={handleOpenPinMessage}>
        <View style={styles.container}>
          <ListItem containerStyle={styles.item}>
            <Icon name="message1" type="antdesign" color="#4cacfc" />
            <ListItem.Content>
              <ListItem.Title numberOfLines={1}>
                {renderContent()}
              </ListItem.Title>
              <ListItem.Subtitle
                numberOfLines={
                  1
                }>{`Tin nhắn của ${lastPinMessage.user.name}`}</ListItem.Subtitle>
            </ListItem.Content>
            <Divider orientation="vertical" width={1} />
            <View style={styles.itemRight}>
              {lastIndex > 0 && (
                <Text style={{color: GREY_COLOR}}>+{lastIndex}</Text>
              )}
              <Icon name="down" type="antdesign" size={15} color={GREY_COLOR} />
            </View>
          </ListItem>
        </View>
      </TouchableOpacity>
    )
  );
};
PinnedMessage.propTypes = {
  openPinMessage: PropTypes.func,
};
PinnedMessage.defaultProps = {
  openPinMessage: null,
};

export default PinnedMessage;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fcfdff',
    // flexDirection: 'row',
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'stretch',
    borderRadius: 6,
    marginTop: 5,
    // width: '100%',
    width: WINDOW_WIDTH - 10,
    marginHorizontal: 20,
    borderWidth: 1,
    borderColor: '#E5E6E7',
  },
  item: {
    paddingVertical: 5,
    borderRadius: 6,
  },
  itemRight: {
    flexDirection: 'row',
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: GREY_COLOR,
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
});
