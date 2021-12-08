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
import {Avatar, ListItem} from 'react-native-elements';
import {useSelector} from 'react-redux';
import {
  DEFAULT_MESSAGE_MODAL_VISIBLE,
  DEFAULT_REACTION_MODAL_VISIBLE,
} from '../../constants';
import {
  GREY_COLOR,
  OVERLAY_AVATAR_COLOR,
  OVERLAY_AVATAR_COLOR_GREY,
} from '../../styles';
import commonFuc from '../../utils/commonFuc';
import EmptyData from '../EmptyData';

const BUTTON_RADIUS = 10;

const VoteDetailModal = props => {
  const {modalProps, onShowModal} = props;
  const [currentSelected, setCurrentSelected] = useState(0);
  const {members} = useSelector(state => state.message);

  const handleCloseModal = () => {
    onShowModal(DEFAULT_REACTION_MODAL_VISIBLE);
  };

  const handleOnPress = index => {
    setCurrentSelected(index);
  };

  const handleFindIndex = () => {
    const index = modalProps.options.findIndex(ele => ele.userIds.length > 0);
    setCurrentSelected(index);
  };

  useEffect(() => {
    const cleanup = handleFindIndex();
    return () => {
      cleanup;
    };
  }, [modalProps]);

  return (
    <SafeAreaView style={styles.centeredView}>
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalProps.isVisible}
        onRequestClose={handleCloseModal}>
        <TouchableOpacity
          activeOpacity={1}
          onPress={handleCloseModal}
          style={styles.container}>
          <SafeAreaView style={styles.modalView}>
            <View style={{width: '100%', height: '100%'}}>
              <View
                style={{
                  width: '100%',
                  borderBottomWidth: 1,
                  borderBottomColor: OVERLAY_AVATAR_COLOR_GREY,
                  paddingHorizontal: 8,
                }}>
                <ScrollView horizontal={true}>
                  {modalProps.options.map(
                    (item, index) =>
                      item.userIds.length > 0 && (
                        <TouchableOpacity
                          key={item._id}
                          onPress={() => handleOnPress(index)}>
                          <View
                            style={[
                              {flexDirection: 'row'},
                              styles.reactionScrollView,
                            ]}>
                            <Text
                              style={[
                                {maxWidth: 150},
                                currentSelected === index
                                  ? styles.reactionScrollViewSelected
                                  : null,
                              ]}
                              numberOfLines={1}>
                              {item.name}
                            </Text>
                            <Text
                              style={[
                                currentSelected === index
                                  ? styles.reactionScrollViewSelected
                                  : null,
                              ]}>{` (${item.userIds.length})`}</Text>
                          </View>
                        </TouchableOpacity>
                      ),
                  )}
                </ScrollView>
              </View>
              <View style={{height: 205}}>
                {modalProps.options[currentSelected].userIds.length > 0 ? (
                  <FlatList
                    data={modalProps.options[currentSelected].userIds}
                    keyExtractor={item => item}
                    initialNumToRender={10}
                    renderItem={({item, index}) => {
                      const member = members.find(ele => ele._id === item);
                      return (
                        <Pressable>
                          <ListItem
                            containerStyle={{
                              paddingVertical: 5,
                            }}>
                            <Avatar
                              rounded
                              title={commonFuc.getAcronym(member?.name)}
                              icon={{name: 'person'}}
                              overlayContainerStyle={{
                                backgroundColor:
                                  member?.avatarColor || OVERLAY_AVATAR_COLOR,
                              }}
                              source={
                                member?.avatar?.length > 0
                                  ? {
                                      uri: member.avatar,
                                    }
                                  : null
                              }
                              size="medium"
                            />
                            <ListItem.Content>
                              <ListItem.Title
                                numberOfLines={1}
                                style={
                                  member?.name ? null : {color: GREY_COLOR}
                                }>
                                {member?.name || 'Đã rời nhóm'}
                              </ListItem.Title>
                            </ListItem.Content>
                          </ListItem>
                        </Pressable>
                      );
                    }}
                  />
                ) : (
                  <EmptyData />
                )}
              </View>
            </View>
          </SafeAreaView>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
};

VoteDetailModal.propTypes = {
  modalProps: PropTypes.object,
  onShowModal: PropTypes.func,
};

VoteDetailModal.defaultProps = {
  modalProps: DEFAULT_MESSAGE_MODAL_VISIBLE,
  onShowModal: null,
};

const styles = StyleSheet.create({
  centeredView: {},
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

export default VoteDetailModal;
