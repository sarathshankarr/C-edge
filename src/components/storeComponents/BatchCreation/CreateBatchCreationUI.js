import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef,
  useContext,
  forwardRef,
  useImperativeHandle,
} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Modal,
  FlatList,
  Alert,
  ScrollView,
} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import CommonStyles from './../../../utils/commonStyles/commonStyles';
import HeaderComponent from './../../../utils/commonComponents/headerComponent';
import LoaderComponent from './../../../utils/commonComponents/loaderComponent';
import AlertComponent from './../../../utils/commonComponents/alertComponent';
import * as Constant from './../../../utils/constants/constant';
import {ColorContext} from './../../colorTheme/colorTheme';

// CommonStyles.bottomViewComponentStyle1 (the shared absolute-positioned
// footer container used across the app) defaults to hp('12%'), which is far
// taller than the content-sized footer buttons actually need — override it
// locally here rather than touching the shared style used by other modules.
const FOOTER_HEIGHT = 64;

// The fabric-treatment fields removed from the UI (per web parity) but still
// sent to the server with their default value on every create/update.
const CHECKBOX_DEFAULTS = {
  singeing: 0,
  hset: 0,
  kitty: 0,
  zerozero: 0,
  semiStarch: 0,
  crossDyg: 0,
  singleDyg: 0,
  solidDyg: 0,
  cationicDyg: 0,
  shiner: 0,
};

let rowKeySeq = 0;
const newRowKey = () => `row_${Date.now()}_${rowKeySeq++}`;

const emptyRow = () => ({
  _key: newRowKey(),
  batchName: '',
  // The Batch No this row was originally loaded with (edit mode only) — a
  // brand-new row has none, so a failed duplicate check falls back to ''.
  originalBatchName: '',
  poNo: 0,
  vendorId: 0,
  noOfPieces: '',
  rollNo: '',
  mtr: '',
  greyReceivedh: '',
  // Display-only, populated from rollDetails on Lot No selection — never
  // sent back to the server (see buildPayload's explicit row shape below).
  vendorName: '',
  vendorChalanNo: '',
  fabWidth: '',
  grnRecDate: '',
  grnNo: '',
});

const mapToOptions = map =>
  Object.entries(map || {}).map(([id, label]) => ({id: String(id), label: String(label)}));

const pad2 = n => String(n).padStart(2, '0');
const formatDMY = date =>
  `${pad2(date.getDate())}/${pad2(date.getMonth() + 1)}/${date.getFullYear()}`;

// Maps the `edit` API's viewDTO (a serialized BatchCreation entity) into
// this form's field names. Verified against a real server response — see
// the field-mismatch table this was fixed from (locationId comes back as
// `bc_location_id`, dates as `batchCreationDateStr`, `reedAndPick` instead
// of `reedPick`, `fabricProcessFlow` instead of `fabricFlow`, and each row's
// `noOfPices` (sic) / `greyReceived` instead of `noOfPieces`/`greyReceivedh`).
const mapViewDTOToForm = dto => {
  if (!dto) return null;
  const details = dto.batchDetails || dto.batchCreationDetails || [];
  return {
    locationId: dto.bc_location_id ?? dto.locationId ?? dto.bcLocationId ?? '',
    fabricId: dto.fabricId ?? '',
    cottonD: dto.cottonD ?? '',
    polysD: dto.polysD ?? '',
    desizeD: dto.desizeD ?? '',
    partyName: dto.partyName ?? '',
    creationDate: dto.batchCreationDateStr ?? dto.creationDate ?? dto.batchCreationDate ?? '',
    dcNo: dto.dcNo ?? '',
    qualityNameh: dto.qualityNameh ?? dto.qualityName ?? '',
    greyShortage: dto.greyShortage ?? '',
    weight: dto.weight ?? '',
    reedPick: dto.reedAndPick ?? dto.reedPick ?? '',
    fabricFlow: dto.fabricProcessFlow ?? dto.fabricFlow ?? '',
    bioFinish: dto.bioFinish ?? '',
    remazol: dto.remazol ?? '',
    mercerise: dto.mercerise ?? '',
    lycra: dto.lycra ?? '',
    rolltrolley: dto.rolltrolley ?? '',
    sample: dto.sample ?? '',
    bsr: dto.bsr ?? '',
    deliveryAt: dto.deliveryAt ?? '',
    batchDetails: details.length
      ? details.map(d => ({
          _key: newRowKey(),
          batchDetailsId: d.id ?? d.batchDetailsId,
          batchName: d.batchName ?? '',
          originalBatchName: d.batchName ?? '',
          poNo: d.poNo ?? 0,
          vendorId: d.vendorId ?? 0,
          noOfPieces: d.noOfPieces ?? d.noOfPices ?? '',
          rollNo: d.rollNo ?? d.lotNo ?? '',
          rollNoh: d.rollNo ?? d.lotNo ?? '',
          mtr: d.mtr ?? '',
          mtrOld: d.mtr ?? '',
          greyReceivedh: d.greyReceivedh ?? d.greyReceived ?? '',
          lineItemId: d.lineItemId ?? 0,
          vendorName: d.vendorName ?? '',
          vendorChalanNo: d.vendorChalanNo ?? d.vendorChallanNo ?? '',
          fabWidth: d.fabWidth ?? d.greyWidth ?? '',
          grnRecDate: d.grnRecDate ?? d.greyDate ?? '',
          grnNo: d.grnNo ?? '',
        }))
      : [emptyRow()],
  };
};

