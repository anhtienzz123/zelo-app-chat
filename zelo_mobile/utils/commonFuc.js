import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  AlertIOS,
  PermissionsAndroid,
  Platform,
  ToastAndroid,
} from 'react-native';
import RNFetchBlob from 'react-native-fetch-blob';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {conversationApi} from '../api';
import {ERROR_MESSAGE, messageType, REACTIONS} from '../constants';
import {resetFriendSlice} from '../redux/friendSlice';
import {resetGlobalSlice} from '../redux/globalSlice';
import {resetMeSlice} from '../redux/meSlice';
import {
  clearMessagePages,
  fetchConversations,
  resetMessageSlice,
  setCurrentChannel,
} from '../redux/messageSlice';
import {resetPinSlice} from '../redux/pinSlice';
import dateUtils from './dateUtils';
import {disconnect} from './socketClient';

const commonFuc = {
  getBase64: file => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  },

  totalNumberUnread: conversations => {
    if (conversations) {
      return conversations.reduce((n, {numberUnread}) => n + numberUnread, 0);
    }
    return 0;
  },

  getAcronym: name => {
    if (name) {
      const acronym = name
        .split(/\s/)
        .reduce((response, word) => (response += word.slice(0, 1)), '')
        .toUpperCase();

      return acronym.slice(0, 2);
    }
    return '';
  },

  getUniqueListBy: (arr, key) => {
    return [...new Map(arr.map(item => [item[key], item])).values()];
  },

  getReactionVisibleInfo: reacts => {
    const unduplicateReactionTypes = reacts
      .filter(
        (element, index, self) =>
          index === self.findIndex(t => t.type === element.type),
      )
      .map(({type}) => type);

    const firstThreeElements = unduplicateReactionTypes.slice(0, 3);

    const reactionVisibleInfo = firstThreeElements
      .map(type => REACTIONS[type - 1])
      .join('');
    return reactionVisibleInfo;
  },

  notifyMessage: message => {
    if (Platform.OS === 'android') {
      ToastAndroid.show(message, ToastAndroid.SHORT);
    } else {
      AlertIOS.alert(message);
    }
  },
  getNumOfPeopleVoted: options => {
    let userIds = [];
    options.map(option => {
      userIds.push(...option.userIds);
    });
    return [...new Set(userIds)].length;
  },
  getTotalOfVotes: options => {
    let totalOfVotes = 0;
    options.map(option => {
      totalOfVotes += option.userIds.length;
    });
    return totalOfVotes;
  },

  getPercentOfVotes: (totalOfVotes, numberOfVotes) => {
    const percent =
      totalOfVotes === 0 ? totalOfVotes : (numberOfVotes * 100) / totalOfVotes;
    return percent;
  },
  getCurrentUserVotes: (options, userId) => {
    let currentUserVotes = [];
    for (const option of options) {
      if (option.userIds.includes(userId)) {
        currentUserVotes.push(option.name);
      }
    }
    return currentUserVotes;
  },
  getDifferentValue: (array1, array2) => {
    let newArray = [];
    for (const element of array1) {
      if (!array2.includes(element)) {
        newArray.push(element);
      }
    }
    return newArray;
  },

  getFileName: fileUrl => {
    const splitted = fileUrl.split('/').slice(-1)[0].split('-');
    const fileName = splitted
      .slice(0, 2)
      .concat(splitted.slice(2).join('-'))[2];
    return fileName;
  },

  getNumberOfDays: dateString => {
    const dateCreated = new Date(dateString);
    const currentDay = new Date();

    // One day in milliseconds
    const oneDay = 1000 * 60 * 60 * 24;

    // Calculating the time difference between two dates
    const diffInTime = currentDay.getTime() - dateCreated.getTime();

    // Calculating the no. of days between two dates
    const diffInDays = Math.round(diffInTime / oneDay);

    if (diffInDays <= 7) {
      return `${diffInDays} ng??y tr?????c`;
    }

    return dateUtils.getDate(dateString);
  },

  getNotifyContent: (messageContent, isNotifyDivider, message, userId) => {
    let content = messageContent;

    const {manipulatedUsers} = message;

    switch (messageContent) {
      case messageType.PIN_MESSAGE:
        content = '???? ghim m???t tin nh???n';
        break;

      case messageType.NOT_PIN_MESSAGE:
        content = '???? b??? ghim m???t tin nh???n';
        break;

      case messageType.CREATE_CHANNEL:
        content = '???? t???o m???t k??nh nh???n tin';
        break;

      case messageType.DELETE_CHANNEL:
        content = '???? x??a m???t k??nh nh???n tin';
        break;

      case messageType.UPDATE_CHANNEL:
        content = '???? ?????i t??n m???t k??nh nh???n tin';
        break;
      case messageType.ADD_MANAGERS:
        content = `???? th??m ${
          manipulatedUsers[0]?._id === userId
            ? 'b???n'
            : manipulatedUsers[0]?.name
        } l??m ph?? nh??m`;
        break;
      case messageType.DELETE_MANAGERS:
        content = `???? x??a ph?? nh??m c???a ${
          manipulatedUsers[0]?._id === userId
            ? 'b???n'
            : manipulatedUsers[0]?.name
        }`;
        break;
      case '???? th??m v??o nh??m':
        content = `???? th??m ${
          manipulatedUsers[0]?._id === userId
            ? 'b???n'
            : manipulatedUsers[0]?.name
        }${
          manipulatedUsers.length > 1
            ? ` v?? ${manipulatedUsers.length - 1} ng?????i kh??c`
            : ' v??o nh??m'
        }`;
        break;
      case '???? x??a ra kh???i nh??m':
        content = `???? x??a ${
          manipulatedUsers[0]?._id === userId
            ? 'b???n'
            : manipulatedUsers[0]?.name
        } ra kh???i nh??m`;
        break;
      case '???? l?? b???n b??':
        content = '???? tr??? th??nh b???n b?? c???a nhau';
        break;
      case '???nh ?????i di???n nh??m ???? thay ?????i':
        content = '???? thay ?????i ???nh ?????i di???n nh??m';
        break;

      default:
        content = messageContent;
        break;
    }

    if (isNotifyDivider) {
      return content.charAt(0).toLocaleLowerCase() + content.slice(1);
    }

    return content.replace('<b>', '').replace('</b>', '');
  },

  convertMessageToHtml: (content, tagUsers) => {
    let contentHtml = content;

    for (let tagUser of tagUsers) {
      contentHtml = contentHtml.replace(
        `@${tagUser.name}`,
        `<span>@${tagUser.name}</span>`,
      );
    }
    return `<p>${contentHtml}</p>`;
  },
};

