# Zelo App Chat - NodeJs

## Cách chạy

npm install.
npm start.

Chạy trên cổng 3001.

## Api

### Auth `/auth`

-   `[POST] /login`: login.
    -   body: {username: String, password: String}.
    -   result: {token: String, refreshToken: String}.
-   `[POST] /refresh-token`: refresh token.
    -   body: {refreshToken: String}.
    -   result: {token: String}.
-   `[POST] /registry`: đăng ký.
    -   body: {name: String, username: String, password: String}.
-   `[POST] /confirm-account`: xác nhận account.
    -   body: {username: String, otp: String}.
-   `[POST] /reset-otp`: reset otp.
    -   body: {username: String}.
    -   result: {status: boolean}.
-   `[POST] /confirm-password`: xác nhận mật khẩu mới.
    -   body: {username: String, otp: String, password: String}.
-   `[GET] /users/:username`: get thông tin tóm tắt của user.
    -   result: {name: String, username:String, avatar:String, isActived: boolean }

### Me `/me`

-   `[GET] /profile`: get thông tin.
    -   result: {\_id: String, name: String, username: String, dateOfBirth: {day: int, month: int, year: int},
        gender: boolean, avatar: String, avatarColor: String, coverImage: String}.
-   `[PUT] /profile`: update thông tin.
    -   body: {name: String, dateOfBirth: { day: int, month:int, year: int }, gender: int (0: nam, 1 nữ)}.
-   `[PATCH] /avatar`: update avatar.
    -   body: {file: File}.
    -   result: {avatar: String}.
-   `[PATCH] /cover-image`: update ảnh bìa.
    -   body: {file: File}.
    -   result: {coverImage: String}
-   `[PATCH] /avatar/base64`: update avatar base64.
    -   body: {fileName, fileExtension, fileBase64}.
    -   result: {avatar: String}.
-   `[PATCH] /cover-image/base64`: update ảnh bìa base64.
    -   body: {fileName, fileExtension, fileBase64}.
    -   result: {coverImage: String}
-   `[GET] /phone-books`: get danh bạ.
    -   result: [{_id, name, username, dateOfBirth: {day, month, year}, gender, avatar, avatarColor: String, coverImage, status(gồm 4 trạng thái: FRIEND, FOLLOWER, YOU_FOLLOW, NOT_FRIEND), numberCommonGroup: int, numberCommonFriend: int, isExists: true}].
    -   nếu không có {name, username, isExists: false}.
-   `[POST] /phone-books`: đồng bộ danh bạ.
    -   body: {phones: [{name: String, phone: String}]}.
-   `[PATCH] /password`: đổi mật khẩu.
    -   body: {oldPassword: String, newPassword: String}.
-   `[DELETE] /revoke-token`: đăng xuất tất cả, socket cho user đang đăng nhập tài khoản.
    -   body: {password: String, key: String}.
    -   result: {token: String, refreshToken: String}.
    -   socket: io.emit('revoke-token', {key: String}).

### User `/users`

-   `[GET] /search/username/:username`: tìm kiếm bằng username.
    -   result: {\_id, name, username, dateOfBirth: {day, month, year}, gender, avatar, coverImage, status(gồm 4 trạng thái: FRIEND, FOLLOWER, YOU_FOLLOW, NOT_FRIEND), numberCommonGroup: int, numberCommonFriend: int}.
-   `[GET] /search/id/:id`: tìm kiếm bằng id.

### Friend `/friends`

-   `[GET] `: get danh sách bạn bè.
    -   param: {name: String}.
    -   result: [{_id: String, name: String, username: String, avatar: String, isOnline: boolean, lastLogin: Date }].
-   `[POST] /:userId`: chấp nhận kết bạn, socket cho user đc kết bạn.
    -   socket: io.emit('accept-friend', {\_id, name, avatar }).
    -   socket (TH lạ, thì cả 2 sẽ nhận được): io.emit('create-individual-conversation-when-was-friend', conversationId).
    -   socket(TH đã có nhắn tin, thì cả 2 sẽ nhận được): io.emit('new-message', conversationId, message).
-   `[DELETE] /:userId`: xóa kết bạn (socket bắn tới thằng bị xóa).
    -   socket: io.emit('deleted-friend', \_id);
-   `[GET] /invites`: get danh sách lời mời kết bạn của bản thân.
    -   result: [{_id: String, name: String, username: String, avatar: String, numberCommonGroup: int, numberCommonFriend: int }].
-   `[DELETE] /invites/:userId`: Xóa lời mời kết bạn (socket bắn tới thằng bị xóa).
    -   socket: io.emit('deleted-friend-invite', \_id);
-   `[GET] /invites/me`: get danh sách lời mời kết bạn của mình đã gởi.
    -   result: [{_id: String, name: String, username: String, avatar: String, numberCommonGroup: int, numberCommonFriend: int }].
