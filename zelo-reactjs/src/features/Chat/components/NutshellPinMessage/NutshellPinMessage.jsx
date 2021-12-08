import React from 'react';
import PropTypes from 'prop-types';
import './style.scss';
import { CaretDownOutlined, DashOutlined, MessageTwoTone, ExclamationCircleOutlined } from '@ant-design/icons';
import { Button, Dropdown, Menu, message as MessageNotify, Modal } from 'antd';
import NutshellPinMessageStyle from './NutshellPinMessageStyle';
import pinMessageApi from 'api/pinMessageApi';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPinMessages } from '../../slice/chatSlice';
import TypeMessagePin from '../TypeMessagePin';
import ModalDetailMessagePin from '../ModalDetailMessagePin';
import { useState } from 'react';
NutshellPinMessage.propTypes = {
    isItem: PropTypes.bool,
    onOpenDrawer: PropTypes.func,
    message: PropTypes.object,
    quantity: PropTypes.number,
    isCheckbox: PropTypes.bool,
    isHover: PropTypes.bool,
};

NutshellPinMessage.defaultProps = {
    isItem: false,
    onOpenDrawer: null,
    message: {},
    quantity: 0,
    isCheckbox: false,
    isHover: true

};



function NutshellPinMessage({ isItem, onOpenDrawer, message, quantity, isHover }) {
    const dispatch = useDispatch();
    const { currentConversation } = useSelector(state => state.chat);
    const [visible, setVisible] = useState(false);



    function confirm() {
        Modal.confirm({
            title: 'Bỏ ghim',
            icon: <ExclamationCircleOutlined />,
            content: 'Bạn có chắc muốn bỏ ghim nội dung này không ?',
            okText: 'Bỏ ghim',
            cancelText: 'Không',
            onOk: async () => {
                await pinMessageApi.removePinMessage(message._id);
                MessageNotify.success('Xóa thành công')
                dispatch(fetchPinMessages({ conversationId: currentConversation }))
            },
            okButtonProps: { type: 'danger' }
        });
    }


    const handleOnClickMenu = ({ _, key }) => {
        if (key === '1') {
            confirm()
        }
    };


    const menu = (
        <Menu onClick={handleOnClickMenu} >
            <Menu.Item key="1" danger>
                <span style={NutshellPinMessageStyle.MENU_ITEM}>Bỏ gim</span>
            </Menu.Item>

        </Menu>
    );


    const handleOnClickVisbleList = () => {
        if (onOpenDrawer) {
            onOpenDrawer()
        }
    }

    const handleOnClick = () => {
        setVisible(true)
    }

    const handleCloseModal = () => {
        setVisible(false)
    }


    return (

        <>
            <div className={`nutshell-pin-container ${isItem ? 'select' : ''} ${isHover ? '' : 'no-hover'}`}>
                <div className="nutshell-pin-container_left" onClick={handleOnClick}>
                    <div className="nutshell-pin-container_icon">
                        <MessageTwoTone />
                    </div>

                    <div className="nutshell-pin-container_messsage">
                        <div className="nutshell-pin-container_title">
                            Tin nhắn
                        </div>
                        <div className="nutshell-pin-container_detail">
                            <TypeMessagePin
                                name={message.user.name}
                                content={message.content}
                                type={message.type}
                            />
                        </div>

                    </div>
                </div>
                <div className={`nutshell-pin-container_right ${isItem ? 'no-display' : ''}`}>

                    {
                        isItem ? (
                            <Dropdown overlay={menu} placement="bottomLeft" trigger={['click']} >
                                <button
                                    className='nutshell-pin-container_button-interact'
                                >
                                    <DashOutlined />
                                </button>
                            </Dropdown>
                        ) : (

                            <Button
                                style={NutshellPinMessageStyle.BUTTON_LIST}
                                type="primary" ghost
                                onClick={handleOnClickVisbleList}
                            >
                                {`${quantity} ghim tin khác`}<CaretDownOutlined />
                            </Button>

                        )

                    }
                </div>
            </div>


            <ModalDetailMessagePin
                visible={visible}
                message={message}
                onClose={handleCloseModal}
            />

        </>

    );
}

export default NutshellPinMessage;