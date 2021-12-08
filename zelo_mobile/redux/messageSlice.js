import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import PushNotification from 'react-native-push-notification';
import {channelApi, conversationApi, messageApi} from '../api';
import {messageType} from '../constants';
import commonFuc from '../utils/commonFuc';
import dateUtils from '../utils/dateUtils';
import store from './store';

const KEY = 'message';

const initialState = {
  isLoading: false,
  conversations: [],
  messagePages: {},
  messages: [],
  currentConversationId: '',
  currentConversation: {},
  currentVote: {},
  listLastViewer: [],
  usersTyping: [],
  files: {},
  members: [],
  channels: [],
  currentChannelId: '',
  channelPages: {},
  channelMessages: [],
  currentChannelName: '',
};

export const fetchConversations = createAsyncThunk(
  `${KEY}/fetchConversations`,
  async (params, thunkApi) => {
    const conversations = await conversationApi.fetchConversations();
    return conversations;
  },
);

export const fetchMessages = createAsyncThunk(
  `${KEY}/fetchMessages`,
  async (params, thunkApi) => {
    const {conversationId, apiParams, isSendMessage = false} = params;
    const messages = await messageApi.fetchMessage(conversationId, apiParams);
    return {messages, conversationId, isSendMessage};
  },
);

export const fetchChannelMessages = createAsyncThunk(
  `${KEY}/fetchChannelMessages`,
  async (params, thunkApi) => {
    const {channelId, apiParams, isSendMessage = false} = params;
    const messages = await channelApi.fetchMessages(channelId, apiParams);
    return {messages, channelId, isSendMessage};
  },
);

export const fetchListLastViewer = createAsyncThunk(
  `${KEY}/fetchListLastViewer`,
  async (params, thunkApi) => {
    const {conversationId} = params;
    const data = await conversationApi.fetchListLastViewer(conversationId);
    return data;
  },
);

export const fetchListLastChannelViewer = createAsyncThunk(
  `${KEY}/fetchListLastChannelViewer`,
  async (params, thunkApi) => {
    const {channelId} = params;
    const data = await channelApi.fetchLastView(channelId);
    return data;
  },
);

export const fetchFiles = createAsyncThunk(
  `${KEY}/fetchFiles`,
  async (params, thunkApi) => {
    const {conversationId, type} = params;
    const data = await messageApi.fetchFiles(conversationId, {type});
    return data;
  },
);

export const fetchMembers = createAsyncThunk(
  `${KEY}/fetchMembers`,
  async (params, thunkApi) => {
    const {conversationId} = params;
    const data = await conversationApi.fetchMembers(conversationId);
    return data;
  },
);

export const fetchChannels = createAsyncThunk(
  `${KEY}/fetchChannels`,
  async (params, thunkApi) => {
    const {conversationId} = params;
    const data = await channelApi.fetchChannels(conversationId);
    return data;
  },
);

