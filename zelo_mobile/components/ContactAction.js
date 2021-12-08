import React from 'react';
import PropTypes from 'prop-types';
import {View, Text, TouchableOpacity} from 'react-native';
import {Avatar, ListItem} from 'react-native-elements';

const ContactAction = props => {
  const {name, type, title, backgroundColor, handlePress} = props;
  return (
    <TouchableOpacity onPress={handlePress}>
      <View style={{backgroundColor: '#fff'}}>
        <ListItem>
          <Avatar
            rounded
            overlayContainerStyle={{backgroundColor}}
            icon={{
              name,
              type,
            }}
            size="medium"
          />
          <ListItem.Content>
            <ListItem.Title>{title}</ListItem.Title>
          </ListItem.Content>
        </ListItem>
      </View>
    </TouchableOpacity>
  );
};

ContactAction.propTypes = {
  name: PropTypes.string,
  type: PropTypes.string,
  title: PropTypes.string,
  backgroundColor: PropTypes.string,
  handlePress: PropTypes.func,
};

ContactAction.defaultProps = {
  name: '',
  type: '',
  title: '',
  backgroundColor: '',
  handlePress: null,
};

export default ContactAction;