-   `[POST] /invites/me/:userId`: gởi lời mời kết bạn cho người khác, socket cho user đc gởi lời mời kết bạn.
    -   socket: io.emit('send-friend-invite', { \_id, name, avatar });
-   `[DELETE] /invites/me/:userId`: xóa gởi lời mời kết bạn cho người khác (socket bắn tới thằng bị xóa).
    -   socket: io.emit('deleted-invite-was-send', \_id);
-   `[GET] /suggest`: danh sách đề xuất bạn bè.
    -   params: {page (default: 0), size (default: 12)}.
    -   result: [{_id: String, name, username, avatar, numberCommonGroup: int, numberCommonFriend: int }].

### Classify `/classifies`

-   `[GET] /colors`: danh sách màu sắc.
    -   result: [{_id: String, name:String, code: String (mã màu) }].
-   `[GET] /`: danh sách phân loại.
    -   result: [{\_id: String, name: String, conversationIds: [String] ,color: {\_id: String, name: String, code: String} }].
-   `[POST] /`: thêm phân loại.
    -   body: {name: String, colorId: String}.
-   `[PUT] /:id`: sửa phân loại.
    -   body: {name: String, colorId: String}.
-   `[DELETE] /:id`: xóa phân loại.
-   `[POST] /:id/conversations/:conversationId`: thêm hộp thoại vào phân loại.
-   `[DELETE] /:id/conversations/:conversationId`: Xóa hộp thoại ra phân loại.

### Conversation `/conversations`

-   `[GET] `: get danh sách trò chuyện mới nhất.

    -   params: {name: String (default: '') , type: int (0: tất cả, không tìm tên ;1: cá nhân; 2: nhóm) (default: 0) }.
    -   result: [{_id: String, name: String, avatar: String, userId: String, friendStatus: String , type: boolean, numberUnread: int, isNotify, isJoinFromLink,
        lastMessage: {
        _id: String,
        content: String,
        type: String (TEXT, IMAGE, VIDEO, FILE, HTML, NOTIFY),
        createdAt: String,
        user: {
        _id: String,
        name: String,
        avatar: String
        }
        }
        }].

-   `[GET] /:id`: get một conversation.
-   `[GET] /classifies/:classifyId`: danh sách phân loại cuộc trò chuyện.
    -   result: như trên.
-   `[POST] /individuals/:userId`: tạo cuộc trò chuyện cá nhân (socket tới userId, nhận được socket này thì bắn socket join-conversation).
    -   result: {\_id: String, isExists: boolean}.
    -   socket: io.emit('create-individual-conversation', conversationId).
-   `[POST] /groups`: tạo cuộc trò chuyện nhóm.
    -   body: {name:String, userIds: [String]}.
    -   socket: io.emit('create-conversation', conversationId).
    -   result: {\_id: String}.
-   `[PATCH] /:id/name`: đổi biệt danh cá nhân hoặc đổi tên nhóm (nếu là nhóm thì có socket).
    -   body: {name: String}.
    -   socket: io.emit('rename-conversation', conversationId, conversationName, message).
-   `[PATCH] /:id/avatar`: thay ảnh nhóm.
    -   body: {file: File}.
    -   socket: io.emit('update-avatar-conversation', conversationId, conversationAvatar, message).
    -   socket: io.emit('new-message', conversationId, message).
-   `[PATCH] /:id/avatar/base64`: thay ảnh nhóm.
    -   body: {fileName, fileExtension, fileBase64}.
    -   socket: io.emit('update-avatar-conversation', conversationId, conversationAvatar, message).
    -   socket: io.emit('new-message', conversationId, message).
-   `[DELETE] /:id/messages`: xóa tất cả tin nhắn.
-   `[GET] /:id/members`: danh sách thành viên.
-   `[POST] /:id/members`: thêm nhiều thành viên.
    -   body: {userIds: [String]}.
    -   socket (đối với thành viên trong nhóm) : io.emit('new-message', conversationId, message).
    -   socket (đối với user đc add): io.emit('added-group', conversationId).
    -   socket: io.emit('update-member', conversationId).
-   `[DELETE] /:id/members/:userId`: xóa thành viên.
    -   socket (đối với thành viên trong nhóm) : io.emit('new-message', conversationId, message).
    -   socket (đối với user bị xóa): io.emit('deleted-group', conversationId).
    -   socket: io.emit('update-member', conversationId).
-   `[DELETE] /:id/members/leave`: Rời nhóm.
    -   socket: io.emit('new-message', conversationId, message )
    -   socket: io.emit('update-member', conversationId).
-   `[DELETE] /:id`: xóa nhóm.
    -   socket: io.emit('delete-conversation', conversationId ).
