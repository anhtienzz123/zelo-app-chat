import React from 'react';
import PropTypes from 'prop-types';
import { useParams } from 'react-router-dom';
import { useHistory } from 'react-router-dom';

JoinFromLink.propTypes = {

};

function JoinFromLink(props) {
    const { conversationId } = useParams();
    const history = useHistory();
    history.push({
        pathname: '/chat',
        state: { conversationId }
    })

    return (
        <div>
            {conversationId}
        </div>
    );
}

export default JoinFromLink;