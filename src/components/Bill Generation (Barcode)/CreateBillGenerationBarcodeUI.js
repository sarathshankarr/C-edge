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

const CreateBillGenerationBarcodeUI = ({route, ...props}) => {
  const navigation = useNavigation();
  const [rows, setRows] = React.useState([
    {
      styleName: 'T-Shirt',
      size: 'Small',
      totolQty: '10',
      hsn: '6109',
      unitPrice: '50',
      gst_percent: 5,
      gross: 500,
      gstAmount: 25,
      totalRowAmount: 525,
    },
    {
      styleName: 'T-Shirt',
      size: 'Medium',
      totolQty: '5',
      hsn: '6109',
      unitPrice: '100',
      gst_percent: 12,
      gross: 500,
      gstAmount: 60,
      totalRowAmount: 560,
    },
    {
      styleName: 'T-Shirt',
      size: 'Large',
      totolQty: '2',
      hsn: '6109',
      unitPrice: '250',
      gst_percent: 18,
      gross: 500,
      gstAmount: 90,
      totalRowAmount: 590,
    },
  ]);
  const [selectedradiooption1, setSelectedradiooption1] = useState('StyleWise');
  const [totalQty, setTotalQty] = useState(false);
  const [invoiceNo, setInvoiceNo] = useState('');
  const [poNo, setPoNo] = useState('');
  const [barCode, setBarcode] = useState('');
  const {colors} = useContext(ColorContext);

  const styles = getStyles(colors);

  const backBtnAction = () => {
    props.backBtnAction();
  };

  const popOkBtnAction = () => {
    props.popOkBtnAction();
  };

  useEffect(() => {
    if (props.lists) {
      // console.log('data need to set ==> ', props.lists);
      if (props.lists.companyLocationsMap) {
        const shipFromList = Object.keys(props.lists.companyLocationsMap).map(
          key => ({
            id: key,
            name: props.lists.companyLocationsMap[key],
          }),
        );
        setFilteredShipLocation(shipFromList);
        setShipLocationList(shipFromList);
      }
      if (props.lists.vendorsCustomersMap) {
        const shipToList = Object.keys(props.lists.vendorsCustomersMap).map(
          key => ({
            id: key,
            name: props.lists.vendorsCustomersMap[key],
          }),
        );
        setFilteredShipTo(shipToList);
        setShipToList(shipToList);
      }
      if (props.lists.vendorsCustomersMap) {
        const billNoList = Object.keys(props.lists.vendorsCustomersMap).map(
          key => ({
            id: key,
            name: props.lists.vendorsCustomersMap[key],
          }),
        );
        setFilteredBillNoList(billNoList);
        setBillNoList(billNoList);
      }
    }
  }, [props.lists]);

  // useEffect(() => {
  //   if (props.modalLists) {
  //     if (props.modalLists) {
  //       setModalLists(props.modalLists);
  //     }
  //     console.log('modal lists ===>  ==> ', props.modalLists[0]);
  //   }
  // }, [props.modalLists]);

  const [billNoList, setBillNoList] = useState([]);
  const [filteredBillNoList, setFilteredBillNoList] = useState([]);
  const [showBillNoList, setShowBillNoList] = useState(false);
  const [billNo, setBillNo] = useState('');
  const [billNoId, setBillNoId] = useState('');

  // Ship To state variables
  const [shipToList, setShipToList] = useState([]);
  const [filteredShipTo, setFilteredShipTo] = useState([]);
  const [showShipToList, setShowShipToList] = useState(false);
  const [shipToName, setShipToName] = useState('');
  const [shipToId, setShipToId] = useState('');

  // Ship Location state variables
  const [shipLocationList, setShipLocationList] = useState([]);
  const [filteredShipLocation, setFilteredShipLocation] = useState([]);
  const [showShipLocationList, setShowShipLocationList] = useState(false);
  const [shipLocationName, setShipLocationName] = useState('');
  const [shipLocationId, setShipLocationId] = useState('');

  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [txnDate, settxnDate] = useState('');
  const [deliveryDate, setDeliveryDate] = useState('');
  const [activeField, setActiveField] = useState(null);

  const [showModal, setShowmodal] = useState(false);
  const [companyList, setcompanyList] = useState({});
  const [query, setquery] = useState('');
  const [selectedIdxs, setSelectedIdxs] = useState([]);
  const [selectAllCheckBox, setSelectAllCheckBox] = useState(false);
  const [modalLists, setModalLists] = useState([]);

  const [styleList, setStyleList] = useState([]);
  const [filteredStyle, setFilteredStyle] = useState([]);
  const [showStyleList, setShowStyleList] = useState(false);
  const [styleName, setStyleName] = useState('');
  const [styleId, setStyleId] = useState('');

  const actionOnStyle = item => {
    setStyleId(item.id);
    setStyleName(item.name);
    setShowStyleList(false);
  };

  const handleSearchStyle = text => {
    if (text.trim().length > 0) {
      const filtered = styleList.filter(
        item =>
          item.name &&
          item.name.trim() !== '' &&
          item.name.toLowerCase().includes(text.toLowerCase()),
      );
      setFilteredStyle(filtered);
    } else {
      setFilteredStyle(
        styleList.filter(item => item.name && item.name.trim() !== ''),
      );
    }
  };

  const actionOnBillNo = item => {
    setBillNoId(item.id);
    setBillNo(item.name);
    setShowBillNoList(false);
    handleOpenModal(item.id);
  };

  const handleSearchBillNo = text => {
    if (text.trim().length > 0) {
      const filtered = billNoList.filter(item =>
        item.name.toLowerCase().includes(text.toLowerCase()),
      );
      setFilteredBillNoList(filtered);
    } else {
      setFilteredBillNoList(billNoList);
    }
  };

  const actionOnShipTo = item => {
    setShipToId(item.id);
    setShipToName(item.name);
    setShowShipToList(false);
  };

  const handleSearchShipTo = text => {
    if (text.trim().length > 0) {
      const filtered = shipToList.filter(item =>
        item.name.toLowerCase().includes(text.toLowerCase()),
      );
      setFilteredShipTo(filtered);
    } else {
      setFilteredShipTo(shipToList);
    }
  };

  const actionOnShipLocation = item => {
    setShipLocationId(item.id);
    setShipLocationName(item.name);
    setShowShipLocationList(false);
  };

  const handleSearchShipLocation = text => {
    if (text.trim().length > 0) {
      const filtered = shipLocationList.filter(item =>
        item.name.toLowerCase().includes(text.toLowerCase()),
      );
      setFilteredShipLocation(filtered);
    } else {
      setFilteredShipLocation(shipLocationList);
    }
  };

  const backAction = async () => {
    props.backBtnAction();
  };

  const handleScannedCode = text => {
    if (!text) {
      Alert.alert('Please Enter the Valid Barcode');
      return;
    }
    props.validateBarCode(text);

    Alert.alert('Valid Barcode', text);
    //   if(text===barCode){
    //     submitAction(1);
    //  }else{
    //    Alert.alert("Please Enter the Valid Barcode");
    //    set_inputBarCode('');
    //  }
  };

  const handleScan = () => {
    navigation.navigate('ScanQRPage', {
      onScanSuccess: scannedValue => {
        console.log('Scanned Code: ', scannedValue);
        handleScannedCode(scannedValue);
      },
    });
  };

  const submitAction = async () => {
    const filteredRows = rows.map(item => ({
      gsCode: 'GS001',
      prePackQuantity: '5',
      quantity: 10,
      price: 200.5,
      gstAmount: 18.5,
      sizeCapacity: 'L',
      itemId: 112,
      barcodeNo: '11111',
      other: 'remarks',
      orderId: 1,
      locationId: '9-1',
      discountAmount: 5.0,
      discountPercentage: 2.0,
      colorCount: '1',
      hsn: 'HSN001',
      gstRate: '18%',
      prePack: '1',
    }));
    const Obj = {
      transactionDate: txnDate,
      transportDate: '31/12/2023',
      dueDate: '31/12/2023',
      shipDate: '31/12/2023',
      vendorCustomerId: 101,
      billToId: 202,
      poNumber: 'PO12345',
      vendorId: 303,
      companyLocationId: 404,
      financialYear: 2025,
      yearwiseId: 1,
      transportName: 'DHL',
      transportNo: 'TR123',
      bookingNo: 'BK001',
      cartonNo: 'CARTON01',
      invoiceNo: 'INV001',
      itemType: 'Garment',
      agentId: 1,
      subagentId: 2,
      notes: 'Urgent delivery',
      transportCost: 100.5,
      totalDiscount: 5.25,
      totalDiscountPer: 2.5,
      soNumber: 555,
      convRate: 1.25,
      additionalAmount: 50.0,
      roundtotal: 1200.0,
      roundtotal2: 1200.0,
      packages: '5',
      packincharge: 'John Doe',
      ackno: 'ACK123',
      area: 'North',
      eway: 'EWAY001',
      allRolls: 'YES',
      corg: 0,
      pIids: 'PI123,PI124',
      masterboxbarcode: 'MB001',
      menuId: 10,
      master_box_proforma_id: 'MBP001',
      company: {
        id: 1,
      },
      loginDTO: {
        userId: 1001,
        language_id: 1,
      },
      items: filteredRows,
    };

    console.log('save Obj ==> ', Obj);
return;
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
  const radiogroup1 = useMemo(
    () => [
      {
        id: '1',
        label: 'Box',
        value: 'Box',
        selected: selectedradiooption1 === 'Box',
        labelStyle: {color: '#000'},
      },
      {
        id: '2',
        label: 'Master Box',
        value: 'MasterBox',
        selected: selectedradiooption1 === 'MasterBox',
        labelStyle: {color: '#000'},
      },
    ],
    [selectedradiooption1],
  );

  const handleOptionChange = selectedId => {
    const selected = radiogroup1.find(button => button.id === selectedId);
    if (selected) {
      setSelectedradiooption1(selected.value);
    }
  };

  const filteredCompanyList = modalLists.filter(item => {
    return (
      item?.fabricNo?.toLowerCase().includes(query.toLowerCase()) ||
      item?.styleNo?.toLowerCase().includes(query.toLowerCase())
    );
  });

  const handleSelectFromModal = () => {
    // setRows([]);
    const list = selectedIdxs.map(index => {
      const item = {...modalLists[index]};
      return item.styleId;
    });

    list.input_Qty = '';
    list.input_UnitPrice = '';
    list.input_Gst = '';
    list.input_NetAmount = '';
    list.input_GstAmount = '';
    list.input_TotalAmount = '';
    console.log('selcetd items  ===> ', list.join(','));
    if (list.length > 0) {
      const ids = list.join(',');
      // props.getModalLists(ids);
    }
    // setRows(list);
    setShowmodal(false);
  };

  const updateAllIndexes = () => {
    setSelectedIdxs(
      selectAllCheckBox ? [] : filteredCompanyList.map((_, index) => index),
    );
    setSelectAllCheckBox(!selectAllCheckBox);
  };

  const toggleSelection = item => {
    setSelectedIdxs(prevSelected => {
      const exists = prevSelected.some(index => index === item);

      if (exists) {
        return prevSelected.filter(i => i !== item);
      } else {
        return [...prevSelected, item];
      }
    });
  };

  const handleOpenModal = id => {
    props.getModalStyleFgList(id);
    setShowmodal(!showModal);
  };
  const handleSearchBarcode = () => {
    if (!barCode) {
      Alert.alert('Alert', 'Please Enter Barcode !');
    }
    handleScannedCode(barCode);
  };

  const totalGstAmount = rows.reduce(
    (sum, row) =>
      sum +
      (Number(row.input_Qty || 0) *
        Number(row.input_UnitPrice || 0) *
        Number(row.input_Gst || 0)) /
        100,
    0,
  );
  const totalNetAmount = rows.reduce(
    (sum, row) =>
      sum + Number(row.input_Qty || 0) * Number(row.input_UnitPrice || 0),
    0,
  );
  const totalTotalAmount = totalNetAmount + totalGstAmount;

  return (
    <View style={[CommonStyles.mainComponentViewStyle]}>
      <View style={[CommonStyles.headerView]}>
        <HeaderComponent
          isBackBtnEnable={true}
          isSettingsEnable={false}
          isChatEnable={false}
          isTImerEnable={false}
          isTitleHeaderEnable={true}
          title={'Create BillGeneration Barcode'}
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
                setShowShipLocationList(!showShipLocationList);
              }}>
              <View>
                <View style={[styles.SectionStyle1, {}]}>
                  <View style={{flexDirection: 'column'}}>
                    <Text
                      style={
                        shipLocationId
                          ? [styles.dropTextLightStyle]
                          : [styles.dropTextInputStyle]
                      }>
                      {'Ship From *'}
                    </Text>
                    {shipLocationId ? (
                      <Text style={[styles.dropTextInputStyle]}>
                        {shipLocationName}
                      </Text>
                    ) : null}
                  </View>
                </View>
              </View>

              <View style={{justifyContent: 'center'}}>
                <Image source={downArrowImg} style={styles.imageStyle} />
              </View>
            </TouchableOpacity>

            {showShipLocationList && (
              <View style={styles.dropdownContent1}>
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search "
                  onChangeText={handleSearchShipLocation}
                  placeholderTextColor="#000"
                />
                <ScrollView
                  style={styles.scrollView}
                  nestedScrollEnabled={true}>
                  {filteredShipLocation.length === 0 ? (
                    <Text style={styles.noCategoriesText}>
                      Sorry, no results found!
                    </Text>
                  ) : (
                    filteredShipLocation.map((item, index) => (
                      <TouchableOpacity
                        key={index}
                        style={styles.dropdownOption}
                        onPress={() => actionOnShipLocation(item)}>
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
                setShowShipToList(!showShipToList);
              }}>
              <View>
                <View style={[styles.SectionStyle1, {}]}>
                  <View style={{flexDirection: 'column'}}>
                    <Text
                      style={
                        shipToId
                          ? [styles.dropTextLightStyle]
                          : [styles.dropTextInputStyle]
                      }>
                      {'Ship To *'}
                    </Text>
                    {shipToId ? (
                      <Text style={[styles.dropTextInputStyle]}>
                        {shipToName}
                      </Text>
                    ) : null}
                  </View>
                </View>
              </View>

              <View style={{justifyContent: 'center'}}>
                <Image source={downArrowImg} style={styles.imageStyle} />
              </View>
            </TouchableOpacity>

            {showShipToList && (
              <View style={styles.dropdownContent1}>
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search "
                  onChangeText={handleSearchShipTo}
                  placeholderTextColor="#000"
                />
                <ScrollView
                  style={styles.scrollView}
                  nestedScrollEnabled={true}>
                  {filteredShipTo.length === 0 ? (
                    <Text style={styles.noCategoriesText}>
                      Sorry, no results found!
                    </Text>
                  ) : (
                    filteredShipTo.map((item, index) => (
                      <TouchableOpacity
                        key={index}
                        style={styles.dropdownOption}
                        onPress={() => actionOnShipTo(item)}>
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
                setShowBillNoList(!showBillNoList);
              }}>
              <View>
                <View style={[styles.SectionStyle1, {}]}>
                  <View style={{flexDirection: 'column'}}>
                    <Text
                      style={
                        billNoId
                          ? [styles.dropTextLightStyle]
                          : [styles.dropTextInputStyle]
                      }>
                      {' Bill To '}
                    </Text>
                    {billNoId ? (
                      <Text style={[styles.dropTextInputStyle]}>{billNo}</Text>
                    ) : null}
                  </View>
                </View>
              </View>

              <View style={{justifyContent: 'center'}}>
                <Image source={downArrowImg} style={styles.imageStyle} />
              </View>
            </TouchableOpacity>

            {showBillNoList && (
              <View style={styles.dropdownContent1}>
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search "
                  onChangeText={handleSearchBillNo}
                  placeholderTextColor="#000"
                />
                <ScrollView
                  style={styles.scrollView}
                  nestedScrollEnabled={true}>
                  {filteredBillNoList.length === 0 ? (
                    <Text style={styles.noCategoriesText}>
                      Sorry, no results found!
                    </Text>
                  ) : (
                    filteredBillNoList.map((item, index) => (
                      <TouchableOpacity
                        key={index}
                        style={styles.dropdownOption}
                        onPress={() => actionOnBillNo(item)}>
                        <Text style={{color: '#000'}}>{item.name}</Text>
                      </TouchableOpacity>
                    ))
                  )}
                </ScrollView>
              </View>
            )}
          </View>

          <DateTimePickerModal
            isVisible={isDatePickerVisible}
            mode="date"
            onConfirm={handleConfirm}
            onCancel={hideDatePicker}
          />

          <View style={{marginTop: hp('2%')}}>
            {/* <Text> SC- </Text> */}
            <TextInput
              label="Invoice No *"
              value={invoiceNo}
              mode="outlined"
              onChangeText={text => setInvoiceNo(text)}
            />
            {/* <Text>/25-26 </Text> */}
          </View>

          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: hp('2%'),
              flexDirection: 'row',
            }}>
            <View style={{width: '85%'}}>
              <TextInput
                label="Txn Date *"
                value={txnDate ? txnDate : ''}
                placeholder="Order Date"
                placeholderTextColor="#000"
                mode="outlined"
                color="#000"
              />
            </View>
            <TouchableOpacity
              onPress={() => {
                showDatePicker('txnDate');
              }}
              style={{padding: 5}}>
              <Image
                source={require('./../../../assets/images/png/calendar11.png')}
                style={{width: 40, height: 40}}
              />
            </TouchableOpacity>
          </View>

          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: hp('2%'),
              flexDirection: 'row',
            }}>
            <View style={{width: '85%'}}>
              <TextInput
                label="Delivery Date "
                value={deliveryDate ? deliveryDate : ''}
                placeholder="Delivery Date"
                placeholderTextColor="#000"
                mode="outlined"
                color="#000"
              />
            </View>
            <TouchableOpacity
              onPress={() => {
                showDatePicker('deliveryDate');
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
              label="PO No# "
              value={poNo}
              mode="outlined"
              onChangeText={text => setPoNo(text)}
            />
          </View>

          <View style={{marginBottom: 30}} />

          <RadioGroup
            style={{flexDirection: 'row', color: '#000'}}
            radioButtons={radiogroup1}
            onPress={handleOptionChange}
            layout="row"
            selectedId={
              radiogroup1.find(item => item.value === selectedradiooption1)?.id
            }
          />

          <View style={{marginTop: hp('2%')}}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <View style={{flex: 1, marginRight: 10}}>
                <TextInput
                  label="Barcode *"
                  value={barCode}
                  mode="outlined"
                  onChangeText={text => setBarcode(text)}
                />
              </View>
              <TouchableOpacity
                onPress={handleSearchBarcode}
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
                    <View style={{width: 60}}>
                      <Text style={styles.table_head_captions}>Action</Text>
                    </View>
                    <View style={{width: 100}}>
                      <Text style={styles.table_head_captions}>Style No</Text>
                    </View>

                    <View style={{width: 10}} />
                    <View style={{width: 100}}>
                      <Text style={styles.table_head_captions}>Size</Text>
                    </View>
                    <View style={{width: 10}} />
                    <View style={{width: 100}}>
                      <Text style={styles.table_head_captions}>Total Qty</Text>
                    </View>
                    <View style={{width: 10}} />
                    <View style={{width: 100}}>
                      <Text style={styles.table_head_captions}>HSN</Text>
                    </View>

                    <View style={{width: 5}} />
                    <View style={{width: 100}}>
                      <Text style={styles.table_head_captions}>
                        Unit Price After Disc
                      </Text>
                    </View>

                    <View style={{width: 5}} />
                    <View style={{width: 60}}>
                      <Text style={styles.table_head_captions}>GST %</Text>
                    </View>

                    <View style={{width: 5}} />
                    <View style={{width: 60}}>
                      <Text style={styles.table_head_captions}>Gross</Text>
                    </View>

                    <View style={{width: 5}} />
                    <View style={{width: 60}}>
                      <Text style={styles.table_head_captions}>GST Amount</Text>
                    </View>

                    <View style={{width: 5}} />
                    <View style={{width: 60}}>
                      <Text style={styles.table_head_captions}>Total</Text>
                    </View>
                  </View>

                  {rows.length > 0 &&
                    rows.map((row, index) => {
                      // const netAmount =
                      //   Number(row.input_Qty || 0) *
                      //   Number(row.input_UnitPrice || 0);
                      // const gstAmount =
                      //   (netAmount * Number(row.input_Gst || 0)) / 100;
                      // const totalAmount = netAmount + gstAmount;

                      return (
                        <View key={index} style={styles.table_body_single_row}>
                          <View style={{width: 60}}>
                            <TouchableOpacity
                              onPress={() => handleRemoveRow(index)}>
                              <Image
                                source={closeImg}
                                style={styles.imageStyle1}
                              />
                            </TouchableOpacity>
                          </View>

                          <View style={{width: 100}}>
                            <Text style={styles.table_data}>
                              {row.styleName}
                            </Text>
                          </View>

                          <View style={{width: 10}} />
                          <View style={{width: 100}}>
                            <Text style={styles.table_data}>{row.size}</Text>
                          </View>

                          <View style={{width: 10}} />
                          <View style={{width: 100}}>
                            <TextInput
                              style={styles.table_data_input}
                              value={row.totolQty}
                              onChangeText={text => {
                                setRows(
                                  rows.map((r, i) =>
                                    i === index ? {...r, totolQty: text} : r,
                                  ),
                                );
                              }}
                              keyboardType="numeric"
                            />
                          </View>

                          <View style={{width: 10}} />
                          <View style={{width: 100}}>
                            <TextInput
                              style={styles.table_data_input}
                              value={row.hsn}
                              onChangeText={text => {
                                setRows(
                                  rows.map((r, i) =>
                                    i === index ? {...r, hsn: text} : r,
                                  ),
                                );
                              }}
                              keyboardType="numeric"
                            />
                          </View>

                          <View style={{width: 5}} />
                          <View style={{width: 100}}>
                            <Text style={styles.table_data}>
                              {row.unitPrice}
                            </Text>
                          </View>

                          <View style={{width: 5}} />
                          <View style={{width: 60}}>
                            <TextInput
                              style={styles.table_data_input}
                              value={row.gst_percent.toString()}
                              onChangeText={text => {
                                setRows(
                                  rows.map((r, i) =>
                                    i === index ? {...r, gst_percent: text} : r,
                                  ),
                                );
                              }}
                              keyboardType="numeric"
                            />
                          </View>

                          <View style={{width: 5}} />
                          <View style={{width: 60}}>
                            <TextInput
                              style={styles.table_data_input}
                              value={row.gross}
                              editable={false}
                            />
                          </View>

                          <View style={{width: 5}} />
                          <View style={{width: 60}}>
                            <TextInput
                              style={styles.table_data_input}
                              value={row.unitPricegstAmount}
                              editable={false}
                            />
                          </View>

                          <View style={{width: 5}} />
                          <View style={{width: 60}}>
                            <TextInput
                              style={styles.table_data_input}
                              value={row.totalRowAmount}
                              editable={false}
                            />
                          </View>
                        </View>
                      );
                    })}

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
                    <View style={{width: 100}}></View>
                    <View style={{width: 10}} />
                    <View style={{width: 100}}></View>
                    <View style={{width: 5}} />
                    <View style={{width: 100}}></View>
                    <View style={{width: 5}} />
                    <View style={{width: 60}}></View>
                    <View style={{width: 5}} />
                    <View style={{width: 60}}></View>
                    <View style={{width: 5}} />
                    <View style={{width: 60}}>
                      <Text style={styles.table_data}>Transport Cost</Text>
                    </View>
                    <View style={{width: 5}} />
                    <View style={{width: 60}}>
                      <TextInput
                        style={styles.table_data_input}
                        value={'0'}
                        // onChangeText={text =>
                        //   setTransportCost(Number(text) || 0)
                        // }
                        keyboardType="numeric"
                      />
                    </View>
                  </View>

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
                    <View style={{width: 100}}></View>
                    <View style={{width: 10}} />
                    <View style={{width: 100}}></View>
                    <View style={{width: 5}} />
                    <View style={{width: 100}}></View>
                    <View style={{width: 5}} />
                    <View style={{width: 60}}></View>
                    <View style={{width: 5}} />
                    <View style={{width: 60}}></View>
                    <View style={{width: 5}} />
                    <View style={{width: 60}}>
                      <Text style={styles.table_data}>{'Total Amount'}</Text>
                    </View>
                    <View style={{width: 5}} />
                    <View style={{width: 60}}>
                      <Text style={styles.table_data}>
                        {'20'}
                        {/* {(totalTotalAmount + transportCost).toFixed(2)} */}
                      </Text>
                    </View>
                  </View>
                </View>
              </ScrollView>
            </View>
          )}

          <Modal
            animationType="slide"
            transparent={true}
            visible={showModal}
            onRequestClose={() => setShowmodal(false)}>
            <TouchableWithoutFeedback onPress={() => setShowmodal(false)}>
              <View style={styles.companyModalOverlay} />
            </TouchableWithoutFeedback>
            <View style={styles.companyModalContainer}>
              <View style={styles.companyModalHeader}>
                <View />
                <Text style={styles.companyModalHeaderText}>
                  {'Style Pop Up'}
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    setShowmodal(false);
                    setquery('');
                  }}>
                  <Image
                    source={require('./../../../assets/images/png/close.png')}
                    style={{width: 30, height: 30, tintColor: colors.color2}}
                  />
                </TouchableOpacity>
              </View>

              {/* <View
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: '#eee',
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
                    setShowStyleList(!showStyleList);
                  }}>
                  <View>
                    <View style={[styles.SectionStyle1, {}]}>
                      <View style={{flexDirection: 'column'}}>
                        <Text
                          style={
                            styleId
                              ? [styles.dropTextLightStyle]
                              : [styles.dropTextInputStyle]
                          }>
                          {'Select Style '}
                        </Text>
                        {styleId ? (
                          <Text style={[styles.dropTextInputStyle]}>
                            {styleName}
                          </Text>
                        ) : null}
                      </View>
                    </View>
                  </View>

                  <View style={{justifyContent: 'center'}}>
                    <Image source={downArrowImg} style={styles.imageStyle} />
                  </View>
                </TouchableOpacity>

                {showStyleList && (
                  <View style={styles.dropdownContent1}>
                    <TextInput
                      style={styles.searchInput}
                      placeholder="Search "
                      onChangeText={handleSearchStyle}
                      placeholderTextColor="#000"
                    />
                    <ScrollView
                      style={styles.scrollView}
                      nestedScrollEnabled={true}>
                      {filteredStyle.length === 0 ? (
                        <Text style={styles.noCategoriesText}>
                          Sorry, no results found!
                        </Text>
                      ) : (
                        filteredStyle.map((item, index) => (
                          <TouchableOpacity
                            key={index}
                            style={styles.dropdownOption}
                            onPress={() => actionOnStyle(item)}>
                            <Text style={{color: '#000'}}>{item.name}</Text>
                          </TouchableOpacity>
                        ))
                      )}
                    </ScrollView>
                  </View>
                )}
              </View> */}

              <View style={styles.companyModalSearchBarContainer}>
                <View style={styles.companyModalSearchBarContainer}>
                  <View style={{flex: 1, marginRight: 10}}>
                    <TextInput
                      style={styles.companyModalSearchBar}
                      placeholder="Search ..."
                      placeholderTextColor="#aaa"
                      onChangeText={text => setquery(text)}
                    />
                  </View>

                  <TouchableOpacity
                    style={styles.searchButton1}
                    onPress={handleSelectFromModal}>
                    <Text style={styles.searchbuttonText}>Select</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.companyModalItemContentHeader}>
                <View
                  style={[
                    styles.checkboxItem,
                    {marginTop: hp('2%'), marginBottom: hp('2%'), flex: 0.5},
                  ]}>
                  <CustomCheckBox
                    isChecked={selectAllCheckBox}
                    onToggle={updateAllIndexes}
                  />
                </View>

                {/* Conditionally Render Table Headers Based on Selected Option */}

                <Text style={styles.companyModalDropdownItemTextHeader}>
                  Style No
                </Text>
                <View style={{flex: 0.2}} />

                <Text style={styles.companyModalDropdownItemTextHeader}>
                  fabric No
                </Text>
                <View style={{flex: 0.2}} />

                <Text style={styles.companyModalDropdownItemTextHeader}>
                  Avail Qty
                </Text>
                <View style={{flex: 0.2}} />
                <Text style={styles.companyModalDropdownItemTextHeader}>
                  Price
                </Text>
              </View>

              <View style={styles.companyModalListContainer}>
                {filteredCompanyList.length === 0 ? (
                  <Text style={styles.companyModalNoResultsText}>
                    No results found
                  </Text>
                ) : (
                  <FlatList
                    data={filteredCompanyList}
                    keyExtractor={(_, index) => index.toString()}
                    renderItem={({item, index}) => (
                      <TouchableOpacity
                        style={styles.companyModalDropdownItem}
                        onPress={() => toggleSelection(index)}>
                        <View style={styles.companyModalItemContent}>
                          <View
                            style={[
                              styles.checkboxItem,
                              {
                                marginTop: hp('2%'),
                                marginBottom: hp('2%'),
                                flex: 0.5,
                              },
                            ]}>
                            <CustomCheckBox
                              isChecked={selectedIdxs.includes(index)}
                              onToggle={() => toggleSelection(index)}
                            />
                          </View>

                          <Text style={styles.companyModalDropdownItemText}>
                            {item.styleNo}
                          </Text>
                          <View style={{flex: 0.2}} />
                          <Text style={styles.companyModalDropdownItemText}>
                            {item.fabricNo}
                          </Text>
                          <View style={{flex: 0.2}} />
                          <Text style={styles.companyModalDropdownItemText}>
                            {item.availQty}
                          </Text>
                          <View style={{flex: 0.2}} />
                          <Text style={styles.companyModalDropdownItemText}>
                            {item.priceStr}
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

export default CreateBillGenerationBarcodeUI;

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
