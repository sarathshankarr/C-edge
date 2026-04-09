import React, {useState, useRef, useEffect, useMemo, useContext} from 'react';
import {
  View,
  FlatList,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import * as Constant from './../../../utils/constants/constant';
import CommonStyles from './../../../utils/commonStyles/commonStyles';
import HeaderComponent from './../../../utils/commonComponents/headerComponent';
import LoaderComponent from './../../../utils/commonComponents/loaderComponent';
import AlertComponent from './../../../utils/commonComponents/alertComponent';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import BottomComponent from './../../../utils/commonComponents/bottomComponent';
import {TextInput} from 'react-native-paper';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {RadioGroup} from 'react-native-radio-buttons-group';
import {ColorContext} from './../../colorTheme/colorTheme';
import {useNavigation} from '@react-navigation/native';
import CustomCheckBox2 from './CustomCheckBox2';

const downArrowImg = require('./.././../../../assets/images/png/dropDownImg.png');
const closeImg = require('./.././../../../assets/images/png/close1.png');

// ─── Sub-components ────────────────────────────────────────────────────────────

/** Generic searchable dropdown */
const SearchableDropdown = ({
  label,
  selectedId,
  selectedName,
  isOpen,
  onToggle,
  filteredList,
  onSearch,
  onSelect,
  styles,
  labelKey  
}) => (
  <View style={styles.dropdownWrapper}>
    <TouchableOpacity style={styles.dropdownTrigger} onPress={onToggle}>
      <View style={styles.SectionStyle1}>
        <View style={{flexDirection: 'column'}}>
          <Text style={selectedId ? styles.dropTextLightStyle : styles.dropTextInputStyle}>
            {label}
          </Text>
          {selectedId ? (
            <Text style={styles.dropTextInputStyle}>{selectedName}</Text>
          ) : null}
        </View>
      </View>
      <View style={{justifyContent: 'center'}}>
        <Image source={downArrowImg} style={styles.imageStyle} />
      </View>
    </TouchableOpacity>

    {isOpen && (
      <View style={styles.dropdownContent1}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search"
          onChangeText={onSearch}
          placeholderTextColor="#000"
        />
        <ScrollView style={styles.scrollView} nestedScrollEnabled>
          {filteredList.length === 0 ? (
            <Text style={styles.noCategoriesText}>Sorry, no results found!</Text>
          ) : (
            filteredList.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.dropdownOption}
                onPress={() => onSelect(item)}>
                <Text style={{color: '#000'}}>{item[labelKey]}</Text>
              </TouchableOpacity>
            ))
          )}
        </ScrollView>
      </View>
    )}
  </View>
);

// ─── Main UI ───────────────────────────────────────────────────────────────────

/**
 * NOTE: `route` was removed — it was destructured but never used.
 * All data and actions come via props from CreateStockIssue.
 */
