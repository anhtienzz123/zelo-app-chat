export const REACT_APP_API_URL = 'https://zelochat.xyz/api';
export const REACT_APP_SOCKET_URL = 'https://zelochat.xyz';

export const DEFAULT_MESSAGE_PARAMS = {
  page: 0,
  size: 20,
};
export const REACTIONS = ['👍', '♥️', '😄', '😲', '😭', '😡'];

export const DEFAULT_COVER_IMAGE =
  'https://res.cloudinary.com/depjgf4uu/image/upload/v1633711296/wallhaven-8ok7vk_fsct6y.jpg';
export const NO_INTERNET_IMAGE =
  'https://res.cloudinary.com/depjgf4uu/image/upload/v1633875955/no-internet_sgdpzu.png';
export const EMPTY_IMAGE =
  'https://res.cloudinary.com/depjgf4uu/image/upload/v1633875942/empty_nvkxrb.png';

export const ERROR_MESSAGE = 'Đã có lỗi xảy ra';
export const LEAVE_GROUP_MESSAGE = 'Bạn có muốn rời nhóm không?';
export const DELETE_GROUP_MESSAGE =
  'Toàn bộ nội dung cuộc trò chuyện sẽ bị xóa, bạn có chắc chắn muốn xóa ?';

export const messageType = {
  ALL: 'ALL',
  TEXT: 'TEXT',
  HTML: 'HTML',
  NOTIFY: 'NOTIFY',
  IMAGE: 'IMAGE',
  VIDEO: 'VIDEO',
  FILE: 'FILE',
  VOTE: 'VOTE',
  STICKER: 'STICKER',
  PIN_MESSAGE: 'PIN_MESSAGE',
  NOT_PIN_MESSAGE: 'NOT_PIN_MESSAGE',
  CREATE_CHANNEL: 'CREATE_CHANNEL',
  DELETE_CHANNEL: 'DELETE_CHANNEL',
  UPDATE_CHANNEL: 'UPDATE_CHANNEL',
  ADD_MANAGERS: 'ADD_MANAGERS',
  DELETE_MANAGERS: 'DELETE_MANAGERS',
};

export const friendType = {
  FRIEND: 'FRIEND',
  FOLLOWER: 'FOLLOWER',
  YOU_FOLLOW: 'YOU_FOLLOW',
  NOT_FRIEND: 'NOT_FRIEND',
  NOT_FRIEND: 'NOT_FRIEND',
  DONT_HAVE_ACCOUNT: 'DONT_HAVE_ACCOUNT',
  ADD_TO_GROUP: 'ADD_TO_GROUP',
  REMOVE_FROM_GROUP: 'REMOVE_FROM_GROUP',
};

export const memberType = {
  LEADER: 'LEADER',
  DEPUTY_LEADER: 'DEPUTY_LEADER',
  MEMBER: 'MEMBER',
};

export const DEFAULT_MESSAGE_MODAL_VISIBLE = {
  isVisible: false,
  isRecall: false,
  isMyMessage: false,
  messageId: '',
  messageContent: '',
  type: messageType.TEXT,
};
export const DEFAULT_REACTION_MODAL_VISIBLE = {
  isVisible: false,
  messageId: '',
  reacts: [],
};
export const DEFAULT_RENAME_CONVERSATION_MODAL = {
  isVisible: false,
  conversationName: '',
  type: false,
};
export const DEFAULT_PIN_MESSAGE_MODAL = {
  isVisible: false,
  isError: false,
};
export const DEFAULT_ADD_VOTE_MODAL = {
  isVisible: false,
};
export const DEFAULT_IMAGE_MODAL = {
  isVisible: false,
  userName: '',
  content: [],
  isImage: true,
};

export const DEFAULT_REPLY_MESSAGE = {
  isReply: false,
  replyMessage: {},
};

export const DEFAULT_CHANNEL_MODAL = {
  isVisible: false,
  name: '',
  channelId: '',
};

export const DEFAULT_MEMBER_MODAL = {
  isVisible: false,
  memberRole: memberType.MEMBER,
  userRole: memberType.LEADER,
  memberId: '',
  memberName: '',
};

export const DEFAULT_MESSAGE_DETAIL_MODAL = {
  isVisible: false,
  message: {},
};

export const DEFAULT_LAST_VIEW_MODAL = {
  isVisible: false,
  userList: [],
};

export const DEFAULT_VOTE_DETAIL_MODAL = {
  isVisible: false,
  options: [],
};
