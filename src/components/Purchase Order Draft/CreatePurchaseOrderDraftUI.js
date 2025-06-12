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

let downArrowImg = require('./../../../assets/images/png/dropDownImg.png');
let closeImg = require('./../../../assets/images/png/close1.png');

const CreatePurchaseOrderDraftUI = ({route, navigation, ...props}) => {
  const [rows, setRows] = React.useState([]);
  const [selectedradiooption1, setSelectedradiooption1] = useState('StyleWise');
  const [selectedradiooption2, setSelectedradiooption2] = useState('RM');
  const [totalQty, setTotalQty] = useState(false);
  const [remarks, set_remarks] = useState('');
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
      if (props.lists.ShipTo) {
        setFilteredShipTo(props.lists.ShipTo);
        setShipToList(props.lists.ShipTo);
      }
      if (props.lists.ShipLocation) {
        setShipLocationList(props.lists.ShipLocation);
        setFilteredShipLocation(props.lists.ShipLocation);
      }
      if (props.lists.vendorsMap) {
        setFilteredVendor(props.lists.vendorsMap);
        setVendorList(props.lists.vendorsMap);
      }
      if (props.lists.styleMap) {
        setFilteredStyle(props.lists.styleMap);
        setStyleList(props.lists.styleMap);
      }
    }
  }, [props.lists]);

  useEffect(() => {
    if (props.modalLists) {
      if (props.modalLists.StyleFg && selectedradiooption1 === 'Style (FG)') {
        setModalLists(props.modalLists.StyleFg);
      }
      if (
        props.modalLists.styleTrimfab &&
        selectedradiooption2 === 'Trim Fabric(RM)'
      ) {
        setModalLists(props.modalLists.styleTrimfab);
      }
      if (props.modalLists.styleRm && selectedradiooption2 === 'RM') {
        setModalLists(props.modalLists.styleRm);
      }
      if (props.modalLists.styleFab && selectedradiooption2 === 'Fabric') {
        setModalLists(props.modalLists.styleFab);
      }

      // console.log('LIst ==> ', props.modalLists.styleFab);

      // console.log('StyleFg ==> ', props.modalLists.StyleFg.length);
      // console.log('styleRm ==> ', props.modalLists.styleRm.length);
      // console.log('styleFab ==> ', props.modalLists.styleFab.length);
      // console.log('styleTrimfab ==> ', props.modalLists.styleTrimfab.length);
    }
  }, [props.modalLists]);

  useEffect(() => {
    console.log('setting data ===> ', new Date());
    handleConfirm(new Date(), 1);
  }, []);

  // Process
  // Vendor state variables
  const [vendorList, setVendorList] = useState([]);
  const [filteredVendor, setFilteredVendor] = useState([]);
  const [showVendorList, setShowVendorList] = useState(false);
  const [vendorName, setVendorName] = useState(''); // Default can be set as needed
  const [vendorId, setVendorId] = useState('');

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
  const [orderDate, setOrderDate] = useState('');
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
  const [styleName, setStyleName] = useState(''); // Default can be set as needed
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

  const actionOnVendor = item => {
    setVendorId(item.id);
    setVendorName(item.name);
    setShowVendorList(false);
  };

  const handleSearchVendor = text => {
    if (text.trim().length > 0) {
      const filtered = vendorList.filter(item =>
        item.name.toLowerCase().includes(text.toLowerCase()),
      );
      setFilteredVendor(filtered);
    } else {
      setFilteredVendor(vendorList);
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

  const submitAction = async draft => {
    let usercompanyId = await AsyncStorage.getItem('companyId');

    if (!vendorId) {
      Alert.alert('Alert ', 'Please Select Vendor');
      return;
    }
    if (!deliveryDate) {
      Alert.alert('Alert ', 'Please Select Delivery Date');
      return;
    }
    if (rows.length < 1) {
      Alert.alert('Alert ', 'Please add RM/Fabric/Trim Fabric to continue..');
      return;
    }
    // if (!shipLocationId || !shipToId || !orderDate) {
    //   Alert.alert('Alert ', 'Please fill all Mandaory fields');
    //   return;
    // }
    for (let i = 0; i < rows.length; i++) {
      const item = rows[i];
      if (!item.input_Qty || parseFloat(item.input_Qty) <= 0) {
        Alert.alert(
          'Alert',
          `Please enter valid quantity for item ${item.styleNameALL || i + 1}`,
        );
        return;
      }
      if (!item.input_UnitPrice || parseFloat(item.input_UnitPrice) <= 0) {
        Alert.alert(
          'Alert',
          `Please enter valid price for item ${item.styleNameALL || i + 1}`,
        );
        return;
      }
    }

    const checkedData = [];
    rows.forEach((item, index) => {
      const netAmount =
        Number(item.input_Qty || 0) * Number(item.input_UnitPrice || 0);
      const gstAmount = (netAmount * Number(item.input_Gst || 0)) / 100;
      let itemId = '';
      if (selectedradiooption2 === 'RM') {
        itemId = item.trimTypeId;
        itemName = item.trimName;
        itemDescription = item.description;
      } else if (selectedradiooption2 === 'Fabric') {
        itemId = item.fabricId;
        itemName = item.fabricNo;
        itemDescription = item.colorName;
      } else if (selectedradiooption2 === 'Trim Fabric(RM)') {
        itemId = item.trimconstruction_id;
        itemName = item.trimName;
        itemDescription = item.description;
      }
      const tempObj = {
        itemId: itemId || 0,
        itemQty: item.input_Qty,
        itemTrimsType: selectedradiooption2,
        itemdesc: itemName || '',
        sizeCapacity: '',
        gsCode: '',
        gstAmount: gstAmount,
        price: item.input_UnitPrice,
        gstper: item.input_Gst,
        pml_gst: item.input_Gst,
        uom: item.uomTypeDescription || '',
        discountAmount: 0,
        styleId: 0,
        buyer_Po_Id: 0,
        grnAllow: '0',
        style_size_id: 0,
        pml_fab_width: 0,
        buyerNo: 0,
        batchid: 0,
        withAllowance: 0,
        po_gsm: '',
        weight: '',
        po_rib_id: '0',
        processid: '0',
        description: itemDescription || '',
      };
      checkedData.push(tempObj);
    });

    let companyObj = await AsyncStorage.getItem('companyObj');
    const objj = JSON.parse(companyObj);
    console.log('companyObj po suf ==> ', objj.posuffix);

    const totalInputQty = rows.reduce(
      (sum, item) => sum + parseFloat(item.input_Qty || 0),
      0,
    );
    const tempObj = {
      deliveryDate: formatDateIntoDMY(deliveryDate),
      shiploc: shipLocationId,
      orderDate: formatDateIntoDMY(orderDate),
      itemTrimsType: selectedradiooption2,
      issueDate: '',
      shipcancelDate: '',
      preferredDate: '',
      shipextDate: '',
      completionDate: '',
      availDate: '',
      notes: remarks,
      codeType: '',
      contactId: 0,
      cf_gst: 0,
      vendorCustomerId: shipToId,
      vendorId: vendorId,
      transportCost: 0,
      additional_cost: 0,
      costfoc: 0,
      hsn: '0',
      companySymbol: objj.companySymbol,
      suffix: objj.posuffix,
      qtys: 0,
      poNumber: 0,
      posave: draft ? 2 : 1,
      p_conv_rate: 0.0,
      pocancel: '',
      tc_gst: 0,
      tc_hsn: 0,
      ac_gst: 0,
      ac_hsn: 0,
      cf_hsn: '0',
      financialYear: 0,
      yearwiseId: 0,
      termofpayment: '',
      otherReference: '',
      destination: '',
      buyerno: '',
      dispatch: '',
      roundOff: 0.0,
      isCustStyleWise: 0,
      additionalAmount: 0,
      poTcs: 0,
      seqIdForStyle: '',
      modify_user: '',
      styleOrBuyerpo: 0,
      lineItemsSet: checkedData,

      totalQty: totalInputQty,
      subTotal: totalNetAmount,
      totalPrice: totalNetAmount,
      gstAmount: totalGstAmount,
      gst_prct: '0',
      totalDiscountAmount: '0',
    };
    // console.log('sub obj  po save ===> ', tempObj.posave);
    // return;

    props.submitAction(tempObj);
  };

  const handleRemoveRow = id => {
    setRows(prev => prev.filter((_, index) => index !== id));
  };

  const handleConfirm = (date, initial = 0) => {
    const extractedDate = date.toISOString().split('T')[0];
    const formattedDate = formatDateIntoDMY(extractedDate);
    if (initial === 1) {
      setOrderDate(formattedDate);
    } else {
      if (activeField === 'deliveryDate') {
        setDeliveryDate(formattedDate);
      } else if (activeField === 'orderDate') {
        setOrderDate(formattedDate);
      }
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
        label: 'StyleWise',
        value: 'StyleWise',
        selected: selectedradiooption1 === 'StyleWise',
        labelStyle: {color: '#000'},
      },
      {
        id: '3',
        label: 'Style (FG)',
        value: 'Style (FG)',
        selected: selectedradiooption1 === 'Style (FG)',
        labelStyle: {color: '#000'},
      },
    ],
    [selectedradiooption1],
  );

  const handleOptionChange = selectedId => {
    if (rows.length > 0) return;

    const selected = radiogroup1.find(button => button.id === selectedId);
    if (selected) {
      setSelectedradiooption1(selected.value);
      if (selected.value === 'Style (FG)') {
        setSelectedradiooption2('');
      } else {
        setSelectedradiooption2('RM');
      }
      setSelectedIdxs([]);
    }
  };

  const radiogroup2 = useMemo(
    () => [
      {
        id: '1',
        label: 'RM',
        value: 'RM',
        selected: selectedradiooption2 === 'RM',
        labelStyle: {color: '#000'},
      },
      {
        id: '2',
        label: 'Fabric',
        value: 'Fabric',
        selected: selectedradiooption2 === 'Fabric',
        labelStyle: {color: '#000'},
      },
      {
        id: '3',
        label: 'Trim Fabric(RM)',
        value: 'Trim Fabric(RM)',
        selected: selectedradiooption2 === 'Trim Fabric(RM)',
        labelStyle: {color: '#000'},
      },
    ],
    [selectedradiooption2],
  );

  const handleOptionChange2 = selectedId => {
    if (rows.length > 0) return;
    const selected = radiogroup2.find(button => button.id === selectedId);
    if (selected) {
      setSelectedradiooption2(selected.value);
      setSelectedIdxs([]);
    }
  };

  const filteredCompanyList = modalLists.filter(item => {
    if (selectedradiooption1 === 'Style (FG)') {
      return (
        item?.custStyleName?.toLowerCase().includes(query.toLowerCase()) ||
        item?.styleName?.toLowerCase().includes(query.toLowerCase())
      );
    } else if (selectedradiooption2 === 'RM') {
      return (
        item?.trimName?.toLowerCase().includes(query.toLowerCase()) ||
        item?.description?.toLowerCase().includes(query.toLowerCase())
      );
    } else if (selectedradiooption2 === 'Fabric') {
      return (
        item?.fabricNo?.toLowerCase().includes(query.toLowerCase()) ||
        item?.colorName?.toLowerCase().includes(query.toLowerCase())
      );
    } else if (selectedradiooption2 === 'Trim Fabric(RM)') {
      return (
        item?.trimName?.toLowerCase().includes(query.toLowerCase()) ||
        item?.description?.toLowerCase().includes(query.toLowerCase())
      );
    }
    return false;
  });

  const handleSelectFromModal = () => {
    setRows([]);
    const list = selectedIdxs.map(index => {
      const item = {...modalLists[index]};

      if (
        selectedradiooption1 === 'Style (FG)' &&
        selectedradiooption2 === ''
      ) {
        item.styleNameALL = item.styleName || '';
      } else if (selectedradiooption2 === 'RM') {
        item.styleNameALL = item.trimName || '';
      } else if (selectedradiooption2 === 'Fabric') {
        item.styleNameALL = item.fabricNo || '';
      } else if (selectedradiooption2 === 'Trim Fabric(RM)') {
        item.styleNameALL = item.trimName || '';
      }

      item.input_UnitPrice = item.unitPrice || '';
      item.input_Qty = '';
      item.input_Gst = '';
      item.input_NetAmount = '';
      item.input_GstAmount = '';
      item.input_TotalAmount = '';

      return item;
    });

    // list.input_UnitPrice = '';
    // list.input_Qty = '';
    // list.input_Gst = '';
    // list.input_NetAmount = '';
    // list.input_GstAmount = '';
    // list.input_TotalAmount = '';

    console.log('Updated list ===>', list);
    setRows(list);
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

  const handleOpenModal = () => {
    if (selectedradiooption1 === 'Style (FG)') {
      props.getModalStyleFgList();
    } else {
      if (selectedradiooption2 === 'RM') {
        props.getModalLists(1);
      } else if (selectedradiooption2 === 'Fabric') {
        props.getModalLists(2);
      } else {
        props.getModalLists(3);
      }
    }
    setShowmodal(!showModal);
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

  function formatDateIntoDMY(inp) {
    const [y, m, d] = inp.split('-');
    let ans = [d, m, y];
    ans = ans.join('-');
    return ans;
  }

  return (
    <View style={[CommonStyles.mainComponentViewStyle]}>
      <View style={[CommonStyles.headerView]}>
        <HeaderComponent
          isBackBtnEnable={true}
          isSettingsEnable={false}
          isChatEnable={false}
          isTImerEnable={false}
          isTitleHeaderEnable={true}
          title={'Create PO'}
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
                setShowVendorList(!showVendorList);
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
                      {'Vendor *'}
                    </Text>
                    {vendorId ? (
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
                  {filteredVendor.length === 0 ? (
                    <Text style={styles.noCategoriesText}>
                      Sorry, no results found!
                    </Text>
                  ) : (
                    filteredVendor.map((item, index) => (
                      <TouchableOpacity
                        key={index}
                        style={styles.dropdownOption}
                        onPress={() => actionOnVendor(item)}>
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
                      {'Ship Location *'}
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
            <View style={{width: '85%'}}>
              <TextInput
                label="Order Date *"
                value={orderDate ? orderDate : ''}
                placeholder="Order Date"
                placeholderTextColor="#000"
                mode="outlined"
                color="#000"
              />
            </View>
            <TouchableOpacity
              onPress={() => {
                showDatePicker('orderDate');
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
                label="Delivery Date *"
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

          <View style={{marginBottom: 20}} />

          {selectedradiooption1 !== 'Style (FG)' && (
            <RadioGroup
              style={{flexDirection: 'row', color: '#000', marginTop: 20}}
              radioButtons={radiogroup2}
              onPress={handleOptionChange2}
              layout="row"
              selectedId={
                radiogroup2.find(item => item.value === selectedradiooption2)
                  ?.id
              }
            />
          )}

          {/* <View style={[styles.checkboxItem, {marginTop: hp('2%')}]}>
            <CustomCheckBox
              isChecked={totalQty}
              onToggle={() => setTotalQty(!totalQty)}
            />
            <Text style={styles.checkboxLabel}>{'Total Qty'}</Text>
          </View> */}

          <TouchableOpacity
            style={styles.searchButton}
            onPress={handleOpenModal}>
            <Text style={styles.searchbuttonText}>
              Search {selectedradiooption2}
            </Text>
          </TouchableOpacity>

          {rows.length > 0 && (
            <View style={styles.wrapper}>
              <ScrollView nestedScrollEnabled={true} horizontal>
                <View style={styles.table}>
                  <View style={styles.table_head}>
                    <View style={{width: 60}}>
                      <Text style={styles.table_head_captions}>Action</Text>
                    </View>
                    <View style={{width: 60}}>
                      <Text style={styles.table_head_captions}>Qty</Text>
                    </View>
                    <View style={{width: 10}} />

                    <View style={{width: 100}}>
                      <Text style={styles.table_head_captions}>Style No</Text>
                    </View>

                    <View style={{width: 100}}>
                      {selectedradiooption1 === 'Style (FG)' &&
                        selectedradiooption2 === '' && (
                          <Text style={styles.table_head_captions}>
                            Customer Style No
                          </Text>
                        )}
                      {selectedradiooption2 === 'RM' && (
                        <Text style={styles.table_head_captions}>RM Name</Text>
                      )}
                      {selectedradiooption2 === 'Fabric' && (
                        <Text style={styles.table_head_captions}>Fabric</Text>
                      )}
                      {selectedradiooption2 === 'Trim Fabric(RM)' && (
                        <Text style={styles.table_head_captions}>
                          RM Name - Color
                        </Text>
                      )}
                    </View>

                    <View style={{width: 5}} />
                    <View style={{width: 60}}>
                      <Text style={styles.table_head_captions}>
                        Unit Price{' '}
                      </Text>
                    </View>
                    <View style={{width: 5}} />
                    <View style={{width: 60}}>
                      <Text style={styles.table_head_captions}>GST %</Text>
                    </View>
                    <View style={{width: 5}} />

                    <View style={{width: 60}}>
                      <Text style={styles.table_head_captions}>GST</Text>
                    </View>
                    <View style={{width: 5}} />
                    <View style={{width: 60}}>
                      <Text style={styles.table_head_captions}>NET Amount</Text>
                    </View>
                    <View style={{width: 5}} />
                    <View style={{width: 60}}>
                      <Text style={styles.table_head_captions}>Total</Text>
                    </View>
                  </View>

                  {/* {rows.length > 0 &&
                    rows.map((row, index) => (
                      <View key={index} style={styles.table_body_single_row}>
                        <View style={{width: 60}}>
                          <TouchableOpacity
                            style={{alignItems: '', justifyContent: ''}}
                            onPress={() => handleRemoveRow(index)}>
                            <Image
                              source={closeImg}
                              style={styles.imageStyle1}
                            />
                          </TouchableOpacity>
                        </View>

                        <View style={{width: 60}}>
                          <TextInput
                            style={styles.table_data_input}
                            value={row.input_Qty}
                            onChangeText={text => {
                              setRows(
                                rows.map((r, i) =>
                                  i === index ? {...r, input_Qty: text} : r,
                                ),
                              );
                            }}
                          />
                        </View>
                        <View style={{width: 10}} />

                        <View style={{width: 100}}>
                          {selectedradiooption1 === 'Style (FG)' && (
                            <Text style={styles.table_data}>
                              {row.custStyleName}
                            </Text>
                          )}
                        </View>

                        <View style={{width: 100}}>
                          

                          <Text style={styles.table_data}>
                            {row.styleNameALL}
                          </Text>
                        </View>

                        <View style={{width: 5}} />
                        <View style={{width: 60}}>
                          <TextInput
                            style={styles.table_data_input}
                            value={row.input_UnitPrice}
                            onChangeText={text => {
                              setRows(
                                rows.map((r, i) =>
                                  i === index
                                    ? {...r, input_UnitPrice: text}
                                    : r,
                                ),
                              );
                            }}
                          />
                        </View>
                        <View style={{width: 5}} />
                        <View style={{width: 60}}>
                          <TextInput
                            style={styles.table_data_input}
                            value={row.input_Gst}
                            onChangeText={text => {
                              setRows(
                                rows.map((r, i) =>
                                  i === index ? {...r, input_Gst: text} : r,
                                ),
                              );
                            }}
                          />
                        </View>

                        <View style={{width: 5}} />
                        <View style={{width: 60}}>
                          <TextInput
                            style={styles.table_data_input}
                            value={row.input_GstAmount}
                            onChangeText={text => {
                              setRows(
                                rows.map((r, i) =>
                                  i === index ? {...r, input_GstAmount: (Number(r.input_NetAmount) * Number(r.input_Gst)).toString()} : r,
                                ),
                              );
                            }}
                          />
                        </View>
                        <View style={{width: 5}} />
                        <View style={{width: 60}}>
                          <TextInput
                            style={styles.table_data_input}
                            value={row.input_NetAmount}
                            onChangeText={text => {
                              setRows(
                                rows.map((r, i) =>
                                  i === index ? {...r, input_NetAmount:(Number(r.input_Qty) * Number(r.input_UnitPrice)).toString()} : r,
                                ),
                              );
                            }}
                          />
                        </View>
                        <View style={{width: 5}} />
                        <View style={{width: 60}}>
                          <TextInput
                            style={styles.table_data_input}
                            value={row.input_TotalAmount}
                            onChangeText={text => {
                              setRows(
                                rows.map((r, i) =>
                                  i === index ? {...r, input_TotalAmount:Number(input_NetAmount) + Number(input_GstAmount)} : r,
                                ),
                              );
                            }}
                          />
                        </View>
                      </View>
                    ))} */}

                  {rows.length > 0 &&
                    rows.map((row, index) => {
                      const netAmount =
                        Number(row.input_Qty || 0) *
                        Number(row.input_UnitPrice || 0);
                      const gstAmount =
                        (netAmount * Number(row.input_Gst || 0)) / 100;
                      const totalAmount = netAmount + gstAmount;

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

                          <View style={{width: 60}}>
                            <TextInput
                              style={styles.table_data_input}
                              value={row.input_Qty}
                              onChangeText={text => {
                                setRows(
                                  rows.map((r, i) =>
                                    i === index ? {...r, input_Qty: text} : r,
                                  ),
                                );
                              }}
                              keyboardType="numeric"
                            />
                          </View>
                          <View style={{width: 10}} />

                          <View style={{width: 100}}>
                            {selectedradiooption1 === 'Style (FG)' && (
                              <Text style={styles.table_data}>
                                {row.custStyleName}
                              </Text>
                            )}
                          </View>

                          <View style={{width: 100}}>
                            <Text style={styles.table_data}>
                              {row.styleNameALL}
                            </Text>
                          </View>

                          <View style={{width: 5}} />
                          <View style={{width: 60}}>
                            <TextInput
                              style={styles.table_data_input}
                              value={row.input_UnitPrice}
                              onChangeText={text => {
                                setRows(
                                  rows.map((r, i) =>
                                    i === index
                                      ? {...r, input_UnitPrice: text}
                                      : r,
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
                              value={row.input_Gst}
                              onChangeText={text => {
                                setRows(
                                  rows.map((r, i) =>
                                    i === index ? {...r, input_Gst: text} : r,
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
                              value={gstAmount.toFixed(2)}
                              editable={false}
                            />
                          </View>

                          <View style={{width: 5}} />
                          <View style={{width: 60}}>
                            <TextInput
                              style={styles.table_data_input}
                              value={netAmount.toFixed(2)}
                              editable={false}
                            />
                          </View>

                          <View style={{width: 5}} />
                          <View style={{width: 60}}>
                            <TextInput
                              style={styles.table_data_input}
                              value={totalAmount.toFixed(2)}
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
                    <View style={{width: 60}}></View>
                    <View style={{width: 10}} />
                    <View style={{width: 100}}></View>
                    <View style={{width: 100}}></View>
                    <View style={{width: 5}} />
                    <View style={{width: 60}}></View>
                    <View style={{width: 5}} />
                    <View style={{width: 60}}></View>
                    <View style={{width: 5}} />
                    <View style={{width: 60}}>
                      <Text style={styles.table_data}>
                        {totalGstAmount.toFixed(2)}
                      </Text>
                    </View>
                    <View style={{width: 5}} />
                    <View style={{width: 60}}>
                      <Text style={styles.table_data}>
                        {totalNetAmount.toFixed(2)}
                      </Text>
                    </View>
                    <View style={{width: 5}} />
                    <View style={{width: 60}}>
                      <Text style={styles.table_data}>
                        {totalTotalAmount.toFixed(2)}
                      </Text>
                    </View>
                  </View>

                  <View
                    style={[
                      styles.table_body_single_row,
                      {paddingVertical: 12},
                    ]}>
                    <View style={{width: 60}}></View>
                    <View style={{width: 60}}></View>
                    <View style={{width: 10}} />
                    <View style={{width: 100}}></View>
                    <View style={{width: 100}}></View>
                    <View style={{width: 5}} />
                    <View style={{width: 60}}></View>
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
                        {totalTotalAmount.toFixed(2)}
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
                  {' '}
                  {selectedradiooption2 === 'RM'
                    ? 'RM'
                    : selectedradiooption2 === 'Fabric'
                    ? 'Fabric'
                    : 'Trim Fabric'}
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

              <View
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
              </View>

              <View style={styles.companyModalSearchBarContainer}>
                <View style={styles.companyModalSearchBarContainer}>
                  <View style={{flex: 1, marginRight: 10}}>
                    <TextInput
                      style={styles.companyModalSearchBar}
                      placeholder="Search"
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
                {selectedradiooption1 === 'Style (FG)' &&
                  selectedradiooption2 === '' && (
                    <>
                      <Text style={styles.companyModalDropdownItemTextHeader}>
                        Style No
                      </Text>
                      <View style={{flex: 0.2}} />

                      <Text style={styles.companyModalDropdownItemTextHeader}>
                        Customer Style No
                      </Text>
                      <View style={{flex: 0.2}} />

                      <Text style={styles.companyModalDropdownItemTextHeader}>
                        Avail Qty
                      </Text>
                    </>
                  )}

                {selectedradiooption2 === 'RM' && (
                  <>
                    <Text style={styles.companyModalDropdownItemTextHeader}>
                      RM Name
                    </Text>
                    <View style={{flex: 0.2}} />

                    <Text style={styles.companyModalDropdownItemTextHeader}>
                      Raw Material Code
                    </Text>
                    <View style={{flex: 0.2}} />

                    <Text style={styles.companyModalDropdownItemTextHeader}>
                      RM Type
                    </Text>
                  </>
                )}

                {selectedradiooption2 === 'Fabric' && (
                  <>
                    <Text style={styles.companyModalDropdownItemTextHeader}>
                      Fabric No
                    </Text>
                    <View style={{flex: 0.2}} />

                    <Text style={styles.companyModalDropdownItemTextHeader}>
                      Color
                    </Text>
                    <View style={{flex: 0.2}} />

                    <Text style={styles.companyModalDropdownItemTextHeader}>
                      UOM
                    </Text>
                  </>
                )}

                {selectedradiooption2 === 'Trim Fabric(RM)' && (
                  <>
                    <Text style={styles.companyModalDropdownItemTextHeader}>
                      RM Name
                    </Text>
                    <View style={{flex: 0.2}} />

                    <Text style={styles.companyModalDropdownItemTextHeader}>
                      RM Type
                    </Text>
                    <View style={{flex: 0.2}} />

                    <Text style={styles.companyModalDropdownItemTextHeader}>
                      UOM
                    </Text>
                  </>
                )}
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

                          {/* Conditionally render fields based on selection */}
                          {selectedradiooption1 === 'Style (FG)' && (
                            <>
                              <Text style={styles.companyModalDropdownItemText}>
                                {item.styleName}
                              </Text>
                              <View style={{flex: 0.2}} />

                              <Text style={styles.companyModalDropdownItemText}>
                                {item.custStyleName}
                              </Text>
                              <View style={{flex: 0.3}} />
                              <Text style={styles.companyModalDropdownItemText}>
                                {item.availQty}
                              </Text>
                            </>
                          )}

                          {selectedradiooption2 === 'RM' && (
                            <>
                              <Text style={styles.companyModalDropdownItemText}>
                                {item.trimName}
                              </Text>
                              <View style={{flex: 0.2}} />

                              <Text style={styles.companyModalDropdownItemText}>
                                {item.description}
                              </Text>
                              <View style={{flex: 0.2}} />

                              <Text style={styles.companyModalDropdownItemText}>
                                {item.uomTypeDescription}
                              </Text>
                            </>
                          )}

                          {selectedradiooption2 === 'Fabric' && (
                            <>
                              <Text style={styles.companyModalDropdownItemText}>
                                {item.fabricNo}
                              </Text>
                              <View style={{flex: 0.2}} />

                              <Text style={styles.companyModalDropdownItemText}>
                                {item.colorName}
                              </Text>
                              <View style={{flex: 0.2}} />

                              <Text style={styles.companyModalDropdownItemText}>
                                {item.uomTypeDescription}
                              </Text>
                            </>
                          )}

                          {selectedradiooption2 === 'Trim Fabric(RM)' && (
                            <>
                              <Text style={styles.companyModalDropdownItemText}>
                                {item.trimName}
                              </Text>
                              <View style={{flex: 0.2}} />

                              <Text style={styles.companyModalDropdownItemText}>
                                {item.description}
                              </Text>
                              <View style={{flex: 0.2}} />

                              <Text style={styles.companyModalDropdownItemText}>
                                {item.uomTypeDescription}
                              </Text>
                            </>
                          )}
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

          {/* <View
            style={{
              paddingHorizontal: 10,
              marginTop: 10,
              marginBottom: 30,
              width: '90%',
            }}> */}
          <Text
            style={[
              CommonStyles.tylesHeaderTextStyle,
              {
                alignItems: 'center',
                marginLeft: 10,
                marginTop: 20,

                // backgroundColor: 'white',
              },
            ]}>
            {'Notes / Comments  '}
          </Text>

          <View
            style={{
              borderWidth: 1,
              borderColor: 'black',
              marginHorizontal: 10,
              marginTop: 15,
              // borderRadius: 10,
              backgroundColor: 'white',
            }}>
            <TextInput
              placeholder="Notes / Comments"
              autoCapitalize="none"
              multiline
              numberOfLines={3}
              value={remarks}
              onChangeText={text => set_remarks(text)}
              style={[
                {color: 'black', backgroundColor: 'white'},
                Platform.OS === 'ios' && {paddingVertical: 20},
              ]}
            />
          </View>

          <TouchableOpacity
            style={styles.searchButton}
            onPress={() => submitAction(true)}>
            <Text style={styles.searchbuttonText}>Save as Draft</Text>
          </TouchableOpacity>

          {/* </View> */}
        </View>
      </KeyboardAwareScrollView>

      <View style={CommonStyles.bottomViewComponentStyle}>
        <BottomComponent
          rightBtnTitle={'Save'}
          leftBtnTitle={'Back'}
          isLeftBtnEnable={true}
          rigthBtnState={true}
          isRightBtnEnable={true}
          rightButtonAction={async () => submitAction(false)}
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

export default CreatePurchaseOrderDraftUI;

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
      paddingHorizontal: 5,
      paddingVertical: 15,
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
    },
    companyModalDropdownItemTextHeader: {
      fontSize: 16,
      color: '#333',
      flex: 1,
      fontWeight: 'bold',
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
