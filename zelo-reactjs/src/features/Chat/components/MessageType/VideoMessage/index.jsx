import React from 'react';
import PropTypes from 'prop-types';
import MESSAGE_STYLE from 'constants/MessageStyle/messageStyle';
VideoMessage.propTypes = {
    content: PropTypes.string,
    dateAt: PropTypes.object,
    isSeen: PropTypes.bool,
};

VideoMessage.defaultProps = {
    content: '',
    dateAt: null,
    isSeen: false
};

function VideoMessage({ content, children, dateAt, isSeen }) {
    return (
        <>
            <div className="message-video-wrapper">
                <div className="message-video-main">
                    <video
                        controls
                        style={MESSAGE_STYLE.videoStyle}
                    >
                        <source
                            src={content}
                            type="video/mp4"
                        />
                    </video>
                </div>
                {children}

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

        </>
    );
}

export default VideoMessage;