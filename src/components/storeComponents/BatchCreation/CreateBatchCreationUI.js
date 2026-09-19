import React, {useState, useEffect, useMemo, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Modal,
  FlatList,
  Alert,
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
import CustomCheckBox from './../../../utils/commonComponents/CustomCheckBox';
import * as Constant from './../../../utils/constants/constant';

// Matches the 10 boolean checkboxes on the web Create/Edit form — sent as
// 1 when checked, omitted otherwise. See report §4.
const CHECKBOX_FIELDS = [
  {key: 'singeing', label: 'Singeing'},
  {key: 'hset', label: 'H-Set'},
  {key: 'kitty', label: 'Kitty'},
  {key: 'zerozero', label: 'Zero-Zero'},
  {key: 'semiStarch', label: 'Semi Starch'},
  {key: 'crossDyg', label: 'Cross Dyeing'},
  {key: 'singleDyg', label: 'Single Dyeing'},
  {key: 'solidDyg', label: 'Solid Dyeing'},
  {key: 'cationicDyg', label: 'Cationic Dyeing'},
  {key: 'shiner', label: 'Shiner'},
];

let rowKeySeq = 0;
const newRowKey = () => `row_${Date.now()}_${rowKeySeq++}`;

const emptyRow = () => ({
  _key: newRowKey(),
  batchName: '',
  poNo: 0,
  vendorId: 0,
  noOfPieces: '',
  rollNo: '',
  mtr: '',
  greyReceivedh: '',
});

const mapToOptions = map =>
  Object.entries(map || {}).map(([id, label]) => ({id: String(id), label: String(label)}));

const pad2 = n => String(n).padStart(2, '0');
const formatDMY = date =>
  `${pad2(date.getDate())}/${pad2(date.getMonth() + 1)}/${date.getFullYear()}`;

// Best-effort mapping from the `edit` API's viewDTO (a serialized
// BatchCreation entity) into this form's field names. The exact JSON key
// casing hasn't been verified against a live server yet (report §11 — the
// backend branch isn't deployed anywhere), so this reads a couple of
// plausible aliases per field and falls back to blank instead of throwing.
const mapViewDTOToForm = dto => {
  if (!dto) return null;
  const details = dto.batchDetails || dto.batchCreationDetails || [];
  return {
    locationId: dto.locationId ?? dto.bcLocationId ?? '',
    fabricId: dto.fabricId ?? '',
    cottonD: dto.cottonD ?? '',
    polysD: dto.polysD ?? '',
    desizeD: dto.desizeD ?? '',
    partyName: dto.partyName ?? '',
    checkboxes: CHECKBOX_FIELDS.reduce((acc, f) => {
      acc[f.key] = Number(dto[f.key]) === 1;
      return acc;
    }, {}),
    creationDate: dto.creationDate ?? '',
    dcNo: dto.dcNo ?? '',
    qualityNameh: dto.qualityNameh ?? dto.qualityName ?? '',
    greyShortage: dto.greyShortage ?? '',
    weight: dto.weight ?? '',
    reedPick: dto.reedPick ?? '',
    fabricFlow: dto.fabricFlow ?? '',
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
          poNo: d.poNo ?? 0,
          vendorId: d.vendorId ?? 0,
          noOfPieces: d.noOfPieces ?? '',
          rollNo: d.rollNo ?? d.lotNo ?? '',
          rollNoh: d.rollNo ?? d.lotNo ?? '',
          mtr: d.mtr ?? '',
          mtrOld: d.mtr ?? '',
          greyReceivedh: d.greyReceivedh ?? '',
          lineItemId: d.lineItemId ?? 0,
        }))
      : [emptyRow()],
  };
};

