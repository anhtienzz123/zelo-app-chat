import { ExclamationCircleOutlined } from '@ant-design/icons';
import {
    Form,
    Input, message, Modal
} from 'antd';
import meApi from 'api/meApi';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import generateCode from 'utils/generateCode';

ModalChangePassword.propTypes = {
    visible: PropTypes.bool.isRequired,
    onCancel: PropTypes.func,
    onSaveCodeRevoke: PropTypes.func,
};

ModalChangePassword.defaultProps = {
    onCancel: null,
    onSaveCodeRevoke: null
};

function ModalChangePassword({ onCancel, visible, onSaveCodeRevoke }) {
    const [form] = Form.useForm();
    const [confirmLoading, setConfirmLoading] = useState(false);
    const { confirm } = Modal;

    const handleCancel = (e) => {
        if (onCancel) {
            onCancel();
        }
    }

    const handleOk = async () => {
        setConfirmLoading(true);
        form.validateFields()
            .then(async ({ oldpassword, password }) => {
                console.log('values :', oldpassword, password);
                try {
                    await meApi.changePasswod(oldpassword, password);

                    message.success('Đổi mật khẩu thành công');
                    showPromiseConfirm(password);
                    form.resetFields();
                    handleCancel();

                } catch (error) {
                    message.error('Mật khẩu không đúng');
                }
            })
            .catch(info => {
                console.log('Validate Failed:', info);
            });
        setConfirmLoading(false);
    }

    const handleRevokeToken = async (password) => {
        try {
            const code = generateCode(20);
            if (onSaveCodeRevoke) {
                onSaveCodeRevoke(code);
            }
            const response = await meApi.revokeToken(password, code);
            const { token, refreshToken } = response;
            localStorage.setItem('token', token);
            localStorage.setItem('refreshToken', refreshToken);


            message.success('Đăng xuất khỏi các thiết bị thành công');
        } catch (error) {
            message.error('Đã có lỗi xảy ra');

        }
    }

    function showPromiseConfirm(password) {
        confirm({
            title: 'Bạn có muốn đăng xuất ra khỏi các thiết bị khác ? ',
            icon: <ExclamationCircleOutlined />,
            content: 'Khi chọn "Đồng ý" tất cả các tài khoản ở các thiết bị khác sẻ tự động đăng xuất',
            onOk: () => handleRevokeToken(password),
            okText: 'Đồng ý',
            cancelText: 'Hủy'
        });
    }

    const formItemLayout = {
        labelCol: {
            xs: { span: 24 },
            sm: { span: 8 },
        },
        wrapperCol: {
            xs: { span: 24 },
            sm: { span: 16 },
        },
    };


    return (
        <Modal
            title="Đổi mật khẩu"
            visible={visible}
            onOk={handleOk}
            onCancel={handleCancel}
            confirmLoading={confirmLoading}
            okText='Thay đổi'
            cancelText='Hủy'

        >
            <Form
                {...formItemLayout}
                form={form}
                name="changepassword"
                initialValues={{
                    oldpassword: '',
                    password: '',
                    confirm: ''
                }}
                scrollToFirstError
            >
                <Form.Item
                    name="oldpassword"
                    label="Mật khẩu hiện tại"
                    rules={[
                        {
                            required: true,
                            message: 'Vui lòng nhập mật khẩu cũ !',
                        },

                    ]}
                    hasFeedback
                >
                    <Input.Password />
                </Form.Item>

                <Form.Item
                    name="password"
                    label="Mật khẩu"
                    rules={[
                        {
                            required: true,
                            message: 'Vui lòng nhập mật khẩu!',
                        },
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                if (value && value.trim().length < 8) {
                                    return Promise.reject(new Error('Mật khẩu phải có ít nhất 8 kí tự'));

                                }
                                if (value && getFieldValue('oldpassword').trim() === value) {
                                    return Promise.reject(new Error('Mật khẩu mới không trùng với mật khẩu cũ'));

                                }
                                return Promise.resolve();

                            },
                        }),
                    ]}
                    hasFeedback
                >
                    <Input.Password />
                </Form.Item>

                <Form.Item
                    name="confirm"
                    label="Nhập lại mật khẩu"
                    dependencies={['password']}
                    hasFeedback
                    rules={[
                        {
                            required: true,
                            message: 'Vui lòng nhập lại mật khẩu',
                        },
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                if (!value || getFieldValue('password') === value) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(new Error('2 mật khẩu nhập không khớp với nhau'));
                            },
                        }),
                    ]}
                >
                    <Input.Password />
                </Form.Item>
            </Form>
        </Modal>
    );
}

export default ModalChangePassword;