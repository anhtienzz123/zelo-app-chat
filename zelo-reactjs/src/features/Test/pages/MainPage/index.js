import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useRouteMatch } from 'react-router-dom';
import { Col, Divider, Input, Row } from 'antd';
import ConversationList from 'features/Chat/components/ConversationList';
import UserOnlineList from 'features/Chat/components/UserOnlineList';
import MessageList from 'features/Chat/components/MessageList';
import io from 'socket.io-client';
import { useDispatch, useSelector } from 'react-redux';
import {
    addMessage,
    fetchListConversations,
    fetchListMessages,
} from 'features/Test/testSlice';
import { unwrapResult } from '@reduxjs/toolkit';

const { Search } = Input;

MainPage.propTypes = {};

let socket = io(process.env.REACT_APP_API_URL, { transports: ['websocket'] });

function MainPage(props) {
    const { user } = useSelector((state) => state.global);
    const { _id, name, friends } = user;
    const { conversations, messages } = useSelector((state) => state.chat);
    const [currentConversationId, setCurrentConversationId] = useState('');

    const dispatch = useDispatch();

    const [userOnlines, setUserOnlines] = useState([]);

    const handleSend = (value) => {
        console.log('value: ', value);
        socket.emit('send-message', user, value, currentConversationId);
        dispatch(addMessage({ senderId: _id, content: value, user: { name } }));
    };

    const handleConversationClick = (conversationId) => {
        setCurrentConversationId(conversationId);
        dispatch(fetchListMessages({ conversationId }));
    };

    useEffect(() => {
        socket.emit('join', { _id, name });
    }, [user]);

    useEffect(() => {
        socket.on('receive-message', (userRes, message) => {
            //setMessages((messages) => [...messages, msg]);

            console.log('userReciver: ', user);
            console.log('messageReciver: ', message);

            const { _id, name } = userRes;

            dispatch(
                addMessage({ senderId: _id, content: message, user: { name } })
            );
        });

        socket.on('user-onlines', (users) => {
            console.log('users: ', users);
            console.log('friends: ', friends);

            if (!users || user.length <= 0 || !friends) return;
            const usersResult = users.filter((userEle, index) =>
                friends.includes(userEle._id)
            );
            console.log('userResult: ', usersResult);

            setUserOnlines(usersResult);
        });
    }, []);

    useEffect(() => {
        dispatch(fetchListConversations());
    }, []);

    useEffect(() => {
        const ids = conversations.map((ele) => ele._id);

        socket.emit('join-conversations', ids);
    }, [conversations]);

    return (
        <div className="chat-main-page">
            <Row gutter={16}>
                <Col span={6}>
                    <ConversationList
                        conversations={conversations}
                        onClick={handleConversationClick}
                    />
                </Col>

                <Col span={12}>
                    <MessageList messages={messages} userId={_id} />
                    <Divider />
                    <Search
                        placeholder="Nhập"
                        allowClear
                        enterButton="Send"
                        size="large"
                        onSearch={handleSend}
                    />
                </Col>

                <Col span={6}>
                    <UserOnlineList userOnlines={userOnlines} />
                </Col>
            </Row>
        </div>
    );
}

export default MainPage;
