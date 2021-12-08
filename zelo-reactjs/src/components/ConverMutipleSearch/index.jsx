import React from 'react';
import PropTypes from 'prop-types';
import './style.scss';
import ConversationAvatar from 'features/Chat/components/ConversationAvatar';
import { Empty } from 'antd';
import { useDispatch } from 'react-redux';
import { fetchListMessages, setCurrentConversation } from 'features/Chat/slice/chatSlice';
import { useHistory } from 'react-router-dom';

ConverMutipleSearch.propTypes = {
    data: PropTypes.array,
};

ConverMutipleSearch.defaultProps = {
    data: [],
};

function ConverMutipleSearch({ data }) {
    const dispatch = useDispatch();
    const history = useHistory();


    const handleClickItem = (value) => {
        dispatch(fetchListMessages({ conversationId: value._id, size: 10 }));
        dispatch(setCurrentConversation(value._id));

        history.push({
            pathname: '/chat',
        });
    }

    return (
        <div className='list-filter_single-conver'>
            {data.length === 0 && (
                <Empty />
            )}


            {data.map((ele, index) => (
                <div key={index} className="single-conver_item" onClick={() => handleClickItem(ele)}>
                    <ConversationAvatar
                        avatar={ele.avatar}
                        totalMembers={ele.totalMembers}
                        type={ele.type}
                        name={ele}

                    />

                    <div className="single-conver_name">
                        {ele.name}
                    </div>
                </div>
            ))}
        </div>
    );
}

export default ConverMutipleSearch;