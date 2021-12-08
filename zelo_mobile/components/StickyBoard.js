import PropTypes from 'prop-types';
import React, {useState} from 'react';
import {
  Animated,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';
import {Image} from 'react-native-elements';
import {useSelector} from 'react-redux';
import {messageApi} from '../api';
import {useAnimatedBottom} from '../hooks';
import {
  GREY_COLOR,
  OVERLAY_AVATAR_COLOR_GREY,
  STICKER_SIZE,
  WINDOW_WIDTH,
} from '../styles';

const StickyBoard = props => {
  const {height, visible, setVisible} = props;

  const bottom = useAnimatedBottom(visible, height);

  const {stickers} = useSelector(state => state.global);
  const {currentConversationId, currentChannelId} = useSelector(
    state => state.message,
  );

  const [currentStickerCollection, setCurrentStickerCollection] = useState(
    stickers?.[0],
  );

  const handleSelectCollection = stickerId => {
    const collectionSelected = stickers.find(
      stickerEle => stickerEle._id === stickerId,
    );
    if (collectionSelected) {
      setCurrentStickerCollection(collectionSelected);
    }
  };

  const handleSendSticker = async stickerUrl => {
    const channelId =
      currentChannelId !== currentConversationId ? currentChannelId : null;
    const newMessage = {
      content: stickerUrl,
      type: 'STICKER',
      conversationId: currentConversationId,
      channelId,
    };

    try {
      const response = await messageApi.sendMessage(newMessage);
    } catch (error) {
      console.error('SEND STICKER: ', error);
    }

    setVisible(false);
  };

  return (
    <Animated.View
      style={[styles.container, {bottom, height: visible ? height : 0}]}>
      <ScrollView>
        {stickers.length > 0 ? (
          <Pressable style={styles.header}>
            <ScrollView horizontal>
              {stickers.map(
                sticker =>
                  sticker.stickers.length > 0 && (
                    <TouchableOpacity
                      key={sticker._id}
                      style={{
                        margin: 6,
                        backgroundColor:
                          currentStickerCollection._id === sticker._id
                            ? OVERLAY_AVATAR_COLOR_GREY
                            : 'transparent',
                        borderRadius: 8,
                      }}
                      onPress={() => handleSelectCollection(sticker._id)}>
                      <Image
                        source={{uri: sticker.stickers[0]}}
                        style={styles.headerSticker}
                      />
                    </TouchableOpacity>
                  ),
              )}
            </ScrollView>
          </Pressable>
        ) : (
          <Text style={styles.emptyText}>Không có sticker nào</Text>
        )}

        {currentStickerCollection && (
          <Pressable>
            <Text style={styles.title}>{currentStickerCollection.name}</Text>
          </Pressable>
        )}
        <Pressable style={styles.bodyContainer}>
          {currentStickerCollection &&
            currentStickerCollection.stickers.map((sticker, index) => (
              <TouchableOpacity
                key={index}
                style={{
                  margin: 6,
                  // backgroundColor: 'red',
                }}
                onPress={() => handleSendSticker(sticker)}>
                <Image source={{uri: sticker}} style={styles.bodySticker} />
              </TouchableOpacity>
            ))}
        </Pressable>
      </ScrollView>
    </Animated.View>
  );
};
export default StickyBoard;

StickyBoard.propTypes = {
  height: PropTypes.number,
  visible: PropTypes.bool,
  setVisible: PropTypes.func,
};

StickyBoard.defaultProps = {
  keyboardHeight: 280,
  visible: false,
  setVisible: null,
};

const STICKER_HEADER_SIZE = 50;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    // backgroundColor: 'pink',
    width: WINDOW_WIDTH,
    padding: 6,
  },

  title: {fontWeight: 'bold', color: GREY_COLOR, paddingHorizontal: 12},
  emptyText: {
    color: GREY_COLOR,
    alignSelf: 'center',
    marginTop: 8,
    fontSize: 16,
  },
  headerSticker: {width: STICKER_HEADER_SIZE, height: STICKER_HEADER_SIZE},
  bodySticker: {width: STICKER_SIZE, height: STICKER_SIZE},
  bodyContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    padding: 6,
  },
});
