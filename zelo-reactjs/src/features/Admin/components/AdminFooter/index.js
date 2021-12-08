import React from 'react';
import PropTypes from 'prop-types';
import { Layout } from 'antd';

const { Footer } = Layout;

AdminFooter.propTypes = {};

function AdminFooter(props) {
    return (
        <Footer style={{ textAlign: 'center', background: '#fff' }}>
            Ant Design ©2018 Created by Ant UED
        </Footer>
    );
}

export default AdminFooter;
