import React, {useState, useCallback, useRef, useEffect} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  FlatList,
  Image,
  TextInput,
  RefreshControl,
  ActivityIndicator,
  Platform,
} from 'react-native';
import * as Constant from '../../../utils/constants/constant';
import CommonStyles from '../../../utils/commonStyles/commonStyles';
import HeaderComponent from '../../../utils/commonComponents/headerComponent';
import LoaderComponent from '../../../utils/commonComponents/loaderComponent';
import AlertComponent from '../../../utils/commonComponents/alertComponent';
import AddNewItem from '../../../utils/commonComponents/AddNewItem';
import Svg, {Path, Circle} from 'react-native-svg';

let searchImg = require('./../../../../assets/images/png/searchIcon.png');
let editImg = require('./../../../../assets/images/png/edit.png');
let deleteImg = require('./../../../../assets/images/png/delete.webp');
let pdfImg = require('./../../../../assets/images/png/pdf2.png');

const EyeIcon = () => (
  <Svg width={17} height={17} viewBox="0 0 24 24" fill="none">
    <Path
      d="M1 12C1 12 5 4 12 4C19 4 23 12 23 12C23 12 19 20 12 20C5 20 1 12 1 12Z"
      stroke="#ffffff"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Circle cx={12} cy={12} r={3} stroke="#ffffff" strokeWidth={2} />
  </Svg>
);

// Builds the visible action buttons for a row (Edit/Delete are conditional)
// and lays them out: 4 buttons -> 2x2 grid; 3 buttons -> 2 then 1 (centered);
// 2 buttons -> one per row, stacked top/bottom (centered), not side by side.
const buildActionRows = (item, {editRow, viewRow, downloadPDF, deleteRow}) => {
  const buttons = [];

  if (Number(item.isEdit) === 0) {
    buttons.push(
      <TouchableOpacity
        key="edit"
        activeOpacity={0.7}
        style={[styles.button, {backgroundColor: '#2979ff'}]}
        onPress={() => editRow(item)}>
        <Image source={editImg} style={{width: 16, height: 16, tintColor: '#fff'}} />
      </TouchableOpacity>,
    );
  }

  buttons.push(
    <TouchableOpacity
      key="view"
      activeOpacity={0.7}
      style={[styles.button, {backgroundColor: '#4caf50'}]}
      onPress={() => viewRow(item)}>
      <EyeIcon />
    </TouchableOpacity>,
  );

  buttons.push(
    <TouchableOpacity key="pdf" onPress={() => downloadPDF(item)} style={styles.iconOnlyButton}>
      <Image source={pdfImg} style={{width: 30, height: 30, resizeMode: 'contain'}} />
    </TouchableOpacity>,
  );

  // No permission system for this module yet (mobile API never returns
  // menuPrivileges) — delete access is assumed for everyone for now; the
  // real client-side guard here is fabricflowstatus, matching the web's
  // client-side-only check.
  if (Number(item.fabricflowstatus) === 0) {
    buttons.push(
      <TouchableOpacity key="delete" onPress={() => deleteRow(item)} style={styles.iconOnlyButton}>
        <Image
          source={deleteImg}
          style={{width: 22, height: 22, resizeMode: 'contain', tintColor: '#e53935'}}
        />
      </TouchableOpacity>,
    );
  }

  // With exactly 2 buttons, stack them one per row (top/bottom) instead of
  // side by side; otherwise chunk 2-per-row (4 -> 2x2 grid, 3 -> 2 then 1).
  const perRow = buttons.length === 2 ? 1 : 2;
  const rows = [];
  for (let i = 0; i < buttons.length; i += perRow) {
    rows.push(buttons.slice(i, i + perRow));
  }

  return rows.map(rowButtons => ({
    buttons: rowButtons,
    // A lone trailing button, or every row when there are only 2 buttons
    // total, gets centered instead of spread across the column.
    centered: rowButtons.length === 1 || buttons.length === 2,
  }));
};

