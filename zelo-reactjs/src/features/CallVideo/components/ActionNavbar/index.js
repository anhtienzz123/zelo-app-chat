import React from 'react';
import PropTypes from 'prop-types';
import { Menu } from 'antd';
import {
    AudioOutlined,
    CloseOutlined,
    ShareAltOutlined,
    VideoCameraOutlined,
} from '@ant-design/icons';

ActionNavbar.propTypes = {};

function ActionNavbar({ onToggleVideo, onToggleAudio, onShareScreen }) {
    const handleToggleVideo = () => {
        if (onToggleVideo) onToggleVideo();
    };

    const handleToggleAudio = () => {
        if (onToggleVideo) onToggleAudio();
    };

    const handleShareScreen = () => {
        if (onShareScreen) onShareScreen();
    };

    return (
        <div
            className="action-navbar"
            style={{ width: '40%', margin: '0 auto' }}
        >
            <Menu mode="horizontal">
                <Menu.Item
                    key="toggle-video"
                    icon={<VideoCameraOutlined />}
                    onClick={handleToggleVideo}
                >
                    Tắt video
                </Menu.Item>

                <Menu.Item
                    key="toggle-audio"
                    icon={<AudioOutlined />}
                    onClick={handleToggleAudio}
                >
                    Tắt audio
                </Menu.Item>

                <Menu.Item
                    key="toggle-share-screen"
                    icon={<ShareAltOutlined />}
                    onClick={handleShareScreen}
                >
                    Share màn hình
                </Menu.Item>

                {/* <Menu.Item key='close-call-video' icon={<CloseOutlined />}>
                    Kết thúc
                </Menu.Item> */}
            </Menu>
        </div>
    );
}

export default ActionNavbar;
