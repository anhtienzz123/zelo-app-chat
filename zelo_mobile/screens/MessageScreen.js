import React, {useEffect, useRef, useState} from 'react';
import {
  BackHandler,
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {Icon} from 'react-native-elements';
import {useDispatch, useSelector} from 'react-redux';
import AnimatedEllipsis from '../components/AnimatedEllipsis';
import ChatMessage from '../components/message/ChatMessage';
import MessageBottomBar from '../components/message/MessageBottomBar';
import MessageDivider from '../components/message/MessageDivider';
import MessageHeaderLeft from '../components/message/MessageHeaderLeft';
import PinnedMessage from '../components/message/PinnedMessage';
import ImagePickerModal from '../components/modal/ImagePickerModal';
import LastViewModal from '../components/modal/LastViewModal';
import MessageDetailModal from '../components/modal/MessageDetailModal';
import MessageModal from '../components/modal/MessageModal';
import PinMessageModal from '../components/modal/PinMessageModal';
import ReactionModal from '../components/modal/ReactionModal';
import ViewImageModal from '../components/modal/ViewImageModal';
import VoteDetailModal from '../components/modal/VoteDetailModal';
import StickyBoard from '../components/StickyBoard';
import {
  DEFAULT_IMAGE_MODAL,
  DEFAULT_LAST_VIEW_MODAL,
  DEFAULT_MESSAGE_DETAIL_MODAL,
  DEFAULT_MESSAGE_MODAL_VISIBLE,
  DEFAULT_MESSAGE_PARAMS,
  DEFAULT_PAGE,
  DEFAULT_PAGE_SIZE,
  DEFAULT_PIN_MESSAGE_MODAL,
  DEFAULT_REACTION_MODAL_VISIBLE,
  DEFAULT_REPLY_MESSAGE,
  DEFAULT_VOTE_DETAIL_MODAL,
} from '../constants';
import {
  clearMessagePages,
  fetchChannelMessages,
  fetchChannels,
  fetchListLastViewer,
  fetchMembers,
  fetchMessages,
  setCurrentChannel,
  updateCurrentConversation,
} from '../redux/messageSlice';
import {fetchPinMessages, resetPinSlice} from '../redux/pinSlice';

const page = DEFAULT_PAGE;
const size = DEFAULT_PAGE_SIZE;

export default function MessageScreen({navigation, route}) {
  // Props
  const {conversationId, channelIdRef} = route.params;
  const dispatch = useDispatch();
  const {
    messages,
    messagePages,
    currentConversation,
    currentChannelId,
    usersTyping,
    isLoading,
    members,
    channelPages,
    channelMessages,
  } = useSelector(state => state.message);
  const {currentUserId, keyboardHeight} = useSelector(state => state.global);
  // const {totalPages} = messagePages;

  // State
  const [isGeneralChannel, setIsGeneralChannel] = useState(true);
  const [modalVisible, setModalVisible] = useState(
    DEFAULT_MESSAGE_MODAL_VISIBLE,
  );
  const [imageModalVisible, setImageModalVisible] = useState(false);
  const [reactProps, setReactProps] = useState(DEFAULT_REACTION_MODAL_VISIBLE);
  const [messageDetailProps, setMessageDetailProps] = useState(
    DEFAULT_MESSAGE_DETAIL_MODAL,
  );
  const [pinMessageVisible, setPinMessageVisible] = useState(
    DEFAULT_PIN_MESSAGE_MODAL,
  );
  const [imageProps, setImageProps] = useState(DEFAULT_IMAGE_MODAL);
  const [lastViewProps, setLastViewProps] = useState(DEFAULT_LAST_VIEW_MODAL);
  const [replyMessage, setReplyMessage] = useState(DEFAULT_REPLY_MESSAGE);
  const [stickyBoardVisible, setStickyBoardVisible] = useState(false);
  const [apiParams, setApiParams] = useState(DEFAULT_MESSAGE_PARAMS);
  const [voteDetailsProps, setVoteDetailsProps] = useState(
    DEFAULT_VOTE_DETAIL_MODAL,
  );

  // Ref
  const scrollViewRef = useRef(null);
  const positionRef = useRef(0);

  const handleGoBack = () => {
    dispatch(clearMessagePages());
    dispatch(resetPinSlice());
    navigation.popToTop();
    // navigation.goBack();
    return true;
  };

  const handleGoToOptionScreen = () => {
    dispatch(fetchChannels({conversationId: currentConversation._id}));
    navigation.navigate('Tùy chọn', {
      conversationId,
      channelIdRef,
    });
  };

  const handleOnReplyMessagePress = messageId => {
    const messageList = isGeneralChannel ? messages : channelMessages;

    const replyMessage = messageList.find(
      messageEle => messageEle._id === messageId,
    );
    setReplyMessage({
      isReply: true,
      replyMessage,
    });
  };

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', handleGoBack);

    return () => {
      BackHandler.removeEventListener('hardwareBackPress', handleGoBack);
    };
  }, []);

  const headerRight = () => (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginRight: 20,
      }}>
      <TouchableOpacity onPress={handleGoToOptionScreen}>
        <Icon name="bars" type="antdesign" size={22} color="white" />
      </TouchableOpacity>
    </View>
  );

  const headerLeft = () => (
    <MessageHeaderLeft
      goBack={handleGoBack}
      totalMembers={currentConversation?.totalMembers}
      name={currentConversation?.name}
      currentConversationId={conversationId}
    />
  );

  useEffect(() => {
    dispatch(updateCurrentConversation({conversationId}));
    dispatch(
      setCurrentChannel({
        currentChannelId: conversationId,
        currentChannelName: conversationId,
      }),
    );
    dispatch(fetchListLastViewer({conversationId}));
    dispatch(fetchMembers({conversationId}));
    //
    dispatch(fetchMessages({conversationId, apiParams}));
    dispatch(fetchPinMessages({conversationId}));
  }, []);

  useEffect(() => {
    navigation.setOptions({
      title: '',
      headerLeft,
      headerRight,
    });
    setIsGeneralChannel(conversationId === currentChannelId);
    setApiParams(DEFAULT_MESSAGE_PARAMS);
  }, [currentConversation, currentChannelId]);

  // useLayoutEffect(() => {
  //   navigation.setOptions({
  //     title: '',
  //     headerLeft,
  //     headerRight,
  //   });
  // }, [navigation]);

  const renderMessage = (currentMessage, index) => {
    const isMyMessage = currentUserId === currentMessage.user._id;
    const messageList = isGeneralChannel ? messages : channelMessages;
    const nextMessage = messageList?.[index + 1];

    const nextMessageTime = new Date(nextMessage?.createdAt);
    const messageTime = new Date(currentMessage.createdAt);
    const messageTimeTemp = new Date(currentMessage.createdAt);

    const isSeparate =
      messageTimeTemp.setMinutes(messageTimeTemp.getMinutes() - 5) >
      nextMessageTime;

    return (
      <TouchableWithoutFeedback
        onPress={() => {
          Keyboard.dismiss();
          setStickyBoardVisible(false);
        }}>
        <View>
          {isSeparate && <MessageDivider dateString={messageTime} />}
          <ChatMessage
            message={currentMessage}
            isMyMessage={isMyMessage}
            setModalVisible={setModalVisible}
            showReactDetails={setReactProps}
            navigation={navigation}
            setImageProps={setImageProps}
            isLastMessage={index === 0}
            onLastView={setLastViewProps}
            onViewVoteDetailModal={setVoteDetailsProps}
          />
        </View>
      </TouchableWithoutFeedback>
    );
  };

  const goToNextPage = async () => {
    const currentPage = apiParams.page;

    const totalPages = isGeneralChannel
      ? messagePages?.totalPages
      : channelPages?.totalPages;

    if (currentPage < totalPages) {
      const nextPage = currentPage + 1;
      const newParam = {...apiParams, page: nextPage};

      isGeneralChannel
        ? await dispatch(fetchMessages({conversationId, apiParams: newParam}))
        : await dispatch(
            fetchChannelMessages({
              channelId: currentChannelId,
              apiParams: newParam,
            }),
          );

      setApiParams(newParam);
    }
  };

  const onContentOffsetChanged = distanceFromTop => {
    positionRef.current = distanceFromTop;
  };

  return (
    <TouchableWithoutFeedback>
      <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' && 'padding'}
          style={styles.container}
          keyboardVerticalOffset={90}>
          <>
            {isGeneralChannel && (
              <PinnedMessage openPinMessage={setPinMessageVisible} />
            )}
            <FlatList
              onEndReached={() => {
                goToNextPage();
              }}
              data={isGeneralChannel ? messages : channelMessages}
              keyExtractor={item => item._id}
              renderItem={({item, index}) => renderMessage(item, index)}
              initialNumToRender={20}
              ListFooterComponent={() =>
                isLoading ? <MessageDivider isLoading={true} /> : null
              }
              inverted
              contentContainerStyle={{paddingBottom: 15}}
            />

            {usersTyping.length > 0 && (
              <View style={styles.typingContainer}>
                <View style={styles.typingWrap}>
                  <Text style={styles.typingText}>
                    {`${usersTyping[0].name} đang nhập `}
                  </Text>
                  <AnimatedEllipsis style={styles.dot} />
                </View>
              </View>
            )}
            <MessageBottomBar
              conversationId={conversationId}
              showStickyBoard={setStickyBoardVisible}
              showImageModal={setImageModalVisible}
              stickyBoardVisible={stickyBoardVisible}
              members={members.map(member => {
                return {...member, id: member._id};
              })}
              type={currentConversation.type}
              replyMessage={replyMessage}
              setReplyMessage={setReplyMessage}
            />

            <StickyBoard
              height={keyboardHeight}
              visible={stickyBoardVisible}
              setVisible={setStickyBoardVisible}
            />
          </>
          <ReactionModal
            reactProps={reactProps}
            setReactProps={setReactProps}
          />
          <ImagePickerModal
            modalVisible={imageModalVisible}
            setModalVisible={setImageModalVisible}
          />
          <MessageModal
            modalVisible={modalVisible}
            setModalVisible={setModalVisible}
            setPinMessageVisible={setPinMessageVisible}
            navigation={navigation}
            handleOnReplyMessagePress={handleOnReplyMessagePress}
          />
          {pinMessageVisible.isVisible && (
            <PinMessageModal
              modalVisible={pinMessageVisible}
              setModalVisible={setPinMessageVisible}
              onViewImage={setImageProps}
              onViewDetail={setMessageDetailProps}
            />
          )}
          {imageProps.isVisible && (
            <ViewImageModal
              imageProps={imageProps}
              setImageProps={setImageProps}
            />
          )}
          {messageDetailProps.isVisible && (
            <MessageDetailModal
              modalVisible={messageDetailProps}
              setModalVisible={setMessageDetailProps}
            />
          )}
          {lastViewProps.isVisible && (
            <LastViewModal
              modalVisible={lastViewProps}
              setModalVisible={setLastViewProps}
            />
          )}

          {voteDetailsProps.isVisible && (
            <VoteDetailModal
              modalProps={voteDetailsProps}
              onShowModal={setVoteDetailsProps}
            />
          )}
        </KeyboardAvoidingView>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#E2E9F1'},
  headerTitle: {
    color: '#fff',
    fontSize: 20,
  },
  headerSubTitle: {
    color: '#fff',
    fontSize: 12,
  },
  typingContainer: {width: '100%', flexDirection: 'row'},
  typingWrap: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    justifyContent: 'flex-start',

    marginTop: -10,
    paddingTop: 5,
    paddingHorizontal: 15,

    borderTopWidth: 1,
    borderRightWidth: 1,
    borderTopColor: '#E5E6E7',
    borderRightColor: '#E5E6E7',
    borderTopRightRadius: 10,
  },
  typingText: {
    fontSize: 14,
  },
  dot: {
    fontSize: 18,
    // flexDirection: 'column',
    color: '#aaa',
    padding: 0,
  },
});
