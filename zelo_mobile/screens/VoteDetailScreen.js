import React, {useEffect, useRef, useState} from 'react';
import {
  Keyboard,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {Button, Divider, Icon, Input} from 'react-native-elements';
import {useSelector} from 'react-redux';
import {voteApi} from '../api';
import VoteDetailModal from '../components/modal/VoteDetailModal';
import VoteProgress from '../components/VoteProgress';
import {DEFAULT_VOTE_DETAIL_MODAL, ERROR_MESSAGE} from '../constants';
import {useGoback, useKeyboard} from '../hooks';
import {MAIN_COLOR, SCREEN_WIDTH} from '../styles';
import commonFuc from '../utils/commonFuc';
import dateUtils from '../utils/dateUtils';

const VoteDetailScreen = ({navigation}) => {
  useGoback(navigation);
  const isKeyBoardOpen = useKeyboard();

  const {currentVote} = useSelector(state => state.message);
  const {userProfile} = useSelector(state => state.me);
  const [isDisable, setIsDisable] = useState(true);
  const [isfocusTextInput, setIsfocusTextInput] = useState(false);
  const [newOption, setNewOption] = useState('');

  const [voteDetailsProps, setVoteDetailsProps] = useState(
    DEFAULT_VOTE_DETAIL_MODAL,
  );

  const options = currentVote.options;
  const totalOfVotes = commonFuc.getTotalOfVotes(options);

  const currentUserVotes = commonFuc.getCurrentUserVotes(
    options,
    userProfile._id,
  );

  const choicesRef = useRef(currentUserVotes);

  const handleOnChangeVote = (isChecked, optionId) => {
    if (isChecked) {
      const oldChoices = choicesRef.current;
      choicesRef.current = [...oldChoices, optionId];
    } else {
      const oldChoices = choicesRef.current;

      const newChoices = oldChoices.filter(optionEle => optionEle !== optionId);

      choicesRef.current = newChoices;
    }

    const isEqual =
      currentUserVotes.length === choicesRef.current.length &&
      currentUserVotes.every(val => choicesRef.current.includes(val));

    setIsDisable(isEqual);
  };

  const handleOnPressVote = () => {
    const oldChoices = currentUserVotes;
    const newChoices = choicesRef.current;

    const deleteChoices = commonFuc.getDifferentValue(oldChoices, newChoices);
    const addChoices = commonFuc.getDifferentValue(newChoices, oldChoices);
    const messageId = currentVote._id;

    if (deleteChoices.length > 0) {
      handleOnSubmit(messageId, {options: deleteChoices}, false);
    }
    if (addChoices.length > 0) {
      handleOnSubmit(messageId, {options: addChoices}, true);
    }
  };

  const handleOnSubmit = async (messageId, options, isSelectOption) => {
    try {
      if (isSelectOption) {
        const response = await voteApi.selectOption(messageId, options);
      } else {
        const response = await voteApi.deleteSelectOption(messageId, options);
      }
      commonFuc.notifyMessage('Bình chọn thành công');
      navigation.goBack();
    } catch (error) {
      console.error(error);
      commonFuc.notifyMessage(ERROR_MESSAGE);
    }
  };

  const handleOnAddNewOption = async () => {
    if (/^\s*$/.test(newOption)) {
      Keyboard.dismiss();
    } else {
      // Check duplicate
      const oldOptions = options.map(option => option.name);
      const newOptions = [...oldOptions, newOption];

      if ([...new Set(newOptions)].length <= oldOptions.length) {
        commonFuc.notifyMessage('Phương án đã tồn tại');
        return;
      } else {
        // add new option
        try {
          const response = await voteApi.addVoteOption(currentVote._id, {
            options: [newOption],
          });
          setNewOption('');
          setIsfocusTextInput(false);
          Keyboard.dismiss();
        } catch (error) {
          commonFuc.notifyMessage(ERROR_MESSAGE);
          console.error(error);
        }
      }
    }
  };

  useEffect(() => {
    if (isKeyBoardOpen) {
    } else {
      if (/^\s*$/.test(newOption)) {
        setIsfocusTextInput(false);
      }
    }
  }, [isKeyBoardOpen]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Text style={{fontWeight: 'bold', fontSize: 18}}>
          {currentVote.content}
        </Text>
        <Text style={{...styles.smallText, color: 'grey'}}>
          {`${currentVote.user.name} • ${dateUtils.getDate(
            currentVote.createdAt,
          )} lúc ${dateUtils.getTime(currentVote.createdAt)}`}
        </Text>

        {totalOfVotes > 0 && (
          <TouchableOpacity
            onPress={() => setVoteDetailsProps({isVisible: true, options})}>
            <Text style={{...styles.smallText, color: MAIN_COLOR}}>
              {commonFuc.getNumOfPeopleVoted(options)} Người đã bình chọn
            </Text>
          </TouchableOpacity>
        )}
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'flex-start',
            alignContent: 'center',
            alignItems: 'center',
            marginTop: 8,
          }}>
          <Icon name="bars" type="antdesign" size={14} color="grey" />
          <Text style={{...styles.smallText, color: 'grey', marginLeft: 5}}>
            Chọn được nhiều phương án
          </Text>
        </View>

        <Divider style={{marginVertical: 8}} />

        {options.map((option, index) => {
          return (
            <VoteProgress
              key={option._id}
              totalOfVotes={totalOfVotes}
              // option="The value of the progress indicator for the determinate variant. Value between 0 and 1.The value of the progress indicator for the determinate variant. Value between 0 and 1."
              option={option}
              maxWidth={SCREEN_WIDTH}
              isCheckBoxType={true}
              onChange={handleOnChangeVote}
            />
          );
        })}
        <Button
          title="+ Thêm phương án"
          type="clear"
          containerStyle={{marginVertical: 8}}
          onPress={() => {
            setIsfocusTextInput(true);
          }}
        />
      </ScrollView>

      {isfocusTextInput ? (
        <View style={styles.footer}>
          <TextInput
            placeholder="Thêm phương án"
            maxLength={120}
            value={newOption}
            onChangeText={value => setNewOption(value)}
            autoFocus={isfocusTextInput}
            style={styles.textInput}
            multiline
            editable
          />
          <Button
            title={/^\s*$/.test(newOption) ? 'Đóng' : 'Thêm'}
            type="clear"
            titleStyle={{fontSize: 12, textTransform: 'uppercase'}}
            buttonStyle={{
              backgroundColor: '#f0f8fb',
              borderRadius: 50,
              paddingVertical: 4,
            }}
            containerStyle={{borderRadius: 50, width: 70}}
            onPress={handleOnAddNewOption}
          />
        </View>
      ) : (
        <Button
          title="Bình chọn"
          disabled={isDisable}
          buttonStyle={{borderRadius: 50}}
          containerStyle={{width: '100%', borderRadius: 50}}
          onPress={handleOnPressVote}
        />
      )}

      {voteDetailsProps.isVisible && (
        <VoteDetailModal
          modalProps={voteDetailsProps}
          onShowModal={setVoteDetailsProps}
        />
      )}
    </SafeAreaView>
  );
};

export default VoteDetailScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    alignSelf: 'center',
    alignItems: 'center',
    width: '100%',
    justifyContent: 'center',
    // flexDirection: 'column',
    padding: 10,
    flex: 1,
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
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderTopWidth: 1,
    borderTopColor: '#D0D2D3',
    // backgroundColor: 'cyan',
    backgroundColor: '#fafafa',
    zIndex: 300, // works on ios
    elevation: 300, // works on android
  },
  textInput: {
    bottom: 0,
    marginRight: 10,
    flex: 1,
    borderColor: 'transparent',
    // backgroundColor: '#FFF',
    paddingVertical: 0,
    fontSize: 15,
    fontWeight: '500',
    borderBottomWidth: 0,
  },
});
