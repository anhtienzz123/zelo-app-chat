import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { defaultStyles, FileIcon } from 'react-file-icon';
import fileHelpers from 'utils/fileHelpers';
import ModalDetailMessageReply from '../../ModalDetailMessageReply';
import './style.scss';



ReplyMessage.propTypes = {
    replyMessage: PropTypes.object.isRequired,
};


function ReplyMessage({ replyMessage }) {

    const fileName = replyMessage.type === 'FILE' && fileHelpers.getFileName(replyMessage.content);
    const fileExtension = replyMessage.type === 'FILE' && fileHelpers.getFileExtension(fileName);

    const [visible, setVisible] = useState(false);

    const handleCancelModal = () => {
        setVisible(false);
    }

    const handleOpenModal = () => {
        setVisible(true)
    }


    return (

        <>
            {(replyMessage) && (
                <>
                    <ModalDetailMessageReply
                        visible={visible}
                        onCancel={handleCancelModal}
                        data={Object.keys(replyMessage).length > 0 && replyMessage}
                    />
                    <div
                        className='reply-message'
                        onClick={handleOpenModal}
                    >




                        <div className="vertical-bar" />

                        {
                            replyMessage.type === 'IMAGE' ? (
                                <div className="reply-message_logo">
                                    <img
                                        src={replyMessage.content}
                                    />
                                </div>
                            ) : replyMessage.type === 'VIDEO' ? (
                                <div className="reply-message_logo">
                                    <img
                                        src='https://www.pngitem.com/pimgs/m/501-5010215_vidia-logos-download-video-logo-png-transparent-png.png'
                                    />
                                </div>
                            ) : replyMessage.type === 'FILE' ? (
                                <div className="reply-message_logo">
                                    <div className="file_info-icon">
                                        <FileIcon
                                            extension={fileExtension}
                                            {...defaultStyles[fileExtension]}
                                        />
                                    </div>
                                </div>
                            ) : replyMessage.type === 'STICKER' ? (
                                <div className="reply-message_logo">
                                    <img
                                        src={replyMessage.content}
                                    />
                                </div>
                            ) : (
                                <div />
                            )
                        }

                        <div className="reply-message_info">
                            <div className="info-blog_info--top">
                                <strong className="reply-message_info--user">{replyMessage.user?.name}</strong>
                            </div>

                            <div className="reply-message_info--bottom">
                                {
                                    replyMessage.type === 'IMAGE' ? (
                                        <span>[Hình ảnh]</span>
                                    ) : replyMessage.type === 'VIDEO' ? (
                                        <span>[Video]</span>
                                    ) : replyMessage.type === 'FILE' ? (
                                        <span>[File] {fileName}</span>
                                    ) : replyMessage.type === 'STICKER' ? (
                                        <span>[Stikcer]</span>
                                    ) : replyMessage.type === 'HTML' ? (
                                        <span>[Văn bản]</span>
                                    ) : (
                                        replyMessage.content
                                    )
                                }
                            </div>
                        </div>
                    </div>
                </>

            )}

        </>
    );
}

export default ReplyMessage;