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
import { forgotValues } from 'features/Account/initValues';
import { FastField, Form, Formik } from 'formik';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router';
import { Link } from 'react-router-dom';

const RESEND_OTP_TIME_LIMIT = 60;
const { Text, Title } = Typography;
function ForgotPage(props) {
    const dispatch = useDispatch();
    let resendOTPTimerInterval;
    const [isError, setError] = useState('');
    const history = useHistory();
    //set time counter
    const [counter, setCounter] = useState(0);
    //set OTP value
    const [account, setAccount] = useState(null);
    const [isSubmit, setIsSubmit] = useState(false);

    const openNotification = (mes) => {
        const args = {
            message: `Đã gửi OTP đến ${mes}`,
        };
        notification.info(args);
    };

    function success() {
        Modal.success({
            content: 'Cập nhật tài khoản thành công !',
            onOk: () => {
                history.push('/account/login');
            },
            onCancel: () => {
                history.push('/account/login');
            },
        });
    }

    const handleForgot = async (values) => {
        dispatch(setLoading(true));
        const { username, password, otpValue } = values;

        if (isSubmit) {
            try {
                if (account.isActived) {
                    await loginApi.confirmPassword(
                        username,
                        otpValue,
                        password
                    );
                } else {
                    await loginApi.confirmAccount(username, otpValue);
                    await loginApi.confirmPassword(
                        username,
                        otpValue,
                        password
                    );
                }
                success();
            } catch (error) {
                message.error('OTP không hợp lệ');
            }
        } else {
            try {
                setCounter(RESEND_OTP_TIME_LIMIT);
                startResendOTPTimer();
                const account = await loginApi.fetchUser(username);
                setAccount(account);
                await loginApi.forgot(username);
                openNotification(username);
                setIsSubmit(true);
            } catch (error) {
                message.error('Tài khoản không tồn tại');
            }
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

    //useEffect khi counter thay đổi
    useEffect(() => {
        startResendOTPTimer();
        return () => {
            if (resendOTPTimerInterval) {
                clearInterval(resendOTPTimerInterval);
            }
        };
    }, [counter]);

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

    return (
        <div className="account-common-page">
            <div className="account-wrapper">
                <div className="account_left">
                    <img src={IMAGE_ACCOUNT_PAGE} alt="zelo_forgot" />
                </div>
                <div className="account_right">
                    <Title level={2} style={{ textAlign: 'center' }}>
                        <Text style={{ color: '#4d93ff' }}>Quên Mật Khẩu</Text>
                    </Title>
                    <Divider />
                    <div className="form-account">
                        <Formik
                            initialValues={{ ...forgotValues.initial }}
                            onSubmit={(values) => handleForgot(values)}
                            validationSchema={
                                isSubmit
                                    ? forgotValues.validationSchema
                                    : forgotValues.validationSchemaUser
                            }
                            enableReinitialize={true}
                        >
                            {(formikProps) => {
                                return (
                                    <Form>
                                        <Row gutter={[0, 16]}>
                                            <Col span={24}>
                                                <Text
                                                    style={{
                                                        color: '#08aeea',
                                                        textAlign: 'center',
                                                    }}
                                                >
                                                    Nhập email/SĐT để nhận mã
                                                    xác thực
                                                </Text>
                                            </Col>

                                            {isSubmit ? (
                                                <>
                                                    <Col span={24}>
                                                        <FastField
                                                            name="password"
                                                            component={
                                                                InputField
                                                            }
                                                            type="password"
                                                            title="Mật khẩu mới"
                                                            placeholder="Nhập mật khẩu"
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
                                                            title=" Xác Nhận Mật khẩu"
                                                            placeholder="Xác nhận mật khẩu"
                                                            maxLength={200}
                                                            titleCol={24}
                                                            inputCol={24}
                                                        />
                                                    </Col>
                                                    <Col span={24}>
                                                        <FastField
                                                            name="otpValue"
                                                            component={
                                                                InputField
                                                            }
                                                            type="text"
                                                            title="Xác nhận"
                                                            placeholder="Nhập 6 ký tự OTP"
                                                            maxLength={50}
                                                            titleCol={24}
                                                            inputCol={24}
                                                        />
                                                    </Col>

                                                    <Col span={24}>
                                                        <Button
                                                            block
                                                            type="primary"
                                                            disabled={
                                                                counter > 0
                                                                    ? true
                                                                    : false
                                                            }
                                                            onClick={() =>
                                                                handleResendOTP(
                                                                    formikProps
                                                                        .values
                                                                        .username
                                                                )
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

                                                    <Col span={24}>
                                                        <Button
                                                            block
                                                            type="primary"
                                                            htmlType="submit"
                                                        >
                                                            Xác nhận
                                                        </Button>
                                                    </Col>
                                                </>
                                            ) : (
                                                <>
                                                    <Col span={24}>
                                                        <FastField
                                                            name="username"
                                                            component={
                                                                InputField
                                                            }
                                                            type="text"
                                                            title="Tài khoản"
                                                            placeholder="Nhập tài khoản"
                                                            maxLength={50}
                                                            titleCol={24}
                                                            inputCol={24}
                                                        />
                                                    </Col>
                                                    <Col span={24}>
                                                        <Button
                                                            htmlType="submit"
                                                            block
                                                            type="primary"
                                                        >
                                                            Xác nhận
                                                        </Button>
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
                        <Link to="/account/registry">
                            Bạn chưa có tài khoản ?
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ForgotPage;