export const logout = dispatch => {
  AsyncStorage.removeItem('token');
  AsyncStorage.removeItem('refreshToken');
  AsyncStorage.removeItem('userId');
  if (dispatch) {
    dispatch(resetFriendSlice());
    dispatch(resetGlobalSlice());
    dispatch(resetMeSlice());
    dispatch(resetMessageSlice());
    dispatch(resetPinSlice());
  }
  disconnect();
  // dispatch(setLogin(false));
  // RNRestart.Restart();
};

export const handleCreateChat = async (
  userId,
  navigation,
  dispatch,
  currentConversationId,
) => {
  try {
    const response = await conversationApi.addConversation(userId);
    await dispatch(fetchConversations());
    // if (response?.isExists) {

    handleEnterChat(response._id, navigation, dispatch, currentConversationId);
    // }
  } catch (error) {
    console.error('C?? l???i x???y ra', error);
    commonFuc.notifyMessage(ERROR_MESSAGE);
  }
};

const handleEnterChat = (
  conversationId,
  navigation,
  dispatch,
  currentConversationId,
) => {
  if (currentConversationId !== conversationId) {
    dispatch(clearMessagePages());
    // dispatch(updateCurrentConversation({conversationId}));
    // dispatch(
    //   setCurrentChannel({
    //     currentChannelId: conversationId,
    //     currentChannelName: conversationId,
    //   }),
    // );
    // dispatch(fetchListLastViewer({conversationId}));
    // dispatch(fetchMembers({conversationId}));
    dispatch(setCurrentChannel({conversationId}));
    dispatch(resetPinSlice());
  }
  navigation.replace('Nh???n tin', {
    conversationId,
  });
};

