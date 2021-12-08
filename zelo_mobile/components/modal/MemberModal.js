import PropTypes from 'prop-types';
import React from 'react';
import {Alert, Platform, StyleSheet} from 'react-native';
import {Button, Icon} from 'react-native-elements';
import {useDispatch, useSelector} from 'react-redux';
import {conversationApi} from '../../api';
import {DEFAULT_MEMBER_MODAL, ERROR_MESSAGE, memberType} from '../../constants';
import {fetchFriendById} from '../../redux/friendSlice';
import {fetchMembers, updateMangerIds} from '../../redux/messageSlice';
import commonFuc from '../../utils/commonFuc';
import CustomModal from './CustomModal';

const MemberModal = props => {
  const {modalVisible, setModalVisible, navigation} = props;

  const {userProfile} = useSelector(state => state.me);
  const {currentConversationId} = useSelector(state => state.message);

  const dispatch = useDispatch();

  const handleCloseModal = () => {
    setModalVisible(DEFAULT_MEMBER_MODAL);
  };

  const handleGoToPersonalScreen = async userId => {
    await dispatch(fetchFriendById({userId}));
    handleCloseModal();
    navigation.navigate('Chi tiết bạn bè');
  };

  const handleDeleteMember = () => {
    const memberId = modalVisible.memberId;
    const memberName = modalVisible.memberName;
    try {
      Alert.alert(
        'Cảnh báo',
        `Bạn có muốn xóa ${memberName} ra khỏi nhóm không?`,
        [
          {
            text: 'Không',
          },
          {
            text: 'Có',
            onPress: async () => {
              const response = await conversationApi.deleteMember(
                currentConversationId,
                memberId,
              );
              dispatch(fetchMembers({conversationId: currentConversationId}));
              dispatch(
                updateMangerIds({
                  conversationId: currentConversationId,
                  memberId,
                  isAddManager: false,
                }),
              );
            },
          },
        ],
      );
    } catch (error) {
      console.error('Delete Member: ', error);
      commonFuc.notifyMessage(ERROR_MESSAGE);
    }
    handleCloseModal();
  };

  const handleAddManager = async () => {
    const memberId = modalVisible.memberId;
    try {
      await conversationApi.addManager(currentConversationId, [memberId]);
      dispatch(fetchMembers({conversationId: currentConversationId}));
      dispatch(
        updateMangerIds({
          conversationId: currentConversationId,
          memberId,
          isAddManager: true,
        }),
      );
    } catch (error) {
      console.error('Add manager: ', error);
      commonFuc.notifyMessage(ERROR_MESSAGE);
    }
    handleCloseModal();
  };
  const handleDeleteManager = () => {
    const memberId = modalVisible.memberId;
    const memberName = modalVisible.memberName;
    try {
      Alert.alert(
        'Cảnh báo',
        `Bạn có muốn xóa vai trò phó nhóm của ${memberName} không?`,
        [
          {
            text: 'Không',
          },
          {
            text: 'Có',
            onPress: async () => {
              await conversationApi.deleteManager(currentConversationId, [
                memberId,
              ]);
              dispatch(fetchMembers({conversationId: currentConversationId}));
              dispatch(
                updateMangerIds({
                  conversationId: currentConversationId,
                  memberId,
                  isAddManager: false,
                }),
              );
            },
          },
        ],
      );
    } catch (error) {
      console.error('Delete manager: ', error);
      commonFuc.notifyMessage(ERROR_MESSAGE);
    }
    handleCloseModal();
  };

  return (
    <CustomModal
      visible={modalVisible.isVisible}
      onCloseModal={handleCloseModal}
      isShowTitle={false}
      isPressOut={true}
      containerStyle={{width: '60%'}}>
      <Button
        title="Xem trang cá nhân"
        type="clear"
        iconPosition="left"
        icon={<Icon type="antdesign" name="user" />}
        containerStyle={[styles.button, styles.buttonTop]}
        titleStyle={styles.title}
        buttonStyle={{justifyContent: 'flex-start'}}
        onPress={() => handleGoToPersonalScreen(modalVisible.memberId)}
      />
      {modalVisible.userRole === memberType.LEADER &&
        modalVisible.memberRole == memberType.MEMBER && (
          <Button
            title="Bổ nhiệm làm phó nhóm"
            type="clear"
            iconPosition="left"
            icon={<Icon type="antdesign" name="adduser" />}
            containerStyle={styles.button}
            titleStyle={styles.title}
            buttonStyle={{justifyContent: 'flex-start'}}
            onPress={handleAddManager}
          />
        )}
      {modalVisible.userRole === memberType.LEADER &&
        modalVisible.memberRole == memberType.DEPUTY_LEADER && (
          <Button
            title="Xóa vai trò phó nhóm"
            type="clear"
            iconPosition="left"
            icon={<Icon type="antdesign" name="deleteuser" />}
            containerStyle={styles.button}
            titleStyle={styles.title}
            buttonStyle={{justifyContent: 'flex-start'}}
            onPress={handleDeleteManager}
          />
        )}
      <Button
        title="Xóa thành viên"
        type="clear"
        iconPosition="left"
        icon={<Icon type="feather" name="trash" color="red" />}
        containerStyle={[styles.button, styles.buttonBottom]}
        titleStyle={[styles.title, {color: 'red'}]}
        buttonStyle={{justifyContent: 'flex-start'}}
        onPress={handleDeleteMember}
      />
    </CustomModal>
  );
};

MemberModal.propTypes = {
  modalVisible: PropTypes.object,
  setModalVisible: PropTypes.func,
};

MemberModal.defaultProps = {
  modalVisible: DEFAULT_MEMBER_MODAL,
  setModalVisible: null,
};

const BUTTON_RADIUS = 5;

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(52, 52, 52, 0.3)',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
  },
  centeredView: {
    // flex: 1,
    // flexDirection: "row",
    // justifyContent: "center",
    // alignItems: "flex-end",
    // width: "100%",
  },
  modalView: {
    width: '100%',
    backgroundColor: 'white',
    borderRadius: 5,
    // padding: 15,
  },

  header: {
    borderBottomWidth: 1,
    borderBottomColor: '#E5E6E8',
    paddingVertical: 5,
    paddingHorizontal: 15,
  },
  title: {
    fontFamily: Platform.OS === 'ios' ? 'Arial' : 'normal',
    fontWeight: '100',
    color: 'black',
    marginLeft: 6,
  },
  body: {},
  footer: {
    paddingHorizontal: 15,
    paddingBottom: 5,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  buttonTop: {
    borderTopStartRadius: BUTTON_RADIUS,
    borderTopEndRadius: BUTTON_RADIUS,
  },
  button: {
    width: '100%',
    borderRadius: 0,
    alignItems: 'stretch',
  },
  buttonBottom: {
    borderBottomStartRadius: BUTTON_RADIUS,
    borderBottomEndRadius: BUTTON_RADIUS,
  },
});

export default MemberModal;
