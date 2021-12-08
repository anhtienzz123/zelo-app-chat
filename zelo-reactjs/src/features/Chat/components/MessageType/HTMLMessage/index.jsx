import React from 'react';
import PropTypes from 'prop-types';
import parse from 'html-react-parser'
HTMLMessage.propTypes = {
    content: PropTypes.string.isRequired,
    isSeen: PropTypes.bool,
};

HTMLMessage.defaultProps = {
    content: PropTypes.string.isRequired,
    isSeen: false,
};

function HTMLMessage({ content, children, isSeen, dateAt }) {
    return (
        <div>
            {parse(content)}


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


        </div>
    );
}

export default HTMLMessage;