const SelectField = forwardRef(({
  label,
  required,
  value,
  options,
  onSelect,
  disabled,
  placeholder,
  compact,
  boxStyle,
}, ref) => {
  const [open, set_open] = useState(false);
  const [search, set_search] = useState('');
  const selected = options.find(o => o.id === String(value));
  const filteredOptions = search.trim()
    ? options.filter(o => o.label.toLowerCase().includes(search.trim().toLowerCase()))
    : options;

  const closeModal = () => {
    set_open(false);
    set_search('');
  };

  // Lets a parent (e.g. mandatory-field validation) open this picker
  // programmatically, the equivalent of "focusing" a non-text-input field.
  useImperativeHandle(ref, () => ({
    open: () => set_open(true),
  }));

  return (
    <View style={compact ? undefined : styles.fieldWrap}>
      {!compact ? (
        <Text style={styles.label}>
          {label}
          {required ? <Text style={styles.required}> *</Text> : null}
        </Text>
      ) : null}
      <TouchableOpacity
        style={[
          styles.inputBox,
          compact && styles.tableInputBox,
          disabled && styles.inputBoxDisabled,
          boxStyle,
        ]}
        disabled={disabled}
        onPress={() => set_open(true)}>
        <Text style={selected ? styles.inputText : styles.inputPlaceholder} numberOfLines={1}>
          {selected ? selected.label : disabled ? '—' : placeholder || 'Select...'}
        </Text>
      </TouchableOpacity>
      <Modal visible={open} transparent animationType="fade" onRequestClose={closeModal}>
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={closeModal}>
          <TouchableOpacity activeOpacity={1} style={styles.modalCard} onPress={() => {}}>
            {label ? <Text style={styles.modalTitle}>{label}</Text> : null}
            <TextInput
              style={styles.modalSearchInput}
              placeholder="Search..."
              placeholderTextColor="#999"
              autoCapitalize="none"
              autoFocus
              value={search}
              onChangeText={set_search}
            />
            <FlatList
              data={filteredOptions}
              keyExtractor={o => o.id}
              style={{maxHeight: hp('45%')}}
              keyboardShouldPersistTaps="handled"
              renderItem={({item}) => (
                <TouchableOpacity
                  style={styles.modalOption}
                  onPress={() => {
                    // Re-selecting the already-selected value is a no-op —
                    // just close the picker, don't fire onSelect (which
                    // could reset dependent dropdowns, trigger the edit
                    // discard-rows confirmation, refire rollDetails lookups,
                    // etc. for nothing).
                    if (item.id !== String(value)) {
                      onSelect(item.id);
                    }
                    closeModal();
                  }}>
                  <Text style={styles.modalOptionText}>{item.label}</Text>
                </TouchableOpacity>
              )}
              ListEmptyComponent={<Text style={styles.modalEmptyText}>No options</Text>}
            />
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </View>
  );
});

const TextField = forwardRef(({label, required, value, onChangeText, onBlur, keyboardType, editable = true, error}, ref) => (
  <View style={styles.fieldWrap}>
    <Text style={styles.label}>
      {label}
      {required ? <Text style={styles.required}> *</Text> : null}
    </Text>
    <TextInput
      ref={ref}
      style={[styles.inputBox, styles.textInputInner, !editable && styles.inputBoxDisabled]}
      value={value !== undefined && value !== null ? String(value) : ''}
      onChangeText={onChangeText}
      onBlur={onBlur}
      editable={editable}
      keyboardType={keyboardType || 'default'}
      placeholderTextColor="#999"
    />
    {error ? <Text style={styles.errorText}>{error}</Text> : null}
  </View>
));

