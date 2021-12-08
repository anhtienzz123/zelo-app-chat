import PropTypes from 'prop-types';
import React from 'react';
import {Text} from 'react-native';
import {MAIN_COLOR} from '../../styles';

const TextMention = props => {
  const {text} = props;
  return <Text style={{color: MAIN_COLOR}}>{text}</Text>;
};

TextMention.propTypes = {
  text: PropTypes.string,
};

TextMention.defaultProps = {
  text: '',
};

export default TextMention;
