import { DownloadOutlined } from '@ant-design/icons';
import { Image, Modal } from 'antd';
import VIDEO_LOGO from 'assets/images/icon/video-logo.png';
import ModalVideoCustom from 'components/ModalVideoCustom';
import OverlayImage from 'components/OverlayImage';
import parse from 'html-react-parser';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { defaultStyles, FileIcon } from 'react-file-icon';
import fileHelpers from 'utils/fileHelpers';
import PersonalIcon from '../PersonalIcon';
import './style.scss';






ModalDetailMessageReply.propTypes = {
    visible: PropTypes.bool.isRequired,
    onCancel: PropTypes.func,
    data: PropTypes.object,
};

ModalDetailMessageReply.defaultProps = {
    onCancel: null,
    data: null
};


function ModalDetailMessageReply({ visible, onCancel, data }) {

    const { content, user, type, createdAt } = data;
    const [modalVisible, setModalVisible] = useState(false);
    const time = new Date(createdAt);

    const fileName = type === 'FILE' ? fileHelpers.getFileName(content) : '';
    const fileExtension = type === 'FILE' ? fileHelpers.getFileExtension(fileName) : '';


    const handleCancel = () => {
        console.log('asdfsdafas')
        if (onCancel) {
            onCancel();
        }
    }

    const handleOnClickDownLoad = () => {
        window.open(content, '_blank');
    };

    return (


        <Modal
            visible={visible}
            footer={null}
            onCancel={handleCancel}
            closable={false}

        >
            <div className="modal-detail-reply">



                <div className="reply-info">

                    <PersonalIcon
                        avatar={user?.avatar}
                        name={user?.name}
                    />

                    <div className="time-user">
                        <div className="reply-name">
                            Tên: <span>{user?.name}</span>
                        </div>

                        <div className="reply-time">
                            Gửi lúc:&nbsp;
                            <span>
                                {`0${time.getHours()}`.slice(
                                    -2
                                )}
                                :
                                {`0${time.getMinutes()}`.slice(
                                    -2
                                )}
                            </span>
                            &nbsp;
                            <span>
                                {`0${time.getDate()}`.slice(
                                    -2
                                )}
                                /
                                {`0${time.getMonth()}`.slice(
                                    -2
                                )}
                                /
                                {`${time.getFullYear()}`}

                            </span>
                        </div>
                    </div>

                </div>

                {type === 'TEXT' && (

                    <div className="reply-item">{content}</div>
                )}

                {type === 'IMAGE' && (

                    <div className="reply-item">
                        <Image
                            src={content}
                            preview={{ mask: <OverlayImage /> }}
                        />
                    </div>

                )}

                {type === 'STICKER' && (

                    <div className="reply-item center">
                        <Image
                            src={content}
                            preview={{ mask: null, visible: false }}
                        />
                    </div>

                )}

                {type === 'VIDEO' && (

                    <div className="reply-item smoker video">
                        <Image
                            src={VIDEO_LOGO}
                            preview={{ mask: null, visible: false }}
                            onClick={() => setModalVisible(true)}
                        />

                        <ModalVideoCustom
                            isVisible={modalVisible}
                            url={content}
                            onClose={() => setModalVisible(false)}
                        />
                    </div>

                )}


                {type === 'FILE' && (

                    <div className='file_info-wrapper-reply'>
                        <div className="file_info">
                            <div className="file_info-icon">
                                <FileIcon
                                    extension={fileExtension}
                                    {...defaultStyles[fileExtension]}
                                />
                            </div>

                            <div className="file_info-name">
                                {fileName}
                            </div>
                        </div>

                        <div className="icon-download" onClick={handleOnClickDownLoad}>
                            <DownloadOutlined />
                        </div>
                    </div>

                )}

                {type === 'HTML' && (

                    <div className="reply-item">{parse(content)}</div>

                )}
            </div>
        </Modal>

    );
}

export default ModalDetailMessageReply;