const CreateBatchCreationUI = ({route, ...props}) => {
  const {colors} = useContext(ColorContext);
  const isEdit = props.mode === 'edit';
  // View re-uses this exact screen and its edit-mode field mapping/prefill,
  // just with everything rendered disabled/read-only and no Save/Submit.
  const isView = props.mode === 'view';
  const isPrefillMode = isEdit || isView;

  // Refs used to bring a missing mandatory field into view and "focus" it
  // (open its picker, or focus its TextInput) after the validation alert.
  const scrollRef = useRef(null);
  const fieldY = useRef({});
  const locationFieldRef = useRef(null);
  const fabricFieldRef = useRef(null);
  const fabricFlowFieldRef = useRef(null);
  const dcNoFieldRef = useRef(null);
  const batchNoInputRefs = useRef({});
  const lotNoFieldRefs = useRef({});
  const mtrInputRefs = useRef({});

  const recordFieldY = key => e => {
    fieldY.current[key] = e.nativeEvent.layout.y;
  };

  const scrollToField = key => {
    const y = fieldY.current[key];
    if (y !== undefined && scrollRef.current?.scrollToPosition) {
      scrollRef.current.scrollToPosition(0, Math.max(y - 20, 0), true);
    }
  };

  // View has two tabs: the batch's own fields ("View") and, if the batch's
  // fabric has a process flow configured, the read-only production process
  // checklist ("Production Process") — pulled straight from the same `edit`
  // response's viewDTO.batchCreationReportsBean, no extra API call needed.
  const [activeTab, set_activeTab] = useState('view');

  const [locationId, set_locationId] = useState('');
  const [fabricId, set_fabricId] = useState('');
  const [cottonD, set_cottonD] = useState('');
  const [polysD, set_polysD] = useState('');
  const [desizeD, set_desizeD] = useState('');
  const [partyName, set_partyName] = useState('');
  const [creationDate, set_creationDate] = useState('');
  const [isDatePickerVisible, set_isDatePickerVisible] = useState(false);
  const [dcNo, set_dcNo] = useState('');
  const [qualityNameh, set_qualityNameh] = useState('');
  const [greyShortage, set_greyShortage] = useState('');
  const [weight, set_weight] = useState('');
  const [reedPick, set_reedPick] = useState('');
  const [fabricFlow, set_fabricFlow] = useState('');
  const [bioFinish, set_bioFinish] = useState('');
  const [remazol, set_remazol] = useState('');
  const [mercerise, set_mercerise] = useState('');
  const [lycra, set_lycra] = useState('');
  const [rolltrolley, set_rolltrolley] = useState('');
  const [sample, set_sample] = useState('');
  const [bsr, set_bsr] = useState('');
  const [deliveryAt, set_deliveryAt] = useState('');
  const [batchDetails, set_batchDetails] = useState([emptyRow()]);
  const [confirmSubmitVisible, set_confirmSubmitVisible] = useState(false);

  // Location -> Fabric Type -> Lot No cascade (report §4 "Dropdown data sourcing")
  useEffect(() => {
    console.log('[BatchCreation:CreateUI] locationId changed ->', locationId);
    if (locationId) props.loadFabricsByLocation(locationId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locationId]);

  useEffect(() => {
    console.log('[BatchCreation:CreateUI] fabricId changed ->', fabricId);
    if (fabricId) props.loadLotNos(fabricId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fabricId]);

  useEffect(() => {
    if (props.defaultFlowId !== undefined && !fabricFlow) {
      set_fabricFlow(String(props.defaultFlowId));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.defaultFlowId]);

  // Prefill from the `edit` API response once it lands (used by both Edit
  // and View — View just renders this same prefilled data disabled).
  useEffect(() => {
    if (!isPrefillMode || !props.editViewDTO) return;
    console.log('[BatchCreation:CreateUI] prefilling edit form from viewDTO:', JSON.stringify(props.editViewDTO));
    const form = mapViewDTOToForm(props.editViewDTO);
    console.log('[BatchCreation:CreateUI] mapped form:', JSON.stringify(form));
    if (!form) return;
    set_locationId(String(form.locationId || ''));
    set_fabricId(String(form.fabricId || ''));
    set_cottonD(form.cottonD);
    set_polysD(form.polysD);
    set_desizeD(form.desizeD);
    set_partyName(form.partyName);
    set_creationDate(form.creationDate);
    set_dcNo(form.dcNo);
    set_qualityNameh(form.qualityNameh);
    set_greyShortage(form.greyShortage);
    set_weight(form.weight);
    set_reedPick(form.reedPick);
    set_fabricFlow(String(form.fabricFlow || ''));
    set_bioFinish(form.bioFinish);
    set_remazol(form.remazol);
    set_mercerise(form.mercerise);
    set_lycra(form.lycra);
    set_rolltrolley(form.rolltrolley);
    set_sample(form.sample);
    set_bsr(form.bsr);
    set_deliveryAt(form.deliveryAt);
    set_batchDetails(form.batchDetails);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.editViewDTO]);

  // Total Issued is auto-summed from the rows' MTR values, same as the web
  // form's JS (report §4) — not directly editable here.
  const totalIssued = useMemo(
    () =>
      batchDetails.reduce((sum, row) => {
        const v = parseFloat(row.mtr);
        return sum + (isNaN(v) ? 0 : v);
      }, 0),
    [batchDetails],
  );

  // View collapses every batch-detail row into one, since the Batch No is
  // shared across them — Lot Nos are concatenated, Grey Received is blanked
  // out (it's row/roll specific and doesn't make sense summed), and No of
  // Pieces/MTR are summed.
  const viewSummaryRow = useMemo(() => {
    if (!isView) return null;
    return {
      _key: 'view-summary',
      batchName: batchDetails[0]?.batchName || '',
      rollNo: batchDetails.map(r => r.rollNo).filter(Boolean).join(', '),
      greyReceivedh: '',
      noOfPieces: batchDetails.reduce((sum, r) => sum + (parseFloat(r.noOfPieces) || 0), 0),
      mtr: totalIssued,
    };
  }, [isView, batchDetails, totalIssued]);

  const tableRows = isView && viewSummaryRow ? [viewSummaryRow] : batchDetails;

  // viewDTO.batchCreationReportsBean — one entry per configured production
  // process step for this batch's fabric. Sorted by menuOrder defensively
  // (the backend query already orders by bcfpf_order). newstts > 0 means
  // that step has occurred for this batch.
  const productionProcessSteps = useMemo(() => {
    const steps = props.editViewDTO?.batchCreationReportsBean || [];
    return [...steps].sort((a, b) => (a.menuOrder ?? 0) - (b.menuOrder ?? 0));
  }, [props.editViewDTO]);

  // Same collapsing as viewSummaryRow, applied to the vendor/GRN display
  // fields — comma-joined instead of one box per row.
  const viewVendorSummary = useMemo(() => {
    if (!isView) return null;
    const join = key =>
      [...new Set(batchDetails.map(r => r[key]).filter(Boolean))].join(', ');
    const summary = {
      vendorName: join('vendorName'),
      vendorChalanNo: join('vendorChalanNo'),
      fabWidth: join('fabWidth'),
      grnRecDate: join('grnRecDate'),
    };
    return Object.values(summary).some(Boolean) ? summary : null;
  }, [isView, batchDetails]);

  const locationOptions = useMemo(() => {
    const opts = mapToOptions(props.locationsMap);
    console.log('[BatchCreation:CreateUI] locationOptions recomputed —', 'locationsMap:', JSON.stringify(props.locationsMap), '-> options:', JSON.stringify(opts));
    return opts;
  }, [props.locationsMap]);
  const fabricOptions = useMemo(() => {
    const opts = mapToOptions(props.fabricsMap);
    console.log('[BatchCreation:CreateUI] fabricOptions recomputed —', 'fabricsMap:', JSON.stringify(props.fabricsMap), '-> options:', JSON.stringify(opts));
    return opts;
  }, [props.fabricsMap]);
  const fabricFlowOptions = useMemo(() => {
    const opts = mapToOptions(props.fabricFlowConfigMap);
    console.log('[BatchCreation:CreateUI] fabricFlowOptions recomputed —', 'fabricFlowConfigMap:', JSON.stringify(props.fabricFlowConfigMap), '-> options:', JSON.stringify(opts));
    return opts;
  }, [props.fabricFlowConfigMap]);
  const lotNoOptions = useMemo(() => {
    const opts = mapToOptions(props.lotNosMap);
    console.log('[BatchCreation:CreateUI] lotNoOptions recomputed —', 'lotNosMap:', JSON.stringify(props.lotNosMap), '-> options:', JSON.stringify(opts));
    return opts;
  }, [props.lotNosMap]);

  const updateRow = (key, field, value) => {
    set_batchDetails(prev =>
      prev.map(r => (r._key === key ? {...r, [field]: value} : r)),
    );
  };

  const updateRowFields = (key, fields) => {
    set_batchDetails(prev =>
      prev.map(r => (r._key === key ? {...r, ...fields} : r)),
    );
  };

  // On Lot No selection: fetch GRN/roll details and auto-populate Quality
  // Name (header, shared), this row's PO No/Vendor, the display-only
  // vendor/grey fields, and a computed Grey Received. Matches the web app's
  // behavior (a roll can be split across multiple rows, so Grey Received
  // must subtract what other rows on this same roll already claim).
  const onLotNoSelect = async (row, rollNo) => {
    updateRow(row._key, 'rollNo', rollNo);
    if (!rollNo) return;

    console.log('[BatchCreation:CreateUI] Lot No selected ->', rollNo, 'for row', row._key);
    const grn = await props.loadRollDetails(rollNo, fabricId, locationId);
    if (!grn) {
      console.log('[BatchCreation:CreateUI] rollDetails — no grnDetails returned, leaving row as-is');
      return;
    }

    if (grn.fabricName) set_qualityNameh(grn.fabricName);

    const grnQty = parseFloat(grn.grnRecQuantity);
    let greyReceivedh = '';
    if (!isNaN(grnQty)) {
      const usedByOtherRows = batchDetails.reduce((sum, r) => {
        if (r._key === row._key || r.rollNo !== rollNo) return sum;
        const mtrVal = parseFloat(r.mtr);
        return sum + (isNaN(mtrVal) ? 0 : mtrVal);
      }, 0);
      greyReceivedh = String(grnQty - usedByOtherRows);
      console.log(
        '[BatchCreation:CreateUI] Grey Received computed —',
        'grnRecQuantity:', grnQty,
        'already used by other rows on this roll:', usedByOtherRows,
        '-> greyReceivedh:', greyReceivedh,
      );
    }

    updateRowFields(row._key, {
      rollNo,
      poNo: grn.poNo ?? row.poNo,
      vendorId: grn.vendorId ?? row.vendorId,
      vendorName: grn.vendorName ?? '',
      vendorChalanNo: grn.vendorChalanNo ?? '',
      fabWidth: grn.fabWidth ?? '',
      grnRecDate: grn.grnRecDate ?? '',
      grnNo: grn.grnNo ?? '',
      greyReceivedh,
    });
  };

  // Changing Location/Fabric Type on an existing batch invalidates its saved
  // rows (Lot No options, GRN lookups, etc. are all scoped to the old
  // location/fabric), so on Edit confirm before applying the change and
  // wiping the batch-details table back to a single blank row.
  const confirmDiscardRowsThen = onConfirm => {
    Alert.alert(
      Constant.DefaultAlert_MSG,
      'Saved batch details will be discarded. Click OK to proceed.',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'OK',
          onPress: () => {
            onConfirm();
            set_batchDetails([emptyRow()]);
          },
        },
      ],
    );
  };

  const addRow = () => set_batchDetails(prev => [...prev, emptyRow()]);

  const removeRow = key => {
    set_batchDetails(prev => (prev.length > 1 ? prev.filter(r => r._key !== key) : prev));
  };

  const revertBatchName = row => {
    Alert.alert(Constant.DefaultAlert_MSG, 'Batch No already exists !!!');
    // Edit mode: fall back to the value this row was originally loaded
    // with, rather than clearing it — a brand-new row has none, so it
    // still clears to ''.
    updateRow(row._key, 'batchName', isEdit ? row.originalBatchName || '' : '');
  };

  const onBatchNameBlur = async row => {
    if (!row.batchName) return;

    // Unchanged from what this row was originally loaded with (edit mode) —
    // it's this row's own existing Batch No, not a duplicate. Skip the
    // server call entirely rather than relying on the backend to exclude
    // this row's own batchDetailsId, which it doesn't reliably do.
    const enteredName = row.batchName.trim().toLowerCase();
    if (isEdit && row.originalBatchName && enteredName === row.originalBatchName.trim().toLowerCase()) {
      console.log('[BatchCreation:CreateUI] checkBatchNo — unchanged from original value, skipping validation entirely');
      return;
    }

    // If this Batch No matches a sibling row already on this page, skip
    // validation entirely for this blur — no API call, no alert, no revert.
    const dupeOnThisPage = batchDetails.some(
      r => r._key !== row._key && r.batchName.trim().toLowerCase() === enteredName,
    );
    if (dupeOnThisPage) {
      console.log('[BatchCreation:CreateUI] checkBatchNo — duplicate found among rows on this page, skipping validation entirely');
      return;
    }

    console.log('[BatchCreation:CreateUI] checkBatchNo — batchName:', row.batchName, 'batchId:', isEdit ? row.batchDetailsId : 0);
    const exists = await props.checkBatchNo(
      row.batchName,
      isEdit ? row.batchDetailsId : 0,
    );
    console.log('[BatchCreation:CreateUI] checkBatchNo — exists:', exists);
    if (exists) {
      revertBatchName(row);
    }
  };

  const handleDateConfirm = date => {
    set_creationDate(formatDMY(date));
    set_isDatePickerVisible(false);
  };

  const buildPayload = saveFlag => {
    const payload = {
      locationId,
      fabricId,
      cottonD,
      polysD,
      desizeD,
      partyName,
      creationDate,
      dcNo,
      qualityNameh,
      greyShortage,
      weight,
      reedPick,
      fabricFlow,
      bioFinish,
      remazol,
      mercerise,
      lycra,
      rolltrolley,
      totalIssued,
      sample,
      bsr,
      deliveryAt,
      saveFlag,
      ...CHECKBOX_DEFAULTS,
      // The backend deliberately mirrors the web app's parsing bug-for-bug:
      // an empty string for a numeric field (mtr/greyReceivedh/mtrOld) hits
      // `new BigDecimal("")` server-side and throws a NumberFormatException
      // (500). So these three keys must be omitted entirely when there's no
      // real value, never sent as "".
      batchDetails: batchDetails.map(r => {
        const row = {
          batchName: r.batchName,
          poNo: r.poNo || 0,
          vendorId: r.vendorId || 0,
          noOfPieces: r.noOfPieces,
          rollNo: r.rollNo,
        };
        if (r.mtr !== '' && r.mtr !== undefined && r.mtr !== null) {
          row.mtr = r.mtr;
        }
        if (r.greyReceivedh !== '' && r.greyReceivedh !== undefined && r.greyReceivedh !== null) {
          row.greyReceivedh = r.greyReceivedh;
        }
        if (r.batchDetailsId) {
          row.batchDetailsId = r.batchDetailsId;
          if (r.mtrOld !== '' && r.mtrOld !== undefined && r.mtrOld !== null) {
            row.mtrOld = r.mtrOld;
          }
          row.rollNoh = r.rollNoh;
          row.lineItemId = r.lineItemId ?? 0;
        }
        return row;
      }),
    };
    return payload;
  };

  // Checked one at a time, in this order, so the user sees exactly which
  // mandatory field is missing rather than one generic message. Each entry's
  // `focus` runs after the alert is dismissed, scrolling to and "focusing"
  // (opening the picker / focusing the TextInput) that field so it's easy
  // to find.
  const validate = () => {
    const missing = [
      {
        label: 'Location',
        filled: !!locationId,
        focus: () => {
          scrollToField('location');
          locationFieldRef.current?.open();
        },
      },
      {
        label: 'Fabric Type',
        filled: !!fabricId,
        focus: () => {
          scrollToField('fabricType');
          fabricFieldRef.current?.open();
        },
      },
      {
        label: 'Creation Date',
        filled: !!creationDate,
        focus: () => {
          scrollToField('creationDate');
          set_isDatePickerVisible(true);
        },
      },
      {
        label: 'DC No',
        filled: !!dcNo,
        focus: () => dcNoFieldRef.current?.focus(),
      },
      {
        label: 'Fabric Process Flow',
        filled: !!fabricFlow,
        focus: () => {
          scrollToField('fabricFlow');
          fabricFlowFieldRef.current?.open();
        },
      },
      {
        label: 'Batch No',
        filled: batchDetails.every(r => !!r.batchName),
        focus: () => {
          scrollToField('batchDetails');
          const row = batchDetails.find(r => !r.batchName);
          if (row) batchNoInputRefs.current[row._key]?.focus();
        },
      },
      {
        label: 'Lot No',
        filled: batchDetails.every(r => !!r.rollNo),
        focus: () => {
          scrollToField('batchDetails');
          const row = batchDetails.find(r => !r.rollNo);
          if (row) lotNoFieldRefs.current[row._key]?.open();
        },
      },
      {
        label: 'MTR',
        message: 'MTR should be greater than 0',
        filled: batchDetails.every(r => parseFloat(r.mtr) > 0),
        focus: () => {
          scrollToField('batchDetails');
          const row = batchDetails.find(r => !(parseFloat(r.mtr) > 0));
          if (row) mtrInputRefs.current[row._key]?.focus();
        },
      },
    ].find(f => !f.filled);

    if (missing) {
      console.log('[BatchCreation:CreateUI] validate failed — missing field:', missing.label);
      Alert.alert(Constant.DefaultAlert_MSG, missing.message || `${missing.label} is mandatory`, [
        {text: 'OK', onPress: missing.focus},
      ]);
      return false;
    }
    return true;
  };

  const onSave = () => {
    console.log('[BatchCreation:CreateUI] Save pressed');
    if (!validate()) return;
    const payload = buildPayload(0);
    console.log('[BatchCreation:CreateUI] Save — payload:', JSON.stringify(payload));
    props.submit(payload);
  };

  const onSubmitPress = () => {
    console.log('[BatchCreation:CreateUI] Submit pressed');
    if (!validate()) return;
    set_confirmSubmitVisible(true);
  };

  const onSubmitConfirmed = () => {
    console.log('[BatchCreation:CreateUI] Submit confirmed');
    set_confirmSubmitVisible(false);
    const payload = buildPayload(1);
    console.log('[BatchCreation:CreateUI] Submit — payload:', JSON.stringify(payload));
    props.submit(payload);
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
          title={isView ? 'View Batch' : isEdit ? 'Edit Batch' : 'Create Batch'}
          backBtnAction={props.backBtnAction}
        />
      </View>

      <KeyboardAwareScrollView
        ref={scrollRef}
        enableOnAndroid={true}
        extraHeight={130}
        extraScrollHeight={130}
        showsVerticalScrollIndicator={false}
        style={{width: '100%', marginBottom: FOOTER_HEIGHT}}>
        <View style={{width: '90%', marginHorizontal: wp('5%'), paddingBottom: 30}}>
          <View style={{height: 15}} />

          {isView ? (
            <View style={styles.tabBar}>
              <TouchableOpacity
                style={[
                  styles.tabBtn,
                  activeTab === 'view' && [styles.tabBtnActive, {backgroundColor: colors.color2}],
                ]}
                onPress={() => set_activeTab('view')}>
                <Text style={[styles.tabBtnText, activeTab === 'view' && styles.tabBtnTextActive]}>
                  View
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.tabBtn,
                  activeTab === 'process' && [styles.tabBtnActive, {backgroundColor: colors.color2}],
                ]}
                onPress={() => set_activeTab('process')}>
                <Text style={[styles.tabBtnText, activeTab === 'process' && styles.tabBtnTextActive]}>
                  Production Process
                </Text>
              </TouchableOpacity>
            </View>
          ) : null}

          {!isView || activeTab === 'view' ? (
          <>
          <View onLayout={recordFieldY('location')}>
          <SelectField
            ref={locationFieldRef}
            label="Location"
            required
            value={locationId}
            options={locationOptions}
            disabled={isView}
            onSelect={id => {
              console.log('[BatchCreation:CreateUI] Location selected ->', id);
              const apply = () => {
                set_locationId(id);
                set_fabricId('');
              };
              if (isEdit && id !== locationId) {
                confirmDiscardRowsThen(apply);
              } else {
                apply();
              }
            }}
          />
          </View>
          <View onLayout={recordFieldY('fabricType')}>
          <SelectField
            ref={fabricFieldRef}
            label="Fabric Type"
            required
            value={fabricId}
            options={fabricOptions}
            disabled={isView || !locationId}
            placeholder={locationId ? 'Select...' : 'Select a location first'}
            onSelect={id => {
              console.log('[BatchCreation:CreateUI] Fabric selected ->', id);
              const apply = () => set_fabricId(id);
              if (isEdit && id !== fabricId) {
                confirmDiscardRowsThen(apply);
              } else {
                apply();
              }
            }}
          />
          </View>

          <TextField label="Cotton D" value={cottonD} onChangeText={set_cottonD} editable={!isView} />
          <TextField label="Polys D" value={polysD} onChangeText={set_polysD} editable={!isView} />
          <TextField label="Desize D" value={desizeD} onChangeText={set_desizeD} editable={!isView} />
          <TextField label="Party Name" value={partyName} onChangeText={set_partyName} editable={!isView} />

          <View style={styles.fieldWrap} onLayout={recordFieldY('creationDate')}>
            <Text style={styles.label}>
              Creation Date<Text style={styles.required}> *</Text>
            </Text>
            <TouchableOpacity
              style={[styles.inputBox, isView && styles.inputBoxDisabled]}
              disabled={isView}
              onPress={() => set_isDatePickerVisible(true)}>
              <Text style={creationDate ? styles.inputText : styles.inputPlaceholder}>
                {creationDate || 'dd/mm/yyyy'}
              </Text>
            </TouchableOpacity>
          </View>
          <DateTimePickerModal
            isVisible={isDatePickerVisible}
            mode="date"
            onConfirm={handleDateConfirm}
            onCancel={() => set_isDatePickerVisible(false)}
          />

          <TextField ref={dcNoFieldRef} label="DC No" required value={dcNo} onChangeText={set_dcNo} editable={!isView} />
          <TextField label="Quality Name" value={qualityNameh} onChangeText={set_qualityNameh} editable={!isView} />
          <TextField
            label="Grey Shortage"
            value={greyShortage}
            onChangeText={set_greyShortage}
            keyboardType="numeric"
            editable={!isView}
          />
          <TextField label="Weight" value={weight} onChangeText={set_weight} keyboardType="numeric" editable={!isView} />
          <TextField label="Reed and Pick" value={reedPick} onChangeText={set_reedPick} editable={!isView} />
          <View onLayout={recordFieldY('fabricFlow')}>
          <SelectField
            ref={fabricFlowFieldRef}
            label="Fabric Process Flow"
            required
            value={fabricFlow}
            options={fabricFlowOptions}
            disabled={isView}
            onSelect={set_fabricFlow}
          />
          </View>
          <TextField label="Bio Finish" value={bioFinish} onChangeText={set_bioFinish} editable={!isView} />
          <TextField label="Remazol" value={remazol} onChangeText={set_remazol} editable={!isView} />
          <TextField label="Mercerise" value={mercerise} onChangeText={set_mercerise} editable={!isView} />
          <TextField label="Lycra" value={lycra} onChangeText={set_lycra} editable={!isView} />
          <TextField label="Roll/Trolley" value={rolltrolley} onChangeText={set_rolltrolley} editable={!isView} />

          <Text style={[styles.sectionHeader, {borderLeftColor: colors.color2}]}>Folding and Packing Instruction</Text>
          <TextField label="Sample" value={sample} onChangeText={set_sample} editable={!isView} />
          <TextField label="BSR" value={bsr} onChangeText={set_bsr} editable={!isView} />
          <TextField label="Delivery At" value={deliveryAt} onChangeText={set_deliveryAt} editable={!isView} />

          <Text
            style={[styles.sectionHeader, {borderLeftColor: colors.color2}]}
            onLayout={recordFieldY('batchDetails')}>
            Batch Details
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator style={styles.tableScroll}>
            <View>
              <View style={styles.tableHeaderRow}>
                <Text style={[styles.tableHeaderCell, styles.colBatchNo]}>Batch No</Text>
                <Text style={[styles.tableHeaderCell, styles.colLotNo]}>Lot No</Text>
                <Text style={[styles.tableHeaderCell, styles.colGreyReceived]}>Grey Received</Text>
                <Text style={[styles.tableHeaderCell, styles.colPieces]}>No of Pieces</Text>
                <Text style={[styles.tableHeaderCell, styles.colMtr]}>MTR</Text>
                <Text style={[styles.tableHeaderCell, styles.colAction]}> </Text>
              </View>

              {tableRows.map(row => (
                <View key={row._key} style={styles.tableRow}>
                  <View style={[styles.tableCell, styles.colBatchNo]}>
                    <TextInput
                      ref={r => (batchNoInputRefs.current[row._key] = r)}
                      style={[styles.tableInputBox, styles.tableInputText, isView && styles.inputBoxDisabled]}
                      value={row.batchName}
                      onChangeText={v => updateRow(row._key, 'batchName', v)}
                      onBlur={() => onBatchNameBlur(row)}
                      editable={!isView}
                      placeholderTextColor="#999"
                    />
                  </View>
                  <View style={[styles.tableCell, styles.colLotNo]}>
                    {isView ? (
                      <Text style={styles.tablePlainText} numberOfLines={2}>
                        {row.rollNo || '-'}
                      </Text>
                    ) : (
                      <SelectField
                        ref={r => (lotNoFieldRefs.current[row._key] = r)}
                        compact
                        value={row.rollNo}
                        options={lotNoOptions}
                        disabled={!fabricId}
                        placeholder={fabricId ? 'Select...' : 'Select fabric first'}
                        onSelect={id => onLotNoSelect(row, id)}
                      />
                    )}
                  </View>
                  <View style={[styles.tableCell, styles.colGreyReceived]}>
                    <Text style={styles.tablePlainText} numberOfLines={1}>
                      {isView ? '' : row.greyReceivedh || row.greyReceivedh === 0 ? row.greyReceivedh : '-'}
                    </Text>
                  </View>
                  <View style={[styles.tableCell, styles.colPieces]}>
                    <TextInput
                      style={[styles.tableInputBox, styles.tableInputText, isView && styles.inputBoxDisabled]}
                      value={row.noOfPieces !== undefined && row.noOfPieces !== null ? String(row.noOfPieces) : ''}
                      onChangeText={v => updateRow(row._key, 'noOfPieces', v)}
                      keyboardType="numeric"
                      editable={!isView}
                    />
                  </View>
                  <View style={[styles.tableCell, styles.colMtr]}>
                    <TextInput
                      ref={r => (mtrInputRefs.current[row._key] = r)}
                      style={[styles.tableInputBox, styles.tableInputText, isView && styles.inputBoxDisabled]}
                      value={row.mtr !== undefined && row.mtr !== null ? String(row.mtr) : ''}
                      onChangeText={v => updateRow(row._key, 'mtr', v)}
                      keyboardType="numeric"
                      editable={!isView}
                    />
                  </View>
                  <View style={[styles.tableCell, styles.colAction]}>
                    {!isView && batchDetails.length > 1 ? (
                      <TouchableOpacity onPress={() => removeRow(row._key)}>
                        <Text style={styles.removeRowText}>✕</Text>
                      </TouchableOpacity>
                    ) : null}
                  </View>
                </View>
              ))}

              <View style={[styles.tableRow, styles.tableTotalRow]}>
                <Text style={[styles.tableTotalLabel, styles.colTotalLabel]}>Total Issued</Text>
                <Text style={[styles.tableTotalValue, styles.colMtr]}>{totalIssued}</Text>
                <View style={styles.colAction} />
              </View>
            </View>
          </ScrollView>

          {!isView ? (
            <TouchableOpacity style={styles.addRowBtn} onPress={addRow}>
              <Text style={styles.addRowBtnText}>+ Add Row</Text>
            </TouchableOpacity>
          ) : null}

          {isView ? (
            viewVendorSummary ? (
              <View style={{marginBottom: 14}}>
                <View style={styles.grnInfoBox}>
                  {viewVendorSummary.vendorName ? (
                    <Text style={styles.grnInfoText}>Vendor Name: {viewVendorSummary.vendorName}</Text>
                  ) : null}
                  {viewVendorSummary.vendorChalanNo ? (
                    <Text style={styles.grnInfoText}>Vendor Challan No: {viewVendorSummary.vendorChalanNo}</Text>
                  ) : null}
                  {viewVendorSummary.fabWidth ? (
                    <Text style={styles.grnInfoText}>Grey Width: {viewVendorSummary.fabWidth}</Text>
                  ) : null}
                  {viewVendorSummary.grnRecDate ? (
                    <Text style={styles.grnInfoText}>Grey Date: {viewVendorSummary.grnRecDate}</Text>
                  ) : null}
                </View>
              </View>
            ) : null
          ) : batchDetails.some(r => r.vendorName || r.vendorChalanNo || r.fabWidth || r.grnRecDate) ? (
            <View style={{marginBottom: 14}}>
              {batchDetails.map((row, index) =>
                row.vendorName || row.vendorChalanNo || row.fabWidth || row.grnRecDate ? (
                  <View key={row._key} style={styles.grnInfoBox}>
                    <Text style={[styles.grnInfoText, {fontWeight: '700'}]}>
                      Row {index + 1}{row.batchName ? ` (${row.batchName})` : ''}
                    </Text>
                    {row.vendorName ? (
                      <Text style={styles.grnInfoText}>Vendor Name: {row.vendorName}</Text>
                    ) : null}
                    {row.vendorChalanNo ? (
                      <Text style={styles.grnInfoText}>Vendor Challan No: {row.vendorChalanNo}</Text>
                    ) : null}
                    {row.fabWidth ? (
                      <Text style={styles.grnInfoText}>Grey Width: {row.fabWidth}</Text>
                    ) : null}
                    {row.grnRecDate ? (
                      <Text style={styles.grnInfoText}>Grey Date: {row.grnRecDate}</Text>
                    ) : null}
                  </View>
                ) : null,
              )}
            </View>
          ) : null}
          </>
          ) : null}

          {isView && activeTab === 'process' ? (
            <View>
              {productionProcessSteps.length === 0 ? (
                <Text style={styles.noRecordText}>No production process configured</Text>
              ) : (
                productionProcessSteps.map((step, index) => (
                  <View
                    key={step.id ?? index}
                    style={[styles.processRow, step.newstts > 0 && styles.processRowDone]}>
                    <Text style={styles.processOrder}>{step.menuOrder ?? index + 1}</Text>
                    <Text style={styles.processName}>{step.menuName}</Text>
                    {step.newstts > 0 ? (
                      <Text style={styles.processDoneBadge}>Done</Text>
                    ) : null}
                  </View>
                ))
              )}
            </View>
          ) : null}
        </View>
      </KeyboardAwareScrollView>

      <View style={[CommonStyles.bottomViewComponentStyle1, styles.footerContainer]}>
        <View style={styles.bottomBar}>
          {!isView ? (
            <>
              <TouchableOpacity style={[styles.actionBtn, styles.saveBtn]} onPress={onSave}>
                <Text style={styles.actionBtnText}>Save</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.actionBtn, styles.submitBtn]} onPress={onSubmitPress}>
                <Text style={styles.actionBtnText}>Submit</Text>
              </TouchableOpacity>
            </>
          ) : null}
          <TouchableOpacity style={[styles.actionBtn, styles.backBtn]} onPress={props.backBtnAction}>
            <Text style={styles.actionBtnText}>Back</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Modal visible={confirmSubmitVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.confirmCard}>
            <Text style={styles.confirmTitle}>Submit Batch</Text>
            <Text style={styles.confirmMessage}>
              Are you sure want to submit this batch?
            </Text>
            <View style={styles.confirmActions}>
              <TouchableOpacity
                style={[styles.confirmBtn, {backgroundColor: '#E7E7E9'}]}
                onPress={() => set_confirmSubmitVisible(false)}>
                <Text style={styles.confirmBtnTextDark}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.confirmBtn, {backgroundColor: '#2979ff'}]}
                onPress={onSubmitConfirmed}>
                <Text style={styles.confirmBtnText}>Submit</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {props.isPopUp ? (
        <View style={CommonStyles.customPopUpStyle}>
          <AlertComponent
            header={props.popUpAlert}
            message={props.popUpMessage}
            isLeftBtnEnable={props.isPopupLeft}
            isRightBtnEnable={true}
            leftBtnTilte={'NO'}
            rightBtnTilte={props.popUpRBtnTitle}
            popUpRightBtnAction={props.popOkBtnAction}
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

export default CreateBatchCreationUI;

const styles = StyleSheet.create({
  fieldWrap: {
    width: '100%',
    marginBottom: 14,
  },
  label: {
    fontSize: 13,
    color: '#555',
    fontWeight: '600',
    marginBottom: 6,
  },
  required: {
    color: '#e53935',
  },
  inputBox: {
    width: '100%',
    minHeight: hp('6%'),
    borderWidth: 1,
    borderColor: '#dedede',
    borderRadius: 8,
    backgroundColor: '#fff',
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  inputBoxDisabled: {
    backgroundColor: '#f0f0f0',
  },
  textInputInner: {
    color: '#000',
    fontSize: 14,
  },
  inputText: {
    color: '#000',
    fontSize: 14,
  },
  inputPlaceholder: {
    color: '#999',
    fontSize: 14,
  },
  errorText: {
    color: '#e53935',
    fontSize: 12,
    marginTop: 4,
  },
  sectionHeader: {
    fontSize: 15,
    fontWeight: '700',
    color: '#333',
    marginTop: 10,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#2979ff',
    paddingLeft: 8,
  },
  removeRowText: {
    color: '#e53935',
    fontWeight: '600',
    fontSize: 16,
  },
  tableScroll: {
    marginBottom: 8,
  },
  tableHeaderRow: {
    flexDirection: 'row',
    backgroundColor: '#eef1f6',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  tableHeaderCell: {
    fontWeight: '700',
    fontSize: 12,
    color: '#333',
    paddingVertical: 10,
    paddingHorizontal: 6,
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: '#eee',
    backgroundColor: '#fff',
  },
  tableCell: {
    paddingHorizontal: 4,
    paddingVertical: 6,
    justifyContent: 'center',
  },
  tableInputBox: {
    minHeight: hp('5.5%'),
    borderWidth: 1,
    borderColor: '#dedede',
    borderRadius: 6,
    backgroundColor: '#fff',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  tableInputText: {
    color: '#000',
    fontSize: 13,
  },
  tablePlainText: {
    fontSize: 13,
    color: '#333',
    textAlign: 'center',
  },
  tableTotalRow: {
    borderBottomWidth: 0,
    backgroundColor: '#f5f7fb',
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
  tableTotalLabel: {
    fontWeight: '700',
    fontSize: 13,
    color: '#333',
    textAlign: 'right',
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  tableTotalValue: {
    fontWeight: '700',
    fontSize: 13,
    color: '#2979ff',
    textAlign: 'center',
    paddingHorizontal: 4,
  },
  colBatchNo: {
    width: 140,
  },
  colLotNo: {
    width: 130,
  },
  colGreyReceived: {
    width: 110,
    alignItems: 'center',
  },
  colPieces: {
    width: 100,
  },
  colMtr: {
    width: 90,
  },
  colAction: {
    width: 40,
    alignItems: 'center',
  },
  colTotalLabel: {
    width: 140 + 130 + 110 + 100,
  },
  grnInfoBox: {
    marginTop: 4,
    padding: 8,
    borderRadius: 6,
    backgroundColor: '#eef3fb',
  },
  grnInfoText: {
    fontSize: 12,
    color: '#455a75',
    marginBottom: 2,
  },
  tabBar: {
    flexDirection: 'row',
    marginBottom: 16,
    borderRadius: 10,
    backgroundColor: '#eef1f6',
    padding: 4,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  tabBtnActive: {
    backgroundColor: '#2979ff',
  },
  tabBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#555',
  },
  tabBtnTextActive: {
    color: '#fff',
  },
  noRecordText: {
    textAlign: 'center',
    color: '#999',
    fontSize: 14,
    marginTop: 20,
  },
  processRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
    marginBottom: 8,
  },
  processRowDone: {
    backgroundColor: '#e3f6e5',
  },
  processOrder: {
    width: 28,
    fontSize: 13,
    fontWeight: '700',
    color: '#555',
  },
  processName: {
    flex: 1,
    fontSize: 14,
    color: '#000',
  },
  processDoneBadge: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2e7d32',
  },
  addRowBtn: {
    alignSelf: 'flex-start',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#e8f0ff',
    marginBottom: 10,
  },
  addRowBtnText: {
    color: '#2979ff',
    fontWeight: '700',
  },
  footerContainer: {
    height: FOOTER_HEIGHT,
  },
  bottomBar: {
    width: '100%',
    height: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  // Matches the footer button sizing on GRN Checking - Fabric
  // (GrnCheckingFabricUI.js bottomBtn/buttonText) rather than a
  // screen-height-relative height.
  actionBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 3,
  },
  saveBtn: {
    backgroundColor: '#607d8b',
  },
  submitBtn: {
    backgroundColor: '#2979ff',
  },
  backBtn: {
    backgroundColor: '#757575',
  },
  actionBtnText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 12,
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCard: {
    width: '85%',
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingVertical: 8,
  },
  modalTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#333',
    paddingHorizontal: 12,
    paddingTop: 4,
    paddingBottom: 8,
  },
  modalSearchInput: {
    marginHorizontal: 12,
    marginBottom: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#dedede',
    borderRadius: 8,
    color: '#000',
    fontSize: 14,
  },
  modalOption: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  modalOptionText: {
    fontSize: 15,
    color: '#000',
  },
  modalEmptyText: {
    padding: 20,
    textAlign: 'center',
    color: '#999',
  },
  confirmCard: {
    width: '85%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
  },
  confirmTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 10,
    color: '#000',
  },
  confirmMessage: {
    fontSize: 14,
    color: '#444',
    marginBottom: 20,
  },
  confirmActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  confirmBtn: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 8,
    marginLeft: 10,
  },
  confirmBtnText: {
    color: '#fff',
    fontWeight: '700',
  },
  confirmBtnTextDark: {
    color: '#000',
    fontWeight: '700',
  },
});
