import React, {useState, useContext, useEffect} from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  LayoutAnimation,
  Platform,
  UIManager,
  Image,
} from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import * as Constant from '../../../utils/constants/constant';
import CommonStyles from '../../../utils/commonStyles/commonStyles';
import HeaderComponent from '../../../utils/commonComponents/headerComponent';
import LoaderComponent from '../../../utils/commonComponents/loaderComponent';
import AlertComponent from '../../../utils/commonComponents/alertComponent';
import AiUploadButton from '../AiUpload/AiUploadButton';
import GrnAlertHost from '../common/GrnAlertHost';
import {ColorContext} from '../../colorTheme/colorTheme';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabled) {
  UIManager.setLayoutAnimationEnabled(true);
}

const animateNext = () => LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

const fmt = v => (v === null || v === undefined || v === '' ? '-' : String(v));

const STATUS_COLORS = {DRAFT: '#757575', SUBMITTED: '#F9A825', APPROVED: '#66BB6A', 'NOT RECEIVED': '#9E9E9E'};
const statusColor = status => STATUS_COLORS[status] || STATUS_COLORS.DRAFT;

// Same quantity display rounding as GrnCheckingFabricUI.js's fmtNum: round
// to 2 decimals, drop the hundredths digit if it's 0, drop the tenths digit
// too if that's also 0. Read-only display only, never an editable input.
const fmtNum = v => {
  if (v === null || v === undefined || v === '') return '-';
  const num = Number(v);
  if (isNaN(num)) return '-';
  const [intPart, decPart] = (Math.round(num * 100) / 100).toFixed(2).split('.');
  if (decPart[1] !== '0') return `${intPart}.${decPart}`;
  if (decPart[0] !== '0') return `${intPart}.${decPart[0]}`;
  return intPart;
};

// A row is locked (shown as NOT RECEIVED) whenever totalReceivedQty <= 0,
// regardless of its real status -- there's nothing real to check against
// yet (business-rules-and-flows.md's "third quasi-state" for RM).
const RmRow = ({item, onUpdateField, onSaveDraft}) => {
  const notReceived = !(item.totalReceivedQty > 0);
  const locked = notReceived || item.status !== 'DRAFT';
  const statusLabel = notReceived ? 'NOT RECEIVED' : item.status;
  // Computed live from the on-screen fields instead of trusting
  // item.differenceQty -- that field only gets refreshed from the server
  // on save-draft (onBlur), so typing a new Checked/Damage Qty showed the
  // stale difference until the field lost focus. Mirrors the exact
  // formula the server uses (openapi.yaml's GrnCheckingRmItem.differenceQty:
  // receivedQty - checkedQty - alreadyCheckedQty - damageQty).
  const liveDifference =
    (Number(item.totalReceivedQty) || 0) -
    (Number(item.checkedQty) || 0) -
    (Number(item.alreadyCheckedQty) || 0) -
    (Number(item.damageQty) || 0);
  const diffOk = liveDifference >= 0;

  return (
    <View style={styles.row}>
      <View style={styles.rowHeader}>
        <View style={styles.rowTitleCol}>
          <Text style={styles.rowTitle}>{item.itemDescription || `Line ${item.poLineitemId}`}</Text>
          <Text style={styles.rowCode}>Code: {fmt(item.itemCode)}</Text>
        </View>
        <View style={[styles.statusPill, {backgroundColor: `${statusColor(statusLabel)}1F`}]}>
          <Text style={[styles.statusPillText, {color: statusColor(statusLabel)}]}>{statusLabel}</Text>
        </View>
      </View>

      <View style={styles.rowDivider} />

      <View style={styles.fieldsBox}>
        <View style={styles.fieldsRow}>
          <View style={styles.field}>
            <Text style={styles.rmFieldLabel}>UOM</Text>
            <Text style={styles.rmFieldValue}>{fmt(item.uom)}</Text>
          </View>
          <View style={styles.field}>
            <Text style={styles.rmFieldLabel}>Order Qty</Text>
            <Text style={styles.rmFieldValue}>{fmtNum(item.orderQty)}</Text>
          </View>
          <View style={styles.field}>
            <Text style={styles.rmFieldLabel}>Received Qty</Text>
            <Text style={styles.rmFieldValue}>{fmtNum(item.totalReceivedQty)}</Text>
          </View>
        </View>
        <View style={[styles.fieldsRow, styles.fieldsRowLast]}>
          <View style={styles.field}>
            <Text style={styles.rmFieldLabel}>Already Checked</Text>
            <Text style={styles.rmFieldValue}>{fmtNum(item.alreadyCheckedQty)}</Text>
          </View>
          <View style={styles.field}>
            <Text style={styles.rmFieldLabel}>Difference</Text>
            <View style={[styles.diffChip, diffOk ? styles.diffChipOk : styles.diffChipBad]}>
              <Text style={[styles.diffChipText, diffOk ? styles.diffChipTextOk : styles.diffChipTextBad]}>
                {fmtNum(liveDifference)}
              </Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.inputsRow}>
        <View style={styles.inputCol}>
          <Text style={styles.inputLabel}>Checked Qty</Text>
          <TextInput
            style={[styles.input, locked && styles.inputDisabled]}
            editable={!locked}
            keyboardType="numeric"
            placeholder="0"
            placeholderTextColor="#999"
            value={item.checkedQty === null || item.checkedQty === undefined ? '' : String(item.checkedQty)}
            onChangeText={v => onUpdateField('checkedQty', v === '' ? null : Number(v))}
            onBlur={() => !locked && onSaveDraft(item)}
          />
        </View>
        <View style={styles.inputCol}>
          <Text style={styles.inputLabel}>Damage Qty</Text>
          <TextInput
            style={[styles.input, locked && styles.inputDisabled]}
            editable={!locked}
            keyboardType="numeric"
            placeholder="0"
            placeholderTextColor="#999"
            value={item.damageQty === null || item.damageQty === undefined ? '' : String(item.damageQty)}
            onChangeText={v => onUpdateField('damageQty', v === '' ? null : Number(v))}
            onBlur={() => !locked && onSaveDraft(item)}
          />
        </View>
      </View>

      {item.status === 'APPROVED' && item.grnNo ? <Text style={styles.grnLink}>GRN No: {item.grnNo}</Text> : null}
    </View>
  );
};