export const checkPermissionDownloadFile = async fileUrl => {
  // Function to check the platform
  // If Platform is Android then check for permissions.

  if (Platform.OS === 'ios') {
    downloadFile(fileUrl);
  } else {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: 'Storage Permission Required',
          message: 'Application needs access to your storage to download File',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        // Start downloading
        downloadFile(fileUrl);
      } else {
        commonFuc.notifyMessage('Quy???n l??u tr??? kh??ng ???????c c???p');
      }
    } catch (err) {
      // To handle permission related exception
      console.error(err);
    }
  }
};

const downloadFile = fileUrl => {
  // Get today's date to add the time suffix in filename
  let date = new Date();
  // Function to get extention of the file url
  let file_ext = getFileExtention(fileUrl);

  file_ext = '.' + file_ext[0];
  // config: To get response by passing the downloading related options
  // fs: Root directory path to download
  const {config, fs} = RNFetchBlob;
  let RootDir = fs.dirs.PictureDir;
  let options = {
    fileCache: true,
    addAndroidDownloads: {
      path: RootDir + '/' + commonFuc.getFileName(fileUrl),
      // RootDir +
      // '/' +
      // fileType +
      // '_' +
      // Math.floor(date.getTime() + date.getSeconds() / 2) +
      // file_ext,
      description: 'downloading file...',
      notification: true,
      // useDownloadManager works with Android only
      useDownloadManager: true,
    },
  };
  config(options)
    .fetch('GET', fileUrl)
    .then(res => {
      // Alert after successful downloading
      commonFuc.notifyMessage('T???i th??nh c??ng');
    })
    .catch(err => {
      commonFuc.notifyMessage(ERROR_MESSAGE);
      console.error('???? c?? l???i x???y ra: ', err);
    });
};

const getFileExtention = fileUrl => {
  // To get the file extension
  return /[.]/.exec(fileUrl) ? /[^.]+$/.exec(fileUrl) : undefined;
};

export let currentKey = '';

export const makeId = () => {
  currentKey = '';
  const randomChars =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (let i = 0; i < 20; i++)
    currentKey += randomChars.charAt(
      Math.floor(Math.random() * randomChars.length),
    );

  return currentKey;
};

export const showImagePicker = async (uploadFile, isCoverImage) => {
  const options = {
    mediaType: 'photo',
    includeBase64: true,
  };

  await launchImageLibrary(options, async res => {
    if (res.didCancel) {
    } else if (res.error) {
    } else if (res.customButton) {
      alert(res.customButton);
    } else {
      let source = res.assets[0];
      await handleSendImage(source, uploadFile, isCoverImage);
    }
  });
};

export const openCamera = async (uploadFile, isCoverImage) => {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.CAMERA,
      {
        title: 'App Camera Permission',
        message: '???ng d???ng c???n quy???n truy c???p v??o m??y ???nh c???a b???n',
        buttonNeutral: 'H???i l???i t??i sau',
        buttonNegative: 'H???y',
        buttonPositive: '?????ng ??',
      },
    );
    if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
      commonFuc.notifyMessage('Ch??a c???p quy???n truy c???p m??y ???nh');
      return;
    } else {
    }
  } catch (err) {
    console.warn(err);
  }

  const options = {
    mediaType: 'photo',
    includeBase64: true,
  };
  launchCamera(options, async res => {
    if (res.didCancel) {
      commonFuc.notifyMessage('H???y');
    } else if (res.error) {
      console.error(error);
      commonFuc.notifyMessage(ERROR_MESSAGE);
    } else if (res.customButton) {
      alert(res.customButton);
    } else {
      let source = res.assets[0];
      await handleSendImage(source, uploadFile, isCoverImage);
    }
  });
};

const handleSendImage = async (file, uploadFile, isCoverImage) => {
  const fileNameSplit = file.fileName.split('.');
  const fileName = fileNameSplit[0];
  const fileBase64 = file.base64;
  const fileExtension = `.${fileNameSplit[1]}`;

  const body = {fileName, fileExtension, fileBase64};

  await uploadFile(body, isCoverImage);
};

export default commonFuc;
