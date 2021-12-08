import React from 'react';
import PropTypes from 'prop-types';
import { Divider, Typography } from 'antd';

const { Text } = Typography;

Footer.propTypes = {};

function Footer(props) {
    return (
        <div style={{ textAlign: 'center' }}>
            <Divider></Divider>
            <Text strong style={{ fontSize: '20px' }}>
                Footer
            </Text>
        </div>
    );
}

export default Footer;
