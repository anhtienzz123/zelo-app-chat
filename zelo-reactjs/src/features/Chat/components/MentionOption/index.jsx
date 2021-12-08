import React from 'react';
import PropTypes from 'prop-types';
import './style.scss';
import { Mentions } from 'antd';
import PersonalIcon from '../PersonalIcon'

MentionOption.propTypes = {
    value: PropTypes.string.isRequired,
    user: PropTypes.object,
};

MentionOption.defaultProps = {
    user: {},
};



function MentionOption({ value }) {

    const { Option } = Mentions;
    return (
        <Option value={value}>
            <div className='mention-option'>

                <div className='icon-user-item'>
                    <PersonalIcon
                        demention={24}
                        avatar={user.avatar}
                        name={user.name}
                    />
                </div>

                <div className='name-user-item'>
                    {user.name}
                </div>
            </div>


        </Option>

    );
}

export default MentionOption;