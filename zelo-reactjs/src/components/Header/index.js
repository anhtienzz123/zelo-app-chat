import React from 'react';
import PropTypes from 'prop-types';
import { Menu } from 'antd';
import { MailOutlined, MessageOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';

const { SubMenu } = Menu;
Header.propTypes = {};

function Header(props) {
    return (
        <div>
            <Menu mode="horizontal">
                <Menu.Item key="home" icon={<MailOutlined />}>
                    <Link to="/"> Trang chủ</Link>
                </Menu.Item>
                <Menu.Item key="chat" icon={<MessageOutlined />}>
                    <Link to="/chat"> Chat</Link>
                </Menu.Item>
            </Menu>
        </div>
    );
}

export default Header;
