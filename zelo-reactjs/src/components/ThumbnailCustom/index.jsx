import {
    PlayCircleFilled
} from '@ant-design/icons';
import React from 'react';
import PropTypes from 'prop-types';
import './style.scss';

ThumbnailCustom.propTypes = {
    url: PropTypes.string.isRequired,
    onVisibleVideoModal: PropTypes.func,
    height: PropTypes.number,
    width: PropTypes.number,
};

ThumbnailCustom.defaultProps = {
    url: PropTypes.string.isRequired,
    onVisibleVideoModal: null,
    height: 80,
    width: 80
};

function ThumbnailCustom({ url, onVisibleVideoModal, height, width }) {

    function handlePlayVideo() {
        if (onVisibleVideoModal) {
            onVisibleVideoModal(url);
        }
    }

    return (
        <div
            style={{ height: `${height}px`, width: `${width}px` }}
            className='thumbnail-video_custom' onClick={handlePlayVideo}
        >
            <video >
                <source
                    height={height}
                    width={width}
                    src={url}
                    type="video/mp4"
                />
            </video>

            <div className="overlay" >
                <PlayCircleFilled />
            </div>
        </div>
    );
}

export default ThumbnailCustom;