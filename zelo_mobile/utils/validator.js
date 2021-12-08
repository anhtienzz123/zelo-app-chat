import * as Yup from 'yup';
export const loginValid = {
  initial: {
    username: '',
    password: '',
    // username: '0798662438',
    // password: '12345678',
  },
  validationSchema: Yup.object().shape({
    username: Yup.string().required('Tài khoản không được bỏ trống'),
    password: Yup.string().required('Mật khẩu không được bỏ trống'),
  }),
};

export const registerValid = {
  initial: {
    name: '',
    username: '',
    password: '',
    // name: 'Nhật Hào',
    // username: '0987654321',
    // password: '12345678',
  },
  validationSchema: Yup.object().shape({
    name: Yup.string().required('Tên không được bỏ trống'),
    username: Yup.string().required('Tài khoản không được bỏ trống'),
    password: Yup.string()
      .required('Mật khẩu không được bỏ trống')
      .min(8, 'Mật khẩu phải từ 8-50 ký tự')
      .max(50, 'Mật khẩu phải từ 8-50 ký tự'),
  }),
};

export const passwordValid = {
  initial: {
    username: '',
    password: '',
    passwordConfirmation: '',
    // username: '0987654321',
    // password: '12345678',
    // passwordConfirmation: '12345678',
  },
  validationSchema: Yup.object().shape({
    username: Yup.string().required('Tài khoản không được để trống'),
    password: Yup.string()
      .required('Mật khẩu không được để trống')
      .min(8, 'Mật khẩu phải từ 8-50 ký tự')
      .max(50, 'Mật khẩu phải từ 8-50 ký tự'),
    passwordConfirmation: Yup.string()
      .required('Không được để trống')
      .oneOf([Yup.ref('password'), null], 'Mật khẩu không khớp'),
  }),
};

export const renameConversationValid = {
  initial: {
    name: '',
  },
  validationSchema: Yup.object().shape({
    name: Yup.string()
      .required('Không hợp lệ')
      .matches(/^(?!\s+$).+/, 'Không hợp lệ'),
  }),
};

export const validateUsername = userName => {
  let validate = {
    isEmail: false,
    isPhoneNumber: false,
  };

  if (!userName) return validate;
  const regexPhoneNumber = /(84|0[3|5|7|8|9])+([0-9]{8})\b/g;
  const regexEmail =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  validate.isPhoneNumber = regexPhoneNumber.test(userName);
  validate.isEmail = regexEmail.test(userName);

  return validate;
};

export const userProfileValid = {
  initial: {
    name: '',
  },
  validationSchema: Yup.object().shape({
    name: Yup.string()
      .required('Tên không được để trống')
      .matches(/^(?!\s+$).+/, 'Không hợp lệ')
      .max(30, 'Tối đa 30 kí tự'),
  }),
};

export const groupValid = {
  initial: {
    name: '',
  },
  validationSchema: Yup.object().shape({
    name: Yup.string()
      .required('Tên nhóm không được để trống')
      .matches(/^(?!\s+$).+/, 'Không hợp lệ')
      .max(30, 'Tối đa 30 kí tự'),
  }),
};

export const changePasswordValid = {
  initial: {
    oldPassword: '',
    newPassword: '',
    passwordConfirmation: '',
    // oldPassword: '12345678',
    // newPassword: '12345678',
    // passwordConfirmation: '12345678',
  },
  validationSchema: Yup.object().shape({
    oldPassword: Yup.string().required('Mật khẩu cũ không được để trống'),
    newPassword: Yup.string()
      .required('Mật khẩu mới không được để trống')
      .min(8, 'Mật khẩu phải từ 8-50 ký tự')
      .max(50, 'Mật khẩu phải từ 8-50 ký tự')
      .notOneOf(
        [Yup.ref('oldPassword'), null],
        'Mật khẩu mới không trùng với mật khẩu cũ',
      ),
    passwordConfirmation: Yup.string()
      .required('Không được để trống')
      .oneOf([Yup.ref('newPassword'), null], 'Mật khẩu không khớp'),
  }),
};

export const logoutAllValid = {
  initial: {
    password: '',
    // password: '12345678',
  },
  validationSchema: Yup.object().shape({
    password: Yup.string().required('Mật khẩu không được để trống'),
  }),
};
