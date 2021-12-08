import PropTypes from 'prop-types';
import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {Button} from 'react-native-elements';
import {MAIN_COLOR} from '../../styles';
import commonFuc from '../../utils/commonFuc';
import VoteProgress from '../VoteProgress';
import {useDispatch, useSelector} from 'react-redux';
import {setCurrentVote} from '../../redux/messageSlice';

const VoteMessage = props => {
  const {message, navigation, onViewVoteDetailModal} = props;

  const dispatch = useDispatch();

  const options = [...message.options].sort((option1, option2) =>
    option1.userIds.length > option2.userIds.length ? -1 : 1,
  );

  const totalOfVotes = commonFuc.getTotalOfVotes(options);

  const goToVoteScreen = () => {
    dispatch(setCurrentVote(message));
    navigation.navigate('Chi tiết bình chọn');
  };

  return (
    <TouchableOpacity onPress={goToVoteScreen}>
      <View style={styles.container}>
        <View style={styles.textContainer}>
          <Text style={styles.text}>{message.content}</Text>
          {totalOfVotes > 0 && (
            <TouchableOpacity
              onPress={() => onViewVoteDetailModal({isVisible: true, options})}>
              <Text style={{...styles.smallText, color: MAIN_COLOR}}>
                {commonFuc.getNumOfPeopleVoted(options)} Người đã bình chọn
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {options.map((option, index) => {
          return (
            index < 3 && (
              <VoteProgress
                key={option._id}
                totalOfVotes={totalOfVotes}
                option={option}
              />
            )
          );
        })}
        {/* <VoteProgress
          percent="75%"
          option="The value of the progress indicator for the determinate variant. Value between 0 and 1."
        />
        <VoteProgress percent="50%" option="Track color for linear progress" />
        <VoteProgress percent="25%" option="Type of button (optional)" /> */}

        {options.length > 3 && (
          <View style={{...styles.textContainer, marginTop: 8}}>
            <Text style={{...styles.smallText, color: 'grey'}}>
              {options.length - 3} Phương án khác
            </Text>
          </View>
        )}
        <Button
          title="Bình chọn"
          type="clear"
          onPress={goToVoteScreen}
          buttonStyle={{backgroundColor: '#f0f8fb', borderRadius: 50}}
          containerStyle={{borderRadius: 50, width: '100%', marginTop: 8}}
        />
      </View>
    </TouchableOpacity>
  );
};

VoteMessage.propTypes = {
  message: PropTypes.object,
  navigation: PropTypes.object,
  onViewVoteDetailModal: PropTypes.func,
};

VoteMessage.defaultProps = {
  message: {},
  navigation: {},
  onViewVoteDetailModal: null,
};
export default VoteMessage;

const styles = StyleSheet.create({
  container: {
    // backgroundColor: '#fcfdff',
    backgroundColor: '#fff',
    alignSelf: 'center',
    alignItems: 'center',
    width: '80%',
    justifyContent: 'center',
    flexDirection: 'column',
    borderRadius: 10,
    // paddingVertical: 1,
    // paddingHorizontal: 10,
    padding: 10,
    marginVertical: 5,
  },
  textContainer: {
    width: '100%',
    justifyContent: 'center',
    alignContent: 'flex-start',
  },
  text: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
    textAlignVertical: 'center',
  },
  smallText: {fontSize: 12, textAlignVertical: 'center'},
});