const CreateStockIssueUI = props => {
  const {colors} = useContext(ColorContext);
  const styles = getStyles(colors);
  const navigation = useNavigation();

  // ─── State ────────────────────────────────────────────────────────────────

  const [rows, setRows] = useState([]);
  const [barCode, setBarcode] = useState('');
  const [alreadyScannedBarcodes, setAlreadyScannedBarcodes] = useState([]);

  // Location
  const [locationList, setLocationList] = useState([]);
  const [filteredLocation, setFilteredLocation] = useState([]);
  const [showLocationList, setShowLocationList] = useState(false);
  const [locationName, setLocationName] = useState('');
  const [locationId, setLocationId] = useState('');

  // To Location
  const [toLocationList, setToLocationList] = useState([]);
  const [toLocationId, setToLocationId] = useState('');

  // Work Order
  const [workOrdersList, setWorkOrdersList] = useState([]);
  const [filteredWorkOrders, setFilteredWorkOrders] = useState([]);
  const [showWorkOrderList, setShowWorkOrderList] = useState(false);
  const [workOrderName, setWorkOrderName] = useState('');
  const [workOrderId, setWorkOrderId] = useState('');

  // RM/Fabric
  const [rmFabricList, setRMFabricList] = useState([]);
  const [filteredRMFabrics, setFilteredRMFabrics] = useState([]);
  const [showRMFabricList, setShowRMFabricList] = useState(false);
  const [rmFabricName, setRMFabricName] = useState('');
  const [rmFabricId, setRMFabricId] = useState('');

  // Vendor
  const [vendorList, setVendorList] = useState([]);
  const [filteredVendor, setFilteredVendor] = useState([]);
  const [showVendorList, setShowVendorList] = useState(false);
  const [vendorName, setVendorName] = useState('');
  const [vendorId, setVendorId] = useState('');
  const [selectedIdxs, setSelectedIdxs] = useState([]);
  const [selectAllCheckBox, setSelectAllCheckBox] = useState(false);
  const [lastScannedBarcode, setLastScannedBarcode] = useState({});
  const scannedBarcodes = useRef(new Map());
  const scannedBarcodesForItem = useRef(new Map());



  // Form fields
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [txnDate, setTxnDate] = useState('');
  const [deliveryDate, setDeliveryDate] = useState('');
  const [activeField, setActiveField] = useState(null);
  const [rate, setRate] = useState('');
  const [remarks, setRemarks] = useState('');
  const [inHouse, setInHouse] = useState('Yes');
  const [customer, setCustomer] = useState('No');
  const [vehicleNo, setVehicleNo] = useState('');
  const [returnable, setReturnable] = useState(false);

  // ─── Effects ──────────────────────────────────────────────────────────────

  useEffect(() => {
    if (!props.lists) return;

    if (props.lists.locationsMap) {
      const list = Object.keys(props.lists.locationsMap).map(key => ({
        id: key,
        name: props.lists.locationsMap[key],
      }));
      setLocationList(list);
      setToLocationList(list);
      setFilteredLocation(list);
    }
    if (props.lists.vendorsMap) {
      const vendorList = Object.keys(props.lists.vendorsMap).map(key => ({
        id: key,
        name: props.lists.vendorsMap[key],
      }));
      setVendorList(vendorList);
      setFilteredVendor(vendorList);
      console.log('vendorList', vendorList);
      console.log(locationList)
    }
  }, [props.lists]);

  useEffect(() => {
    if (!props.tableLists) return;

    // if (alreadyScannedBarcodes.includes(props.tableLists.barcode)) {
    //   Alert.alert('Alert', 'Barcode already scanned!');
    //   return;
    // }

    setAlreadyScannedBarcodes(prev => [...prev, props.tableLists.barcode]);

    if (locationId) {
      setRows(prev => [
        ...prev,
        {...props.tableLists, Rate: rate || 0},
      ]);
    }
  }, [props.tableLists]);

  // ─── Derived values ───────────────────────────────────────────────────────

  const totalSentQty = rows.reduce(
    (sum, row) => sum + Number(row.availQtyStr || 0),
    0,
  );

  const inHouseRadioButtons = useMemo(
    () => [
      {
        id: '1',
        label: 'Style',
        value: 'Style',
        selected: inHouse === 'Yes',
        labelStyle: {color: '#000'},
      },
    ],
    [inHouse, customer],
  );

  // ─── Handlers ─────────────────────────────────────────────────────────────

  const onLocationSelect = async item => {
    setLocationId(item.id);
    setLocationName(item.name);
    setShowLocationList(false);

    const list = await props.onLocationChanges(item.id);
    setWorkOrdersList(list ?? []);
    setFilteredWorkOrders(list ?? []);
    setSelectedIdxs([]);
    setRows([]);
    setWorkOrderId('');
    setWorkOrderName('');
  };

  onWorkOrderSelect = async item => {
    setWorkOrderId(item.wo_id);
    setWorkOrderName(item.wo_val);
    setShowWorkOrderList(false);
    setSelectedIdxs([]);
    const list = await props.getTrimValuesByWo(item.wo_id, locationId)
    if(list) {
      list.forEach(element => {
        element.issuedQty = 0;
        element.editable = true
        element.barcode = '';
      });
      setRows(list);
    }
  }

  const filterList = (text, fullList, setter) => {
    if (text.trim().length > 0) {
      setter(fullList.filter(i => i.name.toLowerCase().includes(text.toLowerCase())));
    } else {
      setter(fullList);
    }
  };

  const filterWorkOrders = text => filterList(text, workOrdersList, setFilteredWorkOrders);
  const handleSearchLocation = text => filterList(text, locationList, setFilteredLocation);
  const handleSearchVendor = text => filterList(text, vendorList, setFilteredVendor);
  const handleSearchRMFabric = text => filterList(text, rmFabricList, setFilteredRMFabrics);

  /** Single unified barcode handler — deduplication + validation */
  // const handleScannedCode = async text => {
  //   if (!locationId) {
  //     Alert.alert('Alert', 'Please select the From Location');
  //     return;
  //   }
  //   if (!text || text.trim() === '') {
  //     Alert.alert('Alert', 'Please enter a valid barcode');
  //     return;
  //   }
  //   if (alreadyScannedBarcodes.includes(text)) {
  //     Alert.alert('Alert', 'Barcode already scanned!');
  //     return;
  //   }

  //   await props.validateBarCode(text, locationId);
  //   setBarcode('');
  // };

  
  const handleInputChange = (item, index, field, value) => {
    const numValue = value === '' ? '' : Number(value); // ← allow empty while typing
  
    // Only validate when there's an actual number
    if (value !== '') {
      if (Number(value) > item.styleavailQty) {
        Alert.alert('Alert', 'Entered quantity exceeds the Available quantity!');
        return;
      }
      if (Number(value) > item.reqQty) {
        Alert.alert('Alert', 'Entered quantity exceeds the Required quantity!');
        return;
      }
    }
  
    setRows(prev => {
      const updated = [...prev];
      updated[index] = {...updated[index], [field]: numValue};
      return updated;
    });
  };
  

  // ─── Date picker ──────────────────────────────────────────────────────────

  const formatDateIntoDMY = isoDate => {
    const [y, m, d] = isoDate.split('-');
    return [d, m, y].join('-');
  };


  const hideDatePicker = () => {
    setDatePickerVisibility(false);
    setActiveField(null);
  };

  const handleConfirm = date => {
    const formatted = formatDateIntoDMY(date.toISOString().split('T')[0]);
    if (activeField === 'deliveryDate') setDeliveryDate(formatted);
    else if (activeField === 'txnDate') setTxnDate(formatted);
    hideDatePicker();
  };

  // ─── Radio ────────────────────────────────────────────────────────────────

  const handleInHouseChange = selectedId => {
    const opt = inHouseRadioButtons.find(b => b.id === selectedId);
    if (opt?.value === 'In House') {
      setInHouse('Yes');
      setCustomer('No');
    } else {
      setInHouse('No');
      setCustomer('Yes');
    }
  };

  // ─── Submit ───────────────────────────────────────────────────────────────

  const submitAction = async () => {
    // if (!locationId) {
    //   Alert.alert('Alert', 'Please Select Location');
    //   return;
    // }
    // if (!workOrderId) {
    //   Alert.alert('Alert', 'Please Select Work Order');
    //   return;
    // }

    if(selectedIdxs?.length === 0) {
      Alert.alert('Alert', 'Please select at least one item to issue stock');
      return;
    }

    let submitObj = {
      styOrBp: 1,
      vendorId: vendorId || 0,
      locId: Number(locationId) || 0,
      woId: workOrderId || 0,
      items: []
    }
    const particulars = rows.map(item => ({
      styleId: item.styleId,
      lotId: 0,
      bpId: 0,
      itemId: item.itemId,
      qty: Number(item.issuedQty || 0),
      barcodedetails: (
        scannedBarcodesForItem.current.get(item.itemId +"_"+ (item.sizeId?item.sizeId:'')) ?? []
      ).join(','),
      sizeId: item.sizeId || 0,
      type: item.type,
    }));
    submitObj.items = particulars;

    props.submitAction(submitObj);
  };

  // ─── Render ───────────────────────────────────────────────────────────────


  const toggleSelection = item => {
    setSelectedIdxs(prevIds => {
      const key = item.itemId+"_"+(item.sizeId?item.sizeId:'')
      let updated;
      if (prevIds.includes(key)) {
        updated = prevIds.filter(id => id !== key);
        const row = rows.find(r => r.itemId+"_"+(r.sizeId?r.sizeId:'') === key);
        if(row) {
          row.issuedQty = 0;
        }
      } else {
        const row = rows.find((r => r.itemId+"_"+(r.sizeId?r.sizeId:'') === key));
        if(row && row?.styleavailQty === 0) {
          Alert.alert('Alert', 'No Availiable Qty to Process...');
          return prevIds; // Don't change selection if styleavailQty is 0
        } else if(row) {
          // row.editable = false;
          if(row?.styleavailQty<row?.allowQty) {
            row.issuedQty = row?.styleavailQty;
          } else {
            row.issuedQty = row?.allowQty;
          }
        }
        updated = [...prevIds, key];
      }
      console.log('selectedIds after toggle', updated);
      return updated;
    });
    };

    const updateAllIndexes = () => {
      const ids = rows.map(r => r.itemId+"_"+(r.sizeId?r.sizeId:''));
      console.log('selectallcheckbox before', selectAllCheckBox);
      let newSelected = selectAllCheckBox
        ? []
        : [...selectedIdxs, ...ids];
        setSelectAllCheckBox(!selectAllCheckBox);
      console.log('selectallcheckbox after', selectAllCheckBox);
      let lessAvailQty = false;
      if(newSelected.length>0) {
        rows.forEach(row => {
          if(row.styleavailQty <= 0) {
            newSelected = newSelected.filter(id => id !== row.itemId+"_"+(row.sizeId?row.sizeId:''));
            lessAvailQty = true;
          }
          if(newSelected.includes(row.itemId+"_"+(row.sizeId?row.sizeId:''))) {
            if(row?.styleavailQty<row?.allowQty) {
              row.issuedQty = row?.styleavailQty;
            } else {
              row.issuedQty = row?.allowQty;
            }
          }
          // row.editable = false;
          
        })
      } else {
        rows.forEach(row => {
          if(!newSelected.includes(row.itemId+"_"+(row.sizeId?row.sizeId:''))) {
            row.issuedQty = 0;
          }
        })
      }
      if(lessAvailQty) {
        Alert.alert('Alert', 'No Availiable Qty for the unselected items to Process...');
      }
      setSelectedIdxs(newSelected);
    };
  
  
    


































    const handleSearchBarcode = async () => {
      if (!barCode) {
        Alert.alert('Alert', 'Please Enter Barcode!');
        return;
      }
      handleScannedCode(barCode);
    };
  

    const handleScannedCode = async text => {
      if (!text?.trim()) {
        Alert.alert('Error', 'Enter valid barcode');
        return;
      }
    
      const parts = workOrderId.toString().split('_');
      const styleId = parts[0]?.trim();
    
      const postData = {
        location: Number(locationId) || 0,
        styleId: Number(styleId) || 0,
        barcode: text.trim(),
      };
      let barcodeDetails = {};

      if(text===lastScannedBarcode?.itemGeneratedBarcode) {
        barcodeDetails = lastScannedBarcode;
      }
      else {
        barcodeDetails = await props.getBarcodeDetails(postData);
      }
      if (!barcodeDetails) return;
      console.log('barcodeDetails ==>', barcodeDetails);
      barcodeDetails.editQty = barcodeDetails.qty
      barcodeDetails.sizeId = barcodeDetails.scaleId!==0?barcodeDetails.scaleId+'':''
      if (!text.startsWith('12345') && text!==lastScannedBarcode?.itemGeneratedBarcode) {
        barcodeDetails = {
          itemId: barcodeDetails.fabricId || 0,
          itemGeneratedBarcode: barcodeDetails.fmlgeneratedbarcode || '0',
          qty: barcodeDetails.rollwiseQty || 0,
          styleId: barcodeDetails.styleId || 0,
          editQty: barcodeDetails.rollwiseQty || 0,
          sizeId: ''
        };
      }
    // fabricId, fmlgeneratedbarcode, rollwiseQty
      // Bug 4 fix — guard matchedRow
      const matchedRow = rows.find(r => r.itemId+"_"+(r.sizeId?r.sizeId:'') === barcodeDetails.itemId+"_"+(barcodeDetails.sizeId?barcodeDetails.sizeId:''));
      if (!matchedRow) {
        Alert.alert('Error', 'No matching item found for scanned barcode');
        return;
      }
      
      if (barcodeDetails.qty >= matchedRow.reqQty) {
        barcodeDetails.editQty = matchedRow.reqQty;
      } else {
        barcodeDetails.editQty = barcodeDetails.qty; // ✅ safe fallback
      }
      // Bug 3 fix — default barcodeQty to 0
      const bKey = matchedRow.itemId+"_"+(matchedRow.sizeId?matchedRow.sizeId:'')
      const barcodeQty = scannedBarcodes.current.get(bKey) ?? 0;
      const newTotalQty = barcodeQty + barcodeDetails.editQty;

      let issuedQty = newTotalQty
      // Qty exceeded check
      if (newTotalQty > matchedRow.reqQty) {
        Alert.alert('Qty Exceeded', 'Scanned Qty exceeding Required Qty!');
        issuedQty = matchedRow.reqQty;
      }
      else {
        issuedQty = Math.min(newTotalQty, matchedRow.reqQty);
      }

    
      // Update scanned barcodes map
      scannedBarcodes.current.set(bKey, newTotalQty);
      const barcodeList = scannedBarcodesForItem.current.get(matchedRow.itemId+"_"+(matchedRow.sizeId?matchedRow.sizeId:'')) ?? [];
      const bDetails = barcodeDetails.itemGeneratedBarcode+"_"+barcodeDetails.qty+"_"+(barcodeDetails.styleId == 0 ? 1 :0);
      barcodeList.push(bDetails);
      scannedBarcodesForItem.current.set(matchedRow.itemId+"_"+(matchedRow.sizeId?matchedRow.sizeId:''), barcodeList);
      console.log([...scannedBarcodesForItem.current.entries()]);      // Bug 1 fix — update rows immutably, not by direct mutation
      setRows(prevRows =>
        prevRows.map(row =>
          row.itemId+"_"+(row.sizeId?row.sizeId:'') === barcodeDetails.itemId+"_"+(barcodeDetails.sizeId?barcodeDetails.sizeId:'')
            ? {...row, issuedQty, editable: false, barcode: barcodeDetails?.itemGeneratedBarcode}  // ← new object, not mutation
            : row,
        ),
      );
    
      setLastScannedBarcode(barcodeDetails);
    
      setSelectedIdxs(prevs => {
        const safeIds = prevs ?? [];
        if (safeIds.includes(barcodeDetails.itemId+"_"+(barcodeDetails.sizeId?barcodeDetails.sizeId:''))) return safeIds;
        return [...safeIds, barcodeDetails.itemId+"_"+(barcodeDetails.sizeId?barcodeDetails.sizeId:'')];
      });
    };


    
      const handleBarcodeChange = text => {
        setBarcode(text);
        console.log('scan barcode text ', text);
      };
    
      const handleScan = () => {

        let scannedInSession = new Set();
      
        navigation.navigate("ScanQRPage2", {
          onScanSuccess: async scannedValue => {
            if (!scannedValue) return;
      
            // if (scannedInSession.has(scannedValue)) {
            //   Alert.alert('Alert', 'This barcode is already Selected!!');
            //   return;
            // }
      
            scannedInSession.add(scannedValue);
      
            await handleScannedCode(scannedValue);
          },
        });
      };

      const lastScannedBarcodeRef = useRef(lastScannedBarcode);

// Keep ref in sync with state
useEffect(() => {
  lastScannedBarcodeRef.current = lastScannedBarcode;
}, [lastScannedBarcode]);

const handleEditScannedQty = (qty) => {
  const currentBarcode = lastScannedBarcodeRef.current; // ✅ always fresh

  if (qty === '' || qty === null) {
    setLastScannedBarcode(prev => ({ ...prev, editQty: 0 }));
    setRows(prev => prev.map(r =>
      r.itemId +"_"+ (r.sizeId?r.sizeId: '') === currentBarcode.itemId +"_"+ (currentBarcode.sizeId?currentBarcode.sizeId: '')
        ? { ...r, issuedQty: r.issuedQty - currentBarcode.editQty }
        : r
    ));
    return;
  }

  const parsedQty = parseFloat(qty);
  if (isNaN(parsedQty) || parsedQty < 0) return;

  const barcodeQty = parseFloat(currentBarcode.qty) || 0;       // ✅ from ref
  const barcodeEditQty = parseFloat(currentBarcode.editQty) || 0; // ✅ from ref

  const row = rows.find(r =>
    r.itemId +"_"+ (r.sizeId?r.sizeId: '') ===
    currentBarcode.itemId +"_"+ (currentBarcode.sizeId?currentBarcode.sizeId:'')
  );

  if (row) {
    const reqQty = parseFloat(row.reqQty) || 0;
    const styleavailQty = parseFloat(row.styleavailQty) || 0;
    const issuedQty = parseFloat(row.issuedQty) || 0;

    const copiedIssuedQty = issuedQty - barcodeEditQty;

    if (parsedQty > barcodeQty) {
      Alert.alert("Qty Exceeding", "Entered Qty cannot exceed barcode Qty");
      return;
    } else if ((copiedIssuedQty + parsedQty) > reqQty) {
      Alert.alert("Qty Exceeding", "Entered Qty leading to exceed Required Qty");
      return;
    } else if ((copiedIssuedQty + parsedQty) > styleavailQty) {
      Alert.alert("Qty Exceeding", "Entered Qty leading to exceed Available Qty");
      return;
    } else {
      setRows(prev => prev.map(r =>
        r.itemId +"_"+ (r.sizeId?r.sizeId: '') ===
        currentBarcode.itemId +"_"+ (currentBarcode.sizeId?currentBarcode.sizeId:'')
          ? { ...r, issuedQty: copiedIssuedQty + parsedQty }
          : r
      ));
      setLastScannedBarcode(prev => ({ ...prev, editQty: parsedQty }));
      scannedBarcodes.current.set(row.itemId+"_"+(row.sizeId?matchedRow.sizeId:''), copiedIssuedQty + parsedQty);
    }
  }
};


































  return (
    <View style={CommonStyles.mainComponentViewStyle}>
      {/* Header */}
      <View style={CommonStyles.headerView}>
        <HeaderComponent
          isBackBtnEnable
          isSettingsEnable={false}
          isChatEnable={false}
          isTImerEnable={false}
          isTitleHeaderEnable
          title="Create Stock"
          backBtnAction={props.backBtnAction}
        />
      </View>

      <KeyboardAwareScrollView
        enableOnAndroid
        extraHeight={130}
        extraScrollHeight={130}
        showsVerticalScrollIndicator={false}
        style={{marginBottom: hp('15%'), width: '100%'}}>

        <View style={{marginBottom: hp('5%'), width: '90%', marginHorizontal: wp('5%')}}>
          <View style={{height: 15}} />

          {/* Radio */}
          <RadioGroup
            style={{flexDirection: 'row'}}
            radioButtons={inHouseRadioButtons}
            onPress={handleInHouseChange}
            layout="row"
            selectedId={
              inHouseRadioButtons.find(
                item => item.value === (inHouse === 'Yes' ? 'Style' : 'Buyer PO'),
              )?.id
            }
          />

          {/* Location Dropdown */}
          <View style={{marginTop: hp('2%')}}>
            <SearchableDropdown
              label="Location *"
              selectedId={locationId}
              selectedName={locationName}
              isOpen={showLocationList}
              onToggle={() => setShowLocationList(v => !v)}
              filteredList={filteredLocation}
              onSearch={handleSearchLocation}
              onSelect={onLocationSelect}
              styles={styles}
              labelKey="name"  
            />
          </View>

          {/* Vendor Dropdown */}
          <View style={{marginTop: hp('2%')}}>
            <SearchableDropdown
              label="Vendor"
              selectedId={vendorId}
              selectedName={vendorName}
              isOpen={showVendorList}
              onToggle={() => setShowVendorList(v => !v)}
              filteredList={filteredVendor}
              onSearch={handleSearchVendor}
              onSelect={item => {
                setVendorId(item.id);
                setVendorName(item.name);
                setShowVendorList(false);
              }}
              styles={styles}
              labelKey="name"
            />
          </View>

          {/* Work Order Dropdown */}
          <View style={{marginTop: hp('2%')}}>
            <SearchableDropdown
              label="Work Order *"
              selectedId={workOrderId}
              selectedName={workOrderName}
              isOpen={showWorkOrderList}
              onToggle={() => setShowWorkOrderList(v => !v)}
              filteredList={filteredWorkOrders}
              onSearch={filterWorkOrders}
              onSelect={item => {
                onWorkOrderSelect(item);
              }}
              styles={styles}
              labelKey="wo_val"
            />
          </View>
          

          {/* RM/Fabric Dropdown */}
          <View style={{marginTop: hp('2%')}}>
            <SearchableDropdown
              label="RM/Fabric"
              selectedId={rmFabricId}
              selectedName={rmFabricName}
              isOpen={showRMFabricList}
              onToggle={() => setShowRMFabricList(v => !v)}
              filteredList={filteredRMFabrics}
              onSearch={handleSearchRMFabric}
              onSelect={item => {
                setRMFabricId(item.id);
                setRMFabricName(item.name);
                setShowRMFabricList(false);
              }}
              styles={styles}
            />
          </View>

          {/* Barcode section */}
          <View style={styles.barcodeContainer}>
            {/* Text input + Search button */}
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <View style={{flex: 1, marginRight: 10}}>
                <TextInput
                  label="Barcode"
                  value={barCode}
                  mode="outlined"
                  onChangeText={handleBarcodeChange}
                />
              </View>
              <TouchableOpacity
                onPress={handleSearchBarcode}
                style={[styles.actionButton, {backgroundColor: colors.color2}]}>
                <Text style={styles.actionButtonText}>Search</Text>
              </TouchableOpacity>
            </View>

            {/* Divider */}
            <View style={styles.dividerRow}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>OR</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Scan button */}
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
                source={require('./.././../../../assets/images/png/scan.png')}
                style={{
                  height: 20,
                  width: 20,
                  tintColor: '#fff',
                }}
                resizeMode="contain"
              />
            </TouchableOpacity>

            {/* Total qty */}
            <TextInput
              label="Edit Barcode Qty"
              value={lastScannedBarcode ? lastScannedBarcode.editQty?.toString() : '0'}
              onChangeText={qty => handleEditScannedQty(qty)}
              keyboardType="decimal-pad"
              mode="outlined"
            />
          </View>

          {/* Table */}
          {rows.length > 0 && (
            <View style={styles.wrapper}>
              <ScrollView nestedScrollEnabled horizontal>
                <View style={styles.table}>
                  {/* Table Header */}
                  <View style={styles.table_head}>
                    {[
                      <CustomCheckBox2
                      isChecked={selectedIdxs?.length > 0 && selectedIdxs?.length === rows.length}
                      isIndeterminate={selectedIdxs?.length > 0 && selectedIdxs?.length < rows.length}
                      onToggle={updateAllIndexes}
                      disabled={false}
                  />, 'Type', 'RM/Fabric', 'Size',
                      'To Style/Buyer PO', '', 'Style Available Qty', '', 'Default Available Qty', '',
                      'Required Qty / Req Qty with Allowance', '', 'Issued Qty',
                    ].map((col, i) => (
                      <View key={i} style={{width: col === '' ? 10 : 100}}>
                        <Text style={styles.table_head_captions}>{col}</Text>
                      </View>
                    ))}
                  </View>

                  {/* Table Rows */}
                  {rows.map((row, index) => (
                    <View key={index} style={styles.table_body_single_row}>
                      <View style={{width: 100, paddingLeft: 40}}>
                      <CustomCheckBox2
                           style={styles.table_data}
                            isChecked={
                              selectedIdxs?.includes(row.itemId+"_"+(row.sizeId?row.sizeId:''))
                            }
                            isIndeterminate={false}
                            onToggle={() => toggleSelection(row)}
                            disabled={false}
                          />
                      </View>
                      
                      <View style={{width: 100}}>
                        <Text style={styles.table_data}>
                          {row.type + (row.trimType ? '(' + row.trimType + ')' : '')}
                        </Text>
                      </View>
                      <View style={{width: 100}}>
                        <Text style={styles.table_data}>{row.itemName}</Text>
                      </View>
                      <View style={{width: 100}}>
                        <Text style={styles.table_data}>{row.sizeDesc || ''}</Text>
                      </View>
                      <View style={{width: 100}}>
                        <Text style={styles.table_data}>{row.styleName}</Text>
                      </View>
                      <View style={{width: 10}} />
                      <View style={{width: 100}}>
                        <Text style={styles.table_data}>{row.styleavailQty}</Text>
                      </View>
                      <View style={{width: 10}} />
                      <View style={{width: 100}}>
                        <Text style={styles.table_data}>{row.defaultavailQty}</Text>
                      </View>
                      <View style={{width: 10}} />
                      <View style={{width: 100}}>
                        <Text style={styles.table_data}>{row.reqQty+'/'+ row.allowQty}</Text>
                      </View>
                      <View style={{width: 10}} />
                      <View style={{width: 100}}>
                        <TextInput
                          style={[styles.table_data_input,
                            {
                              backgroundColor: row.editable ? '#fff' : '#f0f0f0',
                              color: row.editable ? '#000' : '#999',
                            }]}
                          value={
                            row.issuedQty !== undefined && row.issuedQty !== null
                              ? String(row.issuedQty)
                              : "0"
                          }
                          onChangeText={qty => handleInputChange(row, index, 'issuedQty', qty)}
                          editable={row.styleavailQty > 0 && row.editable ? true : false}
                          keyboardType="numeric"
                        />

                        
                      </View>
                    </View>
                  ))}
                </View>
              </ScrollView>
            </View>
          )}
        </View>
      </KeyboardAwareScrollView>

      {/* Bottom buttons */}
      <View style={CommonStyles.bottomViewComponentStyle}>
        <BottomComponent
          rightBtnTitle="Save"
          leftBtnTitle="Back"
          isLeftBtnEnable
          rigthBtnState
          isRightBtnEnable
          rightButtonAction={submitAction}
          leftButtonAction={props.backBtnAction}
        />
      </View>

      {/* Alert popup */}
      {props.isPopUp && (
        <View style={CommonStyles.customPopUpStyle}>
          <AlertComponent
            header={props.popUpAlert}
            message={props.popUpMessage}
            isLeftBtnEnable={props.isPopupLeft}
            isRightBtnEnable
            leftBtnTilte="NO"
            rightBtnTilte={props.popUpRBtnTitle}
            popUpRightBtnAction={props.popOkBtnAction}
            popUpLeftBtnAction={() =>
              props.popUpAction(undefined, undefined, '', false, false)
            }
          />
        </View>
      )}

      {/* Loader */}
      {props.isLoading && (
        <LoaderComponent
          isLoader
          loaderText={Constant.LOADER_MESSAGE}
          isButtonEnable={false}
        />
      )}

      {/* Date Picker */}
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
      />
    </View>
  );
};

