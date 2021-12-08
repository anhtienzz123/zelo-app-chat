import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

MyVideo.propTypes = {
    stream: PropTypes.object,
};

function MyVideo({ userId, stream }) {
    const ref = useRef(null);

    useEffect(() => {
        console.log('stream render: ', stream);
        if (stream) {
            ref.current.srcObject = stream;
            ref.current.play();
        }
    }, []);

    return (
        <div>
            <h1>userId: {userId}</h1>
            <video
                //class='local-video mirror-mode'
                // id='local'
                ref={ref}
                volume="0"
                style={{ width: '100%' }}
                autoPlay
                muted
            ></video>
        </div>
    );
}

export default MyVideo;
