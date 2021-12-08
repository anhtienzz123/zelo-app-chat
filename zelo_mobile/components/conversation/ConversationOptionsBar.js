import PropTypes from 'prop-types';
import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Button, Icon} from 'react-native-elements';
import {useDispatch, useSelector} from 'react-redux';
import {conversationApi} from '../../api';
import {DEFAULT_ADD_VOTE_MODAL} from '../../constants';
import {fetchFriendById} from '../../redux/friendSlice';
import {updateNotification} from '../../redux/messageSlice';
import commonFuc from '../../utils/commonFuc';

const ICON_SIZE = 20;

const ConversationOptionsBar = props => {
  const {name, type, setModalVisible, openAddVoteModal, navigation, notify} =
    props;
  const {currentConversation, currentConversationId} = useSelector(
    state => state.message,
  );

  const dispatch = useDispatch();

  const handleOpenAddVoteModal = () => {
    openAddVoteModal({...DEFAULT_ADD_VOTE_MODAL, isVisible: true});
  };

  const handleGoToPersonalScreen = async () => {
    const userId = currentConversation.userId;
    await dispatch(fetchFriendById({userId}));
    navigation.navigate('Chi tiết bạn bè');
  };

  const handleNotifications = async () => {
    try {
      const conversationId = currentConversation._id;
      // false: 0, true: 1
      const isNotify = !notify;
      const response = await conversationApi.updateNotify(
        conversationId,
        isNotify ? 1 : 0,
      );
      dispatch(updateNotification({conversationId, isNotify}));

      commonFuc.notifyMessage(`Đã ${notify ? 'tắt' : 'bật'} thông báo`);
    } catch (error) {}
  };

  const handleGotoAddMemberScreen = () => {
    navigation.navigate('Tìm kiếm bạn bè', {
      isAddToGroup: true,
      currentConversationId,
    });
  };
  return (
    <View style={styles.container}>
      {type ? (
        <>
          <Button
            title="Thêm thành viên"
            containerStyle={styles.button}
            type="clear"
            icon={
              <Icon
                name="addusergroup"
                type="antdesign"
                size={ICON_SIZE}
                containerStyle={styles.iconContainer}
              />
            }
            titleStyle={styles.title}
            iconPosition="top"
            onPress={handleGotoAddMemberScreen}
          />
          <Button
            title="Tạo bình chọn"
            containerStyle={styles.button}
            type="clear"
            icon={
              <Icon
                name="chart"
                type="simple-line-icon"
                size={ICON_SIZE}
                containerStyle={styles.iconContainer}
              />
            }
            titleStyle={styles.title}
            iconPosition="top"
            onPress={handleOpenAddVoteModal}
          />
        </>
      ) : (
        <Button
          title="Trang cá nhân"
          containerStyle={styles.button}
          type="clear"
          icon={
            <Icon
              name="person-outline"
              type="ionicon"
              size={ICON_SIZE}
              containerStyle={styles.iconContainer}
            />
          }
          titleStyle={styles.title}
          iconPosition="top"
          onPress={handleGoToPersonalScreen}
        />
      )}
      <Button
        title={type ? 'Đặt tên nhóm' : 'Đặt biệt danh'}
        onPress={() =>
          setModalVisible({
            conversationName: name,
            isVisible: true,
            type,
          })
        }
        containerStyle={styles.button}
        type="clear"
        icon={
          <Icon
            name="edit"
            type="antdesign"
            size={ICON_SIZE}
            containerStyle={styles.iconContainer}
          />
        }
        titleStyle={styles.title}
        iconPosition="top"
      />
      <Button
        title={`${notify ? 'Tắt' : 'Bật'} thông báo`}
        containerStyle={styles.button}
        type="clear"
        icon={
          <Icon
            name={
              notify ? 'notifications-outline' : 'notifications-off-outline'
            }
            type="ionicon"
            size={ICON_SIZE}
            containerStyle={styles.iconContainer}
          />
        }
        titleStyle={styles.title}
        iconPosition="top"
        onPress={handleNotifications}
      />
    </View>
  );
};

ConversationOptionsBar.propTypes = {
  avatars: PropTypes.any,
  name: PropTypes.string,
  type: PropTypes.bool,
  notify: PropTypes.bool,
  setModalVisible: PropTypes.func,
  openAddVoteModal: PropTypes.func,
};

ConversationOptionsBar.defaultProps = {
  avatars: '',
  name: '',
  type: false,
  notify: false,
  setModalVisible: null,
  openAddVoteModal: null,
};
export default ConversationOptionsBar;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: '100%',
  },
  iconContainer: {
    backgroundColor: '#f3f4f8',
    padding: 8,
    borderRadius: 50,
    marginBottom: 10,
  },
  button: {},
  title: {
    fontWeight: '100',
    color: 'black',
    fontSize: 13,
    width: 70,
  },
});
