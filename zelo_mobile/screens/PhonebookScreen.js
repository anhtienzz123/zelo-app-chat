import React from 'react';
import {
  FlatList,
  PermissionsAndroid,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Contacts from 'react-native-contacts';
import {Icon} from 'react-native-elements';
import {TouchableOpacity} from 'react-native-gesture-handler';
import Spinner from 'react-native-loading-spinner-overlay';
import {useDispatch, useSelector} from 'react-redux';
import {meApi} from '../api';
import ContactAction from '../components/ContactAction';
import EmptyData from '../components/EmptyData';
import FriendItem from '../components/FriendItem';
import {ERROR_MESSAGE, friendType} from '../constants';
import {fetchFriendById} from '../redux/friendSlice';
import {fetchSyncContacts, setLoading} from '../redux/meSlice';
import globalStyles from '../styles';
import commonFuc from '../utils/commonFuc';

const PhonebookScreen = ({navigation}) => {
  const {isLoading, phoneBooks} = useSelector(state => state.me);
  const dispatch = useDispatch();

  const handleSyncContacts = async () => {
    dispatch(setLoading(true));
    const contacts = await handleGetContacts();
    const phones = handleContactPhoneNumber(contacts);

    if (phones.length > 0) {
      try {
        const response = await meApi.syncContacts(phones);
        dispatch(fetchSyncContacts());
      } catch (error) {
        console.error(error);
        commonFuc.notifyMessage(ERROR_MESSAGE);
      }
    }
    dispatch(setLoading(false));
  };

  const handleGetContacts = async () => {
    let contacts = [];
    try {
      const permission = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
        {
          title: 'Contacts',
          message: 'This app would like to view your contacts.',
          buttonPositive: 'Please accept bare mortal',
        },
      );

      if (permission === 'granted') {
        contacts = await Contacts.getAll();
      }
    } catch (error) {
      console.error(error);
      commonFuc.notifyMessage(ERROR_MESSAGE);
    }

    return contacts;
  };

  const handleContactPhoneNumber = contacts => {
    if (!contacts) return [];
    const phonesTemp = contacts.map(contactEle => {
      const phone = contactEle.phoneNumbers[0].number
        .replace(/\s/g, '')
        .replace(/-/g, '')
        .replace('+84', '0');
      const name = contactEle.displayName;
      return {name, phone};
    });

    const phones = phonesTemp.filter(phoneEle => validatePhone(phoneEle.phone));

    return phones;
  };

  const validatePhone = phone => {
    if (!phone) return false;
    const regex = /(0[3|5|7|8|9])+([0-9]{8})\b/g;

    return regex.test(phone);
  };

  const handleGoToPersonalScreen = async userId => {
    await dispatch(fetchFriendById({userId}));
    navigation.navigate('Chi tiết bạn bè');
  };

  return (
    <SafeAreaView>
      <Spinner
        visible={isLoading}
        textContent={'Loading...'}
        textStyle={globalStyles.spinnerTextStyle}
      />
      <ContactAction
        name="phone-square"
        type="font-awesome"
        title="Đồng bộ danh bạ"
        backgroundColor="#70c43b"
        handlePress={handleSyncContacts}
      />
      {phoneBooks.length > 0 ? (
        <FlatList
          data={phoneBooks}
          keyExtractor={(_, index) => index}
          initialNumToRender={12}
          renderItem={({item}) => (
            <TouchableOpacity
              onPress={
                item.isExists ? () => handleGoToPersonalScreen(item._id) : null
              }>
              <View style={{backgroundColor: '#fff'}}>
                <FriendItem
                  name={item.name}
                  avatar={item?.avatar}
                  type={item?.status ? 'DETAILS' : friendType.DONT_HAVE_ACCOUNT}
                  userId={item?._id || item.username}
                  navigation={navigation}
                  avatarColor={item?.avatarColor}
                />
                <View
                  style={{
                    width: '100%',
                    backgroundColor: '#E5E6E8',
                    height: 1,
                    marginLeft: 82,
                  }}></View>
              </View>
            </TouchableOpacity>
          )}
        />
      ) : (
        <EmptyData content="Không có số điện thoại nào" />
      )}
      {/* <ScrollView>
        {phoneBooks &&
          phoneBooks.map(phone => {
            return (
              <TouchableOpacity
                key={phone.username}
                onPress={
                  phone.isExists ? () => handleGoToPersonalScreen(_id) : null
                }>
                <View style={{backgroundColor: '#fff'}}>
                  <FriendItem
                    name={phone.name}
                    avatar={phone?.avatar}
                    type={phone?.status || friendType.DONT_HAVE_ACCOUNT}
                    userId={phone?._id || phone.username}
                    navigation={navigation}
                  />
                  <View
                    style={{
                      width: '100%',
                      backgroundColor: '#E5E6E8',
                      height: 1,
                      marginLeft: 82,
                    }}></View>
                </View>
              </TouchableOpacity>
            );
          })}
      </ScrollView> */}
    </SafeAreaView>
  );
};

export default PhonebookScreen;

const styles = StyleSheet.create({
  emty: {
    alignItems: 'center',
    marginTop: 50,
  },
  text: {
    color: 'grey',
    fontSize: 16,
    marginTop: 15,
  },
});
