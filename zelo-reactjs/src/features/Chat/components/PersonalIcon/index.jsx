import { AntDesignOutlined, KeyOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Badge } from 'antd';
import PropTypes from 'prop-types';
import React from 'react';
import getSummaryName from 'utils/nameHelper';
import './style.scss';

PersonalIcon.propTypes = {
    avatar: PropTypes.string,
    isActive: PropTypes.bool,
    demention: PropTypes.number,
    common: PropTypes.bool,
    isHost: PropTypes.bool,
    name: PropTypes.string,
    color: PropTypes.string,
    noneUser: PropTypes.bool,

};

PersonalIcon.defaultProps = {
    avatar: '',
    isActive: false,
    demention: 48,
    common: true,
    isHost: false,
    name: '',
    color: '',
    noneUser: false,
};

function PersonalIcon(props) {
    const { avatar, isActive, demention, common, isHost, name, color, noneUser } = props;
    return (
        <div
            className={
                isActive && common
                    ? 'user-icon common'
                    : !isActive && common
                        ? 'user-icon no-online common'
                        : isActive && !common
                            ? 'user-icon'
                            : 'user-icon no-online'
            }>
            <Badge
                dot={isActive}
                offset={!isHost ? [-5, 40] : [-5, 32]}
                color='green'
                count={
                    isHost ? (
                        <KeyOutlined
                            style={{
                                backgroundColor: 'rgba(0,0,0,0.3)',
                                padding: '0.24rem',
                                borderRadius: '50%',
                                color: 'yellow',
                                fontSize: '1.2rem',
                            }}
                        />
                    ) : (
                        ''
                    )
                }>
                {
                    noneUser ? (
                        <Avatar
                            style={{
                                backgroundColor: '#87d068',
                            }}
                            size={demention}
                            icon={<UserOutlined />}
                        />
                    ) : (
                        avatar ? (
                            <Avatar size={demention} src={avatar} />
                        ) : (
                            <Avatar size={demention} style={{ backgroundColor: color ? color : '#4c92ff' }}>{getSummaryName(name)}</Avatar>
                        )
                    )
                }

            </Badge>
        </div>
    );
}

export default PersonalIcon;
