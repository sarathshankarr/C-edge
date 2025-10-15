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
  const [rows, setRows] = React.useState([]);
  const [selectedradiooption1, setSelectedradiooption1] = useState('MasterBox');
  const [totalQty, setTotalQty] = useState(false);
  const [invoiceNo, setInvoiceNo] = useState('');
  const [poNo, setPoNo] = useState('');
  const [barCode, setBarcode] = useState('');
  const [prefix, setPrefix] = useState('');
  const [suffix, setSuffix] = useState('');
  const [transportCost, setTransportCost] = useState('0');
  const [proformaIds, setProformaIds] = useState([]);
  const [scannedBarcodes, setScannedBarcodes] = useState([]);
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
      // if(props.lists.viewDTOList){
      //   setPrefix(props.lists.viewDTOList[0].invoice);
      //   console.log("prefix ", props.lists.viewDTOList[0].invoice)
      // }
      if(props.lists.company){
        setSuffix(props.lists.company?.posuffix || '');
        console.log("suffix ", props.lists.company?.posuffix)
      }
      if(props.lists?.invoice){
        setPrefix(props.lists.invoice || '');
        console.log("suffix ", props.lists.invoice)
      }
    }
  }, [props.lists]);

  

  // useEffect(() => {
  //   if (props.tableLists && props.tableLists.length > 0) {
  //     const enrichedRows = props.tableLists.map(row => {
  //       const qty = Number(row.RequiredQty || 0);
  //       const price = Number(row.Price || 0);
  //       const gstPercent = Number(row.Gst || 0);

  //       const gross = qty * price;
  //       const gstAmount = (gross * gstPercent) / 100;
  //       const totalRowAmount = gross + gstAmount;

  //       return {
  //         ...row,
  //         gross: gross.toFixed(2),
  //         unitPricegstAmount: gstAmount.toFixed(2),
  //         totalRowAmount: totalRowAmount.toFixed(2),
  //       };
  //     });
  //     console.log("enrichedRows ==> ", enrichedRows)
  //     setRows(enrichedRows);
  //   }
  // }, [props.tableLists]);

  useEffect(() => {
  if (props.tableLists && props.tableLists.length > 0) {

      const newBarcode = props.tableLists[0]?.barcodeNo;

       const newProformaIds = props.tableLists
    .map(item => item.proforma_ids)
    .filter(Boolean) || []; 

    // setRows(prevRows => {
    //   const updatedRows = [...prevRows];

    //   props.tableLists.forEach(newRow => {
    //     const qty = Number(newRow.RequiredQty || 0);
    //     const price = Number(newRow.Price || 0);
    //     const gstPercent = Number(newRow.Gst || 0);

    //     const existingIndex = updatedRows.findIndex(
    //       r => r.GSCode === newRow.GSCode && r.ItemId === newRow.ItemId
    //     );

    //     if (existingIndex !== -1) {
    //       const existing = updatedRows[existingIndex];
    //       const newQty = Number(existing.RequiredQty || 0) + qty;

    //       const gross = newQty * price;
    //       const gstAmount = (gross * gstPercent) / 100;
    //       const totalRowAmount = gross + gstAmount;

    //       updatedRows[existingIndex] = {
    //         ...existing,
    //         RequiredQty: newQty,
    //         gross: gross.toFixed(2),
    //         unitPricegstAmount: gstAmount.toFixed(2),
    //         totalRowAmount: totalRowAmount.toFixed(2),
    //       };
    //     } else {
    //       const gross = qty * price;
    //       const gstAmount = (gross * gstPercent) / 100;
    //       const totalRowAmount = gross + gstAmount;

    //       updatedRows.push({
    //         ...newRow,
    //         gross: gross.toFixed(2),
    //         unitPricegstAmount: gstAmount.toFixed(2),
    //         totalRowAmount: totalRowAmount.toFixed(2),
    //       });
    //     }
    //   });

    //   console.log("Updated Rows => ", updatedRows);
    //   return updatedRows;
    // });
  
    setRows(prevRows => {
  const updatedRows = [...prevRows];

  props.tableLists.forEach(newRow => {
    const qty = Number(newRow.RequiredQty || 0);
    const price = Number(newRow.Price || 0);
    const gstPercent = Number(newRow.Gst || 0);
    const discPercent = Number(newRow.DiscPercent || 0); // new field

    // --- Discount calculations ---
    const unitPriceAfterDisc = price - (price * discPercent) / 100;
    const discAmount = (price * discPercent * qty) / 100;

    // --- Main totals ---
    const gross = qty * unitPriceAfterDisc;
    const gstAmount = (gross * gstPercent) / 100;
    const totalRowAmount = gross + gstAmount;

    const existingIndex = updatedRows.findIndex(
      r => r.GSCode === newRow.GSCode && r.ItemId === newRow.ItemId
    );

    if (existingIndex !== -1) {
      // If same item already exists, accumulate quantities
      const existing = updatedRows[existingIndex];
      const newQty = Number(existing.RequiredQty || 0) + qty;

      const newGross = newQty * unitPriceAfterDisc;
      const newGstAmount = (newGross * gstPercent) / 100;
      const newTotal = newGross + newGstAmount;

      updatedRows[existingIndex] = {
        ...existing,
        RequiredQty: newQty,
        UnitPrice: price.toString(),
        DiscPercent: discPercent.toString(),
        DiscAmount: discAmount.toFixed(2).toString(),
        UnitPriceAfterDisc: unitPriceAfterDisc.toFixed(2).toString(),
        gross: newGross.toFixed(2).toString(),
        unitPricegstAmount: newGstAmount.toFixed(2).toString(),
        totalRowAmount: newTotal.toFixed(2).toString(),
      };
    } else {
      // New item entry
      updatedRows.push({
        ...newRow,
        UnitPrice: price.toString(),
        DiscPercent: discPercent.toString(),
        DiscAmount: discAmount.toFixed(2).toString(),
        UnitPriceAfterDisc: unitPriceAfterDisc.toFixed(2).toString(),
        gross: gross.toFixed(2).toString(),
        unitPricegstAmount: gstAmount.toFixed(2).toString(),
        totalRowAmount: totalRowAmount.toFixed(2).toString(),
      });
    }
  });

  console.log('Updated Rows => ', updatedRows);
  return updatedRows;
});

    

     if (newBarcode) {
    setScannedBarcodes(prev => [...prev, newBarcode]);
  }
   if (newProformaIds.length > 0) {
    setProformaIds(prev => {
      const merged = [...prev, ...newProformaIds];
      const unique = [...new Set(merged)];
      return unique;
    });
  }
  }
}, [props.tableLists]);


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

    if (!shipToId) {
      Alert.alert('Alert','Please select the Vendor/Customer');
      return;
    }

    if (!text || text.trim().length !== 9) {
      Alert.alert('Alert','Please Enter the Valid Barcode');
      return;
    }

    // console.log("scanned barcode ", text, scannedBarcodes, scannedBarcodes.includes(text), typeof (text)  , typeof (scannedBarcodes[0])  )
    if (scannedBarcodes.includes(Number(text))) {
      Alert.alert('Alert', 'Barcode already scanned !');
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
    // handleScannedCode(text);
    console.log("scan barcode text ", text )
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



    if(!shipLocationId || !shipToId  || !invoiceNo || !txnDate){
Alert.alert("Alert","Please fill all mandatory fields!");
return;
    }
    if(scannedBarcodes.length<=0){
Alert.alert("Alert","Please Scan barcode !");
return;
    }


    let tempObj = {
      prefix: prefix,
      suffix: suffix,
      invoiceNo: invoiceNo,
    }
let invoiceStatus = await props.getDuplicateInvoiceStatus(tempObj);

if(invoiceStatus === "error"){
  Alert.alert("Alert","Something went wrong, please try again !");
  return;
}else if(invoiceStatus.status){
  Alert.alert("Alert","Invoice number already exists, please use different invoice number !");
  return;
}

console.log("returnning invoiceStatus ", invoiceStatus.status, typeof(invoiceStatus.status) )

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
      discountAmount: item.DiscAmount || 0, 
      discountPercentage:item.DiscPercent ||  0, 
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
      vendorCustomerId: shipToId || '0',
      billToId: billNoId || '0',
      poNumber: poNo,
      vendorId: shipToId,
      companyLocationId: shipLocationId || '0',
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
      totalDiscount:  totalDiscAmount|| 0,
      totalDiscountPer: totalDiscPercent || 0,
      soNumber: 0,
      convRate: 0,
      additionalAmount: 0,
      roundtotal:'0',
      roundtotal2: '0',

      packages: '',
      packincharge: '',
      ackno: '',
      area: '',
      eway: '',
      allRolls: '',
      corg: 0,
      pIids: '',
      masterboxbarcode: scannedBarcodes.join(',')||'', 
      master_box_proforma_id: proformaIds.join(',') || '', 
      items: filteredRows || [],
    };

    console.log('save Obj ==> ', Obj);
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

  // const handleOpenModal = id => {
  //   props.getModalStyleFgList(id);
  //   setShowmodal(!showModal);
  // };

  // const handleInputChange1 = (index, field, value) => {
  //   const updatedRows = [...rows];

  //   // Convert to number for numeric fields
  //   let parsedValue = value;
  //   if (field === 'RequiredQty' || field === 'Price' || field === 'Gst') {
  //     parsedValue = value === '' ? '' : Number(value);
  //   }

  //   updatedRows[index][field] = parsedValue;

  //   // Do your calculations
  //   const qty = Number(updatedRows[index].RequiredQty || 0);
  //   const price = Number(updatedRows[index].Price || 0);
  //   const gstPercent = Number(updatedRows[index].Gst || 0);

  //   const gross = qty * price;
  //   const gstAmount = (gross * gstPercent) / 100;
  //   const totalRowAmount = gross + gstAmount;

  //   updatedRows[index].gross = gross.toFixed(2);
  //   updatedRows[index].unitPricegstAmount = gstAmount.toFixed(2);
  //   updatedRows[index].totalRowAmount = totalRowAmount.toFixed(2);

  //   setRows(updatedRows);
  // };

