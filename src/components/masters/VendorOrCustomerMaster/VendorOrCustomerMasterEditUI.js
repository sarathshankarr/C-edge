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
  const styles = getStyles(colors);

  useEffect(() => {
    // if (props?.itemsArray) {
    //   if (props.itemsArray.machineNosMap) {
    //     set_filteredmachineNo(props.itemsArray.machineNosMap);
    //     setMachineNoList(props.itemsArray.machineNosMap);
    //   }
    //   if (props.itemsArray.empMap) {
    //     set_filteredattendedBy(props.itemsArray.empMap);
    //     setAttendedByList(props.itemsArray.empMap);
    //   }
    //   if (props.itemsArray.shiftMap) {
    //     set_shiftList(props.itemsArray.shiftMap);
    //   }
    // }
  }, [props.itemsArray]);

  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [address1, setAddress1] = useState('');
  const [address2, setAddress2] = useState('');
  const [address3, setAddress3] = useState('');
  const [city, setCity] = useState('');
  const [zipPostalCode, setZipPostalCode] = useState('');
  const [phone, setPhone] = useState('');
  const [whatsappPhone, setWhatsappPhone] = useState('');
  const [panNo, setPanNo] = useState('');
  const [gst, setGst] = useState('');


  const [countryList, setCountryList] = useState([]);
  const [filteredCountry, setFilteredCountry] = useState([]);
  const [showCountryList, setShowCountryList] = useState(false);
  const [countryName, setCountryName] = useState('');
  const [countryId, setCountryId] = useState('');
  const [showCountry, setShowCountry] = useState(false);
  
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
  
  
  // Religion
  const [religionList, setReligionList] = useState([]);
  const [filteredReligion, setFilteredReligion] = useState([]);
  const [showReligionList, setShowReligionList] = useState(false);
  const [religionName, setReligionName] = useState('');
  const [religionId, setReligionId] = useState('');
  const [showReligion, setShowReligion] = useState(false);
  
  const actionOnReligion = item => {
    setReligionId(item.id);
    setReligionName(item.name);
    setShowReligionList(false);
  };
  
  const handleSearchReligion = text => {
    if (text.trim().length > 0) {
      const filtered = religionList.filter(item =>
        item.name.toLowerCase().includes(text.toLowerCase()),
      );
      setFilteredReligion(filtered);
    } else {
      setFilteredReligion(religionList);
    }
  };

  // Shipping Terms
const [shippingTermsList, setShippingTermsList] = useState([]);
const [filteredShippingTerms, setFilteredShippingTerms] = useState([]);
const [showShippingTermsList, setShowShippingTermsList] = useState(false);
const [shippingTermsName, setShippingTermsName] = useState('');
const [shippingTermsId, setShippingTermsId] = useState('');
const [showShippingTerms, setShowShippingTerms] = useState(false);

const actionOnShippingTerms = item => {
  setShippingTermsId(item.id);
  setShippingTermsName(item.name);
  setShowShippingTermsList(false);
};

const handleSearchShippingTerms = text => {
  if (text.trim().length > 0) {
    const filtered = shippingTermsList.filter(item =>
      item.name.toLowerCase().includes(text.toLowerCase()),
    );
    setFilteredShippingTerms(filtered);
  } else {
    setFilteredShippingTerms(shippingTermsList);
  }
};

 // Price 
const [priceList, setPriceList] = useState([]);
const [filteredPriceList, setFilteredPriceList] = useState([]);
const [showPriceList, setShowPriceList] = useState(false);
const [priceValue, setPriceValue] = useState('');
const [priceId, setPriceId] = useState('');
const [showPrice, setShowPrice] = useState(false);

const actionOnPrice = item => {
  setPriceId(item.id);
  setPriceValue(item.value);
  setShowPriceList(false);
};

const handleSearchPrice = text => {
  if (text.trim().length > 0) {
    const filtered = priceList.filter(item =>
      item.value.toLowerCase().includes(text.toLowerCase()),
    );
    setFilteredPriceList(filtered);
  } else {
    setFilteredPriceList(priceList);
  }
};


