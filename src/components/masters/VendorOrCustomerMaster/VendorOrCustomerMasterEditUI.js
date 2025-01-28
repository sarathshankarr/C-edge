import React, {useState, useRef, useEffect, useContext, useMemo} from 'react';
import {
  View,
  FlatList,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import * as Constant from '../../../utils/constants/constant';
import CommonStyles from '../../../utils/commonStyles/commonStyles';
import HeaderComponent from '../../../utils/commonComponents/headerComponent';
import LoaderComponent from '../../../utils/commonComponents/loaderComponent';
import AlertComponent from '../../../utils/commonComponents/alertComponent';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import BottomComponent from '../../../utils/commonComponents/bottomComponent';
import {ColorContext} from '../../colorTheme/colorTheme';
import {TextInput} from 'react-native-paper';
import {RadioGroup} from 'react-native-radio-buttons-group';
let downArrowImg = require('./../../../../assets/images/png/dropDownImg.png');

const VendorOrCustomerMasterEditUI = ({route, ...props}) => {
  const {colors} = useContext(ColorContext);

  useEffect(() => {
    if (props.itemsObj.updateVendor) {
      if (props.itemsObj?.updateVendor?.user_type) {
        handleUserTypeChange(props.itemsObj?.updateVendor?.user_type);
      }
      if (props.itemsObj.updateVendor.group_code) {
        handleGroupChange(props.itemsObj.updateVendor.group_code);
      }
      if (props.itemsObj.updateVendor.type_code) {
        handleTypeChange(props.itemsObj.updateVendor.type_code);
      }
      if (props.itemsObj.updateVendor.vendor_name) {
        setName(props.itemsObj.updateVendor.vendor_name);
      }
      if (props.itemsObj.updateVendor.address1) {
        setAddress1(props.itemsObj.updateVendor.address1);
      }
      if (props.itemsObj.updateVendor.address2) {
        setAddress2(props.itemsObj.updateVendor.address2);
      }
      if (props.itemsObj.updateVendor.address3) {
        setAddress3(props.itemsObj.updateVendor.address3);
      }
      if (props.itemsObj.updateVendor.country) {
        setCountryId(props.itemsObj.updateVendor.country);
        setCountryName(
          props.itemsObj.countryMap[props.itemsObj.updateVendor.country],
        );

        if(!stateName){
          props.getStatelist(props.itemsObj.updateVendor.country);
        }

        const countryMapList = Object.keys(props.itemsObj.countryMap).map(
          key => ({
            id: key,
            name: props.itemsObj.countryMap[key],
          }),
        );
        setFilteredCountry(countryMapList);
        setCountryList(countryMapList);
      }
      if (props.itemsObj.updateVendor.city) {
        setCity(props.itemsObj.updateVendor.city);
      }
      if (props.itemsObj.updateVendor.state && props.itemsObj?.state?.stateMap ) {
        setStateId(props.itemsObj.updateVendor.state);
        setStateName(
          props.itemsObj.state.stateMap[props.itemsObj.updateVendor.state],
        );

        const stateMapList = Object.keys(props.itemsObj.state.stateMap).map(
          key => ({
            id: key,
            name: props.itemsObj.state.stateMap[key],
          }),
        );
        setFilteredState(stateMapList);
        setStateList(stateMapList);
      }
      if (props.itemsObj.updateVendor.pin_code) {
        setZipPostalCode(props.itemsObj.updateVendor.pin_code);
      }
      if (props.itemsObj.updateVendor.tele_phone) {
        setPhone(props.itemsObj.updateVendor.tele_phone);
      }
      if (props.itemsObj.updateVendor.whatsapp) {
        setWhatsappPhone(props.itemsObj.updateVendor.whatsapp);
      }
      if (props.itemsObj.updateVendor.location) {
        setLocationName(props.itemsObj.updateVendor.location);
      }
      if (props.itemsObj.updateVendor.currency) {
        setCurrencyId(props.itemsObj.updateVendor.currency);
        setCurrencyName(
          props.itemsObj.currencys[props.itemsObj.updateVendor.currency],
        );

        const currencysList = Object.keys(props.itemsObj.currencys).map(
          key => ({
            id: key,
            name: props.itemsObj.currencys[key],
          }),
        );
        setFilteredCurrency(currencysList);
        setCurrencyList(currencysList);
      }
      if (props.itemsObj.updateVendor.gst) {
        set_shiftList(props.itemsObj.updateVendor.gst);
      }
    }
    console.log('items obj ===> ', props.itemsObj);
  }, [props.itemsObj]);

  const [name, setName] = useState('');
  const [address1, setAddress1] = useState('');
  const [address2, setAddress2] = useState('');
  const [address3, setAddress3] = useState('');
  const [city, setCity] = useState('');
  const [zipPostalCode, setZipPostalCode] = useState('');
  const [phone, setPhone] = useState('');
  const [whatsappPhone, setWhatsappPhone] = useState('');
  const [gst, setGst] = useState('');
  const [locationName, setLocationName] = useState('');

  const [countryList, setCountryList] = useState([]);
  const [filteredCountry, setFilteredCountry] = useState([]);
  const [showCountryList, setShowCountryList] = useState(false);
  const [countryName, setCountryName] = useState('');
  const [countryId, setCountryId] = useState('');

  const actionOnCountry = item => {
    setCountryId(item.id);
    setCountryName(item.name);
    setShowCountryList(false);
  };

  const handleSearchCountry = text => {
    if (text.trim().length > 0) {
      const filtered = countryList.filter(item =>
        item.name.toLowerCase().includes(text.toLowerCase()),
      );
      setFilteredCountry(filtered);
    } else {
      setFilteredCountry(countryList);
    }
  };

  // State
  const [stateList, setStateList] = useState([]);
  const [filteredState, setFilteredState] = useState([]);
  const [showStateList, setShowStateList] = useState(false);
  const [stateName, setStateName] = useState('');
  const [stateId, setStateId] = useState('');
  const [showState, setShowState] = useState(false);

  const actionOnState = item => {
    setStateId(item.id);
    setStateName(item.name);
    setShowStateList(false);
  };

  const handleSearchState = text => {
    if (text.trim().length > 0) {
      const filtered = stateList.filter(item =>
        item.name.toLowerCase().includes(text.toLowerCase()),
      );
      setFilteredState(filtered);
    } else {
      setFilteredState(stateList);
    }
  };

  // Currency
  const [currencyList, setCurrencyList] = useState([]);
  const [filteredCurrency, setFilteredCurrency] = useState([]);
  const [showCurrencyList, setShowCurrencyList] = useState(false);
  const [currencyName, setCurrencyName] = useState('');
  const [currencyId, setCurrencyId] = useState('');
  const [showCurrency, setShowCurrency] = useState(false);

  const actionOnCurrency = item => {
    setCurrencyId(item.id);
    setCurrencyName(item.name);
    setShowCurrencyList(false);
  };

  const handleSearchCurrency = text => {
    if (text.trim().length > 0) {
      const filtered = currencyList.filter(item =>
        item.name.toLowerCase().includes(text.toLowerCase()),
      );
      setFilteredCurrency(filtered);
    } else {
      setFilteredCurrency(currencyList);
    }
  };

  const backBtnAction = () => {
    props.backBtnAction();
  };

  const popOkBtnAction = () => {
    props.popOkBtnAction();
  };

  const submitAction = async () => {
    props.submitAction(
      props?.itemsObj?.designId,
      remarks1,
      statusArrayId,
      remarks2,
    );
  };
  // User Type State
  const [userType, setUserType] = useState('Vendor');
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
    setUserType(selectedOption.value);
  };

  // Group State
  const [group, setGroup] = useState('Apparel');
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
    setGroup(selectedOption.value);
  };

  // Type State
  const [type, setType] = useState('Overseas');
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
    setType(selectedOption.value);
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
          title={'Vendor/customer Master Edit'}
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
                userTypeRadioButtons.find(item => item.value === userType)?.id
              }
            />
          </View>

          {/* Group */}
          <View style={{marginBottom: 20}}>
            <Text style={{fontWeight: 'bold', color: '#000'}}>Group:</Text>
            <RadioGroup
              style={{flexDirection: 'row'}}
              radioButtons={groupRadioButtons}
              onPress={handleGroupChange}
              layout="row"
              selectedId={
                groupRadioButtons.find(item => item.value === group)?.id
              }
            />
          </View>

          {/* Type */}
          <View style={{marginBottom: 20}}>
            <Text style={{fontWeight: 'bold', color: '#000'}}>Type:</Text>
            <RadioGroup
              style={{flexDirection: 'row'}}
              radioButtons={typeRadioButtons}
              onPress={handleTypeChange}
              layout="row"
              selectedId={
                typeRadioButtons.find(item => item.value === type)?.id
              }
            />
          </View>

          <View style={{marginTop: hp('2%')}}>
            <TextInput
              label="Name *"
              value={name}
              mode="outlined"
              editable={false}
              style={{backgroundColor: '#e8e8e8'}}
              onChangeText={text => setName(text)}
            />
          </View>

          <View style={{marginTop: hp('2%')}}>
            <TextInput
              label="Address1 *"
              value={address1}
              mode="outlined"
              placeholder="Plot no/flat no/shop no"
              numberOfLines={3}
              multiline
              onChangeText={text => setAddress1(text)}
            />
          </View>
          <View style={{marginTop: hp('2%')}}>
            <TextInput
              label="Address2 "
              value={address2}
              mode="outlined"
              placeholder="Landmark/area/street"
              numberOfLines={3}
              multiline
              onChangeText={text => setAddress2(text)}
            />
          </View>
          <View style={{marginTop: hp('2%')}}>
            <TextInput
              label="Address3 *"
              value={address3}
              mode="outlined"
              placeholder="City/town"
              numberOfLines={3}
              multiline
              onChangeText={text => setAddress3(text)}
            />
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
                setShowCountryList(!showCountryList);
              }}>
              <View>
                <View style={[styles.SectionStyle1, {}]}>
                  <View style={{flexDirection: 'column'}}>
                    <Text
                      style={
                        countryId
                          ? [styles.dropTextLightStyle]
                          : [styles.dropTextInputStyle]
                      }>
                      {'Country *'}
                    </Text>
                    {countryId ? (
                      <Text style={[styles.dropTextInputStyle]}>
                        {countryName}
                      </Text>
                    ) : null}
                  </View>
                </View>
              </View>

              <View style={{justifyContent: 'center'}}>
                <Image source={downArrowImg} style={styles.imageStyle} />
              </View>
            </TouchableOpacity>

            {showCountryList && (
              <View style={styles.dropdownContent1}>
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search "
                  onChangeText={handleSearchCountry}
                  placeholderTextColor="#000"
                />
                <ScrollView
                  style={styles.scrollView}
                  nestedScrollEnabled={true}>
                  {filteredCountry.length === 0 ? (
                    <Text style={styles.noCategoriesText}>
                      Sorry, no results found!
                    </Text>
                  ) : (
                    filteredCountry.map((item, index) => (
                      <TouchableOpacity
                        key={index}
                        style={styles.dropdownOption}
                        onPress={() => actionOnCountry(item)}>
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
                setShowStateList(!showStateList);
              }}>
              <View>
                <View style={[styles.SectionStyle1, {}]}>
                  <View style={{flexDirection: 'column'}}>
                    <Text
                      style={
                        stateId
                          ? [styles.dropTextLightStyle]
                          : [styles.dropTextInputStyle]
                      }>
                      {'State *'}
                    </Text>
                    {stateId ? (
                      <Text style={[styles.dropTextInputStyle]}>
                        {stateName}
                      </Text>
                    ) : null}
                  </View>
                </View>
              </View>

              <View style={{justifyContent: 'center'}}>
                <Image source={downArrowImg} style={styles.imageStyle} />
              </View>
            </TouchableOpacity>

            {showStateList && (
              <View style={styles.dropdownContent1}>
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search "
                  onChangeText={handleSearchState}
                  placeholderTextColor="#000"
                />
                <ScrollView
                  style={styles.scrollView}
                  nestedScrollEnabled={true}>
                  {filteredState.length === 0 ? (
                    <Text style={styles.noCategoriesText}>
                      Sorry, no results found!
                    </Text>
                  ) : (
                    filteredState.map((item, index) => (
                      <TouchableOpacity
                        key={index}
                        style={styles.dropdownOption}
                        onPress={() => actionOnState(item)}>
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
              label="city"
              value={city}
              mode="outlined"
              onChangeText={text => setCity(text)}
            />
          </View>
          <View style={{marginTop: hp('2%')}}>
            <TextInput
              label="Zip PostalCode"
              value={zipPostalCode}
              mode="outlined"
              onChangeText={text => setZipPostalCode(text)}
            />
          </View>
          <View style={{marginTop: hp('2%')}}>
            <TextInput
              label="Phone"
              value={phone}
              mode="outlined"
              onChangeText={text => setPhone(text)}
            />
          </View>
          <View style={{marginTop: hp('2%')}}>
            <TextInput
              label="Whatsapp Phone"
              value={whatsappPhone}
              mode="outlined"
              onChangeText={text => setWhatsappPhone(text)}
            />
          </View>
          <View style={{marginTop: hp('2%')}}>
            <TextInput
              label="Location Name"
              value={locationName}
              mode="outlined"
              editable={false}
              style={{backgroundColor:'#e8e8e8'}}
              onChangeText={text => setLocationName(text)}
            />
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
                setShowCurrencyList(!showCurrencyList);
              }}>
              <View>
                <View style={[styles.SectionStyle1, {}]}>
                  <View style={{flexDirection: 'column'}}>
                    <Text
                      style={
                        currencyId
                          ? [styles.dropTextLightStyle]
                          : [styles.dropTextInputStyle]
                      }>
                      {'Currency'}
                    </Text>
                    {currencyId ? (
                      <Text style={[styles.dropTextInputStyle]}>
                        {currencyName}
                      </Text>
                    ) : null}
                  </View>
                </View>
              </View>

              <View style={{justifyContent: 'center'}}>
                <Image source={downArrowImg} style={styles.imageStyle} />
              </View>
            </TouchableOpacity>

            {showCurrencyList && (
              <View style={styles.dropdownContent1}>
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search "
                  onChangeText={handleSearchCurrency}
                  placeholderTextColor="#000"
                />
                <ScrollView
                  style={styles.scrollView}
                  nestedScrollEnabled={true}>
                  {filteredCurrency.length === 0 ? (
                    <Text style={styles.noCategoriesText}>
                      Sorry, no results found!
                    </Text>
                  ) : (
                    filteredCurrency.map((item, index) => (
                      <TouchableOpacity
                        key={index}
                        style={styles.dropdownOption}
                        onPress={() => actionOnCurrency(item)}>
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
              label="GST"
              value={gst}
              mode="outlined"
              onChangeText={text => setGst(text)}
            />
          </View>
        </View>
      </KeyboardAwareScrollView>

      <View style={CommonStyles.bottomViewComponentStyle}>
        <BottomComponent
          rightBtnTitle={'Submit'}
          leftBtnTitle={'Back'}
          isLeftBtnEnable={true}
          rigthBtnState={true}
          isRightBtnEnable={true}
          leftButtonAction={() => backBtnAction()}
          rightButtonAction={async () => submitAction()}
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

export default VendorOrCustomerMasterEditUI;

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