const handleInputChange = (index, field, value) => {
  const updatedRows = [...rows];

  // Parse numeric inputs properly
  let parsedValue = value;
  if (['RequiredQty', 'UnitPrice', 'Gst', 'DiscPercent'].includes(field)) {
    parsedValue = value === '' ? '' : Number(value);
  }

  updatedRows[index][field] = parsedValue;

  const qty = Number(updatedRows[index].RequiredQty || 0);
  const unitPrice = Number(updatedRows[index].UnitPrice || 0);
  const discPercent = Number(updatedRows[index].DiscPercent || 0);
  const gstPercent = Number(updatedRows[index].Gst || 0);

  const unitPriceAfterDisc = unitPrice - (unitPrice * discPercent) / 100;
  const discAmount = unitPrice * (discPercent / 100) * qty;

  const gross = qty * unitPriceAfterDisc;
  const gstAmount = (gross * gstPercent) / 100;
  const totalRowAmount = gross + gstAmount;

  updatedRows[index].DiscAmount = discAmount.toFixed(2).toString();
  updatedRows[index].UnitPriceAfterDisc = unitPriceAfterDisc.toFixed(2).toString();
  updatedRows[index].gross = gross.toFixed(2).toString();
  updatedRows[index].unitPricegstAmount = gstAmount.toFixed(2).toString();
  updatedRows[index].totalRowAmount = totalRowAmount.toFixed(2).toString();

  setRows(updatedRows);
};


  const totalGross = rows.reduce((sum, row) => sum + Number(row.gross || 0), 0);
  const totalGst = rows.reduce(
    (sum, row) => sum + Number(row.unitPricegstAmount || 0),
    0,
  );
  const totalAmount = rows.reduce(
    (sum, row) => sum + Number(row.totalRowAmount || 0),
    0,
  );
  const totalQtyy = rows.reduce(
    (sum, row) => sum + Number(row.RequiredQty || 0),
    0,
  );