const GrnCheckingRmUI = props => {
  const {colors} = useContext(ColorContext);
  const [refreshing, set_refreshing] = useState(false);
  const [vendorOpen, set_vendorOpen] = useState(true);
  const [poDetailsOpen, set_poDetailsOpen] = useState(true);
  const [remarks, set_remarks] = useState(props.header?.remarks || '');
  const [checkingDate, set_checkingDate] = useState(props.header?.checkingDate || '');
  const [isDatePickerVisible, set_isDatePickerVisible] = useState(false);

  useEffect(() => {
    if (props.header) {
      set_remarks(props.header.remarks || '');
      set_checkingDate(props.header.checkingDate || '');
    }
  }, [props.header]);

  const onRefresh = async () => {
    set_refreshing(true);
    await props.onRefresh();
    set_refreshing(false);
  };

  return (
    <View style={CommonStyles.mainComponentViewStyle}>
      <GrnAlertHost />
      <View style={CommonStyles.headerView}>
        <HeaderComponent
          isBackBtnEnable={true}
          isSettingsEnable={false}
          isChatEnable={false}
          isTImerEnable={false}
          isTitleHeaderEnable={true}
          title={'GRN Checking - RM'}
          backBtnAction={props.backBtnAction}
        />
      </View>

      <ScrollView
        style={styles.scroll}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
        <View style={styles.sectionContainer}>
          <TouchableOpacity style={[styles.sectionHeaderBar, {backgroundColor: colors.color2}]} onPress={() => { animateNext(); set_vendorOpen(o => !o); }}>
            <Text style={styles.sectionHeaderText}>Vendor Details</Text>
            <Text style={styles.sectionCaret}>{vendorOpen ? '▼' : '▶'}</Text>
          </TouchableOpacity>
          {vendorOpen ? (
            <View style={styles.sectionBody}>
              <Text style={styles.entityName}>{fmt(props.vendorDetails?.vendorName)}</Text>
              <Text style={styles.entitySub}>{fmt(props.vendorDetails?.vendorAddress)}</Text>
              <Text style={styles.entitySub}>{fmt(props.vendorDetails?.vendorMobile)}</Text>
            </View>
          ) : null}
        </View>

        <View style={styles.sectionContainer}>
          <TouchableOpacity style={[styles.sectionHeaderBar, {backgroundColor: colors.color2}]} onPress={() => { animateNext(); set_poDetailsOpen(o => !o); }}>
            <Text style={styles.sectionHeaderText}>PO Details</Text>
            <Text style={styles.sectionCaret}>{poDetailsOpen ? '▼' : '▶'}</Text>
          </TouchableOpacity>
          {poDetailsOpen ? (
            <View style={styles.sectionBody}>
              <Text style={styles.fieldLabel}>PO No</Text>
              <Text style={styles.fieldValue}>{fmt(props.header?.poNumberWithSymbol)}</Text>

              <Text style={styles.fieldLabel}>Checking Date</Text>
              <TouchableOpacity onPress={() => set_isDatePickerVisible(true)} style={styles.dateFieldBox}>
                <Text style={styles.dateFieldText}>{fmt(checkingDate)}</Text>
                <Image
                  source={require('./../../../../assets/images/png/calendar11.png')}
                  style={styles.dateFieldIcon}
                />
              </TouchableOpacity>
              <DateTimePickerModal
                isVisible={isDatePickerVisible}
                mode="date"
                onConfirm={date => {
                  const iso = date.toISOString().slice(0, 10);
                  set_checkingDate(iso);
                  set_isDatePickerVisible(false);
                  props.saveHeaderMeta(remarks, iso);
                }}
                onCancel={() => set_isDatePickerVisible(false)}
              />

              <Text style={styles.fieldLabel}>Remarks</Text>
              <TextInput
                style={styles.remarksInput}
                multiline
                value={remarks}
                onChangeText={set_remarks}
                onBlur={() => props.saveHeaderMeta(remarks, checkingDate)}
              />

              <Text style={styles.fieldLabel}>GRN No</Text>
              <View style={styles.grnNoRow}>
                {(props.grnNumbers || []).length === 0 ? (
                  <Text style={styles.fieldValue}>-</Text>
                ) : (
                  props.grnNumbers.map(grnNo => (
                    <TouchableOpacity key={grnNo} onPress={() => props.downloadGrnPdf(grnNo)}>
                      <Text style={styles.grnLinkText}>{grnNo}</Text>
                    </TouchableOpacity>
                  ))
                )}
              </View>
            </View>
          ) : null}
        </View>

        <View style={styles.headerCard}>
          <AiUploadButton
            label="AI Doc Upload"
            job={props.rmUploadJob}
            extraFields={{headerId: props.header?.id}}
            style={styles.uploadBtn}
          />
        </View>

        {(props.rmItems || []).map(item => (
          <RmRow
            key={item.poLineitemId}
            item={item}
            onUpdateField={(field, value) => props.updateItemField(item.poLineitemId, field, value)}
            onSaveDraft={props.saveDraft}
          />
        ))}

        <View style={{height: 90}} />
      </ScrollView>

      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.bottomBtn} onPress={props.backBtnAction}>
          <Text style={styles.buttonText}>Back</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.bottomBtn} onPress={props.saveAllDrafts}>
          <Text style={styles.buttonText}>Save as Draft</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.bottomBtn} onPress={props.submitAll}>
          <Text style={styles.buttonText}>Submit</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.bottomBtn, styles.approveBtn]} onPress={props.approveAll}>
          <Text style={styles.buttonText}>Approve Checking</Text>
        </TouchableOpacity>
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
            popUpRightBtnAction={props.popOkBtnAction}
            popUpLeftBtnAction={() => {}}
          />
        </View>
      ) : null}

      {props.MainLoading === true ? (
        <LoaderComponent isLoader={true} loaderText={Constant.LOADER_MESSAGE} isButtonEnable={false} />
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  // width: '100%' is required, not decorative -- see the identical comment
  // in GrnCheckingFabricUI.js's own `scroll` style for why (its outer
  // wrapper's alignItems: 'center' otherwise shrink-wraps this ScrollView
  // to whatever record's content happens to be narrowest).
  scroll: {flex: 1, width: '100%', paddingHorizontal: 6},
  headerCard: {backgroundColor: '#fff', borderRadius: 8, padding: 12, marginTop: 10, elevation: 2},
  sectionContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    overflow: 'hidden',
    elevation: 2,
  },
  sectionHeaderBar: {
    backgroundColor: '#2979ff',
    paddingVertical: 8,
    paddingHorizontal: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionHeaderText: {color: '#fff', fontSize: 13, fontWeight: '700'},
  sectionCaret: {color: '#fff', fontSize: 11},
  sectionBody: {padding: 12},
  entityName: {fontSize: 16, fontWeight: '700', color: '#000', textTransform: 'uppercase'},
  entitySub: {fontSize: 12, color: '#666'},
  uploadBtn: {marginTop: 10, alignSelf: 'flex-start'},
  fieldLabel: {fontSize: 11, color: '#888', marginTop: 10},
  fieldValue: {fontSize: 14, color: '#000'},
  dateFieldBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#D1D1D1',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: '#fff',
  },
  dateFieldText: {fontSize: 14, color: '#000'},
  dateFieldIcon: {width: 20, height: 20, resizeMode: 'contain'},
  remarksInput: {
    borderWidth: 1,
    borderColor: '#D1D1D1',
    borderRadius: 6,
    padding: 8,
    minHeight: 50,
    textAlignVertical: 'top',
    color: '#000',
  },
  grnNoRow: {flexDirection: 'row', flexWrap: 'wrap'},
  grnLinkText: {color: '#2979ff', marginRight: 10, textDecorationLine: 'underline'},

  row: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  rowHeader: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start'},
  rowTitleCol: {flex: 1, marginRight: 8},
  rowTitle: {fontSize: 14, fontWeight: '700', color: '#000'},
  rowCode: {fontSize: 11, color: '#888', marginTop: 2},
  statusPill: {borderRadius: 999, paddingHorizontal: 8, paddingVertical: 3, alignSelf: 'flex-start'},
  statusPillText: {fontSize: 10.5, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.3},
  rowDivider: {borderTopWidth: 1, borderTopColor: '#E5E7EB', borderStyle: 'dashed', marginVertical: 10},
  fieldsBox: {backgroundColor: '#F7F9FC', borderRadius: 8, padding: 10},
  fieldsRow: {flexDirection: 'row', marginBottom: 10},
  fieldsRowLast: {marginBottom: 0},
  field: {flex: 1, paddingRight: 8},
  rmFieldLabel: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#6b7280',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
    marginBottom: 3,
  },
  rmFieldValue: {fontSize: 14, fontWeight: '700', color: '#000', fontVariant: ['tabular-nums']},
  diffChip: {borderRadius: 5, paddingHorizontal: 6, paddingVertical: 3, alignSelf: 'flex-start'},
  diffChipOk: {backgroundColor: 'rgba(46,125,50,0.08)'},
  diffChipBad: {backgroundColor: 'rgba(198,40,40,0.08)'},
  diffChipText: {fontSize: 13, fontWeight: '700', fontVariant: ['tabular-nums']},
  diffChipTextOk: {color: '#2e7d32'},
  diffChipTextBad: {color: '#c62828'},
  inputsRow: {flexDirection: 'row', alignItems: 'center', marginTop: 10},
  inputCol: {flex: 1, marginRight: 8},
  inputLabel: {fontSize: 11, color: '#888', marginBottom: 3},
  input: {
    borderWidth: 1,
    borderColor: '#D1D1D1',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 6,
    fontSize: 13,
    color: '#000',
    backgroundColor: '#fff',
  },
  inputDisabled: {backgroundColor: '#F0F0F0', color: '#999'},
  buttonText: {color: '#fff', fontSize: 12, fontWeight: '600', textAlign: 'center'},
  grnLink: {color: '#2979ff', fontSize: 12, marginTop: 6},

  bottomBar: {flexDirection: 'row', padding: 10, borderTopWidth: 1, borderTopColor: '#E0E0E0', backgroundColor: '#fff'},
  bottomBtn: {
    flex: 1,
    backgroundColor: '#455a64',
    borderRadius: 6,
    paddingVertical: 10,
    paddingHorizontal: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 3,
  },
  approveBtn: {backgroundColor: '#2e7d32'},
});

export default GrnCheckingRmUI;
