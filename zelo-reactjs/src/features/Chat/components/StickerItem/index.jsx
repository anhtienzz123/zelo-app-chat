import React from 'react';
import PropTypes from 'prop-types';
import './style.scss'
import { useSelector } from 'react-redux';
import messageApi from 'api/messageApi';

StickerItem.propTypes = {
    data: PropTypes.object,
    onClose: PropTypes.func,
    onScroll: PropTypes.func,
};

StickerItem.defaultProps = {
    data: {},
    onClose: null,
    onScroll: null
};


function StickerItem({ data, onClose, onScroll }) {

    const { currentConversation, currentChannel } = useSelector(state => state.chat)


    const handleSelectSticker = async (value) => {
        if (onClose) {
            onClose();
        }
        const newMessage = {
            content: value,
            type: 'STICKER',
            conversationId: currentConversation,
        };

        if (currentChannel) {
            newMessage.channelId = currentChannel
        };


        await messageApi
            .sendTextMessage(newMessage)
            .then((res) => {
                const { _id } = res;
                if (onScroll) {
                    onScroll(_id);
                }
            })
            .catch((err) => console.log('Send Message Fail'));




    }



    return (
        <div className='sticker-item'>
            <div className="sticker-item_name">
                {data.name}
            </div>

            <div className="sticker-item_list-sticker">
                {data.stickers.map((ele, index) => (
                    <div
                        className="sticker-item_img"
                        key={index}
                        onClick={() => handleSelectSticker(ele)}
                    >
                        <img
                            src={ele}
                            alt={`${data.name} ${index}`}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}

export default StickerItem;