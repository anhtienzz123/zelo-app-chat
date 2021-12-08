import PropTypes from 'prop-types';
import React, {useState} from 'react';
import {StyleSheet, Text, TouchableWithoutFeedback, View} from 'react-native';
import {WINDOW_WIDTH} from '../styles';
import {CheckBox, Icon} from 'react-native-elements';
import {TouchableOpacity} from 'react-native-gesture-handler';
import commonFuc from '../utils/commonFuc';
import {useSelector} from 'react-redux';

const VoteProgress = props => {
  const {totalOfVotes, option, maxWidth, isCheckBoxType, onChange} = props;
  const {userProfile} = useSelector(state => state.me);

  const percent = commonFuc.getPercentOfVotes(
    totalOfVotes,
    option.userIds.length,
  );

  const isChecked = option.userIds.includes(userProfile._id);
  const [checked, setChecked] = useState(isChecked);

  const handleOnPress = () => {
    onChange(!checked, option.name);
    setChecked(!checked);
  };

  return (
    <TouchableOpacity onPress={isCheckBoxType ? handleOnPress : null}>
      <View style={styles.progressBar}>
        <View
          style={
            ([StyleSheet.absoluteFill],
            {backgroundColor: '#bfe0ff', borderRadius: 5, width: `${percent}%`})
          }>
          <View
            style={{
              width: maxWidth,
              flexDirection: 'row',
              // paddingHorizontal: 10,
              // paddingVertical: 5,
              padding: 10,
            }}>
            {isCheckBoxType && (
              <CheckBox
                containerStyle={{
                  // backgroundColor: 'red',
                  justifyContent: 'center',
                  padding: 0,
                  marginLeft: 0,
                  margin: 0,
                }}
                center
                checked={checked}
                onPress={handleOnPress}
                checkedIcon={
                  <Icon
                    name="check-circle"
                    type="material-community"
                    color="#1194ff"
                  />
                }
                uncheckedIcon={
                  <Icon
                    name="circle-outline"
                    type="material-community"
                    color="#a1aaaf"
                  />
                }
              />
            )}

            <Text
              style={{
                flexShrink: 1,
                width: '100%',
                marginRight: isCheckBoxType ? 20 : 0,
              }}>
              {option.name}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

VoteProgress.propTypes = {
  totalOfVotes: PropTypes.number,
  option: PropTypes.object,
  maxWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  isCheckBoxType: PropTypes.bool,
  onChange: PropTypes.func,
};

VoteProgress.defaultProps = {
  totalOfVotes: 0,
  option: {},
  maxWidth: WINDOW_WIDTH * 0.8 - 20,
  isCheckBoxType: false,
  onChange: null,
};

export default VoteProgress;

const styles = StyleSheet.create({
  progressBar: {
    width: '100%',
    backgroundColor: '#ecf0f3',
    borderColor: '#000',
    // borderWidth: 2,
    borderRadius: 5,
    marginTop: 8,
  },
});
