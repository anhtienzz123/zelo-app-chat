import { CaretDownOutlined, DeleteOutlined, ExclamationCircleOutlined, ExportOutlined } from '@ant-design/icons';
import { message, Modal } from 'antd';
import conversationApi from 'api/conversationApi';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { leaveGroup } from '../../slice/chatSlice';
import './style.scss';

AnotherSetting.propTypes = {
    socket: PropTypes.object,
};

AnotherSetting.defaultProps = {
    socket: {}
};


const styleIconDrop = {
    transform: 'rotate(-90deg)'
}

const styleInteract = {
    maxHeight: "0px",
}


function AnotherSetting({ socket }) {
    const [isDrop, setIsDrop] = useState(true);
    const { currentConversation, conversations } = useSelector(state => state.chat);
    const { user } = useSelector(state => state.global);
    const dispatch = useDispatch();


    const handleOnClick = () => {
        setIsDrop(!isDrop);
    }



    function confirm() {
        Modal.confirm({
            title: 'Cảnh báo',
            icon: <ExclamationCircleOutlined />,
            content: 'Bạn có thực sự muốn rời khỏi nhóm',
            okText: 'Đồng ý',
            cancelText: 'Hủy',
            onOk: async () => {
                try {
                    await conversationApi.leaveGroup(currentConversation);
                    message.success(`Rời nhóm thành công`);

                    socket.emit('leave-conversation', currentConversation);

                    dispatch(leaveGroup(currentConversation));
                } catch (error) {
                    message.error(`Rời nhóm thất bại`);
                }

            }
        });
    }

    function confirmDeleteGroup() {
        Modal.confirm({
            title: 'Xác nhận',
            icon: <ExclamationCircleOutlined />,
            content: (
                <span>
                    Toàn bộ nội dung cuộc trò chuyện sẻ bị xóa, bạn có chắc chắn
                    muốn xóa ?
                </span>
            ),
            okText: 'Xóa',
            cancelText: 'Không',
            onOk: async () => {
                try {
                    await conversationApi.deleteConversation(currentConversation);
                    message.success('Xóa thành công');
                } catch (error) {
                    message.error(
                        'Đã có lỗi xảy ra'
                    );
                }
            },
        });
    }



    return (
        <div className="info_setting">
            <div
                className="info_setting-header"
                onClick={handleOnClick}
            >
                <div className="info_setting-header-title">
                    Cài đặt khác
                </div>

                <div className="info_setting-header-icon" style={isDrop ? {} : styleIconDrop}>
                    <CaretDownOutlined />
                </div>
            </div>

            <div className="info_setting-interact" style={isDrop ? {} : styleInteract}>



                {
                    conversations.find(ele => ele._id === currentConversation).leaderId === user._id ?
                        (
                            <div className="info_setting-interact-amount danger" onClick={confirmDeleteGroup}>
                                <div className="info_setting-interact-amount-icon">
                                    <DeleteOutlined />
                                </div>

                                <div className="info_setting-interact-amount-text">
                                    <span>Giải tán nhóm</span>
                                </div>
                            </div>
                        ) : (
                            <div className="info_setting-interact-amount danger" onClick={confirm}>
                                <div className="info_setting-interact-amount-icon">
                                    <ExportOutlined />
                                </div>

                                <div className="info_setting-interact-amount-text">
                                    <span>Rời nhóm</span>
                                </div>
                            </div>
                        )
                }
            </div>
        </div>
    );
}

export default AnotherSetting;