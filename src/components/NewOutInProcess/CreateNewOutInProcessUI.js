import React, {useState, useRef, useEffect, useMemo} from 'react';
import {
  View,
  FlatList,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Button,
  Alert,
} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import * as Constant from './../../utils/constants/constant';
import CommonStyles from './../../utils/commonStyles/commonStyles';
import HeaderComponent from './../../utils/commonComponents/headerComponent';
import LoaderComponent from './../../utils/commonComponents/loaderComponent';
import AlertComponent from './../../utils/commonComponents/alertComponent';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import * as APIServiceCall from './../../utils/apiCalls/apiCallsComponent';
import BottomComponent from './../../utils/commonComponents/bottomComponent';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {formatDateIntoDMY} from './../../utils/constants/constant';
import {RadioButton, TextInput} from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {RadioGroup} from 'react-native-radio-buttons-group';

let downArrowImg = require('./../../../assets/images/png/dropDownImg.png');
const CreateNewOutInProcessUI = ({route, navigation, ...props}) => {
  useEffect(() => {
    if (props?.itemsArray) {
      // console.log('props =====>  ', props?.itemsArray);
    }
  }, [props.itemsArray]);

  const [name, setName] = useState('');

  const [newCountry, setNewCountry] = useState('');
  const [showAddCountry, setShowAddCountry] = useState(false);

  // From Location
  const [fromLocationList, setFromLocationList] = useState([]);
  const [filteredFromLocation, setFilteredFromLocation] = useState([]);
  const [showFromLocationList, setShowFromLocationList] = useState(false);
  const [fromLocationName, setFromLocationName] = useState('');
  const [fromLocationId, setFromLocationId] = useState('');

  // To Location
  const [toLocationList, setToLocationList] = useState([]);
  const [filteredToLocation, setFilteredToLocation] = useState([]);
  const [showToLocationList, setShowToLocationList] = useState(false);
  const [toLocationName, setToLocationName] = useState('');
  const [toLocationId, setToLocationId] = useState('');

  const [vendorsList, set_vendorsList] = useState([]);
  const [filteredVendors, set_filteredVendors] = useState([]);
  const [showVendorList, set_showVendorList] = useState(false);
  const [vendorId, set_vendorId] = useState(0);
  const [vendorName, set_vendorName] = useState('');

  const [processList, setProcessList] = useState([]);
  const [filteredProcess, set_filteredProcess] = useState([]);
  const [showProcessList, set_showProcessList] = useState(false);
  const [processName, set_processName] = useState('');
  const [processId, set_processId] = useState('');

  const actionOnFromLocation = async item => {
    setFromLocationId(item.id);
    setFromLocationName(item.name);
    setShowFromLocationList(false);
  };

  const actionOnToLocation = item => {
    setToLocationId(item.id);
    setToLocationName(item.name);
    setShowToLocationList(false);
  };

  const actionOnVendors = (id, name) => {
    set_vendorId(id);
    set_vendorName(name);
    set_showVendorList(false);
  };

  const actionOnProcess = (id, name) => {
    set_processId(id);
    set_processName(name);
    set_showProcessList(false);
  };

  const handleSearchFromLocation = text => {
    if (text.trim().length > 0) {
      const filtered = fromLocationList.filter(item =>
        item.name.toLowerCase().includes(text.toLowerCase()),
      );
      setFilteredFromLocation(filtered);
    } else {
      setFilteredFromLocation(fromLocationList);
    }
  };

  const handleSearchToLocation = text => {
    if (text.trim().length > 0) {
      const filtered = toLocationList.filter(item =>
        item.name.toLowerCase().includes(text.toLowerCase()),
      );
      setFilteredToLocation(filtered);
    } else {
      setFilteredToLocation(toLocationList);
    }
  };

  const handleSearchVendor = text => {
    if (text.trim().length > 0) {
      const filtered = Object.keys(vendorsList).filter(id =>
        vendorsList[id].toLowerCase().includes(text.toLowerCase()),
      );
      set_filteredVendors(filtered);
    } else {
      set_filteredVendors(Object.keys(vendorsList));
    }
  };

  const handleSearchProcess = text => {
    if (text.trim().length > 0) {
      const filtered = props.lists.getStockProcesses.filter(process =>
        process.name.toLowerCase().includes(text.toLowerCase()),
      );
      set_filteredProcess(filtered);
    } else {
      set_filteredProcess(props.lists.getStockProcesses);
    }
  };

  const backBtnAction = () => {
    props.backBtnAction();
  };

  const popOkBtnAction = () => {
    props.popOkBtnAction();
  };

  const isValidPhoneNumber = phone => {
    // const phoneRegex = /^[0-9]{10}$/; // Allows only 10-digit numeric values
    const phoneRegex = /^[0-9]+$/; // Only numbers
    return phoneRegex.test(phone);
  };

  const isValidName = name => {
    const nameRegex = /^[a-zA-Z0-9 ()&,.-]+$/; // Allows only letters, numbers, spaces, (), &, -, .
    return nameRegex.test(name);
  };

  const submitAction = async () => {
    if (!name && !address1 && !countryId && !stateId) {
      Alert.alert('Please fill all mandatory fields !');
      return;
    }

    if (phone) {
      if (!isValidPhoneNumber(phone)) {
        Alert.alert(
          'Invalid Mobile Number',
          'Please enter a valid 10-digit mobile number.',
        );
        return;
      }
    }

    if (whatsappPhone) {
      if (!isValidPhoneNumber(whatsappPhone)) {
        Alert.alert(
          'Invalid WhatsApp Number',
          'Please enter a valid 10-digit mobile number.',
        );
        return;
      }
    }

    if (!name || !isValidName(name)) {
      Alert.alert(
        'Invalid Name',
        'Only ( ) , & - these special characters are allowed in Vendor/Customer Name.',
      );
      return;
    }

    if (type === '1' && !currencyId) {
      Alert.alert('Please Select Currency');
      return;
    }

    if (type === '2' && !gst) {
      Alert.alert(
        'Confirm',
        'Do you want to Continue without GST?',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'OK',
            onPress: () => proceedWithSubmission(),
          },
        ],
        {cancelable: false},
      );
      return;
    }

    proceedWithSubmission();
  };

  const proceedWithSubmission = () => {
    const tempObj = {
      vendorcontractor: 1,
      user_type: userType,
      type_code: type,
      group_code: group,
      vendor_code: '',
      terms_id: '',
      priceId: '',
      vendor_name: name,
      address1: address1,
      address2: address2,
      address3: address3,
      city: city,
      pin_code: zipPostalCode,
      mobile: phone,
      panno: '',
      gst: gst,
      whatsapp: whatsappPhone,
      state: stateId === 'ADD_NEW_STATE' ? '0' : stateId,
      country: countryId === 'ADD_NEW_COUNTRY' ? '0' : countryId,
      tax_type: '0',
      invfrm: '0',
      ship_mode: '0',
      region: '0',
      payment_priority: '',
      currency: currencyId,
      addnewstate: newState,
      addnewcountry: newCountry,
      location: locationName,
    };
    props.submitAction(tempObj);
  };

  const backAction = async () => {
    props.backBtnAction();
  };

  // User Type State
  const [userType, setUserType] = useState('1');
  const userTypeRadioButtons = useMemo(
    () => [
      {
        id: '1',
        label: 'Vendor',
        value: 'Vendor',
        selected: userType === 'Vendor',
        labelStyle: {color: '#000'},
      },
      {
        id: '2',
        label: 'Customer',
        value: 'Customer',
        selected: userType === 'Customer',
        labelStyle: {color: '#000'},
      },
      {
        id: '3',
        label: 'Vendor & Customer',
        value: 'Vendor & Customer',
        selected: userType === 'Vendor & Customer',
        labelStyle: {color: '#000'},
      },
      {
        id: '4',
        label: 'Mill',
        value: 'Mill',
        selected: userType === 'Mill',
        labelStyle: {color: '#000'},
      },
    ],
    [userType],
  );

  const handleUserTypeChange = selectedId => {
    const selectedOption = userTypeRadioButtons.find(
      button => button.id === selectedId,
    );
    setUserType(selectedOption.id);
  };

  // Group State
  const [group, setGroup] = useState('1');
  const groupRadioButtons = useMemo(
    () => [
      {
        id: '1',
        label: 'Apparel',
        value: 'Apparel',
        selected: group === 'Apparel',
        labelStyle: {color: '#000'},
      },
      {
        id: '2',
        label: 'Non-Apparel',
        value: 'Non-Apparel',
        selected: group === 'Non-Apparel',
        labelStyle: {color: '#000'},
      },
    ],
    [group],
  );

  const handleGroupChange = selectedId => {
    const selectedOption = groupRadioButtons.find(
      button => button.id === selectedId,
    );
    setGroup(selectedOption.id);
  };

  // Type State
  const [type, setType] = useState('1');
  const typeRadioButtons = useMemo(
    () => [
      {
        id: '1',
        label: 'Overseas',
        value: 'Overseas',
        selected: type === 'Overseas',
        labelStyle: {color: '#000'},
      },
      {
        id: '2',
        label: 'Domestic',
        value: 'Domestic',
        selected: type === 'Domestic',
        labelStyle: {color: '#000'},
      },
    ],
    [type],
  );

  const handleTypeChange = selectedId => {
    const selectedOption = typeRadioButtons.find(
      button => button.id === selectedId,
    );
    setType(selectedOption.id);
  };

  return (
    <View style={[CommonStyles.mainComponentViewStyle]}>
      <View style={[CommonStyles.headerView]}>
        <HeaderComponent
          isBackBtnEnable={true}
          isSettingsEnable={false}
          isChatEnable={false}
          isTImerEnable={false}
          isTitleHeaderEnable={true}
          title={'Create New Out In Process'}
          backBtnAction={() => backBtnAction()}
        />
      </View>

      <KeyboardAwareScrollView
        enableOnAndroid={true}
        extraHeight={130}
        extraScrollHeight={130}
        showsVerticalScrollIndicator={false}
        style={{marginBottom: hp('15%')}}>
        <View
          style={{
            marginBottom: hp('5%'),
            width: '90%',
            marginHorizontal: wp('5%'),
            marginTop: hp('2%'),
          }}>
          {/* User Type */}
          <View style={{marginBottom: 20}}>
            <Text style={{fontWeight: 'bold', color: '#000'}}>User Type</Text>
            <RadioGroup
              containerStyle={{
                width: '100%',
                flexDirection: 'row',
                flexWrap: 'wrap',
                justifyContent: 'flex-start',
              }}
              radioButtons={userTypeRadioButtons}
              onPress={handleUserTypeChange}
              layout="row"
              selectedId={
                userTypeRadioButtons.find(item => item.id === userType)?.id
              }
            />
          </View>

          {/* Group */}
          {/* <View style={{marginBottom: 20}}>
            <Text style={{fontWeight: 'bold', color: '#000'}}>Group:</Text>
            <RadioGroup
              style={{flexDirection: 'row'}}
              radioButtons={groupRadioButtons}
              onPress={handleGroupChange}
              layout="row"
              selectedId={
                groupRadioButtons.find(item => item.id === group)?.id
              }
            />
          </View> */}

          {/* Type */}
          {/* <View style={{marginBottom: 20}}>
            <Text style={{fontWeight: 'bold', color: '#000'}}>Type:</Text>
            <RadioGroup
              style={{flexDirection: 'row'}}
              radioButtons={typeRadioButtons}
              onPress={handleTypeChange}
              layout="row"
              selectedId={
                typeRadioButtons.find(item => item.id === type)?.id
              }
            />
          </View> */}

          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#fff',
              marginTop: hp('2%'),
              // width: '95%',
            }}>
            <TouchableOpacity
              style={{
                flexDirection: 'row',
                borderWidth: 0.5,
                borderColor: '#D8D8D8',
                borderRadius: hp('0.5%'),
                width: '100%',
                backgroundColor: '#f8f8f8',
                justifyContent: 'space-between',
              }}
              onPress={() => {
                set_showVendorList(!showVendorList);
              }}>
              <View>
                <View style={[styles.SectionStyle1, {}]}>
                  <View style={{flexDirection: 'column'}}>
                    <Text
                      style={
                        vendorId
                          ? [styles.dropTextLightStyle]
                          : [styles.dropTextInputStyle]
                      }>
                      {'Vendor* '}
                    </Text>
                    {vendorName ? (
                      <Text style={[styles.dropTextInputStyle]}>
                        {vendorName}
                      </Text>
                    ) : null}
                  </View>
                </View>
              </View>

              <View style={{justifyContent: 'center'}}>
                <Image source={downArrowImg} style={styles.imageStyle} />
              </View>
            </TouchableOpacity>

            {showVendorList && (
              <View style={styles.dropdownContent1}>
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search "
                  onChangeText={handleSearchVendor}
                  placeholderTextColor="#000"
                />
                <ScrollView
                  style={styles.scrollView}
                  nestedScrollEnabled={true}>
                  {filteredVendors.length === 0 ? (
                    <Text style={styles.noCategoriesText}>
                      Sorry, no results found!
                    </Text>
                  ) : (
                    filteredVendors.map((item, index) => (
                      <TouchableOpacity
                        key={index}
                        style={styles.dropdownOption}
                        onPress={() =>
                          actionOnVendors(item, vendorsList[item])
                        }>
                        <Text style={{color: '#000'}}>{vendorsList[item]}</Text>
                      </TouchableOpacity>
                    ))
                  )}
                </ScrollView>
              </View>
            )}
          </View>

          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#fff',
              marginTop: hp('2%'),
            }}>
            <TouchableOpacity
              style={{
                flexDirection: 'row',
                borderWidth: 0.5,
                borderColor: '#D8D8D8',
                borderRadius: hp('0.5%'),
                width: '100%',
                justifyContent: 'space-between',
              }}
              onPress={() => {
                setShowFromLocationList(!showFromLocationList);
              }}>
              <View>
                <View style={[styles.SectionStyle1, {}]}>
                  <View style={{flexDirection: 'column'}}>
                    <Text
                      style={
                        fromLocationId
                          ? [styles.dropTextLightStyle]
                          : [styles.dropTextInputStyle]
                      }>
                      {'From Location '}
                    </Text>
                    {fromLocationId ? (
                      <Text style={[styles.dropTextInputStyle]}>
                        {fromLocationName}
                      </Text>
                    ) : null}
                  </View>
                </View>
              </View>

              <View style={{justifyContent: 'center'}}>
                <Image source={downArrowImg} style={styles.imageStyle} />
              </View>
            </TouchableOpacity>

            {showFromLocationList && (
              <View style={styles.dropdownContent1}>
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search "
                  onChangeText={handleSearchFromLocation}
                  placeholderTextColor="#000"
                />
                <ScrollView
                  style={styles.scrollView}
                  nestedScrollEnabled={true}>
                  {filteredFromLocation.length === 0 ? (
                    <Text style={styles.noCategoriesText}>
                      Sorry, no results found!
                    </Text>
                  ) : (
                    filteredFromLocation.map((item, index) => (
                      <TouchableOpacity
                        key={index}
                        style={styles.dropdownOption}
                        onPress={() => actionOnFromLocation(item)}>
                        <Text style={{color: '#000'}}>{item.name}</Text>
                      </TouchableOpacity>
                    ))
                  )}
                </ScrollView>
              </View>
            )}
          </View>

          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#fff',
              marginTop: hp('2%'),
            }}>
            <TouchableOpacity
              style={{
                flexDirection: 'row',
                borderWidth: 0.5,
                borderColor: '#D8D8D8',
                borderRadius: hp('0.5%'),
                width: '100%',
                justifyContent: 'space-between',
              }}
              onPress={() => {
                setShowToLocationList(!showToLocationList);
              }}>
              <View>
                <View style={[styles.SectionStyle1, {}]}>
                  <View style={{flexDirection: 'column'}}>
                    <Text
                      style={
                        toLocationId
                          ? [styles.dropTextLightStyle]
                          : [styles.dropTextInputStyle]
                      }>
                      {'To Location '}
                    </Text>
                    {toLocationId ? (
                      <Text style={[styles.dropTextInputStyle]}>
                        {toLocationName}
                      </Text>
                    ) : null}
                  </View>
                </View>
              </View>

              <View style={{justifyContent: 'center'}}>
                <Image source={downArrowImg} style={styles.imageStyle} />
              </View>
            </TouchableOpacity>

            {showToLocationList && (
              <View style={styles.dropdownContent1}>
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search "
                  onChangeText={handleSearchToLocation}
                  placeholderTextColor="#000"
                />
                <ScrollView
                  style={styles.scrollView}
                  nestedScrollEnabled={true}>
                  {filteredToLocation.length === 0 ? (
                    <Text style={styles.noCategoriesText}>
                      Sorry, no results found!
                    </Text>
                  ) : (
                    filteredToLocation.map((item, index) => (
                      <TouchableOpacity
                        key={index}
                        style={styles.dropdownOption}
                        onPress={() => actionOnToLocation(item)}>
                        <Text style={{color: '#000'}}>{item.name}</Text>
                      </TouchableOpacity>
                    ))
                  )}
                </ScrollView>
              </View>
            )}
          </View>

          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#fff',
              marginTop: hp('2%'),
            }}>
            <TouchableOpacity
              style={{
                flexDirection: 'row',
                borderWidth: 0.5,
                borderColor: '#D8D8D8',
                borderRadius: hp('0.5%'),
                width: wp('90%'),
              }}
              onPress={() => {
                set_showProcessList(!showProcessList);
              }}>
              <View>
                <View style={[styles.SectionStyle1, {}]}>
                  <View style={{flexDirection: 'column'}}>
                    <Text
                      style={
                        processId
                          ? [styles.dropTextLightStyle]
                          : [styles.dropTextInputStyle]
                      }>
                      {'Process'}
                    </Text>
                    {processId ? (
                      <Text style={[styles.dropTextInputStyle]}>
                        {processName}
                      </Text>
                    ) : null}
                  </View>
                </View>
              </View>

              <View style={{justifyContent: 'center'}}>
                <Image source={downArrowImg} style={styles.imageStyle} />
              </View>
            </TouchableOpacity>

            {showProcessList && (
              <View style={styles.dropdownContent1}>
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search "
                  onChangeText={handleSearchProcess}
                  placeholderTextColor="#000"
                />
                <ScrollView
                  style={styles.scrollView}
                  nestedScrollEnabled={true}>
                  {filteredProcess.length === 0 ? (
                    <Text style={styles.noCategoriesText}>
                      Sorry, no results found!
                    </Text>
                  ) : (
                    filteredProcess.map((item, index) => (
                      <TouchableOpacity
                        key={index}
                        style={styles.dropdownOption}
                        onPress={() => actionOnProcess(item)}>
                        <Text style={{color: '#000'}}>{item.name}</Text>
                      </TouchableOpacity>
                    ))
                  )}
                </ScrollView>
              </View>
            )}
          </View>

          <View style={{marginTop: hp('2%')}}>
            <TextInput
              label="Name *"
              value={name}
              mode="outlined"
              onChangeText={text => setName(text)}
            />
          </View>
        </View>
      </KeyboardAwareScrollView>

      <View style={CommonStyles.bottomViewComponentStyle}>
        <BottomComponent
          rightBtnTitle={'Save'}
          leftBtnTitle={'Back'}
          isLeftBtnEnable={true}
          rigthBtnState={true}
          isRightBtnEnable={true}
          rightButtonAction={async () => submitAction()}
          leftButtonAction={async () => backAction()}
        />
      </View>

      {props.isPopUp ? (
        <View style={CommonStyles.customPopUpStyle}>
          <AlertComponent
            header={props.popUpAlert}
            message={props.popUpMessage}
            isLeftBtnEnable={props.isPopLeft}
            isRightBtnEnable={true}
            leftBtnTilte={'NO'}
            rightBtnTilte={props.popUpRBtnTitle}
            popUpRightBtnAction={() => popOkBtnAction()}
            popUpLeftBtnAction={() => popCancelBtnAction()}
          />
        </View>
      ) : null}

      {props.isLoading === true ? (
        <LoaderComponent
          isLoader={true}
          loaderText={Constant.LOADER_MESSAGE}
          isButtonEnable={false}
        />
      ) : null}
    </View>
  );
};

