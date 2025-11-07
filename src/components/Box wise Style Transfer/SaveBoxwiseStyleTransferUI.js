import React, {useState, useRef, useEffect, useMemo, useContext} from 'react';
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
  Modal,
  TouchableWithoutFeedback,
} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import * as Constant from '../../utils/constants/constant';
import CommonStyles from '../../utils/commonStyles/commonStyles';
import HeaderComponent from '../../utils/commonComponents/headerComponent';
import LoaderComponent from '../../utils/commonComponents/loaderComponent';
import AlertComponent from '../../utils/commonComponents/alertComponent';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import BottomComponent from '../../utils/commonComponents/bottomComponent';
import {TextInput} from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {RadioGroup} from 'react-native-radio-buttons-group';
import {ColorContext} from '../colorTheme/colorTheme';
import CustomCheckBox from '../../utils/commonComponents/CustomCheckBox';
import {useNavigation} from '@react-navigation/native';

let downArrowImg = require('./../../../assets/images/png/dropDownImg.png');
let closeImg = require('./../../../assets/images/png/close1.png');

const SaveBoxwiseStyleTransferUI = ({route, ...props}) => {
  const navigation = useNavigation();
  const {colors} = useContext(ColorContext);

  const styles = getStyles(colors);

  useEffect(() => {
    if (props.itemsObj) {
      // console.log('itemsObj obj ====>  ', props.itemsObj);
      if (props.itemsObj?.transferDetails) {
        console.log(
          'props.itemsObj?.transferDetails ',
          props.itemsObj?.transferDetails,
        );
        setTransferDetailss(props.itemsObj?.transferDetails);
        if (props.itemsObj?.transferDetails.deliveryDate) {
          const date = formattedDate2(
            props.itemsObj?.transferDetails.deliveryDate,
          );
          setDeliveryDate(date);
        }
        if (props.itemsObj?.transferDetails.particulars) {
          const list = props.itemsObj.transferDetails.particulars || [];

          const updatedList = list.map(item => ({
            ...item,
            editable: item.boxChecked == 1 ? false : true,
          }));

          setRows(updatedList);
        }
        if (props.itemsObj.transferDetails.fromLocId) {
          setFromLocationId(props.itemsObj.transferDetails.fromLocId);
          setFromLocationName(
            props.itemsObj.locationsMap[
              props.itemsObj.transferDetails.fromLocId
            ],
          );
        }
        if (props.itemsObj.transferDetails.toLocId) {
          setToLocationId(props.itemsObj.transferDetails.toLocId);
          setToLocationName(
            props.itemsObj.locationsMap[props.itemsObj.transferDetails.toLocId],
          );
        }
        if (props.itemsObj.transferDetails.bstdVendorId) {
          setToCustomerId(props.itemsObj.transferDetails.bstdVendorId);
          setToCustomerName(
            props.itemsObj.vendorsCustomersMap[
              props.itemsObj.transferDetails.bstdVendorId
            ],
          );
          console.log(
            'toCustomerName ===>  ',
            props.itemsObj.vendorsCustomersMap[
              props.itemsObj.transferDetails.bstdVendorId
            ],
          );
        }
        if (props.itemsObj.transferDetails.vehicleNo) {
          setVehicleNo(props.itemsObj.transferDetails.vehicleNo);
        }
        if (props.itemsObj.transferDetails.remarks) {
          setRemarks(props.itemsObj.transferDetails.remarks);
        }
        if (props.itemsObj.transferDetails.bstdTypeTransfer) {
          setInHouse(
            props.itemsObj.transferDetails.bstdTypeTransfer == 1 ? false : true,
          );
        }
        if (props.itemsObj.transferDetails.bstpRate) {
          setRate(props.itemsObj.transferDetails.bstpRate);
        }
       
        if (props.itemsObj.transferDetails.bstStatus) {
          setShowSaveBtn(
            props.itemsObj.transferDetails.bstStatus == 1 ? false : true,
          );
          console.log(
            'setShowSaveBtn ',
            props.itemsObj.transferDetails.bstStatus,
          );
        }

         if (props.itemsObj.transferDetails.returnable) {
          console.log("isretunable ==> ", props.itemsObj.transferDetails.returnable, props.itemsObj.transferDetails.returnable=="Y" ? true : false);
          setShowSaveBtn2(props.itemsObj.transferDetails.returnable=="Y" ? true : false);
        }
      }
    }
  }, [props.itemsObj]);

  useEffect(() => {
    SetUpFlag();
  }, []);

  const SetUpFlag = async () => {
    try {
      const companyObj = await AsyncStorage.getItem('companyObj');
      const flag =
        JSON.parse(companyObj).newFlagSetupMasterDAO.nfsm_bst_dc_format;
      console.log('flag data', flag);
      setDisableBasedOnFlag(flag == 1 ? true : false);
    } catch (error) {
      console.log('Error fetching flag:', error);
    }
  };

  const [rows, setRows] = React.useState([{}]);
  const [barCode, setBarcode] = useState('');
  const [scannedBarcodes, setScannedBarcodes] = useState([]);
  const [selectAllCheckBox, setSelectAllCheckBox] = useState(false);
  const [selectedIdxs, setSelectedIdxs] = useState([]);

  // From Location state variables
  const [fromLocationList, setFromLocationList] = useState([]);
  const [filteredFromLocation, setFilteredFromLocation] = useState([]);
  const [showFromLocationList, setShowFromLocationList] = useState(false);
  const [fromLocationName, setFromLocationName] = useState('');
  const [fromLocationId, setFromLocationId] = useState('');

  // To Location state variables
  const [toLocationList, setToLocationList] = useState([]);
  const [filteredToLocation, setFilteredToLocation] = useState([]);
  const [showToLocationList, setShowToLocationList] = useState(false);
  const [toLocationName, setToLocationName] = useState('');
  const [toLocationId, setToLocationId] = useState('');

  // To Customer state variables
  const [toCustomerList, setToCustomerList] = useState([]);
  const [filteredToCustomer, setFilteredToCustomer] = useState([]);
  const [showToCustomerList, setShowToCustomerList] = useState(false);
  const [toCustomerName, setToCustomerName] = useState('');
  const [toCustomerId, setToCustomerId] = useState('');

  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [txnDate, settxnDate] = useState('');
  const [deliveryDate, setDeliveryDate] = useState('');
  const [activeField, setActiveField] = useState(null);
  const [rate, setRate] = useState('');
  const [remarks, setRemarks] = useState('');
  const [inHouse, setInHouse] = useState(true);
  const [vehicleNo, setVehicleNo] = useState('');
  const [showSaveBtn, setShowSaveBtn] = useState(true);
  const [showSaveBtn2, setShowSaveBtn2] = useState(true);
  const [transferDetailss, setTransferDetailss] = useState([]);

  const [disableBasedOnFlag, setDisableBasedOnFlag] = useState(false);

  // Function to handle selection for From Location
  const actionOnFromLocation = item => {
    setFromLocationId(item.id);
    setFromLocationName(item.name);
    setShowFromLocationList(false);
  };

  // Function to handle search for From Location
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

  // Function to handle selection for To Location
  const actionOnToLocation = item => {
    setToLocationId(item.id);
    setToLocationName(item.name);
    setShowToLocationList(false);
  };

  // Function to handle search for To Location
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

  // Search function for To Customer
  const handleSearchToCustomer = text => {
    if (text.trim().length > 0) {
      const filtered = toCustomerList.filter(item =>
        item.name.toLowerCase().includes(text.toLowerCase()),
      );
      setFilteredToCustomer(filtered);
    } else {
      setFilteredToCustomer(toCustomerList);
    }
  };

  // Action when selecting a To Customer
  const actionOnToCustomer = item => {
    setToCustomerId(item.id);
    setToCustomerName(item.name);
    setShowToCustomerList(false);
  };

  const backAction = async () => {
    props.backBtnAction();
  };

  const handleScannedCode = text => {
    // if (disableBasedOnFlag) return;

    if (!text?.trim()) {
      Alert.alert('Error', 'Please enter a valid barcode');
      return;
    }

    const matchingRows = rows.filter(
      row => row.bstpBarcode?.toString().trim() === text.trim(),
    );

    if (matchingRows.length === 0) {
      Alert.alert('Not Found', 'No matching barcode found !');
      return;
    }

    const allSelected = matchingRows.every(row =>
      selectedIdxs.includes(row.bstId),
    );

    if (allSelected) {
      Alert.alert('Alert', 'This barcode is already Selected!!');
      return;
    }

    const newSelected = [
      ...selectedIdxs,
      ...matchingRows
        .filter(row => !selectedIdxs.includes(row.bstId))
        .map(row => row.bstId),
    ];

    setSelectedIdxs(newSelected);
    setBarcode('');
  };

  const handleBarcodeChange = text => {
    setBarcode(text);
    console.log('scan barcode text ', text);
  };

  const handleScan = () => {
    navigation.navigate('ScanQRPage', {
      onScanSuccess: scannedValue => {
        console.log('Scanned Code: ', scannedValue);
        handleScannedCode(scannedValue);
      },
    });
  };

  const formattedDate = text => {
    console.log('date before  formating', text);
    const [d, m, y] = text.split('-');
    const f = [d, m, y].join('/');
    console.log('date formating', f);
    return f;
  };
  const formattedDate2 = text => {
    const [y, m, d] = text.split('-');
    const f = [d, m, y].join('/');
    console.log('date formating', f);
    return f;
  };

  const submitAction = async () => {
    // if (scannedBarcodes.length <= 0) {
    //   Alert.alert('Alert', 'Please Scan barcode !');
    //   return;
    // }

    const filteredRows = rows
      .filter(item => selectedIdxs.includes(item.bstId))
      .map(item => ({
        id: item.bstId || '',
        bstpBoxname: item.bstpBoxname || '',
        bstpQty: item.bstpQty || '',
        styleIds: item.styleIds || '',
        bstpSizeIds: item.bstpSizeIds || '',
        bstpBarcode: item.bstpBarcode || '',
        boxChecked: 1 || '', //
        sizename: item.sizename || '',
        fromLocId: fromLocationId || 0,
        toLocID: toLocationId || 0,
        stylenames: item.stylenamestr || '',
        stts: item.stts || '',
        bstpRate: item.bstpRate || '',
        receivedDate: item.receivedDate || '', //5
      }));
    const filteredRows2 = rows
      .filter(item => selectedIdxs.includes(item.bstId))
      .map(item => item.bstpQty);

    const sumOfCurrentReceivedQty = filteredRows2.reduce(
      (sum, qty) => sum + Number(qty || 0),
      0,
    );

    console.log('sumOfCurrentReceivedQty==> ', sumOfCurrentReceivedQty);

    const finalTotalQty =
      Number(sumOfCurrentReceivedQty || 0) +
        Number(transferDetailss?.totalRecQty || 0) || 0;

    const Obj = {
      vendorId: toCustomerId || 0,
      styleTransferId: transferDetailss?.id || '',
      fromLoc: fromLocationId || 0,
      toLoc: toLocationId || 0,
      person: transferDetailss?.person || '',
      vehicleNo: vehicleNo || '',
      billno: transferDetailss?.ewayBillNo || '',
      remarks: remarks || '',
      totalRecQty: finalTotalQty || 0,
      totalQty: transferDetailss?.totalQty || 0,
      customerId: toCustomerId || 0,
      transferType: transferDetailss?.bstdTypeTransfer || '',
      isReturnable: transferDetailss?.returnable || '', //
      bstdDcNoStr: transferDetailss?.bstdDcNoStr || '',
      bstStatus:
        finalTotalQty == transferDetailss?.totalQty
          ? 1
          : transferDetailss?.bstStatus || '',
      deliveryDate: deliveryDate,
      boxStyleTransferParticulars: filteredRows || [],
    };
    console.log('save Obj edit==> ', Obj);
    props.submitAction(Obj);
  };

  const handleRemoveRow = id => {
    setRows(prev => prev.filter((_, index) => index !== id));
  };

  const handleConfirm = date => {
    const extractedDate = date.toISOString().split('T')[0];
    const formattedDate = formatDateIntoDMY(extractedDate);
    if (activeField === 'deliveryDate') {
      setDeliveryDate(formattedDate);
    } else if (activeField === 'txnDate') {
      settxnDate(formattedDate);
    }

    hideDatePicker();
  };

  const showDatePicker = field => {
    setActiveField(field);
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
    setActiveField(null);
  };

  function formatDateIntoDMY(inp) {
    const [y, m, d] = inp.split('-');
    let ans = [d, m, y];
    ans = ans.join('-');
    return ans;
  }

  const toggleSelection = index => {
    if (disableBasedOnFlag) return;
    const item = rows[index];

    if (!item.editable) return;

    setSelectedIdxs(prevIds => {
      if (prevIds.includes(item.bstId)) {
        return prevIds.filter(id => id !== item.bstId);
      } else {
        return [...prevIds, item.bstId];
      }
    });
  };

  const handleInputChange = (index, field, value) => {
    console.log('handle input change', index, field, value);
    const updatedRows = [...rows];
    updatedRows[index] = {...updatedRows[index], [field]: value};
    setRows(updatedRows);
  };

  const totalQtyy = rows.reduce(
    (sum, row) => sum + Number(row.bstpQty || 0),
    0,
  );

  const backBtnAction = () => {
    props.backBtnAction();
  };

  const popOkBtnAction = () => {
    props.popOkBtnAction();
  };

  const updateAllIndexes = () => {
    if (disableBasedOnFlag) return;

    const editableIds = rows.filter(r => r.editable).map(r => r.bstId);

    const newSelected = selectAllCheckBox
      ? selectedIdxs.filter(id => !editableIds.includes(id))
      : [...selectedIdxs, ...editableIds];

    setSelectedIdxs(newSelected);
    setSelectAllCheckBox(!selectAllCheckBox);
  };

  const handleSelectBarcode = () => {
    if (!barCode?.trim()) {
      Alert.alert('Error', 'Please enter a barcode');
      return;
    }

    const matchingRows = rows.filter(
      row => row.bstpBarcode?.toString().trim() === barCode.trim(),
    );

    if (matchingRows.length === 0) {
      Alert.alert('Not Found', 'No matching barcode found');
      return;
    }

    const allSelected = matchingRows.every(row =>
      selectedIdxs.includes(row.bstId),
    );

    if (allSelected) {
      Alert.alert('Alert', 'This barcode is already Selected!!');
      return;
    }

    const newSelected = [
      ...selectedIdxs,
      ...matchingRows
        .filter(row => !selectedIdxs.includes(row.bstId))
        .map(row => row.bstId),
    ];

    setSelectedIdxs(newSelected);
    setBarcode('');
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
          title={'Save Boxwise Style Transfer'}
          backBtnAction={() => backBtnAction()}
        />
      </View>
      <KeyboardAwareScrollView
        enableOnAndroid={true}
        extraHeight={130}
        extraScrollHeight={130}
        showsVerticalScrollIndicator={false}
        style={{marginBottom: hp('15%'), width: '100%'}}>
        <View
          style={{
            marginBottom: hp('5%'),
            width: '90%',
            marginHorizontal: wp('5%'),
          }}>
          <View style={{height: 15}} />

          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#fff',
              marginTop: hp('2%'),
              opacity: 0.8,
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
                      {'From Location *'}
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

            {showFromLocationList && false && (
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

          {inHouse && (
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#fff',
                marginTop: hp('2%'),
                opacity: 0.8,
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
                  setShowFromLocationList(!showToLocationList);
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
                        {'To Location *'}
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

              {showToLocationList && false && (
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
          )}

          {!inHouse && (
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#fff',
                marginTop: hp('2%'),
                opacity: 0.8,
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
                  setShowToCustomerList(!showToCustomerList);
                }}>
                <View>
                  <View style={[styles.SectionStyle1, {}]}>
                    <View style={{flexDirection: 'column'}}>
                      <Text
                        style={
                          toCustomerId
                            ? [styles.dropTextLightStyle]
                            : [styles.dropTextInputStyle]
                        }>
                        {'To Customer *'}
                      </Text>
                      {toCustomerId ? (
                        <Text style={[styles.dropTextInputStyle]}>
                          {toCustomerName}
                        </Text>
                      ) : null}
                    </View>
                  </View>
                </View>

                <View style={{justifyContent: 'center'}}>
                  <Image source={downArrowImg} style={styles.imageStyle} />
                </View>
              </TouchableOpacity>

              {showToCustomerList && false && (
                <View style={styles.dropdownContent1}>
                  <TextInput
                    style={styles.searchInput}
                    placeholder="Search "
                    onChangeText={handleSearchToCustomer}
                    placeholderTextColor="#000"
                  />
                  <ScrollView
                    style={styles.scrollView}
                    nestedScrollEnabled={true}>
                    {filteredToCustomer.length === 0 ? (
                      <Text style={styles.noCategoriesText}>
                        Sorry, no results found!
                      </Text>
                    ) : (
                      filteredToCustomer.map((item, index) => (
                        <TouchableOpacity
                          key={index}
                          style={styles.dropdownOption}
                          onPress={() => actionOnToCustomer(item)}>
                          <Text style={{color: '#000'}}>{item.name}</Text>
                        </TouchableOpacity>
                      ))
                    )}
                  </ScrollView>
                </View>
              )}
            </View>
          )}

          <DateTimePickerModal
            isVisible={isDatePickerVisible}
            mode="date"
            onConfirm={handleConfirm}
            onCancel={hideDatePicker}
          />

          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: hp('2%'),
              flexDirection: 'row',
            }}>
            <View style={{width: '85%', opacity: 0.7}}>
              <TextInput
                label="Delivery Date "
                value={deliveryDate ? deliveryDate : ''}
                placeholder=""
                placeholderTextColor="#000"
                mode="outlined"
                color="#000"
                editable={false}
              />
            </View>
            <TouchableOpacity
              onPress={() => {
                console.log('deliveryDate');
                // showDatePicker('deliveryDate');
              }}
              style={{padding: 5}}>
              <Image
                source={require('./../../../assets/images/png/calendar11.png')}
                style={{width: 40, height: 40}}
              />
            </TouchableOpacity>
          </View>

          <View style={{marginTop: hp('2%')}}>
            <TextInput
              label="Vehicle No  "
              value={vehicleNo}
              mode="outlined"
              onChangeText={text => setVehicleNo(text)}
            />
          </View>

          <View style={{marginTop: hp('2%')}}>
            <TextInput
              label="Remarks (if any)"
              value={remarks}
              mode="outlined"
              onChangeText={text => setRemarks(text)}
            />
          </View>

          {/* <View style={{marginTop: hp('2%')}}>
            <TextInput
              label="Barcode"
              value={scannedBarcodes?.join(',')}
              mode="outlined"
              editable={false}
              onChangeText={text => console.log(text)}
            />
          </View> */}

          <View style={{marginTop: hp('2%')}}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <View style={{flex: 1, marginRight: 10}}>
                <TextInput
                  label="Barcode "
                  value={barCode}
                  mode="outlined"
                  onChangeText={text => handleBarcodeChange(text)}
                />
              </View>
              <TouchableOpacity
                onPress={handleSelectBarcode}
                style={{
                  backgroundColor: colors.color2,
                  paddingVertical: 12,
                  paddingHorizontal: 20,
                  borderRadius: 6,
                  elevation: 3,
                }}>
                <Text style={{color: '#fff', fontWeight: '600', fontSize: 16}}>
                  Search
                </Text>
              </TouchableOpacity>
            </View>

            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginVertical: hp('2%'),
              }}>
              <View style={{flex: 1, height: 1, backgroundColor: '#ddd'}} />
              <Text style={{marginHorizontal: 10, color: '#888', fontSize: 14}}>
                OR
              </Text>
              <View style={{flex: 1, height: 1, backgroundColor: '#ddd'}} />
            </View>

            <TouchableOpacity
              onPress={handleScan}
              style={{
                backgroundColor: colors.color2,
                paddingVertical: 12,
                borderRadius: 6,
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                elevation: 3,
                alignSelf: 'center',
                width: '50%',
              }}>
              <Text
                style={{
                  color: '#fff',
                  fontWeight: '600',
                  fontSize: 16,
                  marginRight: 8,
                }}>
                Scan
              </Text>
              <Image
                source={require('./../../../assets/images/png/scan.png')}
                style={{
                  height: 20,
                  width: 20,
                  tintColor: '#fff',
                }}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>

          <View style={{marginBottom: 20}} />

          {rows.length > 0 && (
            <View style={styles.wrapper}>
              <ScrollView nestedScrollEnabled={true} horizontal>
                <View style={styles.table}>
                  <View style={styles.table_head}>
                    <View style={{width: 60, opacity:!disableBasedOnFlag ? 1 : 0.4}}>
                      <Text style={styles.table_head_captions}>Action</Text>
                      <CustomCheckBox
                        isChecked={selectAllCheckBox}
                        onToggle={updateAllIndexes}
                      />
                    </View>
                    <View style={{width: 100}}>
                      <Text style={styles.table_head_captions}>Box Name </Text>
                    </View>

                    <View style={{width: 10}} />
                    <View style={{width: 100}}>
                      <Text style={styles.table_head_captions}>Style Name</Text>
                    </View>
                    <View style={{width: 10}} />
                    <View style={{width: 100}}>
                      <Text style={styles.table_head_captions}>Size</Text>
                    </View>
                    <View style={{width: 10}} />
                    <View style={{width: 100}}>
                      <Text style={styles.table_head_captions}>Barcode</Text>
                    </View>
                    <View style={{width: 10}} />
                    <View style={{width: 100}}>
                      <Text style={styles.table_head_captions}>Qty</Text>
                    </View>
                    <View style={{width: 10}} />
                    <View style={{width: 100}}>
                      <Text style={styles.table_head_captions}>Rate</Text>
                    </View>
                  </View>

                  {rows.length > 0 &&
                    rows.map((row, index) => (
                      <View key={index} style={styles.table_body_single_row}>
                        <View
                          style={[
                            styles.checkboxItem,
                            {
                              marginTop: hp('2%'),
                              marginBottom: hp('2%'),
                              width: 60,
                              opacity:
                                row.editable && !disableBasedOnFlag ? 1 : 0.4,
                            },
                          ]}>
                          <CustomCheckBox
                            isChecked={
                              selectedIdxs.includes(row.bstId) ||
                              row.boxChecked == 1
                            }
                            onToggle={() => toggleSelection(index)}
                          />
                        </View>

                        <View style={{width: 100}}>
                          <Text style={styles.table_data}>
                            {row.bstpBoxname}
                          </Text>
                        </View>

                        <View style={{width: 10}} />
                        <View style={{width: 100}}>
                          <Text style={styles.table_data}>
                            {row.stylenamestr}
                          </Text>
                        </View>

                        <View style={{width: 10}} />
                        <View style={{width: 100}}>
                          <Text style={styles.table_data}>{row.sizename}</Text>
                        </View>

                        <View style={{width: 10}} />
                        <View style={{width: 100}}>
                          <Text style={styles.table_data}>
                            {row.bstpBarcode}
                          </Text>
                        </View>

                        <View style={{width: 10}} />
                        <View style={{width: 100}}>
                          <Text style={styles.table_data}>{row.bstpQty}</Text>
                        </View>

                        <View style={{width: 10}} />

                        {/* Rate */}
                        <View style={{width: 100}}>
                          <TextInput
                            style={styles.table_data_input}
                            value={String(row.bstpRate || '')}
                            onChangeText={text =>
                              handleInputChange(index, 'Rate', text)
                            }
                            editable={false}
                            keyboardType="numeric"
                          />
                        </View>
                      </View>
                    ))}

                  <View
                    style={[
                      styles.table_body_single_row,
                      {paddingVertical: 12},
                    ]}>
                    <View style={{width: 60}}></View>
                    <View style={{width: 100}}></View>
                    <View style={{width: 10}} />
                    <View style={{width: 100}}></View>
                    <View style={{width: 10}} />
                    <View style={{width: 100}}>
                      <Text style={styles.table_data}>
                        {/* {totalQtyy?.toFixed(2)} */}
                      </Text>
                    </View>
                    <View style={{width: 10}} />
                    <View style={{width: 100}}>
                      <Text style={styles.table_data}>{'Total Send Qty'}</Text>
                    </View>
                    <View style={{width: 10}} />
                    <View style={{width: 100}}>
                      <Text style={styles.table_data}>
                        {totalQtyy?.toFixed(2)}
                      </Text>
                    </View>
                    <View style={{width: 10}} />
                    <View style={{width: 100}}></View>
                  </View>
                </View>
              </ScrollView>
            </View>
          )}
        </View>
      </KeyboardAwareScrollView>

      <View style={CommonStyles.bottomViewComponentStyle}>
        <BottomComponent
          rightBtnTitle={'Save'}
          leftBtnTitle={'Back'}
          isLeftBtnEnable={true}
          rigthBtnState={showSaveBtn && showSaveBtn2}
          isRightBtnEnable={showSaveBtn && showSaveBtn2}
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

