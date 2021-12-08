import React from 'react';
import PropTypes from 'prop-types';
import { Typography } from 'antd';

const { Text } = Typography;

MessageList.propTypes = {
    messages: PropTypes.array,
    userId: PropTypes.string,
};

MessageList.defaultProps = {
    messages: [],
    userId: '',
};

function MessageList({ messages, userId }) {
    return (
        <div style={{ padding: '10px' }}>
            {messages.map((messageEle, index) => {
                const { senderId, content, user } = messageEle;
                const { name } = user;

                const isSelf = senderId === userId;

                return (
                    <div
                        style={{
                            textAlign: isSelf ? 'right' : 'left',
                        }}
                        key={index}
                    >
                        <p>
                            <Text
                                style={{
                                    border: '1px solid black',
                                    padding: '10px',
                                    borderRadius: '10px',
                                    background: isSelf ? '#1890ff' : '#CCCCCC',
                                    color: isSelf ? 'white' : 'black',
                                }}
                            >
                                {name}:{content}
                            </Text>
                        </p>
                    </div>
                );
            })}
        </div>
    );
}

export default MessageList;