-   `[POST] /:id/members/join-from-link`: tham gia từ link.
    -   socket (đối với thành viên trong nhóm) : io.emit('new-message', conversationId, message) (nội dung: 'Tham gia từ link').
    -   socket (đối với user đc add): io.emit('added-group', conversationId).
    -   socket: io.emit('update-member', conversationId).
-   `[PATCH] /:id/join-from-link/:isStatus`: trạng thái co cho tham gia vào link không (chỉ chủ nhóm) (isStatus: 0 or 1).
-   `[GET] /:id/summary`: thông tin khi vào nhóm.
    -   result: {\_id, name, avatar, users: [{name, avatar}] }.
-   `[GET] /:id/last-view`: danh sách last view của danh sách members.
    -   result: [{ user: {_id, name, avatar}, lastView: Date }].
-   `[POST] /:id/managers`: thêm người quản lý nhóm.
    -   body: {managerIds: [String]}.
    -   socket: io.emit('add-managers', {conversationId, managerIds})
    -   socket: io.emit('new-message', conversationId, message) (content: ADD_MANAGERS).
-   `[DELETE] /:id/managers`: xóa người quản lý nhóm.
    -   body: {managerIds: [String]}.
    -   socket: io.emit('delete-managers', {conversationId, managerIds})
    -   socket: io.emit('new-message', conversationId, message) (content: DELETE_MANAGERS).

### Message `/messages`.

-   `[GET] /:conversationId`: danh sách tin nhắn theo cuộc trò chuyện.
    -   params: {page: int(default: 0), size: int(default: 20) }.
-   `[GET] /channel/:channelId`: danh sách tin nhắn theo kênh.
    -   params: {page: int(default: 0), size: int(default: 20) }.
-   `[GET] /:conversationId/files`: danh sách tin nhắn dạng file.
    -   params: {type: String (default tìm theo từng phân loại: ALL) (ALL, IMAGE, VIDEO, FILE), senderId: String (không bắt buộc), startTime: String(yyyy-mm-dd)(không bắt buộc), endTime: String(yyyy-mm-dd)(không bắt buộc)}.
-   `[POST] /text`: send tin nhắn dạng text.
    -   body: {content: String, tags: [String] (không bắt buộc), replyMessageId: String (không bắt buộc), type: String (TEXT, HTML, NOTIFY, STICKER) , conversationId: String, channelId: String}.
    -   socket: io.emit('new-message', conversationId, message).
    -   socket (nếu là channel): io.emit('new-message-of-channel', conversationId, channelId, message).
-   `[POST] /files`: send tin nhắn dạng file.
    -   body: {file: File}.
    -   params: {type: String ('IMAGE', 'VIDEO', 'FILE'), conversationId: String, channelId: String }.
    -   socket: io.emit('new-message', conversationId, message).
    -   socket (nếu là channel): io.emit('new-message-of-channel', conversationId, channelId, message).
    -   các file hợp lệ (tối đa 20MB): .png, .jpeg, .jpg, .gif, .mp3, .mp4, .pdf, .doc, .docx, .ppt, .pptx, .rar, .zip .
-   `[POST] /files/base64`: send tin nhắn dạng file base64.
    -   body: {fileName, fileExtension, fileBase64}.
    -   params: {type: String ('IMAGE', 'VIDEO', 'FILE'), conversationId: String, channelId: String }.
    -   socket: io.emit('new-message', conversationId, message).
    -   socket (nếu là channel): io.emit('new-message-of-channel', conversationId, channelId, message).
    -   các file hợp lệ (fileExtension) (tối đa 20MB): .png, .jpeg, .jpg, .gif, .mp3, .mp4, .pdf, .doc, .docx, .ppt, .pptx, .rar, .zip .
-   `[DELETE] /:id`: thu hồi tin nhắn.
    -   socket: io.emit('delete-message', {conversationId, channelId, id}).
-   `[DELETE] /:id/only`: xóa tin nhắn ở phía tôi.
-   `[POST] /:id/reacts/:type`: thả reaction.
    -   socket: io.emit('add-reaction', {conversationId, channelId, messageId, user, type});
-   `[GET] /:id/share/:conversationId`: chuyển tiếp tin nhắn có id sang cuộc trò chuyện có conversationId.
    -   socket: io.emit('new-message',conversationId, message ).
-   `[PATCH] /:id/notify/:isNotify`: update thông báo (0 là tắt, 1 là bật).
-   `[GET] /:id/summary`: thông tin khi vào nhóm.
    -   result: {\_id, name, avatar, users: [{name, avatar}] }.

### Pin Message `/pin-messages`.

-   `[GET] /:conversationId`: list tin nhắn gim.
-   `[POST] /:messageId`: gim tin nhắn (tối đa là 3 tin nhắn đc gim).
-   `[DELETE] /:messageId`: xóa gim.
    -   có 2 content (PIN_MESSAGE, NOT_PIN_MESSAGE).
    -   socket: io.emit('new-message', conversationId, message).
    -   socket: io.emit('action-pin-message', conversationId).

