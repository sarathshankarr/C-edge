import React, {useState, useContext} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
  TextInput as RNTextInput,
} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {TextInput} from 'react-native-paper';
import CommonStyles from './../../../utils/commonStyles/commonStyles';
import * as Constant from './../../../utils/constants/constant';
import HeaderComponent from './../../../utils/commonComponents/headerComponent';
import LoaderComponent from './../../../utils/commonComponents/loaderComponent';
import AlertComponent from './../../../utils/commonComponents/alertComponent';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {useNavigation} from '@react-navigation/native';
import {ColorContext} from './../../colorTheme/colorTheme';

const downArrowImg = require('./.././../../../assets/images/png/dropDownImg.png');
const closeImg = require('./.././../../../assets/images/png/close1.png');
const calendarImg = require('./.././../../../assets/images/png/calendar11.png');
const scanImg = require('./.././../../../assets/images/png/scan.png');

// fabricTypes: 1 = RM, 2 = Fabric
const FABRIC_RM_TYPES = [
  {id: 2, name: 'Fabric'},
  {id: 1, name: 'RM'},
];

// ─── Sub-components ─────────────────────────────────────────────────────────
// Same searchable-dropdown look used on the Stock Issue create page.
// `compact` renders a narrow version sized for a fixed-width table cell instead
// of the full-width field used for the top-of-form dropdowns.
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
  labelKey = 'name',
  disabled,
  compact,
}) => (
  <View style={compact ? styles.dropdownWrapperCompact : styles.dropdownWrapper}>
    <TouchableOpacity
      style={[
        compact ? styles.dropdownTriggerCompact : styles.dropdownTrigger,
        disabled && {opacity: 0.5},
      ]}
      disabled={disabled}
      onPress={onToggle}>
      <View style={compact ? styles.SectionStyleCompact : styles.SectionStyle1}>
        <View style={{flexDirection: 'column', flexShrink: 1}}>
          <Text
            style={
              selectedId
                ? compact
                  ? styles.dropTextLightStyleCompact
                  : styles.dropTextLightStyle
                : compact
                ? styles.dropTextInputStyleCompact
                : styles.dropTextInputStyle
            }>
            {label}
          </Text>
          {selectedId ? (
            <Text
              numberOfLines={1}
              style={
                compact ? styles.dropTextInputStyleCompact : styles.dropTextInputStyle
              }>
              {selectedName}
            </Text>
          ) : null}
        </View>
      </View>
      <View style={{justifyContent: 'center'}}>
        <Image
          source={downArrowImg}
          style={compact ? styles.imageStyleCompact : styles.imageStyle}
        />
      </View>
    </TouchableOpacity>

    {isOpen && !disabled && (
      <View style={compact ? styles.dropdownContentCompact : styles.dropdownContent1}>
        {onSearch ? (
          <TextInput
            style={styles.searchInput}
            placeholder="Search"
            onChangeText={onSearch}
            placeholderTextColor="#000"
          />
        ) : null}
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

let rowIdCounter = 0;
const newRow = () => ({
  id: `row_${Date.now()}_${rowIdCounter++}`,
  fabricType: '',
  fabricTypeLabel: '',
  showFabricRmList: false,

  fabricRmId: '',
  fabricRmName: '',
  fabricRmItemsList: [],
  filteredFabricRmItemsList: [],
  showFabricRmNameList: false,

  stockIssueId: '',
  stockIssueName: '',
  stockIssueItem: null,
  stockIssueList: [],
  filteredStockIssueList: [],
  showStockIssueList: false,

  rollId: '',
  rollNo: '',
  rollData: '',
  rollsList: [],

  approvedQty: '',
  returnQty: '',
  alreadyReturnedQty: 0,
});

// API responses may come back either as an array of {id, name, ...} items
// or as a plain {id: name} map — normalize either shape to a common list.
const toOptionList = data => {
  if (!data) return [];
  if (Array.isArray(data)) {
    return data.map(item =>
      item && typeof item === 'object'
        ? {...item, id: item.id ?? item.value, name: item.name ?? item.label ?? String(item.id ?? '')}
        : {id: item, name: String(item)},
    );
  }
  if (typeof data === 'object') {
    return Object.keys(data).map(key => ({id: key, name: data[key]}));
  }
  return [];
};

const toNumber = data => {
  if (data === null || data === undefined) return 0;
  if (typeof data === 'number') return data;
  if (typeof data === 'string') return Number(data) || 0;
  if (typeof data === 'object') {
    const val =
      data.approvedQty ?? data.qty ?? data.returnQty ?? Object.values(data)[0];
    return Number(val) || 0;
  }
  return 0;
};

// getStockIds returns {stockId: fabricId} — the value just echoes back the
// fabricId we searched with, it is NOT a display label, so build the label
// from the stockId itself instead of trusting the map's value.
const toStockIssueOptionList = data => {
  if (!data) return [];
  if (Array.isArray(data)) return toOptionList(data);
  if (typeof data === 'object') {
    return Object.keys(data).map(id => ({id, name: String(id)}));
  }
  return [];
};

// getFabricRolls returns a DataTables-style object — the actual roll rows
// live in `aaData`, not at the top level, so toOptionList's generic
// object-to-list handling would otherwise turn every unrelated top-level
// field (gsm, status, iTotalRecords, ...) into a bogus "option".
const toFabricRollsList = data => {
  if (!data) return [];
  const list = Array.isArray(data) ? data : Array.isArray(data.aaData) ? data.aaData : [];
  return list.map(item => {
    if (item && typeof item === 'object') {
      const id = item.rollId ?? item.sic_id ?? item.id ?? '';
      const name =
        item.rollNo ?? item.roll_no ?? item.rollNumber ?? item.name ?? String(id);
      return {...item, id, name};
    }
    return {id: item, name: String(item)};
  });
};

// getStockApproveQty's real payload uses sirp_approvedQty, and also carries
// the styleId/bpId/locId/lotId context needed for the getFabricRolls call —
// getStockIds doesn't provide those, so this response is the source for them.
const parseApproveQtyResponse = data => {
  if (!data || typeof data !== 'object') {
    return {approvedQty: toNumber(data), styleId: 0, bpId: 0, locId: 0, lotId: 0, fabricTrimId: 0};
  }
  return {
    approvedQty: Number(data.sirp_approvedQty ?? data.approvedQty ?? 0) || 0,
    styleId: data.styleId || 0,
    bpId: data.bpId || 0,
    locId: data.locId || 0,
    lotId: data.lotId || 0,
    // fabricTrimId is a distinct id from fabricRmId — getFabricRolls's `rmId`
    // param appears to expect this one, not the Fabric/RM master id.
    fabricTrimId: data.fabricTrimId || 0,
  };
};

const CreateStockIssueReturnUI = ({route, ...props}) => {
  const {colors} = useContext(ColorContext);
  const styles = getStyles(colors);
  const navigation = useNavigation();

  const [barcode, set_barcode] = useState('');
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [programDate, set_programDate] = useState('');
  const [rows, setRows] = useState([]);

  const backBtnAction = () => {
    props.backBtnAction();
  };

  const popOkBtnAction = () => {
    props.popOkBtnAction();
  };

  const showDatePicker = () => setDatePickerVisibility(true);
  const hideDatePicker = () => setDatePickerVisibility(false);
  const handleConfirmDate = d => {
    const formattedDate = d.toISOString().split('T')[0];
    set_programDate(formattedDate);
    hideDatePicker();
  };

  const updateRow = (id, changes) => {
    setRows(prev =>
      prev.map(row => (row.id === id ? {...row, ...changes} : row)),
    );
  };

  const addRow = (prefill = {}) => {
    setRows(prev => [...prev, {...newRow(), ...prefill}]);
  };

  const removeRow = id => {
    setRows(prev => prev.filter(row => row.id !== id));
  };

  // ─── Barcode ────────────────────────────────────────────────────────────
  // getBarcodeDetails only returns bare ids (fabricRmId, fabricRmType,
  // stockIssueId, fabRollData="rollId:qty:rollNo") — no display names — so we
  // chain the same lookups the manual dropdowns use to resolve names/options.
  const applyBarcodeDetails = async data => {
    const fabricType = data.fabricRmType ?? data.fabricType ?? data.type ?? '';
    const fabricTypeNum = fabricType !== '' ? Number(fabricType) : '';
    const fabricRmId = data.fabricRmId ?? data.fabRmId ?? data.rmFabricId ?? '';
    const stockIssueId = data.stockIssueId ?? data.stockId ?? '';
    const [rollIdRaw, , rollNoRaw] = (data.fabRollData || '').split(':');

    const fabricTypeLabel =
      FABRIC_RM_TYPES.find(t => t.id === fabricTypeNum)?.name || '';

    const fabricRmItemsList = fabricTypeNum
      ? toOptionList(await props.getFabricRmsByType(fabricTypeNum, true))
      : [];
    const fabricRmName =
      fabricRmItemsList.find(item => String(item.id) === String(fabricRmId))
        ?.name || '';

    const stockIssueList = fabricRmId
      ? toStockIssueOptionList(await props.getStockIds(fabricRmId, true))
      : [];
    const stockIssueItem =
      stockIssueList.find(item => String(item.id) === String(stockIssueId)) ||
      null;
    const stockIssueName = stockIssueItem?.name || '';

    let approvedQty = '';
    let rollsList = [];
    if (stockIssueId && fabricRmId) {
      // getStockIds doesn't carry styleId/bpId/locId/lotId — getStockApproveQty
      // does, so it must resolve first and feed those into getFabricRolls.
      const approveQtyRes = await props.getStockApproveQty(stockIssueId, fabricRmId, true);
      console.log('[StockIssueReturn][applyBarcodeDetails] getStockApproveQty raw =', JSON.stringify(approveQtyRes));
      const approveCtx = parseApproveQtyResponse(approveQtyRes);
      console.log('[StockIssueReturn][applyBarcodeDetails] approveCtx =', JSON.stringify(approveCtx));
      approvedQty = approveCtx.approvedQty.toString();

      const fabricRollsParams = {
        styleId: approveCtx.styleId,
        rmId: fabricRmId,
        bpId: approveCtx.bpId,
        locId: approveCtx.locId,
        lotId: approveCtx.lotId,
        stockIssueId,
      };
      console.log('[StockIssueReturn][applyBarcodeDetails] getFabricRolls params =', JSON.stringify(fabricRollsParams));
      const rollsRes = await props.getFabricRolls(fabricRollsParams, true);
      console.log('[StockIssueReturn][applyBarcodeDetails] getFabricRolls raw =', JSON.stringify(rollsRes));
      rollsList = toFabricRollsList(rollsRes);
      console.log('[StockIssueReturn][applyBarcodeDetails] rollsList (mapped) =', JSON.stringify(rollsList));
    }
    const rollItem = rollsList.find(item => String(item.id) === String(rollIdRaw));
    const rollData = rollItem?.name || rollNoRaw || rollIdRaw || '';
    console.log('[StockIssueReturn][applyBarcodeDetails] rollIdRaw =', rollIdRaw, 'rollNoRaw =', rollNoRaw, 'resolved rollData =', rollData);

    addRow({
      fabricType: fabricTypeNum,
      fabricTypeLabel,
      fabricRmId,
      fabricRmName,
      fabricRmItemsList,
      filteredFabricRmItemsList: fabricRmItemsList,
      stockIssueId,
      stockIssueName,
      stockIssueItem,
      stockIssueList,
      filteredStockIssueList: stockIssueList,
      rollId: rollIdRaw || '',
      rollNo: rollNoRaw || '',
      rollData,
      rollsList,
      approvedQty,
    });
  };

  // Decides which alert (if any) to show for a getBarcodeDetails result and
  // only populates a row when the lookup actually succeeded.
  const resolveBarcodeResult = async data => {
    if (!data) {
      Alert.alert('Alert', 'Invalid barcode.');
      return false;
    }
    if (data.status !== true && data.status !== 'true') {
      Alert.alert('Alert', 'This barcode is not available in stock issue.');
      return false;
    }
    await applyBarcodeDetails(data);
    return true;
  };

  // Manual entry — fired only when the Search button is tapped.
  // A single loader spans the whole lookup+populate chain (all the inner
  // calls run `silent` so they don't each flash the loader on/off).
  const onSearchBarcode = async () => {
    console.log('[StockIssueReturn] Search button pressed. barcode value =', JSON.stringify(barcode));
    if (!barcode) {
      console.log('[StockIssueReturn] Search aborted — barcode field is empty.');
      Alert.alert('Alert', 'Please enter a barcode.');
      return;
    }
    props.setLoading(true);
    try {
      console.log('[StockIssueReturn] Calling getBarcodeDetails with barcode =', barcode);
      const data = await props.getBarcodeDetails(barcode, true);
      console.log('[StockIssueReturn] getBarcodeDetails (search) returned =', JSON.stringify(data));
      await resolveBarcodeResult(data);
    } finally {
      props.setLoading(false);
    }
  };

  // Camera scan — validates and auto-populates immediately on a successful read.
  const onScanBarcode = () => {
    console.log('[StockIssueReturn] Scan button pressed — opening ScanQRPage2.');
    navigation.navigate('ScanQRPage2', {
      onScanSuccess: async scannedValue => {
        console.log('[StockIssueReturn] onScanSuccess fired. scannedValue =', JSON.stringify(scannedValue));
        if (!scannedValue) {
          console.log('[StockIssueReturn] Scan aborted — scannedValue is falsy.');
          return;
        }

        props.setLoading(true);
        try {
          console.log('[StockIssueReturn] Calling getBarcodeDetails with scannedValue =', scannedValue);
          const data = await props.getBarcodeDetails(scannedValue, true);
          console.log('[StockIssueReturn] getBarcodeDetails (scan) returned =', JSON.stringify(data));
          const populated = await resolveBarcodeResult(data);
          if (populated) {
            set_barcode(scannedValue);
            navigation.goBack();
          }
        } finally {
          props.setLoading(false);
        }
      },
    });
  };

  // ─── Fabric/Rm dropdown (static type: Fabric / RM) ───────────────────────
  const toggleFabricRmList = id => {
    setRows(prev =>
      prev.map(row =>
        row.id === id
          ? {
              ...row,
              showFabricRmList: !row.showFabricRmList,
              showFabricRmNameList: false,
              showStockIssueList: false,
            }
          : {...row, showFabricRmList: false},
      ),
    );
  };

  const selectFabricType = async (row, type) => {
    updateRow(row.id, {
      fabricType: type.id,
      fabricTypeLabel: type.name,
      showFabricRmList: false,
      fabricRmId: '',
      fabricRmName: '',
      fabricRmItemsList: [],
      filteredFabricRmItemsList: [],
      stockIssueId: '',
      stockIssueName: '',
      stockIssueItem: null,
      stockIssueList: [],
      filteredStockIssueList: [],
      rollId: '',
      rollNo: '',
      rollData: '',
      rollsList: [],
      approvedQty: '',
      returnQty: '',
      alreadyReturnedQty: 0,
    });

    const itemsList = toOptionList(await props.getFabricRmsByType(type.id));
    updateRow(row.id, {
      fabricRmItemsList: itemsList,
      filteredFabricRmItemsList: itemsList,
    });
  };

  // ─── Fabric/RM Name dropdown (items fetched for the chosen type) ─────────
  const toggleFabricRmNameList = id => {
    setRows(prev =>
      prev.map(row =>
        row.id === id
          ? {
              ...row,
              showFabricRmNameList: !row.showFabricRmNameList,
              showFabricRmList: false,
              showStockIssueList: false,
              filteredFabricRmItemsList: row.fabricRmItemsList,
            }
          : {...row, showFabricRmNameList: false},
      ),
    );
  };

  const searchFabricRmItem = (text, id) => {
    setRows(prev =>
      prev.map(row =>
        row.id === id
          ? {
              ...row,
              filteredFabricRmItemsList: row.fabricRmItemsList.filter(item =>
                item.name?.toLowerCase().includes(text.toLowerCase()),
              ),
            }
          : row,
      ),
    );
  };

  const selectFabricRmItem = async (row, item) => {
    updateRow(row.id, {
      fabricRmId: item.id,
      fabricRmName: item.name,
      showFabricRmNameList: false,
      stockIssueId: '',
      stockIssueName: '',
      stockIssueItem: null,
      stockIssueList: [],
      filteredStockIssueList: [],
      rollId: '',
      rollNo: '',
      rollData: '',
      rollsList: [],
      approvedQty: '',
      returnQty: '',
      alreadyReturnedQty: 0,
    });

    const stockList = toStockIssueOptionList(await props.getStockIds(item.id));
    updateRow(row.id, {
      stockIssueList: stockList,
      filteredStockIssueList: stockList,
    });
  };

  // ─── Stock Issue dropdown ───────────────────────────────────────────────
  const toggleStockIssueList = id => {
    setRows(prev =>
      prev.map(row =>
        row.id === id
          ? {
              ...row,
              showStockIssueList: !row.showStockIssueList,
              showFabricRmList: false,
              showFabricRmNameList: false,
              filteredStockIssueList: row.stockIssueList,
            }
          : {...row, showStockIssueList: false},
      ),
    );
  };

  const searchStockIssue = (text, id) => {
    setRows(prev =>
      prev.map(row =>
        row.id === id
          ? {
              ...row,
              filteredStockIssueList: row.stockIssueList.filter(item =>
                item.name?.toLowerCase().includes(text.toLowerCase()),
              ),
            }
          : row,
      ),
    );
  };

  const selectStockIssue = async (row, item) => {
    updateRow(row.id, {
      stockIssueId: item.id,
      stockIssueName: item.name,
      stockIssueItem: item,
      showStockIssueList: false,
      rollId: '',
      rollNo: '',
      rollData: '',
      rollsList: [],
      approvedQty: '',
      returnQty: '',
      alreadyReturnedQty: 0,
    });

    props.setLoading(true);
    let rollsList = [];
    let approveCtx;
    try {
      // getStockIds doesn't carry styleId/bpId/locId/lotId — getStockApproveQty
      // does, so it must resolve first and feed those into getFabricRolls.
      const approveQtyRes = await props.getStockApproveQty(item.id, row.fabricRmId, true);
      console.log('[StockIssueReturn][selectStockIssue] getStockApproveQty raw =', JSON.stringify(approveQtyRes));
      approveCtx = parseApproveQtyResponse(approveQtyRes);
      console.log('[StockIssueReturn][selectStockIssue] approveCtx =', JSON.stringify(approveCtx));

      const fabricRollsParams = {
        styleId: approveCtx.styleId,
        rmId: row.fabricRmId,
        bpId: approveCtx.bpId,
        locId: approveCtx.locId,
        lotId: approveCtx.lotId,
        stockIssueId: item.id,
      };
      console.log('[StockIssueReturn][selectStockIssue] getFabricRolls params =', JSON.stringify(fabricRollsParams));
      const rollsRes = await props.getFabricRolls(fabricRollsParams, true);
      console.log('[StockIssueReturn][selectStockIssue] getFabricRolls raw =', JSON.stringify(rollsRes));
      rollsList = toFabricRollsList(rollsRes);
      console.log('[StockIssueReturn][selectStockIssue] rollsList (mapped) =', JSON.stringify(rollsList));
    } finally {
      props.setLoading(false);
    }

    // Roll Data is a plain text field, not a picker — auto-fill it from the
    // first roll returned so the field isn't left empty, but the user can
    // freely overwrite it.
    const firstRoll = rollsList[0];
    console.log('[StockIssueReturn][selectStockIssue] firstRoll =', JSON.stringify(firstRoll));
    updateRow(row.id, {
      approvedQty: approveCtx.approvedQty.toString(),
      rollsList,
      rollId: firstRoll?.id ?? '',
      rollNo: firstRoll?.rollNo ?? firstRoll?.name ?? '',
      rollData: firstRoll?.name ?? '',
    });
  };

  // ─── Return Qty ─────────────────────────────────────────────────────────
  const onReturnQtyChange = (row, text) => {
    updateRow(row.id, {returnQty: text});
  };

  const onReturnQtyBlur = async row => {
    if (!row.returnQty || !row.stockIssueId || !row.fabricRmId) return;

    const alreadyReturned = await props.getAlreadyReturnQty(
      row.stockIssueId,
      row.fabricRmId,
      row.rollId,
    );
    const alreadyReturnedQty = toNumber(alreadyReturned);
    updateRow(row.id, {alreadyReturnedQty});

    const approvedQty = Number(row.approvedQty) || 0;
    const returnQty = Number(row.returnQty) || 0;
    if (returnQty + alreadyReturnedQty > approvedQty) {
      Alert.alert(
        'Alert',
        `Return Qty (${returnQty}) plus already returned qty (${alreadyReturnedQty}) exceeds Approved Qty (${approvedQty}).`,
      );
    }
  };

  // ─── Save ───────────────────────────────────────────────────────────────
  const saveAction = (isDraft = false) => {
    if (!programDate) {
      Alert.alert('Alert', 'Program Date is required.');
      return;
    }

    if (rows.length === 0) {
      Alert.alert('Alert', 'Please add at least one row.');
      return;
    }

    if (!isDraft) {
      for (let index = 0; index < rows.length; index++) {
        const row = rows[index];
        if (!row.fabricRmId) {
          Alert.alert('Alert', `Row ${index + 1}: Fabric/RM Name is required.`);
          return;
        }
        if (!row.stockIssueId) {
          Alert.alert('Alert', `Row ${index + 1}: Stock Issue is required.`);
          return;
        }
        if (!row.returnQty || Number(row.returnQty) <= 0) {
          Alert.alert('Alert', `Row ${index + 1}: Return Qty is required.`);
          return;
        }
        const total = Number(row.returnQty) + Number(row.alreadyReturnedQty || 0);
        if (row.approvedQty && total > Number(row.approvedQty)) {
          Alert.alert(
            'Alert',
            `Row ${index + 1}: Return Qty plus already returned qty should not exceed Approved Qty (${row.approvedQty}).`,
          );
          return;
        }
      }
    }

    const particulars = rows.map(row => ({
      sirp_type: row.fabricType ? row.fabricType.toString() : '',
      sirp_fabRmId: row.fabricRmId,
      sirp_stockIssueId: row.stockIssueId,
      sirp_approvedQty: Number(row.approvedQty) || 0,
      sirp_returnQty: Number(row.returnQty) || 0,
      sirp_barcode: barcode,
      sirp_newbarcoe: '',
      fabRollData: `${row.rollId || 0}:${row.returnQty || 0}:${row.rollNo || ''}`,
      sirp_rollId: row.rollId || 0,
      sirp_rollNo: row.rollNo || '',
    }));

    props.submitAction({
      sird_date: programDate,
      sird_saveType: isDraft ? 1 : 0,
      sird_barocde: Number(barcode) || 0,
      particulars,
    });
  };

  return (
    <View style={CommonStyles.mainComponentViewStyle}>
      <View style={CommonStyles.headerView}>
        <HeaderComponent
          isBackBtnEnable
          isSettingsEnable={false}
          isChatEnable={false}
          isTImerEnable={false}
          isTitleHeaderEnable
          title="Create Stock Issue Return"
          backBtnAction={backBtnAction}
        />
      </View>

      <KeyboardAwareScrollView
        enableOnAndroid
        extraHeight={130}
        extraScrollHeight={130}
        showsVerticalScrollIndicator={false}
        style={{marginBottom: hp('20%'), width: '100%'}}>
        <View style={{marginBottom: hp('8%'), width: '90%', marginHorizontal: wp('5%')}}>
          <View style={{height: 15}} />

          {/* Program Date */}
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#fff',
              flexDirection: 'row',
              width: '100%',
            }}>
            <View style={{flex: 1, paddingHorizontal: 10}}>
              <TextInput
                label="Program Date *"
                value={programDate ? Constant.formatDateIntoDMY(programDate) : ''}
                mode="outlined"
                editable={false}
                color="#000"
              />
            </View>
            <TouchableOpacity onPress={showDatePicker} style={{padding: 5}}>
              <Image source={calendarImg} style={{width: 40, height: 40}} />
            </TouchableOpacity>
          </View>

          <DateTimePickerModal
            isVisible={isDatePickerVisible}
            mode="date"
            onConfirm={handleConfirmDate}
            onCancel={hideDatePicker}
          />

          {/* Barcode section */}
          <View style={styles.barcodeContainer}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <View style={{flex: 1, marginRight: 10}}>
                <TextInput
                  label="Barcode"
                  value={barcode}
                  mode="outlined"
                  autoCapitalize="none"
                  onChangeText={text => set_barcode(text.trimStart())}
                />
              </View>
              <TouchableOpacity
                onPress={onSearchBarcode}
                style={[styles.actionButton, {backgroundColor: colors.color2}]}>
                <Text style={styles.actionButtonText}>Search</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.dividerRow}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>OR</Text>
              <View style={styles.dividerLine} />
            </View>

            <TouchableOpacity
              onPress={onScanBarcode}
              style={[styles.scanButton, {backgroundColor: colors.color2}]}>
              <Text style={styles.actionButtonText}>{'Scan  '}</Text>
              <Image source={scanImg} style={{height: 20, width: 20, tintColor: '#fff'}} />
            </TouchableOpacity>
          </View>

          {/* Rows table */}
          <View style={styles.wrapper}>
            <ScrollView nestedScrollEnabled horizontal>
              <View style={styles.table}>
                <View style={styles.table_head}>
                  <View style={[styles.tableCell, {width: 60}]}>
                    <Text style={styles.table_head_captions}>Action</Text>
                  </View>
                  <View style={[styles.tableCell, {width: 140}]}>
                    <Text style={styles.table_head_captions}>Fabric/Rm *</Text>
                  </View>
                  <View style={[styles.tableCell, {width: 180}]}>
                    <Text style={styles.table_head_captions}>Fabric/RM Name *</Text>
                  </View>
                  <View style={[styles.tableCell, {width: 180}]}>
                    <Text style={styles.table_head_captions}>Stock Issue *</Text>
                  </View>
                  <View style={[styles.tableCell, {width: 160}]}>
                    <Text style={styles.table_head_captions}>Roll Data</Text>
                  </View>
                  <View style={[styles.tableCell, {width: 120}]}>
                    <Text style={styles.table_head_captions}>Approved Qty</Text>
                  </View>
                  <View style={[styles.tableCell, {width: 120}]}>
                    <Text style={styles.table_head_captions}>Return Qty *</Text>
                  </View>
                </View>

                {rows.map(row => (
                  <View key={row.id} style={styles.table_body_single_row}>
                    <View style={[styles.tableCell, {width: 60, alignItems: 'center'}]}>
                      <TouchableOpacity onPress={() => removeRow(row.id)}>
                        <Image source={closeImg} style={styles.imageStyle1} />
                      </TouchableOpacity>
                    </View>

                    <View style={[styles.tableCell, {width: 140}]}>
                      <SearchableDropdown
                        compact
                        label="Fabric/Rm"
                        selectedId={row.fabricType}
                        selectedName={row.fabricTypeLabel}
                        isOpen={row.showFabricRmList}
                        onToggle={() => toggleFabricRmList(row.id)}
                        filteredList={FABRIC_RM_TYPES}
                        onSearch={null}
                        onSelect={item => selectFabricType(row, item)}
                        styles={styles}
                      />
                    </View>

                    <View style={[styles.tableCell, {width: 180}]}>
                      <SearchableDropdown
                        compact
                        label="Fabric/RM Name"
                        selectedId={row.fabricRmId}
                        selectedName={row.fabricRmName}
                        isOpen={row.showFabricRmNameList}
                        onToggle={() => toggleFabricRmNameList(row.id)}
                        filteredList={row.filteredFabricRmItemsList}
                        onSearch={text => searchFabricRmItem(text, row.id)}
                        onSelect={item => selectFabricRmItem(row, item)}
                        styles={styles}
                        disabled={!row.fabricType}
                      />
                    </View>

                    <View style={[styles.tableCell, {width: 180}]}>
                      <SearchableDropdown
                        compact
                        label="Stock Issue"
                        selectedId={row.stockIssueId}
                        selectedName={row.stockIssueName}
                        isOpen={row.showStockIssueList}
                        onToggle={() => toggleStockIssueList(row.id)}
                        filteredList={row.filteredStockIssueList}
                        onSearch={text => searchStockIssue(text, row.id)}
                        onSelect={item => selectStockIssue(row, item)}
                        styles={styles}
                        disabled={!row.fabricRmId}
                      />
                    </View>

                    <View style={[styles.tableCell, {width: 160}]}>
                      <Text style={styles.table_data_text}>{row.rollData || '-'}</Text>
                    </View>

                    <View style={[styles.tableCell, {width: 120}]}>
                      <RNTextInput
                        style={[styles.table_data_input, styles.table_data_input_disabled]}
                        value={row.approvedQty?.toString() ?? ''}
                        editable={false}
                        keyboardType="numeric"
                      />
                    </View>

                    <View style={[styles.tableCell, {width: 120}]}>
                      <RNTextInput
                        style={styles.table_data_input}
                        value={row.returnQty?.toString() ?? ''}
                        onChangeText={text => onReturnQtyChange(row, text)}
                        onEndEditing={() => onReturnQtyBlur(row)}
                        keyboardType="numeric"
                      />
                    </View>
                  </View>
                ))}
              </View>
            </ScrollView>

            <TouchableOpacity onPress={() => addRow()} style={styles.addRowButton}>
              <Text style={styles.addRowButtonText}>{'+ Add Row'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAwareScrollView>

      <View style={[CommonStyles.bottomViewComponentStyle1, styles.footerContainer]}>
        <View style={styles.footerRow}>
          <TouchableOpacity
            style={styles.draftButtonStyle}
            onPress={() => saveAction(true)}>
            <Text style={styles.footerBtnTextStyle}>{'Save as Draft'}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.saveButtonStyle}
            onPress={() => saveAction(false)}>
            <Text style={styles.footerBtnTextStyle}>{'Save'}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.backButtonStyle}
            onPress={() => backBtnAction()}>
            <Text style={styles.footerBtnTextStyle}>{'Back'}</Text>
          </TouchableOpacity>
        </View>
      </View>

      {props.isPopUp ? (
        <View style={CommonStyles.customPopUpStyle}>
          <AlertComponent
            header={props.popUpAlert}
            message={props.popUpMessage}
            isLeftBtnEnable={props.isPopupLeft}
            isRightBtnEnable={true}
            leftBtnTilte={'NO'}
            rightBtnTilte={props.popUpRBtnTitle}
            popUpRightBtnAction={() => popOkBtnAction()}
            popUpLeftBtnAction={() => {}}
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

export default CreateStockIssueReturnUI;

const getStyles = colors =>
  StyleSheet.create({
    SectionStyle1: {
      flexDirection: 'row',
      alignItems: 'center',
      height: hp('7%'),
      width: wp('60%'),
      borderRadius: hp('0.5%'),
    },
    imageStyle: {
      height: wp('12%'),
      aspectRatio: 1,
      marginRight: wp('8%'),
      resizeMode: 'stretch',
    },
    imageStyle1: {
      height: 26,
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
      fontSize: 16,
      marginLeft: wp('4%'),
      color: 'black',
      width: wp('65%'),
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
    noCategoriesText: {
      textAlign: 'center',
      marginTop: 20,
      fontSize: 16,
      fontWeight: '600',
      color: '#000000',
    },
    barcodeContainer: {
      padding: 20,
      borderRadius: 10,
      marginTop: hp('2%'),
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
      marginTop: hp('2%'),
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
      fontSize: 13,
      color: 'white',
      fontWeight: '600',
      textAlign: 'center',
    },
    table_body_single_row: {
      flexDirection: 'row',
      borderBottomWidth: 1,
      borderColor: '#ddd',
      paddingVertical: 10,
      backgroundColor: '#fff',
      paddingHorizontal: 5,
      alignItems: 'center',
    },
    // Gives every column breathing room so values don't run into each other.
    tableCell: {
      paddingHorizontal: 8,
    },
    table_data_input: {
      fontSize: 14,
      color: '#000',
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 6,
      paddingHorizontal: 8,
      textAlign: 'center',
      backgroundColor: '#fff',
      height: 42,
    },
    table_data_input_disabled: {
      backgroundColor: '#f0f0f0',
      color: '#888',
    },
    table_data_text: {
      fontSize: 14,
      color: '#000',
      textAlign: 'center',
    },
    // Compact SearchableDropdown variant sized for a table cell.
    dropdownWrapperCompact: {
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#fff',
    },
    dropdownTriggerCompact: {
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 0.5,
      borderColor: '#D8D8D8',
      borderRadius: hp('0.5%'),
      minHeight: hp('7%'),
      width: '100%',
      paddingHorizontal: 6,
      backgroundColor: '#fff',
    },
    SectionStyleCompact: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    dropTextInputStyleCompact: {
      fontWeight: 'normal',
      fontSize: 13,
      color: 'black',
    },
    dropTextLightStyleCompact: {
      fontWeight: '300',
      fontSize: 11,
      color: '#000',
    },
    imageStyleCompact: {
      height: 16,
      width: 16,
      resizeMode: 'contain',
    },
    dropdownContentCompact: {
      elevation: 5,
      height: 200,
      width: 180,
      backgroundColor: '#fff',
      borderRadius: 10,
      borderColor: 'lightgray',
      borderWidth: 1,
      marginTop: 3,
    },
    addRowButton: {
      backgroundColor: colors.color2,
      paddingVertical: 12,
      paddingHorizontal: 28,
      borderRadius: 6,
      alignSelf: 'center',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: hp('2%'),
      marginBottom: hp('4%'),
      elevation: 3,
    },
    addRowButtonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: '600',
    },
    footerContainer: {
      height: hp('8%'),
      backgroundColor: 'transparent',
      shadowOpacity: 0,
      elevation: 0,
    },
    footerRow: {
      flexDirection: 'row',
      width: '100%',
      height: '100%',
      justifyContent: 'center',
      alignItems: 'center',
    },
    draftButtonStyle: {
      backgroundColor: '#9e9e9e',
      height: hp('5.5%'),
      paddingHorizontal: wp('4%'),
      borderRadius: hp('0.5%'),
      justifyContent: 'center',
      alignItems: 'center',
      marginHorizontal: wp('1.5%'),
    },
    saveButtonStyle: {
      backgroundColor: colors.color2,
      height: hp('5.5%'),
      paddingHorizontal: wp('4%'),
      borderRadius: hp('0.5%'),
      justifyContent: 'center',
      alignItems: 'center',
      marginHorizontal: wp('1.5%'),
    },
    backButtonStyle: {
      backgroundColor: '#2979ff',
      height: hp('5.5%'),
      paddingHorizontal: wp('4%'),
      borderRadius: hp('0.5%'),
      justifyContent: 'center',
      alignItems: 'center',
      marginHorizontal: wp('1.5%'),
    },
    footerBtnTextStyle: {
      color: '#fff',
      fontSize: 13,
      fontWeight: '700',
      textAlign: 'center',
    },
  });
