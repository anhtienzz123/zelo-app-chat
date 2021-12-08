import React from 'react';
import PropTypes from 'prop-types';
import { Button, Divider } from 'antd';

ConversationList.propTypes = {
    conversations: PropTypes.array,
    onClick: PropTypes.func,
};

ConversationList.defaultProps = {
    conversations: [],
};

function ConversationList({ conversations, onClick }) {
    const handleClick = (id) => {
        if (onClick) onClick(id);
    };

    return (
        <div>
            {conversations.map((conversationEle, index) => {
                const { _id, name } = conversationEle;

                return (
                    <div key={index} onClick={() => handleClick(_id)}>
                        <p>Id: {_id}</p>
                        <p>Name: {name} </p>
                        <Divider></Divider>
                    </div>
                );
            })}
        </div>
    );
}

export default ConversationList;
