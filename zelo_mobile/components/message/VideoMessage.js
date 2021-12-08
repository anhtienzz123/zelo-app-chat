import PropTypes from 'prop-types';
import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import VideoPlayer from 'react-native-video-player';
import Video from 'react-native-video';
import {Icon} from 'react-native-elements/dist/icons/Icon';

const VideoMessage = props => {
  const {uri} = props;
  return (
    <View style={styles.video}>
      {/* <Video
        source={{uri}} // Can be a URL or a local file.
        // ref={ref => {
        //   this.player = ref;
        // }} // Store reference
        // onBuffer={this.onBuffer} // Callback when remote video is buffering
        // onError={this.videoError} // Callback when video cannot be loaded
        style={styles.video}
        controls
        muted
        paused
        filterEnable
        fullscreen
      />
      <VideoPlayer
        video={{uri}} // Can be a URL or a local file.
        // ref={ref => {
        //   this.player = ref;
        // }} // Store reference
        // onBuffer={this.onBuffer} // Callback when remote video is buffering
        // onError={this.videoError} // Callback when video cannot be loaded
        style={styles.video}
        autoplay={false}
        defaultMuted={false}
        showDuration={true}
        loop={false}
      /> */}

      <Icon name="play" type="antdesign" color="#fff" size={30} />
    </View>
  );
};

VideoMessage.propTypes = {
  uri: PropTypes.string,
  handleOpenOptionModal: PropTypes.func,
};

VideoMessage.defaultProps = {
  handleOpenOptionModal: null,
  uri: '',
};

export default VideoMessage;

const styles = StyleSheet.create({
  avatar: {
    position: 'absolute',
    top: 0,
    left: -40,
  },
  video: {
    width: '100%',
    aspectRatio: 16 / 9,
    backgroundColor: '#000',
    justifyContent: 'center',
  },
});
