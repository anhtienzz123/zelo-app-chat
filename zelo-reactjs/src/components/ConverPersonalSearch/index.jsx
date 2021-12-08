import React from 'react';
import PropTypes from 'prop-types';
import './style.scss';
import PersonalIcon from 'features/Chat/components/PersonalIcon';
import { Empty } from 'antd';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { fetchListMessages, setCurrentConversation } from 'features/Chat/slice/chatSlice';

ConverPersonalSearch.propTypes = {
    data: PropTypes.array,
};

ConverPersonalSearch.defaultProps = {
    data: [],
};

function ConverPersonalSearch({ data }) {

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
                <div key={index} className="single-conver_item" onClick={() => handleClickItem(ele)} >
                    <PersonalIcon
                        avatar={ele.avatar}
                        color={ele.avatarColor}
                        name={ele.name}
                    />

                    <div className="single-conver_name">
                        {ele.name}
                    </div>
                </div>
            ))}
        </div>
    );
}

export default ConverPersonalSearch;