const FriendUtils = {
    checkIsFriend: (user, listFriend) => {
        return listFriend.some((friend) => friend._id === user._id);
    },
    checkIsRequestSentToMe: (user, listRequest) => {
        return listRequest.some((req) => req._id === user._id);
    },
    checkIsMyRequestFriend: (user, listMyRequest) => {
        return listMyRequest.some((req) => req._id === user._id);
    },
};

export default FriendUtils;
