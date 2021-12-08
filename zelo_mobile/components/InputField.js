import PropTypes from 'prop-types';
import React from 'react';
import {Text} from 'react-native';
import {Input} from 'react-native-elements';
import globalStyles from '../styles';

const InputField = props => {
  const {value, onChangeText, placeholder, style, errorStyle, error} = props;
  return (
    <>
      <Input
        {...props}
        style={style}
        placeholder={placeholder}
        onChangeText={onChangeText}
        value={value}
      />
      <Text style={errorStyle}>{error}</Text>
    </>
  );
};

InputField.propTypes = {
  value: PropTypes.string,
  onChangeText: PropTypes.func,
  placeholder: PropTypes.string,
  style: PropTypes.object,
  errorStyle: PropTypes.object,
  error: PropTypes.string,
};

InputField.defaultProps = {
  value: '',
  onChangeText: null,
  placeholder: '',
  style: {},
  errorStyle: globalStyles.errorText,
  error: '',
};

export default InputField;
