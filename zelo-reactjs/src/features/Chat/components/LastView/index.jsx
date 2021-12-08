import { Avatar } from 'antd';
import AvatarCustom from 'components/AvatarCustom';
import PropTypes from 'prop-types';
import React from 'react';
import './style.scss';

LastView.propTypes = {
    lastView: PropTypes.array,
};

LastView.defaultProps = {
    lastView: [],
};


function LastView({ lastView }) {
    return (
        <Avatar.Group
            maxCount={5}
            size="small"
            maxStyle={{ color: '#f56a00', backgroundColor: '#fde3cf' }}
        >


            {
                lastView.map((ele, index) => (
                    <AvatarCustom
                        key={index}
                        src={ele.avatar}
                        name={ele.name}
                    />
                ))
            }

        </Avatar.Group>
    );
}

export default LastView;