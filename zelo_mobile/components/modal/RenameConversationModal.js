import {Formik} from 'formik';
import PropTypes from 'prop-types';
import React, {useState} from 'react';
import {
  Modal,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {Button} from 'react-native-elements';
import {useSelector} from 'react-redux';
import {conversationApi} from '../../api';
import {DEFAULT_RENAME_CONVERSATION_MODAL} from '../../constants';
import {renameConversationValid} from '../../utils/validator';
import InputField from '../InputField';

const RenameConversationModal = props => {
  const {modalVisible, setModalVisible} = props;

  const {currentConversationId} = useSelector(state => state.message);

  const [conversationName, setConversationName] = useState('');

  const handleCloseModal = () => {
    setModalVisible(DEFAULT_RENAME_CONVERSATION_MODAL);
  };
  const handleRename = async name => {
    const response = await conversationApi.updateName(
      currentConversationId,
      name,
    );
    handleCloseModal();
  };

  return (
    <SafeAreaView style={styles.centeredView}>
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible.isVisible}
        onRequestClose={handleCloseModal}>
        <TouchableOpacity activeOpacity={1} style={styles.container}>
          <SafeAreaView style={styles.modalView}>
            <View style={styles.header}>
              <Text style={styles.title}>
                {modalVisible.type ? 'Đặt tên nhóm' : 'Đặt biệt danh'}
              </Text>
            </View>
            <Formik
              initialValues={{name: modalVisible.conversationName}}
              validationSchema={renameConversationValid.validationSchema}
              onSubmit={values => handleRename(values)}>
              {formikProps => {
                const {values, errors, handleChange, handleSubmit} =
                  formikProps;
                return (
                  <>
                    <View style={styles.body}>
                      <InputField
                        placeholder={
                          modalVisible.type ? 'Tên nhóm' : 'Biệt danh'
                        }
                        autoFocus
                        onChangeText={handleChange('name')}
                        value={values.name}
                        error={errors.name}
                        style={{fontSize: 15, paddingBottom: 0}}
                        inputContainerStyle={{
                          borderBottomWidth: 0,
                        }}
                      />
                    </View>
                    <View style={styles.footer}>
                      <Button
                        title="Hủy"
                        onPress={handleCloseModal}
                        type="clear"
                        titleStyle={{color: 'black'}}
                        containerStyle={{marginRight: 20}}
                      />
                      <Button title="Lưu" onPress={handleSubmit} type="clear" />
                    </View>
                  </>
                );
              }}
            </Formik>
          </SafeAreaView>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
};

RenameConversationModal.propTypes = {
  modalVisible: PropTypes.object,
  setModalVisible: PropTypes.func,
};

RenameConversationModal.defaultProps = {
  modalVisible: DEFAULT_RENAME_CONVERSATION_MODAL,
  setModalVisible: null,
};

const BUTTON_RADIUS = 10;

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(52, 52, 52, 0.3)',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
  },
  centeredView: {
    // flex: 1,
    // flexDirection: "row",
    // justifyContent: "center",
    // alignItems: "flex-end",
    // width: "100%",
  },
  modalView: {
    width: '100%',
    backgroundColor: 'white',
    borderRadius: 5,
    // padding: 15,
  },

  header: {
    borderBottomWidth: 1,
    borderBottomColor: '#E5E6E8',
    paddingVertical: 5,
    paddingHorizontal: 15,
  },
  title: {
    fontFamily: Platform.OS === 'ios' ? 'Arial' : 'normal',
    fontWeight: '500',
    color: 'black',
    textAlign: 'left',
    fontSize: 18,
    borderBottomColor: 'black',
  },
  body: {},
  footer: {
    paddingHorizontal: 15,
    paddingBottom: 5,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
});

export default RenameConversationModal;
