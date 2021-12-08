import PropTypes from 'prop-types';
import React, {useState} from 'react';
import {
  FlatList,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {Icon, Image, ListItem} from 'react-native-elements';
import {DEFAULT_IMAGE_MODAL, messageType} from '../../constants';
import {WINDOW_HEIGHT, WINDOW_WIDTH} from '../../styles';
import commonFuc, {checkPermissionDownloadFile} from '../../utils/commonFuc';
import ViewImageModal from '../modal/ViewImageModal';
import {TouchableOpacity} from 'react-native-gesture-handler';
import dateUtils from '../../utils/dateUtils';

export default function ListFileSent(props) {
  const {listFiles, type, membersList} = props;
  const [imageProps, setImageProps] = useState(DEFAULT_IMAGE_MODAL);

  const handleViewImage = (url, fileName, isImage) => {
    setImageProps({
      isVisible: true,
      userName: fileName,
      content: isImage ? [{url: url || DEFAULT_COVER_IMAGE}] : url,
      isImage: isImage,
    });
  };

  const IMAGE_SIZE = WINDOW_WIDTH / 6;

  return (
    <SafeAreaView style={styles.container}>
      {listFiles.length > 0 ? (
        <FlatList
          data={listFiles}
          keyExtractor={item => item._id}
          initialNumToRender={12}
          renderItem={({item}) => {
            const {_id, userId, content, type, createdAt} = item;
            const userName = membersList.find(ele => ele._id === userId)?.name;
            return type === messageType.FILE ? (
              <TouchableOpacity
                key={_id}
                onPress={() => checkPermissionDownloadFile(content)}>
                <ListItem topDivider={true}>
                  <Icon type="material-community" name="download" size={22} />
                  <ListItem.Content>
                    <ListItem.Title numberOfLines={1}>
                      {commonFuc.getFileName(content)}
                    </ListItem.Title>
                    <ListItem.Subtitle
                      numberOfLines={1}>{`${userName}: ${dateUtils.toTime(
                      createdAt,
                    )}`}</ListItem.Subtitle>
                  </ListItem.Content>
                </ListItem>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                key={_id}
                onPress={() =>
                  handleViewImage(content, userName, type === messageType.IMAGE)
                }
                onLongPress={() => checkPermissionDownloadFile(content)}>
                <ListItem topDivider={true}>
                  {type === messageType.IMAGE ? (
                    <Image
                      style={{
                        width: IMAGE_SIZE,
                        height: IMAGE_SIZE,
                        margin: 8,
                        borderRadius: 10,
                      }}
                      source={{uri: content}}
                    />
                  ) : (
                    <View style={{margin: 8}}>
                      <View
                        style={{
                          width: IMAGE_SIZE,
                          height: IMAGE_SIZE,
                          aspectRatio: 16 / 9,
                          backgroundColor: '#000',
                          justifyContent: 'center',
                          borderRadius: 10,
                        }}>
                        <Icon
                          name="play"
                          type="antdesign"
                          color="#fff"
                          size={30}
                        />
                      </View>
                    </View>
                  )}
                  <ListItem.Content>
                    <ListItem.Title numberOfLines={1}>
                      {commonFuc.getFileName(content)}
                    </ListItem.Title>
                    <ListItem.Subtitle
                      numberOfLines={1}>{`${userName}: ${dateUtils.toTime(
                      createdAt,
                    )}`}</ListItem.Subtitle>
                  </ListItem.Content>
                </ListItem>
              </TouchableOpacity>
            );
          }}
        />
      ) : (
        <View style={styles.emty}>
          <Icon name="warning" type="antdesign" />
          <Text style={styles.text}>{`Không có ${
            type === messageType.IMAGE
              ? 'hình ảnh'
              : type === messageType.VIDEO
              ? 'video'
              : 'file'
          } nào`}</Text>
        </View>
      )}
      <ViewImageModal imageProps={imageProps} setImageProps={setImageProps} />
    </SafeAreaView>
  );
}
ListFileSent.propTypes = {
  listFiles: PropTypes.array,
  membersList: PropTypes.array,
  type: PropTypes.string,
};

ListFileSent.defaultProps = {
  listFiles: [],
  membersList: [],
  type: messageType.IMAGE,
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    height: '100%',
    width: '100%',
  },
  emty: {
    alignItems: 'center',
    marginTop: 50,
  },
  image: {
    alignItems: 'center',
    width: '100%',
    height: WINDOW_HEIGHT * 0.28,
  },
  text: {
    color: 'grey',
    fontSize: 16,
    marginTop: 15,
  },
});
