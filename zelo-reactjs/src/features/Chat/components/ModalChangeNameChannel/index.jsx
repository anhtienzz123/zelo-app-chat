import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Input, Modal } from 'antd';

ModalChangeNameChannel.propTypes = {
    visible: PropTypes.bool,
    onOk: PropTypes.func,
    onCancel: PropTypes.func,
    initialValue: PropTypes.string,
};


ModalChangeNameChannel.defaultProps = {
    visible: false,
    onOk: null,
    onCancel: null,
    initialValue: ''
};


function ModalChangeNameChannel({ visible, onOk, onCancel, initialValue }) {

    const [value, setValue] = useState('');

    useEffect(() => {
        setValue(initialValue)
    }, [initialValue, visible])
    const handleOnchange = (e) => {
        setValue(e.target.value);
    }

    const handleCancel = () => {
        if (onCancel) {
            onCancel();
            setValue('');
        }
    }


    const handleOk = () => {
        if (onOk) {
            onOk(value);
        }
    }


    return (
        <Modal
            title="Đổi tên Channel"
            visible={visible}
            onOk={handleOk}
            onCancel={handleCancel}
            onText='Thay đổi'
            cancelText='Hủy'
            okButtonProps={{ disabled: value.trim().length === 0 }}
        >
            <Input
                placeholder="Nhập tên mới"
                allowClear
                value={value}
                onChange={handleOnchange}

            />
        </Modal>
    );
}

export default ModalChangeNameChannel;