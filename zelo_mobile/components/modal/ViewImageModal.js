import PropTypes from 'prop-types';
import React from 'react';
import {Modal, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {Icon} from 'react-native-elements/dist/icons/Icon';
import ImageViewer from 'react-native-image-zoom-viewer';
import VideoPlayer from 'react-native-video-player';
import {DEFAULT_IMAGE_MODAL, ERROR_MESSAGE} from '../../constants';
import {SCREEN_HEIGHT} from '../../styles';
import commonFuc, {checkPermissionDownloadFile} from '../../utils/commonFuc';

const ViewImageModal = props => {
  const {imageProps, setImageProps} = props;

  const handleCloseModal = () => {
    setImageProps(DEFAULT_IMAGE_MODAL);
  };
  return (
    <Modal
      visible={imageProps.isVisible}
      transparent={true}
      onRequestClose={handleCloseModal}>
      {imageProps.isImage ? (
        <ImageViewer
          imageUrls={imageProps.content}
          onCancel={handleCloseModal}
          onSwipeDown={handleCloseModal}
          saveToLocalByLongPress={false}
          failImageSource={{
            uri: require('../../assets/default-cover-image.jpg'),
          }}
          renderIndicator={currentIndex => (
            <View style={styles.indicator}>
              <TouchableOpacity onPress={handleCloseModal}>
                <Icon
                  name="arrowleft"
                  type="antdesign"
                  size={22}
                  color="white"
                />
              </TouchableOpacity>
              {imageProps.userName && (
                <Text style={styles.text}>{imageProps.userName}</Text>
              )}
              <TouchableOpacity
                onPress={() =>
                  checkPermissionDownloadFile(
                    imageProps.content[currentIndex - 1].url,
                  )
                }>
                <Icon
                  name="download"
                  type="antdesign"
                  size={22}
                  color="white"
                />
              </TouchableOpacity>
            </View>
          )}
        />
      ) : (
        <View
          style={{
            backgroundColor: 'black',
            height: '100%',
            width: '100%',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          {/* <View style={[styles.indicator, {position: 'relative'}]}>
            <TouchableOpacity onPress={handleCloseModal}>
              <Icon name="arrowleft" type="antdesign" size={22} color="white" />
            </TouchableOpacity>
            <Text style={styles.text}>{imageProps.userName}</Text>
            <TouchableOpacity
              onPress={() => checkPermissionDownloadFile(imageProps.content)}>
              <Icon name="download" type="antdesign" size={22} color="white" />
            </TouchableOpacity>
          </View> */}

          <View
            style={{
              height: SCREEN_HEIGHT / 3,
              width: '100%',
            }}>
            <VideoPlayer
              // source={{uri: imageProps.content}} // Can be a URL or a local file.
              // onError={() => commonFuc.notifyMessage(ERROR_MESSAGE)}
              // style={{width: WINDOW_WIDTH}}
              // controls
              // paused
              // fullscreen
              // muted
              // resizeMode="cover"
              video={{uri: imageProps.content}} // Can be a URL or a local file.
              onError={() => commonFuc.notifyMessage(ERROR_MESSAGE)}
              style={styles.video}
              autoplay
              showDuration
              // loop={false}
              disableControlsAutoHide
              pauseOnPress
              fullScreenOnLongPress
              // resizeMode="cover"
            />
          </View>
        </View>
      )}
    </Modal>
  );
};

ViewImageModal.propTypes = {
  imageProps: PropTypes.object,
  setImageProps: PropTypes.func,
};

ViewImageModal.defaultProps = {
  imageProps: {},
  setImageProps: null,
};
export default ViewImageModal;

const styles = StyleSheet.create({
  indicator: {
    position: 'absolute',
    zIndex: 9999,
    width: '100%',
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  text: {color: '#fff', fontSize: 18, marginLeft: 15},
  video: {
    width: '100%',
    height: '100%',
    // aspectRatio: 16 / 9,
    // backgroundColor: 'red',
  },
});
