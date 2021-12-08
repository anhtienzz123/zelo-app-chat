import React from 'react';
import PropTypes from 'prop-types';
import {View, Text, StyleSheet} from 'react-native';
import {Icon} from 'react-native-elements/dist/icons/Icon';
import {TouchableOpacity} from 'react-native-gesture-handler';
import commonFuc, {checkPermissionDownloadFile} from '../../utils/commonFuc';

const FileMessage = props => {
  const {content, handleOpenOptionModal} = props;
  return (
    <TouchableOpacity
      style={styles.fileMessage}
      onPress={() => checkPermissionDownloadFile(content)}
      onLongPress={handleOpenOptionModal}
      delayLongPress={500}>
      <Icon type="material-community" name="download" size={22} />
      <Text style={styles.fileMessageText}>
        {commonFuc.getFileName(content)}
      </Text>
    </TouchableOpacity>
  );
};

FileMessage.propTypes = {
  content: PropTypes.string,
  handleOpenOptionModal: PropTypes.func,
};

FileMessage.defaultProps = {
  content: '',
  handleOpenOptionModal: null,
};

export default FileMessage;

const styles = StyleSheet.create({
  fileMessage: {
    flexDirection: 'row',
    // paddingHorizontal: -15,
    // justifyContent: 'center',
    width: '100%',
    alignItems: 'center',
  },
  fileMessageText: {
    // fontWeight: 'bold',
    // paddingHorizontal: 6,
    flexWrap: 'wrap',
    width: '100%',
  },
});