// Payment Priority
const [paymentPriorityList, setPaymentPriorityList] = useState([]);
const [filteredPaymentPriority, setFilteredPaymentPriority] = useState([]);
const [showPaymentPriorityList, setShowPaymentPriorityList] = useState(false);
const [paymentPriorityName, setPaymentPriorityName] = useState('');
const [paymentPriorityId, setPaymentPriorityId] = useState('');
const [showPaymentPriority, setShowPaymentPriority] = useState(false);

const actionOnPaymentPriority = item => {
  setPaymentPriorityId(item.id);
  setPaymentPriorityName(item.name);
  setShowPaymentPriorityList(false);
};

const handleSearchPaymentPriority = text => {
  if (text.trim().length > 0) {
    const filtered = paymentPriorityList.filter(item =>
      item.name.toLowerCase().includes(text.toLowerCase()),
    );
    setFilteredPaymentPriority(filtered);
  } else {
    setFilteredPaymentPriority(paymentPriorityList);
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

// Tax Type
const [taxTypeList, setTaxTypeList] = useState([]);
const [filteredTaxType, setFilteredTaxType] = useState([]);
const [showTaxTypeList, setShowTaxTypeList] = useState(false);
const [taxTypeName, setTaxTypeName] = useState('');
const [taxTypeId, setTaxTypeId] = useState('');
const [showTaxType, setShowTaxType] = useState(false);

const actionOnTaxType = item => {
  setTaxTypeId(item.id);
  setTaxTypeName(item.name);
  setShowTaxTypeList(false);
};

const handleSearchTaxType = text => {
  if (text.trim().length > 0) {
    const filtered = taxTypeList.filter(item =>
      item.name.toLowerCase().includes(text.toLowerCase()),
    );
    setFilteredTaxType(filtered);
  } else {
    setFilteredTaxType(taxTypeList);
  }
};

// Invoice Formats
const [invoiceFormatList, setInvoiceFormatList] = useState([]);
const [filteredInvoiceFormat, setFilteredInvoiceFormat] = useState([]);
const [showInvoiceFormatList, setShowInvoiceFormatList] = useState(false);
const [invoiceFormatName, setInvoiceFormatName] = useState('');
const [invoiceFormatId, setInvoiceFormatId] = useState('');
const [showInvoiceFormat, setShowInvoiceFormat] = useState(false);

const actionOnInvoiceFormat = item => {
  setInvoiceFormatId(item.id);
  setInvoiceFormatName(item.name);
  setShowInvoiceFormatList(false);
};

const handleSearchInvoiceFormat = text => {
  if (text.trim().length > 0) {
    const filtered = invoiceFormatList.filter(item =>
      item.name.toLowerCase().includes(text.toLowerCase()),
    );
    setFilteredInvoiceFormat(filtered);
  } else {
    setFilteredInvoiceFormat(invoiceFormatList);
  }
};

// Ship Mode
const [shipModeList, setShipModeList] = useState([]);
const [filteredShipMode, setFilteredShipMode] = useState([]);
const [showShipModeList, setShowShipModeList] = useState(false);
const [shipModeName, setShipModeName] = useState('');
const [shipModeId, setShipModeId] = useState('');
const [showShipMode, setShowShipMode] = useState(false);

const actionOnShipMode = item => {
  setShipModeId(item.id);
  setShipModeName(item.name);
  setShowShipModeList(false);
};

const handleSearchShipMode = text => {
  if (text.trim().length > 0) {
    const filtered = shipModeList.filter(item =>
      item.name.toLowerCase().includes(text.toLowerCase()),
    );
    setFilteredShipMode(filtered);
  } else {
    setFilteredShipMode(shipModeList);
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

  // In House (Contractor) State
  const [inHouse, setInHouse] = useState('Vendor');
  const inHouseRadioButtons = useMemo(
    () => [
      {
        id: '1',
        label: 'Vendor',
        value: 'Vendor',
        selected: inHouse === 'Vendor',
        labelStyle: {color: '#000'},
      },
      {
        id: '2',
        label: 'Contractor',
        value: 'Contractor',
        selected: inHouse === 'Contractor',
        labelStyle: {color: '#000'},
      },
    ],
    [inHouse],
  );

  const handleInHouseChange = selectedId => {
    const selectedOption = inHouseRadioButtons.find(
      button => button.id === selectedId,
    );
    setInHouse(selectedOption.value);
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

          {/* In House (Contractor) */}
          <View style={{marginBottom: 20}}>
            <Text style={{fontWeight: 'bold', color: '#000'}}>
              In House (Contractor):
            </Text>
            <RadioGroup
              style={{flexDirection: 'row'}}
              radioButtons={inHouseRadioButtons}
              onPress={handleInHouseChange}
              layout="row"
              selectedId={
                inHouseRadioButtons.find(item => item.value === inHouse)?.id
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

          {/* code text  */}
          <View style={{marginTop: hp('2%')}}>
            <TextInput
              label="Code"
              value={code}
              mode="outlined"
              onChangeText={text => setCode(text)}
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
                setShowShippingTermsList(!showShippingTermsList);
              }}>
              <View>
                <View style={[styles.SectionStyle1, {}]}>
                  <View style={{flexDirection: 'column'}}>
                    <Text
                      style={
                        shippingTermsId
                          ? [styles.dropTextLightStyle]
                          : [styles.dropTextInputStyle]
                      }>
                      {'Shipping Terms'}
                    </Text>
                    {shippingTermsId ? (
                      <Text style={[styles.dropTextInputStyle]}>
                        {shippingTermsName}
                      </Text>
                    ) : null}
                  </View>
                </View>
              </View>

              <View style={{justifyContent: 'center'}}>
                <Image source={downArrowImg} style={styles.imageStyle} />
              </View>
            </TouchableOpacity>

            {showShippingTermsList && (
              <View style={styles.dropdownContent1}>
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search "
                  onChangeText={handleSearchShippingTerms}
                  placeholderTextColor="#000"
                />
                <ScrollView
                  style={styles.scrollView}
                  nestedScrollEnabled={true}>
                  {filteredShippingTerms.length === 0 ? (
                    <Text style={styles.noCategoriesText}>
                      Sorry, no results found!
                    </Text>
                  ) : (
                    filteredShippingTerms.map((item, index) => (
                      <TouchableOpacity
                        key={index}
                        style={styles.dropdownOption}
                        onPress={() => actionOnShippingTerms(item)}>
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
                setShowPriceList(!showPriceList);
              }}>
              <View>
                <View style={[styles.SectionStyle1, {}]}>
                  <View style={{flexDirection: 'column'}}>
                    <Text
                      style={
                        priceId
                          ? [styles.dropTextLightStyle]
                          : [styles.dropTextInputStyle]
                      }>
                      {'Price'}
                    </Text>
                    {priceId ? (
                      <Text style={[styles.dropTextInputStyle]}>
                        {priceValue}
                      </Text>
                    ) : null}
                  </View>
                </View>
              </View>

              <View style={{justifyContent: 'center'}}>
                <Image source={downArrowImg} style={styles.imageStyle} />
              </View>
            </TouchableOpacity>

            {showPriceList && (
              <View style={styles.dropdownContent1}>
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search "
                  onChangeText={handleSearchPrice}
                  placeholderTextColor="#000"
                />
                <ScrollView
                  style={styles.scrollView}
                  nestedScrollEnabled={true}>
                  {filteredPriceList.length === 0 ? (
                    <Text style={styles.noCategoriesText}>
                      Sorry, no results found!
                    </Text>
                  ) : (
                    filteredPriceList.map((item, index) => (
                      <TouchableOpacity
                        key={index}
                        style={styles.dropdownOption}
                        onPress={() => actionOnPrice(item)}>
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
          <View style={{marginTop: hp('2%')}}>
            <TextInput
              label="Address1 *"
              value={address1}
              mode="outlined"
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
              numberOfLines={3}
              multiline
              onChangeText={text => setAddress3(text)}
            />
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
              label="Pan No"
              value={panNo}
              mode="outlined"
              onChangeText={text => setWhatsappPhone(text)}
            />
          </View>
          <View style={{marginTop: hp('2%')}}>
            <TextInput
              label="GST"
              value={gst}
              mode="outlined"
              onChangeText={text => setGst(text)}
            />
          </View>

          {/* Country Dropdown */}

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
                setShowReligion(!showReligionList);
              }}>
              <View>
                <View style={[styles.SectionStyle1, {}]}>
                  <View style={{flexDirection: 'column'}}>
                    <Text
                      style={
                        religionId
                          ? [styles.dropTextLightStyle]
                          : [styles.dropTextInputStyle]
                      }>
                      {'Religion '}
                    </Text>
                    {countryId ? (
                      <Text style={[styles.dropTextInputStyle]}>
                        {religionName}
                      </Text>
                    ) : null}
                  </View>
                </View>
              </View>

              <View style={{justifyContent: 'center'}}>
                <Image source={downArrowImg} style={styles.imageStyle} />
              </View>
            </TouchableOpacity>

            {showReligionList && (
              <View style={styles.dropdownContent1}>
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search "
                  onChangeText={handleSearchReligion}
                  placeholderTextColor="#000"
                />
                <ScrollView
                  style={styles.scrollView}
                  nestedScrollEnabled={true}>
                  {filteredReligion.length === 0 ? (
                    <Text style={styles.noCategoriesText}>
                      Sorry, no results found!
                    </Text>
                  ) : (
                    filteredReligion.map((item, index) => (
                      <TouchableOpacity
                        key={index}
                        style={styles.dropdownOption}
                        onPress={() => actionOnReligion(item)}>
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
                setShowPaymentPriorityList(!showPaymentPriorityList);
              }}>
              <View>
                <View style={[styles.SectionStyle1, {}]}>
                  <View style={{flexDirection: 'column'}}>
                    <Text
                      style={
                        paymentPriorityId
                          ? [styles.dropTextLightStyle]
                          : [styles.dropTextInputStyle]
                      }>
                      {'Payment Priority '}
                    </Text>
                    {paymentPriorityId ? (
                      <Text style={[styles.dropTextInputStyle]}>
                        {paymentPriorityName}
                      </Text>
                    ) : null}
                  </View>
                </View>
              </View>

              <View style={{justifyContent: 'center'}}>
                <Image source={downArrowImg} style={styles.imageStyle} />
              </View>
            </TouchableOpacity>

            {showPaymentPriorityList && (
              <View style={styles.dropdownContent1}>
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search "
                  onChangeText={handleSearchPaymentPriority}
                  placeholderTextColor="#000"
                />
                <ScrollView
                  style={styles.scrollView}
                  nestedScrollEnabled={true}>
                  {filteredPaymentPriority.length === 0 ? (
                    <Text style={styles.noCategoriesText}>
                      Sorry, no results found!
                    </Text>
                  ) : (
                    filteredPaymentPriority.map((item, index) => (
                      <TouchableOpacity
                        key={index}
                        style={styles.dropdownOption}
                        onPress={() => actionOnPaymentPriority(item)}>
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
                    {paymentPriorityId ? (
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
                setShowTaxTypeList(!showTaxTypeList);
              }}>
              <View>
                <View style={[styles.SectionStyle1, {}]}>
                  <View style={{flexDirection: 'column'}}>
                    <Text
                      style={
                        taxTypeId
                          ? [styles.dropTextLightStyle]
                          : [styles.dropTextInputStyle]
                      }>
                      {'Tax Type'}
                    </Text>
                    {taxTypeId ? (
                      <Text style={[styles.dropTextInputStyle]}>
                        {taxTypeName}
                      </Text>
                    ) : null}
                  </View>
                </View>
              </View>

              <View style={{justifyContent: 'center'}}>
                <Image source={downArrowImg} style={styles.imageStyle} />
              </View>
            </TouchableOpacity>

            {showTaxTypeList && (
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
                  {filteredTaxType.length === 0 ? (
                    <Text style={styles.noCategoriesText}>
                      Sorry, no results found!
                    </Text>
                  ) : (
                    filteredTaxType.map((item, index) => (
                      <TouchableOpacity
                        key={index}
                        style={styles.dropdownOption}
                        onPress={() => actionOnTaxType(item)}>
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
                setShowInvoiceFormatList(!showInvoiceFormatList);
              }}>
              <View>
                <View style={[styles.SectionStyle1, {}]}>
                  <View style={{flexDirection: 'column'}}>
                    <Text
                      style={
                        invoiceFormatId
                          ? [styles.dropTextLightStyle]
                          : [styles.dropTextInputStyle]
                      }>
                      {'Invoice Format Name'}
                    </Text>
                    {invoiceFormatId ? (
                      <Text style={[styles.dropTextInputStyle]}>
                        {invoiceFormatName}
                      </Text>
                    ) : null}
                  </View>
                </View>
              </View>

              <View style={{justifyContent: 'center'}}>
                <Image source={downArrowImg} style={styles.imageStyle} />
              </View>
            </TouchableOpacity>

            {showInvoiceFormatList && (
              <View style={styles.dropdownContent1}>
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search "
                  onChangeText={handleSearchInvoiceFormat}
                  placeholderTextColor="#000"
                />
                <ScrollView
                  style={styles.scrollView}
                  nestedScrollEnabled={true}>
                  {filteredInvoiceFormat.length === 0 ? (
                    <Text style={styles.noCategoriesText}>
                      Sorry, no results found!
                    </Text>
                  ) : (
                    filteredInvoiceFormat.map((item, index) => (
                      <TouchableOpacity
                        key={index}
                        style={styles.dropdownOption}
                        onPress={() => actionOnInvoiceFormat(item)}>
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
                setShowShipModeList(!showShipModeList);
              }}>
              <View>
                <View style={[styles.SectionStyle1, {}]}>
                  <View style={{flexDirection: 'column'}}>
                    <Text
                      style={
                        shipModeId
                          ? [styles.dropTextLightStyle]
                          : [styles.dropTextInputStyle]
                      }>
                      {'ship Mode'}
                    </Text>
                    {shipModeId ? (
                      <Text style={[styles.dropTextInputStyle]}>
                        {shipModeName}
                      </Text>
                    ) : null}
                  </View>
                </View>
              </View>

              <View style={{justifyContent: 'center'}}>
                <Image source={downArrowImg} style={styles.imageStyle} />
              </View>
            </TouchableOpacity>

            {showShipModeList && (
              <View style={styles.dropdownContent1}>
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search "
                  onChangeText={handleSearchShipMode}
                  placeholderTextColor="#000"
                />
                <ScrollView
                  style={styles.scrollView}
                  nestedScrollEnabled={true}>
                  {filteredShipMode.length === 0 ? (
                    <Text style={styles.noCategoriesText}>
                      Sorry, no results found!
                    </Text>
                  ) : (
                    filteredShipMode.map((item, index) => (
                      <TouchableOpacity
                        key={index}
                        style={styles.dropdownOption}
                        onPress={() => actionOnShipMode(item)}>
                        <Text style={{color: '#000'}}>{item.name}</Text>
                      </TouchableOpacity>
                    ))
                  )}
                </ScrollView>
              </View>
            )}
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

const getStyles = colors =>
  StyleSheet.create({
    popSearchViewStyle: {
      height: hp('40%'),
      width: wp('90%'),
      backgroundColor: '#E5E4E2',
      // bottom: 220,
      // position: 'absolute',
      // flex:1,
      alignSelf: 'center',
      borderTopRightRadius: 15,
      borderTopLeftRadius: 15,
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
      width: '90%',
      marginBottom: 10,
      // marginHorizontal:10
    },
    table_head: {
      flexDirection: 'row',
      borderBottomWidth: 1,
      borderColor: '#ddd',
      padding: 7,
      backgroundColor: colors.color2,
      alignItems: 'center',
    },
    table_head_captions: {
      fontSize: 15,
      color: 'white',
      alignItems: 'center',
    },

    table_body_single_row: {
      backgroundColor: '#fff',
      flexDirection: 'row',
      borderBottomWidth: 1,
      borderColor: '#ddd',
      padding: 7,
    },
    table_data: {
      fontSize: 11,
      color: '#000',
    },
    table: {
      margin: 15,
      // width:'100%',
      justifyContent: 'center',
      alignItems: 'center',
      elevation: 1,
      backgroundColor: '#fff',
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
    dropdownOption: {
      paddingHorizontal: 10,
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: '#ccc',
    },
  });
