import PropTypes from 'prop-types';
import React from 'react';
import {Platform, Pressable, StyleSheet, Text, View} from 'react-native';
import {Avatar, ListItem} from 'react-native-elements';
import {ScrollView} from 'react-native-gesture-handler';
import HTMLView from 'react-native-htmlview';
import {DEFAULT_MESSAGE_DETAIL_MODAL, messageType} from '../../constants';
import {GREY_COLOR} from '../../styles';
import commonFuc from '../../utils/commonFuc';
import dateUtils from '../../utils/dateUtils';
import CustomModal from './CustomModal';

const MessageDetailModal = props => {
  const {modalVisible, setModalVisible} = props;

  const handleCloseModal = () => {
    setModalVisible(DEFAULT_MESSAGE_DETAIL_MODAL);
  };

  const {message} = modalVisible;

  return (
    <CustomModal
      visible={modalVisible.isVisible}
      onCloseModal={handleCloseModal}
      isShowTitle={false}
      isPressOut={true}>
      <ScrollView>
        <Pressable>
          <ListItem
            containerStyle={{borderRadius: 5}}
            topDivider={false}
            bottomDivider={false}>
            <Avatar
              rounded
              title={commonFuc.getAcronym(message.user.name)}
              overlayContainerStyle={{
                backgroundColor: message.user.avatarColor,
              }}
              source={
                message.user.avatar.length > 0
                  ? {
                      uri: message.user.avatar,
                    }
                  : null
              }
              size="medium"
            />
            <ListItem.Content>
              <ListItem.Title numberOfLines={1}>
                {message.user.name}
              </ListItem.Title>
              <ListItem.Subtitle numberOfLines={1}>
                {message.type === messageType.HTML ? 'Văn bản' : 'Tin nhắn'}
              </ListItem.Subtitle>
            </ListItem.Content>
          </ListItem>
          <View style={styles.containerView}>
            <HTMLView
              value={message.content}
              stylesheet={{p: {fontSize: 13, flexWrap: 'wrap'}}}
            />
            <Text style={{color: GREY_COLOR, marginTop: 8}}>
              {`Ngày ${dateUtils.getDate(
                message.createdAt,
              )} lúc ${dateUtils.getTime(message.createdAt)}`}
            </Text>
          </View>
        </Pressable>
      </ScrollView>
    </CustomModal>
  );
};

MessageDetailModal.propTypes = {
  modalVisible: PropTypes.object,
  setModalVisible: PropTypes.func,
};

MessageDetailModal.defaultProps = {
  modalVisible: DEFAULT_MESSAGE_DETAIL_MODAL,
  setModalVisible: null,
};

const BUTTON_RADIUS = 10;

const styles = StyleSheet.create({
  containerView: {
    paddingHorizontal: 15,
    paddingBottom: 15,
  },
});

export default MessageDetailModal;
