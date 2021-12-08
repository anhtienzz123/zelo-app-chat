import PropTypes from 'prop-types';
import React, {useRef, useState} from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {Button, Divider, Icon, Input} from 'react-native-elements';
import {useDispatch, useSelector} from 'react-redux';
import {voteApi} from '../../api';
import {DEFAULT_ADD_VOTE_MODAL, ERROR_MESSAGE} from '../../constants';
import commonFuc from '../../utils/commonFuc';

const AddVoteModal = props => {
  const {modalVisible, setModalVisible} = props;
  const {pinMessages} = useSelector(state => state.pin);
  const {currentConversationId} = useSelector(state => state.message);
  const dispatch = useDispatch();

  const [content, setContent] = useState('');
  const [textValue, setTextValue] = useState('');
  const [numInputs, setNumInputs] = useState(2);
  const inputsRef = useRef([textValue, textValue]);

  const inputs = [];

  for (let i = 0; i < numInputs; i++) {
    inputs.push(
      <View key={i}>
        <Input
          placeholder={`Phương án ${i + 1}`}
          style={styles.option}
          containerStyle={styles.optionContainer}
          renderErrorMessage={false}
          value={inputsRef.current[i]}
          onChangeText={value => setInputValue(i, value)}
          rightIcon={{
            type: 'antdesign',
            name: 'close',
            color: 'grey',
            onPress: () => removeInput(i),
          }}
          maxLength={120}
        />
      </View>,
    );
  }

  const setInputValue = (index, value) => {
    const inputs = inputsRef.current;
    inputs[index] = value;
    setTextValue(value);
  };

  const addInput = () => {
    inputsRef.current.push('');
    setNumInputs(value => value + 1);
  };

  const removeInput = index => {
    if (inputsRef.current.length > 2) {
      inputsRef.current.splice(index, 1)[0];
      setNumInputs(value => value - 1);
    } else {
      commonFuc.notifyMessage('Bình chọn phải có ít nhất 2 phương án');
    }
  };

  const handleCloseModal = () => {
    setModalVisible(DEFAULT_ADD_VOTE_MODAL);
  };
  const handleCreateVote = async () => {
    if (/^\s*$/.test(content)) {
      commonFuc.notifyMessage('Chưa đặt câu hỏi bình chọn');
      return;
    }

    // filter empty value
    const options = inputsRef.current.filter(value => !/^\s*$/.test(value));
    if (options.length >= 2) {
      if ([...new Set(options)].length < options.length) {
        commonFuc.notifyMessage('Phương án không được trùng nhau');
        return;
      }
      try {
        const vote = {
          content,
          options,
          conversationId: currentConversationId,
        };
        const response = await voteApi.addVote(vote);

        setContent('');
        setTextValue('');
        setNumInputs(2);
        inputsRef.current = ['', ''];
      } catch (error) {
        console.error(error);
        commonFuc.notifyMessage(ERROR_MESSAGE);
      }

      handleCloseModal();
      commonFuc.notifyMessage('Tạo bình chọn thành công');
    } else {
      commonFuc.notifyMessage('Bình chọn phải có ít nhất 2 phương án');
    }
  };

  return (
    <SafeAreaView style={styles.centeredView}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible.isVisible}
        onRequestClose={handleCloseModal}
        avoidKeyboard={false}>
        {/* <TouchableOpacity
          activeOpacity={1}
          style={styles.container}></TouchableOpacity> */}

        <KeyboardAvoidingView style={styles.modalView} behavior="height">
          <View style={styles.header}>
            <Button
              icon={
                <Icon
                  name="chart"
                  type="simple-line-icon"
                  color="white"
                  size={18}
                />
              }
              disabled
              disabledStyle={{
                backgroundColor: '#3edc95',
                borderRadius: 50,
                marginBottom: 5,
              }}
            />

            <Text style={styles.title}>Tạo bình chọn mới</Text>
          </View>
          <Divider />
          <ScrollView>
            <View style={styles.body}>
              <Input
                placeholder="Đặt câu hỏi bình chọn"
                inputContainerStyle={{borderBottomWidth: 0}}
                onChangeText={value => setContent(value)}
                maxLength={120}
              />
              {inputs}

              <Button
                title="Thêm phương án"
                type="clear"
                onPress={addInput}
                containerStyle={{marginTop: 10}}
              />
            </View>
            <View>
              <Divider />
              <View style={styles.footer}>
                <Button
                  title="Hủy"
                  type="outline"
                  containerStyle={styles.buttonClose}
                  buttonStyle={{
                    borderRadius: 50,
                  }}
                  onPress={handleCloseModal}
                />
                <Button
                  title="Tạo"
                  containerStyle={styles.buttonClose}
                  buttonStyle={{
                    borderRadius: 50,
                  }}
                  onPress={handleCreateVote}
                />
              </View>
            </View>

            {/* <View>
              {inputsRef.current.map((value, i) => {
                return <Text key={i}>{`${i + 1} - ${value}`}</Text>;
              })}
            </View> */}
          </ScrollView>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
};

AddVoteModal.propTypes = {
  modalVisible: PropTypes.object,
  setModalVisible: PropTypes.func,
};

AddVoteModal.defaultProps = {
  modalVisible: DEFAULT_ADD_VOTE_MODAL,
  setModalVisible: null,
};

const BUTTON_RADIUS = 10;

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(52, 52, 52, 0.8)',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    // padding: 10,
  },
  centeredView: {},
  modalView: {
    width: '100%',
    height: '100%',
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    // alignItems: 'center',
    // justifyContent: 'center',
  },
  header: {
    // backgroundColor: 'red',
    width: '100%',
    alignItems: 'center',
    paddingTop: 15,
    paddingBottom: 10,
  },
  body: {
    // backgroundColor: 'cyan',
    width: '100%',
    paddingBottom: 10,
    // alignItems: 'center',
    // justifyContent: 'flex-start',
  },
  footer: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '100%',

    paddingHorizontal: 15,
    paddingVertical: 20,
  },
  title: {
    fontFamily: Platform.OS === 'ios' ? 'Arial' : 'normal',
    fontWeight: 'bold',
    color: 'black',
    fontSize: 16,
  },
  buttonClose: {
    // backgroundColor: '#2196F3',
    width: '45%',
    borderRadius: 50,
  },
  option: {
    fontSize: 15,
    // backgroundColor: 'red',
    marginVertical: 0,
    paddingVertical: 5,
  },
  optionContainer: {
    // backgroundColor: 'blue',
  },
});

export default AddVoteModal;
