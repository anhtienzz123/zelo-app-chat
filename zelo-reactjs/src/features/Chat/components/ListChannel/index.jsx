import React from 'react';
import PropTypes from 'prop-types';
import ChannelItem from '../ChannelItem';
import { useDispatch, useSelector } from 'react-redux';
import './style.scss';
import { fetchListMessages, getLastViewOfMembers, setCurrentChannel } from 'features/Chat/slice/chatSlice';
import { NumberOutlined } from '@ant-design/icons';

ListChannel.propTypes = {
    data: PropTypes.array,
};


ListChannel.defaultProps = {
    data: [],
};


function ListChannel({ data }) {
    const { currentChannel, currentConversation, conversations } = useSelector(state => state.chat);
    const dispatch = useDispatch();


    const handleViewGeneralChannel = () => {
        dispatch(setCurrentChannel(''));
        dispatch(fetchListMessages({ conversationId: currentConversation, size: 10 }));
        dispatch(getLastViewOfMembers({ conversationId: currentConversation }));

    }

    return (
        <div id='list-channel'>

            <div className={`channel-interact-amount ${currentChannel ? '' : 'active'}`} onClick={handleViewGeneralChannel}>
                <div className="channel-interact-amount-icon">
                    <NumberOutlined />
                </div>

                <div className="channel-interact-amount-text">
                    <span>Kênh chung</span>

                </div>
                {conversations.find(ele => ele._id === currentConversation).numberUnread > 0 && (
                    <div className='notify-amount'>
                        {conversations.find(ele => ele._id === currentConversation).numberUnread}
                    </div>
                )}

            </div>

            {data.map((ele, index) => (
                <ChannelItem
                    data={ele}
                    isActive={currentChannel === ele._id ? true : false}
                />
            ))}

        </div>
    );
}

export default ListChannel;