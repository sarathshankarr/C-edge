import React, {useState, useContext, useRef, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
  Modal,
  ActivityIndicator,
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
  // {styleId, bpId, locId, lotId} — kept so the roll-picker popup can
  // re-run getFabricRolls without re-deriving these from getStockApproveQty.
  fabricRollsCtx: null,

  approvedQty: '',
  returnQty: '',
  alreadyReturnedQty: 0,

  // The barcode (scan or manual search) that produced this row, if any —
  // '' for a row added manually via the dropdowns. Used so removing this
  // row can also clear the shared Barcode field/payload when nothing else
  // still depends on that barcode.
  scannedBarcode: '',
  // The exact fabRollData string returned by getBarcodeDetails for this
  // scan — sent to save unchanged. '' for a manually-built row, where
  // fabRollData is instead constructed from the picked roll/return qty.
  originalFabRollData: '',
  // The real particular row id from /view — required by editSave/approve
  // to identify which existing line item this is. '' for a brand-new row
  // (create mode, or a row added while editing).
  sirp_id: '',
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
// live in `aaData`, not at the top level. Confirmed real row shape:
// {fabricLineItemId, fabricRollNo, fabricName, width, rollwiseQty,
//  stockIssuedQty, price, ...}. `id` in aaData is always 0, so
// fabricLineItemId is the real unique roll identifier.
const toFabricRollsList = data => {
  if (!data) return [];
  const list = Array.isArray(data) ? data : Array.isArray(data.aaData) ? data.aaData : [];
  return list.map(item => ({
    id: item?.fabricLineItemId ?? item?.id ?? '',
    rollNo: item?.fabricRollNo ?? '',
    fabricName: item?.fabricName ?? '',
    width: item?.width ?? '',
    availableQty: item?.rollwiseQty ?? 0,
    stockIssuedQty: item?.stockIssuedQty ?? 0,
    // kept immutable so the qty field can revert to it if cleared
    initialStockIssuedQty: item?.stockIssuedQty ?? 0,
    price: item?.price ?? '',
  }));
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

// Server does `res.split(":")` and reads segment [2] for the roll number.
// Java's split() drops trailing empty segments, so "0:10:" only yields 2
// elements and segment [2] doesn't exist — crashing with
// ArrayIndexOutOfBoundsException: 2. Must be either "" (no roll picked) or
// a fully-formed "rollId:qty:rollNo" with a literal " " standing in for a
// missing roll number (matches how the web app builds this value).
const buildFabRollData = row => {
  if (!row.rollId) return '';
  const rollNo =
    row.rollNo && row.rollNo.toString().trim() !== '' ? row.rollNo : ' ';
  return `${row.rollId}:${row.returnQty || 0}:${rollNo}`;
};

// Fabric/RM names come back like "08-03 (4 WHITE MELANCH)" — strip the
// trailing "(color)" when using the name as the Roll Data placeholder.
const stripColorSuffix = name => (name || '').replace(/\s*\([^)]*\)\s*$/, '').trim();

const CreateStockIssueReturnUI = ({route, ...props}) => {
  const {colors} = useContext(ColorContext);
  const styles = getStyles(colors);
  const navigation = useNavigation();

  // mode: 'create' (default) | 'edit' | 'approve' | 'view'
  const mode = props.mode || 'create';
  const isEdit = mode === 'edit';
  const isApprove = mode === 'approve';
  const isView = mode === 'view';
  const readOnly = isApprove || isView; // fields disabled, no row add/remove
  const showBarcodeSection = mode === 'create' || isEdit;

  const [barcode, set_barcode] = useState('');
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [programDate, set_programDate] = useState('');
  const [rows, setRows] = useState([]);
  // Caches so picking the same Fabric/RM Name or Fabric type on another row
  // (or re-selecting on the same row) reuses the already-fetched list
  // instead of hitting the API again. Cache the in-flight PROMISE (not just
  // the resolved value) so parallel callers (e.g. hydrating several rows at
  // once) await the same request instead of each firing their own before
  // any of them resolve.
  const fabricRmsCacheRef = useRef({}); // fabricType -> Promise<items list>
  const stockIdsCacheRef = useRef({}); // fabricRmId -> Promise<stock issue list>

  const getFabricRmsCached = (type, silent = true) => {
    if (!fabricRmsCacheRef.current[type]) {
      fabricRmsCacheRef.current[type] = props
        .getFabricRmsByType(type, silent)
        .then(toOptionList);
    }
    return fabricRmsCacheRef.current[type];
  };

  const getStockIdsCached = (fabricRmId, silent = true) => {
    if (!stockIdsCacheRef.current[fabricRmId]) {
      stockIdsCacheRef.current[fabricRmId] = props
        .getStockIds(fabricRmId, silent)
        .then(toStockIssueOptionList);
    }
    return stockIdsCacheRef.current[fabricRmId];
  };
  const [rollPicker, setRollPicker] = useState({
    visible: false,
    rowId: null,
    list: [],
    loading: false,
    selectedId: null,
  });

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

  // Rebuilds a row from a saved particular (edit/approve/view). Resolves
  // display names via the same caches/lookups the manual dropdowns use.
  const hydrateRowFromParticular = async particular => {
    const type = particular.sirp_type !== '' ? Number(particular.sirp_type) : '';
    const fabricRmId = particular.sirp_fabRmId;
    const stockIssueId = particular.sirp_stockIssueId;
    const fabricTypeLabel = FABRIC_RM_TYPES.find(t => t.id === type)?.name || '';

    const fabricRmItemsList = await getFabricRmsCached(type);
    const fabricRmName =
      fabricRmItemsList.find(i => String(i.id) === String(fabricRmId))?.name || '';

    const stockIssueList = await getStockIdsCached(fabricRmId);
    const stockIssueName =
      stockIssueList.find(i => String(i.id) === String(stockIssueId))?.name ||
      String(stockIssueId ?? '');

    // Only Edit needs styleId/bpId/locId/lotId (to re-run getFabricRolls if
    // the user reopens the roll picker) — skip the extra call for Approve/View.
    let fabricRollsCtx = null;
    if (isEdit && stockIssueId && fabricRmId) {
      const approveQtyRes = await props.getStockApproveQty(stockIssueId, fabricRmId, true);
      const approveCtx = parseApproveQtyResponse(approveQtyRes);
      fabricRollsCtx = {
        styleId: approveCtx.styleId,
        bpId: approveCtx.bpId,
        locId: approveCtx.locId,
        lotId: approveCtx.lotId,
        rmId: approveCtx.fabricTrimId || fabricRmId,
      };
    }

    return {
      ...newRow(),
      fabricType: type,
      fabricTypeLabel,
      fabricRmId,
      fabricRmName,
      fabricRmItemsList,
      filteredFabricRmItemsList: fabricRmItemsList,
      stockIssueId,
      stockIssueName,
      stockIssueList,
      filteredStockIssueList: stockIssueList,
      rollId: particular.sirp_rollId || '',
      rollNo: particular.sirp_rollNo || '',
      rollData: particular.sirp_rollNo || '',
      fabricRollsCtx,
      approvedQty: particular.sirp_approvedQty?.toString() ?? '',
      returnQty: particular.sirp_returnQty?.toString() ?? '',
      scannedBarcode: particular.sirp_barcode || '',
      originalFabRollData: particular.fabRollData || '',
      sirp_id: particular.sirp_id || '',
    };
  };

  // Pre-fill the form from an existing record when opened in edit/approve/view.
  useEffect(() => {
    if (mode === 'create' || !props.viewObject) return;
    console.log('[StockIssueReturn][hydrate] mode =', mode, 'viewObject =', JSON.stringify(props.viewObject));
    // sird_date comes back null on this endpoint — the real value is under
    // the camelCase "sirdDate" field instead (confirmed via live trace).
    const resolvedDate =
      props.viewObject.sird_date ??
      props.viewObject.sirdDate ??
      props.viewObject.orderDate ??
      '';
    console.log('[StockIssueReturn][hydrate] resolvedDate =', resolvedDate);
    set_programDate(resolvedDate);

    (async () => {
      props.setLoading(true);
      try {
        const hydrated = await Promise.all(
          (props.viewObject.particulars || []).map(hydrateRowFromParticular),
        );
        setRows(hydrated);
      } finally {
        props.setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, props.viewObject]);

  const removeRow = id => {
    setRows(prev => {
      const removed = prev.find(row => row.id === id);
      const next = prev.filter(row => row.id !== id);

      // If the row tied to a scanned/searched barcode is removed and no
      // other row still references that same barcode, stop sending it —
      // clear the Barcode field so it isn't included in the save payload.
      if (
        removed?.scannedBarcode &&
        !next.some(row => row.scannedBarcode === removed.scannedBarcode)
      ) {
        set_barcode(prevBarcode =>
          prevBarcode === removed.scannedBarcode ? '' : prevBarcode,
        );
      }

      return next;
    });
  };

  // ─── Barcode ────────────────────────────────────────────────────────────
  // getBarcodeDetails only returns bare ids (fabricRmId, fabricRmType,
  // stockIssueId, fabRollData="rollId:qty:rollNo") — no display names — so we
  // chain the same lookups the manual dropdowns use to resolve names/options.
  const applyBarcodeDetails = async (data, barcodeValue) => {
    const fabricType = data.fabricRmType ?? data.fabricType ?? data.type ?? '';
    const fabricTypeNum = fabricType !== '' ? Number(fabricType) : '';
    const fabricRmId = data.fabricRmId ?? data.fabRmId ?? data.rmFabricId ?? '';
    const stockIssueId = data.stockIssueId ?? data.stockId ?? '';
    const [rollIdRaw, qtyRaw, rollNoRaw] = (data.fabRollData || '').split(':');

    const fabricTypeLabel =
      FABRIC_RM_TYPES.find(t => t.id === fabricTypeNum)?.name || '';

    const fabricRmItemsList = fabricTypeNum
      ? await getFabricRmsCached(fabricTypeNum)
      : [];
    const fabricRmName =
      fabricRmItemsList.find(item => String(item.id) === String(fabricRmId))
        ?.name || '';

    const stockIssueList = fabricRmId ? await getStockIdsCached(fabricRmId) : [];
    const stockIssueItem =
      stockIssueList.find(item => String(item.id) === String(stockIssueId)) ||
      null;
    const stockIssueName = stockIssueItem?.name || '';

    let approvedQty = '';
    let rollsList = [];
    let fabricRollsCtx = null;
    if (stockIssueId && fabricRmId) {
      // getStockIds doesn't carry styleId/bpId/locId/lotId — getStockApproveQty
      // does, so it must resolve first and feed those into getFabricRolls.
      const approveQtyRes = await props.getStockApproveQty(stockIssueId, fabricRmId, true);
      console.log('[StockIssueReturn][applyBarcodeDetails] getStockApproveQty raw =', JSON.stringify(approveQtyRes));
      const approveCtx = parseApproveQtyResponse(approveQtyRes);
      console.log('[StockIssueReturn][applyBarcodeDetails] approveCtx =', JSON.stringify(approveCtx));
      approvedQty = approveCtx.approvedQty.toString();
      fabricRollsCtx = {
        styleId: approveCtx.styleId,
        bpId: approveCtx.bpId,
        locId: approveCtx.locId,
        lotId: approveCtx.lotId,
        // getFabricRolls's `rmId` expects the fabricTrimId, not the
        // Fabric/RM master id — confirmed by user testing.
        rmId: approveCtx.fabricTrimId || fabricRmId,
      };

      const fabricRollsParams = {...fabricRollsCtx, stockIssueId};
      console.log('[StockIssueReturn][applyBarcodeDetails] getFabricRolls params =', JSON.stringify(fabricRollsParams));
      const rollsRes = await props.getFabricRolls(fabricRollsParams, true);
      console.log('[StockIssueReturn][applyBarcodeDetails] getFabricRolls raw =', JSON.stringify(rollsRes));
      rollsList = toFabricRollsList(rollsRes);
      console.log('[StockIssueReturn][applyBarcodeDetails] rollsList (mapped) =', JSON.stringify(rollsList));
    }
    const rollItem = rollsList.find(item => String(item.id) === String(rollIdRaw));
    const rollData = rollItem?.rollNo || rollNoRaw || rollIdRaw || '';
    // fabRollData's middle segment is the qty this specific scanned roll/
    // barcode holds — used only to pre-fill Return Qty. Approved Qty stays
    // the stock's aggregate value from getStockApproveQty, untouched.
    const barcodeQty = rollItem?.stockIssuedQty ?? qtyRaw ?? '';
    console.log('[StockIssueReturn][applyBarcodeDetails] rollIdRaw =', rollIdRaw, 'qtyRaw =', qtyRaw, 'rollNoRaw =', rollNoRaw, 'resolved rollData =', rollData, 'barcodeQty (-> returnQty) =', barcodeQty, 'approvedQty (unchanged) =', approvedQty);

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
      fabricRollsCtx,
      approvedQty,
      // Pre-fill Return Qty with the scanned barcode's own qty.
      returnQty: barcodeQty.toString(),
      scannedBarcode: barcodeValue || '',
      // Passed through to save unchanged, per the confirmed contract.
      originalFabRollData: data.fabRollData || '',
    });
  };

  // Decides which alert (if any) to show for a getBarcodeDetails result and
  // only populates a row when the lookup actually succeeded.
  const resolveBarcodeResult = async (data, barcodeValue) => {
    if (!data) {
      Alert.alert('Alert', 'Invalid barcode.');
      return false;
    }
    if (data.status !== true && data.status !== 'true') {
      Alert.alert('Alert', 'This barcode is not available in stock issue.');
      return false;
    }
    await applyBarcodeDetails(data, barcodeValue);
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
    if (rows.some(row => row.scannedBarcode === barcode)) {
      Alert.alert('Alert', 'Barcode already scanned.');
      return;
    }
    props.setLoading(true);
    try {
      console.log('[StockIssueReturn] Calling getBarcodeDetails with barcode =', barcode);
      const data = await props.getBarcodeDetails(barcode, true);
      console.log('[StockIssueReturn] getBarcodeDetails (search) returned =', JSON.stringify(data));
      await resolveBarcodeResult(data, barcode);
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
        if (rows.some(row => row.scannedBarcode === scannedValue)) {
          Alert.alert('Alert', 'Barcode already scanned.');
          return;
        }

        props.setLoading(true);
        try {
          console.log('[StockIssueReturn] Calling getBarcodeDetails with scannedValue =', scannedValue);
          const data = await props.getBarcodeDetails(scannedValue, true);
          console.log('[StockIssueReturn] getBarcodeDetails (scan) returned =', JSON.stringify(data));
          const populated = await resolveBarcodeResult(data, scannedValue);
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

    const wasCached = !!fabricRmsCacheRef.current[type.id];
    const itemsList = await getFabricRmsCached(type.id, false);
    if (wasCached) {
      console.log('[StockIssueReturn][selectFabricType] using cached fabricRms for type', type.id);
    }
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

    const wasCached = !!stockIdsCacheRef.current[item.id];
    const stockList = await getStockIdsCached(item.id, false);
    if (wasCached) {
      console.log('[StockIssueReturn][selectFabricRmItem] using cached stockIds for fabricRmId', item.id);
    }
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
    let fabricRollsCtx;
    try {
      // getStockIds doesn't carry styleId/bpId/locId/lotId — getStockApproveQty
      // does, so it must resolve first and feed those into getFabricRolls.
      const approveQtyRes = await props.getStockApproveQty(item.id, row.fabricRmId, true);
      console.log('[StockIssueReturn][selectStockIssue] getStockApproveQty raw =', JSON.stringify(approveQtyRes));
      approveCtx = parseApproveQtyResponse(approveQtyRes);
      console.log('[StockIssueReturn][selectStockIssue] approveCtx =', JSON.stringify(approveCtx));
      fabricRollsCtx = {
        styleId: approveCtx.styleId,
        bpId: approveCtx.bpId,
        locId: approveCtx.locId,
        lotId: approveCtx.lotId,
        // getFabricRolls's `rmId` expects the fabricTrimId, not the
        // Fabric/RM master id — confirmed by user testing.
        rmId: approveCtx.fabricTrimId || row.fabricRmId,
      };

      const fabricRollsParams = {...fabricRollsCtx, stockIssueId: item.id};
      console.log('[StockIssueReturn][selectStockIssue] getFabricRolls params =', JSON.stringify(fabricRollsParams));
      const rollsRes = await props.getFabricRolls(fabricRollsParams, true);
      console.log('[StockIssueReturn][selectStockIssue] getFabricRolls raw =', JSON.stringify(rollsRes));
      rollsList = toFabricRollsList(rollsRes);
      console.log('[StockIssueReturn][selectStockIssue] rollsList (mapped) =', JSON.stringify(rollsList));
    } finally {
      props.setLoading(false);
    }

    // Show the stock issue's overall approved qty right away; picking a
    // specific roll in the popup later overwrites it with that roll's qty.
    updateRow(row.id, {
      rollsList,
      fabricRollsCtx,
      approvedQty: approveCtx.approvedQty.toString(),
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

  // ─── Roll Data picker popup ─────────────────────────────────────────────
  const openRollPicker = async row => {
    if (!row.stockIssueId) return;
    setRollPicker({
      visible: true,
      rowId: row.id,
      list: row.rollsList,
      loading: true,
      selectedId: null,
    });

    const params = {
      styleId: row.fabricRollsCtx?.styleId || 0,
      // getFabricRolls's `rmId` expects the fabricTrimId captured earlier
      // from getStockApproveQty, not the Fabric/RM master id.
      rmId: row.fabricRollsCtx?.rmId || row.fabricRmId,
      bpId: row.fabricRollsCtx?.bpId || 0,
      locId: row.fabricRollsCtx?.locId || 0,
      lotId: row.fabricRollsCtx?.lotId || 0,
      stockIssueId: row.stockIssueId,
    };
    console.log('[StockIssueReturn][openRollPicker] getFabricRolls params =', JSON.stringify(params));
    const rollsRes = await props.getFabricRolls(params);
    console.log('[StockIssueReturn][openRollPicker] getFabricRolls raw =', JSON.stringify(rollsRes));
    const list = toFabricRollsList(rollsRes);
    console.log('[StockIssueReturn][openRollPicker] rollsList (mapped) =', JSON.stringify(list));

    updateRow(row.id, {rollsList: list});
    setRollPicker(prev =>
      prev.rowId === row.id ? {...prev, list, loading: false, selectedId: null} : prev,
    );
  };

  const closeRollPicker = () => {
    setRollPicker({
      visible: false,
      rowId: null,
      list: [],
      loading: false,
      selectedId: null,
    });
  };

  // Single-select: choosing a different roll replaces the current selection.
  const toggleRollSelect = id => {
    setRollPicker(prev => ({
      ...prev,
      selectedId: prev.selectedId === id ? null : id,
    }));
  };

  // Stock Issue Qty is editable in the grid before confirming — the value
  // shown/edited here is what gets pushed into Approved Qty on confirm.
  const onRollQtyChange = (id, text) => {
    const item = rollPicker.list.find(i => i.id === id);

    // Cleared the field entirely — fall back to the original issue qty
    // rather than leaving it blank.
    if (text === '') {
      setRollPicker(prev => ({
        ...prev,
        list: prev.list.map(i =>
          i.id === id ? {...i, stockIssuedQty: i.initialStockIssuedQty} : i,
        ),
      }));
      return;
    }

    if (item && Number(text) > Number(item.availableQty || 0)) {
      Alert.alert('Alert', 'Entered Qty is greater than Availible Qty');
      return; // reject the edit — leave the previous valid qty in place
    }
    setRollPicker(prev => ({
      ...prev,
      list: prev.list.map(i =>
        i.id === id ? {...i, stockIssuedQty: text} : i,
      ),
    }));
  };

  const confirmRollSelection = async () => {
    const row = rows.find(r => r.id === rollPicker.rowId);
    const item = rollPicker.list.find(i => i.id === rollPicker.selectedId);
    if (!row || !item) {
      Alert.alert('Alert', 'Please select a roll.');
      return;
    }

    const rollId = item.id;
    const rollNo = item.rollNo;
    updateRow(row.id, {
      rollId,
      rollNo,
      rollData: rollNo,
      approvedQty: item.stockIssuedQty?.toString() ?? '0',
    });
    closeRollPicker();

    const alreadyReturned = await props.getAlreadyReturnQty(
      row.stockIssueId,
      row.fabricRmId,
      rollId,
    );
    updateRow(row.id, {alreadyReturnedQty: toNumber(alreadyReturned)});
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
      // editSave replaces the entire particulars list server-side — every
      // existing row must carry its real sirp_id, or the server can't tell
      // which line item it's updating.
      ...(isEdit && row.sirp_id ? {sirp_id: row.sirp_id} : {}),
      sirp_type: row.fabricType ? row.fabricType.toString() : '',
      sirp_fabRmId: row.fabricRmId,
      sirp_stockIssueId: row.stockIssueId,
      sirp_approvedQty: Number(row.approvedQty) || 0,
      sirp_returnQty: Number(row.returnQty) || 0,
      sirp_barcode: row.scannedBarcode || '',
      sirp_newbarcoe: '',
      // A barcode-scanned row sends fabRollData empty — the barcode itself
      // (sirp_barcode) is what identifies the roll server-side. Only a
      // manually-built row (no scan) needs fabRollData constructed.
      fabRollData: row.scannedBarcode ? '' : buildFabRollData(row),
      sirp_rollId: row.rollId || 0,
      sirp_rollNo: row.rollNo || '',
    }));

    // sird_barocde is confirmed dead/broken — not sent.
    const saveObj = {
      sird_date: programDate,
      sird_saveType: isDraft ? 1 : 0,
      particulars,
      // editSave requires the record id being updated.
      ...(isEdit && props.viewObject?.sird_id
        ? {sird_id: props.viewObject.sird_id}
        : {}),
    };
    console.log('[StockIssueReturn][saveAction] isDraft =', isDraft, 'saveObj =', JSON.stringify(saveObj));

    if (isEdit) {
      props.editSaveAction(saveObj);
    } else {
      props.submitAction(saveObj);
    }
  };

  // Approve — return qty stays editable, everything else is read-only.
  // Sends the full current particulars list; sird_saveType is omitted
  // (server defaults to 2/approved).
  const handleApprove = () => {
    if (rows.length === 0) {
      Alert.alert('Alert', 'No rows to approve.');
      return;
    }
    for (let index = 0; index < rows.length; index++) {
      const row = rows[index];
      if (!row.returnQty || Number(row.returnQty) <= 0) {
        Alert.alert('Alert', `Row ${index + 1}: Return Qty is required.`);
        return;
      }
    }

    const particulars = rows.map(row => ({
      sirp_id: row.sirp_id || 0,
      sirp_sird_id: props.viewObject?.sird_id || 0,
      sirp_type: row.fabricType ? row.fabricType.toString() : '',
      sirp_fabRmId: row.fabricRmId,
      sirp_stockIssueId: row.stockIssueId,
      sirp_approvedQty: Number(row.approvedQty) || 0,
      sirp_returnQty: Number(row.returnQty) || 0,
      // Only populated when this line item actually originated from a
      // barcode scan — reactivates that barcode's ledger row server-side.
      // Never invented for a manual-entry line item.
      sirp_barcode: row.scannedBarcode || '',
      sirp_newbarcoe: '',
      // Barcode-scanned rows send fabRollData empty — sirp_barcode is what
      // identifies the roll for those.
      fabRollData: row.scannedBarcode ? '' : buildFabRollData(row),
      sirp_rollId: row.rollId || 0,
      sirp_rollNo: row.rollNo || '',
    }));

    const approveObj = {
      sird_id: props.viewObject?.sird_id || 0,
      particulars,
    };
    console.log('[StockIssueReturn][handleApprove] approveObj =', JSON.stringify(approveObj));
    props.approveAction(approveObj);
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
          title={
            isEdit
              ? 'Edit Stock Issue Return'
              : isApprove
              ? 'Approve Stock Issue Return'
              : isView
              ? 'View Stock Issue Return'
              : 'Create Stock Issue Return'
          }
          backBtnAction={backBtnAction}
        />
      </View>

      <KeyboardAwareScrollView
        enableOnAndroid
        extraHeight={130}
        extraScrollHeight={130}
        showsVerticalScrollIndicator={false}
        style={{flex: 1, width: '100%'}}
        contentContainerStyle={{paddingBottom: hp('9%')}}>
        <View style={{width: '90%', marginHorizontal: wp('5%')}}>
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
            {!readOnly && (
              <TouchableOpacity onPress={showDatePicker} style={{padding: 5}}>
                <Image source={calendarImg} style={{width: 40, height: 40}} />
              </TouchableOpacity>
            )}
          </View>

          <DateTimePickerModal
            isVisible={isDatePickerVisible}
            mode="date"
            onConfirm={handleConfirmDate}
            onCancel={hideDatePicker}
          />

          {/* Barcode section — not applicable when viewing/approving an
              already-saved record */}
          {showBarcodeSection && (
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
          )}

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
                      {!readOnly && (
                        <TouchableOpacity onPress={() => removeRow(row.id)}>
                          <Image source={closeImg} style={styles.imageStyle1} />
                        </TouchableOpacity>
                      )}
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
                        disabled={readOnly}
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
                        disabled={!row.fabricType || readOnly}
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
                        disabled={!row.fabricRmId || readOnly}
                      />
                    </View>

                    <View style={[styles.tableCell, {width: 160}]}>
                      <TouchableOpacity
                        disabled={!row.stockIssueId || readOnly}
                        onPress={() => openRollPicker(row)}
                        style={styles.rollDataTrigger}>
                        <Text
                          style={[
                            styles.table_data_text,
                            !row.stockIssueId && {color: '#aaa'},
                          ]}
                          numberOfLines={1}>
                          {(() => {
                            console.log(
                              '[StockIssueReturn][RollDataCell] rowId =', row.id,
                              'scannedBarcode =', JSON.stringify(row.scannedBarcode),
                              'fabricRmName =', row.fabricRmName,
                              'rollData =', row.rollData,
                            );
                            return row.scannedBarcode
                              ? stripColorSuffix(row.fabricRmName)
                              : row.rollData || stripColorSuffix(row.fabricRmName);
                          })()}
                        </Text>
                      </TouchableOpacity>
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
                        style={[
                          styles.table_data_input,
                          readOnly && styles.table_data_input_disabled,
                        ]}
                        value={row.returnQty?.toString() ?? ''}
                        onChangeText={text => onReturnQtyChange(row, text)}
                        onEndEditing={() => onReturnQtyBlur(row)}
                        keyboardType="numeric"
                        editable={!readOnly}
                      />
                    </View>
                  </View>
                ))}
              </View>
            </ScrollView>

            {!readOnly && (
              <TouchableOpacity onPress={() => addRow()} style={styles.addRowButton}>
                <Text style={styles.addRowButtonText}>{'+ Add Row'}</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </KeyboardAwareScrollView>

      <View style={[CommonStyles.bottomViewComponentStyle1, styles.footerContainer]}>
        <View style={styles.footerRow}>
          {(mode === 'create' || isEdit) && (
            <>
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
            </>
          )}

          {isApprove && (
            <TouchableOpacity
              style={styles.approveButtonStyle}
              onPress={() => handleApprove()}>
              <Text style={styles.footerBtnTextStyle}>{'Approve'}</Text>
            </TouchableOpacity>
          )}

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

      <Modal
        visible={rollPicker.visible}
        transparent
        animationType="fade"
        onRequestClose={closeRollPicker}>
        <View style={styles.rollPickerOverlay}>
          <View style={styles.rollPickerCard}>
            <View style={styles.rollPickerHeader}>
              <Text style={styles.rollPickerTitle}>Select Roll</Text>
              <TouchableOpacity onPress={closeRollPicker}>
                <Text style={styles.rollPickerCloseText}>×</Text>
              </TouchableOpacity>
            </View>

            {rollPicker.loading ? (
              <ActivityIndicator
                size="large"
                color={colors.color2}
                style={styles.rollPickerLoading}
              />
            ) : rollPicker.list.length === 0 ? (
              <Text style={styles.rollPickerEmptyText}>No rolls found.</Text>
            ) : (
              <ScrollView horizontal>
                <View>
                  <View style={styles.rollPickerTableHead}>
                    <View style={[styles.rollPickerCell, {width: 44}]} />
                    <View style={[styles.rollPickerCell, {width: 160}]}>
                      <Text style={styles.rollPickerHeadText}>Fabric Name</Text>
                    </View>
                    <View style={[styles.rollPickerCell, {width: 90}]}>
                      <Text style={styles.rollPickerHeadText}>Roll No</Text>
                    </View>
                    <View style={[styles.rollPickerCell, {width: 80}]}>
                      <Text style={styles.rollPickerHeadText}>Width</Text>
                    </View>
                    <View style={[styles.rollPickerCell, {width: 110}]}>
                      <Text style={styles.rollPickerHeadText}>Available Qty</Text>
                    </View>
                    <View style={[styles.rollPickerCell, {width: 130}]}>
                      <Text style={styles.rollPickerHeadText}>Stock Issue Qty</Text>
                    </View>
                    <View style={[styles.rollPickerCell, {width: 90}]}>
                      <Text style={styles.rollPickerHeadText}>Price</Text>
                    </View>
                  </View>

                  <ScrollView style={{maxHeight: hp('40%')}}>
                    {rollPicker.list.map((item, index) => {
                      const isSelected = rollPicker.selectedId === item.id;
                      return (
                        <View key={index} style={styles.rollPickerTableRow}>
                          <View style={[styles.rollPickerCell, {width: 44, alignItems: 'center'}]}>
                            <TouchableOpacity
                              onPress={() => toggleRollSelect(item.id)}
                              style={[
                                styles.rollCheckbox,
                                isSelected && styles.rollCheckboxSelected,
                              ]}>
                              {isSelected ? (
                                <View style={styles.rollCheckboxDot} />
                              ) : null}
                            </TouchableOpacity>
                          </View>
                          <View style={[styles.rollPickerCell, {width: 160}]}>
                            <Text style={styles.rollPickerCellText} numberOfLines={2}>
                              {item.fabricName}
                            </Text>
                          </View>
                          <View style={[styles.rollPickerCell, {width: 90}]}>
                            <Text style={styles.rollPickerCellText}>{item.rollNo}</Text>
                          </View>
                          <View style={[styles.rollPickerCell, {width: 80}]}>
                            <Text style={styles.rollPickerCellText}>{item.width}</Text>
                          </View>
                          <View style={[styles.rollPickerCell, {width: 110}]}>
                            <Text style={styles.rollPickerCellText}>
                              {item.availableQty}
                            </Text>
                          </View>
                          <View style={[styles.rollPickerCell, {width: 130}]}>
                            <RNTextInput
                              style={styles.rollPickerQtyInput}
                              value={item.stockIssuedQty?.toString() ?? ''}
                              onChangeText={text => onRollQtyChange(item.id, text)}
                              keyboardType="numeric"
                            />
                          </View>
                          <View style={[styles.rollPickerCell, {width: 90}]}>
                            <Text style={styles.rollPickerCellText}>{item.price}</Text>
                          </View>
                        </View>
                      );
                    })}
                  </ScrollView>
                </View>
              </ScrollView>
            )}

            {!rollPicker.loading && rollPicker.list.length > 0 ? (
              <View style={styles.rollPickerFooter}>
                <TouchableOpacity
                  style={styles.rollPickerConfirmButton}
                  onPress={confirmRollSelection}>
                  <Text style={styles.rollPickerSelectButtonText}>Select</Text>
                </TouchableOpacity>
              </View>
            ) : null}
          </View>
        </View>
      </Modal>
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
      // flex-start (not 'center') — otherwise when one column's dropdown
      // panel expands the row's height, sibling columns get re-centered
      // vertically and their triggers shift down on top of the open panel.
      alignItems: 'flex-start',
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
    rollDataTrigger: {
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 6,
      paddingHorizontal: 8,
      height: 42,
      justifyContent: 'center',
      backgroundColor: '#fff',
    },
    rollPickerOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    rollPickerCard: {
      width: '90%',
      maxHeight: '70%',
      backgroundColor: '#fff',
      borderRadius: 10,
      overflow: 'hidden',
    },
    rollPickerHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingVertical: 14,
      backgroundColor: colors.color2,
    },
    rollPickerTitle: {
      color: '#fff',
      fontSize: 16,
      fontWeight: '700',
    },
    rollPickerCloseText: {
      color: '#fff',
      fontSize: 20,
      fontWeight: '700',
    },
    rollPickerTableHead: {
      flexDirection: 'row',
      backgroundColor: '#eef1f7',
      borderBottomWidth: 1,
      borderBottomColor: '#ddd',
    },
    rollPickerTableRow: {
      flexDirection: 'row',
      alignItems: 'center',
      borderBottomWidth: 1,
      borderBottomColor: '#eee',
    },
    rollPickerCell: {
      paddingHorizontal: 8,
      paddingVertical: 10,
      justifyContent: 'center',
    },
    rollPickerHeadText: {
      fontSize: 12,
      fontWeight: '700',
      color: '#333',
    },
    rollPickerCellText: {
      fontSize: 13,
      color: '#000',
    },
    rollCheckbox: {
      width: 22,
      height: 22,
      borderRadius: 11,
      borderWidth: 2,
      borderColor: '#999',
      alignItems: 'center',
      justifyContent: 'center',
    },
    rollCheckboxSelected: {
      borderColor: colors.color2,
    },
    rollCheckboxDot: {
      width: 12,
      height: 12,
      borderRadius: 6,
      backgroundColor: colors.color2,
    },
    rollPickerQtyInput: {
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 6,
      paddingHorizontal: 6,
      height: 38,
      fontSize: 13,
      color: '#000',
      backgroundColor: '#fff',
    },
    rollPickerSelectButtonText: {
      color: '#fff',
      fontSize: 14,
      fontWeight: '700',
    },
    rollPickerEmptyText: {
      textAlign: 'center',
      padding: 24,
      color: '#666',
      fontSize: 14,
    },
    rollPickerLoading: {
      padding: 24,
    },
    rollPickerFooter: {
      padding: 14,
      borderTopWidth: 1,
      borderTopColor: '#eee',
      alignItems: 'flex-end',
    },
    rollPickerConfirmButton: {
      backgroundColor: colors.color2,
      paddingHorizontal: 24,
      paddingVertical: 12,
      borderRadius: 6,
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
      backgroundColor: '#fff',
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
    approveButtonStyle: {
      backgroundColor: '#ff9800',
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
