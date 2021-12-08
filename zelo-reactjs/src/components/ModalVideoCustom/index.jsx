import PropTypes from 'prop-types';
import React from 'react';
import ModalVideo from 'react-modal-video';


ModalVideoCustom.propTypes = {
    isVisible: PropTypes.bool,
    url: PropTypes.string,
    onClose: PropTypes.func,
};

ModalVideoCustom.defaultProps = {
    isVisible: false,
    url: '',
    onClose: null
};

function ModalVideoCustom({ isVisible, onClose, url }) {

    const handleOnClose = () => {
        if (onClose) {
            onClose()
        }
    }
    return (
        <React.Fragment>
            <ModalVideo
                channel="custom"
                autoplay
                url={url}
                isOpen={isVisible}
                onClose={handleOnClose}
                animationSpeed
                ratio="16:9"
            />
        </React.Fragment>
    );
}

export default ModalVideoCustom;