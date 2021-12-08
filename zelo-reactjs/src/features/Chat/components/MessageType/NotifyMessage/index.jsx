import { EditTwoTone, PushpinTwoTone, NumberOutlined, KeyOutlined } from '@ant-design/icons';
import { Avatar, Tooltip } from 'antd';
import AvatarCustom from 'components/AvatarCustom';
import parse from 'html-react-parser';
import PropTypes from 'prop-types';
import React from 'react';
import { useSelector } from 'react-redux';
import './style.scss';


NotifyMessage.propTypes = {
    message: PropTypes.object,

};

NotifyMessage.propTypes = {
    message: {},

};

function NotifyMessage({ message }) {
    const global = useSelector((state) => state.global);
    const {
        content,
        manipulatedUsers,
        user,
    } = message;
    const { name, avatar, avatarColor } = user;

    const isMyActive = user._id === global.user._id ? 'Bạn' : user.name;

    const transferTextToValue = (text) => {
        if (text === 'Đã thêm vào nhóm') {
            return 1;
        }

        if (text === 'Đã xóa ra khỏi nhóm') {
            return 2;
        }

        if (text === 'Đã tạo nhóm') {
            return 3;
        }
        if (text === 'Đã tham gia nhóm') {
            return 4;
        }

        if (text === 'Đã rời khỏi nhóm') {
            return 5;
        }
        if (text === 'Đã là bạn bè') {
            return 6;
        }
        if (text === 'PIN_MESSAGE') {
            return 7
        }
        if (text === 'NOT_PIN_MESSAGE') {
            return 8
        }
        if (text.startsWith('Đã đổi tên nhóm thành')) {
            return 9;
        }
        if (text === 'Tham gia từ link') {
            return 10;
        }

        if (text === 'UPDATE_CHANNEL') {
            return 11;
        }

        if (text === 'DELETE_CHANNEL') {
            return 12;
        }

        if (text === 'CREATE_CHANNEL') {
            return 13;
        }


        if (text === 'Ảnh đại diện nhóm đã thay đổi') {
            return 14;
        }
        if (text === 'ADD_MANAGERS') {
            return 15;
        }

        if (text === 'DELETE_MANAGERS') {
            return 16;
        }

    };


    const renderGroupAvatars = (
        <>
            {
                (manipulatedUsers && manipulatedUsers.length > 0) &&
                manipulatedUsers.map((ele, index) => {
                    if (index < 3) {
                        return (
                            <div
                                key={index}
                                className='notify-message-content_per-avatar'
                            >
                                <AvatarCustom
                                    size='small'
                                    src={ele.avatar}
                                    name={ele.name}
                                    color={ele.avatarColor}
                                />
                            </div>
                        )
                    }
                    if (index > 3) {
                        return (
                            <Tooltip placement='top' key={index}>
                                <Avatar
                                    style={{
                                        backgroundColor: '#7562d8',
                                        color: '#fff',
                                    }}
                                    size='small'>
                                    {`+${manipulatedUsers.length - 3}`}
                                </Avatar>
                            </Tooltip>
                        )
                    }
                })
            }
        </>
    )


    const renderUser = (
        <>
            {manipulatedUsers &&
                manipulatedUsers.length > 0 &&
                manipulatedUsers.map((ele, index) => {
                    if (index < 3) {
                        if (index === 0) {
                            return (
                                <span className='user-name-strong'>
                                    {` ${ele._id ===
                                        global.user._id
                                        ? 'bạn'
                                        : ele.name
                                        }`
                                    }
                                </span>

                            )
                        } else {
                            return (
                                <span className='user-name-strong'>
                                    {
                                        `, ${ele._id ===
                                            global.user._id
                                            ? 'bạn'
                                            : ele.name
                                        }`
                                    }
                                </span>
                            )
                        }

                    } else {
                        return (
                            <span className='user-name-strong'>
                                {` và`}{' '}
                                <span className='blue'>{`${manipulatedUsers.length - 3
                                    } người khác`}</span>
                            </span>
                        )
                    }

                })}
        </>
    )



    return (
        <div className='notify-message-wrapper'>
            <div className='notify-message-content'>


                {
                    transferTextToValue(content) === 3 && (
                        <div className='notify-message-content_group-avatar'>
                            <div className='notify-message-content_per-avatar'>

                                <AvatarCustom
                                    size='small'
                                    src={avatar}
                                    name={name}
                                    color={avatarColor}
                                />
                            </div>

                            <div className='notify-message-content-title'>
                                <span className='user-name-strong'>
                                    {isMyActive}
                                </span>
                                <span>
                                    &nbsp;đã tạo nhóm
                                </span>
                            </div>
                        </div>
                    )
                }

                {
                    transferTextToValue(content) === 1 && (
                        <>
                            <div className='notify-message-content_group-avatar'>
                                {renderGroupAvatars}
                            </div>

                            <div className='notify-message-content-title'>
                                <span className='user-name-strong'>
                                    {isMyActive}
                                </span>
                                &nbsp;
                                <span>
                                    đã thêm
                                </span>
                                {renderUser}

                            </div>
                        </>
                    )
                }

                {
                    (transferTextToValue(content) === 4 || transferTextToValue(content) === 10) && (
                        <div className='notify-message-content_group-avatar'>
                            <div className='notify-message-content_per-avatar'>
                                <AvatarCustom
                                    size='small'
                                    src={avatar}
                                    name={name}
                                    color={avatarColor}
                                />
                            </div>

                            <div className='notify-message-content-title'>
                                <span className='user-name-strong'>
                                    {isMyActive}
                                </span>&nbsp;
                                đã tham gia nhóm
                            </div>
                        </div>
                    )
                }


                {
                    transferTextToValue(content) === 2 && (
                        <>
                            <div className='notify-message-content_group-avatar'>
                                <div className='notify-message-content_per-avatar'>
                                    <AvatarCustom
                                        size='small'
                                        src={avatar}
                                        name={name}
                                        color={avatarColor}

                                    />
                                </div>

                                <div className='notify-message-content-title'>
                                    <span className='user-name-strong'>
                                        {isMyActive}
                                    </span>
                                    <span >
                                        &nbsp;đã xóa
                                    </span >
                                    {renderUser}
                                    <span >
                                        &nbsp;ra khỏi nhóm
                                    </span>
                                </div>
                            </div>
                        </>
                    )
                }


                {
                    transferTextToValue(content) === 5 && (
                        <>
                            <div className='notify-message-content_group-avatar'>
                                <div className='notify-message-content_per-avatar'>
                                    <AvatarCustom
                                        size='small'
                                        src={avatar}
                                        name={name}
                                        color={avatarColor}

                                    />
                                </div>

                                <div className='notify-message-content-title'>

                                    <span className='user-name-strong'>
                                        {name}
                                    </span>
                                    <span>
                                        &nbsp;đã rời khỏi nhóm
                                    </span>
                                </div>
                            </div>
                        </>
                    )
                }


                {
                    transferTextToValue(content) === 6 && (
                        <>
                            <div className='notify-message-content_group-avatar'>
                                <div className='notify-message-content-title'>
                                    <span className='user-name-strong'>
                                        Đã trờ thành bạn bè của nhau
                                    </span>
                                </div>
                            </div>
                        </>
                    )
                }

                {
                    transferTextToValue(content) === 7 && (
                        <>
                            <div className='notify-message-content_group-avatar'>
                                <div className='notify-message-content-title'>
                                    <PushpinTwoTone />&nbsp;
                                    <span className='user-name-strong'>
                                        {`${isMyActive} `}
                                    </span>
                                    {`đã ghim một tin nhắn`}.

                                </div>
                            </div>
                        </>
                    )
                }

                {
                    transferTextToValue(content) === 8 && (
                        <>
                            <div className='notify-message-content_group-avatar'>
                                <div className='notify-message-content-title'>
                                    <PushpinTwoTone twoToneColor='#de433e' />&nbsp;
                                    <span className='user-name-strong'>
                                        {`${isMyActive} `}
                                    </span>
                                    {`đã xóa ghim một tin nhắn`}.
                                </div>
                            </div>
                        </>
                    )
                }

                {
                    transferTextToValue(content) === 9 && (
                        <>
                            <div className='notify-message-content_group-avatar'>
                                <div className='notify-message-content_per-avatar'>

                                    <AvatarCustom
                                        size='small'
                                        src={user.avatar}
                                        color={user.avatarColor}
                                        name={user.name}
                                    />
                                </div>
                                <div className='notify-message-content-title'>
                                    <EditTwoTone />&nbsp;
                                    <span className='user-name-strong'>
                                        {`${isMyActive} `}
                                    </span>
                                    {parse(content)}
                                </div>
                            </div>
                        </>
                    )
                }

                {
                    transferTextToValue(content) === 11 && (
                        <>
                            <div className='notify-message-content_group-avatar'>
                                <div className='notify-message-content_per-avatar'>

                                    <AvatarCustom
                                        size='small'
                                        src={user.avatar}
                                        name={user.name}
                                        color={user.avatarColor}
                                    />
                                </div>
                                <div className='notify-message-content-title'>
                                    <span className='user-name-strong'>
                                        {`${isMyActive} `}
                                    </span>
                                    đã đổi tên channel
                                    &nbsp;<NumberOutlined />
                                </div>
                            </div>
                        </>
                    )
                }


                {
                    transferTextToValue(content) === 12 && (
                        <>
                            <div className='notify-message-content_group-avatar'>
                                <div className='notify-message-content_per-avatar'>

                                    <AvatarCustom
                                        size='small'
                                        src={user.avatar}
                                        name={user.name}
                                        color={user.avatarColor}
                                    />
                                </div>
                                <div className='notify-message-content-title'>
                                    <span className='user-name-strong'>
                                        {`${isMyActive} `}
                                    </span>
                                    đã xóa Channel
                                    &nbsp;<NumberOutlined />
                                </div>
                            </div>
                        </>
                    )
                }

                {
                    transferTextToValue(content) === 13 && (
                        <>
                            <div className='notify-message-content_group-avatar'>
                                <div className='notify-message-content_per-avatar'>

                                    <AvatarCustom
                                        size='small'
                                        src={user.avatar}
                                        name={user.name}
                                        color={user.avatarColor}
                                    />
                                </div>
                                <div className='notify-message-content-title'>
                                    <span className='user-name-strong'>
                                        {`${isMyActive} `}
                                    </span>
                                    đã tạo Channel
                                    &nbsp;<NumberOutlined />
                                </div>
                            </div>
                        </>
                    )
                }




                {
                    transferTextToValue(content) === 14 && (
                        <>
                            <div className='notify-message-content_group-avatar'>
                                <div className='notify-message-content_per-avatar'>

                                    <AvatarCustom
                                        size='small'
                                        src={user.avatar}
                                        name={user.name}
                                        color={user.avatarColor}
                                    />
                                </div>
                                <div className='notify-message-content-title'>
                                    <EditTwoTone />&nbsp;
                                    <span className='user-name-strong'>
                                        {`${isMyActive} `}
                                    </span>
                                    đã thay đổi ảnh đại diện nhóm


                                </div>
                            </div>
                        </>
                    )
                }

                {
                    transferTextToValue(content) === 15 && (
                        <>
                            <div className='notify-message-content_group-avatar'>
                                <div className='notify-message-content_per-avatar'>

                                    <AvatarCustom
                                        size='small'
                                        src={user.avatar}
                                        name={user.name}
                                        color={user.avatarColor}
                                    />
                                </div>
                                <div className='notify-message-content-title'>
                                    <KeyOutlined />&nbsp;
                                    <span className='user-name-strong'>
                                        {`${isMyActive} `}
                                    </span>
                                    đã thêm {renderUser} làm phó nhóm


                                </div>
                            </div>
                        </>
                    )
                }




                {
                    transferTextToValue(content) === 16 && (
                        <>
                            <div className='notify-message-content_group-avatar'>
                                <div className='notify-message-content_per-avatar'>

                                    <AvatarCustom
                                        size='small'
                                        src={user.avatar}
                                        name={user.name}
                                        color={user.avatarColor}
                                    />
                                </div>
                                <div className='notify-message-content-title'>
                                    <KeyOutlined />&nbsp;
                                    <span className='user-name-strong'>
                                        {`${isMyActive} `}
                                    </span>
                                    đã xóa phó nhóm của {renderUser}


                                </div>
                            </div>
                        </>
                    )
                }


            </div>
        </div>
    );
}

export default NotifyMessage;