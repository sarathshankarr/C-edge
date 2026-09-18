import React, {useState, useContext} from 'react';
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
} from 'react-native';
import * as Constant from '../../../utils/constants/constant';
import CommonStyles from '../../../utils/commonStyles/commonStyles';
import HeaderComponent from '../../../utils/commonComponents/headerComponent';
import LoaderComponent from '../../../utils/commonComponents/loaderComponent';
import AlertComponent from '../../../utils/commonComponents/alertComponent';
import AiUploadButton from '../AiUpload/AiUploadButton';
import {ColorContext} from '../../colorTheme/colorTheme';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabled) {
  UIManager.setLayoutAnimationEnabled(true);
}

const animateNext = () => LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

const fmt = v => (v === null || v === undefined || v === '' ? '-' : String(v));

// A row is locked (shown as NOT RECEIVED) whenever totalReceivedQty <= 0,
// regardless of its real status -- there's nothing real to check against
// yet (business-rules-and-flows.md's "third quasi-state" for RM).
const RmRow = ({item, onUpdateField, onSaveDraft, onSubmit}) => {
  const notReceived = !(item.totalReceivedQty > 0);
  const locked = notReceived || item.status !== 'DRAFT';

  return (
    <View style={styles.row}>
      <View style={styles.rowHeader}>
        <Text style={styles.rowTitle}>{item.itemDescription || `Line ${item.poLineitemId}`}</Text>
        <Text style={styles.rowStatus}>{notReceived ? 'NOT RECEIVED' : item.status}</Text>
      </View>
      <View style={styles.rowFieldsLine}>
        <Text style={styles.fieldText}>UOM: {fmt(item.uom)}</Text>
        <Text style={styles.fieldText}>Order: {fmt(item.orderQty)}</Text>
        <Text style={styles.fieldText}>Received: {fmt(item.totalReceivedQty)}</Text>
        <Text style={styles.fieldText}>Already Checked: {fmt(item.alreadyCheckedQty)}</Text>
      </View>
      <View style={styles.inputsRow}>
        <TextInput
          style={[styles.input, locked && styles.inputDisabled]}
          editable={!locked}
          keyboardType="numeric"
          placeholder="Checked Qty"
          placeholderTextColor="#999"
          value={item.checkedQty === null || item.checkedQty === undefined ? '' : String(item.checkedQty)}
          onChangeText={v => onUpdateField('checkedQty', v === '' ? null : Number(v))}
          onBlur={() => !locked && onSaveDraft(item)}
        />
        <TextInput
          style={[styles.input, locked && styles.inputDisabled]}
          editable={!locked}
          keyboardType="numeric"
          placeholder="Damage Qty"
          placeholderTextColor="#999"
          value={item.damageQty === null || item.damageQty === undefined ? '' : String(item.damageQty)}
          onChangeText={v => onUpdateField('damageQty', v === '' ? null : Number(v))}
          onBlur={() => !locked && onSaveDraft(item)}
        />
        <Text style={styles.diffText}>Diff: {fmt(item.differenceQty)}</Text>
      </View>
      {!locked ? (
        <TouchableOpacity style={styles.submitBtn} onPress={() => onSubmit(item)}>
          <Text style={styles.buttonText}>Submit</Text>
        </TouchableOpacity>
      ) : null}
      {item.status === 'APPROVED' && item.grnNo ? <Text style={styles.grnLink}>GRN No: {item.grnNo}</Text> : null}
    </View>
  );
};

const GrnCheckingRmUI = props => {
  const {colors} = useContext(ColorContext);
  const [refreshing, set_refreshing] = useState(false);
  const [vendorOpen, set_vendorOpen] = useState(true);

  const onRefresh = async () => {
    set_refreshing(true);
    await props.onRefresh();
    set_refreshing(false);
  };

  return (
    <View style={CommonStyles.mainComponentViewStyle}>
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

        <View style={styles.headerCard}>
          <AiUploadButton
            label="AI Doc Upload (RM Invoice)"
            job={props.rmUploadJob}
            extraFields={{headerId: props.header?.id}}
            style={styles.uploadBtn}
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

        {(props.rmItems || []).map(item => (
          <RmRow
            key={item.poLineitemId}
            item={item}
            onUpdateField={(field, value) => props.updateItemField(item.poLineitemId, field, value)}
            onSaveDraft={props.saveDraft}
            onSubmit={props.submitOne}
          />
        ))}

        <View style={{height: 90}} />
      </ScrollView>

      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.bottomBtn} onPress={props.submitAll}>
          <Text style={styles.buttonText}>Submit All</Text>
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
  scroll: {flex: 1, paddingHorizontal: 12},
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
  grnNoRow: {flexDirection: 'row', flexWrap: 'wrap'},
  grnLinkText: {color: '#2979ff', marginRight: 10, textDecorationLine: 'underline'},

  row: {backgroundColor: '#fff', borderRadius: 8, padding: 10, marginTop: 10, elevation: 1},
  rowHeader: {flexDirection: 'row', justifyContent: 'space-between'},
  rowTitle: {fontSize: 13, fontWeight: '700', flex: 1},
  rowStatus: {fontSize: 11, color: '#2979ff', fontWeight: '600'},
  rowFieldsLine: {flexDirection: 'row', flexWrap: 'wrap', marginTop: 4},
  fieldText: {fontSize: 11, color: '#555', marginRight: 12, marginBottom: 2},
  inputsRow: {flexDirection: 'row', alignItems: 'center', marginTop: 6},
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#D1D1D1',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 6,
    fontSize: 12,
    color: '#000',
  },
  inputDisabled: {backgroundColor: '#F0F0F0', color: '#999'},
  diffText: {fontSize: 11, color: '#333', width: 70},
  submitBtn: {
    marginTop: 8,
    backgroundColor: '#2979ff',
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 10,
    alignSelf: 'flex-start',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {color: '#fff', fontSize: 12, fontWeight: '600', textAlign: 'center'},
  grnLink: {color: '#2979ff', fontSize: 12, marginTop: 6},

  bottomBar: {flexDirection: 'row', padding: 10, borderTopWidth: 1, borderTopColor: '#E0E0E0', backgroundColor: '#fff'},
  bottomBtn: {flex: 1, backgroundColor: '#455a64', borderRadius: 6, paddingVertical: 12, alignItems: 'center', marginHorizontal: 4},
  approveBtn: {backgroundColor: '#2e7d32'},
});

export default GrnCheckingRmUI;
