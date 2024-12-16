import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  ScrollView,
  Modal,
  TextInput,
  TouchableWithoutFeedback,
  FlatList,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import color from '../../utils/commonStyles/color';

const SettingsSidebar = ({navigation}) => {
  const [userName, setUserName] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [showCompanyList, setshowCompanyList] = useState(false);
  const [companyList, setcompanyList] = useState({});

  useEffect(() => {
    const fetchUserName = async () => {
      const name = await AsyncStorage.getItem('userDisplayName');
      setUserName(name || 'Guest');
    };
    fetchUserName();
    getCompaniesList();
  }, []);

  const getCompaniesList = async () => {
    try {
      let companiesList = await AsyncStorage.getItem('CompaniesList');
      console.log('Companies list in CH ===> ', companiesList);

      const parsedList = companiesList ? JSON.parse(companiesList) : {};
      setcompanyList(parsedList);

      if (Object.keys(parsedList).length > 0) {
        const [[firstKey, firstValue]] = Object.entries(parsedList);
        // setselectedCompanyId(firstKey);
        // setselectedCompanyName(firstValue);
        console.log('setselectedCompanyId  ', firstKey, firstValue);
      } else {
        console.log('No companies found');
      }
    } catch (error) {
      console.error('Error fetching companies list: ', error);
    }
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('userDisplayName');
      await AsyncStorage.removeItem('admin');
      await AsyncStorage.removeItem('userName');
      await AsyncStorage.removeItem('userPsd');
      await AsyncStorage.removeItem('userId');
      await AsyncStorage.removeItem('roleId');
      await AsyncStorage.removeItem('companyId');
      await AsyncStorage.removeItem('companyObj');
      await AsyncStorage.removeItem('CompaniesList');
      await AsyncStorage.removeItem('locIds');
      await AsyncStorage.removeItem('companyIds');
      await AsyncStorage.removeItem('brandIds');
      await AsyncStorage.removeItem('CurrentCompanyLocations');
      navigation.reset({
        index: 0,
        routes: [{name: 'LoginComponent'}],
      });
    } catch (error) {
      console.error('Error clearing user data:', error);
    }
  };

  const handleSelectCompany = async (id, name) => {
    console.log('changin compnay===> ', id, name);
    // setselectedCompanyId(id);
    // setselectedCompanyName(name);
    // setshowCompanyList(false);
    // await getCompanyObj(id);
  };

  const handleDeleteUser = async () => {
    let userId = await AsyncStorage.getItem('userId');

    let obj1 = {
      userId: Number(userId),
    };

    console.log('obj1 => ', obj1);

    let updateUserAPIObj = await APIServiceCall.updateUserInActive(obj1);
    if (updateUserAPIObj.error) {
      popUpAction(
        loginAPIObj.error,
        Constant.DefaultAlert_MSG,
        'OK',
        true,
        false,
      );
    }

    await AsyncStorage.removeItem('save_username');
    await AsyncStorage.removeItem('save_password');
    await AsyncStorage.removeItem('save_code');

    console.log('response ====> ', updateUserAPIObj);
    handleLogout();
  };

  const handleSearch = () => {};

  return (
    <View style={styles.container}>
      {/* Profile Section */}
      <View style={styles.profileContainer}>
        <Image
          source={require('./../../../assets/images/png/profile.png')}
          style={styles.profileImage}
        />
        <View>
          <Text style={styles.profileName}>{userName}</Text>
          <Text style={styles.profileSubtext}>View Profile</Text>
        </View>
      </View>

      {/* Settings List */}
      <ScrollView style={styles.settingsContainer}>
        <SettingItem
          title="Change Company"
          icon={require('./../../../assets/images/png/swap.png')}
          onPress={() => setshowCompanyList(!showCompanyList)}
        />
        {/* <SettingItem
          title="Change Password"
          icon={require('./../../../assets/images/png/key.png')}
          onPress={() => console.log('ChangePassword')}
        /> */}
        <SettingItem
          title="Notifications"
          icon={require('./../../../assets/images/png/notification.png')}
          onPress={() => navigation.navigate('Notifications')}
        />
        <SettingItem
          title="Appearance"
          icon={require('./../../../assets/images/png/color-palette.png')}
          onPress={() => console.log('AppearanceSettings')}
        />
        <SettingItem
          title="Logout"
          icon={require('./../../../assets/images/png/logOut.png')}
          onPress={handleLogout}
        />
        <SettingItem
          title="Delete Account"
          icon={require('./../../../assets/images/png/bin.png')}
          onPress={() => setModalVisible(true)}
        />
      </ScrollView>

      {/* Delete Modal */}
      <Modal animationType="fade" transparent visible={modalVisible}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>
              Are you sure you want to delete your account?
            </Text>
            <View style={styles.modalActions}>
              <TouchableOpacity
                onPress={handleDeleteUser}
                style={styles.modalButton}>
                <Text style={styles.modalButtonText}>Yes</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={[styles.modalButton, styles.cancelButton]}>
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
  transparent
  animationType="slide"
  visible={showCompanyList}
  onRequestClose={() => setshowCompanyList(false)}
>
  <TouchableWithoutFeedback onPress={() => setshowCompanyList(false)}>
    <View style={styles.companyModalOverlay} />
  </TouchableWithoutFeedback>
  <View style={styles.companyModalContainer}>
    {/* Heading */}
    <View style={styles.companyModalHeader}>
      <Text style={styles.companyModalHeaderText}>Company List</Text>
    </View>

    {/* Search Bar */}
    <View style={styles.companyModalSearchBarContainer}>
      <TextInput
        style={styles.companyModalSearchBar}
        placeholder="Search companies..."
        placeholderTextColor="#aaa"
        onChangeText={handleSearch}
      />
    </View>

    {/* Company List */}
    <View style={styles.companyModalListContainer}>
      {Object.keys(companyList).length === 0 ? (
        <Text style={styles.companyModalNoResultsText}>
          No results found
        </Text>
      ) : (
        <FlatList
          data={Object.keys(companyList)}
          keyExtractor={(item) => item.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.companyModalDropdownItem}
              onPress={() => handleSelectCompany(item, companyList[item])}
            >
              <View style={styles.companyModalItemContent}>
                <View style={styles.companyModalCircle}>
                  <Text style={styles.companyModalCircleText}>
                    {companyList[item].charAt(0).toUpperCase()}
                  </Text>
                </View>
                <Text style={styles.companyModalDropdownItemText}>
                  {companyList[item]}
                </Text>
              </View>
            </TouchableOpacity>
          )}
          ItemSeparatorComponent={() => (
            <View style={styles.companyModalSeparator} />
          )}
          contentContainerStyle={styles.companyModalFlatListContent}
        />
      )}
    </View>
  </View>
