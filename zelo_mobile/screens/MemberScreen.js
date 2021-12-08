import React, {useState} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  FlatList,
  StyleSheet,
  Pressable,
  Alert,
} from 'react-native';
import {Avatar, Button, ListItem} from 'react-native-elements';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {useDispatch, useSelector} from 'react-redux';
import {conversationApi} from '../api';
import EmptyData from '../components/EmptyData';
import MemberModal from '../components/modal/MemberModal';
import {DEFAULT_MEMBER_MODAL, ERROR_MESSAGE, memberType} from '../constants';
import {fetchFriendById} from '../redux/friendSlice';
import {fetchMembers} from '../redux/messageSlice';
import {MAIN_COLOR, OVERLAY_AVATAR_COLOR} from '../styles';
import commonFuc from '../utils/commonFuc';

const MemberScreen = ({navigation}) => {
  const {members, currentConversation, currentConversationId} = useSelector(
    state => state.message,
  );
  const {userProfile} = useSelector(state => state.me);
  const [isModalVisible, setIsModalVisible] = useState(DEFAULT_MEMBER_MODAL);
  const dispatch = useDispatch();

  const handleOnDetailPress = (memberId, memberRole, memberName) => {
    const userRole = handleCheckRole(userProfile._id);

    switch (userRole) {
      case memberType.LEADER:
        setIsModalVisible({
          isVisible: true,
          memberRole,
          userRole,
          memberId,
          memberName,
        });
        break;
      case memberType.DEPUTY_LEADER:
        if (
          memberRole === memberType.LEADER ||
          memberRole === memberType.DEPUTY_LEADER
        ) {
          handleGoToPersonalScreen(memberId);
        } else {
          setIsModalVisible({
            isVisible: true,
            memberRole,
            userRole,
            memberId,
            memberName,
          });
        }

        break;
      case memberType.MEMBER:
        handleGoToPersonalScreen(memberId);
        break;
      default:
        handleGoToPersonalScreen(memberId);
        break;
    }
  };

  const handleCheckRole = userId => {
    if (userId === currentConversation.leaderId) return memberType.LEADER;

    const index = currentConversation?.managerIds.findIndex(
      ele => ele === userId,
    );

    if (index >= 0) return memberType.DEPUTY_LEADER;
    return memberType.MEMBER;
  };

  const handleGoToPersonalScreen = async userId => {
    await dispatch(fetchFriendById({userId}));
    navigation.navigate('Chi tiết bạn bè');
  };

  return (
    <SafeAreaView>
      <Text
        style={{
          color: MAIN_COLOR,
          fontWeight: 'bold',
          fontSize: 16,
          paddingHorizontal: 16,
          paddingVertical: 8,
        }}>
        Thành viên ({members.length})
      </Text>
      {members.length > 0 ? (
        <FlatList
          data={members}
          keyExtractor={item => item._id}
          initialNumToRender={12}
          renderItem={({item}) => {
            const memberRole = handleCheckRole(item._id);
            return (
              <Pressable
              // onPress={
              //   item.isExists ? () => handleGoToPersonalScreen(item._id) : null
              // }
              >
                <View style={{backgroundColor: '#fff'}}>
                  <ListItem topDivider={false}>
                    <Avatar
                      rounded
                      title={commonFuc.getAcronym(item.name)}
                      overlayContainerStyle={{
                        backgroundColor:
                          item?.avatarColor || OVERLAY_AVATAR_COLOR,
                      }}
                      source={
                        item?.avatar?.length > 0
                          ? {
                              uri: item?.avatar,
                            }
                          : null
                      }
                      size="medium"
                    />
                    <ListItem.Content>
                      <ListItem.Title numberOfLines={1}>
                        {item.name}
                      </ListItem.Title>
                      {memberRole !== memberType.MEMBER && (
                        <ListItem.Subtitle numberOfLines={1}>
                          {memberRole === memberType.LEADER
                            ? 'Trưởng nhóm'
                            : 'Phó nhóm'}
                        </ListItem.Subtitle>
                      )}
                      {/* {item._id === currentConversation.leaderId && (
                        <ListItem.Subtitle numberOfLines={1}>
                          Trưởng nhóm
                        </ListItem.Subtitle>
                      )} */}
                    </ListItem.Content>

                    {userProfile._id !== item._id && (
                      <View style={styles.buttonWrap}>
                        <Button
                          containerStyle={styles.buttonContainer}
                          buttonStyle={[styles.buttonStyle]}
                          titleStyle={[styles.buttonTitle]}
                          title="Chi tiết"
                          type="outline"
                          onPress={() =>
                            handleOnDetailPress(item._id, memberRole, item.name)
                          }
                          // onPress={() => handleDeleteMember(item._id, item.name)}
                        />
                      </View>
                    )}

                    {/* {userProfile._id === currentConversation.leaderId &&
                    item._id !== currentConversation.leaderId && (
                      <View style={styles.buttonWrap}>
                        <Button
                          containerStyle={styles.buttonContainer}
                          buttonStyle={[
                            styles.buttonStyle,
                            {borderColor: 'red'},
                          ]}
                          titleStyle={[styles.buttonTitle, {color: 'red'}]}
                          title="Xóa"
                          type="outline"
                          onPress={() =>
                            handleDeleteMember(item._id, item.name)
                          }
                        />
                      </View>
                    )} */}
                  </ListItem>
                  <View
                    style={{
                      width: '100%',
                      backgroundColor: '#E5E6E8',
                      height: 1,
                      marginLeft: 82,
                    }}></View>
                </View>
              </Pressable>
            );
          }}
        />
      ) : (
        <EmptyData />
      )}

      <MemberModal
        modalVisible={isModalVisible}
        setModalVisible={setIsModalVisible}
        navigation={navigation}
      />
    </SafeAreaView>
  );
};

export default MemberScreen;

const styles = StyleSheet.create({
  buttonWrap: {
    // backgroundColor: "red",
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  buttonStyle: {
    borderRadius: 50,
    paddingHorizontal: 15,
    paddingVertical: 5,
    minWidth: 60,
  },
  buttonTitle: {fontSize: 13},
  buttonContainer: {
    borderRadius: 50,
    marginRight: 10,
    minWidth: 60,
  },
});
