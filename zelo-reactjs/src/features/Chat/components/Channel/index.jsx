import { CaretDownOutlined, NumberOutlined } from '@ant-design/icons';
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './style.scss';
import ChannelItem from '../ChannelItem';
import { Input, message, Modal } from 'antd';
import channelApi from 'api/channelApi';
import { useDispatch, useSelector } from 'react-redux';
import { fetchListMessages, getLastViewOfMembers, setCurrentChannel } from 'features/Chat/slice/chatSlice';

Channel.propTypes = {
    onViewChannel: PropTypes.func,
    data: PropTypes.array,
    onOpenInfoBlock: PropTypes.func,
};


Channel.defaultProps = {
    onViewChannel: null,
    data: [],
    onOpenInfoBlock: null,
};




const styleIconDrop = {
    transform: 'rotate(-90deg)'
}

const styleInteract = {
    maxHeight: "0px",
}


function Channel({ onViewChannel, data, onOpenInfoBlock }) {

    const [isDrop, setIsDrop] = useState(true);
    const [isVisible, setIsVisible] = useState(false);
    const [valueInput, setValueInput] = useState('');
    const { currentConversation, currentChannel, conversations, totalChannelNotify } = useSelector(state => state.chat);
    const dispatch = useDispatch();



    const handleViewChannel = () => {

    }

    const handleOnClick = () => {
        setIsDrop(!isDrop);
    }

    const handleViewAll = () => {
        if (onViewChannel) {
            onViewChannel()
        }
        if (onOpenInfoBlock) {
            onOpenInfoBlock()
        }
    }
    const handleAddChannel = () => {
        setIsVisible(true)
    }

    const handleOk = async () => {
        try {
            await channelApi.addChannel(valueInput, currentConversation);
            message.success('Tạo channel thành công');
            setIsVisible(false)
        } catch (error) {
            console.log(error);

        }
    }

    const handleCancel = () => {
        setIsVisible(false);
        setValueInput('')
    }

    const handleInputChange = (e) => {
        setValueInput(e.target.value)
    }


    const handleViewGeneralChannel = () => {
        dispatch(setCurrentChannel(''));
        dispatch(fetchListMessages({ conversationId: currentConversation, size: 10 }));
        dispatch(getLastViewOfMembers({ conversationId: currentConversation }));

    }

    return (
        <div className="channel">
            <div
                className="channel-header"
                onClick={handleOnClick}
            >
                <div className="channel-header-title">
                    Kênh

                    {totalChannelNotify > 0 &&
                        <span className="total-channel-notify">({totalChannelNotify} kênh có tin nhắn)</span>
                    }

                </div>

                <div
                    className="channel-header-icon"
                    style={isDrop ? {} : styleIconDrop}
                >
                    <CaretDownOutlined />
                </div>
            </div>

            <div
                className="channel-interact"
                style={isDrop ? {} : styleInteract}
            >

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


                {
                    data.map((ele, index) => {
                        if (index < 3) {
                            return (
                                <ChannelItem
                                    key={index}
                                    data={ele}
                                    isActive={currentChannel === ele._id ? true : false}
                                />
                            )
                        }
                    })
                }


                <div className='channel-interact-button'>
                    <button onClick={handleAddChannel}>Thêm Channel</button>
                </div>

                <div className='channel-interact-button'>
                    <button onClick={handleViewAll}>Xem Tất cả</button>
                </div>
            </div>


            <Modal
                title="Thêm Channel"
                visible={isVisible}
                onOk={handleOk}
                onCancel={handleCancel}
                okText='Tạo'
                cancelText='Hủy'
                okButtonProps={{ disabled: valueInput.trim().length === 0 }}

            >
                <Input
                    placeholder="Nhập tên channel"
                    allowClear value={valueInput}
                    onChange={handleInputChange}
                    onEnter={handleOk}
                />
            </Modal>

        </div >
    );
}

export default Channel;