</Modal>


    </View>
  );
};

// Reusable Setting Item Component
const SettingItem = ({title, icon, onPress}) => (
  <TouchableOpacity style={styles.settingItem} onPress={onPress}>
    <View style={styles.settingIconContainer}>
      <Image source={icon} style={styles.settingIcon} />
    </View>
    <Text style={styles.settingText}>{title}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: color.color2,
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 4,
    elevation: 3,
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
  },
  profileName: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
  },
  profileSubtext: {
    color: '#e1e1e1',
    fontSize: 14,
  },
  settingsContainer: {
    marginTop: 10,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 4,
    elevation: 2,
  },
  settingIconContainer: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e9ecef',
    borderRadius: 20,
    marginRight: 15,
  },
  settingIcon: {
    width: 20,
    height: 20,
    tintColor: color.color2,
  },
  settingText: {
    fontSize: 16,
    color: '#495057',
    fontWeight: '500',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  modalContent: {
    width: '85%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: {width: 0, height: 4},
    shadowRadius: 10,
    elevation: 5,
  },
  modalText: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
    color: '#212529',
    fontWeight: '500',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: '#4CAF50',
    margin: 5,
  },
  cancelButton: {
    backgroundColor: '#d9534f',
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },



  companyModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  companyModalContainer: {
    backgroundColor: '#fff',
    height: '70%',
    // borderTopLeftRadius: 20,
    // borderTopRightRadius: 20,
    // overflow: 'hidden',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius:15
  },
  companyModalHeader: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    alignItems: 'center',
  },
  companyModalHeaderText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  companyModalSearchBarContainer: {
    marginVertical: 12,
  },
  companyModalSearchBar: {
    height: 40,
    backgroundColor: '#f2f2f2',
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
    color: '#333',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  companyModalListContainer: {
    flex: 1,
    marginTop: 8,
  },
  companyModalFlatListContent: {
    paddingVertical: 4,
  },
  companyModalNoResultsText: {
    color: '#888',
    textAlign: 'center',
    padding: 10,
    fontSize: 16,
  },
  companyModalDropdownItem: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 4,
    marginBottom: 4,
  },
  companyModalItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  companyModalCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: color.color2,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 20,
  },
  companyModalCircleText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  companyModalDropdownItemText: {
    fontSize: 16,
    color: '#333',
  },
  companyModalSeparator: {
    height: 1,
    backgroundColor: '#ddd',
    marginVertical: 4,
  },
});

export default SettingsSidebar;
