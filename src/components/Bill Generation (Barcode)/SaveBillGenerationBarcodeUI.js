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

const SaveBillGenerationBarcodeUI = ({route, ...props}) => {
  const navigation = useNavigation();
  const [rows, setRows] = React.useState([]);
  const [selectedradiooption1, setSelectedradiooption1] = useState('MasterBox');
  const [totalQty, setTotalQty] = useState(false);
  const [invoiceNo, setInvoiceNo] = useState('');
  const [poNo, setPoNo] = useState('');
  const [barCode, setBarcode] = useState('');
  const [prefix, setPrefix] = useState('');
  const [suffix, setSuffix] = useState('');
  const [transportCost, setTransportCost] = useState('0');
  const {colors} = useContext(ColorContext);

  const styles = getStyles(colors);

  const backBtnAction = () => {
    props.backBtnAction();
  };

  const popOkBtnAction = () => {
    props.popOkBtnAction();
  };

  useEffect(() => {
    if (props.itemsObj) {
      console.log(
        'itemsObj po ====>  ',
        props.itemsObj.viewBuyerPOList,
      );
      if (props.itemsObj) {
        if (props.itemsObj.viewBuyerPOList) {
          if (props.itemsObj.viewBuyerPOList.master_box_barcode) {
            setMasterBoxBarcode(
              props.itemsObj.viewBuyerPOList.master_box_barcode,
            );
          }
          if (props.itemsObj.viewBuyerPOList.master_box_proforma_id) {
            // console.log("master_box_proforma_id ====> ",props.itemsObj.viewBuyerPOList)
            setPiNo(props.itemsObj.viewBuyerPOList.master_box_proforma_id);
          }
          if (props.itemsObj.viewBuyerPOList.invoiceNo) {
            setInvoiceNo(props.itemsObj.viewBuyerPOList.invoiceNo);
          }
          if (props.itemsObj.viewBuyerPOList.billToId) {
            setBillNoId(props.itemsObj.viewBuyerPOList.billToId);
          }
          if (props.itemsObj.viewBuyerPOList.billToIdStr) {
            setBillNo(props.itemsObj.viewBuyerPOList.billToIdStr);
          }
          if (props.itemsObj.viewBuyerPOList.companyLocationId) {
            setShipLocationId(props.itemsObj.viewBuyerPOList.companyLocationId);
            setShipLocationName(
              props.itemsObj.companyLocationsMap[
                props.itemsObj.viewBuyerPOList.companyLocationId
              ],
            );
          }

          if (props.itemsObj.viewBuyerPOList.soChildMappingDao) {
            setRows(props.itemsObj.viewBuyerPOList.soChildMappingDao);
            console.log("child ==> ",props.itemsObj.viewBuyerPOList.soChildMappingDao)
          }
          if (props.itemsObj.viewBuyerPOList.vendorCustomerId) {
            setShipToId(props.itemsObj.viewBuyerPOList.vendorCustomerId);
          }
          if (props.itemsObj.viewBuyerPOList.vendorCustomerName) {
            setShipToName(props.itemsObj.viewBuyerPOList.vendorCustomerName);
          }
          if (props.itemsObj.viewBuyerPOList.transactionDateStr) {
            settxnDate(props.itemsObj.viewBuyerPOList.transactionDateStr);
          }
          if (props.itemsObj.viewBuyerPOList.transportCost) {
            setTransportCost(props.itemsObj.viewBuyerPOList.transportCost);
          }
          if (props.itemsObj.viewBuyerPOList.shipDateStr) {
            setDeliveryDate(props.itemsObj.viewBuyerPOList.shipDateStr);
          }
          if (props.itemsObj.companyLocationsMap) {
            const shipFromList = Object.keys(
              props.itemsObj.companyLocationsMap,
            ).map(key => ({
              id: key,
              name: props.itemsObj.companyLocationsMap[key],
            }));
            setFilteredShipLocation(shipFromList);
            setShipLocationList(shipFromList);
          }
          if (props.itemsObj.vendorsCustomersMap) {
            const shipToList = Object.keys(
              props.itemsObj.vendorsCustomersMap,
            ).map(key => ({
              id: key,
              name: props.itemsObj.vendorsCustomersMap[key],
            }));
            setFilteredShipTo(shipToList);
            setShipToList(shipToList);
          }
          if (props.itemsObj.vendorsCustomersMap) {
            const shipToList = Object.keys(
              props.itemsObj.vendorsCustomersMap,
            ).map(key => ({
              id: key,
              name: props.itemsObj.vendorsCustomersMap[key],
            }));
            setFilteredBillNoList(billNoList);
            setBillNoList(billNoList);
          }
        }
      }
    }
  }, [props.itemsObj]);

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

  const [piNo, setPiNo] = useState('');
  const [masterBoxBarcode, setMasterBoxBarcode] = useState('');

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
    // handleOpenModal(item.id);
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
    if (text.trim().length !== 9) return;

    if (!shipToId) {
      Alert.alert('Alert', 'Please select the Vendor/Customer');
      return;
    }

    if (!text) {
      Alert.alert('Please Enter the Valid Barcode');
      return;
    }
    console.log('calling validation api ');
    props.validateBarCode(text);
  };

  const handleSearchBarcode = () => {
    if (!barCode) {
      Alert.alert('Alert', 'Please Enter Barcode !');
    }
    handleScannedCode(barCode);
  };

  const handleBarcodeChange = text => {
    setBarcode(text);
    handleScannedCode(text);
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

  const submitAction = async () => {
    const filteredRows = rows.map(item => ({
      gsCode: item.GSCode,
      prePackQuantity: item.EnteredPrePackQty || '0',
      quantity: item.RequiredQty,
      price: item.Price,
      sizeCapacity: item.ItemSize,
      itemId: item.ItemId,
      barcodeNo: item.barcodeNo,
      other: '',
      orderId: item.orderId,
      locationId: `${shipLocationId}-${item.Prepack}`,
      discountAmount: 0,
      discountPercentage: 0,
      colorCount: item.ColorCount,
      hsn: item.Hsn,
      gstRate: item.Gst,
      gstAmount: item.unitPricegstAmount,
      prePack: item.Prepack,
    }));
    const Obj = {
      transactionDate: formattedDate(txnDate),
      transportDate: '',
      dueDate: '',
      shipDate: formattedDate(deliveryDate),
      vendorCustomerId: shipToId,
      billToId: billNoId,
      poNumber: poNo,
      vendorId: shipToId,
      companyLocationId: shipLocationId,
      financialYear: new Date().getFullYear(),
      yearwiseId: 0,
      transportName: '',
      transportNo: '',
      bookingNo: '',
      cartonNo: '',
      invoiceNo: `${prefix}${invoiceNo}${suffix}`,
      itemType: 'STYLE',
      agentId: 0,
      subagentId: 0,
      notes: '',

      transportCost: transportCost,
      totalDiscount: 0,
      totalDiscountPer: 0,
      soNumber: 0,
      convRate: 0,
      additionalAmount: 0,
      roundtotal: '0',
      roundtotal2: '0',

      packages: '',
      packincharge: '',
      ackno: '',
      area: '',
      eway: '',
      allRolls: '',
      corg: 0,
      pIids: '',
      masterboxbarcode: '', // scanned barcodes string
      master_box_proforma_id: '0',
      items: filteredRows || [],
    };

    // console.log('save Obj ==> ', Obj);
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
      // {
      //   id: '1',
      //   label: 'Box',
      //   value: 'Box',
      //   selected: selectedradiooption1 === 'Box',
      //   labelStyle: {color: '#000'},
      // },
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

  const handleInputChange = (index, field, value) => {
    const updatedRows = [...rows];

    // Convert to number for numeric fields
    let parsedValue = value;
    if (field === 'RequiredQty' || field === 'Price' || field === 'Gst') {
      parsedValue = value === '' ? '' : Number(value);
    }

    updatedRows[index][field] = parsedValue;

    // Do your calculations
    const qty = Number(updatedRows[index].RequiredQty || 0);
    const price = Number(updatedRows[index].Price || 0);
    const gstPercent = Number(updatedRows[index].Gst || 0);

    const gross = qty * price;
    const gstAmount = (gross * gstPercent) / 100;
    const totalRowAmount = gross + gstAmount;

    updatedRows[index].gross = gross.toFixed(2);
    updatedRows[index].unitPricegstAmount = gstAmount.toFixed(2);
    updatedRows[index].totalRowAmount = totalRowAmount.toFixed(2);

    setRows(updatedRows);
  };

  // let totals = {totalQty: 0, totalGross: 0, totalGst: 0, totalAmount: 0};

  // if (rows?.length > 0) {
  //   totals = rows.reduce(
  //     (acc, row) => {
  //       const qty = Number(row.itemQty || 0);
  //       const price = Number(row.price || 0);
  //       const gst = Number(row.gst || 0);
  //       const discountPercentage = Number(row.discountPercentage || 0);

  //       const unitPriceAfterDisc = price - (price * discountPercentage) / 100;
  //       const grossAfterDisc = qty * unitPriceAfterDisc;
  //       const gstAmount = grossAfterDisc * (gst / 100);
  //       const total = grossAfterDisc + gstAmount;

  //       acc.totalQty += qty;
  //       acc.totalGross += grossAfterDisc;
  //       acc.totalGst += gstAmount;
  //       acc.totalAmount += total;

  //       return acc;
  //     },
  //     {totalQty: 0, totalGross: 0, totalGst: 0, totalAmount: 0},
  //   );
  // }

  //   function truncateToTwoDecimals(value) {
  //   return Math.floor(value * 100) / 100;
  // }

  // let totals = {totalQty: 0, totalGross: 0, totalGst: 0, totalAmount: 0};

  // if (rows?.length > 0) {
  //   totals = rows.reduce(
  //     (acc, row) => {
  //       const qty = Number(row.itemQty || 0);
  //       const price = Number(row.price || 0);
  //       const gst = Number(row.gst || 0);
  //       const discountPercentage = Number(row.discountPercentage || 0);

  //       const unitPriceAfterDisc = price - (price * discountPercentage) / 100;
  //       const grossAfterDisc = qty * unitPriceAfterDisc;
  //       const gstAmount = truncateToTwoDecimals(grossAfterDisc * (gst / 100));
  //       const total = truncateToTwoDecimals(grossAfterDisc + gstAmount);

  //       acc.totalQty += qty;
  //       acc.totalGross += grossAfterDisc;
  //       acc.totalGst += gstAmount;
  //       acc.totalAmount += total;

  //       return acc;
  //     },
  //     {totalQty: 0, totalGross: 0, totalGst: 0, totalAmount: 0},
  //   );
  // }

  let totals = {totalQty: 0, totalGross: 0, totalGst: 0, totalAmount: 0};

  if (rows?.length > 0) {
    totals = rows.reduce(
      (acc, row) => {
        const qty = Number(row.itemQty || 0);
        const price = Number(row.price || 0);
        const gst = Number(row.gst || 0);
        const discountPercentage = Number(row.discountPercentage || 0);

        // calculate step by step
        const unitPriceAfterDisc = price - (price * discountPercentage) / 100;
        const grossAfterDisc = qty * unitPriceAfterDisc;

        const gstAmount = (grossAfterDisc * gst) / 100;
        const total = grossAfterDisc + gstAmount;

        // round each value before adding
        const grossRounded = Math.round(grossAfterDisc * 100) / 100;
        const gstRounded = Math.round(gstAmount * 100) / 100;
        const totalRounded = Math.round(total * 100) / 100;

        acc.totalQty += qty;
        acc.totalGross += grossRounded;
        acc.totalGst += gstRounded;
        acc.totalAmount += totalRounded;

        return acc;
      },
      {totalQty: 0, totalGross: 0, totalGst: 0, totalAmount: 0},
    );

    // final rounding to 2 decimals (in case of accumulation precision)
    totals.totalGross = Math.round(totals.totalGross * 100) / 100;
    totals.totalGst = Math.round(totals.totalGst * 100) / 100;
    totals.totalAmount = Math.round(totals.totalAmount * 100) / 100;
  }

  console.log('totals', totals);

  return (
    <View style={[CommonStyles.mainComponentViewStyle]}>
      <View style={[CommonStyles.headerView]}>
        <HeaderComponent
          isBackBtnEnable={true}
          isSettingsEnable={false}
          isChatEnable={false}
          isTImerEnable={false}
          isTitleHeaderEnable={true}
          title={'Save BillGeneration Barcode'}
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

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: hp('2%'),
            }}>
            {/* Label */}
            <Text style={{color: 'red'}}>*</Text>
            <Text style={{fontWeight: 'bold', marginLeft: 2}}>InvoiceNo :</Text>

            {/* Prefix */}
            <Text style={{fontWeight: 'bold', marginLeft: 5}}>{prefix}</Text>

            {/* Input box */}
            <TextInput
              style={{
                borderWidth: 1,
                borderColor: '#ccc',
                paddingHorizontal: 8,
                paddingVertical: 4,
                width: '50%',
                marginHorizontal: 5,
              }}
              value={invoiceNo}
              onChangeText={text => setInvoiceNo(text)}
            />

            {/* Suffix */}
            <Text style={{fontWeight: 'bold'}}>{suffix}</Text>
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
                placeholder=""
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
                placeholder=""
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
              label="Proforma Invoice ID "
              value={piNo}
              mode="outlined"
              onChangeText={text => setPiNo(text)}
              editable={false}
            />
          </View>
          <View style={{marginTop: hp('2%')}}>
            <TextInput
              label="Master Box Barcode "
              value={masterBoxBarcode}
              mode="outlined"
              onChangeText={text => setMasterBoxBarcode(text)}
              editable={false}
            />
          </View>

          <View style={{marginBottom: 20}} />

          {rows?.length > 0 && (
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
                       Unit Price
                      </Text>
                    </View>

                    <View style={{width: 5}} />
                    <View style={{width: 100}}>
                      <Text style={styles.table_head_captions}>
                        Unit Price After Disc
                      </Text>
                    </View>

                    <View style={{width: 5}} />
                    <View style={{width: 100}}>
                      <Text style={styles.table_head_captions}>GST %</Text>
                    </View>

                    <View style={{width: 5}} />
                    <View style={{width: 100}}>
                      <Text style={styles.table_head_captions}>Gross</Text>
                    </View>

                    <View style={{width: 5}} />
                    <View style={{width: 100}}>
                      <Text style={styles.table_head_captions}>GST Amount</Text>
                    </View>

                    <View style={{width: 5}} />
                    <View style={{width: 100}}>
                      <Text style={styles.table_head_captions}>Total</Text>
                    </View>
                  </View>

                  {rows.length > 0 &&
                    rows.map((row, index) => {
                      const qty = Number(row.itemQty || 0);
                      const price = Number(row.price || 0);
                      const gst = Number(row.gst || 0);
                      const discountPercentage = Number(
                        row.discountPercentage || 0,
                      );

                      const gross = qty * price;
                      const unitPriceAfterDisc =
                        price - (price * discountPercentage) / 100;
                      const grossAfterDisc = qty * unitPriceAfterDisc;
                      const gstAmount = grossAfterDisc * (gst / 100);
                      const total = grossAfterDisc + gstAmount;

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
                              {row.itemdesc}
                            </Text>
                          </View>

                          <View style={{width: 10}} />

                          <View style={{width: 100}}>
                            <Text style={styles.table_data}>
                              {row.sizeCapacity}
                            </Text>
                          </View>

                          <View style={{width: 10}} />

                          <View style={{width: 100}}>
                            <TextInput
                              style={styles.table_data_input}
                              value={String(row.itemQty || '')}
                              onChangeText={text =>
                                handleInputChange(index, 'RequiredQty', text)
                              }
                              editable={false}
                              keyboardType="numeric"
                            />
                          </View>

                          <View style={{width: 10}} />

                          <View style={{width: 100}}>
                            <TextInput
                              style={styles.table_data_input}
                              value={row.HSN}
                              onChangeText={text =>
                                handleInputChange(index, 'Hsn', text)
                              }
                              editable={false}
                            />
                          </View>

                          <View style={{width: 5}} />

                          <View style={{width: 100}}>
                            <Text style={styles.table_data}>
                              {price.toFixed(2)}
                            </Text>
                          </View>

                          <View style={{width: 5}} />

                          <View style={{width: 100}}>
                            <Text style={styles.table_data}>
                              {unitPriceAfterDisc.toFixed(2)}
                            </Text>
                          </View>

                          <View style={{width: 5}} />

                          <View style={{width: 100}}>
                            <TextInput
                              style={styles.table_data_input}
                              value={String(row.gst || '')}
                              onChangeText={text =>
                                handleInputChange(index, 'Gst', text)
                              }
                              editable={false}
                              keyboardType="numeric"
                            />
                          </View>

                          <View style={{width: 5}} />

                          <View style={{width: 100}}>
                            <TextInput
                              style={styles.table_data_input}
                              value={grossAfterDisc.toFixed(2)}
                              editable={false}
                            />
                          </View>

                          <View style={{width: 5}} />

                          <View style={{width: 100}}>
                            <TextInput
                              style={styles.table_data_input}
                              value={gstAmount.toFixed(2)}
                              editable={false}
                            />
                          </View>

                          <View style={{width: 5}} />

                          <View style={{width: 100}}>
                            <TextInput
                              style={styles.table_data_input}
                              value={total.toFixed(2)}
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
                    <View style={{width: 100}}>
                      <Text style={styles.table_data}>
                        {totals.totalQty.toFixed(2)}
                      </Text>
                    </View>
                    <View style={{width: 10}} />
                    <View style={{width: 100}}></View>
                    <View style={{width: 5}} />
                    <View style={{width: 100}}></View>
                    <View style={{width: 5}} />
                    <View style={{width: 100}}></View>
                    <View style={{width: 5}} />
                    <View style={{width: 100}}></View>
                    <View style={{width: 5}} />
                    <View style={{width: 100}}>
                      <Text style={styles.table_data}>
                        {totals.totalGross.toFixed(2)}
                      </Text>
                    </View>
                    <View style={{width: 5}} />
                    <View style={{width: 100}}>
                      <Text style={styles.table_data}>
                        {totals.totalGst.toFixed(2)}
                      </Text>
                    </View>
                    <View style={{width: 5}} />
                    <View style={{width: 100}}>
                      <Text style={styles.table_data}>
                        {totals.totalAmount.toFixed(2)}
                      </Text>
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
                    <View style={{width: 100}}></View>
                    <View style={{width: 5}} />
                    <View style={{width: 100}}></View>
                    <View style={{width: 5}} />
                    <View style={{width: 100}}></View>
                    <View style={{width: 5}} />
                    <View style={{width: 100}}>
                      <Text style={styles.table_data}>Transport Cost</Text>
                    </View>
                    <View style={{width: 5}} />
                    <View style={{width: 100}}>
                      <TextInput
                        style={styles.table_data_input}
                        value={transportCost?.toString() || '0'}
                        onChangeText={text =>
                          setTransportCost(Number(text) || 0)
                        }
                        editable={false}
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
                    <View style={{width: 100}}></View>
                    <View style={{width: 5}} />
                    <View style={{width: 100}}></View>
                    <View style={{width: 5}} />
                    <View style={{width: 100}}></View>
                    <View style={{width: 5}} />
                    <View style={{width: 100}}>
                      <Text style={styles.table_data}>{'Total Amount'}</Text>
                    </View>
                    <View style={{width: 5}} />
                    <View style={{width: 100}}>
                      <Text style={styles.table_data}>
                        {(
                          totals.totalAmount + Number(transportCost || 0)
                        ).toFixed(2)}
                      </Text>
                    </View>
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
          rigthBtnState={false}
          isRightBtnEnable={false}
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

export default SaveBillGenerationBarcodeUI;

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
