import PropTypes from 'prop-types';
import React, {useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {Button, Icon, ListItem} from 'react-native-elements';
import {useDispatch, useSelector} from 'react-redux';
import {DEFAULT_CHANNEL_MODAL, DEFAULT_MESSAGE_PARAMS} from '../../constants';
import {
  clearChannelMessages,
  clearMessages,
  fetchChannelMessages,
  fetchListLastChannelViewer,
  fetchListLastViewer,
  fetchMessages,
  setCurrentChannel,
} from '../../redux/messageSlice';
import {fetchPinMessages} from '../../redux/pinSlice';
import ChannelModal from '../modal/ChannelModal';
import OptionButton from './OptionButton';

const ListChannel = props => {
  const {navigation, onAddChannelPress, onShowRenameModal, channelIdRef} =
    props;
  const {channels, currentConversation, currentConversationId} = useSelector(
    state => state.message,
  );
  const dispatch = useDispatch();

  const [isShowMore, setIsShowMore] = useState(false);

  const [channelModalProps, setChannelModalProps] = useState(
    DEFAULT_CHANNEL_MODAL,
  );

  const getNumberUnreadGeneralChannel = () => {};

  const handleOnChannelPress = (currentChannelId, currentChannelName) => {
    dispatch(
      setCurrentChannel({
        currentChannelId,
        currentChannelName,
      }),
    );

    dispatch(clearChannelMessages());

    if (channelIdRef) {
      channelIdRef.current = currentChannelId;
    }
    if (currentChannelId === currentConversationId) {
      dispatch(clearMessages());
      dispatch(
        fetchMessages({
          conversationId: currentChannelId,
          apiParams: DEFAULT_MESSAGE_PARAMS,
        }),
      );
      dispatch(fetchPinMessages({conversationId: currentChannelId}));
      dispatch(fetchListLastViewer({conversationId: currentChannelId}));
    } else {
      dispatch(
        fetchChannelMessages({
          channelId: currentChannelId,
          apiParams: DEFAULT_MESSAGE_PARAMS,
        }),
      );
      dispatch(fetchListLastChannelViewer({channelId: currentChannelId}));
    }

    navigation.goBack();
  };

  const handleOnLongPress = (channelId, name) => {
    setChannelModalProps({isVisible: true, name, channelId});
  };

  return (
    <View>
      <TouchableOpacity
        onPress={() =>
          handleOnChannelPress(currentConversationId, currentConversationId)
        }>
        <ListItem>
          <Icon type="material-icon" name="tag" />
          <ListItem.Content>
            <ListItem.Title>Kênh chung</ListItem.Title>
          </ListItem.Content>
          {currentConversation.numberUnread > 0 && (
            <View style={styles.iconBadge}>
              <Text style={styles.badgeElement}>
                {currentConversation.numberUnread > 99
                  ? 'N'
                  : currentConversation.numberUnread}
              </Text>
            </View>
          )}
        </ListItem>
      </TouchableOpacity>
      <View style={styles.divider}></View>

      {channels.length > 0 &&
        channels.map(
          (channel, index) =>
            index < 2 && (
              <View key={channel._id}>
                <TouchableOpacity
                  onPress={() =>
                    handleOnChannelPress(channel._id, channel.name)
                  }
                  onLongPress={() =>
                    handleOnLongPress(channel._id, channel.name)
                  }
                  delayLongPress={500}>
                  <ListItem>
                    <Icon type="material-icon" name="tag" />
                    <ListItem.Content>
                      <ListItem.Title>{channel.name}</ListItem.Title>
                    </ListItem.Content>
                    {channel.numberUnread > 0 && (
                      <View style={styles.iconBadge}>
                        <Text style={styles.badgeElement}>
                          {channel.numberUnread > 99
                            ? 'N'
                            : channel.numberUnread}
                        </Text>
                      </View>
                    )}
                  </ListItem>
                </TouchableOpacity>
                <View style={styles.divider}></View>
              </View>
            ),
        )}
      {isShowMore &&
        channels.map(
          (channel, index) =>
            index >= 2 && (
              <View key={channel._id}>
                <TouchableOpacity
                  onPress={() =>
                    handleOnChannelPress(channel._id, channel.name)
                  }
                  onLongPress={() =>
                    handleOnLongPress(channel._id, channel.name)
                  }
                  delayLongPress={500}>
                  <ListItem>
                    <Icon type="material-icon" name="tag" />
                    <ListItem.Content>
                      <ListItem.Title>{channel.name}</ListItem.Title>
                    </ListItem.Content>
                    {channel.numberUnread > 0 && (
                      <View style={styles.iconBadge}>
                        <Text style={styles.badgeElement}>
                          {channel.numberUnread > 99
                            ? 'N'
                            : channel.numberUnread}
                        </Text>
                      </View>
                    )}
                  </ListItem>
                </TouchableOpacity>
                <View style={styles.divider}></View>
              </View>
            ),
        )}

      {channels.length > 2 && (
        <Button
          title={isShowMore ? 'Thu gọn' : 'Xem tất cả'}
          onPress={() => setIsShowMore(!isShowMore)}
          type="outline"
          containerStyle={{marginHorizontal: 10, marginVertical: 5}}
          buttonStyle={{marginHorizontal: 10}}
        />
      )}
      <Button
        title="Thêm channel"
        onPress={onAddChannelPress}
        type="outline"
        containerStyle={{marginHorizontal: 10, marginVertical: 5}}
        buttonStyle={{marginHorizontal: 10}}
      />

      {channelModalProps.isVisible && (
        <ChannelModal
          modalVisible={channelModalProps}
          setModalVisible={setChannelModalProps}
          onShowRenameModal={onShowRenameModal}
          channelIdRef={channelIdRef}
        />
      )}
    </View>
  );
};

ListChannel.propTypes = {
  onAddChannelPress: PropTypes.func,
  onShowRenameModal: PropTypes.func,
};

ListChannel.defaultProps = {
  onAddChannelPress: null,
  onShowRenameModal: null,
};
export default ListChannel;

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
  divider: {
    width: '100%',
    backgroundColor: '#E5E6E8',
    height: 1,
    marginLeft: 55,
  },
  iconBadge: {
    color: 'white',
    fontSize: 10,
    width: 15,
    height: 15,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF5B05',
  },
  badgeElement: {color: 'white', fontSize: 10},
});
