import { EditOutlined } from '@ant-design/icons';
import { Modal, Input, message } from 'antd';
import PropTypes from 'prop-types';
import React, { useState, useEffect, useRef } from 'react';
import ConversationAvatar from '../ConversationAvatar';
import { useDispatch, useSelector } from 'react-redux';
import './style.scss';
import conversationApi from 'api/conversationApi';
import { updateNameOfConver } from 'features/Chat/slice/chatSlice';
import UploadAvatar from 'components/UploadAvatar';

InfoNameAndThumbnail.propTypes = {
    conversation: PropTypes.object,
};

InfoNameAndThumbnail.defaultProps = {
    conversation: {}
};


function InfoNameAndThumbnail({ conversation }) {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [value, setValue] = useState('');
    const { currentConversation } = useSelector(state => state.chat);

    const dispatch = useDispatch();
    const refInitValue = useRef();
    const [file, setFile] = useState(null);
    const [isClear, setIsClear] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);




    useEffect(() => {
        if (conversation.type) {
            setValue(conversation.name);
            refInitValue.current = conversation.name;

        }

        if (isModalVisible) {
            setIsClear(false)
        }

    }, [currentConversation, isModalVisible])


    function handleOnClick() {
        setIsModalVisible(true)
    }
    function handleCancel() {
        setIsModalVisible(false);
        setFile(null);
        setIsClear(true)

    }

    async function handleOk() {
        setConfirmLoading(true);
        try {
            if (refInitValue.current !== value) {
                await conversationApi.changeNameConversation(currentConversation, value);
            }

            if (file) {
                const frmData = new FormData();
                frmData.append('file', file);
                await conversationApi.changAvatarGroup(currentConversation, frmData);
            }

            message.success('Cập nhật thông tin thành công');
        } catch (error) {
        }
        setConfirmLoading(false);
        setIsModalVisible(false);


    }


    const handleInputChange = (e) => {
        setValue(e.target.value);
    }

    const handleGetfile = (file) => {
        setFile(file)
    }





    return (
        <div className='info_name-and-thumbnail'>

            <Modal
                title='Cập nhật cuộc trò chuyện'
                visible={isModalVisible}
                onOk={handleOk}
                onCancel={handleCancel}
                okText='Thay đổi'
                cancelText='Hủy'
                closable={false}
                confirmLoading={confirmLoading}
                okButtonProps={{
                    disabled:
                        (
                            (refInitValue.current === value && !file)
                            || value.trim().length === 0
                        )
                }}
            >

                <div className="update-profile_wrapper">


                    <div className="update-profile_upload">
                        <UploadAvatar
                            avatar={typeof conversation.avatar === 'string' ? conversation.avatar : ''}
                            getFile={handleGetfile}
                            isClear={isClear}
                        />
                    </div>


                    <div className="update-profile_input">
                        <Input
                            placeholder="Nhập tên mới"
                            onChange={handleInputChange}
                            value={value}
                        />
                    </div>
                </div>



            </Modal>
            <div className="info-thumbnail">
                <ConversationAvatar
                    isGroupCard={true}
                    totalMembers={conversation.totalMembers}
                    type={conversation.type}
                    avatar={conversation.avatar}
                    name={conversation.name}
                    avatarColor={conversation?.avatarColor}


                />
            </div>

            <div className="info-name-and-button">
                <div className='info-name'>
                    <span>{conversation.name}</span>
                </div>

                {conversation.type && (
                    <div className='info-button'>
                        <EditOutlined onClick={handleOnClick} />
                    </div>
                )}

            </div>

        </div>
    );
}

export default InfoNameAndThumbnail;