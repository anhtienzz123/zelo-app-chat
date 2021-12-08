import { FontColorsOutlined, PlaySquareOutlined } from '@ant-design/icons';
import { Image, Tag } from 'antd';
import OverlayImage from 'components/OverlayImage';
import PropTypes from 'prop-types';
import React from 'react';
import { defaultStyles, FileIcon } from 'react-file-icon';
import fileHelpers from 'utils/fileHelpers';
import './style.scss';
TypeMessagePin.propTypes = {
    type: PropTypes.string,
    content: PropTypes.string,
    name: PropTypes.string,
};


TypeMessagePin.defaultProps = {
    type: '',
    content: '',
    name: ''
};



function TypeMessagePin({ type, content, name }) {


    const fileName = type === 'FILE' ? fileHelpers.getFileName(content) : '';
    const fileExtension = type === 'FILE' ? fileHelpers.getFileExtension(fileName) : '';

    return (
        <div className='type-pin-message'>
            {
                type === 'TEXT' && (
                    <div className='text-pin'>{`${name}: ${content}`}</div>
                )
            }

            {
                type === 'IMAGE' && (
                    <div className='type-pin-message_IMAGE'>
                        <div className="type-pin-message_name">
                            {name}:&nbsp;
                        </div>

                        <div className="type-pin-message_des">
                            <Image
                                height={20}
                                src={content}
                                preview={{ mask: <OverlayImage />, visible: false }}
                            />
                        </div>

                    </div>

                )
            }

            {
                type === 'HTML' && (
                    <div className='type-pin-message_HTML'>
                        <div className="type-pin-message_name">
                            {name}:&nbsp;
                        </div>

                        <div className="type-pin-message_des">
                            <FontColorsOutlined /> văn bản
                        </div>
                    </div>
                )
            }

            {
                type === 'VIDEO' && (
                    <div className='type-pin-message_VIDEO'>
                        <div className="type-pin-message_name">
                            {name}:&nbsp;
                        </div>

                        <div className="type-pin-message_des">
                            video&nbsp;<PlaySquareOutlined />
                        </div>
                    </div>
                )
            }

            {
                type === 'FILE' && (
                    <div className='type-pin-message_FILE'>
                        <div className="type-pin-message_name">
                            {name}:&nbsp;
                        </div>

                        <div className="type-pin-message_des_FILE">
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

                    </div>
                )
            }
        </div>
    );
}

export default TypeMessagePin;