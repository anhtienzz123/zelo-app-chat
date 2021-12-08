import PropTypes from 'prop-types';
import React from 'react';
import {FlatList, Pressable, StyleSheet, Text, View} from 'react-native';
import {Avatar, ListItem} from 'react-native-elements';
import {ScrollView} from 'react-native-gesture-handler';
import HTMLView from 'react-native-htmlview';
import {DEFAULT_LAST_VIEW_MODAL, messageType} from '../../constants';
import {GREY_COLOR, OVERLAY_AVATAR_COLOR} from '../../styles';
import commonFuc from '../../utils/commonFuc';
import dateUtils from '../../utils/dateUtils';
import CustomModal from './CustomModal';

const LastViewModal = props => {
  const {modalVisible, setModalVisible} = props;

  const handleCloseModal = () => {
    setModalVisible(DEFAULT_LAST_VIEW_MODAL);
  };

  const {userList} = modalVisible;

  return (
    <CustomModal
      visible={modalVisible.isVisible}
      onCloseModal={handleCloseModal}
      title={`Đã xem (${userList.length})`}
      isPressOut={true}>
      <FlatList
        data={userList}
        keyExtractor={item => item._id}
        initialNumToRender={12}
        renderItem={({item}) => (
          <Pressable key={item?._id}>
            <ListItem
              containerStyle={{borderRadius: 5, paddingVertical: 5}}
              topDivider={false}
              bottomDivider={false}>
              <Avatar
                rounded
                title={commonFuc.getAcronym(item?.name)}
                overlayContainerStyle={{
                  backgroundColor: OVERLAY_AVATAR_COLOR,
                }}
                source={
                  item?.avatar.length > 0
                    ? {
                        uri: item?.avatar,
                      }
                    : null
                }
                size="medium"
              />
              <ListItem.Content>
                <ListItem.Title numberOfLines={1}>{item?.name}</ListItem.Title>
              </ListItem.Content>
            </ListItem>
          </Pressable>
        )}
      />
    </CustomModal>
  );
};

LastViewModal.propTypes = {
  modalVisible: PropTypes.object,
  setModalVisible: PropTypes.func,
};

LastViewModal.defaultProps = {
  modalVisible: DEFAULT_LAST_VIEW_MODAL,
  setModalVisible: null,
};

const BUTTON_RADIUS = 10;

const styles = StyleSheet.create({
  containerView: {
    paddingHorizontal: 15,
    paddingBottom: 15,
  },
});

export default LastViewModal;
