import { CloseCircleOutlined } from '@ant-design/icons';
import {
    Button,
    Col,
    Divider,
    message,
    Modal,
    notification,
    Row,
    Tag,
    Typography,
} from 'antd';
import loginApi from 'api/loginApi';
import IMAGE_ACCOUNT_PAGE from 'assets/images/account/account-bg.png';
import InputField from 'customfield/InputField';
import { setLoading } from 'features/Account/accountSlice';
import { registryValues } from 'features/Account/initValues';
import { FastField, Form, Formik } from 'formik';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router';
import { Link } from 'react-router-dom';

const RESEND_OTP_TIME_LIMIT = 60;
const { Text, Title } = Typography;
function RegistryPage(props) {
    const dispatch = useDispatch();
    let resendOTPTimerInterval;
    const [isError, setError] = useState('');
    const history = useHistory();
    //set time counter
    const [counter, setCounter] = useState(0);
    //set OTP value
    const [isSubmit, setIsSubmit] = useState(false);

    const openNotification = (mes) => {
        const args = {
            message: mes ? mes : 'Xác thực OTP để hoàn tất việc đăng ký',
        };
        notification.info(args);
    };

    function success() {
        Modal.success({
            content: 'Đăng ký thành công !',
            onOk: () => {
                history.push('/account/login');
            },
            onCancel: () => {
                history.push('/account/login');
            },
        });
    }

    const handleRegistry = async (values) => {
        const { name, username, password, otpValue } = values;
        dispatch(setLoading(true));
        if (isSubmit) {
            handleConfirmAccount(username, otpValue);
        } else {
            await loginApi
                .fetchUser(username)
                .then((value) => {
                    message.error('Email hoặc số điện thoại đã được đăng ký');
                })
                .catch(async () => {
                    try {
                        await loginApi.registry(name, username, password);
                        setIsSubmit(true);
                        openNotification();
                        setCounter(RESEND_OTP_TIME_LIMIT);
                        startResendOTPTimer();
                    } catch (error) {
                        message.error('Đã có lỗi xảy ra');
                    }
                });
        }

        dispatch(setLoading(false));
    };

    //start time from 30 to '0'
    const startResendOTPTimer = () => {
        if (resendOTPTimerInterval) {
            clearInterval(resendOTPTimerInterval);
        }
        resendOTPTimerInterval = setInterval(() => {
            if (counter <= 0) {
                clearInterval(resendOTPTimerInterval);
            } else {
                setCounter(counter - 1);
            }
        }, 1000);
    };

    const handleResendOTP = async (username) => {
        setCounter(RESEND_OTP_TIME_LIMIT);
        startResendOTPTimer();

        dispatch(setLoading(true));
        try {
            await loginApi.forgot(username);
            openNotification(`Đã gửi lại mã OTP đến  ${username}`);
        } catch (error) {}
        dispatch(setLoading(false));
    };

    //useEffect khi counter thay đổi
    useEffect(() => {
        startResendOTPTimer();
        return () => {
            if (resendOTPTimerInterval) {
                clearInterval(resendOTPTimerInterval);
            }
        };
    }, [counter]);

    const handleConfirmAccount = async (username, otp) => {
        try {
            await loginApi.confirmAccount(username, otp);
            success();
        } catch (error) {
            message.error('OTP không hợp lệ');
        }
    };

    return (
        <div className="account-common-page">
            <div className="account-wrapper">
                <div className="account_left">
                    <img src={IMAGE_ACCOUNT_PAGE} alt="zelo_forgot" />
                </div>
                <div className="account_right">
                    <Title level={2} style={{ textAlign: 'center' }}>
                        <Text style={{ color: '#4d93ff' }}>Đăng Ký</Text>
                    </Title>
                    <Divider />
                    <div className="form-account">
                        <Formik
                            initialValues={{ ...registryValues.initial }}
                            onSubmit={(values) => handleRegistry(values)}
                            validationSchema={
                                isSubmit
                                    ? registryValues.validationSchemaWithOTP
                                    : registryValues.validationSchema
                            }
                            enableReinitialize={true}
                        >
                            {(formikProps) => {
                                return (
                                    <Form>
                                        <Row gutter={[0, 16]}>
                                            {isSubmit ? (
                                                <>
                                                    <Col span={24}>
                                                        <FastField
                                                            name="otpValue"
                                                            component={
                                                                InputField
                                                            }
                                                            type="text"
                                                            title="Xác nhận OTP"
                                                            placeholder="Mã OTP có 6 kí tự"
                                                            maxLength={50}
                                                            titleCol={24}
                                                            inputCol={24}
                                                        />
                                                    </Col>

                                                    <Col span={24}>
                                                        <Button
                                                            onClick={() =>
                                                                handleResendOTP(
                                                                    formikProps
                                                                        .values
                                                                        .username
                                                                )
                                                            }
                                                            type="primary"
                                                            block
                                                            disabled={
                                                                counter > 0
                                                                    ? true
                                                                    : false
                                                            }
                                                        >
                                                            Gửi lại OTP{' '}
                                                            {`${
                                                                counter > 0
                                                                    ? `sau ${counter}`
                                                                    : ''
                                                            }`}
                                                        </Button>
                                                    </Col>
                                                </>
                                            ) : (
                                                <>
                                                    <Col span={24}>
                                                        <FastField
                                                            name="name"
                                                            component={
                                                                InputField
                                                            }
                                                            type="text"
                                                            title="Tên "
                                                            placeholder="Ví dụ: Trần Hoàng Phúc"
                                                            maxLength={50}
                                                            titleCol={24}
                                                            inputCol={24}
                                                        />
                                                    </Col>
                                                    <Col span={24}>
                                                        <FastField
                                                            name="username"
                                                            component={
                                                                InputField
                                                            }
                                                            type="text"
                                                            title="Tài khoản"
                                                            placeholder="Nhập email/SĐT đăng ký"
                                                            maxLength={50}
                                                            titleCol={24}
                                                            inputCol={24}
                                                        />
                                                    </Col>

                                                    <Col span={24}>
                                                        <FastField
                                                            name="password"
                                                            component={
                                                                InputField
                                                            }
                                                            type="password"
                                                            title="Mật khẩu"
                                                            placeholder="Mật khẩu ít nhất 8 kí tự"
                                                            maxLength={200}
                                                            titleCol={24}
                                                            inputCol={24}
                                                        />
                                                    </Col>

                                                    <Col span={24}>
                                                        <FastField
                                                            name="passwordconfirm"
                                                            component={
                                                                InputField
                                                            }
                                                            type="password"
                                                            title=" Xác nhận mật khẩu"
                                                            placeholder="Gõ lại mật khẩu vừa nhập"
                                                            maxLength={200}
                                                            titleCol={24}
                                                            inputCol={24}
                                                        />
                                                    </Col>
                                                </>
                                            )}

                                            {isError ? (
                                                <Col span={24}>
                                                    <Tag
                                                        color="error"
                                                        style={{
                                                            fontWeight: 'bold',
                                                        }}
                                                        icon={
                                                            <CloseCircleOutlined />
                                                        }
                                                    >
                                                        {isError}
                                                    </Tag>
                                                </Col>
                                            ) : (
                                                ''
                                            )}

                                            <Col span={24}>
                                                <Button
                                                    htmlType="submit"
                                                    type="primary"
                                                    block
                                                >
                                                    Xác nhận
                                                </Button>
                                            </Col>
                                        </Row>
                                    </Form>
                                );
                            }}
                        </Formik>
                    </div>

                    <Divider />

                    <div className="addtional-link">
                        <Link to="/">Trang chủ</Link>
                        <Link to="/account/login">Đăng nhập</Link>
                        <Link to="/account/forgot">Quên mật khẩu ?</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default RegistryPage;