export default SaveBoxwiseStyleTransferUI;

const getStyles = colors =>
  StyleSheet.create({
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
      marginTop: hp('5%'),
      width: '100%',
    },
    table: {
      width: '100%', // Reduces extra space on the sides
      backgroundColor: '#fff',
      elevation: 1,
      borderRadius: 5,
      overflow: 'hidden',
    },
    table_head: {
      flexDirection: 'row',
      borderBottomWidth: 1,
      borderColor: '#ddd',
      backgroundColor: colors.color2,
      // backgroundColor: '#5177c0',
      alignItems: 'center',
      paddingVertical: 7,
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
      alignItems: 'center',
    },
    table_data: {
      fontSize: 13,
      color: '#000',
      textAlign: 'center',
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
      borderColor: 'lightgray',
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
    checkboxItem: {
      flexDirection: 'row',
      alignItems: 'center',
      width: '45%',
      marginVertical: 5,
      marginHorizontal: 5,
    },
    checkboxLabel: {
      marginLeft: 8,
      fontSize: 14,
      color: '#000',
    },
    imageStyle1: {
      height: 30,
      aspectRatio: 1,
      resizeMode: 'contain',
      tintColor: 'red',
      alignSelf: 'center',
    },
    searchButton: {
      marginTop: 40,
      flex: 1,
      width: '50%',
      alignSelf: 'center',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 10,
      borderWidth: 0.5,
      borderColor: '#D8D8D8',
      borderRadius: hp('0.5%'),
      backgroundColor: colors.color2,
    },
    companyModalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    companyModalContainer: {
      backgroundColor: 'white',
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      padding: 10,
      height: '70%',
      paddingVertical: 8,
      position: 'absolute',
      bottom: 0,
      width: '100%',
    },

    companyModalHeader: {
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: '#ddd',
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    companyModalHeaderText: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#333',
    },
    companyModalSearchBarContainer: {
      marginVertical: 10,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
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
      flex: 1,
    },
    searchButton1: {
      height: 40,
      backgroundColor: colors.color2,
      borderRadius: 8,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 16,
      marginLeft: 10,
    },
    searchbuttonText: {
      color: 'white',
      fontSize: 16,
      fontWeight: 'bold',
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
      backgroundColor: '#f9f9f9',
      borderRadius: 8,
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 4,
    },
    companyModalItemContent: {
      flexDirection: 'row',
      alignItems: 'center',
      marginHorizontal: 4,
      paddingHorizontal: 12,
    },
    companyModalItemContentHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginHorizontal: 4,
      paddingHorizontal: 12,
      backgroundColor: '#d8d8d8',
    },
    companyModalDropdownItemText: {
      fontSize: 15,
      color: '#333',
      flex: 1,
      textAlign: 'center',
    },
    companyModalDropdownItemTextHeader: {
      fontSize: 16,
      color: '#333',
      flex: 1,
      fontWeight: 'bold',
      textAlign: 'center',
    },
    table_data_input: {
      fontSize: 16,
      color: '#000',
      borderBottomWidth: 1,
      // borderWidth:1,

      borderColor: '#ccc',
      paddingHorizontal: 4,
      textAlign: 'center',
      backgroundColor: '#fff',
    },

    checkboxItem: {
      flexDirection: 'row',
      alignItems: 'center',
      width: '45%', // Adjust width for better alignment
      marginVertical: 5,
      marginHorizontal: 5,
    },
    checkboxLabel: {
      marginLeft: 8,
      fontSize: 14,
      color: '#000',
    },
  });
