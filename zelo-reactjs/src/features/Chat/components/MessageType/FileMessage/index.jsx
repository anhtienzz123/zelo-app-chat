import React from 'react';
import PropTypes from 'prop-types';
import { DownloadOutlined } from '@ant-design/icons';
import fileHelpers from 'utils/fileHelpers';
import { FileIcon, defaultStyles } from 'react-file-icon';
import './style.scss';
FileMessage.propTypes = {
    content: PropTypes.string.isRequired,
    dateAt: PropTypes.object.isRequired,
    isSeen: PropTypes.bool,
};

FileMessage.defaultProps = {
    isSeen: false

};

function FileMessage({ content, children, dateAt, isSeen }) {

    const handleOnClickDownLoad = () => {
        window.open(content, '_blank');
    };

    const handleOnClickShare = () => {

    }

    const fileName = fileHelpers.getFileName(content);
    const fileExtension =
        fileHelpers.getFileExtension(fileName);


    return (
        <>
            <div className='file_info-wrapper message'>
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


            <div className="time-and-last_view">

                <div className="time-send">
                    <span>
                        {`0${dateAt.getHours()}`.slice(
                            -2
                        )}
                        :
                        {`0${dateAt.getMinutes()}`.slice(
                            -2
                        )}
                    </span>

                </div>

                {
                    isSeen && (
                        <div className="is-seen-message">
                            Đã xem
                        </div>
                    )

                }
            </div>

            {children}



        </>
    );
}

export default FileMessage;