export default CreateStockIssueUI;

// ─── Styles ───────────────────────────────────────────────────────────────────

const getStyles = colors =>
  StyleSheet.create({
    SectionStyle1: {
      flexDirection: 'row',
      alignItems: 'center',
      height: hp('7%'),
      width: wp('75%'),
      borderRadius: hp('0.5%'),
    },
    imageStyle: {
      height: wp('12%'),
      aspectRatio: 1,
      marginRight: wp('8%'),
      resizeMode: 'stretch',
    },
    imageStyle1: {
      height: 30,
      aspectRatio: 1,
      resizeMode: 'contain',
      tintColor: 'red',
      alignSelf: 'center',
    },
    dropdownWrapper: {
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#fff',
    },
    dropdownTrigger: {
      flexDirection: 'row',
      borderWidth: 0.5,
      borderColor: '#D8D8D8',
      borderRadius: hp('0.5%'),
      width: '100%',
      justifyContent: 'space-between',
    },
    dropTextInputStyle: {
      fontWeight: 'normal',
      fontSize: 18,
      marginLeft: wp('4%'),
      color: 'black',
      width: wp('80%'),
    },
    dropTextLightStyle: {
      fontWeight: '300',
      fontSize: 12,
      width: wp('60%'),
      alignSelf: 'flex-start',
      marginTop: hp('1%'),
      marginLeft: wp('4%'),
      color: '#000',
    },
    barcodeContainer: {
      padding: 20,
      borderRadius: 10,
      marginTop: 10,
      borderColor: 'grey',
      borderWidth: 1,
    },
    actionButton: {
      paddingVertical: 12,
      paddingHorizontal: 20,
      borderRadius: 6,
      elevation: 3,
    },
    actionButtonText: {
      color: '#fff',
      fontWeight: '600',
      fontSize: 16,
    },
    dividerRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginVertical: hp('2%'),
    },
    dividerLine: {
      flex: 1,
      height: 1,
      backgroundColor: '#ddd',
    },
    dividerText: {
      marginHorizontal: 10,
      color: '#888',
      fontSize: 14,
    },
    scanButton: {
      paddingVertical: 12,
      borderRadius: 6,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      elevation: 3,
      alignSelf: 'center',
      width: '50%',
    },
    wrapper: {
      justifyContent: 'center',
      alignItems: 'center',
      flex: 1,
      marginTop: hp('5%'),
      width: '100%',
    },
    table: {
      width: '100%',
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
      alignItems: 'center',
    },
    table_data_input: {
      fontSize: 16,
      color: '#000',
      borderBottomWidth: 1,
      borderColor: '#ccc',
      paddingHorizontal: 4,
      textAlign: 'center',
      backgroundColor: '#fff',
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
  });