export default CreateNewOutInProcessUI;

const styles = StyleSheet.create({
  popSearchViewStyle: {
    height: hp('40%'),
    width: wp('90%'),
    backgroundColor: '#f0f0f0',
    // bottom: 220,
    // position: 'absolute',
    // flex:1,
    alignSelf: 'center',
    // borderTopRightRadius: 15,
    // borderTopLeftRadius: 15,
    alignItems: 'center',
  },
  popSearchViewStyle1: {
    width: wp('90%'),
    backgroundColor: '#f0f0f0',
    // bottom: 220,
    // position: 'absolute',
    // flex:1,
    alignSelf: 'center',
    alignItems: 'center',
  },

  flatcontainer: {
    flex: 1,
  },

  flatview: {
    height: hp('8%'),
    marginBottom: hp('0.3%'),
    alignContent: 'center',
    justifyContent: 'center',
    borderBottomColor: 'black',
    borderBottomWidth: wp('0.1%'),
    width: wp('80%'),
    alignItems: 'center',
  },

  SectionStyle1: {
    flexDirection: 'row',
    // justifyContent: "center",
    alignItems: 'center',
    height: hp('7%'),
    width: wp('75%'),
    borderRadius: hp('0.5%'),
    // alignSelf: "center",
    // backgroundColor: "grey",
  },

  imageStyle: {
    // margin: "4%",
    height: wp('12%'),
    aspectRatio: 1,
    marginRight: wp('8%'),
    resizeMode: 'stretch',
  },

  dropTextInputStyle: {
    fontWeight: 'normal',
    fontSize: 18,
    marginLeft: wp('4%'),
    color: 'black',
    width: wp('80%'),
  },

  dropTextLightStyle: {
    fontWeight: 300,
    fontSize: 12,
    width: wp('60%'),
    alignSelf: 'flex-start',
    marginTop: hp('1%'),
    marginLeft: wp('4%'),
    color: '#000',
  },
  wrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    marginTop: hp('2%'),
    width: '100%',
  },
  table: {
    width: '95%', // Reduces extra space on the sides
    backgroundColor: '#fff',
    elevation: 1,
    borderRadius: 5,
    overflow: 'hidden',
  },
  table_head: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#5177c0',
    alignItems: 'center',
    paddingVertical: 5,
    paddingHorizontal: 5,
  },
  table_head_captions: {
    fontSize: 14,
    color: 'white',
    fontWeight: '600',
    textAlign: 'center',
  },
  table_body_single_row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#ddd',
    paddingVertical: 7,
    backgroundColor: '#fff',
    paddingHorizontal: 5,
  },
  table_data: {
    fontSize: 13,
    color: '#333',
  },
  searchInput: {
    marginTop: 10,
    borderRadius: 10,
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginHorizontal: 10,
    paddingLeft: 10,
    marginBottom: 10,
    color: '#000000',
  },
  scrollView: {
    maxHeight: 150,
  },
  dropdownOption: {
    paddingHorizontal: 10,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  dropdownContent1: {
    elevation: 5,
    // height: 220,
    maxHeight: 220,
    alignSelf: 'center',
    width: '98%',
    backgroundColor: '#fff',
    borderRadius: 10,
    borderColor: 'lightgray', // Optional: Adds subtle border (for effect)
    borderWidth: 1,
    marginTop: 3,
  },
  noCategoriesText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
  },
});