### Vote `/votes`.

-   `[GET] /:conversationId`: danh sách votes theo conversationId.
    -   params: { page, size }.
-   `[POST] `: tạo bình chọn.
    -   body: {content: String, options: [String], conversationId: String}.
    -   result: {\_id, user: {\_id, name, avatar},content, type: 'VOTE', options: [{name, userIds: [String]}], userOptions: [{_id, name, avatar}], createdAt}.
    -   socket: io.emit('new-message', conversationId, voteMessage).
-   `[POST] /:messageId`: thêm bình chọn.
    -   body: {options: [String]}.
    -   socket: io.emit('update-vote-message', conversationId, voteMessage).
-   `[DELETE] /:messageId`: xóa bình chọn.
    -   body: {options: [String]}.
    -   socket: io.emit('update-vote-message', conversationId, voteMessage).
-   `[POST] /:messageId/choices`: chọn lựa chọn.
    -   body: {options: [String]}.
    -   socket: io.emit('update-vote-message', conversationId, voteMessage).
-   `[DELETE] /:messageId/choices`: xóa lựa chọn.
    -   body: {options: [String]}.
    -   socket: io.emit('update-vote-message', conversationId, voteMessage).

### Sticker.

-   `[GET] /stickers`: get all sticker.
    -   result: [{\_id, name, description, stickers: [String] }]

### Channel `/channels`.

-   `[GET] /:conversationId`: get list.
    -   result: [{_id, name, conversationId, createdAt: Date, numberUnread}].
-   `[POST] `: thêm.
    -   body: {name, conversationId}.
    -   result: {\_id, name, conversationId, createdAt}.
    -   socket: io.emit('new-channel', {\_id, name, conversationId, createdAt}).
    -   socket new-message với content: CREATE_CHANNEL
-   `[PUT] `: update đổi tên.
    -   body: {\_id, name}.
    -   result: {\_id, name, conversationId}.
    -   socket: io.emit('update-channel', {\_id, name, conversationId}).
    -   socket new-message với content: UPDATE_CHANNEL
-   `[DELETE] /:channelId`: xóa
    -   socket: io.emit('delete-channel', {conversationId, channelId}).
    -   socket new-message với content: DELETE_CHANNEL
-   `[GET] /:channelId/last-view`: get lastViews.
    -   result: [{ user: {_id, name, avatar}, channelId, lastView: Date }].

## Admin

### User Manager `/admin/users-manager`.

-   `[GET] `: get list users.

    -   params: {username: String (default: ''), page: int (default: 0), size: int(default: 20)}.
    -   result: [{_id, name, username, gender, isActived, isDeleted, isAdmin }].

-   `[PATCH] /:id/:isDeleted`: cập nhật trạng thái hoạt động (isDeleted là 0(kích hoạt) và 1(không kích hoạt) ).

### Sticker Manager `/admin/stickers-manager`.

-   `[POST] `: tạo nhóm sticker.
    -   body: {name: String, description: String}.
    -   result: {\_id, name, description, stickers: [String] }.
-   `[PUT] /:id `: update nhóm sticker.
    -   body: {name: String, description: String}.
-   `[DELETE] /:id `: xóa nhóm sticker (chỉ xóa được khi không có sticker nào).
-   `[POST] /:id `: thêm sticker vào nhóm.
    -   body(FormData): {file: File}.
-   `[DELETE] /:id/sticker `: xóa sticker trong nhóm (url là đường dẫn của sticker cần xóa).
    -   params: {url: String}.

### Socket Server nhận

-   socket.on('join', (userId) => {
    socket.join(userId);
    });

-   socket.on('join-conversations', (conversationIds) => {
    conversationIds.forEach((id) => socket.join(id));
    });

-   socket.on('join-conversation', (conversationId) => {
    socket.join(conversationId);
    });

-   socket.on('leave-conversation', (conversationId) => {
    socket.leave(conversationId);
    });
-   socket.on('typing', (conversationId, me) => {
    socket.broadcast.to(conversationId).emit('typing', conversationId, me);
    });
-   socket.on('not-typing', (conversationId, me) => {
    socket.broadcast.to(conversationId).emit('not-typing', conversationId, me);
    });
-   socket.on('get-user-online', (userId, ({isOnline, lastLogin}) => {} ))
-   socket.on('conversation-last-view', (conversationId, channelId) => {}): để cập nhật lại last view của mình ở conversation hoặc channel đó (nếu là channel thì phải truyền cả 2 tham số).

### Socket Server trả về

-   socket.emit('user-last-view', {conversationId, channelId, userId, lastView: Date } ): user đã xem tin nhắn ở conversation hoặc channel.
