import * as Yup from 'yup';
export const loginValues = {
    initial: {
        username: '',
        password: '',
    },
    validationSchema: Yup.object().shape({
        username: Yup.string()
            .required('Tài khoản không được bỏ trống.')
            .matches(
                /((09|03|07|08|05)+([0-9]{8})\b)|^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i,
                'Số điện thoại hoặc email không hợp lệ'
            ),
        // .email('Email không hợp lệ'),
        password: Yup.string().required('Mật khẩu không được bỏ trống'),
    }),
};

export const registryValues = {
    initial: {
        name: '',
        username: '',
        password: '',
        passwordconfirm: '',
        otpValue: '',
    },
    validationSchema: Yup.object().shape({
        name: Yup.string().required('Tên không được bỏ trống.'),
        username: Yup.string()
            .required('Tài khoản không được bỏ trống.')
            .matches(
                /((09|03|07|08|05)+([0-9]{8})\b)|^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i,
                'Số điện thoại hoặc email không hợp lệ'
            ),
        password: Yup.string()
            .required('Mật khẩu không được bỏ trống')
            .min(8, 'Mật khẩu phải từ 8-50 ký tự')
            .max(50, 'Mật khẩu phải từ 8-50 ký tự'),
        passwordconfirm: Yup.string()
            .required('không được bỏ trống')
            .oneOf([Yup.ref('password'), null], 'Mật khẩu không khớp'),
    }),

    validationSchemaWithOTP: Yup.object().shape({
        name: Yup.string().required('Tên không được bỏ trống.'),
        username: Yup.string()
            .required('Tài khoản không được bỏ trống.')
            .matches(
                /((09|03|07|08|05)+([0-9]{8})\b)|^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i,
                'Số điện thoại hoặc email không hợp lệ'
            ),
        password: Yup.string()
            .required('Mật khẩu không được bỏ trống')
            .min(8, 'Mật khẩu phải từ 8-50 ký tự')
            .max(50, 'Mật khẩu phải từ 8-50 ký tự'),
        passwordconfirm: Yup.string()
            .required('không được bỏ trống')
            .oneOf([Yup.ref('password'), null], 'Mật khẩu không khớp'),
        otpValue: Yup.string()
            .trim()
            .required('OTP không được bỏ trống.')
            .matches(/^\d{6}$/, 'OTP phải đủ 6 chữ số'),
    }),
};

export const forgotValues = {
    initial: {
        username: '',
        password: '',
        passwordconfirm: '',
        otpValue: '',
    },

    validationSchema: Yup.object().shape({
        username: Yup.string()
            .required('Tài khoản không được bỏ trống.')
            .matches(
                /((09|03|07|08|05)+([0-9]{8})\b)|^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i,
                'Số điện thoại hoặc email không hợp lệ'
            ),
        password: Yup.string()
            .required('Mật khẩu không được bỏ trống')
            .min(8, 'Mật khẩu phải từ 8-50 ký tự')
            .max(50, 'Mật khẩu phải từ 8-50 ký tự'),
        passwordconfirm: Yup.string()
            .required('không được bỏ trống')
            .oneOf([Yup.ref('password'), null], 'Mật khẩu không khớp'),
        otpValue: Yup.string()
            .trim()
            .required('OTP không được bỏ trống.')
            .matches(/^\d{6}$/, 'OTP phải đủ 6 chữ số'),
    }),

    validationSchemaUser: Yup.object().shape({
        username: Yup.string()
            .required('Tài khoản không được bỏ trống.')
            .matches(
                /((09|03|07|08|05)+([0-9]{8})\b)|^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i,
                'Số điện thoại hoặc email không hợp lệ'
            ),
    }),
};

export const otpValues = {
    initial: {
        username: '',
        password: '',
        passwordconfirm: '',
        otpValue: '',
    },

    validationSchema: Yup.object().shape({
        username: Yup.string()
            .required('Tài khoản không được bỏ trống.')
            .matches(
                /((09|03|07|08|05)+([0-9]{8})\b)|^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i,
                'Số điện thoại hoặc email không hợp lệ'
            ),
        password: Yup.string()
            .required('Mật khẩu không được bỏ trống')
            .min(8, 'Mật khẩu phải từ 8-50 ký tự')
            .max(50, 'Mật khẩu phải từ 8-50 ký tự'),
        passwordconfirm: Yup.string()
            .required('không được bỏ trống')
            .oneOf([Yup.ref('password'), null], 'Mật khẩu không khớp'),
        otpValue: Yup.string()
            .required('OTP không được bỏ trống.')
            .min(6, 'OTP không đủ 6 ký tự')
            .max(6, 'OTP nhiều hơn 6 ký tự'),
    }),
};
