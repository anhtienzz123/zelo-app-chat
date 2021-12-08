import React from 'react';
import {
    AliwangwangOutlined,
    FacebookOutlined,
    UsergroupAddOutlined,
} from '@ant-design/icons';
import { Menu, Layout } from 'antd';
import SubMenu from 'antd/lib/menu/SubMenu';
import { Link } from 'react-router-dom';

const { Sider } = Layout;

SiderBar.propTypes = {};

function SiderBar(props) {
    return (
        <Sider collapsible>
            <div className="logo" />
            <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
                <Menu.Item key="1" icon={<UsergroupAddOutlined />}>
                    <Link to="/admin"> Quản lý người dùng</Link>
                </Menu.Item>

                <Menu.Item key="2" icon={<AliwangwangOutlined />}>
                    <Link to="/admin/stickers"> Quản lý sticker</Link>
                </Menu.Item>
            </Menu>
        </Sider>
    );
}

export default SiderBar;