const SelectField = ({label, required, value, options, onSelect, disabled, placeholder}) => {
  const [open, set_open] = useState(false);
  const selected = options.find(o => o.id === String(value));
  return (
    <View style={styles.fieldWrap}>
      <Text style={styles.label}>
        {label}
        {required ? <Text style={styles.required}> *</Text> : null}
      </Text>
      <TouchableOpacity
        style={[styles.inputBox, disabled && styles.inputBoxDisabled]}
        disabled={disabled}
        onPress={() => set_open(true)}>
        <Text style={selected ? styles.inputText : styles.inputPlaceholder} numberOfLines={1}>
          {selected ? selected.label : disabled ? '—' : placeholder || 'Select...'}
        </Text>
      </TouchableOpacity>
      <Modal visible={open} transparent animationType="fade" onRequestClose={() => set_open(false)}>
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => set_open(false)}>
          <View style={styles.modalCard}>
            <FlatList
              data={options}
              keyExtractor={o => o.id}
              style={{maxHeight: hp('50%')}}
              renderItem={({item}) => (
                <TouchableOpacity
                  style={styles.modalOption}
                  onPress={() => {
                    onSelect(item.id);
                    set_open(false);
                  }}>
                  <Text style={styles.modalOptionText}>{item.label}</Text>
                </TouchableOpacity>
              )}
              ListEmptyComponent={<Text style={styles.modalEmptyText}>No options</Text>}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const TextField = ({label, required, value, onChangeText, onBlur, keyboardType, editable = true, error}) => (
  <View style={styles.fieldWrap}>
    <Text style={styles.label}>
      {label}
      {required ? <Text style={styles.required}> *</Text> : null}
    </Text>
    <TextInput
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
);

const CreateBatchCreationUI = ({route, ...props}) => {
  const isEdit = props.mode === 'edit';

  const [locationId, set_locationId] = useState('');
  const [fabricId, set_fabricId] = useState('');
  const [cottonD, set_cottonD] = useState('');
  const [polysD, set_polysD] = useState('');
  const [desizeD, set_desizeD] = useState('');
  const [partyName, set_partyName] = useState('');
  const [checkboxes, set_checkboxes] = useState(
    CHECKBOX_FIELDS.reduce((acc, f) => ({...acc, [f.key]: false}), {}),
  );
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
  const [batchNoConflicts, set_batchNoConflicts] = useState({});
  const [confirmSubmitVisible, set_confirmSubmitVisible] = useState(false);

  // Location -> Fabric Type -> Lot No cascade (report §4 "Dropdown data sourcing")
  useEffect(() => {
    if (locationId) props.loadFabricsByLocation(locationId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locationId]);

  useEffect(() => {
    if (fabricId) props.loadLotNos(fabricId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fabricId]);

  useEffect(() => {
    if (props.defaultFlowId !== undefined && !fabricFlow) {
      set_fabricFlow(String(props.defaultFlowId));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.defaultFlowId]);

  // Prefill from the `edit` API response once it lands.
  useEffect(() => {
    if (!isEdit || !props.editViewDTO) return;
    const form = mapViewDTOToForm(props.editViewDTO);
    if (!form) return;
    set_locationId(String(form.locationId || ''));
    set_fabricId(String(form.fabricId || ''));
    set_cottonD(form.cottonD);
    set_polysD(form.polysD);
    set_desizeD(form.desizeD);
    set_partyName(form.partyName);
    set_checkboxes(form.checkboxes);
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

  const locationOptions = useMemo(() => mapToOptions(props.locationsMap), [props.locationsMap]);
  const fabricOptions = useMemo(() => mapToOptions(props.fabricsMap), [props.fabricsMap]);
  const fabricFlowOptions = useMemo(
    () => mapToOptions(props.fabricFlowConfigMap),
    [props.fabricFlowConfigMap],
  );
  const lotNoOptions = useMemo(() => mapToOptions(props.lotNosMap), [props.lotNosMap]);

  const toggleCheckbox = key => {
    set_checkboxes(prev => ({...prev, [key]: !prev[key]}));
  };

  const updateRow = (key, field, value) => {
    set_batchDetails(prev =>
      prev.map(r => (r._key === key ? {...r, [field]: value} : r)),
    );
  };

  const addRow = () => set_batchDetails(prev => [...prev, emptyRow()]);

  const removeRow = key => {
    set_batchDetails(prev => (prev.length > 1 ? prev.filter(r => r._key !== key) : prev));
    set_batchNoConflicts(prev => {
      const next = {...prev};
      delete next[key];
      return next;
    });
  };

  const onBatchNameBlur = async row => {
    if (!row.batchName) return;
    const exists = await props.checkBatchNo(
      row.batchName,
      isEdit ? row.batchDetailsId : 0,
    );
    set_batchNoConflicts(prev => ({...prev, [row._key]: exists}));
  };

  const hasConflict = Object.values(batchNoConflicts).some(Boolean);

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
      batchDetails: batchDetails.map(r => {
        const row = {
          batchName: r.batchName,
          poNo: r.poNo || 0,
          vendorId: r.vendorId || 0,
          noOfPieces: r.noOfPieces,
          rollNo: r.rollNo,
          mtr: r.mtr,
          greyReceivedh: r.greyReceivedh,
        };
        if (r.batchDetailsId) {
          row.batchDetailsId = r.batchDetailsId;
          row.mtrOld = r.mtrOld;
          row.rollNoh = r.rollNoh;
          row.lineItemId = r.lineItemId ?? 0;
        }
        return row;
      }),
    };
    CHECKBOX_FIELDS.forEach(f => {
      if (checkboxes[f.key]) payload[f.key] = 1;
    });
    return payload;
  };

  const validate = () => {
    if (!locationId || !fabricId || !creationDate || !dcNo || !fabricFlow) {
      Alert.alert(Constant.DefaultAlert_MSG, Constant.validate_Fields_Msg);
      return false;
    }
    if (hasConflict) {
      Alert.alert(Constant.DefaultAlert_MSG, 'One of the Batch Nos already exists.');
      return false;
    }
    return true;
  };

  const onSave = () => {
    if (!validate()) return;
    props.submit(buildPayload(0));
  };

  const onSaveAndNew = () => {
    if (!validate()) return;
    props.submit(buildPayload(2)).then(ok => {
      if (ok) {
        set_batchDetails([emptyRow()]);
        set_batchNoConflicts({});
      }
    });
  };

  const onSubmitPress = () => {
    if (!validate()) return;
    set_confirmSubmitVisible(true);
  };

  const onSubmitConfirmed = () => {
    set_confirmSubmitVisible(false);
    props.submit(buildPayload(1));
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
          title={isEdit ? 'Edit Batch' : 'Create Batch'}
          backBtnAction={props.backBtnAction}
        />
      </View>

      <KeyboardAwareScrollView
        enableOnAndroid={true}
        extraHeight={130}
        extraScrollHeight={130}
        showsVerticalScrollIndicator={false}
        style={{width: '100%', marginBottom: hp('12%')}}>
        <View style={{width: '90%', marginHorizontal: wp('5%'), paddingBottom: 30}}>
          <View style={{height: 15}} />

          <SelectField
            label="Location"
            required
            value={locationId}
            options={locationOptions}
            onSelect={id => {
              set_locationId(id);
              set_fabricId('');
            }}
          />
          <SelectField
            label="Fabric Type"
            required
            value={fabricId}
            options={fabricOptions}
            disabled={!locationId}
            placeholder={locationId ? 'Select...' : 'Select a location first'}
            onSelect={set_fabricId}
          />

          <TextField label="Cotton D" value={cottonD} onChangeText={set_cottonD} />
          <TextField label="Polys D" value={polysD} onChangeText={set_polysD} />
          <TextField label="Desize D" value={desizeD} onChangeText={set_desizeD} />
          <TextField label="Party Name" value={partyName} onChangeText={set_partyName} />

          <Text style={styles.sectionHeader}>Fabric Treatment</Text>
          <View style={styles.checkboxGrid}>
            {CHECKBOX_FIELDS.map(f => (
              <View key={f.key} style={styles.checkboxItem}>
                <CustomCheckBox
                  isChecked={checkboxes[f.key]}
                  onToggle={() => toggleCheckbox(f.key)}
                />
                <Text style={styles.checkboxLabel}>{f.label}</Text>
              </View>
            ))}
          </View>

          <View style={styles.fieldWrap}>
            <Text style={styles.label}>
              Creation Date<Text style={styles.required}> *</Text>
            </Text>
            <TouchableOpacity
              style={styles.inputBox}
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

          <TextField label="DC No" required value={dcNo} onChangeText={set_dcNo} />
          <TextField label="Quality Name" value={qualityNameh} onChangeText={set_qualityNameh} />
          <TextField
            label="Grey Shortage"
            value={greyShortage}
            onChangeText={set_greyShortage}
            keyboardType="numeric"
          />
          <TextField label="Weight" value={weight} onChangeText={set_weight} keyboardType="numeric" />
          <TextField label="Reed and Pick" value={reedPick} onChangeText={set_reedPick} />
          <SelectField
            label="Fabric Process Flow"
            required
            value={fabricFlow}
            options={fabricFlowOptions}
            onSelect={set_fabricFlow}
          />
          <TextField label="Bio Finish" value={bioFinish} onChangeText={set_bioFinish} />
          <TextField label="Remazol" value={remazol} onChangeText={set_remazol} />
          <TextField label="Mercerise" value={mercerise} onChangeText={set_mercerise} />
          <TextField label="Lycra" value={lycra} onChangeText={set_lycra} />
          <TextField label="Roll/Trolley" value={rolltrolley} onChangeText={set_rolltrolley} />
          <TextField label="Total Issued" value={totalIssued} editable={false} />

          <Text style={styles.sectionHeader}>Folding and Packing Instruction</Text>
          <TextField label="Sample" value={sample} onChangeText={set_sample} />
          <TextField label="BSR" value={bsr} onChangeText={set_bsr} />
          <TextField label="Delivery At" value={deliveryAt} onChangeText={set_deliveryAt} />

          <Text style={styles.sectionHeader}>Batch Details</Text>
          {batchDetails.map((row, index) => (
            <View key={row._key} style={styles.rowCard}>
              <View style={styles.rowCardHeader}>
                <Text style={styles.rowCardTitle}>Row {index + 1}</Text>
                {batchDetails.length > 1 ? (
                  <TouchableOpacity onPress={() => removeRow(row._key)}>
                    <Text style={styles.removeRowText}>Remove</Text>
                  </TouchableOpacity>
                ) : null}
              </View>
              <TextField
                label="Batch No"
                required
                value={row.batchName}
                onChangeText={v => updateRow(row._key, 'batchName', v)}
                onBlur={() => onBatchNameBlur(row)}
                error={batchNoConflicts[row._key] ? 'This Batch No already exists' : null}
              />
              <TextField
                label="No of Pieces"
                value={row.noOfPieces}
                onChangeText={v => updateRow(row._key, 'noOfPieces', v)}
                keyboardType="numeric"
              />
              <SelectField
                label="Lot No"
                value={row.rollNo}
                options={lotNoOptions}
                disabled={!fabricId}
                placeholder={fabricId ? 'Select...' : 'Select a fabric type first'}
                onSelect={id => updateRow(row._key, 'rollNo', id)}
              />
              <TextField
                label="MTR"
                value={row.mtr}
                onChangeText={v => updateRow(row._key, 'mtr', v)}
                keyboardType="numeric"
              />
              <TextField
                label="Grey Received"
                value={row.greyReceivedh}
                onChangeText={v => updateRow(row._key, 'greyReceivedh', v)}
                keyboardType="numeric"
              />
            </View>
          ))}
          <TouchableOpacity style={styles.addRowBtn} onPress={addRow}>
            <Text style={styles.addRowBtnText}>+ Add Row</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAwareScrollView>

      <View style={CommonStyles.bottomViewComponentStyle1}>
        <View style={styles.bottomBar}>
          <TouchableOpacity style={[styles.actionBtn, styles.saveBtn]} onPress={onSave}>
            <Text style={styles.actionBtnText}>Save</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionBtn, styles.submitBtn]} onPress={onSubmitPress}>
            <Text style={styles.actionBtnText}>Submit</Text>
          </TouchableOpacity>
          {!isEdit ? (
            <TouchableOpacity style={[styles.actionBtn, styles.saveNewBtn]} onPress={onSaveAndNew}>
              <Text style={styles.actionBtnText}>Save & New</Text>
            </TouchableOpacity>
          ) : null}
        </View>
      </View>

      <Modal visible={confirmSubmitVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.confirmCard}>
            <Text style={styles.confirmTitle}>Submit Batch</Text>
            <Text style={styles.confirmMessage}>
              Submitting locks this batch for editing and adds it to available stock. Continue?
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
  checkboxGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  checkboxItem: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '50%',
    marginBottom: 12,
  },
  checkboxLabel: {
    fontSize: 13,
    color: '#333',
  },
  rowCard: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#e2e2e2',
    borderRadius: 10,
    padding: 12,
    marginBottom: 14,
    backgroundColor: '#fafafa',
  },
  rowCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  rowCardTitle: {
    fontWeight: '700',
    color: '#333',
  },
  removeRowText: {
    color: '#e53935',
    fontWeight: '600',
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
  bottomBar: {
    width: '100%',
    height: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  actionBtn: {
    flex: 1,
    height: hp('7%'),
    borderRadius: hp('0.5%'),
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5,
  },
  saveBtn: {
    backgroundColor: '#607d8b',
  },
  submitBtn: {
    backgroundColor: '#2979ff',
  },
  saveNewBtn: {
    backgroundColor: '#4caf50',
  },
  actionBtnText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 13,
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