const messageSlice = createSlice({
  name: KEY,
  initialState,

  reducers: {
    // thay doi state
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },

    setCurrentVote: (state, action) => {
      state.currentVote = action.payload;
    },

    // TODO:---------------------- clearMessagePages ----------------------
    clearMessagePages: (state, action) => {
      Object.assign(state, {
        ...initialState,
        isLoading: false,
        conversations: state.conversations,
      });
    },

    // TODO:---------------------- updateCurrentConversation ----------------------
    updateCurrentConversation: (state, action) => {
      const {conversationId} = action.payload;
      const newConversation = state.conversations.find(
        conversationEle => conversationEle._id === conversationId,
      );

      state.currentConversation = newConversation;
    },

    // TODO:---------------------- addMessage ----------------------
    addMessage: (state, action) => {
      const {conversationId, message} = action.payload;

      // tìm conversation
      const index = state.conversations.findIndex(
        conversationEle => conversationEle._id === conversationId,
      );
      const seachConversation = state.conversations[index];

      seachConversation.numberUnread = seachConversation.numberUnread + 1;
      seachConversation.lastMessage = {
        ...message,
        createdAt: dateUtils.toTime(message.createdAt),
      };
      // xóa conversation đó ra
      const conversationTempt = state.conversations.filter(
        conversationEle => conversationEle._id !== conversationId,
      );

      if (
        conversationId === state.currentConversationId &&
        state.currentChannelId === state.currentConversationId
      ) {
        const length = state.messages.length;

        if (length) {
          const messagesReverse = state.messages.reverse();
          const lastMessage = messagesReverse[length - 1];

          const messageIndex = messagesReverse.findIndex(
            ele => ele._id === message._id,
          );

          // if (lastMessage._id !== message._id) {
          if (messageIndex < 0) {
            messagesReverse.push(message);
            state.messages = messagesReverse.reverse();
          }
        } else {
          state.messages.push(message);
        }
        seachConversation.numberUnread = 0;
      }

      state.conversations = [seachConversation, ...conversationTempt];
    },

    // TODO:---------------------- addChannelMessage ----------------------
    addChannelMessage: (state, action) => {
      const {conversationId, channelId, message} = action.payload;

      // tìm conversation
      const index = state.channels.findIndex(
        channelEle => channelEle._id === channelId,
      );
      const seachChannel = state.channels[index];

      seachChannel.numberUnread = seachChannel.numberUnread + 1;
      seachChannel.lastMessage = {
        ...message,
        createdAt: dateUtils.toTime(message.createdAt),
      };
      // xóa conversation đó ra
      // const channelTempt = state.conversations.filter(
      //   channelEle => channelEle._id !== channelId,
      // );

      if (
        channelId === state.currentChannelId &&
        state.currentChannelId !== state.currentConversationId
      ) {
        const length = state.channelMessages.length;

        if (length) {
          const messagesReverse = state.channelMessages.reverse();
          const lastMessage = messagesReverse[length - 1];
          if (lastMessage._id !== message._id) {
            messagesReverse.push(message);
            state.channelMessages = messagesReverse.reverse();
          }
        } else {
          state.channelMessages.push(message);
        }
        seachChannel.numberUnread = 0;
      }

      // state.conversations = [seachConversation, ...channelTempt];
    },

    //  TODO:---------------------- deleteMessage ----------------------
    deleteMessage: (state, action) => {
      const {conversationId, channelId, id} = action.payload;
      const conversations = state.conversations;
      const messages = state.messages.reverse();

      // tìm conversation
      const index = conversations.findIndex(
        conversationEle => conversationEle._id === conversationId,
      );
      if (index > -1) {
        const seachConversation = conversations[index];
        const lastMessage = seachConversation.lastMessage;

        if (lastMessage._id === id) {
          const newConversations = [...conversations];
          const newLastMessage = {...lastMessage, isDeleted: true};
          newConversations[index].lastMessage = newLastMessage;
          state.conversations = newConversations;
        }
      }
      if (conversationId === state.currentConversationId) {
        // tìm messages
        const index = messages.findIndex(messageEle => messageEle._id === id);
        if (index > -1) {
          const seachMessage = messages[index];
          const newMessage = [...messages];

          newMessage[index] = {
            _id: seachMessage._id,
            isDeleted: true,
            user: seachMessage.user,
            createdAt: seachMessage.createdAt,
          };
          state.messages = newMessage.reverse();
        }
      }
      if (channelId === state.currentChannelId) {
        const channelMessages = state.channelMessages.reverse();
        // tìm messages
        const index = channelMessages.findIndex(
          messageEle => messageEle._id === id,
        );
        if (index > -1) {
          const seachMessage = channelMessages[index];
          const newChannelMessages = [...channelMessages];

          newChannelMessages[index] = {
            _id: seachMessage._id,
            isDeleted: true,
            user: seachMessage.user,
            createdAt: seachMessage.createdAt,
          };
          state.channelMessages = newChannelMessages.reverse();
        }
      }
    },

    // TODO:---------------------- deleteMessageOnlyMe ----------------------
    deleteMessageOnlyMe: (state, action) => {
      const messageId = action.payload;
      const messages = state.messages.reverse();

      // xóa messages đó ra
      const newMessages = messages.filter(
        messageEle => messageEle._id !== messageId,
      );
      state.messages = newMessages.reverse();
    },

    // TODO:---------------------- addReaction ----------------------
    addReaction: (state, action) => {
      const {conversationId, channelId, messageId, user, type} = action.payload;

      if (conversationId === state.currentConversationId) {
        const messages = state.messages.reverse();
        // tìm messages
        const index = messages.findIndex(
          messageEle => messageEle._id === messageId,
        );
        if (index > -1) {
          const seachMessage = messages[index];
          const newMessage = [...messages];
          const oldReacts = seachMessage.reacts;

          // tìm user
          const userIndex = oldReacts.findIndex(
            reactEle => reactEle.user._id === user._id,
          );
          const newReact = {user, type: +type};
          let newReacts = oldReacts;

          if (userIndex === -1) {
            newReacts = [...oldReacts, newReact];
          } else {
            newReacts[userIndex] = newReact;
          }

          newMessage[index] = {...seachMessage, reacts: newReacts};
          state.messages = [];
          state.messages = newMessage.reverse();
        }
      }
    },

    // TODO:---------------------- renameConversation ----------------------
    renameConversation: (state, action) => {
      const {conversationId, conversationName, message} = action.payload;
      // tìm conversation
      const index = state.conversations.findIndex(
        conversationEle => conversationEle._id === conversationId,
      );
      const seachConversation = state.conversations[index];

      seachConversation.numberUnread = seachConversation.numberUnread + 1;
      seachConversation.lastMessage = {
        ...message,
        createdAt: dateUtils.toTime(message.createdAt),
      };
      seachConversation.name = conversationName;
      // xóa conversation đó ra
      const conversationTempt = state.conversations.filter(
        conversationEle => conversationEle._id !== conversationId,
      );

      if (conversationId === state.currentConversationId) {
        const length = state.messages.length;

        if (length) {
          const messagesReverse = state.messages.reverse();
          const lastMessage = messagesReverse[length - 1];
          if (lastMessage._id !== message._id) {
            messagesReverse.push(message);
            state.messages = messagesReverse.reverse();
          }
        } else {
          state.messages.push(message);
        }
        seachConversation.numberUnread = 0;
      }

      state.currentConversation = seachConversation;
      state.conversations = [seachConversation, ...conversationTempt];
    },

    // TODO:---------------------- updateVoteMessage ----------------------
    updateVoteMessage: (state, action) => {
      const {conversationId, message} = action.payload;
      // Update vote in message
      const currentMessages = state.messages;
      const newMessages = currentMessages.map(messageEle =>
        messageEle._id === message._id ? message : messageEle,
      );
      state.messages = newMessages;

      // Update currentVote in store
      const voteStoreId = state.currentVote?._id;
      if (voteStoreId === message._id) {
        state.currentVote = message;
      }
    },

    // TODO:---------------------- setNotification ----------------------
    setNotification: (state, action) => {
      const {conversationId, message, userId} = action.payload;
      const conversation = state.conversations.find(ele => {
        return ele._id === conversationId;
      });

      if (!conversation.isNotify) {
        return;
      }
      if (state.conversations.length <= 0) {
        return;
      }

      if (userId === message.user._id) {
        return;
      }

      const messageContent = message.content;
      let messageContentNotify = messageContent;

      switch (message.type) {
        case messageType.IMAGE:
          messageContentNotify = '[Hình ảnh]';
          break;
        case messageType.STICKER:
          messageContentNotify = '[Nhãn dán]';
          break;
        case messageType.HTML:
          messageContentNotify = '[Văn bản]';
          break;
        case messageType.VIDEO:
          const fileNameVideo = commonFuc.getFileName(messageContent);
          messageContentNotify = `[Video] ${fileNameVideo}`;
          break;
        case messageType.FILE:
          const fileName = commonFuc.getFileName(messageContent);
          messageContentNotify = `[File] ${fileName}`;
          break;
        case messageType.VOTE:
          messageContentNotify = `Đã tạo cuộc bình chọn mới ${messageContent}`;
          break;
        case messageType.TEXT:
          messageContentNotify = messageContent;
          break;
        case messageType.NOTIFY:
          messageContentNotify = commonFuc.getNotifyContent(
            messageContent,
            false,
            message,
            userId,
          );
          break;

        default:
          messageContentNotify = messageContent;
          break;
      }

      PushNotification.localNotification({
        channelId: 'new-message',
        title: conversation.name,
        message: conversation.type
          ? `${message.user.name}: ${messageContentNotify}`
          : messageContentNotify,
        id: state.messages.length,
        soundName: 'my_sound.mp3',
        playSound: true,
      });
    },

    // TODO:---------------------- updateNotification ----------------------
    updateNotification: (state, action) => {
      const {conversationId, isNotify} = action.payload;
      const oldCurrentConversation = state.currentConversation;
      state.currentConversation = {...oldCurrentConversation, isNotify};

      const oldConversations = state.conversations;
      const index = oldConversations.findIndex(
        ele => ele._id === conversationId,
      );

      if (index >= 0) {
        const oldConversation = oldConversations[index];
        state.conversations[index] = {...oldConversation, isNotify};
      }
    },

    // TODO:---------------------- setListLastViewer ----------------------
    setListLastViewer: (state, action) => {
      const {conversationId, channelId, userId, lastView} = action.payload;

      if (conversationId !== state.currentConversationId) return;
      if (
        state.currentConversation.type === true &&
        channelId !== state.currentChannelId
      )
        return;

      const index = state.listLastViewer.findIndex(
        ele => ele.user._id === userId,
      );

      if (index >= 0) {
        state.listLastViewer[index].lastView = lastView;
      } else {
        let user;
        if (state.currentConversation.type) {
          const {_id, name, avatar} = state.members.find(
            ele => ele._id === userId,
          );
          user = {_id, name, avatar};
        } else {
          const {userId, name, avatar} = state.currentConversation;
          user = {_id: userId, name, avatar};
        }
        const listLastViewerOld = state.listLastViewer;
        state.listLastViewer = listLastViewerOld.push({lastView, user});
      }
    },

    // TODO:---------------------- usersTyping ----------------------
    usersTyping: (state, action) => {
      const {conversationId, user, currentUserId} = action.payload;

      if (currentUserId === user._id) return;
      if (conversationId !== state.currentConversationId) return;
      if (conversationId !== state.currentChannelId) return;

      const oldUsersTyping = state.usersTyping;

      const index = oldUsersTyping.findIndex(
        userEle => userEle._id === user._id,
      );

      if (index < 0) {
        state.usersTyping = [...oldUsersTyping, user];
      }
    },

    // TODO:---------------------- usersNotTyping ----------------------
    usersNotTyping: (state, action) => {
      const {conversationId, user} = action.payload;

      if (conversationId !== state.currentConversationId) return;

      const oldUsersTyping = state.usersTyping;

      const newUsersTyping = oldUsersTyping.filter(
        userEle => userEle._id !== user._id,
      );

      state.usersTyping = newUsersTyping;
    },

    // TODO:---------------------- setCurrentChannel ----------------------
    setCurrentChannel: (state, action) => {
      const {currentChannelId, currentChannelName} = action.payload;
      state.currentChannelId = currentChannelId;
      state.currentChannelName = currentChannelName;
    },

    // TODO:---------------------- clearChannelMessages ----------------------
    clearChannelMessages: (state, action) => {
      state.channelMessages = [];
    },

    // TODO:---------------------- updateChannel ----------------------
    updateChannel: (state, action) => {
      const {channelId, conversationId, newChannelName} = action.payload;
      const currentChannelId = state.currentChannelId;

      if (currentChannelId === channelId) {
        state.currentChannelName = newChannelName;
      }

      const channels = state.channels;

      const channelIndex = channels.findIndex(
        channelEle => channelEle._id === channelId,
      );

      const oldChannel = channels[channelIndex];

      state.channels[channelIndex] = {...oldChannel, name: newChannelName};
    },

    // TODO:---------------------- deleteChannel ----------------------
    deleteChannel: (state, action) => {
      const {channelId, conversationId} = action.payload;

      const oldChannels = state.channels;
      const newChannels = oldChannels.filter(
        channelEle => channelEle._id !== channelId,
      );

      state.channels = newChannels;
      if (state.currentChannelId === channelId) {
        state.messages = [];
      }
      state.channelMessages = [];
      state.currentChannelId = conversationId;
      state.currentChannelName = conversationId;
    },

    // TODO:---------------------- clearMessages ----------------------
    clearMessages: (state, action) => {
      state.messages = [];
    },

    // TODO:---------------------- resetMessageSlice ----------------------
    resetMessageSlice: (state, action) => {
      Object.assign(state, initialState);
    },

    // TODO:---------------------- updateAvatarConversation ----------------------
    updateAvatarConversation: (state, action) => {
      const {conversationId, conversationAvatar, message} = action.payload;

      if (conversationId === state.currentConversationId) {
        const oldConversation = state.currentConversation;

        state.currentConversation = {
          ...oldConversation,
          avatar: conversationAvatar,
        };
      }

      const index = state.conversations.findIndex(
        ele => ele._id === conversationId,
      );

      const conversationSearch = state.conversations[index];

      state.conversations[index] = {
        ...conversationSearch,
        avatar: conversationAvatar,
      };
    },

    // TODO:---------------------- updateMangerIds ----------------------
    updateMangerIds: (state, action) => {
      const {conversationId, memberId, isAddManager} = action.payload;

      const index = state.conversations.findIndex(
        ele => ele._id === conversationId,
      );

      const conversationSearch = state.conversations[index];
      const oldMangerIds = conversationSearch.managerIds;
      let newManagerIds;
      if (isAddManager) {
        newManagerIds = [...oldMangerIds, memberId];
      } else {
        newManagerIds = oldMangerIds.filter(ele => ele !== memberId);
      }

      const newConversation = {
        ...conversationSearch,
        managerIds: newManagerIds,
      };

      state.conversations[index] = newConversation;
      if (state.currentConversationId === conversationId) {
        state.currentConversation = newConversation;
      }
    },
  },
  // xu ly api roi thay doi state
  extraReducers: {
    // TODO:---------------------- fetchConversations ----------------------
    // Đang xử lý
    [fetchConversations.pending]: (state, action) => {
      state.isLoading = true;
    },
    // Xử lý khi thành công
    [fetchConversations.fulfilled]: (state, action) => {
      state.isLoading = false;
      state.conversations = action.payload;
    },
    // Xử lý khi bị lỗi
    [fetchConversations.rejected]: (state, action) => {
      state.isLoading = false;
    },

    // TODO:---------------------- fetchMessages ----------------------
    // Đang xử lý
    [fetchMessages.pending]: (state, action) => {
      state.isLoading = true;
    },
    // Xử lý khi thành công
    [fetchMessages.fulfilled]: (state, action) => {
      state.isLoading = false;
      const {messages, conversationId, isSendMessage} = action.payload;

      // xét currentConversationId
      const conversationIndex = state.conversations.findIndex(
        conversationEle => conversationEle._id === conversationId,
      );

      state.conversations[conversationIndex] = {
        ...state.conversations[conversationIndex],
        numberUnread: 0,
      };

      state.currentConversationId = conversationId;
      state.currentChannelId = conversationId;
      state.messagePages = messages;
      if (isSendMessage) {
        state.messages = messages.data.reverse();
      } else {
        const temp = [...messages.data, ...state.messages.reverse()];
        state.messages = commonFuc.getUniqueListBy(temp, '_id').reverse();
      }
    },
    // Xử lý khi bị lỗi
    [fetchMessages.rejected]: (state, action) => {
      state.isLoading = false;
    },

    // TODO:---------------------- fetchChannelMessages ----------------------
    // Đang xử lý
    [fetchChannelMessages.pending]: (state, action) => {
      state.isLoading = true;
    },
    // Xử lý khi thành công
    [fetchChannelMessages.fulfilled]: (state, action) => {
      state.isLoading = false;
      const {messages, channelId, isSendMessage} = action.payload;

      // xét currentchannelId
      const channelIndex = state.channels.findIndex(
        channelEle => channelEle._id === channelId,
      );

      state.channels[channelIndex] = {
        ...state.channels[channelIndex],
        numberUnread: 0,
      };

      state.currentChannelId = channelId;
      state.channelPages = messages;
      if (isSendMessage) {
        state.channelMessages = messages.data.reverse();
      } else {
        const temp = [...messages.data, ...state.channelMessages.reverse()];
        state.channelMessages = commonFuc
          .getUniqueListBy(temp, '_id')
          .reverse();
      }
    },
    // Xử lý khi bị lỗi
    [fetchChannelMessages.rejected]: (state, action) => {
      state.isLoading = false;
    },

    // TODO:---------------------- fetchListLastViewer ----------------------
    // Đang xử lý
    [fetchListLastViewer.pending]: (state, action) => {
      state.isLoading = true;
    },
    // Xử lý khi thành công
    [fetchListLastViewer.fulfilled]: (state, action) => {
      state.isLoading = false;
      state.listLastViewer = action.payload;
    },
    // Xử lý khi bị lỗi
    [fetchListLastViewer.rejected]: (state, action) => {
      state.isLoading = false;
    },

    // TODO:---------------------- fetchListLastChannelViewer ----------------------
    // Đang xử lý
    [fetchListLastChannelViewer.pending]: (state, action) => {
      state.isLoading = true;
    },
    // Xử lý khi thành công
    [fetchListLastChannelViewer.fulfilled]: (state, action) => {
      state.isLoading = false;
      state.listLastViewer = action.payload;
    },
    // Xử lý khi bị lỗi
    [fetchListLastChannelViewer.rejected]: (state, action) => {
      state.isLoading = false;
    },

    // TODO:---------------------- fetchFiles ----------------------
    // Đang xử lý
    [fetchFiles.pending]: (state, action) => {
      state.isLoading = true;
    },
    // Xử lý khi thành công
    [fetchFiles.fulfilled]: (state, action) => {
      state.isLoading = false;
      state.files = action.payload;
    },
    // Xử lý khi bị lỗi
    [fetchFiles.rejected]: (state, action) => {
      state.isLoading = false;
    },

    // TODO:---------------------- fetchMembers ----------------------
    // Đang xử lý
    [fetchMembers.pending]: (state, action) => {
      state.isLoading = true;
    },
    // Xử lý khi thành công
    [fetchMembers.fulfilled]: (state, action) => {
      state.isLoading = false;
      state.members = action.payload;
    },
    // Xử lý khi bị lỗi
    [fetchMembers.rejected]: (state, action) => {
      state.isLoading = false;
    },

    // TODO:---------------------- fetchChannels ----------------------
    // Đang xử lý
    [fetchChannels.pending]: (state, action) => {
      state.isLoading = true;
    },
    // Xử lý khi thành công
    [fetchChannels.fulfilled]: (state, action) => {
      state.isLoading = false;
      state.channels = action.payload;
    },
    // Xử lý khi bị lỗi
    [fetchChannels.rejected]: (state, action) => {
      state.isLoading = false;
    },
  },
});

const {reducer, actions} = messageSlice;
export const {
  setLoading,
  updateCurrentConversation,
  clearMessagePages,
  addMessage,
  deleteMessageOnlyMe,
  deleteMessage,
  addReaction,
  renameConversation,
  setCurrentVote,
  updateVoteMessage,
  setNotification,
  updateNotification,
  setListLastViewer,
  usersTyping,
  usersNotTyping,
  resetMessageSlice,
  addChannelMessage,
  setCurrentChannel,
  clearChannelMessages,
  clearMessages,
  updateChannel,
  deleteChannel,
  updateAvatarConversation,
  updateMangerIds,
} = actions;
export default reducer;
