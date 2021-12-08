import PropTypes from 'prop-types';
import React, {useEffect, useState} from 'react';
import {
  FlatList,
  Modal,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {Avatar, Button, ListItem} from 'react-native-elements';
import {messageApi} from '../../api';
import {
  DEFAULT_MESSAGE_MODAL_VISIBLE,
  DEFAULT_REACTION_MODAL_VISIBLE,
  REACTIONS,
} from '../../constants';
import {GREY_COLOR, OVERLAY_AVATAR_COLOR_GREY} from '../../styles';
import commonFuc from '../../utils/commonFuc';

const ICON_WIDTH = 30;
const ICON_HEIGHT = 30;
const BUTTON_RADIUS = 10;

const ReactionModal = props => {
  const {reactProps, setReactProps} = props;
  const [currentSelected, setCurrentSelected] = useState(0);
  const [userList, setUserList] = useState(reactProps.reacts);

  useEffect(() => {
    const cleanup = setUserList(reactProps.reacts);
    return () => {
      cleanup;
    };
  }, [reactProps]);

  const handleCloseModal = () => {
    setReactProps(DEFAULT_REACTION_MODAL_VISIBLE);
  };

  const handleAddReaction = async type => {
    await messageApi.addReaction(reactProps.messageId, type);
    handleCloseModal();
  };

  const reactionSet = () => {
    const currentReactionList = reactProps.reacts.map(ele => ele.type - 1);

    return currentReactionList.sort().filter(function (item, pos, ary) {
      return !pos || item != ary[pos - 1];
    });
  };

  const handleCountReaction = reactionType => {
    let count = 0;
    reactProps.reacts.map(ele => ele.type === reactionType && count++);

    return count;
  };

  const handleOnViewUser = reactionType => {
    let newUserList = reactProps.reacts;
    if (reactionType !== 0) {
      newUserList = reactProps.reacts.filter(ele => ele.type === reactionType);
    }
    setUserList(newUserList);
    setCurrentSelected(reactionType);
  };

  return (
    <SafeAreaView style={styles.centeredView}>
      <Modal
        animationType="fade"
        transparent={true}
        visible={reactProps.isVisible}
        onRequestClose={handleCloseModal}>
        <TouchableOpacity
          activeOpacity={1}
          onPress={handleCloseModal}
          style={styles.container}>
          <SafeAreaView style={styles.reactionContainer}>
            {REACTIONS.map((value, index) => (
              <Button
                key={index}
                title={value}
                containerStyle={styles.reactionButton}
                type="clear"
                titleStyle={styles.reactionTitle}
                onPress={() => handleAddReaction(index + 1)}
              />
            ))}
          </SafeAreaView>
          <SafeAreaView style={styles.modalView}>
            <View style={{width: '100%', height: '100%'}}>
              <Text
                style={{
                  // backgroundColor: 'red',
                  // width: '100%',
                  padding: 10,
                  textAlign: 'center',
                  borderBottomColor: OVERLAY_AVATAR_COLOR_GREY,
                  borderBottomWidth: 1,
                }}>{`${reactProps.reacts.length} người đã bày tỏ cảm xúc`}</Text>
              <View style={{width: '100%'}}>
                <ScrollView horizontal={true}>
                  <TouchableOpacity onPress={() => handleOnViewUser(0)}>
                    <Text
                      style={[
                        styles.reactionScrollView,
                        currentSelected === 0
                          ? styles.reactionScrollViewSelected
                          : null,
                      ]}>
                      Tất cả {reactProps.reacts.length}
                    </Text>
                  </TouchableOpacity>
                  {reactionSet().map(value => (
                    <TouchableOpacity
                      key={value}
                      onPress={() => handleOnViewUser(value + 1)}>
                      <Text
                        style={[
                          styles.reactionScrollView,
                          currentSelected === value + 1
                            ? styles.reactionScrollViewSelected
                            : null,
                        ]}>
                        {`${REACTIONS[value]} ${handleCountReaction(
                          value + 1,
                        )}`}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
              <View style={{height: 205}}>
                <FlatList
                  data={userList}
                  keyExtractor={item => item.user._id}
                  initialNumToRender={10}
                  renderItem={({item, index}) => {
                    const {user, type} = item;
                    return (
                      <Pressable>
                        <ListItem
                          containerStyle={{
                            paddingVertical: 5,
                          }}>
                          <Avatar
                            rounded
                            title={commonFuc.getAcronym(user?.name)}
                            overlayContainerStyle={{
                              backgroundColor: user?.avatarColor,
                            }}
                            source={
                              user?.avatar?.length > 0
                                ? {
                                    uri: user.avatar,
                                  }
                                : null
                            }
                            size="medium"
                          />
                          <ListItem.Content>
                            <ListItem.Title numberOfLines={1}>
                              {user?.name}
                            </ListItem.Title>
                          </ListItem.Content>
                          {/* <MessageInfo
                            createdAt={createdAt}
                            numberUnread={numberUnread}
                          /> */}
                          <View style={styles.buttonWrap}>
                            <Text>{REACTIONS[type - 1]}</Text>
                          </View>
                        </ListItem>
                      </Pressable>
                    );
                  }}
                />
              </View>
            </View>
          </SafeAreaView>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
};

ReactionModal.propTypes = {
  reactProps: PropTypes.object,
  setReactProps: PropTypes.func,
};

ReactionModal.defaultProps = {
  reactProps: DEFAULT_MESSAGE_MODAL_VISIBLE,
  setReactProps: null,
};

const styles = StyleSheet.create({
  centeredView: {
    // flex: 1,
    // flexDirection: "row",
    // justifyContent: "center",
    // alignItems: "flex-end",
    // width: 100,
  },
  container: {
    backgroundColor: 'rgba(52, 52, 52, 0.5)',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  reactionContainer: {
    width: '80%',
    marginTop: 8,
    backgroundColor: 'white',
    borderRadius: 50,
    // paddingHorizontal: 10,
    // paddingVertical: 5,
    alignItems: 'center',
    justifyContent: 'space-evenly',
    flexDirection: 'row',
    flexWrap: 'nowrap',
  },
  modalView: {
    width: '100%',
    height: 280,
    // height: '40%',
    marginTop: 8,
    backgroundColor: 'white',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    // padding: 35,
    alignItems: 'center',
    alignContent: 'flex-start',
    // justifyContent: "space-between",
    // flexGrow: 1,
    // flexBasis: 0,
  },
  reactionButton: {
    // width: "30%",
    borderRadius: BUTTON_RADIUS,
  },
  reactionTitle: {
    fontSize: 20,
  },
  button: {
    width: '33.33%',
    borderRadius: 0,

    // backgroundColor: "red",
  },
  scene: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'pink',
  },

  title: {
    fontFamily: 'normal' || 'Arial',
    fontWeight: '100',
    color: 'black',
    fontSize: 13,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  reactionScrollView: {
    padding: 8,
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
    color: GREY_COLOR,
    backgroundColor: 'transparent',
  },
  reactionScrollViewSelected: {
    // backgroundColor: OVERLAY_AVATAR_COLOR_GREY,
    color: '#000',
    fontWeight: 'bold',
  },
});

export default ReactionModal;