const totalUnitPriceAfterDisc = rows.reduce(
  (sum, row) => sum + Number(row.UnitPriceAfterDisc || 0),
  0
);

const totalDiscAmount = rows.reduce(
  (sum, row) => sum + Number(row.DiscAmount || 0),
  0
);
const totalDiscPercent = rows.reduce(
  (sum, row) => sum + Number(row.DiscPercent || 0),
  0
);

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

          {/* <View style={{marginTop: hp('2%')}}>
            <TextInput
              label="Invoice No *"
              value={invoiceNo}
              mode="outlined"
              onChangeText={text => setInvoiceNo(text)}
            />
          </View> */}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: hp('2%'),
            }}>
            {/* Label */}
            <Text style={{color: 'red'}}>*</Text>
            <Text style={{fontWeight: 'bold',marginLeft: 2}}>InvoiceNo :</Text>

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
              label="PO No# "
              value={poNo}
              mode="outlined"
              onChangeText={text => setPoNo(text)}
            />
          </View>
          <View style={{marginTop: hp('2%')}}>
            <TextInput
              label="Master Box Barcode"
              value={scannedBarcodes?.join(',')}
              mode="outlined"
              editable={false}
              onChangeText={text => console.log(text)}
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
                  onChangeText={text => handleBarcodeChange(text)}
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
                    <View style={{width: 10}} />
                    <View style={{width: 100}}>
                      <Text style={styles.table_head_captions}>Unit Price</Text>
                    </View>
                    <View style={{width: 10}} />
                    <View style={{width: 100}}>
                      <Text style={styles.table_head_captions}>Disc %</Text>
                    </View>

                    <View style={{width: 5}} />
                    <View style={{width: 100}}>
                      <Text style={styles.table_head_captions}>
                        Unit Price After Disc
                      </Text>
                    </View>
                    <View style={{width: 5}} />
                    <View style={{width: 100}}>
                      <Text style={styles.table_head_captions}>
                       Disc Amount
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
                    rows.map((row, index) => (
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
                          <Text style={styles.table_data}>{row.Title}</Text>
                        </View>

                        <View style={{width: 10}} />

                        <View style={{width: 100}}>
                          <Text style={styles.table_data}>{row.ItemSize}</Text>
                        </View>

                        <View style={{width: 10}} />

                        {/* Required Qty */}
                        <View style={{width: 100}}>
                          <TextInput
                            style={styles.table_data_input}
                            value={String(row.RequiredQty || '')}
                            onChangeText={text =>
                              handleInputChange(index, 'RequiredQty', text)
                            }
                            editable={false}
                            keyboardType="numeric"
                          />
                        </View>

                        <View style={{width: 10}} />

                        {/* HSN */}
                        <View style={{width: 100}}>
                          <TextInput
                            style={styles.table_data_input}
                            value={row.Hsn}
                            onChangeText={text =>
                              handleInputChange(index, 'Hsn', text)
                            }
                          />
                        </View>

                       {/* Unit Price */}
                        <View style={{width: 10}} />
                        <View style={{width: 100}}>
                         <TextInput
                           style={styles.table_data_input}
                           value={String(row.UnitPrice || '')}
                           onChangeText={text => handleInputChange(index, 'UnitPrice', text)}
                           keyboardType="numeric"
                         />
                        </View>
                        
                        {/* Disc % */}
                        <View style={{width: 10}} />
                        <View style={{width: 100}}>
                          <TextInput
                            style={styles.table_data_input}
                            value={String(row.DiscPercent || '')}
                            onChangeText={text => handleInputChange(index, 'DiscPercent', text)}
                            keyboardType="numeric"
                          />
                        </View>

                        {/* Unit Price After Disc (read-only) */}
                        <View style={{width: 5}} />
                        <View style={{width: 100}}>
                         <Text style={styles.table_data}>{row.UnitPriceAfterDisc}</Text>
                        </View>
                        
                        {/* Disc Amount  */}
                        <View style={{width: 5}} />
                        <View style={{width: 100}}>
                          <Text style={styles.table_data}>{row.DiscAmount}</Text>
                        </View>

                        {/* GST */}
                        <View style={{width: 5}} />
                        <View style={{width: 60}}>
                          <TextInput
                            style={styles.table_data_input}
                            value={String(row.Gst || '')}
                            onChangeText={text =>
                              handleInputChange(index, 'Gst', text)
                            }
                            keyboardType="numeric"
                          />
                        </View>

                        <View style={{width: 5}} />
                        {/* Gross */}
                        <View style={{width: 60}}>
                          <TextInput
                            style={styles.table_data_input}
                            value={row.gross}
                            editable={false}
                          />
                        </View>

                        <View style={{width: 5}} />

                        {/* GST Amount */}
                        <View style={{width: 60}}>
                          <TextInput
                            style={styles.table_data_input}
                            value={row.unitPricegstAmount}
                            editable={false}
                          />
                        </View>

                        <View style={{width: 5}} />

                        {/* Total */}
                        <View style={{width: 60}}>
                          <TextInput
                            style={styles.table_data_input}
                            value={row.totalRowAmount}
                            editable={false}
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
                        {totalQtyy?.toFixed(2)}
                      </Text>
                    </View>
                    <View style={{width: 10}} />
                    <View style={{width: 100}}></View>
                    <View style={{width: 10}} />
                    <View style={{width: 100}}></View>
                    <View style={{width: 10}} />
                    <View style={{width: 100}}>
                     
                    </View>
                    <View style={{width: 5}} />
                    <View style={{width: 100}}>
                       <Text style={styles.table_data}>
                        {totalUnitPriceAfterDisc?.toFixed(2)}
                      </Text>
                    </View>
                    <View style={{width: 5}} />
                    <View style={{width: 100}}>
                       <Text style={styles.table_data}>
                        {totalDiscAmount?.toFixed(2)}
                      </Text>
                    </View>
                    <View style={{width: 5}} />
                    <View style={{width: 60}}></View>
                    <View style={{width: 5}} />
                    <View style={{width: 60}}>
                      <Text style={styles.table_data}>
                        {totalGross?.toFixed(2)}
                      </Text>
                    </View>
                    <View style={{width: 5}} />
                    <View style={{width: 60}}>
                      <Text style={styles.table_data}>
                        {totalGst?.toFixed(2)}
                      </Text>
                    </View>
                    <View style={{width: 5}} />
                    <View style={{width: 60}}>
                      <Text style={styles.table_data}>
                        {totalAmount?.toFixed(2)}
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
                    <View style={{width: 10}} />
                    <View style={{width: 100}}></View>
                    <View style={{width: 10}} />
                    <View style={{width: 100}}></View>
                    <View style={{width: 5}} />
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
                        value={transportCost}
                        onChangeText={text =>
                          setTransportCost(text || '0')
                        }
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
                    <View style={{width: 10}} />
                    <View style={{width: 100}}></View>
                    <View style={{width: 10}} />
                    <View style={{width: 100}}></View>
                    <View style={{width: 5}} />
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
                        {/* {totalAmount?.toFixed(2)} */}
                         {(totalAmount + Number(transportCost || '0'))?.toFixed(2)}
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
