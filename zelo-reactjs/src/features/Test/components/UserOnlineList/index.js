import React from 'react';
import PropTypes from 'prop-types';
import { Divider } from 'antd';

UserOnlineList.propTypes = {
    userOnlines: PropTypes.array,
};

UserOnlineList.defaultProps = {
    userOnlines: [],
};

function UserOnlineList({ userOnlines }) {
    return (
        <div>
            {userOnlines.map((userEle, index) => (
                <div key={index}>
                    <p>Id: {userEle._id}</p>
                    <p>Name: {userEle.name}</p>
                    <Divider></Divider>
                </div>
            ))}
        </div>
    );
}

export default UserOnlineList;
