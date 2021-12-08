import { DownloadOutlined } from '@ant-design/icons';
import { Image, Modal } from 'antd';
import ModalVideoCustom from 'components/ModalVideoCustom';
import OverlayImage from 'components/OverlayImage';
import parse from 'html-react-parser';
import PropTypes from 'prop-types';
import React from 'react';
import { defaultStyles, FileIcon } from 'react-file-icon';
import fileHelpers from 'utils/fileHelpers';
import PinItem from '../PinItem';
import './style.scss';


ModalDetailMessagePin.propTypes = {
    visible: PropTypes.bool,
    message: PropTypes.object,
    onClose: PropTypes.func,
};

ModalDetailMessagePin.defaultProps = {
    visible: false,
    message: {},
    onClose: null
};

function ModalDetailMessagePin({ visible, message, onClose }) {

    const fileName = message.type === 'FILE' ? fileHelpers.getFileName(message.content) : '';
    const fileExtension = message.type === 'FILE' ? fileHelpers.getFileExtension(fileName) : '';

    const handleOnClose = () => {
        if (onClose) {
            onClose()
        }
    }


    const handleOnClickDownLoad = () => {
        window.open(message.content, '_blank');
    };


    return (
        <div className='modal-detail-message-pin'>
            {(message.type === 'TEXT' || message.type === 'HTML') && (

                <Modal
                    visible={visible}
                    footer={null}
                    onCancel={handleOnClose}
                    closable={false}


                >
                    <PinItem
                        message={message}
                    >
                        {message.type === 'TEXT' ? (
                            message.content
                        ) : (
                            parse(message.content)
                        )}

                    </PinItem>

                </Modal>
            )}


            {message.type === 'IMAGE' && (

                <Image
                    preview={
                        {
                            visible: visible,
                            onVisibleChange: (visible, prevVisible) => {
                                if (onClose) {
                                    onClose()
                                }
                            },
                            mask: <OverlayImage />
                        }
                    }
                    src={message.content}
                    style={{ display: 'none' }}
                />

            )}


            {message.type === 'FILE' && (


                <Modal
                    visible={visible}
                    footer={null}
                    onCancel={handleOnClose}
                    closable={false}

                >
                    <PinItem
                        message={message}
                    >
                        <div className='file_info-wrapper-pin'>
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

                    </PinItem>

                </Modal>

            )}


            {message.type === 'VIDEO' && (


                <ModalVideoCustom
                    isVisible={visible}
                    url={message.content}
                    onClose={handleOnClose}
                />

            )}




        </div>
    );
}

export default ModalDetailMessagePin;