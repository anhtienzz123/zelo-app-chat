import {
    CheckCircleOutlined,
    CloseCircleOutlined,
    ExclamationCircleOutlined,
    MinusCircleOutlined,
    SyncOutlined,
} from '@ant-design/icons';
import { Tag } from 'antd';
import PropTypes from 'prop-types';
import React from 'react';

TagCustom.propTypes = {
    title: PropTypes.string,
    color: PropTypes.string,
};

TagCustom.defaultProps = {
    title: '',
    color: 'success',
};

const iconMap = new Map();

iconMap.set('success', <CheckCircleOutlined />);
iconMap.set('processing', <SyncOutlined spin />);
iconMap.set('error', <CloseCircleOutlined />);
iconMap.set('warning', <ExclamationCircleOutlined />);
iconMap.set('stop', <MinusCircleOutlined />);

function TagCustom({ title, color }) {
    const icon = iconMap.get(color);
    return (
        <Tag color={color} style={{ fontWeight: 'bold' }} icon={icon}>
            {title}
        </Tag>
    );
}

export default TagCustom;
