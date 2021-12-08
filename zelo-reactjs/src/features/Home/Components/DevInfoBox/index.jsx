import { GithubOutlined, MailTwoTone } from '@ant-design/icons';
import PropTypes from 'prop-types';
import React from 'react';

DevInfoBox.propTypes = {
    data: PropTypes.object,
};


DevInfoBox.defaultProps = {
    data: {}
};

function DevInfoBox({ data }) {
    return (
        <div className="box">
            <div className="user">
                <img src={data.image} />
                <h3>{data.name}</h3>
                <div className="contact-info">
                    <span><MailTwoTone />&nbsp;Email: {data.mail}</span>
                    <span><GithubOutlined />&nbsp;Github: <a href={data.github}>{data.github}</a></span>

                </div>
            </div>
        </div>
    )
}

export default DevInfoBox;
