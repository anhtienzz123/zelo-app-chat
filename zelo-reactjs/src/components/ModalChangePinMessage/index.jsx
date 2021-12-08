import { MessageTwoTone } from '@ant-design/icons';
import { Alert, Modal, Radio, message as messageNotify } from 'antd';
import pinMessageApi from 'api/pinMessageApi';
import TypeMessagePin from 'features/Chat/components/TypeMessagePin';
import { fetchPinMessages } from 'features/Chat/slice/chatSlice';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import './style.scss';

ModalChangePinMessage.propTypes = {
    visible: PropTypes.bool.isRequired,
    message: PropTypes.array,
    idMessage: PropTypes.string,
    onCloseModal: PropTypes.func,
};


ModalChangePinMessage.defaultProps = {
    message: [],
    idMessage: '',
    onCloseModal: null
};


function ModalChangePinMessage({ visible, message, onCloseModal, idMessage }) {
    const [value, setValue] = useState('');
    const dispatch = useDispatch();
    const { currentConversation } = useSelector(state => state.chat);



    const handleOnClickItem = (ele) => {
        setValue(ele._id)
    }

    const handleOnOk = async () => {
        await pinMessageApi.removePinMessage(value);
        await pinMessageApi.pinMessage(idMessage);
        messageNotify.success('Ghim tin nhắn thành công')
        dispatch(fetchPinMessages({ conversationId: currentConversation }));
        handleOnCancel();
    }

    const handleOnCancel = () => {
        if (onCloseModal) {
            onCloseModal()
        }
    }
    return (
        <div>
            <Modal
                title="Cập nhật danh sách ghim" visible={visible}
                okText='Xác nhận'
                cancelText='Hủy'
                okButtonProps={{ disabled: !value ? true : false }}
                onOk={handleOnOk}
                onCancel={handleOnCancel}

            >

                <Alert

                    description="Đã đạt giới hạn 3 ghim. Ghim cũ dưới đây sẻ được bỏ để cập nhật nội dung mới"
                    type="warning"
                // showIcon
                />
                <div className="modal-change-pin_wapper">
                    {
                        message.map((ele, index) => (
                            <div
                                className="modal-change-pin"
                                key={index}
                                onClick={() => handleOnClickItem(ele)}
                            >
                                <div className="modal-change-pin_left">
                                    <div className="modal-change-pin_icon">
                                        <MessageTwoTone />
                                    </div>


                                    <div className="modal-change-pin_messsage">
                                        <div className="modal-change-pin_title">
                                            Tin nhắn
                                        </div>
                                        <div className="modal-change-pin_detail">
                                            <TypeMessagePin
                                                name={ele.user.name}
                                                content={ele.content}
                                                type={ele.type}
                                            />
                                        </div>

                                    </div>

                                </div>


                                <div className="modal-change-pin_right">
                                    <Radio checked={value === ele._id ? true : false}></Radio>
                                </div>

                            </div>
                        ))

                    }
                </div>

            </Modal>
        </div>
    );
}

export default ModalChangePinMessage;