const BatchCreationListUI = ({route, ...props}) => {
  const [filterArray, set_filterArray] = useState(undefined);
  const [recName, set_recName] = useState('');
  const [refreshing, set_refreshing] = useState(false);
  const [ItemsArray, set_ItemsArray] = useState([]);

  const debounceTimer = useRef(null);

  useEffect(() => {
    if (props.itemsArray) {
      set_filterArray(props.itemsArray);
      set_ItemsArray(props.itemsArray);
    }
  }, [props.itemsArray]);

  useEffect(() => {
    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, []);

  const backBtnAction = useCallback(() => {
    props.backBtnAction();
  }, [props.backBtnAction]);

  const popOkBtnAction = useCallback(() => {
    props.popOkBtnAction();
  }, [props.popOkBtnAction]);

  // Debounced client-side search — filters the already-loaded list 300ms
  // after typing stops, matching the pattern used by every other list page.
  const filterPets = useCallback(
    name => {
      set_recName(name);
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
      debounceTimer.current = setTimeout(() => {
        const searchTerm = name.toString().toLowerCase().trim();
        if (searchTerm.length === 0) {
          set_filterArray(ItemsArray);
          return;
        }
        const styleArray = ItemsArray.filter(
          item =>
            item.batchNames?.toString().toLowerCase().includes(searchTerm) ||
            item.lotNos?.toString().toLowerCase().includes(searchTerm) ||
            item.batchCreationDate?.toString().toLowerCase().includes(searchTerm) ||
            item.totalIssued?.toString().toLowerCase().includes(searchTerm),
        );
        set_filterArray(styleArray);
      }, 300);
    },
    [ItemsArray],
  );

  const onRefresh = useCallback(() => {
    set_refreshing(true);
    set_recName('');
    props.fetchMore();
    set_refreshing(false);
  }, [props.fetchMore]);

  const editRow = useCallback(
    item => {
      props.editRow(item);
    },
    [props.editRow],
  );

  const viewRow = useCallback(
    item => {
      props.viewRow(item);
    },
    [props.viewRow],
  );

  const deleteRow = useCallback(
    item => {
      props.deleteRow(item);
    },
    [props.deleteRow],
  );

  const downloadPDF = useCallback(
    item => {
      props.downloadBatchCreationPDF(item);
    },
    [props.downloadBatchCreationPDF],
  );

  const renderItem = useCallback(
    ({item}) => (
      <View style={CommonStyles.cellBackViewStyle}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <Text style={[CommonStyles.tylesTextStyle, styles.colBatchNo, {textAlign: 'left'}]}>
            {item.batchNames}
          </Text>
          <Text style={[CommonStyles.tylesTextStyle, styles.colLotNo, {textAlign: 'center'}]}>
            {item.lotNos || '-'}
          </Text>
          <Text style={[CommonStyles.tylesTextStyle, styles.colTotalIssued, {textAlign: 'center'}]}>
            {item.totalIssued ?? '-'}
          </Text>
          <Text style={[CommonStyles.tylesTextStyle, styles.colDate, {textAlign: 'center'}]}>
            {item.batchCreationDate}
          </Text>
          <View style={styles.colAction}>
            {buildActionRows(item, {editRow, viewRow, downloadPDF, deleteRow}).map((row, rowIndex) => (
              <View
                key={rowIndex}
                style={[styles.actionRow, row.centered && styles.actionRowCenter]}>
                {row.buttons}
              </View>
            ))}
          </View>
        </View>
      </View>
    ),
    [editRow, viewRow, deleteRow, downloadPDF],
  );

  // Each aaData row is a batch-detail row, not a batch — `id` is the parent
  // batchId and repeats across a batch's multiple detail/lot rows, so the
  // only per-row-unique field is batchDetailsId (see report §3 field mapping).
  const keyExtractor = useCallback(
    (item, index) => item.batchDetailsId?.toString() ?? `${item.id}_${index}`,
    [],
  );

  const listFooter = useCallback(
    () => (props.isLoading ? <ActivityIndicator size="large" /> : null),
    [props.isLoading],
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
          title={'Batch Creation List'}
          backBtnAction={backBtnAction}
        />
      </View>

      <View style={CommonStyles.headerStyle}>
        {filterArray ? (
          <View
            style={{
              flexDirection: 'row',
              width: '100%',
              marginBottom: 10,
              alignItems: 'center',
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                flex: 1,
                borderWidth: 1,
                borderColor: '#D1D1D1',
                borderRadius: 20,
                backgroundColor: '#F9F9F9',
                paddingHorizontal: 15,
                shadowColor: '#000',
                shadowOffset: {width: 0, height: 2},
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 3,
              }}>
              <Image
                source={searchImg}
                style={{height: 18, width: 18, tintColor: '#7F7F81', marginRight: 10}}
              />
              <TextInput
                style={[{flex: 1, color: '#000'}, Platform.OS === 'ios' && {paddingVertical: 12}]}
                underlineColorAndroid="transparent"
                placeholder="Search"
                placeholderTextColor="#A0A0A0"
                autoCapitalize="none"
                value={recName}
                onChangeText={filterPets}
              />
            </View>
          </View>
        ) : null}

        {filterArray && filterArray.length > 0 ? (
          <View style={[CommonStyles.listCommonHeader, styles.headerRow]}>
            <Text style={[CommonStyles.tylesHeaderTextStyle, styles.colBatchNo, {textAlign: 'left'}]}>
              {'Batch No'}
            </Text>
            <Text
              style={[CommonStyles.tylesHeaderTextStyle, styles.colLotNo, {textAlign: 'center'}]}
              numberOfLines={2}>
              {'Lot\nNo'}
            </Text>
            <Text style={[CommonStyles.tylesHeaderTextStyle, styles.colTotalIssued, {textAlign: 'center'}]}>
              {'Total Issued'}
            </Text>
            <Text style={[CommonStyles.tylesHeaderTextStyle, styles.colDate, {textAlign: 'center'}]}>
              {'Date'}
            </Text>
            <Text style={[CommonStyles.tylesHeaderTextStyle, styles.colActionLabel, {textAlign: 'center'}]}>
              {'Action'}
            </Text>
          </View>
        ) : (
          <View style={CommonStyles.noRecordsFoundStyle}>
            {!props.MainLoading ? (
              <Text style={[CommonStyles.tylesHeaderTextStyle, {fontSize: 18}]}>
                {Constant.noRecFound}
              </Text>
            ) : null}
          </View>
        )}

        <View style={CommonStyles.listStyle}>
          <FlatList
            data={filterArray}
            renderItem={renderItem}
            keyExtractor={keyExtractor}
            showsVerticalScrollIndicator={false}
            ListFooterComponent={listFooter}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          />
        </View>
      </View>

      <AddNewItem navItem={'CreateBatchCreation'} />

      {props.isPopUp ? (
        <View style={CommonStyles.customPopUpStyle}>
          <AlertComponent
            header={props.popUpAlert}
            message={props.popUpMessage}
            isLeftBtnEnable={props.isPopupLeft}
            isRightBtnEnable={true}
            leftBtnTilte={'NO'}
            rightBtnTilte={props.popUpRBtnTitle}
            popUpRightBtnAction={popOkBtnAction}
            popUpLeftBtnAction={() => {}}
          />
        </View>
      ) : null}

      {props.MainLoading === true ? (
        <LoaderComponent
          isLoader={true}
          loaderText={Constant.LOADER_MESSAGE}
          isButtonEnable={false}
        />
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  // Header row uses the same horizontal padding as each data row
  // (CommonStyles.cellBackViewStyle) so the Action column lines up exactly.
  headerRow: {
    paddingHorizontal: 15,
    marginBottom: 8,
  },
  colBatchNo: {
    flex: 1.1,
    marginHorizontal: 6,
  },
  colLotNo: {
    flex: 0.7,
    marginHorizontal: 6,
  },
  colTotalIssued: {
    flex: 0.9,
    marginHorizontal: 6,
  },
  colDate: {
    flex: 0.9,
    marginHorizontal: 6,
  },
  colActionLabel: {
    width: 90,
  },
  colAction: {
    width: 90,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionRowCenter: {
    justifyContent: 'center',
  },
  button: {
    width: 32,
    height: 32,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 6,
  },
  // PDF/Delete are icon-only — no circular background/shadow like Edit/View.
  iconOnlyButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    marginHorizontal: 4,
  },
});

export default BatchCreationListUI;
